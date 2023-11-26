import { handler } from "./index.mjs";

(async () => {
  await handler({
    headers: {
      authorization:
        "Bearer" +
        " " +
        "<token>",
    },
  });
})();
