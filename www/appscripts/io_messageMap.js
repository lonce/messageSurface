/* ---------------------------------------------------------------------------------------
This jsaSound Code is distributed under LGPL 3
Copyright (C) 2012 National University of Singapore
Inquiries: director@anclab.org

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNULesser General Public License for more details.
You should have received a copy of the GNU General Public License and GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
------------------------------------------------------------------------------------------*/

/* This application does simple "event chat". Here, events are mouse clicks on a canvas. 
	We register for the following messages:
		init - sent by the server after the client connects. Data returned is an id that the server and other clients will use to recognizes messages from this client.
		mouseClick - sent when another chatroom member generates a mouse click. Data is x, y of their mouse position on their canvas.
*/

require.config({
	paths: {
		"osc": "../osc"
	}
});

define(
	//["comm"],
	[],

//	function (comm) {
	function () {

		var servermsg={};

		servermsg.configure=function(ca,cp,sa,sp){
			console.log("MOCK io_messageMap call configure with ca = " + ca + ", and cp = " + cp);
			//comm.configure(ca,cp,sa,sp);
		}

		servermsg.send= function (oscstring){
			//var message = ["/test/1", "foo", 3, 8.6, "doh"];
			console.log("MOCK io_map: oscstring is " + oscstring);
			//comm.sendJSONmsg('myOscMessage', oscstring);	
		}

		return servermsg;
});

