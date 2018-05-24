<h1 align="center">
  Cortex API
</h1>

API for Cortex Admin CMS for Grey Matters App and other science content/experience creators.

Below should give you enough instructions to get started.

# Dev Setup

## Dependencies

Install packages by running `npm install`.

## MongoDB

Install MongoDB. You can install on Mac using either Homebrew or manually. With Homebrew, run `brew update` and `brew install mongodb`.

Start up MongoDB by running `mongod`. You should see `waiting for connections on port 27017`.

Now you just need to connect to the service. Connect to it by running `mongo`. Here you can issue MongoDB commands.

In MongoDB, create the database for Cortex by running `use cortex-dev`.

## Config File

In `/src`, create config file. Call it `config.js`. Inside, write:

```
module.exports = {
  tokenSecret: "banana",
  database: "mongodb://127.0.0.1:27017/cortex-dev"
};
```

## Run Server

Use nodemon to have the server restart on file changes. Install globally by running `npm install -g nodemon`. Then start up the Node server by running `npm start`.

## Dev Tools

### Robo 3T (Optional)

[Robo 3T](https://robomongo.org/) manages the database through a GUI.

In Robo 3T, set the address to `localhost` and the port to `27017`. Name the connection anything you want.


### POSTman (Optional)

[POSTman](https://www.getpostman.com/) tests routes through a GUI.

# Packages and Configuration

`/src/server.js` is the app entry and defines all the packages, configurations, and routing needed for the server. 

A quick explanation of the dependencies:<br>
`express` is the Node framework<br>
`mongoose` is how we interact with our MongoDB database<br>
`morgan` logs requests to the console<br>
`body-parser` lets us get info from POST requests and URL parameters<br>
`jsonwebtoken` is how we create, sign, and verify JSON Web Tokens<br>
`cors` provides Connect/Express middleware that can enable CORS with various options.<br>

### `app.use(bodyParser.urlencoded({ extended: false }));`

The `extended` option determines which parsing library to use. If extended is true, express will use `qs`. If false, express will use `querystring`. More information available [here](https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0).

### `app.options('*', cors());`

Enables CORS pre-flight across all routes. This is needed because we have certain CORS requests that are considered 'complex' and require an initial OPTIONS request (called the "pre-flight request"). An example of a 'complex' CORS request is one that uses an HTTP verb other than GET/HEAD/POST (such as DELETE) or that uses custom headers. To enable pre-flighting, we add a new OPTIONS handler for all `('*')` routes. More information available [here](https://github.com/expressjs/cors).

# Routing and Controllers

<i>The following example API calls use [Axios](https://github.com/axios/axios) and [query-string](https://www.npmjs.com/package/query-string). See `/src/server.js` for most up-to-date routes.</i>

### Errors
```
res.json({
  success: Boolean,
  message: String,
});
```

### `api.post("/authenticate", AuthController.login);`
```
method: 'post',
url: '/authenticate',
baseURL,
data: {
  email,
  password,
  entry: 'dash' or 'app'
}
```
```
res.json({
  success: true,
  token: String,
  payload: User Object,
});
```

### `api.post("/createUser", AuthController.register);`
```
method: 'post',
url: '/createUser',
baseURL,
data: {
  name,
  email,
  password,
  role: 'admin', 'writer', 'reader', or 'artist'
}
```
```
res.json({
  success: true,
});
```

### `api.get("/search", SearchController.search);`
Just searches through content for now. Looks for two fields in url parameters:
- `q`: Search string. Search is case insensitive and looks through `title`, `body`, and `description` fields. If empty, defaults to `{}`.
- `options`: Filters to narrow down search. If empty, defaults to `{}`.

```
import queryString from 'query-string';

// get all articles whose title, body or description match search string
const filters = { q: 'my search string', options: { type: 'article' } };
const query = queryString.stringify(filters);

method: 'get',
url: `/search?${query}`,
baseURL,
```

### `api.get('/contents', ContentsController.getContents);`
Returns all <i>published</i> contents. Can filter contents in url parameters.

To get all contents based on type of content:
```
import queryString from 'query-string';

const filters = { type: 'podcast' }; // get all podcasts
const query = queryString.stringify(filters);

method: 'get',
url: `/contents?${query}`
baseURL,
```

To get all contents that match an id in an array:
```
import queryString from 'query-string';

const filters = { contentIds: ['id_1', 'id_2', 'id_3' ] };
const query = queryString.stringify(filters);

method: 'get',
url: `/contents?${query}`
baseURL,
```

To get all contents without filtering:
```
method: 'get',
url: '/contents'
baseURL,
```


### `api.get("/contents/:id", ContentsController.getContent);`
Returns <i>published</i> content object given a content id.
```
method: 'get',
url: `/contents/${id}`,
baseURL,
```

### `api.get("/terms", TermsController.getTerms);`
Returns all terms. Can filter terms in url parameters.
```
method: 'get',
url: '/terms',
baseURL,
```

### `api.get("/terms/:id", TermsController.getTerm);`
Returns term object given a term id.
```
method: 'get',
url: `/terms/${id}`,
baseURL,
```

### `api.get("/events", EventsController.getEvents);`
Returns all events. Can filter events in url parameters.
```
method: 'get',
url: '/events',
baseURL,
```

### `api.get("/events/:id", EventsController.getEvent);`
Returns event object given an event id.
```
method: 'get',
url: `/events/${id}`,
baseURL,
```

### `api.get("/user", AuthController.tokenLogin);`
Login with a token. Returns back user object with authenticated token.
```
method: 'get',
url: '/user',
baseURL,
headers: {'x-access-token': your_token,
```

### `api.get("/users", UsersController.getUsers);`
Returns all users. Can filter users in url parameters. Requires token.
```
method: 'get',
url: `/users?${query}`,
baseURL,
headers: {'x-access-token': cookies.get('token')},
```

# Query Conditions

http://mongoosejs.com/docs/populate.html#query-conditions
```
Story.
  find(...).
  populate({
    path: 'fans',
    match: { age: { $gte: 21 }},
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'name -_id',
    options: { limit: 5 }
  }).
  exec();
```

# Deployment

<i>These docs are in progress...</i>

The Database is deployed on an instance of [AWS EC2](http://aws.amazon.com/ec2/) hosted by [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?jmp=docs&_ga=2.199929194.530729967.1526360843-106194169.1523349626). Atlas is a hosted database as a service that deploys MongoDB on AWS EC2 instances. The Atlas GUI makes management of the DB just a little easier. For security reasons, access to the database requires your IP to be whitelisted.

The API is deployed on a separate instance of [AWS EC2](http://aws.amazon.com/ec2/) and is managed through the AWS console.

The Dashboard client is hosted in an [AWS S3 Bucket](https://aws.amazon.com/s3/). S3 servers are made for serving static files like the client `build` quickly and reliably. If the load on dashboard content grows, files are automatically replicated to more servers so they will always be available. Also, CloudFront works in conjunction with S3. When activated on the bucket, content is moved to edge locations, so that content is available for high speed transfer. It's also very cost-effectve: If only a few files get little traffic, it's only a few cents a month.

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

Multi-Application startup options in `fconfig.js`:
```
[
  {
    "uid": "cortex-api",
    "append": true,
    "watch": true,
    "script": "server.js",
    "sourceDir": "/home/ec2-user/cortex-api/src",
    "args": ["--port", "8080"]
  },
  {
    "uid": "cortex-dashboard",
    "append": true,
    "watch": true,
    "script": "index.html",
    "sourceDir": "/home/ec2-user/cortex-dashboard",
    "args": ["--port", "3080"]
  }
]
```

Use `forever start ./fconfig.json` to run script.

## S3

- (A little outdated) [Guide to Deploying React App to S3](https://www.fullstackreact.com/articles/deploying-a-react-app-to-s3/)
- Docs: [Configuring a Bucket for Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html)
- `s3cmd` looks like a useful, dedicated CLI

There are several S3 Buckets:

- `cortexdash`: Not currently used for anything, but reserves the name.
  - Does not store anything.
  - No public permissions.
- `cortexdash.com`: Where client side static files are stored and served from.
  - `http://cortexdash.com.s3-website.us-west-2.amazonaws.com/`
  - Permissions for public viewing.
- `www.cortexdash.com`: Subdomain that redirects to `cortexdash.com`
  - `http://www.cortexdash.com.s3-website.us-west-2.amazonaws.com/`
  - Does not store anything.
  - Permissions for public viewing.
- `api.cortexdash.com`: Subdomain that redirects(?) to the API ec2 instance.
  - Does not store anything.


*Subjects left to cover...*
- Accounts overview (google acct/domains/analytics, aws, atlas)
- SSH (ec2-api)
- GitHub Deployment Management and Keys (ec2-api)
- Security Groups (ec2-api)
- Bucket Policy and Permissions Script (s3-dash)
  - read-only permissions for anonymous users
  - policy provided in the AWS examples
- Build and deployment with AWS CLI and/or `s3cmd` (s3-dash)
- Cloudfront service (s3-dash)
- Custom error responses (s3-dash)

# DNS Configuration

`A` record maps a name to one or more IP addresses, when the IP are known and stable.<br>
`A` records must resolve to an IP. 

`CNAME` and `ALIAS` records must point to a name.

Never use a `CNAME` record for your root domain name: `cortexdash.com`.

`CNAME` records map an alias domain name to a canonical (true) domain name.

The following is not possible because canonical domain names cannot be a URL or path. 
alias: www.cortexdash.com -> canonical: http://www.cortexdash.com.s3-website-us-west-2.amazonaws.com
alias: cortexdash.com -> canonical: http://cortexdash.com.s3-website-us-west-2.amazonaws.com


## Resource records
All of these records have Name/Type/TTL/Data fields. Please note that the records you configure in Google Domains only work when you're using the Google name servers

https://support.google.com/domains/answer/3290350?authuser=2&hl=en&_ga=2.71707219.190081270.1526650379-1076956000.1526200231




Maybe `CNAME` should be used to redirect `www.cortexdash.com` to `cortexdash.com`?


# Deploying Dashboard Build to EC2

Use ssh-agent and ssh-add to load the key into memory:
```
> eval $(ssh-agent)
> ssh-add ~/.ssh/1234-identity
```

Copy folder over to server: `rsync -az /Users/kathryn/Projects/Cortex-Dashboard/build ec2-user@ec2-34-218-235-4.us-west-2.compute.amazonaws.com:/home/ec2-user`


# nginx

```
server {
    listen 80;
    server_name cortexdash.com www.cortexdash.com;
    location / {
        proxy_pass http://127.0.0.1:3080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
     }
}
```
This will have all HTTP web traffic redirected to `port 3080`.

Then on Google Domains, point the DNS to your EC2 public IP `34.218.235.4`:

https://hashnode.com/post/why-is-it-not-recommended-to-serve-static-files-from-nodejs-ciibz8flv01duj3xt4lxuomp3
express.static or koa.send consume cpu time which isn't available for your main app loop until file(s) are sent. In details - express.send cares too much for dynamic stuff like settings response headers, calculating response status, calculating size of files, finding correct mime types, etc, etc, etc. this computing happens on your main app loop but this main loop should be used as much as possible exclusively for your business computations only.

nginx is much better used for serving statics. because it does some clever tricks that can't be done by node.js, like linking mime types semi statically based on file extensions only. It has pre-baked response headers and response status and it has a template for such such responses. nginx not only spends less time for building response headers and status, but also uses os features when available to speed up even further. Additionally nginx runs on different cpu core(s)/thread(s) other than your node.js app.

node.js hint: you always wanna do as less as possible on your main app loop.