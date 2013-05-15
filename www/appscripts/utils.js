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
        function(){
            var utils = {};
    		// utilities
		    // Until requestAnimationFrame comes standard in all browsers, test
            // for the prefixed names as well.

            utils.getRequestAnimationFrameFunc = function() {
                try {
                    return (window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.msRequestAnimationFrame ||
                            (function (cb) {
                                setTimeout(cb, 1000/60);
                            }));
                } catch (e) {
                    return undefined;
                }
            };


            utils.getCanvasMousePosition = function (canvas, evt) {
                var rect = canvas.getBoundingClientRect();
                //context.scale(1, 0.5);
                var bbox = canvas.getBoundingClientRect();
                return {
                x: (evt.clientX - rect.left)*(canvas.width/bbox.width),
                y: (evt.clientY - rect.top)*(canvas.height/bbox.height)
                };
            };


            //------------------------------------------------------------------------
            // This is Douglas Crockfords "composing objects by parts" code from his book
            utils.eventuality = function (that) {
                var registry = {};
                that.fire = function (event) {
            // Fire an event on an object. The event can be either
            // a string containing the name of the event or an
            // object containing a type property containing the
            // name of the event. Handlers registered by the 'on'
            // method that match the event name will be invoked.
                    var array,
                        func,
                        handler,
                        i,
                        type = typeof event === 'string' ?
                                event : event.type;
            // If an array of handlers exist for this event, then
            // loop through it and execute the handlers in order.
                    if (registry.hasOwnProperty(type)) {
                        array = registry[type];
                        for (i = 0; i < array.length; i += 1) {
                            handler = array[i];
            // A handler record contains a method and an optional
            // array of parameters. If the method is a name, look
            // up the function.
                            func = handler.method;
                            if (typeof func === 'string') {
                                func = this[func];
                            }
            // Invoke a handler. If the record contained
            // parameters, then pass them. Otherwise, pass the
            // event object.
                            func.apply(this,
                                handler.parameters || [event]);
                        }
                    }
                    return this;
                };
                that.on = function (type, method, parameters) {
            // Register an event. Make a handler record. Put it
            // in a handler array, making one if it doesn't yet
            // exist for this type.
                    var handler = {
                        method: method,
                        parameters: parameters
                    };
                    if (registry.hasOwnProperty(type)) {
                        registry[type].push(handler);
                    } else {
                        registry[type] = [handler];
                    }
                    return this;
                };
                return that;
            }

            utils.makeid = function(inum){
                num=inum || 5;
                var text = "";
                var possible = "0123456789";
                for( var i=0; i < num; i++ )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                return text;
            }



            utils.hasClass = function (el, class_to_match) {
                var c;
                if (el && el.className && typeof class_to_match === "string") {
                    c = el.getAttribute("class");
                    c = " "+ c + " ";
                    return c.indexOf(" " + class_to_match + " ") > -1;
                } else {
                    return false;
                }
            }

             utils.mapconstrain = function (f1, f2, t1, t2, x) {
                    var raw = t1 + ((x - f1) / (f2 - f1)) * (t2 - t1);
                return Math.max(t1, Math.min(raw, t2));
            };


            return utils;
});
