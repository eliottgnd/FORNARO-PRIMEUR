# Email Setup Guide

When you purchase a domain for your Fornaro website, follow these steps to enable email sending.

## 1. Add SPF TXT Record

After buying your domain, go to your domain registrar's DNS settings and add:

| Setting       | Value                                             |
| ------------- | ------------------------------------------------- |
| **Name/Host** | `@`                                               |
| **Type**      | TXT                                               |
| **Value**     | `v=spf1 a mx include:relay.mailchannels.net ~all` |

This authorizes Cloudflare's mail relay to send emails on behalf of your domain.

## 2. Wait for DNS Propagation

DNS changes can take anywhere from a few minutes to 48 hours to propagate globally.

## 3. Environment Variable (Optional)

In your `.env` file, update the `FROM_EMAIL` to use your new domain:

```env
FROM_EMAIL="Fornaro <noreply@yourdomain.com>"
```

The `VERCEL_EMAIL_TOKEN` variable can be left empty or removed - it is not used by `vercel-email`.

## How It Works

`vercel-email` sends emails through Cloudflare's edge network via MailChannels, which provides free outbound email relay. No paid email service or API keys are required.

## Troubleshooting

If emails still fail after adding the SPF record:

1. Verify the TXT record is correctly set using [dnschecker.org](https://dnschecker.org/#txt/yourdomain.com)
2. Ensure the `FROM_EMAIL` domain matches the domain with the SPF record
3. Check that your registrar doesn't block TXT records or require additional verification
