/* ---------------------------------------------------------------------------------------
This jsaSound Code is distributed under LGPL 3
Copyright (C) 2012 National University of Singapore
Inquiries: director@anclab.org

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNULesser General Public License for more details.
You should have received a copy of the GNU General Public License and GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
------------------------------------------------------------------------------------------*/

/* This is just a link between the main program and the comms code, in the interest of modularization.
Could lose the comms code and handle messages here in a different way. 
*/


define(
	["messageSurface/appscripts/comm", "messageSurface/appscripts/utils"],

	function (comm, utils) {
		var i;
		var msg;

		var servermsg={};

		servermsg.configure=function(ca,cp,sa,sp){
			console.log("io_messageMap call configure with ca = " + ca + ", and cp = " + cp);
			comm.configure(ca,cp,sa,sp);
		}

		servermsg.send= function (oscstring){
			for(var i=0;i<oscstring.length;i++){
				if (utils.isNumber(oscstring[i])) {
					oscstring[i]=Number(oscstring[i]);
				}
			}

			comm.sendJSONmsg('myOscMessage', oscstring);	
		}

		return servermsg;
});

