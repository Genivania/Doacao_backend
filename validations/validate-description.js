"use strict";

const validateDescription = function (description) {
  let status = true;

  if (
    description == null ||
    description == undefined ||
    !isNaN(description) ||
    description == ""
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateDescription,
};
