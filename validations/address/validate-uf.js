"use strict";

const validateUF = function (UF) {
  let status = true;

  if (
    UF == null ||
    UF == undefined ||
    !isNaN(UF) ||
    UF == "" ||
    UF.length > 2
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateUF,
};
