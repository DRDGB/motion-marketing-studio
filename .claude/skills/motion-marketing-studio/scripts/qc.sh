#!/usr/bin/env bash
# Automated media QC. Does NOT replace watching the video.
# Usage: bash qc.sh path/to/video.mp4
set -uo pipefail
F="$1"; [ -f "$F" ] || { echo "no such file: $F"; exit 1; }
echo "## QC: $F  ($(date -u +%FT%TZ))"
echo "### Streams"
ffprobe -v error -show_entries stream=index,codec_type,codec_name,profile,width,height,pix_fmt,color_range,color_space,r_frame_rate,nb_frames,sample_rate,channels -show_entries format=duration,size,bit_rate -of default=nw=1 "$F"
echo "### Decode integrity"
if ffmpeg -v error -i "$F" -f null - 2>&1 | head -5 | grep -q .; then echo "FAIL: decode errors"; else echo "PASS: full decode, no errors"; fi
echo "### Black (>=0.5 s) / freeze (>=2 s) intervals. Review each by eye; low-motion minimalist scenes trigger freezedetect."
ffmpeg -hide_banner -i "$F" -vf "blackdetect=d=0.5:pix_th=0.10,freezedetect=n=0.0005:d=2" -an -f null - 2>&1 | grep -oE '(black_start|black_end|freeze_start|freeze_end|freeze_duration)[:=] ?[0-9.]+' || echo "none flagged"
if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$F" | grep -q .; then
  echo "### Loudness (EBU R128). Note the integrated LUFS and true peak; target is set by the audio spec."
  ffmpeg -hide_banner -i "$F" -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E 'I:|LRA:|Peak:'
  echo "### Silence (>=2 s at -50 dB)"
  ffmpeg -hide_banner -i "$F" -af silencedetect=n=-50dB:d=2 -f null - 2>&1 | grep -oE 'silence_(start|end): [0-9.]+' || echo "none"
else
  echo "### Audio: NO AUDIO STREAM"
fi
