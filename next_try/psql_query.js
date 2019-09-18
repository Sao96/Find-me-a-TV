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
    user: "vxnzeehptioyeb",
    password:
      "e2ea07be01dd5c0f8963a5bc9d5ee51dd7f403fa2951c8ed5cc40adf5ccb7f20",
    database: "dbv6tpm3c2j6bg",
    port: 5432,
    host: "ec2-54-235-86-101.compute-1.amazonaws.com",
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
