// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
var crypto = require("crypto");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const cluster = require("cluster");

const importFresh = require("import-fresh");
const startProd = () => {
  console.log("WORKER STARTED", process.pid);
  // server.js
  const { createServer } = require("http");
  console.log("PROD ");
  const importFresh = require("import-fresh");
  const { parse } = require("url");
  const next = require("next");

  const server = require("express")();
  const fs = require("fs");
  const dev = process.env.NODE_ENV !== "production";
  const hostname = "localhost";
  const port = process.env.PORT || 3000;
  // when using middleware `hostname` and `port` must be provided below
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();
  const greeting = `🔥 hot next on http://localhost:${port}`;

  function clearRoutes() {
    server._router.stack = server._router.stack.filter(
      (k) => !(k && k.route && k.route.path)
    );
  }
  let Application;
  function load(prevNextInstance = null) {
    if (prevNextInstance) {
      prevNextInstance.dispose();
      clearRoutes();
    }
    let isGetting = false;
    let hashmap = {};
    let needsReload = false;
    const remote = importFresh("./.next/cache/remoteEntry.js");
    return remote.get("./serverContainer").then(async (factory) => {
      const next = factory();
      const app = next.init({ dev });

      let handle = app.getRequestHandler();

      server.use("/reload", (_req, res) => {
        load(next);
        res.send("<h1>reload complete</h1>");
      });

      // process.on("SIGTERM", shutDown);
      // process.on("SIGINT", shutDown);
      let interval
      function shutDown(i) {
        console.log("Received kill signal, shutting down gracefully");
        load(i)
        clearTimeout(interval)
//         Application.close(() => {
//           console.log("Closed out remaining connections");
//           process.exit(0);
//         });
//         setTimeout(() => {
//           console.error(
//             "Could not close connections in time, forcefully shutting down"
//           );
//           process.exit(1);
//         }, 10000);
      }
      interval= setInterval(()=>{
        if (global.REMOTE_CONFIG) {

          console.log("fetching remote again")
          for (const property in global.REMOTE_CONFIG) {
            const [name, url] = global.REMOTE_CONFIG[property].split("@");
            fetch(url)
              .then((re) => re.text())
              .then((contents) => {
                var hash = crypto
                  .createHash("md5")
                  .update(contents)
                  .digest("hex");

                if (hashmap[name]) {
                  if (hashmap[name] !== hash) {
                    console.log(
                      name,
                      "hash is different - must hot reload server"
                    );
                    needsReload = true;
                    shutDown(next);
                  }
                } else {
                  hashmap[name] = hash;
                }
              })
              .catch(() => {
                console.log(
                  "Remote",
                  name,
                  url,
                  "Failed to load or is not online"
                );
              });
          }
        }
      }, 30000)

      server.all("*", async (req, res) => {
        handle(req, res, parse(req.url, true));
      });
    });
  }

  load().then(() => {
    Application = server.listen(port, () => console.info(greeting));
    return Application;
  });
};
const runDev = () => {
  console.log("starting cluster worker");
  let isGetting;
  let hashmap = {};
  return app.prepare().then(() => {
    createServer(async (req, res) => {
      try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.

        if (!isGetting && global.REMOTE_CONFIG) {
          isGetting = true;
          for (const property in global.REMOTE_CONFIG) {
            const [name, url] = global.REMOTE_CONFIG[property].split("@");
            try {
              await fetch(url)
                .then((re) => re.text())
                .then((contents) => {
                  var hash = crypto
                    .createHash("md5")
                    .update(contents)
                    .digest("hex");

                  console.log(hash);
                  if (hashmap[name]) {
                    if (hashmap[name] !== hash) {
                      console.log(
                        name,
                        "hash is different - must hot reload server"
                      );
                      res.writeHead(200, { "Content-Type": "text/html" });

                      res.write(`<html><p>remote changed - hot reloading...</p><script>setTimeout(function(){
 const location = window.location.href.replace("reload","");

  function tryFetch(){
     fetch(location).then(re=>{
    if(re.status === 200) {
      if(window.location.href.includes('reload')) {
        window.location.href = location
      } else {
        window.location.reload()
      }
    }
  }).catch(()=>{
    setTimeout(tryFetch, 1000)
  })
  }
  tryFetch()
  },4000)</script></html>`);
                      setTimeout(() => {
                        process.exit();
                      }, 50);
                      res.end();
                    }
                  } else {
                    hashmap[name] = hash;
                  }
                });
            } catch (e) {
              console.error("Failed to get remote", name);
              console.error(e);
            }
          }
        }
        const parsedUrl = parse(req.url, true);
        if (req.url.includes("reload")) {
          res.statusCode = 200;
          setTimeout(() => {
            process.exit();
          }, 300);
          res.writeHead(200, { "Content-Type": "text/html" });

          res.write(`<html><p>remote changed - hot reloading...</p><script>setTimeout(function(){
 const location = window.location.href.replace("reload","");

  function tryFetch(){
     fetch(location).then(re=>{
    if(re.status === 200) {
      if(window.location.href.includes('reload')) {
        window.location.href = location
      } else {
        window.location.reload()
      }
    }
  }).catch(()=>{
    setTimeout(tryFetch, 1000)
  })
  }
  tryFetch()
  },4000)</script></html>`);
          res.end();
        }
        setTimeout(() => {
          isGetting = false;
        }, 3000);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        setTimeout(() => {
          process.exit();
        }, 1000);
        res.end("internal server error");
      }
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  });
};
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  if (dev) {
    runDev();
  } else {
    startProd();
  }
}