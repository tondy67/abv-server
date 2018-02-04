/** 
 * Abvos server
 */
"use strict";

const ABV_URL = 'https://tondy67.github.io/abvos/node.html';

// node --inspect server.js | Open 'about:inspect' in Chrome
// export DEBUG=abv:*,info / unset DEBUG
const ts = require('abv-ts')('abv:server');

const pjson = require('./package.json');
const Aspa = require('abv-spa');
const AbvNode = require('abv-node');

const $port = 8080;
const $host = '0.0.0.0';
const $root = __dirname + '/public';

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || $port;
const ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || $host;

const aspa = new Aspa({root: $root, cache: 3});

aspa.on('/',(req, res) => {
		res.end('Aspa server: ' + req.url);
	});

aspa.tpl('/index.html',{
		title:'Abvos ' + pjson.version,
		url:ABV_URL
	});

const $ip = aspa.ips()[0];

const server = aspa.listen($port, $host, (err) => {  
		if (err) return ts.error(err);
		ts.info('Node.js: ' + process.version);
		ts.println(`Abvos node is running on http://${$ip}:${$port}`,ts.BLUE);
	});

///
let WebSocket = null;

try{
	WebSocket = require('uws');
}catch(e){
	ts.log('Fallback to ws');
	WebSocket = require('ws');
}

const node = new AbvNode(server,WebSocket);

///
/*
const ensureSecure = (req, res) => {
  if(req.get('x-forwarded-proto') === 'https')
	res.redirect('https://' + req.hostname + req.url); 
}; */
