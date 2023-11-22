"use strict";

const validatePassword = function (password) {
  let status = true;

  if (
    password == null ||
    password == undefined ||
    password == "" ||
    password.length > 75
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validatePassword,
};
