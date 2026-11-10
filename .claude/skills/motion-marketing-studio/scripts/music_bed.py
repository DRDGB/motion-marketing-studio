#!/usr/bin/env python3
"""Original music bed composed in code (own work, no third-party audio): timeline.json -> wav.
Usage: python3 -I music_bed.py <timeline.json> <out.wav>
timeline["music"]: bpm, transpose (semitones, default 0), mech [a,b], drop [a,b] (drop end = Switch downbeat), resolve [a,b], loop [a,b], end.

A minor (shift with transpose), 96 BPM default, bar grid aligned so the Switch (timeline beat split[0]) lands on a downbeat.
Arrangement follows the story: heartbeat hook -> groove in the mechanism -> tension drop ->
impact + full groove on the Switch -> resolve -> sparse loop -> end.
"""
import json
import wave
from pathlib import Path

import numpy as np

import sys
if len(sys.argv) < 3:
    sys.exit(__doc__)
TL = json.loads(Path(sys.argv[1]).read_text())
OUT = Path(sys.argv[2])
MU = TL["music"]
OUT.parent.mkdir(parents=True, exist_ok=True)

SR = 48000
DUR = TL["total"]
N = int(SR * DUR)
BPM = MU.get("bpm", 96)
BEAT = 60 / BPM
BAR = 4 * BEAT
SWITCH = MU["drop"][1]
OFFSET = SWITCH % BAR  # bar starts at OFFSET + k*BAR
L = np.zeros(N)
R = np.zeros(N)
rng = np.random.default_rng(7)  # fixed seed: deterministic output

TRANSPOSE = MU.get("transpose", 0)

def midi(n):
    return 440.0 * 2 ** ((n + TRANSPOSE - 69) / 12)

def add(sig, t0, gain=1.0, pan=0.0):
    i0 = int(t0 * SR)
    if i0 >= N or i0 + len(sig) <= 0:
        return
    s = sig[: max(0, N - i0)]
    gl, gr = gain * np.sqrt((1 - pan) / 2), gain * np.sqrt((1 + pan) / 2)
    L[i0:i0 + len(s)] += s * gl
    R[i0:i0 + len(s)] += s * gr

def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)

def kick():
    t = np.arange(int(0.45 * SR)) / SR
    f = 45 + 75 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) + 0.08 * rng.standard_normal(len(t)) * np.exp(-t * 90)

def hat(open_=False):
    n = int((0.12 if open_ else 0.04) * SR)
    x = rng.standard_normal(n)
    x = np.diff(np.concatenate([[0], x]))  # crude high-pass
    return x * env(n, 0.001, 0.05 if open_ else 0.012) * 0.35

def pluck(f, dur=0.45):
    n = int(dur * SR)
    t = np.arange(n) / SR
    tri = 2 / np.pi * np.arcsin(np.sin(2 * np.pi * f * t))
    return (0.7 * tri + 0.3 * np.sin(4 * np.pi * f * t)) * env(n, 0.003, 0.18)

def bass(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.6 for k in range(1, 6))
    return s * np.minimum(1, t / 0.01) * np.exp(-t / (dur * 0.9)) * 0.55

def pad(freqs, dur, attack=0.8):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.2 * t)) + 0.6 * np.sin(2 * np.pi * f * 1.004 * t) for f in freqs)
    a = np.minimum(1, t / attack) * np.minimum(1, (dur - t) / 0.6)
    return s * a / (len(freqs) * 1.6)

# Am – F – C – G (root midi, chord tones)
PROG = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])]

sections = [  # (start, end, kick, hats, bass, arp, pad) driven by timeline["music"]
    (0.0, MU["mech"][0], "heart", False, True, "soft", False),
    (MU["mech"][0], MU["drop"][0], "four", True, True, "full", False),
    (MU["drop"][0], SWITCH, None, False, False, None, "drone"),
    (SWITCH, MU["resolve"][1], "four", True, True, "full", True),
    (MU["loop"][0], MU["end"], "heart", False, False, "soft", False),
    (MU["end"], DUR, None, False, False, None, "end"),
]

def section_at(t):
    for s in sections:
        if s[0] <= t < s[1]:
            return s
    return None

# rhythm grid in 16ths
step = BEAT / 4
t = OFFSET - BAR * 2
while t < DUR:
    if t >= 0:
        sec = section_at(t)
        if sec:
            _, _, k, h, bs, arp, _ = sec
            idx16 = int(round((t - OFFSET) / step)) % 16
            bar_i = int(np.floor((t - OFFSET) / BAR)) % 4
            root, tones = PROG[bar_i]
            if k == "four" and idx16 % 4 == 0:
                add(kick(), t, 0.55)
            if k == "heart" and idx16 in (0, 3):  # lub-dub heartbeat on beat 1
                add(kick(), t, 0.32 if idx16 == 0 else 0.2)
            if h and idx16 % 2 == 1:
                add(hat(open_=(idx16 % 8 == 7)), t, 0.5, pan=0.3)
            if bs and idx16 in (0, 6, 10):
                add(bass(midi(root), BEAT * (1.4 if idx16 == 0 else 0.9)), t, 0.45)
            if arp:
                pattern = [0, 1, 2, 1, 2, 0, 1, 2]
                if idx16 % 2 == 0:
                    n = tones[pattern[(idx16 // 2) % 8]] + (12 if idx16 in (4, 12) else 0)
                    g = 0.16 if arp == "soft" else 0.24
                    p = pluck(midi(n))
                    add(p, t, g, pan=-0.25)
                    add(p * 0.35, t + BEAT * 0.75, g, pan=0.35)  # dotted-8th echo
    t += step

# pads per bar where enabled
t = OFFSET - BAR
while t < DUR:
    sec = section_at(max(t, 0))
    if sec and sec[6] is True:
        _, tones = PROG[int(np.floor((t - OFFSET) / BAR)) % 4]
        add(pad([midi(n - 12) for n in tones] + [midi(tones[0])], BAR + 0.4), max(t, 0), 0.22)
    t += BAR

# tension drone + riser before the Switch
d0 = MU["drop"][0]
dn = int((SWITCH - d0) * SR)
tt = np.arange(dn) / SR
drone = (np.sin(2 * np.pi * 55 * tt) + 0.5 * np.sin(2 * np.pi * 82.4 * tt)) * np.minimum(1, tt / 0.5) * 0.3
noise = rng.standard_normal(dn)
noise = np.convolve(noise, np.ones(8) / 8, mode="same")
riser = noise * (tt / tt[-1]) ** 2.2 * 0.35
add(drone + riser, d0, 0.6)
# impact on the Switch
it = np.arange(int(1.8 * SR)) / SR
impact = np.sin(2 * np.pi * (40 + 40 * np.exp(-it * 10)) * it) * np.exp(-it * 2.2) + 0.25 * rng.standard_normal(len(it)) * np.exp(-it * 12)
add(impact, SWITCH, 0.7)
# end: sustained resolve chord
add(pad([midi(45), midi(52), midi(57), midi(60), midi(64)], DUR - MU["end"], attack=0.3), MU["end"], 0.3)

# master: gentle saturation + normalise to -3 dBFS peak
mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 1.2)
mix *= 10 ** (-3 / 20) / max(1e-9, np.abs(mix).max())
fade = np.minimum(1, (DUR - np.arange(N) / SR) / 2.5)[:, None]
mix *= fade
pcm = (mix * 32767).astype("<i2")
with wave.open(str(OUT), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("Wrote", OUT, f"({DUR}s, {BPM} BPM, bar offset {OFFSET:.3f}s, switch on downbeat at {SWITCH}s)")
