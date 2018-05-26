# Status Codes and Error Responses

## Data Errors
- `400` for when the requested information is incomplete or malformed.
  - If a field is missing, return a `400`
- `422` for when the requested information is okay, but invalid.
  - If a field is too short, return a `422`
- `404` for when everything is okay, but the resource doesn’t exist.
- `409` for when a conflict of data exists, even with valid information.
  - If a field value is already taken, return a `409`

## Auth Errors
- `401` for when an access token isn’t provided, or is invalid.
- `403` for when an access token is valid, but requires more privileges.

## Standard Statuses
- `200` for when everything is okay.
- `204` for when everything is okay, but there’s no content to return.
- `500` for when the server throws an error, completely unexpected.

## Standard 200 Response JSON
```
{
  success: true,
  payload: object,
}
```

## Error Response JSON
```
{
  success: false,
  message: 'Some explanation for the error.',
}
```

# Token Authentication

A verified token is required for access to all routes in this guide where authentication is marked as required.

Pass the token through either the request header, url query parameters, or post body parameters. Specifically, the middleware will look for the token in these three places: 
- `req.body.token`
- `req.query.token`
- `req.headers["x-access-token"]`

The following request examples show what this can look like.

## Request
Request Query: `/api/route?token=<TOKEN>`

Request Body: 
```
{
  token: <TOKEN>
}
```

Request Header (recommended): 
```
{
  'x-access-token': <TOKEN>
}
```


# `POST api.cortexdash.com/1.0/login`

Receive a token and related payload. This token is required for access to all other routes. 

A token for basic API access is returned if entry is 'app' and no email or password is given. This is useful for requesting content inside the app without needing to login as a user.

It is on purpose that the token and payload contain the least amount of information necessary. Although tokens are signed, they are not encrypted. Anyone that can obtain the token through unauthorized ways can easily decode it and see any sensitive information. Therefore, they only contain the user `_id` so that you have to query `users/:id`, a protected route that requires authentication.

## Request
Authentication: Not Required

Request Query: None

Request Body:
```
{
  email: string, optional, 
  password: string, optional, 
  entry: string, required, one of ['dash', 'app']
}
```

## Response
When logging in for basic (read-only) access:
```
{
  "success": true,
  "token": string,
  "payload": {
    "entry": "app"
  }
}
```

When logging in as reader for (app) access:
```
{
  "success": true,
  "token": string,
  "payload": {
    "_id": string,
    "entry": "app"
  }
}
```

When logging in as admin for (dash) access:
```
{
  "success": true,
  "token": string,
  "payload": {
    "_id": string,
    "entry": "dash"
  }
}
```

# `GET api.cortexdash.com/1.0/decode`

Verifies and decodes a given token. If verified with the token secret, returns back token and decoded token information. 

This is useful for persistent login. Store in session the token you receive upon logging in. When your application restarts and loses all information, pass back the token to decode it and get back authentication information.

## Request
Authentication: Required

Request Query: None

Request Body: None

## Response
```
{
  success: true,
  token: string,
  payload: decoded object,
}
```

# `POST api.cortexdash.com/1.0/users`

Add a new user to the userbase. Name, roles, and email are required. All other information are optional. 

An admin can add a new user with their name, role(s), and email. This may be a writer or artist who cannot or will not provide a password. If the writer or artist would like to have an account to login with, 1) the new user can request a password reset for their email, and then 2) follow the instructions emailed to them to set a password.

If you're coming from the app, you will automatically be assigned the `reader` role if it's not specified.

## Request
Authentication: Required

Request Query: None

Request Body:
```
{
  name: string, required
  roles: [string], required
  email: string, required
  password: string, optional, default null
  bookmarks: [string], optional, default []
  notes: [object], optional, default []
  bio: string, optional, default ''
}
```

## Response
```
{
  success: true,
  payload: {
    _id: string
  }
}
```

# `GET api.cortexdash.com/1.0/me`
Returns information about the current logged-in user. Having this accessible at the root level makes accessing deeper levels of your personal information more consistent.

## Request
Authentication: Required. You must be logged in as a user.

Request Query: None

Request Body: None

## Response
```
{
  success: true,
  payload: user object,
}
```

# `GET api.cortexdash.com/1.0/users`
Returns users from userbase.

## Request
Authentication: Required.

Request Query:
```
TODO
```

Request Body: None

## Response
```
{
  success: true,
  payload: array of users,
}
```

# `GET api.cortexdash.com/1.0/users/:id`
Returns the user from userbase.

## Request
Authentication: Required

Request Params: `id` should be the user's `_id`

Request Query: None

Request Body: None

## Response
```
{
  success: true,
  payload: user object,
}
```

# `PUT api.cortexdash.com/1.0/users/:id`
Updates and returns the user in the userbase. It only updates the fields that are included in the request body.

## Request
Authentication: Required

Request Params: `id` should be the user's `_id`

Request Query: None

Request Body:
```
{
  name: string, optional
  roles: [string], optional
  email: string, optional
  password: string, optional
  bookmarks: [string], optional
  notes: [object], optional
  bio: string, optional
}
```

## Response
```
{
  success: true,
  payload: updated user object
}
```

# `DELETE api.cortexdash.com/1.0/users/:id`
Deletes and returns the user in the userbase.

## Request
Authentication: Required

Request Params: `id` should be the user's `_id`

Request Query: None

Request Body: None

## Response
```
{
  success: true,
  payload: deleted user object
}
```

# `GET api.cortexdash.com/1.0/contents`
Returns all contents. Can filter contents in url query. If entry is `app`, only published contents are returned.

## Request
Authentication: Required

Request Query:
```
type: optional, 'article' or 'podcast' or 'video'
contentIds: optional
```

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

## Response
```
{
  success: true,
  payload: array of content objects
}
```

# `GET api.cortexdash.com/1.0/contents/:id`
Returns a piece of content.

## Request
Authentication: Required

Request Params: `id` should be the content's `_id`

Request Query: None

Request Body: None

## Response
```
{
  success: true,
  payload: content object
}
```

# `PUT api.cortexdash.com/1.0/contents/:id`
Updates and returns the content. It only updates the fields that are included in the request body.

## Request
Authentication: Required

Request Params: `id` should be the user's `_id`

Request Query: None

Request Body:
```
{
  // Required
  title: { type: String, required: true },
  state: { type: String, enum: ['published', 'unpublished'], required: true, default: 'unpublished' },
  type: { type: String, enum: ['article', 'podcast', 'video'], required: true },
  
  // Optional
  creators: [{ type: ObjectId, ref: 'User', default: [] }],
  updateTime: { type: Date, default: Date.now }, // updateTime == createTime
  publishTime: { type: Date, default: null },
  
  // Content Type Specific Details
  body: { type: String, default: null },
  bodySlate: { type: JSON, default: null }, // JSON format for Slate Framework
  description: { type: String, default: null },
  duration: { type: Number, default: null }, // milliseconds
  references: { type: [{ number: Number, text: String }], default: [] },
  url: { type: String, default: null }, // youtube url, podcast url, etc.
}
```

## Response
```
{
  success: true,
  payload: updated user object
}
```


# `TODO`
api.post("/contents", verifyToken, ContentsController.postContent);

api.delete("/contents/:id", verifyToken, ContentsController.deleteContent);

api.get("/terms", verifyToken, TermsController.getTerms);

api.get("/terms/:id", verifyToken, TermsController.getTerm);

api.post("/terms", verifyToken, TermsController.postTerm);

api.put("/terms/:id", verifyToken, TermsController.putTerm);

api.delete("/terms/:id", verifyToken, TermsController.deleteTerm);

api.get("/search", verifyToken, SearchController.search);

api.post("/users/invite", verifyToken, UsersController.inviteUser);

api.get("/events", verifyToken, EventsController.getEvents);

api.get("/events/:id", verifyToken, EventsController.getEvent);

api.post("/events", verifyToken, EventsController.postEvent);

api.put("/events/:id", verifyToken, EventsController.putEvent);

api.delete("/events/:id", verifyToken, EventsController.deleteEvent);