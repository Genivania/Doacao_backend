"use strict";

const validateCity = function (city) {
  let status = true;

  if (
    city == null ||
    city == undefined ||
    !isNaN(city) ||
    city == "" ||
    city.length > 75
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateCity,
};
