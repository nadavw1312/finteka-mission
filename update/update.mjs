import AWS from "aws-sdk";
import { promisify } from "util";
import * as Axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import { settings } from "./settings.mjs";
import jwkToPem from "jwk-to-pem";
const directoryPath = process.cwd();
// AWS.config.loadFromPath(`${directoryPath}\\aws-credentials.json`);

// AWS.config.update({ region: "us-east-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const cognitoPoolId = settings.cognitoPoolId;
if (!cognitoPoolId) {
  throw new Error("env var required for cognito pool");
}
const cognitoIssuer = `https://cognito-idp.us-east-1.amazonaws.com/${cognitoPoolId}`;
const verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

let cacheKeys;
const getPublicKeys = async () => {
  if (!cacheKeys) {
    const url = `${cognitoIssuer}/.well-known/jwks.json`;
    const publicKeys = await Axios.default.get(url);
    cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
      const pem = jwkToPem(current);
      agg[current.kid] = { instance: current, pem };
      return agg;
    }, {});
    return cacheKeys;
  } else {
    return cacheKeys;
  }
};

export const updateFirstName = async (token, firstName) => {
  let result;
  try {
    const tokenSections = (token || "").split(".");
    if (tokenSections.length < 2) {
      throw new Error("requested token is invalid");
    }
    const headerJSON = Buffer.from(tokenSections[0], "base64").toString("utf8");
    const header = JSON.parse(headerJSON);
    const keys = await getPublicKeys();
    const key = keys[header.kid];
    if (key === undefined) {
      throw new Error("claim made for unknown kid");
    }
    const claim = await verifyPromised(token, key.pem);
    const currentSeconds = Math.floor(new Date().valueOf() / 1000);
    if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
      throw new Error("claim is expired or invalid");
    }
    if (claim.iss !== cognitoIssuer) {
      throw new Error("claim issuer is invalid");
    }
    if (claim.token_use !== "id") {
      throw new Error("claim use is not access");
    }
    console.log(`claim confirmed for ${claim.sub}`);
    console.log(firstName);

    const id = claim.sub;
    const data = await dynamoDB
      .update({
        TableName: settings.tableName,
        Key: {
          id,
        },
        UpdateExpression: `set firstName = :newFirstName`,
        ExpressionAttributeValues: {
          ":newFirstName": firstName,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
    result = { statusCode: 200, body: { item: data.Attributes } };
  } catch (error) {
    result = { statusCode: 401, body: { error } };
  }
  return result;
};
