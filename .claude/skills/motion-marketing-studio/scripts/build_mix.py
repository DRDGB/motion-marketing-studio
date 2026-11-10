#!/usr/bin/env python3
"""Generic episode soundtrack: VO clips from the timeline + synthesized SFX library + music bed ducked under VO.
Usage (from the workspace root): python3 -I build_mix.py <timeline.json> <music.wav> <out.wav>
SFX and music are synthesized (own work); the VO is the client's licensed voice file. voSource is relative to the workspace root."""
import json, subprocess, sys
from pathlib import Path
if len(sys.argv) < 4:
    sys.exit(__doc__)
ROOT = Path.cwd()
TL = json.loads(Path(sys.argv[1]).read_text()); MUSIC = Path(sys.argv[2]); OUT = Path(sys.argv[3])
WORK = ROOT / "renders" / TL["id"] / "audio"; WORK.mkdir(parents=True, exist_ok=True); OUT.parent.mkdir(parents=True, exist_ok=True)
TOTAL, SR = TL["total"], 48000
def ff(*a):
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", *a], capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr)
SYNTH = {
    "hit": ("aevalsrc=exprs='0.9*sin(2*PI*52*t)*exp(-3.2*t)+0.25*sin(2*PI*104*t)*exp(-6*t)+0.15*(random(0)-0.5)*exp(-60*t)':s=48000:d=1.6", ""),
    "whoosh": ("anoisesrc=color=pink:amplitude=0.6:d=0.55:r=48000", "highpass=f=400,lowpass=f=6000,afade=t=in:d=0.38:curve=exp,afade=t=out:st=0.38:d=0.17"),
    "beep": ("aevalsrc=exprs='0.5*sin(2*PI*1760*t)*(lt(t,0.07)+between(t,0.13,0.2))':s=48000:d=0.3", "afade=t=out:st=0.22:d=0.08"),
    "rustle": ("anoisesrc=color=white:amplitude=0.35:d=1.2:r=48000", "highpass=f=1800,tremolo=f=17:d=0.9,afade=t=in:d=0.2,afade=t=out:st=0.8:d=0.4"),
    "lens": ("aevalsrc=exprs='0.35*sin(2*PI*(220*t+380*t*t))*min(1,t*3)*exp(-1.1*t)+0.12*sin(2*PI*1320*t)*exp(-2.5*t)*gt(t,0.7)':s=48000:d=1.6", "lowpass=f=5000"),
    "tick": ("aevalsrc=exprs='0.7*sin(2*PI*2100*t)*exp(-70*t)+0.4*sin(2*PI*420*t)*exp(-35*t)':s=48000:d=0.25", ""),
    "unlock": ("aevalsrc=exprs='0.9*sin(2*PI*48*t)*exp(-5*t)+0.8*sin(2*PI*48*(t-0.16))*exp(-5*(t-0.16))*gt(t,0.16)+0.18*sin(2*PI*880*t)*exp(-1.8*t)*gt(t,0.16)':s=48000:d=2.2", ""),
    "clack": ("aevalsrc=exprs='0.6*sin(2*PI*1200*t)*exp(-90*t)+0.5*(random(0)-0.5)*exp(-120*t)':s=48000:d=0.2", "highpass=f=300"),
    "chime": ("aevalsrc=exprs='0.30*sin(2*PI*880*t)*exp(-1.2*t)+0.22*sin(2*PI*1108.7*t)*exp(-1.4*t)+0.18*sin(2*PI*1318.5*t)*exp(-1.6*t)+0.10*sin(2*PI*1760*t)*exp(-2.2*t)':s=48000:d=3.5", ""),
}
lib = {}
for k, (src, post) in SYNTH.items():
    p = WORK / f"sfx_{k}.wav"; ff("-f", "lavfi", "-i", src, *(["-af", post] if post else []), "-ac", "1", "-ar", str(SR), str(p)); lib[k] = p
vo_src = WORK / "vo_full.wav"; ff("-i", str(ROOT / TL["voSource"]), "-ar", str(SR), "-ac", "1", str(vo_src))
inp, flt = [], []
for i, c in enumerate(TL["clips"]):
    s, e = c["src"]; d = int(c["at"] * 1000); inp += ["-i", str(vo_src)]
    flt.append(f"[{i}:a]atrim={s}:{e},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={e - s - 0.03:.3f}:d=0.03,adelay={d}|{d}[v{i}]")
n = len(TL["clips"]); flt.append("".join(f"[v{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={TOTAL}[vo]")
vo = WORK / "vo_track.wav"; ff(*inp, "-filter_complex", ";".join(flt), "-map", "[vo]", "-t", str(TOTAL), str(vo))
vop = WORK / "vo_proc.wav"; ff("-i", str(vo), "-af", "highpass=f=70,acompressor=threshold=-24dB:ratio=3:attack=8:release=120:makeup=4,loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", str(SR), "-ac", "1", str(vop))
inp, flt = [], []
for i, ev in enumerate(TL.get("sfx", [])):
    inp += ["-i", str(lib[ev["type"]])]; d = int(ev["at"] * 1000); flt.append(f"[{i}:a]volume={ev['gain']}dB,adelay={d}|{d}[s{i}]")
m = len(TL.get("sfx", [])); flt.append("".join(f"[s{i}]" for i in range(m)) + f"amix=inputs={m}:normalize=0:duration=longest,apad=whole_dur={TOTAL}[sfx]")
sfx = WORK / "sfx_track.wav"; ff(*inp, "-filter_complex", ";".join(flt), "-map", "[sfx]", "-t", str(TOTAL), "-ar", str(SR), str(sfx))
ff("-i", str(vop), "-i", str(sfx), "-i", str(MUSIC), "-filter_complex",
   "[0:a]pan=stereo|c0=0.707*c0|c1=0.707*c0,asplit=2[v][key];[1:a]pan=stereo|c0=0.707*c0|c1=0.707*c0[s];"
   "[2:a]volume=-8dB[mu];[mu][key]sidechaincompress=threshold=0.02:ratio=5:attack=15:release=320:makeup=1[md];"
   "[v][s][md]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.84:level=disabled[m]",
   "-map", "[m]", "-t", str(TOTAL), "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", str(OUT))
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(OUT), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
print("Wrote", OUT); print("\n".join(l for l in r.stderr[r.stderr.rfind("Summary:"):].splitlines() if any(k in l for k in ("I:", "Peak:"))))
