"use strict";

const validateDonationSite = function (donationSite) {
  let status = true;

  if (
    donationSite == null ||
    donationSite == undefined ||
    !isNaN(donationSite) ||
    donationSite == "" ||
    donationSite.length > 150
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateDonationSite,
};
