import { updateFirstName } from "./update.mjs";

export const handler = async (event) => {
  if (!event.headers.authorization) {
    return {
      statusCode: 401,
      body: "authorization not provided",
    };
  }
  const token = event.headers.authorization.split(" ")[1];
  const body = JSON.parse(event.body);
  const data = await updateFirstName(token, body.firstName);

  const response = {
    statusCode: data.statusCode,
    body: JSON.stringify(data.body),
  };
  return response;
};

// (async () => {
//   await handler({
//     headers: {
//       authorization:
//         "sds" +
//         " " +
//         "eyJraWQiOiJHQkF3aHJnWGVrSjdQNUlsSUdFc2pMN2w4UlVzdnNRMzhKWUhtNGs1SmY4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhZWQ4ZGM5ZS05ZTNiLTQxODktYjZkNy1lZGViNmMzZDkyZWUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV80T1Fza244STEiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJhZWQ4ZGM5ZS05ZTNiLTQxODktYjZkNy1lZGViNmMzZDkyZWUiLCJnaXZlbl9uYW1lIjoiYmRpa2EiLCJvcmlnaW5fanRpIjoiODhkZGM4NzAtZmZhOC00Yzc5LWIyYzUtZGU4NmI5Mjk3MWYzIiwiYXVkIjoiM3Q1bXBrNTlpbXVsZ2F0bXNhdnEzMHRuaW0iLCJldmVudF9pZCI6IjdmOGQ4ZWIzLTM1MTQtNDIwMi04MjcxLTA2ZDE2ZDFmOTY5NiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzAxMDE0MjQyLCJwaG9uZV9udW1iZXIiOiIrOTcyMDU0NDU5ODI2NCIsImV4cCI6MTcwMTAxNzg0MiwiaWF0IjoxNzAxMDE0MjQyLCJmYW1pbHlfbmFtZSI6ImJkaWthIiwianRpIjoiNTI1YTA3ODgtOGRmNS00OWUwLTg3YmItMmE2MmFhNWRiY2JhIn0.lzN4AemhYpBzLRuVAPBa1HE8mB2IuHnbuK50HO3IKuCcx1Tw1TJ0tJPKbW_g-RuDgitKFu0htQoWIcmweET6HxhK52gNOo_nhCkTJ74-Xb50j-u9UqMkwh9hI2J1WJKKRR7fyIJHTJw0-Hxo6QJXC8fSDlTHuNLLh2BI-4nIy-zz8-qHNiMEWTBi5xII9_pH6kkXEnxE5gFUqSh4uFLb7aqOww1Ja4Mej6Hc_4M0EDpKpMOLOWWNlzAwR-_L7RvVoKzCErJoL7U92QCZKzSsbMKVB6wv3a_F4iE_r-xPhR5nB6lLZewXzZVusAmyTGAqEdg3n3SDD-MeDhhI5beK8A",
//     },
//     body: {
//       firstName: "sadad",
//     },
//   });
// })();
