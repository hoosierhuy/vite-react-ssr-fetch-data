# Vite and React Server Side Rendering (SSR) with Data Fetching, Minimal Manual Setup

NodeJS and Express.js 5 on the backend, I'm using React's `renderToString` from `react-dom/server` and `hydrateRoot` from `react-dom\client` to render React on the server side.

I am using Vite only in the development environment, in production, NodeJS and Express.js are used to serve the React SSR app. Data fetching is accomplished using JavaScript's built-in `fetch` method.

In the package.json file, in the scripts section, I provided you with `build` command to run all the necessary build steps to prepare the app for production. Once the `build` command is executed, you can run the `preview` command to preview the app in the production environment.

Further reading on the topic of React SSR with Vite: [https://vite.dev/guide/ssr.html](https://vite.dev/guide/ssr.html)
