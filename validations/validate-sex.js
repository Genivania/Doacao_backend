"use strict";

const SEXS = ["MASCULINE", "FEMININE"];

const validateSex = function (sex) {
  let status = true;

  if (
    sex == null ||
    sex == undefined ||
    !isNaN(sex) ||
    sex == "" ||
    !SEXS.includes(sex.toUpperCase())
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateSex,
};
