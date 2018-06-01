<h1 align="center">
  Cortex API
</h1>

Cortex API is a lightweight and extensible CMS supporting both common CMS usage and special features for especially science content creators like Grey Matters Journal.

# Contents

1. Project Setup for Development
2. Development Tools
3. Development Workflow
4. [Endpoints](./Endpoints.md)
4. Development Resources
5. Building the Project for Production
6. Hosting and Deployment

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

# Development Tools

<i>This section introduces a few tools I found were helpful to have during development. You don't need them, but you might find them useful too.</i>

## MongoDB Compass (Optional)

[MongoDB Compass](https://www.mongodb.com/products/compass) is a GUI for managing the database.

To connect to your local MongoDB instance, this simple configuration works fine for me:
![Compass-Config-1](https://s3-us-west-2.amazonaws.com/cortexdocs/MongoDB-Compass-Config-1.png)

To connect to the production instance hosted in MongoDB Atlas, you will need access to the Atlas account and whitelist your IP address. The easiest way to set the configuration would be to copy it over from Atlas into Compass. To do this:
1. Log into [Atlas](https://cloud.mongodb.com/).
2. Navigate to the Project and there will be a page listing Clusters. 
3. Click the `Connect` button in the approprate Cluster. 
4. You will see a list of whitelisted IP addresses. Add yours if you haven't already. 
5. Then select `Connect with MongoDB Compass`. 
6. Follow the instructions. When you are asked to `Copy the URI Connection String`, select `I am using Compass 1.12 or later`.
7. Copy the URI String.
8. Open up MongoDB Compass. It should detect the URI string from your clipboard and auto-populate the form.

The resulting configuration would look something like this:
![Compass-Config-2](https://s3-us-west-2.amazonaws.com/cortexdocs/MongoDb-Compass-Config-2.png)

## Robo 3T (Optional)

[Robo 3T](https://robomongo.org/) is another GUI for managing the database. Set the address to `localhost` and the port to `27017`. Name the connection anything you want.

## POSTman (Optional)

[POSTman](https://www.getpostman.com/) tests routes through a GUI. The collection of API queries will be made available soon.

![Postman-GUI](https://s3-us-west-2.amazonaws.com/cortexdocs/Postman-GUI.png)

# Development Workflow

<i>This section is incomplete and will be finished at a later time...</i>

The `/src/` is split into:
- `/controllers/`
- `/middleware/`
- `/models/`

# Endpoints

All Endpoints are documented in the [Endpoints file](./Endpoints.md)

# Development Resources

<i>This section helps explain a few things in the project and gives developer hints and tips or otherwise tidbits that I found are good reminders or lessons I've personally learned along the way.</i>

`/src/server.js` is the app entry and defines all the packages, configurations, and routing needed for the server.

A quick explanation of the dependencies:
- `express` is the Node framework
- `aws-sdk` provides a JavaScript API for AWS services
- `multer` handles `multipart/form-data`, which we use for uploading to AWS S3
- `cors` provides Connect/Express middleware that can enable CORS with various options.
- `mongoose` is the driver helping us to interact with our MongoDB database
- `mongoose-deep-populate` enables population of nested models at any level of depth
- `morgan` logs requests to the console
- `body-parser` lets us get info from POST requests and URL parameters
- `jsonwebtoken` is how we create, sign, and verify JSON Web Tokens
- `bcrypt` salts and hashes passwords and compares them safely without JS string comparison functions
- `uuid` generates and returns a RFC4122 v4 UUID

### `app.use(bodyParser.urlencoded({ extended: true }));`

The `extended` option determines which parsing library to use. If extended is true, express will use `qs`. If false, express will use `querystring`. More information available [here](https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0).

Cortex API is using `qs` to more easily support and parse advanced queries.

### `app.options('*', cors());`

Enables CORS pre-flight across all routes. This is needed because we have certain CORS requests that are considered 'complex' and require an initial OPTIONS request (called the "pre-flight request"). An example of a 'complex' CORS request is one that uses an HTTP verb other than GET/HEAD/POST (such as DELETE) or that uses custom headers. To enable pre-flighting, we add a new OPTIONS handler for all `('*')` routes. More information available [here](https://github.com/expressjs/cors).

## `default` in schema

The `default` attribute is added to the query if that field does not exist in the database. For example,

User Model:
```
module.exports = mongoose.model(
  'User',
  new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false, default: null },
    bio: { type: String, default: '' },
  })
);
```

If the `bio` field is empty for a user in the database, querying the user will receive the `bio` field filled in from the `default` attribute - in this case, an empty string.

## Save one or more documents to database

(`Model.create()`)[http://mongoosejs.com/docs/api.html#create_create] is a shortcut for saving one or more documents to the database.` MyModel.create(docs)` does new `MyModel(doc).save()` for every doc in docs.

This is useful for bulk uploading of terms or bulk updating content.

Related Model Methods:
- `Model.bulkWrite()`
- `Model.deleteMany()`

# Building the Project for Production

<i>These docs are in progress...</i>

## Database

<i>These docs are in progress...</i>

## API

<i>These docs are in progress...</i>

## Dashboard

<i>These docs are in progress...</i>

# Hosting and Deployment

## Introduction: Structure

The Database is deployed on an instance of [AWS EC2](http://aws.amazon.com/ec2/) hosted by [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?jmp=docs&_ga=2.199929194.530729967.1526360843-106194169.1523349626). Atlas is a hosted database as a service that deploys MongoDB on AWS EC2 instances. The Atlas GUI makes management of the DB just a little easier. For security reasons, access to the database requires your IP to be whitelisted. Configuration and access to the Atlas instance is explained in the "MongoDB Compass" section above.

The API is deployed on its own instance of [AWS EC2](http://aws.amazon.com/ec2/) and is managed through the AWS console.

The Dashboard client `build` hosted in [Firebase](https://console.firebase.google.com/). The reason for switching from S3 to Firebase is because S3 does not support hosting Single-Page Applications (SPAs) with proper URLs. Even after following [Keita's solution](https://keita.blog/2015/11/24/hosting-a-single-page-app-on-s3-with-proper-urls/) and [John Louros' solution](https://johnlouros.com/blog/using-CloudFront-to-serve-an-SPA-from-S3) to use CloudFront to serve an SPA hosted on S3, it still didn't seem right. Because SPAs use  `pushState` to simulate URLs, it's always going to return a 404 error response when jumping to a nested url. Overwriting 404 responses just seems like a bandaid solution. Firebase Hosting, on the other hand, fully supports SPAs. Out of the box, Firebase Hosting provides HTTPS, uses CDNs to deliver global fast access, and uses URL rewriting to stop the server from throwing 404s.

Uploaded content and all other static files are hosted in an [AWS S3 Bucket](https://aws.amazon.com/s3/), aptly named `cortexuploads`. S3 servers are made for serving static files quickly and reliably. If the load increases, files are automatically replicated to more servers so they will always be available. Additionally, CloudFront works in conjunction with S3. When activated on the bucket, files are moved to edge locations so that they are available for high speed transfer. It's also very cost-effectve: If only a few files get little traffic, it's only a few cents a month.

Essentially the benefits of this structure are:
- Separation of Code
- Separation of Deployment
- Faster Iteration
- Simpler Product Logic

## Atlas

For our purposes, we are using a free M0 shared cluster (a sandbox instance for getting started), with shared RAM and encrypted 512 MB Storage, MongoDB 3.6 and no backup (only available with M10+).

- Max concurrent connections: 100
- Networking performance: Low
- Max databases: 100
- Max collections: 500

## EC2

[`forever`](https://github.com/foreverjs/forever) is a simple CLI tool for ensuring that a given script runs continuously.

Common API Use:
- `forever start ./cortex-api/src/server.js`: Start the server
- `forever list`: List all apps that are running
- `forever stop` or `forever stopall`: Stop app(s)

### Deploying Files to EC2 (Current)

Log into the server with `SSH`. Go into the `api` folder and run `git pull` to get the latest changes. Make sure to run `yarn install` for any new dependencies or package updates. The API server listens on port `8080`.

### Deploying Files to EC2 (Outdated)

<i>Completely unnecessary now, but is good to keep here just in case for future use.</i>

Use ssh-agent and ssh-add to load the key into memory:
```
> eval $(ssh-agent)
> ssh-add ~/.ssh/1234-identity
```

Copy folder over to server: `rsync -az /local/storage/to/copy/from <EC2IPv4>:/remote/storage/to/paste/to`

## S3

- (A little outdated) [Guide to Deploying React App to S3](https://www.fullstackreact.com/articles/deploying-a-react-app-to-s3/)
- Docs: [Configuring a Bucket for Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html)
- `s3cmd` looks like a useful, dedicated CLI

There is one bucket: `cortexuploads`. It has permissions for public reading.

## Subjects left to cover
- Firebase Hosting Deployment
- Accounts overview (google acct/domains/analytics, aws, atlas)
- SSH (ec2-api)
- GitHub Deployment Management and Keys (ec2-api)
- Security Groups (ec2-api)
- Bucket Policy and Permissions Script (s3-uploads)
  - read-only permissions for anonymous users
  - policy provided in the AWS examples
- Cloudfront service (s3-uploads)