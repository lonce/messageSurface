/* ---------------------------------------------------------------------------------------
This jsaSound Code is distributed under LGPL 3
Copyright (C) 2012 National University of Singapore
Inquiries: director@anclab.org

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNULesser General Public License for more details.
You should have received a copy of the GNU General Public License and GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
------------------------------------------------------------------------------------------*/


require.config({
	paths: {
	//	"jsaSound": ".."
		"jquery": "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min",
		"jquery-ui": "http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui",
		"jquery-tools": "http://cdn.jquerytools.org/1.2.6/all/jquery.tools.min"
	},
	// Insures that dependencies are completely loaded in the proper order
	shim: {
		"jquery-ui": {
			deps: ["jquery"]
		},
		"jquery-tools": {
			deps: ["jquery-ui"]
		}
	}
});

require(
	["require", "touch2Mouse", "utils", "jsaSurfaceUtils", "canvasSlider", "jsaNStateButton", "jsaPushButton", "xySlider", "canvasPitchRoll", "guiElmtData", "io_messageMap", "jquery-ui", "jquery-tools"],

	function (require, touch2Mouse, utils, surfaceUtils, canvasSlider, jsaNStateButton, jsaPushButton, xySlider, prSlider, guiElmtData, messageMap) {

		myID=0;
		var g_locX, g_locY;// position to put next new GUI elements
		var g_EditMode=true; //boolean
		var m_currentGuiTarget; // keeps track of where the mouse went down

		var g_clientAddress = "192.168.1.142";
		var g_clientPort="0000"; // for sending OSC messages to 

		var interfaceType=["nStateButton", "pushButton", "vslider", "hslider", "xyslider", "prslider", "none"];
		var eventType=["nState",        "nState",     "range",   "range",   "range2D",  "range2D", "none"];

		var inputData={};
		var surfaceData = {  // should probably have a factory for making these
			"interface": []
		};  // data for currently active gui elements


		function removeElement(id){
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

		function removeAllElements(){
			for(i=0;i<surfaceData.length;i++){
				removeElement(surfaceData.interface[i].paramioID);
			}
		}

		// get a json file defining an interface set and make a GUI out of it
		function read_json(fname) {
			console.log("in read_json");
			$.getJSON(fname, function(data) {
				console.log("returned from read_json to execute function");
				inputData=data;
				for(elmt=0;elmt<inputData.interface.length;elmt++){
					makegui(inputData.interface[elmt]);
				}
			});//.fail(function err(){console.log("something went wrong in read_json")});			
		}



		function makegui(guidata){
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


			removeElement(id);

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
					newdiv.innerHTML = "<input  type=\"button\" class=\"ui_elmt pushButton\"  id = \"" + id  + "\"  style = \" border:5px solid " + ocolor + "; font-size: 30px; left:  0%; top: 0%; width: 100%;  height:100%; border-radius:20px;  box-shadow: 5px 5px 10px #FFFFFF; -webkit-appearance:button; background: -webkit-gradient(linear, left top, left bottom, from(#CCCCCC), to(#999999));\" />";
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

			if (g_EditMode===true){
				$(".ui_elmt").css("pointer-events", "none");
				$( '.elmtdiv' , window.document)
				.resizable({
					stop: function( event, ui ) {
						event.target.firstChild.data.position.width=(100*ui.size.width/window.innerWidth).toFixed(2) + "%";
						event.target.firstChild.data.position.height=(100*ui.size.height/window.innerHeight).toFixed(2) + "%";
						//makegui(event.target.firstChild.data); //bbbbb

					}
				})
				.draggable({
					stop: function( event, ui ) {
						event.target.firstChild.data.position.x=(100*ui.position.left/window.innerWidth).toFixed(2) + "%";
						event.target.firstChild.data.position.y=(100*ui.position.top/window.innerHeight).toFixed(2) + "%";
						//makegui(event.target.firstChild.data);  //bbbbbF
					}
				});

        		//console.log("ui = "  + '#'+id);
        		//console.log("div = " + '#'+id+'div');
        		// ARGH. Why can't I set this on individul elements??
				//$('#'+id).css("pointer-events", "none");
				//$('#'+id+'div').resizable().draggable();
			}
			//$( '.elmtdiv'  , window.document).resizable().draggable();
		}


		$( '.elmtdiv' , window.document).click(function( event ) {
			event.preventDefault();
			console.log( ' elmtdiv clicked', $( this ).text() );
		});



		$('.editmode_checkbox').checked=true;
		document.addEventListener('click', editModeClick, false);
//		$(".ui_elmt").css("-webkit-user-select", "none"); // stops that ugly highlighted selection 
//		$(".elmtdiv").css("-webkit-user-select", "none"); // stops that ugly highlighted selection 


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


		//--------------------------------------------------------------------------------------------------
		//http://jquerytools.org/demos/overlay/modal-dialog.html
		// this "overlay" tool is UGLY -
		// This overlay call actually adds the event listener to the button - (using the rel attribute on the button??)!!!!!!
		var triggers = $("#modalInputID").overlay({
			// some mask tweaks suitable for modal dialogs
			mask: {
				color: '#ebecff',
				loadSpeed: 200,
				opacity: 0.9
			},
			closeOnClick: false
		});


		// The is where we send the data structure for the surface to the server to be saved
		$("#prompt form").submit(function(e) {
			// close the overlay
			triggers.overlay().close();
			// get user input
			var input = $("input", this).val();

			$.post("/savesurface", {"name": input, "data": JSON.stringify(surfaceData, null, 4)}, function(returnedData) {
				console.log("post was successful");
				// This callback is executed if the post was successful     
				});
				// do not submit the form
			return e.preventDefault();
			});
		//------------------------------------------------------------------------------------

		var surfaceSelectorElem=  document.getElementById("surfaceSelector");


		$( "#mydialog" ).dialog({  autoOpen: false,
									hide: "explode",
									modal: false,
									open: function( event, ui ) {

										$("input[id=host]").val(g_clientAddress);
										$("input[id=port]").val(g_clientPort);
										console.log("host is " + $("input[id=host]").val());
										console.log("port is " + $("input[id=port]").val());



										//console.log(" on open, x,y = (" + event.pageX + ", " + event.pageY + ")" );
										//console.log(" on open, locX,locY = (" + g_locX + ", " + locY + ")" );

										console.log("surfaceSelectorElem = " + surfaceSelectorElem);
										surfaceSelectorElem.addEventListener("change", surfaceChoice);


										var surfaceList;
										(function makeSurfaceSelector() {
											var i;
											var currOptionName;
											console.log("in makeSurfaceSelector");

											$.getJSON("surfaceList", function(data){
												surfaceList =  surfaceUtils.filesToObjectList(data.surfaces);
												console.log("Yip! surface list is " + surfaceList);
												surfaceSelectorElem.options.length=0;
												surfaceSelectorElem.add(new Option(''));
												for (i = 0; i < surfaceList.length; i += 1) {
													currOptionName = surfaceList[i].fileName || "";
													//Add option to end of list
													surfaceSelectorElem.add(new Option(currOptionName));
												}
												surfaceSelectorElem.options[0].selected="true";

											});
										}());


										function surfaceChoice() {
											removeAllElements();
											if ((surfaceSelectorElem.selectedIndex-1) >= 0){
												read_json(surfaceList[surfaceSelectorElem.selectedIndex-1].fullPath); // -1 because we add a blank element at the beginning of the list
											} // else the blank element was selected (no selection);
											$( "#mydialog" ).dialog('close');
										}

										//document.removeEventListener("touchstart", touch2Mouse.touchHandler);
        								//document.removeEventListener("touchmove", touch2Mouse.touchHandler);
        								//document.removeEventListener("touchend", touch2Mouse.touchHandler);
        								//document.removeEventListener("touchcancel", touch2Mouse.touchHandler); 

									},
									close: function( event, ui ) {
										var value = $("input[name=RadioGroup1]:checked").val();
										console.log("radio button value is " + value);
										console.log("radio button type is " + interfaceType[value]);
										console.log(" on close, locX,locY = (" + g_locX/window.innerWidth + ", " + g_locY/window.innerHeight + ")" );

										if (($("input[id=host]").val() != g_clientAddress) || ($("input[id=port]").val() != g_clientPort)) {
											g_clientAddress = $("input[id=host]").val();
											g_clientPort = $("input[id=port]").val();
											messageMap.configure(g_clientAddress, g_clientPort);
										}

										if (interfaceType[value] && (interfaceType[value] != "none")){
											console.log("****closing dialog, will make a gui elmt of type  " + interfaceType[value]);
											makegui(guiElmtData(
												{
													"interfaceType": interfaceType[value],
													"eventType": eventType[value],
													"paramioID"  :  "/" + interfaceType[value] + "/"+utils.makeid(5),
													//"message": {"buttonDown": 1, "buttonUp": 0},
													"position": {"x": (100*g_locX/window.innerWidth).toFixed(2) + "%" , "y": (100*g_locY/window.innerHeight).toFixed(2) + "%"},
													"orientation": (interfaceType[value] === "vslider") ? "v" : "h" , // orientation is ignored in makegui if not a slider type
													"color": "green"
												})
											);
										}
										surfaceSelectorElem.removeEventListener("change");


										//document.addEventListener("touchstart", touch2Mouse.touchHandler, true);
        								//document.addEventListener("touchmove", touch2Mouse.touchHandler, true);
        								//document.addEventListener("touchend", touch2Mouse.touchHandler, true);
        								//document.addEventListener("touchcancel", touch2Mouse.touchHandler, true); 


									}
								});

		var guidialog={  autoOpen: false,
									hide: "explode",
									modal: true,
									width:400,
									open: function( event, ui ) {
										this.elmt=$(this).data("guielmt");
										//console.log("**** dialog open elmt = " + elmt + ", elmt.data = " + elmt.data);
										//console.log("****dialog open data.guielmt = " + $(this).data("guielmt"));
										var attr;
										var that=this;
										$('input', this).each(function() {
											attr =   $(this).attr("id") ;
											if ((attr==="x") || (attr==="y") ||(attr==="height") ||(attr==="width")  ){
												$("#"+attr, that).val(that.elmt.data.position[attr]);
											}else{
												$("#"+attr, that).val(that.elmt.data[attr]);
											}
										});

										$("#deleteElement", this).unbind('click');
										$("#deleteElement", this).click(function(e){
												console.log("delete button press");
												console.log("paramioID of element is " + that.elmt.data.paramioID);
												removeElement(that.elmt.data.paramioID);
												that.elmt="deleted"; // tell the close funciton not to make a new one!
												$(that).dialog('close');
											}
										);

										//document.removeEventListener("touchstart", touch2Mouse.touchHandler);
        								//document.removeEventListener("touchmove", touch2Mouse.touchHandler);
        								//document.removeEventListener("touchend", touch2Mouse.touchHandler);
        								//document.removeEventListener("touchcancel", touch2Mouse.touchHandler); 

									},
									close: function( event, ui ) {
										var attr;
										var that=this;
										if (that.elmt==="deleted") return; // element was deleted (ugly, I know!)

										// make new element from data in dialog box
										$('input', this).each(function() {
											attr =   $(this).attr("id") ;
											if ((attr==="x") || (attr==="y") ||(attr==="height") ||(attr==="width")  ){
												that.elmt.data.position[attr] = $("#" + attr, that).val();
											} else{
												that.elmt.data[attr] = $("#" + attr, that).val();
											}
											// now change the dome element attributes
											if (attr==="paramioID") {
												that.elmt.id=$("#" + attr, that).val();
											}
											if (attr==="color") {
												that.elmt.style.borderColor=$("#" + attr, that).val();
											}
											if (attr==="x") {
												console.log("changing left to " + $("#" + attr, that).val());
												that.elmt.parentNode.style.left=$("#" + attr, that).val();
											}
											if (attr==="y") {
												console.log("changing left to " + $("#" + attr, that).val());
												that.elmt.parentNode.style.top=$("#" + attr, that).val();
											}
											
											if (attr==="height") {
												that.elmt.parentNode.style.height=$("#" + attr, that).val();
											}
											if (attr==="width") {
												that.elmt.parentNode.style.width=$("#" + attr, that).val();
											}
											

											/*
												console.log("paramioID is "+ $("#" + attr, that).val());
												var foo = document.getElementById($("#" + attr, that).val());
												if (foo === that.elmt) console.log("foo === that.elmt");
												console.log("foo is " + foo);
												console.log("foo.id is " + foo.id);
												foo.id=2332233;
												var bar = document.getElementById(2332233);
												console.log("bar is " + bar);
												console.log("bar.style is " + bar.style);
												*/
											//document.getElementById(id + 'div');
												//newdiv.setAttribute("id", id + "div");/
										});

										//makegui(that.elmt.data);//bbbbbb

										//console.log("radio button value is " + value);
										//console.log(" on close, locX,locY = (" + locX + ", " + locY + ")" );


										//document.addEventListener("touchstart", touch2Mouse.touchHandler, true);
        								//document.addEventListener("touchmove", touch2Mouse.touchHandler, true);
        								//document.addEventListener("touchend", touch2Mouse.touchHandler, true);
        								//document.addEventListener("touchcancel", touch2Mouse.touchHandler, true); 

									}
		};

		// They all use the same code, but just have different fields (defined in the html file)
		$( "#nStateButtondialog" ).dialog(guidialog);
		$( "#pushButtondialog" ).dialog(guidialog);
		$( "#sliderdialog" ).dialog(guidialog);
		$( "#xysliderdialog" ).dialog(guidialog);
		$( "#prsliderdialog" ).dialog(guidialog);


		$(document).bind("contextmenu", function(event) {
			if (event.ctrlKey === true) return; // enables normal context menu
			event.preventDefault();	// prevent context menu

			console.log("contextmenu");

			//console.log("context menue target = " + event.target + ", child.data = " + event.target.firstChild.data);
			//console.log("event.target.tagName = " + event.target.tagName);
			//console.log("class = " + event.target.firstChild.getAttribute("class"));

			if(event.target.tagName === "BODY"){
				g_locX=event.pageX;
				g_locY=event.pageY;
				$( "#mydialog" ).dialog( "open" );
			} else editGuiElmt(event.target.firstChild);

		});

		$( ".ui_elmt" , window.document).click(function( event ) {
			event.preventDefault();
			console.log( ' ui_elmt clicked!', $( this ).text() );
		});

		


		/* Don't need to do anything at the time the button is checked ...
		$("input[type='radio']").bind( "change", function(event, ui) {
			var value = $("input[name=RadioGroup1]:checked").val();
			alert("The user selected; " + value);
		});
		*/

		$('input[type="checkbox"]').change(function () {
            var name = $(this).val();
            var check = $(this).attr('checked');
            console.log("click change : " + name + " to " + check);

            g_EditMode=check; // so newly created elements can be set 

            // if EditMode, allow clicks on ui_elmts, otherwise let the clicks fall to the parent div for resizing and dragging
            if (check === true){
				$(".ui_elmt").css("pointer-events", "none");
				$( '.elmtdiv' , window.document)
				.resizable({
					stop: function( event, ui ) {
						event.target.firstChild.data.position.width=(100*ui.size.width/window.innerWidth).toFixed(2) + "%";
						event.target.firstChild.data.position.height=(100*ui.size.height/window.innerHeight).toFixed(2) + "%";
						//makegui(event.target.firstChild.data); //bbbbbb
					}
				})
				.draggable({
					stop: function( event, ui ) {
						event.target.firstChild.data.position.x=(100*ui.position.left/window.innerWidth).toFixed(2) + "%";
						event.target.firstChild.data.position.y=(100*ui.position.top/window.innerHeight).toFixed(2) + "%";
						// makegui(event.target.firstChild.data); //bbbbbb
						console.log("drag pos: " + ui.position.left + ", " + ui.position.top );
					}
				});

				document.addEventListener('click', editModeClick, false);
            }
            else{
				$(".ui_elmt").css("pointer-events", "auto");
				$( '.elmtdiv' , window.document).resizable('destroy').draggable('destroy');
				removeEventListener('click', editModeClick);
            }
        });

		
		function editModeClick(event){
			if(event.target.tagName === "BODY"){
				console.log("editModeClick");
				g_locX=event.pageX;
				g_locY=event.pageY;
				$( "#mydialog" ).dialog( "open" );
			} else editGuiElmt(event.target.firstChild);
		}

		function editGuiElmt(ge){

			if (utils.hasClass(ge, "slider")){
				$( "#sliderdialog" ).data("guielmt", ge).dialog( "open", "foo" );
			}else if  (utils.hasClass(ge, "nStateButton")){
				$( "#nStateButtondialog" ).data("guielmt", ge).dialog( "open", "foo" );
			}else if  (utils.hasClass(ge, "pushButton")){
				$( "#pushButtondialog" ).data("guielmt", ge).dialog( "open", "foo" );
			}else if  (utils.hasClass(ge, "xyslider")){
				$( "#xysliderdialog" ).data("guielmt", ge).dialog( "open", "foo" );
			}else if  (utils.hasClass(ge, "prslider")){
				$( "#prsliderdialog" ).data("guielmt", ge).dialog( "open", "foo" );
			}
		}

		function setEditable(val){}

		document.addEventListener("touchstart", touch2Mouse.touchHandler, true);
        document.addEventListener("touchmove", touch2Mouse.touchHandler, true);
        document.addEventListener("touchend", touch2Mouse.touchHandler, true);
        document.addEventListener("touchcancel", touch2Mouse.touchHandler, true); 
	}
);

