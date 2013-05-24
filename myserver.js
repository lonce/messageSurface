var express = require("express")
, app = express()
, server = require('http').createServer(app)
, WebSocketServer = require('ws').Server
, wss = new WebSocketServer({server: server})
, fs = require('fs');

var k_portnum = 8082;

console.log("hey myserver is starting with command line arguments:");
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
if (process.argv.length < 3){
    console.log("usage: node myserver portnum");
    process.exit(1);
}
k_portnum=process.argv[2];


//****************************************************************************
var m_useRoot="/www";
app.use(express.static(__dirname + m_useRoot));
app.use(express.bodyParser());

server.listen(process.argv[2] || k_portnum);
console.log("Connected and listening on port " + k_portnum);

wss.on('connection', function (ws) {
    ws.id = id++;
    console.log("got a connection, assigning ID = " + ws.id);

    ws.on('close', function() {        
        console.log(ws.id + " is gone..." );
    });
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Match a request for data from the client and return requested json data
app.get("/surfaceList",function(req, res){
    // get list of file names
    getGuiList("./www/surfaces", function (z, flist){ // TODO: The 1st arg should obviously be passed in as data from the client!
        for(i=0;i<flist.length;i++){
          // clean list so paths are relative to client directory
          flist[i]=flist[i].replace(m_useRoot, "");
          console.log("results are" + flist);
        }
        res.send({"surfaces": flist});
    });
})



// Generic function that recursivley searches a directory for files
// return: list of full pathnames
var getGuiList = function(dir, done) {
  console.log("walking the walk");
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};


// Match a post request for data from the client and return requested json data
app.post("/savesurface",function(req, res){
    //var mdata = JSON.parse(req);
    console.log("whoo hoo got a get save request with name: " + req.body.name);
    console.log("whoo hoo got a get save with data: " + req.body.data);
    console.log("PARSED data is  " + JSON.parse(req.body.data));

    //fs.writeFile("./www/surfaces/" + req.body.name + ".json", JSON.stringify(req.body.data, null, 4), function(err) {
    fs.writeFile("./www/surfaces/" + req.body.name + ".json", req.body.data, function(err) {
    if(err) {
      console.log(err);
      res.send({"msg": "write failed"});
    } else {
      console.log("JSON saved to " + "./www/surfaces/" + req.body.name + ".json");
      res.send({"msg": "OK"});
    }
}); 



    

})




exports.server = server;
