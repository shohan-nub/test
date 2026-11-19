# SparkLab inquiry email setup

The project inquiry form submits to `/api/contact`. Inquiries go to `heysparklab@gmail.com` through Gmail SMTP once the server has a Google App Password. The visitor’s email is used as Reply-To. The form reports success after the provider accepts the message.

## Enable Google 2-Step Verification

1. Sign in to the Google account for `heysparklab@gmail.com`.
2. Open **Google Account → Security → 2-Step Verification** and complete setup. [Google 2-Step Verification help](https://support.google.com/accounts/answer/185839)
3. Open **App passwords** and create an entry named **SparkLab Website**. Copy the generated password when Google displays it. [Google App Passwords help](https://support.google.com/accounts/answer/185833)

## Configure the local server

Copy the server-side settings from `.env.example` into your existing `.env.local`, or create `.env.local` if needed. Enter the generated password as `SMTP_PASS`, then restart Next.js.

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=heysparklab@gmail.com
SMTP_PASS=
CONTACT_TO_EMAIL=heysparklab@gmail.com
CONTACT_FROM_NAME=SparkLab Website
```

Keep the password in `.env.local` and the hosting provider’s secret store. Use the App Password in place of your regular Google password. Keep the SMTP variables server-side without a `NEXT_PUBLIC_` prefix.

## Configure production and test delivery

1. Add the same seven variables to the production environment in your hosting dashboard, with the App Password marked as secret. Redeploy so the server reads the settings.
2. Open `/contact` and submit a clearly labeled test inquiry using an email address you control.
3. Check the Gmail inbox and Spam folder for **New SparkLab Project Inquiry — [Sender Name]**. Confirm the service, budget, project description, and submission time. Hit Reply to verify the address matches the email entered in the form.
4. Confirm an actual delivery before relying on the production form. The current form keeps its existing fields. The notification shows **Not provided** for timeline when absent, and includes a website URL only when supplied to the endpoint.

## Troubleshoot delivery

- **Authentication failed**. Confirm `SMTP_USER` is the account that created the App Password. Regenerate the App Password if the Google account password has changed, update `SMTP_PASS`, and restart or redeploy.
- **Connection timed out**. Confirm the host allows outbound TLS to `smtp.gmail.com:465` and that `SMTP_SECURE=true`.
- **App passwords are unavailable**. Google may restrict the feature for managed accounts, Advanced Protection, or some 2-Step Verification setups. Use the existing Resend alternative with a verified sending domain. Leave `SMTP_PASS` blank, configure `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` for the verified sender, and keep `CONTACT_TO_EMAIL=heysparklab@gmail.com`. [Google App Passwords help](https://support.google.com/accounts/answer/185833) · [Resend domain setup](https://resend.com/docs/dashboard/domains/introduction)
