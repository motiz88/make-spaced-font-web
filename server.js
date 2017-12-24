// This file doesn't not go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
const { createServer } = require("http");
const { parse } = require("url");

const Koa = require("koa");
const koaBody = require("koa-body");
const next = require("next");
const Router = require("koa-router");
const path = require("path");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const makeSpacedFont = require("./api/make-spaced-font");

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  router.post(
    "/api/make-spaced-font",
    koaBody({
      multipart: true,
      onFileBegin(name, file) {
        const filename = path.basename(file.path) + path.extname(file.name);
        const folder = path.dirname(file.path);
        // Manipulate the filename
        file.path = path.join(folder, filename);
      },
      formLimit: 1024 * 1024 * 1
    }),
    async ctx => {
      await makeSpacedFont(ctx);
    }
  );

  router.get("*", async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(router.routes());
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
