"use strict";

const validateId = function (id) {
  let status = true;

  if (id == null || id == undefined || isNaN(id) || id == "" || id < 0) {
    status = false;
  }
  return status;
};

module.exports = {
  validateId,
};
