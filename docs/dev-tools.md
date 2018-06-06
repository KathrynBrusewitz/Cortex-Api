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
