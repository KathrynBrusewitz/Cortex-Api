# Cortex API

API for Cortex Admin Portal and Grey Matters App.

## Setup

### Dependencies

Install packages by running `npm install`.

### MongoDB

Install MongoDB. You can install on Mac using either Homebrew or manually. With Homebrew, run `brew update` and `brew install mongodb`.

Start up MongoDB by running `mongod`. You should see `waiting for connections on port 27017`.

Now you just need to connect to the service. Connect to it by running `mongo`. Here you can issue MongoDB commands.

In MongoDB, create the database for Cortex by running `use cortex-dev`.

### Robo 3T (Optional)

To make working with the database easier, download [Robo 3T](https://robomongo.org/) to manage it through a GUI.

In Robo 3T, set the address to `localhost` and the port to `27017`. Name the connection anything you want.

### Config File

Create config file. Call it `config.js`. Inside, write:

```
module.exports = {
  secret: "/** ask Kathryn for the secret ;) **/",
  database: "mongodb://127.0.0.1:27017/cortex-dev"
};
```

## Run Server

Use nodemon to have the server restart on file changes. Install by running `npm install -g nodemon`. Then start up the Node server by running `npm start`.
