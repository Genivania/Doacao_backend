//*****************************************ERROR CONSTANTS*********************************************************/
const ERROR_REQUIRED_DATA = {
  status: 400,
  message: "There are mandatory data that have not been filled in.",
};
const ERROR_INVALID_ID = {
  status: 400,
  message: "The specified ID is invalid. Make sure it is a numeric value.",
};
const ERROR_INVALID_EMAIL = {
  status: 400,
  message: "The specified E-mail is invalid.",
};
const ERROR_RESOURCE_NOT_FOUND = {
  status: 404,
  message: "No items found.",
};
const ERROR_INTERNAL_SERVER = {
  status: 500,
  message: "Internal error on the database server.",
};

//*****************************************SUCCESSFUL CONSTANTS******************************************************/
const OK = { status: 200, message: "Request successful." };
const CREATED_ITEM = { status: 201, message: "Record created successfully." };
const NO_CONTENT = { status: 204, message: "Record deleted successfully." };
const UPDATED_ITEM = {
  status: 204,
  message: "Record updated successfully.",
};

//*****************************************LOGIN CONSTANTS******************************************************/
const LOGIN_INCORRECT = {
  status: 404,
  message: "User or password incorrects.",
};
const LOGIN_CORRECT = { status: 200, message: "Login Succesfull." };

module.exports = {
  ERROR_REQUIRED_DATA,
  ERROR_INVALID_ID,
  ERROR_INVALID_EMAIL,
  ERROR_RESOURCE_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  OK,
  CREATED_ITEM,
  NO_CONTENT,
  UPDATED_ITEM,
  LOGIN_INCORRECT,
  LOGIN_CORRECT,
};
