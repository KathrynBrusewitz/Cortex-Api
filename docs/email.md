# Email with AWS SES

# Pricing

More extensive pricing information: https://aws.amazon.com/ses/pricing/

Since we are sneding email from an application hosted in EC2, we pay 
- $0 for the first 62,000 emails sent per month
- $0.10 per 1,000 emails sent thereafter
- $0.12 per GB of attachments sent, and any additional charges for using EC2 or Elastic Beanstalk

# Domain Verification

To verify our domain cortexdash.com, SES gives a TXT record that must be added to the domain's DNS settings.

https://docs.aws.amazon.com/ses/latest/DeveloperGuide/dkim.html?icmpid=docs_ses_console

DomainKeys Identified Mail (DKIM) provides proof that the email you send originates from your domain and is authentic. DKIM signatures are stored in your domain's DNS system. You can generate DNS records for DKIM now, or do it later by going to the DKIM tab for this domain.

# How to Move Out of SES Sandbox

https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html

# AWS SDK

The [AWS JavaScript SDK Services Docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html) show to how to construct each service's interface object and lists their respective API functions.

```
# Construct SES service object
let ses = new AWS.SES();

# Construct SES service object locked into a specific API version
let ses = new AWS.SES({apiVersion: '2010-12-01'});
```

## Operations of Interest

```
# Composes an email message and immediately queues it for sending.
sendEmail(params = {}, callback) ⇒ AWS.Request

# Composes an email message using an email template and immediately queues it for sending.
sendTemplatedEmail(params = {}, callback) ⇒ AWS.Request

# Composes an email message to multiple destinations.
sendBulkTemplatedEmail(params = {}, callback) ⇒ AWS.Request
```

### `sendEmail()`

- The total size of the message, including attachments, must be smaller than 10 MB.
- If a recipient email address is invalid, the entire message will be rejected, even if the message contains other recipients that are valid.
- The message may not include more than 50 recipients, across the To:, CC: and BCC: fields.
- It is recommended to call SendEmail once for every recipient.

For every message that you send, the total number of recipients (including each recipient in the To:, CC: and BCC: fields) is counted against the maximum number of emails you can send in a 24-hour period (your sending quota). For more information about sending quotas in Amazon SES, see [Managing Your Amazon SES Sending Limits](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/manage-sending-limits.html) in the Amazon SES Developer Guide.
