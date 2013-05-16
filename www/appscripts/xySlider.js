/* ---------------------------------------------------------------------------------------
This jsaSound Code is distributed under LGPL 3
Copyright (C) 2012 National University of Singapore
Inquiries: director@anclab.org

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNULesser General Public License for more details.
You should have received a copy of the GNU General Public License and GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
------------------------------------------------------------------------------------------*/

define(
	["utils", "touch2Mouse"],
	function (utils, touch2Mouse) {
      return function (w,id, iorient){
         var myWindow=w;
         var canvasSlider = w.document.getElementById(id);

         var sliderButtonSpan=7;
         var k_sliderInc=0.01; // proportion of total slider value length
         var mousePressed=false;

         var m_Color="#FFFFFF";

         canvasSlider.value={};
         canvasSlider.value.x = 0.5; // normallized
         canvasSlider.value.y = 0.5; // normallized

         var sliderCanvas=canvasSlider;
         var outsideElmtListener;


         sliderCanvas.addEventListener("mousedown", onMouseDown, false);

         sliderCanvas.addEventListener("touchstart", touch2Mouse.touchHandler, true);
         sliderCanvas.addEventListener("touchmove", touch2Mouse.touchHandler, true);
         sliderCanvas.addEventListener("touchend", touch2Mouse.touchHandler, true);
         sliderCanvas.addEventListener("touchcancel", touch2Mouse.touchHandler, true);

         function onMouseDown (e){
           if (event.button === 2) return;

            mousePressed=true;
            var m = utils.getCanvasMousePosition(sliderCanvas, e);

            canvasSlider.value.x= Math.max(0,  Math.min(1, m.x/sliderCanvas.width));
            canvasSlider.value.y= Math.max(0,  Math.min(1, 1-m.y/sliderCanvas.height));

            canvasSlider.drawSlider();

            canvasSlider.fire(e); // uses eventuality funcitonality            
            myWindow.document.body.addEventListener('mousemove', onMouseMove, false);
            myWindow.document.body.addEventListener('mouseup', onMouseUp, false);

            //console.log("canvasSlider: onMouseDown");

         }

         function onMouseMove(e){
            //console.log("onMouseMove");
            if (event.button === 2) return;
            if (!mousePressed) return;
            var m = utils.getCanvasMousePosition(sliderCanvas, e);

            canvasSlider.value.x= Math.max(0,  Math.min(1, m.x/sliderCanvas.width));
            canvasSlider.value.y= Math.max(0,  Math.min(1, 1-m.y/sliderCanvas.height));

            canvasSlider.fire(e); // uses eventuality funcitonality
            canvasSlider.drawSlider();
         }

         function onMouseUp(e){
            if (event.button === 2) return;
            if (!mousePressed) return;
            mousePressed=false;
            var m = utils.getCanvasMousePosition(sliderCanvas, e);
            canvasSlider.value.x= Math.max(0,  Math.min(1, m.x/sliderCanvas.width));
            canvasSlider.value.y= Math.max(0,  Math.min(1, 1-m.y/sliderCanvas.height));
 
            canvasSlider.fire(e); // uses eventuality funcitonality
            canvasSlider.drawSlider();

            myWindow.document.body.removeEventListener('mousemove'); 
            myWindow.document.body.removeEventListener('mouseup');
         }


         // DRAWING ----------------------------------------------------------------
         var ctx = canvasSlider.getContext("2d");

         canvasSlider.drawSlider = function (pos){
            ctx.clearRect(0, 0, sliderCanvas.width, sliderCanvas.height);

            ctx.fillStyle=m_Color;
            ctx.strokeStyle=m_Color;

            ctx.beginPath();
            ctx.arc(canvasSlider.value.x*sliderCanvas.width,(1-canvasSlider.value.y)*sliderCanvas.height,sliderButtonSpan,0,2*Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();



            ctx.moveTo(canvasSlider.value.x*sliderCanvas.width,0);
            ctx.lineTo(canvasSlider.value.x*sliderCanvas.width,sliderCanvas.height);
            ctx.stroke();

            ctx.moveTo(0,(1-canvasSlider.value.y)*sliderCanvas.height);
            ctx.lineTo(sliderCanvas.width,(1-canvasSlider.value.y)*sliderCanvas.height);
            ctx.stroke();
         }

         // mapping keys so computer players can changed paramters while the play ----------------
         // (Multi-touch surfaces don't need this)
         // WARNING: when there is more than onel slider, this event gets picked up by all of them!
   		//window.addEventListener("keydown", keyDown, true);
   		// note quite sure why this can't be: var keyDown=function(e){}
       function keyDown(e){
        var keyCode = e.keyCode;
        switch(keyCode){
         			case 87:  //87=w
                canvasSlider.value = Math.min(1, parseFloat(canvasSlider.value) + k_sliderInc);
                break;
         			case 88: //88=x
                  canvasSlider.value = Math.max(0,parseFloat(canvasSlider.value) - k_sliderInc);
                  break;
                  default:
                  console.log("w is up, x is down");
               }
               canvasSlider.drawSlider();
            };

            canvasSlider.setColor = function(c){
               m_Color=c;
               canvasSlider.drawSlider();
            }

         // Let this guy be an event generator (adding 'fire' and 'on' functionality)
         utils.eventuality(canvasSlider);
         canvasSlider.drawSlider();
         
         return canvasSlider;
      }
   });