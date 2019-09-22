# Backend Component

## Getting Started

### Dependencies

- High enough version of Node & NPM to use/install all packages found in `package.json`

Run `npm install` to get all necessary packages to run the node application.

### Setting the PSQL credentials

To secure the credentials, this component uses the [dotenv](https://www.npmjs.com/package/dotenv) and [secure-env](https://www.npmjs.com/package/secure-env) packages. To quickly summarize their usage, create a new .env file in the same root directory, and fill out the credentials like so:

```Host='your_host_name'
Database='your_database_name'
User='your_user_name'
Port=your_port_num
Password='your_password'
```

Then run `secure-env .env -s mySecretPassword`. You should now have an encrypted version of the .env file as .env.enc, and should throw away the .env file for safety. I'd also recommended to use a throwaway password, since the password will be visible on the source code.

On the node application itself, when `global.env` is assigned using `secureEnv`, you must also change the secret to whatever you replaced `mySecretPassword` with when running the secure-env command above to decrypt your .env.enc file.

By default, the port will be whatever the port value of the environment variable is. You can change this to whatever port you want to use if you'd like.

## Implementation

The routing is handled using the [express](https://www.npmjs.com/package/express) framework.

Currently, since the pure focus of this application is to receive psql queries to get TV's available from a specified database, there is no routing for 'GET' requests. Only a routing for POST requests are handled.

### POST Requests

What's expected upon every request is a stringified JSON object with the following format:

```
{
  store: "Store_Name",
  brand: "Brand_Name",
  price: "Price",
  display_size: "Size",
  technology: "Technology",
  resolution: "Resolution"
}
```

These values MUST also be the ones listed on the search filter from the react app, or the query will not be processed. If the site is used as expected, only those values should be possible to send, and the rest should be viewed as potentially malicious.

### Request Filtering

Once a post request is made, that request is processed through `ProcessSearch()`. Here, each field is verified that it is a valid input.

It should be noted that to verify brand, technology, and resolution, this app will always query the database for the existing values and search against that list with what the POST request contains.

If the search is valid, a request to the query will be made, and that resulting list will be sent back as a POST response.

### Functions Used

Each function used is asynchronous. Every function will at some point require some information that requires use of the database.

`ProcessSearch()`: Takes a JSON object, and checks if all necessary fields are both present and valid. Returns `true` if valid, and `ERROR: FIELD_NAME` upon failure of verifying a particular field.

`isValidBrand()`: Takes a brand string and verifies directly with the database if it's a valid value.

`isValidTechnology()`: Analogous to `isValidBrand()`.

`isValidResolution()`: Analogous to `isValidBrand()`.

`query_db()`: Takes a string version of a PSQL query, and attempts to login with the provided credentials, and run the provided query. Resolves to the query if successful, and rejects if an issue with connecting or with the query.
