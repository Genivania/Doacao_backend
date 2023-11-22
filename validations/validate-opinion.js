"use strict";

const validateOpinion = function (opinion) {
  let status = true;

  if (
    opinion == null ||
    opinion == undefined ||
    typeof opinion !== 'string' 
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateOpinion,
};
