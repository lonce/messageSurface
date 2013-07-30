/* ---------------------------------------------------------------------------------------
This jsaSound Code is distributed under LGPL 3
Copyright (C) 2012 National University of Singapore
Inquiries: director@anclab.org

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNULesser General Public License for more details.
You should have received a copy of the GNU General Public License and GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
------------------------------------------------------------------------------------------*/

define(
	["messageSurface/appscripts/utils", "messageSurface/appscripts/touch2Mouse"],
	function (utils, touch2Mouse) {
      return function (w,id, inumStates){
         var myWindow=w;
   		var butt = w.document.getElementById(id);

         butt.data={};
         butt.data.numStates=inumStates;

         var mousePressed=false;

         var m_Color="#FFFFFF";

         var current_state=0;
         butt.value = current_state; 
         var outsideElmtListener;


         butt.addEventListener("mousedown", onMouseDown, false);
         butt.addEventListener("mouseup", onMouseUp, false);
         //butt.addEventListener("mousemove", onMouseMove, false);

        //butt.addEventListener("touchstart", touch2Mouse.touchHandler, true);
         //butt.addEventListener("touchmove", touch2Mouse.touchHandler, true);
        //butt.addEventListener("touchend", touch2Mouse.touchHandler, true);
         //butt.addEventListener("touchcancel", touch2Mouse.touchHandler, true);   

    

         function onMouseDown (e){
            current_state=(current_state+1) % butt.data.numStates;
            butt.value=current_state;
            //alert("Button: on mouse down , state = " + current_state);
            //myWindow.document.body.addEventListener('mouseup', onMouseUp, false);

        }


         function onMouseUp(e){
            if (!mousePressed) return;
            mousePressed=false;
            //canvasSlider.drawButt();
         //alert("Button: on mouse up , state = " + current_state);
            //myWindow.document.body.removeEventListener('mouseup');
         }

         /*
         // DRAWING ----------------------------------------------------------------
         var ctx = canvasSlider.getContext("2d");

         butt.drawButt = function (pos){
            ctx.clearRect(0, 0, sliderCanvas.width, sliderCanvas.height);
            ctx.fillStyle=m_Color;
            ctx.strokeStyle=m_Color;
            if (orient === "v"){
               ctx.fillRect(0,(1-canvasSlider.value)*sliderCanvas.height-sliderButtonSpan/2.,sliderCanvas.width,sliderButtonSpan);
            } else{
                ctx.fillRect(canvasSlider.value*sliderCanvas.width-sliderButtonSpan/2., 0, sliderButtonSpan, sliderCanvas.height );              
            }
            ctx.font="20px Arial";
         }



         butt.setColor = function(c){
            m_Color=c;
            butt.drawButt();
         }

         // Let this guy be an event generator (adding 'fire' and 'on' functionality)
         utils.eventuality(canvasSlider);
         canvasSlider.drawButt();
         */
   		return butt;
      }

});