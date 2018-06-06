# Project Setup for Development

<i>This section walks through first-time setup to get the project up and running on your local machine. Essentially install dependencies, setup MongoDB, create a config file for the server, and finally run the server.</i>

## 1. Install Dependencies

1. Clone or fork this repo: `git clone https://github.com/KathrynBrusewitz/cortex-api`

2. Inside the root directory, run `yarn install` to install all dependencies defined in `package.json`

## 2. Setup MongoDB

1. Install MongoDB Community Edition. You can install on Mac using either Homebrew or manually. With Homebrew, run `brew update` and `brew install mongodb`. More instructions are available in their [documentation](https://docs.mongodb.com/manual/administration/install-community/).

2. Start up MongoDB by running `mongod`. You should see `waiting for connections on port 27017`.

3. In a different window, connect to the service by running `mongo`, which opens the mongo shell. In the mongo shell, you can issue [mongo shell commands](https://docs.mongodb.com/manual/reference/mongo-shell/).

4. In the mongo shell, create the database for Cortex by running `use cortex-dev`. This command will create a database named `cortex-dev`.

## 3. Create config.js File

Back in the project, create `config.js` inside `/src`.

For local development, your config file should look something like this:
```
module.exports = {
  tokenSecret: "banana", // or whatever you want
  database: "mongodb://127.0.0.1:27017/cortex-dev" // localhost
};
```

For production, your config file should look something like this.
```
module.exports = {
  tokenSecret: <REDACTED>,
  database: "mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTERNAME>.mongodb.net/<DATABASENAME>?retryWrites=true",
  AWS_ACCESS_KEY_ID: <REDACTED>, // for read/write access to S3 uploads bucket
  AWS_SECRET_ACCESS_KEY: <REDACTED>,
};
```

## 3. Run Server

Use nodemon to have the server restart on file changes. Install globally by running `npm install -g nodemon`. Then start up the Node server by running `yarn start`.
