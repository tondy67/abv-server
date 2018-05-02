/** 
 * Abvos server
 * https://github.com/tondy67/abv-server
 */
"use strict";

const ABV_URL = 'https://tondy67.github.io/abvos/nodes.html';

// node --inspect server.js | Open 'about:inspect' in Chrome
// export DEBUG=abv:*,info / unset DEBUG
const ts = require('abv-ts')('abv:server');

const pjson = require('./package.json');
const aspa = require('abv-spa')();
const AbvNode = require('abv-node');

const $port = 8080;
const $host = '0.0.0.0';
const $root = __dirname + '/public';

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || $port;
const ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || $host;

aspa.set('root', $root);
aspa.set('cache',3000);

aspa.get('/', res => {
	res.body = 'Aspa server: ' + req.url;
	res.send(200);
});

/*
const tpl = {title:'Abvos ' + pjson.version, url:ABV_URL};
aspa.tpl('/',tpl);
aspa.tpl('/index.html',tpl); */

const $ip = aspa.ips()[0];

aspa.listen(port, ip, (err) => {  
	if (err) return ts.error(err);
	ts.info('Node.js: ' + process.version,'os: ' + process.platform,'arch: '+process.arch);
	ts.println(`Abvos node is running on http://${$ip}:${port}`,ts.GREEN);
});

///
const node = new AbvNode(aspa);

///
/*
const ensureSecure = (req, res) => {
  if(req.get('x-forwarded-proto') === 'https')
	res.redirect('https://' + req.hostname + req.url); 
}; */
