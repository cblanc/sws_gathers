cd /app

if [ -f "/home/web/tmp/.updatePublic" ]; then
  /bin/cp -rf /home/web/tmp/public /app
  rm -rf /home/web/tmp/public
  rm -f /home/web/tmp/.updatePublic
fi

node index.js
