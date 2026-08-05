# Dr. Ishwari Pethkar — Website + Admin Panel

A full-stack version of the physiotherapy website: the public site, a small
backend API, and an admin panel to manage appointment requests and blog
posts — no coding needed to update content day-to-day.

## What's inside

```
server/
  public/            the public website (index.html)
  public/admin/       the admin panel (login + dashboard)
  src/                the backend (Express server + API routes)
  data/db.json        all data (bookings, blog posts, admin login) — created automatically
  .env                admin email/password + settings
```

## Requirements

- [Node.js](https://nodejs.org) version 18 or newer installed on your computer.

## Setup (do this once)

1. Open a terminal in the `server` folder.
2. Install dependencies:
   ```
   npm install
   ```
3. Create the admin account (reads the email/password from `.env`):
   ```
   npm run seed
   ```

## Running the site

```
npm start
```

Then open in your browser:
- **Public website:** http://localhost:4000
- **Admin panel:** http://localhost:4000/admin

Leave the terminal window open while you're using the site — closing it stops the server.

## Admin login

- **Email:** ishwaripethkar49@gmail.com
- **Password:** 12345678

You can change these any time by editing `ADMIN_EMAIL` and `ADMIN_PASSWORD`
in the `.env` file, then running `npm run seed` again to apply the change.

## What the admin panel can do

- **Overview** — quick counts of appointment requests and blog posts.
- **Bookings** — see every appointment request submitted through the
  "Request Appointment" form on the site, mark them as New / Contacted /
  Done, or delete them.
- **Blog Posts** — add, edit, publish/unpublish, or delete blog posts. Photos
  can be pasted as a link or uploaded straight from your device. These show
  up automatically in the "From the Blog" section of the public site.
- **Site Photos** — replace the homepage hero photo and the About Me photo
  by uploading a picture from your phone or computer. No editing files
  needed.
- **Colors & Theme** — change every main color used on the site (background,
  text, buttons, accents, borders) with simple color pickers. Click **Save
  Colors** to apply them everywhere, or **Reset to Default** to go back to
  the original look.

### A note about the "demo form" message

If you ever see "Thanks! This is a demo form..." pop up, it means the page
being viewed is an old standalone copy of the site, not the one running
through this server. The real site — the one with working forms, live blog
posts, and your custom photos/colors — only works while running through
`npm start` and viewing http://localhost:4000. Always share/open that URL,
not a loose `index.html` file.

## Important security notes

This is set up for personal / learning use. Before putting the site on the
public internet (a real domain, hosting, etc.):

1. **Change the admin password** — the one above is only a starting default.
2. **Change `JWT_SECRET`** in `.env` to a long random string.
3. Serve the site over **HTTPS**, and uncomment the `secure: true` line in
   `src/routes/authRoutes.js` so the login cookie only travels over HTTPS.
4. `data/db.json` holds all bookings and posts in plain text — back it up
   periodically, and don't commit it to a public GitHub repo.

## How data is stored

There's no separate database to install — everything is saved to a single
`data/db.json` file on disk. This keeps setup simple and is fine for a
personal site with light traffic. If the site grows a lot busier later, this
can be swapped for a real database (e.g. PostgreSQL) without changing the
frontend.
