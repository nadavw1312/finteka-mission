import AWS from "aws-sdk";
import { settings } from "./settings.mjs";
AWS.config.update({ region: "us-east-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export const register = async ({ firstName, lastName, israeliId, phoneNumber, password }) => {
  try {
    // Parse request body
    validateRequest({ firstName, lastName, israeliId, phoneNumber, password });
    const userData = { firstName, lastName, israeliId, phoneNumber, password };
    const res = await registerUserInCognito(userData);
    delete userData.password;
    console.log(`Cognito user created: ${res.UserSub}`);

    const id = res.UserSub;
    userData.id = id;
    await saveToDynamoDB(userData);
    console.log(`DynamoDB user created: ${res.UserSub}`);

    return {
      statusCode: 201,
      body: { id: userData.id },
    };
  } catch (error) {
    console.error("Error:", error);

    // Return error response
    return {
      statusCode: 400,
      body: { error: error.message },
    };
  }
};

function validateRequest(body) {
  const { firstName, lastName, israeliId, phoneNumber, password } = body;
  if (!firstName || !lastName || !israeliId || !phoneNumber || !password) {
    throw new Error("All fields are required.");
  }
  if (firstName.length > 20 || lastName.length > 20) {
    throw new Error("First name and last name should be no more than 20 letters.");
  }
  if (password.length < 6) {
    throw new Error("Password should be a minimum of 6 letters.");
  }

  if (israeliId.length !== 9) {
    throw new Error("Israeli id should be a 9 letters.");
  }
}

// Function to save user data to DynamoDB
async function saveToDynamoDB(userData) {
  const params = {
    TableName: settings.tableName,
    Item: {
      ...userData,
    },
  };

  return await dynamoDB.put(params).promise();
}

async function registerUserInCognito(userData) {
  const params = {
    ClientId: settings.clientId,
    Username: userData.phoneNumber, // Assuming the user's ID can be used as the username
    Password: userData.password,
    UserAttributes: [
      { Name: "given_name", Value: userData.firstName },
      { Name: "family_name", Value: userData.lastName },
      { Name: "phone_number", Value: userData.phoneNumber },
    ],
  };

  return await cognitoIdentityServiceProvider.signUp(params).promise();
}
