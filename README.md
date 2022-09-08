<img align="left" src="https://github.com/therealvidem/bardle/blob/develop/static/favicon.png" width="120px">

# Wordle Clone

Powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte). Website uses MongoDB as the database. Note: The original repository is https://github.com/therealvidem/bardle on my personal account, but the words in it are revolved around a niche topic. This version at https://wordle.tuon.dev/, which uses this repository, uses this [word list](https://github.com/tabatkins/wordle-list).

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
