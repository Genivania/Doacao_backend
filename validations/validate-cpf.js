"use strict";

const validateCPF = function (CPF) {
  let status = true;

  if (
    CPF == null ||
    CPF == undefined ||
    !isNaN(CPF) ||
    CPF == "" ||
    CPF.length > 14
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateCPF,
};
