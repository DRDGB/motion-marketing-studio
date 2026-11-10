#!/usr/bin/env bash
# Render every prospect film (silent picture) to ../renders/<ID>.mp4. Usage: ./render_all.sh [ID ...]
set -e
cd "$(dirname "$0")"
IDS="${@:-SPEC-LBF SPEC-ANTIKA SPEC-MAKENA SPEC-MARIACILE SPEC-AYES SPEC-AKABASELE SPEC-MIA SPEC-CLOCHETTE SPEC-AHLAM SPEC-FIVE}"
for id in $IDS; do
  npx remotion render src/index.ts "$id" "../renders/picture/$id.mp4" --codec=h264 --crf=18 --log=error
  echo "rendered $id"
done
