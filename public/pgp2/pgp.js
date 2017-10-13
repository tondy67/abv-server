// browserify pgp.js -o bundle.js
// localStorage.debug = 'abv:*';
//
const debug = require('debug')('abv:pgp');
const crypto = require('crypto');

function Ttt(){
	var  alice = crypto.createECDH('secp521r1');
	var aliceKey = alice.generateKeys();

	var pub = alice.getPublicKey('base64');
	var prv = alice.getPrivateKey('base64');
	var a = prv.match(/.{1,64}/g);
	var key = '-----BEGIN EC PRIVATE KEY-----\n'+a.join('\n')+'\n-----END EC PRIVATE KEY-----'; console.log(key);
	var buf = new Buffer('This is a test. Това е тест!');
	var encrypted = crypto.privateEncrypt({
		key: key,
		passphrase: '',
		padding: crypto.constants.RSA_NO_PADDING
	}, buf);
	var msg = encrypted.toString('base64');
	return {
			pub: pub,
			prv: prv,
			msg: msg
	};
}
debug(Ttt());

if (typeof window !== 'undefined'){
	window.debug = debug;
	window.abv = {
		Ttt: Ttt
	}
}

