// Place your server entry point code here


const express = require('express');
const app = express();
const db = require('./src/services/database.js');
const fs = require('fs');

// Serve static HTML files
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./www'));



const min = require('minimist');
const args = min(process.argv.slice(2));

const cors = require('cors');
app.use(cors());

args['port', 'debug', 'log', 'help'] ;
const port = args.port || process.env.PORT || 5555;

const help = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`);

if (args.help || args.h) {
  console.log(help)
  process.exit(0)
};

//Functions
function coinFlip() {
    var x = Math.random();
    if (x < .5) {
      return 'heads';
    } else {
      return 'tails';
    }
 }

 function coinFlips(flips) {
    const result = [];
    for(var i = 0; i < flips; i++) {
      result[i] = coinFlip();
    }
    return result;
 }

 function countFlips(array) {
    var x = 0;
    var y = 0;
    for(var i = 0; i < array.length; i++) {
      if (array[i] == 'heads') {
        x++;
      } else {
        y++;
      }
     
    }
    return {
      tails: y,
      heads: x
   }
 }

 function flipACoin(call) {
    var x = coinFlip();
    var y = '';
    if (call == x) {
       y = 'win';
    } else {
      y = 'lose';
    }
    return {
     call: call,
     flip: x,
     result: y 
    }
 }

 // end of functions




const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
});

if(args.debug == true) {
  app.get("/app/log/access", (req, res) => {
    try {
      const stmt = db.prepare(`SELECT * FROM accesslog`).all();
      res.status(200);
      res.send(stmt);
    } catch {
      console.error(e);
    }
  });
  
  app.get('/app/error', (req,res) => {
    res.status(500);
    throw new Error('Error test completed successfully.');
  });
}

if (args.log == true) {
  const morgan = require('morgan');
  const accessLog = fs.createWriteStream('access.log', {flags: 'a'});
  app.use(morgan('combined', { stream: accessLog }));
} else {
  console.log("Not creating a new access.log");
}

app.use((req, res, next) => {
  let logdata = {
    remoteaddr: req.ip,
    remoteuser: req.user,
    time: Date.now(),
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    status: res.statusCode,
    referer: req.headers['referer'],
    useragent: req.headers['user-agent']
  }

  const stmt = db.prepare(`INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, secure, status, referer, useragent) VALUES(?,?,?,?,?,?,?,?,?,?,?);`);
  const info = stmt.run(
    logdata.remoteaddr,
    logdata.remoteuser,
    logdata.time,
    logdata.method,
    logdata.url,
    logdata.protocol,
    logdata.httpversion,
    logdata.secure,
    logdata.status,
    logdata.referer,
    logdata.useragent
  );
  next();
})

app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
    });

app.get('/app/flip/', (req,res) => {
    var flip = coinFlip();
    res.status(200).json({'flip': flip});
});

app.get('/app/flips/:number', (req, res) => {
    var flipsList = coinFlips(req.body.number);
    var summary = countFlips(flipsList);
    res.status(200).json({'raw': flipsList, 'summary': summary});
})

app.get('/app/flip/call/:guess', (req, res) => {
    var result = flipACoin(req.body.guess);
    res.status(200).json(result);
})



app.use(function(req, res) {
    res.status(404).send('404 NOT FOUND');
    res.type("text/plain");
});