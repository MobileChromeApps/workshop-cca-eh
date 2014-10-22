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
vulcanize --csp -o vulcanized.html deps.html

rm -rf ../workshop/step*/common
for i in ../workshop/step*; do
  echo $i
  mkdir $i/common
  cp -r *.js *.html assets $i/common
  mkdir $i/common/bower_components
  cp -r bower_components/polymer bower_components/platform $i/common/bower_components
done

# success!
echo "Ok!"

