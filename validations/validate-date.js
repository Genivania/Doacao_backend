"use strict";

const validateDate = function (date) {
  let status = true;

  if (
    date == null ||
    date == undefined ||
    isNaN(date.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, "")) ||
    date == ""
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateDate,
};
