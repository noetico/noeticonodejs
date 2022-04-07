import http = require('http');
import path = require('path');
import url = require('url');
import fs = require('fs');

import fspromise = require('fs/promises');
import { unescape } from 'querystring';
const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};
const port = process.env.port || 1337
http.createServer(function (req, res) {
   
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);