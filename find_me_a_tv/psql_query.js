var express = require("express");
var pg = require("pg");
var cors = require("cors");
var bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("dotenv").config();
let secureEnv = require("secure-env");
global.env = secureEnv({ secret: "Kiwi" });

//routing
app.get("/", function(req, res) {
  res.render("index");
});

app.listen(port, function() {
  console.log("greetings");
});

// Access the parse results as request.body
app.post("/", function(request, response) {
  console.log(request.body.query);
  console.log("lmFAO");

  var client = new pg.Client({
    user: global.env.User,
    password: global.env.Password,
    database: global.env.Database,
    port: global.env.Port,
    host: global.env.Host,
    ssl: true
  });

  client.connect();

  var query = client.query(request.body.query, (err, res) => {
    if (err) {
      console.log(err.stack);
      response.status(400).send(err.stack);
      client.end();
      return err.stack;
    } else {
      //console.log(res.rows);
      response.status(200).send(res.rows);
      client.end();
      return res.rows;
    }
  });
});
