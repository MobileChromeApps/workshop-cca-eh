#!/bin/bash

set -eu
cd "$(dirname "$0")"
cd ..

./app/ui/prepare.sh

rm -rf workshop/step*/common
for i in workshop/step*; do
  echo $i
  # cp -R with the trailing / copies contents into ui, not ui -> ui/ui.
  cp -R app/ui/ $i/ui
done

# success!
echo "Ok!"
