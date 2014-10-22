#!/bin/bash
# This script copies the known good app/ui folder into each workshop step. It
# should be rerun after any updates to the common Polymer elements and assets.

set -eu
cd "$(dirname "$0")"
cd ..

./app/ui/prepare.sh

rm -rf workshop/step*/ui
rm -rf workshop/step*/assets
for i in workshop/step*; do
  echo $i
  # cp -R with the trailing / copies contents into ui, not ui -> ui/ui.
  cp -R app/ui $i/
  cp -R app/assets $i/
done

# success!
echo "Ok!"
