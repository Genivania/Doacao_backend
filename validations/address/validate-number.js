"use strict";

const validateNumber = function (number) {
  let status = true;

  if (
    number == null ||
    number == undefined ||
    isNaN(number) ||
    number == "" ||
    number.length > 4
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateNumber,
};
