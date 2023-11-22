"use strict";

const validateWebsite = function (website) {
  let status = true;

  if (
    website == null ||
    website == undefined ||
    !isNaN(website) ||
    website == "" ||
    website.length > 200
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateWebsite,
};
