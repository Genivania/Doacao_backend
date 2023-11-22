"use strict";

const validateBloodMl = function (bloodMl) {
  let status = true;

  if (
    bloodMl == null ||
    bloodMl == undefined ||
    isNaN(bloodMl) ||
    bloodMl == ""
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateBloodMl,
};
