"use strict";

const validateName = function (name) {
  let status = true;

  if (
    name == null ||
    name == undefined ||
    !isNaN(name) ||
    name == "" ||
    name.length > 100
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateName,
};
