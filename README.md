<img align="left" src="https://github.com/therealvidem/bardle/blob/develop/static/favicon.png" width="120px">

# BARdle

Powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte). Uses MongoDB as the database.

## Developing

Install dependencies with `npm install` (or `pnpm install` or `yarn`). Then, you must create a `.env` file to store the URI of the database:

```bash
touch .env
vim .env # or use any other editor
```

The `.env` file has the following structure:

```
MONGODB_URI=<your URI here>
```

Note, the URI should also point to a specific database (e.g., mongodb+srv://<username>:<password>@<your project>.jdlnt.mongodb.net/<your database name>).

To start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
