require("dotenv").config();
const secureEnv = require("secure-env");
global.env = secureEnv({
  secret: "kiwi"
});

var express = require("express");
var pg = require("pg");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

function query_db(custom_query) {
  //Atempt login to the PSQL DB
  var client = new pg.Client({
    user: global.env.User,
    password: global.env.Password,
    database: global.env.Database,
    port: global.env.Port,
    host: global.env.Host,
    ssl: true
  });

  client.connect();

  //Upon a POST request, attempt to formulate a query for it if possible.

  return new Promise((resolve, reject) => {
    client.query(custom_query, (err, res) => {
      if (err) {
        console.log(err.stack);
        client.end();
        reject(err.stack);
      } else {
        // console.log(res.rows);
        client.end();
        resolve(res.rows);
      }
    });
  });

  //return response;
}

async function isValidBrand(brand) {
  let brands;
  try {
    brands = await query_db(
      "WITH TVS AS (select * from walmart union all select * from amazon) SELECT DISTINCT BRAND FROM TVS WHERE BRAND IS NOT NULL;"
    );
    for (let i = 0; i < brands.length; i++) {
      if (brand === brands[i].brand) return true;
    }
  } catch (err) {
    return false;
  }

  return false;
}

async function isValidTechnology(technology) {
  let technologies;
  try {
    technologies = await query_db(
      "WITH TVS AS (select * from walmart union all select * from amazon) SELECT DISTINCT DISPLAY_TECH FROM TVS WHERE DISPLAY_TECH IS NOT NULL;"
    );
    for (let i = 0; i < technologies.length; i++) {
      if (technology === technologies[i].display_tech) return true;
    }
  } catch (err) {
    return false;
  }

  return false;
}

async function isValidResolution(resolution) {
  let resolutions;
  try {
    resolutions = await query_db(
      "WITH TVS AS (select * from walmart union all select * from amazon) SELECT DISTINCT RESOLUTION FROM TVS WHERE RESOLUTION IS NOT NULL;"
    );
    for (let i = 0; i < resolutions.length; i++) {
      if (resolution === resolutions[i].resolution) return true;
    }
  } catch (err) {
    return false;
  }

  return false;
}

async function ProcessSearch(search_settings) {
  let custom_query = "WITH TVS AS (SELECT * FROM ";

  if (search_settings.store === "Store...") {
    custom_query = custom_query + "WALMART UNION ALL SELECT * FROM AMAZON)";
  } else if (
    search_settings.store == "Walmart" ||
    search_settings.store == "Amazon"
  ) {
    custom_query = custom_query + search_settings.store + ")";
  } else {
    return "ERROR: STORE";
  }

  //the reason for 1=1 is to make forming the query much easier on the react code. Otherwise, need to check if any input is changed from default value.
  custom_query = custom_query + " SELECT * FROM TVS WHERE 1=1 ";

  if (search_settings.brand !== "Brand...") {
    if (await isValidBrand(search_settings.brand)) {
      custom_query =
        custom_query + " AND (brand ='" + search_settings.brand + "')";
    } else {
      return "ERROR: BRAND";
    }
  }

  //need to do more work for price since the input options are different than the true text into psql db
  switch (search_settings.price) {
    case "Price...": {
      break;
    }

    case "Under $500": {
      custom_query = custom_query + " AND (price < 500)";
      break;
    }
    case "Under $1000": {
      custom_query = custom_query + " AND (price < 1000)";
      break;
    }
    case "Under $1500": {
      custom_query = custom_query + " AND (price < 1500)";
      break;
    }
    case "Under $2000": {
      custom_query = custom_query + " AND (price < 2000)";
      break;
    }
    case "$2000+": {
      custom_query = custom_query + " AND (price >= 2000)";
      break;
    }
    default: {
      return "ERROR: PRICE";
    }
  }

  switch (search_settings.display_size) {
    case "Size...": {
      break;
    }

    case '<30"': {
      custom_query = custom_query + " AND (display_size < 30)";
      break;
    }
    case '<50"': {
      custom_query = custom_query + " AND (display_size < 50)";
      break;
    }
    case '<60"': {
      custom_query = custom_query + " AND (display_size < 60)";
      break;
    }
    case '<70"': {
      custom_query = custom_query + " AND (display_size < 70)";
      break;
    }
    case '70"+': {
      custom_query = custom_query + " AND (display_size >= 70)";
      break;
    }
    default: {
      return "ERROR: DISPLAY_SIZE";
    }
  }

  if (search_settings.technology !== "Technology...") {
    if (await isValidTechnology(search_settings.technology)) {
      custom_query =
        custom_query +
        " AND (display_tech = '" +
        search_settings.technology +
        "')";
    } else {
      return "ERROR: TECHNOLOGY";
    }
  }

  if (search_settings.resolution === "Resolution...") {
    //do nothing
  } else if (await isValidResolution(search_settings.resolution)) {
    custom_query =
      custom_query + " AND (resolution ='" + search_settings.resolution + "')";
  } else {
    return "ERROR: RESOLUTION";
  }

  return custom_query;
}

//listen to the default specified port (whatever it is from env)
app.listen(port, function() {
  console.log("NOW LISTENING ON PORT: " + String(port));
});

//Handle post requests to main domain
app.post("/", async function(request, response) {
  let processed_query = await ProcessSearch(request.body);

  console.log(processed_query);

  if (processed_query.slice(0, "ERROR".length) == "ERROR") {
    response.status(400).send("INVALID REQUEST.");
  } else {
    let db_query;
    try {
      db_query = await query_db(processed_query);
      response.status(200).send(db_query);
    } catch (err) {
      response.status(400).send(db_query);
    }
  }
});
