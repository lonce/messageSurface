/* ---------------------------------------------------------------------------------------
This jsaSound Code is distributed under LGPL 3
Copyright (C) 2012 National University of Singapore
Inquiries: director@anclab.org

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNULesser General Public License for more details.
You should have received a copy of the GNU General Public License and GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
------------------------------------------------------------------------------------------*/

define(
	["root/appscripts/utils"],
	function (utils) {
      return function (iobj){
      	//console.log("making new gui elmet iobj.interfaceType = " + iobj.interfaceType);
         var guiElmt={
				"interfaceType": iobj.interfaceType || "nStateButton",
				"eventType": iobj.eventType || "nState",
				//"paramioID"  : iobj.paramioID ||  (iobj.interfaceType && ("\\" + iobj.interfaceType + "\\"+utils.makeid(4))),
				"paramioID"  : iobj.paramioID ||  (iobj.interfaceType && ( "/" + iobj.interfaceType + "/"+utils.makeid(4))),
				"message": iobj.message ||  ["mousedown"],
				"position": {
						"x": iobj.position && iobj.position.x || "5%", 
						"y": iobj.position && iobj.position.y || "5%", 
						"width": iobj.position && iobj.position.width ||"20%", 
						"height": iobj.position && iobj.position.height ||"20%"
					},
				"orientation": iobj.orientation || "vertical",
				"numStates": iobj.numStates || 2,
				"color": iobj.color || "blue"

         }
         return guiElmt;
     }
 });
