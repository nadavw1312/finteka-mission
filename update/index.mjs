import { updateFirstName } from "./update.mjs";

export const handler = async (event) => {
  if (!event.headers.authorization) {
    return {
      statusCode: 401,
      body: "authorization not provided",
    };
  }

  const keys = event.headers.authorization.split(" ");
  if (keys.length < 2) {
    return {
      statusCode: 401,
      body: "authorization not provided",
    };
  }

  const token = keys[1];
  const body = JSON.parse(event.body);
  const data = await updateFirstName(token, body.firstName);

  const response = {
    statusCode: data.statusCode,
    body: JSON.stringify(data.body),
  };
  return response;
};
