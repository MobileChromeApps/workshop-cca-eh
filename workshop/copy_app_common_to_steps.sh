#!/bin/bash

set -eu
cd "$(dirname "$0")"
cd ..

./app/ui/prepare.sh

rm -rf workshop/step*/common
for i in workshop/step*; do
  cp -r app/ui $i/ui
done

# success!
echo "Ok!"
