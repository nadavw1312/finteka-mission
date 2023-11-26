import { handler } from "./index.mjs";

(async () => {
  await handler({
    body: {
      firstName: "bdika",
      lastName: "bdika",
      israeliId: "999999999",
      phoneNumber: "+9720544598232",
      password: "12345678aA@",
    }.toString(),
  });
})();
