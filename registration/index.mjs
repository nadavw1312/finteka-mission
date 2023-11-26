import { register } from "./register.mjs";

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const data = await register(body);

  const response = {
    statusCode: data.statusCode,
    body: JSON.stringify(data.body),
  };
  return response;
};

// (async () => {
//   await handler({
//     body: {
//       firstName: "bdika",
//       lastName: "bdika",
//       israeliId: "999999999",
//       phoneNumber: "+9720544598264",
//       password: "12345678aA@",
//     }.toString(),
//   });
// })();

// import express from "express";
// const app = express();
// const PORT = 3000;

// app.use(express.json());

// app.post("/user", async (req, res) => {
//   const response = await register(req.body);
//   res.status(response.statusCode).send(response.body);
// });

// app.listen(PORT, (error) => {
//   if (!error) console.log("Server is Successfully Running,  and App is listening on port " + PORT);
//   else console.log("Error occurred, server can't start", error);
// });
