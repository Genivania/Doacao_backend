"use strict";

const validateWeight = function (weight) {
  let status = true;

  if (
    weight == null ||
    weight == undefined ||
    isNaN(weight) ||
    weight == "" ||
    weight < 0
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateWeight,
};
