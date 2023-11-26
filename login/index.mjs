import { login } from "./login.mjs";

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const data = await login(body);

  const response = {
    statusCode: data.statusCode,
    body: data.body,
  };
  return response;
};
