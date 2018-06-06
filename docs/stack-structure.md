# Cortex Structure: Stack and Hosting

A quick overview of the dependencies for the API and database:
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

The Database is deployed on an instance of [AWS EC2](http://aws.amazon.com/ec2/) hosted by [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?jmp=docs&_ga=2.199929194.530729967.1526360843-106194169.1523349626). Atlas is a hosted database as a service that deploys MongoDB on AWS EC2 instances. The Atlas GUI makes management of the DB just a little easier. For security reasons, access to the database requires your IP to be whitelisted. Configuration and access to the Atlas instance is explained in the "MongoDB Compass" section above.

The API is deployed on its own instance of [AWS EC2](http://aws.amazon.com/ec2/) and is managed through the AWS console.

The Dashboard client `build` hosted in [Firebase](https://console.firebase.google.com/). The reason for switching from S3 to Firebase is because S3 does not support hosting Single-Page Applications (SPAs) with proper URLs. Even after following [Keita's solution](https://keita.blog/2015/11/24/hosting-a-single-page-app-on-s3-with-proper-urls/) and [John Louros' solution](https://johnlouros.com/blog/using-CloudFront-to-serve-an-SPA-from-S3) to use CloudFront to serve an SPA hosted on S3, it still didn't seem right. Because SPAs use  `pushState` to simulate URLs, it's always going to return a 404 error response when jumping to a nested url. Overwriting 404 responses just seems like a bandaid solution. Firebase Hosting, on the other hand, fully supports SPAs. Out of the box, Firebase Hosting provides HTTPS, uses CDNs to deliver global fast access, and uses URL rewriting to stop the server from throwing 404s.

Uploaded content and all other static files are hosted in an [AWS S3 Bucket](https://aws.amazon.com/s3/), aptly named `cortexuploads`. S3 servers are made for serving static files quickly and reliably. If the load increases, files are automatically replicated to more servers so they will always be available. Additionally, CloudFront works in conjunction with S3. When activated on the bucket, files are moved to edge locations so that they are available for high speed transfer. It's also very cost-effectve: If only a few files get little traffic, it's only a few cents a month.

Essentially the benefits of this structure are:
- Separation of Code
- Separation of Deployment
- Faster Iteration
- Simpler Product Logic

These benefits proved themselves numerous times throughout the development lifecycle. For example, when deployment of the dashboard client build did not work well on the same EC2 instance as the API (and because I wanted to stay in the free tier, I didn't run a second EC2 instance), I switched to hosting the build on S3 buckets. This worked only until I wanted to use the Google domain name I purchased. After using AWS Route 53 and CloudFront to deploy the build, I had just learned that S3 does not support URL rewriting (something important for SPA's, as explained earlier). Anyway, the point is: during the entire time I was figuring out where best to deploy the dashboard client, I never once had to touch the API or database. <b>Separation of code and deployment allows me to not be locked into one service entirely. If one service fails, other parts of the stack are not necessarily affected</b>.
