/* ---------------------------------------------------------------------------------------
This jsaSound Code is distributed under LGPL 3
Copyright (C) 2012 National University of Singapore
Inquiries: director@anclab.org

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNULesser General Public License for more details.
You should have received a copy of the GNU General Public License and GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
------------------------------------------------------------------------------------------*/

/*  Mapps touch events to mouse events.
Just include this file in a require module, no need to call anything. 
*/

define(
  [],
  function(){

    var touch2Mouse={};
    var time;
    var time2;

    touch2Mouse.touchHandler = function (event) { 
      var touches = event.changedTouches,
          first = touches[0],
          type = "",
          clickP=false;

          console.log("event target " + event.currentTarget);

           switch(event.type)
            {
                case "touchstart": 
                  type = "mousedown";  
                  time= new Date( ).getTime();
                  //alert("touchstart at time " + time);
                  break;
                case "touchmove":  type="mousemove"; break;        
                case "touchend": 
                  type="mouseup";

                  time2= new Date( ).getTime();
                  if ((time2-time) < 200) {
                   clickP=true;
                   //alert("click with time = " + time2 + " - " + time + " = " +  (time2-time));
                  } 
                  break;
                default: return;
            }

               //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
      //           screenX, screenY, clientX, clientY, ctrlKey, 
      //           altKey, shiftKey, metaKey, button, relatedTarget);

      var simulatedEvent = document.createEvent("MouseEvent");
      simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                first.screenX, first.screenY, 
                                first.clientX, first.clientY, false, 
                                false, false, false, 0, null); // second to last arg is "left"
                                                                      
      first.target.dispatchEvent(simulatedEvent);

      if (clickP===true){
        simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent("click", true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0, null); // second to last arg is "left"
                                                                        
        first.target.dispatchEvent(simulatedEvent);

      }


      if (!(event.target.type==="text")){ 
        event.preventDefault();
      } // else let the event bubble so that the text box can get the focus

    }


/*
    (function (){
      console.log("in appUtils, mapping touch to mouse events");
      document.addEventListener("touchstart", touchHandler, true);
      document.addEventListener("touchmove", touchHandler, true);
      document.addEventListener("touchend", touchHandler, true);
      document.addEventListener("touchcancel", touchHandler, true);    
    })();
*/

    return touch2Mouse;

  }
);
