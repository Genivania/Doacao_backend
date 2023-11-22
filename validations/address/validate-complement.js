"use strict";

const validateComplement = function (complement) {
  let status = true;

  if (
    complement == null ||
    complement == undefined ||
    typeof complement !== 'string' ||
    complement.length > 200
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateComplement,
};
