import AWS from "aws-sdk";
import { settings } from "./settings.mjs";
// const directoryPath = process.cwd();
// AWS.config.loadFromPath(`${directoryPath}\\aws-credentials.json`);
AWS.config.update({ region: "us-east-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export const login = async ({ username, password }) => {
  try {
    validateRequest({ username, password });
    const jwtToken = await authenticateUser(username, password);
    return {
      statusCode: 200,
      body: JSON.stringify({ token: jwtToken }),
    };
  } catch (error) {
    console.error("Error:", error);

    // Return error response
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Function to validate the request body
function validateRequest({ username, password }) {
  if (!password || !username) {
    throw new Error("Both username and password are required.");
  }
}

// Function to authenticate the user in Cognito and return a JWT
async function authenticateUser(username, password) {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: settings.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  const authenticationResult = await cognitoIdentityServiceProvider.initiateAuth(params).promise();

  if (authenticationResult.AuthenticationResult) {
    return authenticationResult.AuthenticationResult.IdToken;
  } else {
    throw new Error("Invalid credentials.");
  }
}
