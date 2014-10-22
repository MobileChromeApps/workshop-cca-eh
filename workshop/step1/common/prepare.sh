#!/bin/bash

set -eu
cd "$(dirname "$0")"

RUN_BOWER=0
while [[ "$#" != 0 ]]; do
  case "$1" in
    --bower)
      RUN_BOWER=1 ;;
    *) echo "unknown option: $1"; exit 1 ;;
  esac
  shift
done

# updates (mostly) polymer components
if [ ! -d "bower_components" ] || [ "${RUN_BOWER}" == "1" ]; then
  bower update
elif [ "${RUN_BOWER}" == "0" ]; then
  echo "bower_components exists, ignoring (use --bower to force)"
fi

# merge deps html/js/* together
vulcanize --csp --strip -o vulcanized.html deps.html

rm -rf ../workshop/step*/common
for i in ../workshop/step*; do
  cp -r ../common $i/common
done

rm -rf ../app/common
cp -r ../common ../app

# success!
echo "Ok!"

