import { handler } from "./index.mjs";

(async () => {
  await handler({
    headers: {
      authorization: "sds" + " " + "<token>",
    },
    body: {
      firstName: "sadad",
    },
  });
})();
