# Hosting and Deployment

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
