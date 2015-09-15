# Reads in raw Rails 3 session store, returns user id

require 'base64'

session_store = ARGV[0]

deserialised_store = Marshal.load(Base64.decode64(session_store))

user_id = deserialised_store['user']

STDOUT.write user_id

exit 0