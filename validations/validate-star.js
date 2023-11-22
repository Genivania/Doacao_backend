"use strict";

const validateStar = function (star) {
  let status = true;

  if (
    star == null ||
    star == undefined ||
    isNaN(star) ||
    star == "" ||
    star < 0 ||
    star > 5
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateStar,
};
