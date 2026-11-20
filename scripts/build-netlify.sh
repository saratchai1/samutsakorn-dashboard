#!/bin/sh
set -eu

mkdir -p dist/data
cp index.html app.js styles.css dist/
cp data/executive_water_data.js dist/data/
cp data/executive_water_update_2026_08.js dist/data/
cp data/executive_water_update_2026_11.js dist/data/

test -s dist/index.html
test -s dist/app.js
test -s dist/data/executive_water_update_2026_11.js

echo "SSK Water Dashboard static assets prepared in dist/"
