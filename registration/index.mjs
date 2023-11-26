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