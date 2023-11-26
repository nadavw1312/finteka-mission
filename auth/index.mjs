import { auth } from "./auth.mjs";

export const handler = async (event) => {
  if (!event.headers.authorization) {
    return {
      statusCode: 401,
      body: "authorization not provided",
    };
  }

  const token = event.headers.authorization.split(" ")[1];
  const data = await auth(token);

  const response = {
    statusCode: data.statusCode,
    body: JSON.stringify(data.body),
  };
  return response;
};
