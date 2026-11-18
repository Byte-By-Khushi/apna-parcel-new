# Apna Parcel — fresh prototype

Node/Express + MySQL project with customer/hub/admin roles, hub approval, booking approval, parcel status updates, locker assignment and pickup PIN hash verification, tracking timeline, multilingual UI (English/Hindi/Marathi), and light/dark theme.

## 1. MySQL setup
- Connect to your local MySQL instance in Workbench.
- Open and execute `schema.sql` (creates the database).

## 2. Configure
- Copy `.env.example` to `.env` in this project folder.
- Set your MySQL password in `MYSQL_PASSWORD`. Leave it blank only if your local root account uses no password.
- Set a new `SESSION_SECRET` and preferably change `ADMIN_PASSWORD`.

## 3. Run
Open a terminal in this folder:

```bash
npm install
npm start
```
Then open http://localhost:3000

## Admin local account
By default, the initial admin is created on server startup from `.env`:
- Email: `admin@apnaparcel.local`
- Password: `Admin@12345`

Change these values in `.env` before using the app and use only for local prototype. If the admin account was already seeded, changing env values alone does not reset the stored password.

## Workflow
- Customer accounts can register and book parcels.
- Hub registrations remain pending until admin approves/rejects.
- Admin reviews bookings and approves/rejects them.
- Admin updates parcel stages; at `Stored - PIN Generated`, selects an approved hub and locker slot, and a pickup PIN is generated.
- The generated PIN is shown once to the admin in the browser response; SMS/WhatsApp delivery is not wired up and needs a messaging provider.
- Customer login can track and submit the PIN for collection; collection status is recorded.

## Limitations / demo safeguards
This is a college-project prototype, not a production logistics system. It uses the built-in Express MemoryStore for sessions (not production-safe), does not have external SMS/email delivery, real scanning, payment, detailed audit controls, or physical locker hardware integration. For this prototype, tracking is accessible by tracking ID; the pickup PIN is never returned by public tracking and is stored as a bcrypt hash.
