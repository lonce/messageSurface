
messageSurface is a "DIY" controller interface surface maker in the spirit of Charlie Robert's "Control" or TouchOSC.

Design your interface with a variety components, save and load them, then use them to control, for example, OSC synths.

The difference is that messageSurface is a browser app ("bapp") which means you
create your srufaces in a browser window, and open them (possibly on other devices) by navigating to a web page.
No native code, no "synching" or downloading surface from PC to device.

Also, it generates osc-like json messages that can be used for anything. 
If you want to actually use the interface to control, say, Max/Msp with OSC, check out the json2osc project. 
messageSurface and json2osc play nicley together.

---------------------------------------------------------------------
To RUN this code, you first run the server:
 >> node messageSurface port#
Then point your -webkit- (e.g. Chrome, Safari) browser to localhost:port#

----------------------------------------------------------------------

Currently, there are 5 GUI elements you can use to create oscSurface:
   1) nState Button, (goes to next state with each push)
   2) Push button,   (one state for up, andother for down)
   3) slider  (vertical or horizontal)
   4) xy slider
   5) pitch/roll 

Surfaces can be saved and loaded and are just human-readable JSON files on disk.

-----------------------------------------------------------------------
NOTES

The main code is not pretty - I was learning about GUI's and DOM communication as I did it.
There is some modularity which make parts of the code understandable and reusable. 

Developed & tested using Chrome, a bit on Safari.

require.js is used for all client code.
The server uses node, express, and ws.
jQuery and jQuery-ui are used for this interface-heavy bapp. 

Design notes:
All dialog boxes are hidden divs on the html page, 
Crockford's "eventuality" is used for events on my own gui objects.
All gui objects are created as children of a div that gets dynamically added to or removed fromthe web page. 

-----------------------------------------------------------------------

Todo:

You can (sort of) edit on Android mobile devices now, but a few "issues" having to do 
with modal dialog size and positioning, and click managmement need to 
be worked out for this to be as easy to edit on mobiles as on PC.

Delete old objects  when we load a new surface from the server.

Allow pitch/roll element to be invisible

Get pitch and roll display to adjust to mobile device orientations.




 

