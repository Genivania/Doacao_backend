"use strict";

const validateEmail = function (email) {
  let status = true;

  if (
    email == null ||
    email == undefined ||
    !isNaN(email) ||
    email == "" ||
    !email.includes("@") ||
    email.length > 256
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateEmail,
};
