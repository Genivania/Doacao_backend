"use strict";

const { join } = require("@prisma/client/runtime/library");

const validatePhone = function (phone) {
  let status = true;

  if (
    phone == null ||
    phone == undefined ||
    isNaN(phone.replace(/[\(\)\-\s]/g, '')) ||
    phone == "" ||
    phone.length > 15
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validatePhone,
};
