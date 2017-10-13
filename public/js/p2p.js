// build: browserify p2p.js -o bundle.js
var io = require('socket.io-client');
var SimplePeer = require('simple-peer');

// localStorage.debug=eona;
var debug = require('debug')('eona');

function init () {
// Elements
	var privateButton = document.getElementById('private');
	var form = document.getElementById('msg-form');
	var box = document.getElementById('msg-box');
	var boxFile = document.getElementById('msg-file');
	var msg = document.getElementById('msg');
	var dbg = document.getElementById('debug');
///
	var socket = io();
var peer = null;
var useP2P = false;

	socket.on('p2p', function (data) {
		debug(data.type);
		if (data.type == 'offer'){
			peer = createPeer(data); 
		}else if (data.type == 'answer'){
			peer.signal(data);
		}else{
			debug('Error: ' + data);
		}
	});

	socket.on('msg', function (data) {
		print(data.id+": "+data.msg);
		debug(data);
	});

	socket.on('file', function (data) { 
		var file = new Uint8Array(data.file);
		var type = data.type; trace(type);
		var blob = new window.Blob([file], {type: type}); // 'image/jpeg'
		var urlCreator = window.URL || window.webkitURL;
		var fileUrl = urlCreator.createObjectURL(blob);
		if (type.startsWith('image/')){
			var img = document.createElement('img');
			img.src = fileUrl;
			img.width = '200';
			msg.appendChild(img);
		}else{
			var a = document.createElement('a');
			var linkText = document.createTextNode(data.name);
			a.href = fileUrl;
			a.target = '_blank';
			a.download = data.name;
			a.appendChild(linkText);
			msg.appendChild(a);
		}
		var br = document.createElement("br");
		msg.appendChild(br);
		msg.scrollTop = msg.scrollHeight;
	});

	form.addEventListener('submit', function (e, d) {
		e.preventDefault();

		if (boxFile.value !== '') {
			var file = boxFile.files[0];
			var reader = new window.FileReader();
			reader.onload = function (evnt) {
				socket.emit('file', {
					file: evnt.target.result, 
					name:file.name,
					type:file.type
				});
			};
			reader.onerror = function (err) {
				trace('Error while reading file: '+ err);
			};
			reader.readAsArrayBuffer(file);
		} else if (box.value !== ''){
			var t = $('#room').val();
			var room = '';
			if (t == 'room1') room = 'room1';
			else if (t == 'room2') room = 'room2';
			
			var m = {
				msg: box.value, 
				room: room, 
				ts: Date.now(),
				id: -1
			};
			
			if (useP2P){
		  		peer.send(JSON.stringify(m));
			}else{
				socket.emit('msg', m);
			}
		    print(box.value);
//debug(socket);
		}
		box.value = '';
		boxFile.value = '';
	})

	$('#room1').on('click', function (e) {
		socket.emit('join', 'room1');
	});
	$('#room2').on('click', function (e) {
		socket.emit('join', 'room2');
	});

	socket.on('connect_error', function (err) {
		trace(err);
	});

	function trace(v)
	{
		var t = null;
		if (typeof v === 'string') t = v;
		else t = JSON.stringify(v);
		if (t !== null){
			if (dbg !== null )dbg.innerHTML = t;
			else alert(t);
		}
	};
	
	function print(s)
	{
		msg.innerHTML += s + '<br />';
		msg.scrollTop = msg.scrollHeight;
	}
	
	function createPeer(handshake)
	{
		if (typeof handshake !== 'object') handshake = null;
		var initiator = handshake === null ? true:false;

		var p = new SimplePeer({ initiator: initiator, trickle: false });

	  	if (!initiator) p.signal(handshake);
		
		p.peerID = socket.id;
		debug('The Peer('+p.peerID+') waiting for handshake...');
		
		p.on('error', function (err) { 
			debug(err) 
		});

		p.on('signal', function (data) {
		  	debug('p2p signal: ' + data.type);
			socket.emit('p2p', data);
		});

		p.on('connect', function () {
		  debug('p2p connect');
		  trace('WebRTC connection established!');
		  useP2P = true;
		  setTimeout(function(){
			 p.send(JSON.stringify({
					msg: 'ping', 
					room: '', 
					ts: Date.now(),
					id: -1
			}));
		 },1000);
		});

		p.on('close', function () {
		  debug('p2p close');
		  useP2P = false;
		  p.destroy();
		});

		p.on('data', function (data) {
		  var m = JSON.parse(data);
		  print(m.id+": "+m.msg);
		});
		
		return p;
	}

	$('#p2p').on('click', function () {
		peer = createPeer();
	});

	$('#aes').on('click', function () {
		aes();
	});
	function aes()
	{
var crypto = require('crypto'),
  algorithm = 'aes-256-gcm',
  password = '3zTvzr3p67VC61jmV54rIYu1545x4TlY',
  // do not use a global iv for production, 
  // generate a new one for each encryption
  iv = '60iP0h6vJoEa'
 
function encrypt(text) {
  var cipher = crypto.createCipheriv(algorithm, password, iv)
  var encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex');
  var tag = cipher.getAuthTag();
  return {
    content: encrypted,
    tag: tag
  };
}
 
function decrypt(encrypted) {
  var decipher = crypto.createDecipheriv(algorithm, password, iv)
  decipher.setAuthTag(encrypted.tag);
  var dec = decipher.update(encrypted.content, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}
 
//var hw = encrypt("hello world");
var obj = '{"content":"78e62cfe7b1d3e4107a168","tag":[191,195,69,243,214,136,108,29,92,38,198,197,52,31,132,208]}';
var hw = JSON.parse(obj);
//debug(hw);
  // outputs hello world
trace(decrypt(hw));		
	}
}

document.addEventListener('DOMContentLoaded', init, false);
