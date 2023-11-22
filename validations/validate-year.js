"use strict";

const validateYear = function (year) {
  let status = true;

  if (
    year == null ||
    year == undefined ||
    isNaN(year) ||
    year == ""
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateYear,
};
