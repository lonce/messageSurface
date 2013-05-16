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
         var canvasPR = w.document.getElementById(id);


         var prBallSize=10;

         var m_Color="#FFFFFF";

         canvasPR.value={};
         canvasPR.value.x = 0.5; // normallized
         canvasPR.value.y = 0.5; // normallized

         var canvas=canvasPR;

         w.addEventListener('deviceorientation', movePR);


         function movePR(e){

            var pitch = e.beta;
            var roll = e.gamma;

 
            canvasPR.value.y = utils.mapconstrain(-45, 45, 0, 1, pitch);
            canvasPR.value.x = utils.mapconstrain(-45, 45, 0, 1, roll);


            //w.document.getElementById("pitch").innerHTML = parseInt(pitch);
           // w.document.getElementById("roll").innerHTML = parseInt(roll);



            canvasPR.fire(e); // uses eventuality funcitonality
            canvasPR.drawSlider();
         }

 


         // DRAWING ----------------------------------------------------------------
         var ctx = canvasPR.getContext("2d");

         canvasPR.drawSlider = function (pos){
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //alert("call to drawSlider with x =  " + canvasPR.value.x + " and y = " + canvasPR.value.y);
            ctx.fillStyle=m_Color;
            ctx.strokeStyle=m_Color;

            ctx.moveTo(canvasPR.value.x*canvas.width,0);
            ctx.lineTo(canvasPR.value.x*canvas.width,canvas.height);
            ctx.stroke();

            ctx.moveTo(0,(1-canvasPR.value.y)*canvas.height);
            ctx.lineTo(canvas.width,(1-canvasPR.value.y)*canvas.height);
            ctx.stroke();

            ctx.fillStyle="#FF0000";
            ctx.strokeStyle="#FF0000";
            ctx.beginPath();
            ctx.arc(canvasPR.value.x*canvas.width,(1-canvasPR.value.y)*canvas.height,prBallSize,0,2*Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

         }

         // mapping keys so computer players can changed paramters while the play ----------------
         // (Multi-touch surfaces don't need this)
         // WARNING: when there is more than onel slider, this event gets picked up by all of them!
         //window.addEventListener("keydown", keyDown, true);
         // note quite sure why this can't be: var keyDown=function(e){}


            canvasPR.setColor = function(c){
               m_Color=c;
               canvasPR.drawSlider();
            }

         // Let this guy be an event generator (adding 'fire' and 'on' functionality)
         utils.eventuality(canvasPR);
         canvasPR.drawSlider();
         
         return canvasPR;
      }
   });