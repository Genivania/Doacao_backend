"use strict";

const validatePhoto = function (photo) {
  let status = true;

  if (
    photo == null ||
    photo == undefined ||
    !isNaN(photo) ||
    photo == ""
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validatePhoto,
};
