#!/bin/bash

cd /app

if [ -f "/home/web/tmp/.updatePublic" ]; then
  cp -r /home/web/tmp/public /app/public
  rm -rf /home/web/tmp/public
  rm /home/web/tmp/.updatePublic
fi

node index.js
