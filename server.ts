import next from "next";
import expressApp from "./server/api";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  // @ts-ignore
  expressApp.use(handle);
  expressApp.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
