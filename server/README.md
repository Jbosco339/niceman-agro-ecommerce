# backend_class
## Administrator setup

The public registration endpoint always creates a customer account. Provision the first administrator only on a trusted machine with the server `.env` loaded and Resend configured; the script sends a verification email:

```powershell
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_NAME = "Store Administrator"
$env:ADMIN_PASSWORD = "use-a-unique-strong-password"
npm run admin:create
Remove-Item Env:ADMIN_PASSWORD
```

Run the command from the `server` directory. It refuses to change an existing account and does not enable login before the administrator verifies their email. Keep the administrator password out of shell history, logs, source control, and client code.

Administrator accounts cannot be created through a public signup page or API. Use this trusted provisioning command for each administrator account.

Set `MONGODB_URL`, a high-entropy `JWT_SECRET` (at least 32 characters), `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `CLIENT_URL`, and `API_URL`. Configure `RESEND_API_KEY` with a Resend API key and `RESEND_FROM_EMAIL` with a sender address on a domain verified in Resend. Set `RESEND_WEBHOOK_SECRET` to the signing secret generated for your Resend webhook. Configure the Resend webhook destination as `https://niceman-agro-ecommerce.onrender.com/api/v1/webhooks/resend`; keep the signing secret in the server environment and never put it in the URL. Subscribe to the email events you want to track, such as sent, delivered, bounced, complained, opened, and clicked. The endpoint verifies Resend signatures and updates email delivery status in MongoDB. Set `ADMIN_EMAIL` to the address that should receive new-order notifications and payment receipts. Resend delivers account verification, password reset, order confirmation, admin order notification, and payment receipt emails. Order confirmations include the order reference; once payment is confirmed, the itemized receipt and payment reference are sent to both the customer and admin. Bank-transfer customers can report that they have paid, but payment remains pending until an administrator verifies and approves it. Checkout currently charges no delivery fee. Set `CLIENT_URL` to the exact production frontend origin and `API_URL` to the externally reachable API origin. `PAYSTACK_SECRET_KEY` is only needed if Paystack payments are enabled; other payment methods can continue without it.

## Paystack payments

Set `PAYSTACK_SECRET_KEY` in the server environment only. Use a Paystack test secret key in development and a live secret key in production; never put either key in the client `.env` or source code. Customer checkout requires a signed-in account and server-calculates product prices, delivery, and the final NGN amount.

In the Paystack Dashboard, configure the webhook URL as `https://<your-api-host>/api/v1/payments/webhook`. The endpoint validates `x-paystack-signature` against the raw request body and verifies successful transactions with Paystack before marking an order paid. The callback returns to `<CLIENT_URL>/payment/success`; that page also verifies the transaction server-side and provides a printable receipt. Successful webhook processing sends an email receipt through Resend.

The frontend and API must be deployed over HTTPS for production payments and Paystack webhooks. A webhook URL on localhost is not reachable by Paystack.

Admin APIs are mounted at `/api/v1/admin`; catalog reads remain public at `/api/v1/products`, while writes require an administrator session. Admin and customer sessions use `HttpOnly` cookies and require email verification. MongoDB/Mongoose is used here: PostgreSQL row-level security and SQL parameterization do not apply. Enforce least-privilege MongoDB credentials, network restrictions, encrypted transport, and backups in the database deployment.

Production uses only `https://www.nicemanagro.com` as its frontend origin. The apex host redirects to `www`; browser API calls go through the frontend origin at `/api/v1`, which Vercel proxies to the Render API. This keeps authentication cookies first-party and avoids browsers blocking cross-site cookies. Set the Render `CLIENT_URL` environment variable to exactly `https://www.nicemanagro.com`; the server refuses to start in production if it is set to another origin.
