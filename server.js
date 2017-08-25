/* 
 * Abvos server
 */
"use strict";

// export DEBUG=abv:* / unset DEBUG
const debug = require('debug')('abv:srv');

const express = require('express');
//const abv = require('./abv-node');

const app = express();

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.set('port', port);
///
if (app.get('port') != 8080){
	app.all('*', ensureSecure); 
}

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

///
app.get('/pgp',
	function(req, res){
		res.render('pages/pgp',{ title: 'PGP',url:'/pgp/'});
});
///

app.use(function (req, res, next) {
	res.status(404).send('404 - Not found!');
});

///
function ensureSecure(req, res, next){
  if(req.get('x-forwarded-proto') === 'https') return next();
  res.redirect('https://' + req.hostname + req.url); 
};
///

const server = app.listen(app.get('port'), ip, 511, function(err) {
	if (err) return console.log(err);
	debug('Abv-node is running on http://%s:%s', ip, app.get('port'));
});

//abv.start(server);

///
