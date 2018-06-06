# Development Resources

<i>This section helps explain a few things in the project and gives developer notes and tidbits that I found are good reminders or lessons I've personally learned along the way.</i>

`/src/server.js` is the app entry and defines all the packages, configurations, and routing needed for the server.

# server.js

## `app.use(bodyParser.urlencoded({ extended: true }));`

The `extended` option determines which parsing library to use. If extended is true, express will use `qs`. If false, express will use `querystring`. More information available [here](https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0).

Cortex API is using `qs` to more easily support and parse advanced queries.

## `app.options('*', cors());`

Enables CORS pre-flight across all routes. This is needed because we have certain CORS requests that are considered 'complex' and require an initial OPTIONS request (called the "pre-flight request"). An example of a 'complex' CORS request is one that uses an HTTP verb other than GET/HEAD/POST (such as DELETE) or that uses custom headers. To enable pre-flighting, we add a new OPTIONS handler for all `('*')` routes. More information available [here](https://github.com/expressjs/cors).

# `default` in schema

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

# Save one or more documents to database

(`Model.create()`)[http://mongoosejs.com/docs/api.html#create_create] is a shortcut for saving one or more documents to the database.` MyModel.create(docs)` does new `MyModel(doc).save()` for every doc in docs.

This is useful for bulk uploading of terms or bulk updating content.

Related Model Methods:
- `Model.bulkWrite()`
- `Model.deleteMany()`
