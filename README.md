# Crestine Sagefolio Showcase

Implement exactly the screenshot and nothing else

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://crestine-sagefolio-showcase.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/60ae2503-6b64-4ccb-af95-3381bca32ce4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Portfolio editing and database

Use the profile photo or **Edit Profile** control to open the portfolio manager. Every section
uses labeled text fields; list entries can be added or removed without editing JSON. Changes are
saved to a SQLite database on the server and appear on the public portfolio.

Work samples support downloadable file attachments (PDF, Office documents, and common image
formats) up to 2 MB each. Attachments are stored with portfolio data in the SQLite database.
Previously saved Google Sheets URLs are not converted into files; reattach a file to make a sample
downloadable.

The sidebar, hero, and contact profile photos can each be changed by choosing a JPG, PNG, GIF, or
WEBP file up to 2 MB from the computer. Image data is stored in the SQLite database; no image URL
or external image hosting is required.

The server requires Node.js 22.13 or newer (Node.js 24 recommended) and a writable, persistent
directory. Set the admin credentials before starting the app. To test the production build locally,
run `npm run build` first, then `npm run preview`:

```powershell
$env:PORTFOLIO_ADMIN_USERNAME = "crestin123"
$env:PORTFOLIO_ADMIN_PASSWORD = "<your-private-password>"
npm run build
npm run preview
```

For deployment, run `npm run build` during the build step and `npm run start` to launch the built
Node.js server.

By default, the database is created at `data/portfolio.sqlite`. Set `PORTFOLIO_DB_PATH` to use a
different location. For deployment, use a Node.js server with persistent storage and configure
the same admin variables there; serverless or Cloudflare deployments without persistent SQLite
storage are not supported.

The **View Resume** links open `public/resume.pdf` in a new tab.
