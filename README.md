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
  secret: "banana",
  database: "mongodb://127.0.0.1:27017/cortex-dev"
};
```

## Run Server

Use nodemon to have the server restart on file changes. Install globally by running `npm install -g nodemon`. Then start up the Node server by running `npm start`.

## Dev Tools

### Robo 3T (Optional)

You can use [Robo 3T](https://robomongo.org/) to manage the database through a GUI.

In Robo 3T, set the address to `localhost` and the port to `27017`. Name the connection anything you want.


### POSTman (Optional)

You can use [POSTman](https://www.getpostman.com/) to test routes through a GUI.

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
