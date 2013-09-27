postingbox
==========

 A simple script which collects https posts and writes out to the brower through websockets using socket.io.  A unique ref must be supplied using the "ref" querystring parameter.  The ref value provided in the browser must match that being used in the post.  A GUID might be a good idea for this.

Example:
========
1.  Start the server

node server.js

2. Browse to the client, using a GUID to isolate your notifications

http://localhost:8000/?ref=17737123673c4758a5bb2afaaf238427

3. Test out the notifications by posting something, e.g. using curl

curl -X POST -d 'BANG' http://localhost:8000?ref=17737123673c4758a5bb2afaaf238427

4. See the browser output:

"1  BANG"

Thats it!

Moving Forward
==============

Supporting different formats for different content types
