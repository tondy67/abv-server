/* 
 * Abvos server
 */
"use strict";

const ABV_URL = 'https://tondy67.github.io/abvos/node.html';

// node --inspect server.js | Open 'about:inspect' in Chrome
// export DEBUG=abv:*,info / unset DEBUG
const ts = require('abv-ts')('abv:server');
const log = console.log.bind(console);

const express = require('express');
const abv = require('abv-node');

const app = express();

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || abv.port;
const ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.set('port', port);
///
if (app.get('port') != abv.port){
//	app.all('*', ensureSecure); 
}

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/',
	function(req, res){
		res.render('pages/index',{ title: 'Abvos',url:ABV_URL});
});

app.use(function (req, res, next) {
	res.status(404).send('404 - Not found!');
});

function ensureSecure(req, res, next){
  if(req.get('x-forwarded-proto') === 'https') return next();
  res.redirect('https://' + req.hostname + req.url); 
}

const server = app.listen(app.get('port'), ip, 511, function(err) {
	if (err) return console.log(err);
	ts.info('Node.js: ' + process.version);
	log('Abvos node is running on http://%s:%s', ip, app.get('port'));
});

abv.node(server);
///
