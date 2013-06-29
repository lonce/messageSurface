/* ---------------------------------------------------------------------------------------
This jsaSound Code is distributed under LGPL 3
Copyright (C) 2012 National University of Singapore
Inquiries: director@anclab.org

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNULesser General Public License for more details.
You should have received a copy of the GNU General Public License and GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
------------------------------------------------------------------------------------------*/

define(
	[],
	function () {
		var ws;  // for communicating with the osc server


		//List of messages we can handle from the server (and other clients via the server)
		var callbacks = {};
		var registerCallback = function (name, callback) {
			callbacks[name] = callback;
		};

		// osc server sends us 'init' as a handshake 
		registerCallback('init', init);
		function init(ws, d, s){
			console.log("OK - connection established - send config data to initialzing OSC server");
		}


		registerCallback('oscServerReady', oscServerReady);
		function oscServerReady(data){
			console.log("server says oscServer ready for osc messages!!");
		}


		// for processing all incoming messages
		var receiveJSONmsg = function (data, flags) {
			var obj;
			try {
				obj = JSON.parse(data);
			} catch (e) {
				return;
			}
			//console.log("comm: received JSON message ",  obj);

			// All messages should have 
			//	.n - name of method to call (this is the "message"),
			//	.d - the data payload (methods must know the data they exepct)
			//	.s - an id of the remote client sending the message

			if (!obj.hasOwnProperty('d') || !obj.hasOwnProperty('n') || callbacks[obj.n] === undefined)
				return;
			callbacks[obj.n].call(this, obj.d, obj.s);
		}

		// For sending local client events to the server
		var sendJSONmsg = function (name, data) {
			if (!ws) console.log("If server was configured to receive, the message sent would be " + name + " with data = " + data);
			ws && ws.send(JSON.stringify({n: name, d: data}));//, {mask: true});
		};


		return { 
			//host: host,
			registerCallback: registerCallback,
			sendJSONmsg: sendJSONmsg,
			configure: function(clientAddress, clientPort){

				if (clientAddress === "/") {
					ws = new WebSocket("/");
				} else {
					// Set up the socket as specified
					ws = new WebSocket('ws://' + clientAddress + ":" + clientPort);
				}
				ws.addEventListener('message', function(e){receiveJSONmsg.call(ws, e.data)});

			}
		};
	}
);


