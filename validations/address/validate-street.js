"use strict";

const validateStreet = function (street) {
  let status = true;

  if (
    street == null ||
    street == undefined ||
    typeof street !== 'string' ||
    street == "" ||
    street.length > 150
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateStreet,
};
