var express = require("express");
var pg = require("pg");
var cors = require("cors");

var app = express();

var port = process.env.PORT || 8080;

app.use(express.static(__dirname));
app.use(cors());

//routing
app.get("/", function(req, res) {
  res.render("index");
});

app.listen(port, function() {
  console.log("greetings");
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as request.body
app.post("/", function(request, response) {
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

  var query = client.query("SELECT * FROM walmart", (err, res) => {
    if (err) {
      console.log(400).send(err.stack);
      response.status(400).send(err.stack);
      return err.stack;
    } else {
      console.log(res.rows);
      response.status(200).send(res.rows);
      return res.rows;
    }

    client.end();
  });
  // console.log(request.body.user.name);
  // console.log(request.body.user.email);
});
