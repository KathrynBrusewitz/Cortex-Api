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
For basic access:
```
{
  success: boolean,
  token: string,
  payload: {
    entry: string,
  }
}
```

For user access:
```
{
  success: boolean,
  token: string,
  payload: {
    _id: string,
    name: string,
    email: string,
    roles: [string],
    entry: string,
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
  success: boolean,
  token: string,
  payload: decoded object,
}
```

# `POST api.cortexdash.com/1.0/users`

Add a new user to the userbase. Name, roles, and email are required. All other information are optional. 

An admin can add a new user with their name, role(s), and email. This may be a writer or artist who cannot or will not provide a password. If the writer or artist would like to have an account to login with, 1) the new user can request a password reset for their email, and then 2) follow the instructions emailed to them to set a password.

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
}
```

## Response

```
{
  success: boolean,
  payload: {
    _id: string
  }
}
```

# `GET api.cortexdash.com/1.0/me`
Returns information about the current logged-in user. Having this accessible at the root level makes accessing deeper levels of your personal information more consistent.

## Request
Authentication: Required

Request Query: None

Request Body: None

## Response
```
{
  success: boolean,
  payload: user object,
}
```

# `GET api.cortexdash.com/1.0/users`
Returns users from userbase.

## Request
Authentication: Required

Request Query:
```
TODO
```

Request Body: None

## Response
```
{
  success: boolean,
  payload: array of users,
}
```




# `TODO`

api.get("/users/:id", verifyToken, UsersController.getUser);

api.put("/users/:id", verifyToken, UsersController.putUser);

api.delete("/users/:id", verifyToken, UsersController.deleteUser);

api.post("/users/invite", verifyToken, UsersController.inviteUser);

api.get("/contents", verifyToken, ContentsController.getContents);

api.get("/contents/:id", verifyToken, ContentsController.getContent);

api.post("/contents", verifyToken, ContentsController.postContent);

api.put("/contents/:id", verifyToken, ContentsController.putContent);

api.delete("/contents/:id", verifyToken, ContentsController.deleteContent);

api.get("/terms", verifyToken, TermsController.getTerms);

api.get("/terms/:id", verifyToken, TermsController.getTerm);

api.post("/terms", verifyToken, TermsController.postTerm);

api.put("/terms/:id", verifyToken, TermsController.putTerm);

api.delete("/terms/:id", verifyToken, TermsController.deleteTerm);

api.get("/events", verifyToken, EventsController.getEvents);

api.get("/events/:id", verifyToken, EventsController.getEvent);

api.post("/events", verifyToken, EventsController.postEvent);

api.put("/events/:id", verifyToken, EventsController.putEvent);

api.delete("/events/:id", verifyToken, EventsController.deleteEvent);

api.get("/search", verifyToken, SearchController.search);
