
oscSurface is a "DIY" Open Sound Control surface maker in the spirit of
Charlie Robert's "Control" or TouchOSC.

The difference is that oscSurface is a "bapp" (locally served browser app) which means you
create your srufaces in a browser window, and open them (on other devices) by navigating to a web page.
No native code, no "synching" or downloading surface from PC to device.

---------------------------------------------------------------------
To RUN this code, you first run the server:
 >> node myserver port#
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
with modal dialog size and positioning, selecting elements on the surface, and resizing need to 
be worked out for this to be useful and before it will work on iThings.

Delete old objects individually (from a delete button in edit mode dialog)
   and when collectively when we load a new surface from the server.

Allow pitch/roll element to be invisible

Currently the io_messageMap just prints out JSON-formatted "osc" Message. Another project (actually running, but not
up on GitHub yet) is needed to translate JSON to osc messages and send them to a local port for reading from other
programs such as Max/MSP. 

Make code cross-browser.

Clean up the node_modules directory, write a "how-to" section to help people get all the dependencies set up propoerly. 





 

