define(
    ["messageSurface/appscripts/canvasSlider", "messageSurface/appscripts/jsaNStateButton", "messageSurface/appscripts/jsaPushButton", "messageSurface/appscripts/xySlider", "messageSurface/appscripts/canvasPitchRoll", "messageSurface/appscripts/io_messageMap",],
        function(canvasSlider, jsaNStateButton, jsaPushButton, xySlider, prSlider, messageMap){

        	var surface={};

        	var surfaceData = {  // should probably have a factory for making these
				"interface": []
			};  // data for currently active gui elements

			surface.configure = function(address, port){
				messageMap.configure(address,port);
			}

			surface.getSurfaceData = function(){
				return surfaceData;
			}

			surface.renderSurface = function(inputData){
        		for(elmt=0;elmt<inputData.interface.length;elmt++){
					surface.removeElement(inputData.interface[elmt].paramioID);
					surface.renderElement(inputData.interface[elmt]);
					//surfaceData.interface.push(inputData.interface[elmt]);
				}
			}



        	surface.renderElement = function(guidata){
			var gui;

			var otype, id, message, posx, posy, posw, posh, ocolor;
			otype=guidata.interfaceType; // required
			id=guidata.paramioID;
			posx=guidata.position.x;
			posy=guidata.position.y;
			posw=guidata.position.width;
			posh=guidata.position.height;
			orient=guidata.orientation;
			ocolor=guidata.color;


			//removeElement(id);

			//a seperate div for each controller
			var newdiv = document.createElement("div");
			newdiv.setAttribute("class", "elmtdiv");
			newdiv.setAttribute("id", id + "div");////////////////////////////////
			newdiv.setAttribute("style", "position: absolute;    left: " + posx + "; top: " + posy + "; width: " + posw + "; height: "+posh);

			// now create the element itself, stash it in its personal div
			switch(otype){
				case 'nStateButton':
					// the ui_elmt will be the firstChild of the div
					newdiv.innerHTML = "<input  type=\"button\" class=\"ui_elmt nStateButton\"  id = \"" + id  + "\"  style = \" border:5px solid " + ocolor + "; font-size: 30px; left:  0%; top: 0%; width: 100%;  height:100%; border-radius:20px; -webkit-appearance:button; background: -webkit-gradient(linear, left top, left bottom, from(#CCCCCC), to(#999999));\" />";
					$('#app').append(newdiv);

					//gui=window.document.getElementById(id);
					gui = jsaNStateButton(window,id, guidata.numStates);
					gui.addEventListener('mousedown', function (e) {myButtonfunc(e);});

					break;

				case 'pushButton':
					// the ui_elmt will be the firstChild of the div
					newdiv.innerHTML = "<input  type=\"button\" class=\"ui_elmt pushButton\"  id = \"" + id  + "\"  style = \" border:5px solid " + ocolor + "; font-size: 30px; left:  0%; top: 0%; width: 100%;  height:100%; border-radius:20px;  box-shadow: 5px 5px 10px #FFFFFF; background: -webkit-gradient(linear, left top, left bottom, from(#CCCCCC), to(#999999));\" />";
					$('#app').append(newdiv);

					//gui=window.document.getElementById(id);
					gui = jsaPushButton(window,id);
					gui.on('mousedown', function (e) {myPushButton(e, $(this));}, false);
					//gui.on('mousedown', function (e) {myButtonfunc(e);},false);

					//gui.on('mousedown', function (e) {$(this).css( 'background', '-webkit-gradient(linear, left top, right top, color-stop(0%,rgba(45,20,150,.9)), color-stop(56%,rgba(54,22,200,.9)), color-stop(100%,rgba(61,23,255,.9))');}, false);


					gui.on('mouseup', function (e) {myPushButton(e, $(this));},false);

					break;

				case 'slider':
				case 'vslider':
				case 'hslider':
					newdiv.innerHTML = "<canvas class=\"ui_elmt slider\" id = \"" + id + "\"  style = \" border:1px solid " + ocolor + "; left:  0%; top: 0%; width: 100%;  height:100%;\" />";
					$('#app').append(newdiv);

					gui = canvasSlider(window,id, orient);
					gui.setColor(ocolor);
					gui.on('mousedown', mySliderfunc);
					gui.on('mousemove', mySliderfunc);
					gui.on('mouseup', mySliderfunc);
					break;

				case 'xyslider':
					newdiv.innerHTML = "<canvas class=\"ui_elmt xyslider\" id = \"" + id + "\"  style = \" border:1px solid " + ocolor + "; left:  0%; top: 0%; width: 100%;  height:100%;\" />";
					$('#app').append(newdiv);

					gui = xySlider(window,id);
					gui.setColor(ocolor);
					gui.on('mousedown', myXYSliderfunc);
					gui.on('mousemove', myXYSliderfunc);
					gui.on('mouseup', myXYSliderfunc);
					break;

				case 'prslider':
					newdiv.innerHTML = "<canvas class=\"ui_elmt prslider\" id = \"" + id + "\"  style = \" border:1px solid " + ocolor + "; left:  0%; top: 0%; width: 100%;  height:100%;\" />";
					$('#app').append(newdiv);

					gui = prSlider(window,id);
					gui.on('deviceorientation', myPRfunc);
					gui.setColor(ocolor);
					break;

				default:
			}
			gui.data=guidata;
			// add element to the current surface
			surfaceData.interface.push(guidata);




			//$( '.elmtdiv'  , window.document).resizable().draggable();
			return(guidata);
		}


		surface.removeElement = function(id){
			// First remove Div and Gui element from the surface
			var olddiv = document.getElementById(id + 'div');
			var myapp = document.getElementById(app);
			if (olddiv  !== null){
				console.log("removing div element");
				olddiv.parentNode.removeChild(olddiv);
			}
			// Next remove the data for the element from the list
			surfaceData.interface.removeObjectWithProperty("paramioID", id);
		}

		surface.removeAllElements = function (){
			for(i=0;i<surfaceData.length;i++){
				removeElement(surfaceData.interface[i].paramioID);
			}
		}






		function myButtonfunc(e){
			console.log("myButtonfunc");
			e.preventDefault();
			if (e.button===2){
				editGuiElmt(e.target);
			}
			if (e.type==="mousedown"){
				m_currentGuiTarget = e.currentTarget;
			}
			messageMap.send([String(m_currentGuiTarget.id), m_currentGuiTarget.value]);
		}

		function myPushButton(e, qbutt){
			console.log("myButtonfunc");
			e.preventDefault();
			if (e.button===2){
				editGuiElmt(e.target);
			}
			if (e.type==="mousedown"){
				m_currentGuiTarget = e.currentTarget;
	 			//qbutt.css('background', '#009999');  
				qbutt.css('box-shadow', '');//-webkit-gradient(linear, left top, right top, color-stop(0%,rgba(45,20,150,.9)), color-stop(56%,rgba(54,22,200,.9)), color-stop(100%,rgba(61,23,255,.9))');
				//qbutt.css( 'background', '-webkit-gradient(linear, left top, right top, color-stop(0%,rgba(45,20,150,.9)), color-stop(56%,rgba(54,22,200,.9)), color-stop(100%,rgba(61,23,255,.9))');
			} else{
				qbutt.css('box-shadow', '5px 5px 10px #FFFFFF');
			}
			messageMap.send([String(m_currentGuiTarget.id), m_currentGuiTarget.value]);
		}


		function myPRfunc(e){
			console.log("pitch and roll!");
			//messageMap.send([String(e.currentTarget.id), e.currentTarget.value.x, e.currentTarget.value.y]);
			messageMap.send([String(e.currentTarget.id), e.currentTarget.value.x, e.currentTarget.value.y]);
		}


		function mySliderfunc(e){
			if (e.button===2){
				editGuiElmt(e.target);
			}
			if (e.type==="mousedown"){
				m_currentGuiTarget = e.currentTarget;
			}
			messageMap.send([String(m_currentGuiTarget.id), m_currentGuiTarget.value]);
		}

		function myXYSliderfunc(e){
			if (e.button===2){
				editGuiElmt(e.target);
			}

			if (e.type==="mousedown"){
				m_currentGuiTarget = e.currentTarget;
			}
			//This is useful!
			//for (var name in e)
			//	console.log(name + " is " + e[name] );	

			messageMap.send([String(m_currentGuiTarget.id), m_currentGuiTarget.value.x, m_currentGuiTarget.value.y]);
		}


		return surface;
	}

)
