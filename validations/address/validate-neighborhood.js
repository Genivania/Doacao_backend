"use strict";

const validateNeighborhood = function (neighborhood) {
  let status = true;

  if (
    neighborhood == null ||
    neighborhood == undefined ||
    !isNaN(neighborhood) ||
    neighborhood == "" ||
    neighborhood.length > 100
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateNeighborhood,
};
