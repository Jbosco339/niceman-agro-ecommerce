# backend_class
## Administrator setup

The public registration endpoint always creates a customer account. Provision the first administrator only on a trusted machine with the server `.env` loaded and a working SMTP configuration; the script sends a verification email:

```powershell
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_NAME = "Store Administrator"
$env:ADMIN_PASSWORD = "use-a-unique-strong-password"
npm run admin:create
Remove-Item Env:ADMIN_PASSWORD
```

Run the command from the `server` directory. It refuses to change an existing account and does not enable login before the administrator verifies their email. Keep the administrator password out of shell history, logs, source control, and client code.

Set `MONGODB_URL`, a high-entropy `JWT_SECRET` (at least 32 characters), `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `CLIENT_URL`, and `API_URL`. Configure SMTP variables to deliver verification and reset messages. Set `CLIENT_URL` to the exact production frontend origin and `API_URL` to the externally reachable API origin. Configure `DELIVERY_FEE` before enabling checkout; checkout fails closed when delivery pricing is missing or invalid.

Admin APIs are mounted at `/api/v1/admin`; catalog reads remain public at `/api/v1/products`, while writes require an administrator session. Admin and customer sessions use `HttpOnly` cookies and require email verification. MongoDB/Mongoose is used here: PostgreSQL row-level security and SQL parameterization do not apply. Enforce least-privilege MongoDB credentials, network restrictions, encrypted transport, and backups in the database deployment. No payment webhook receiver is currently implemented; verify provider signatures before adding one.
