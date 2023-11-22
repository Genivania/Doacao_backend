"use strict";

const BLOOD_TYPES = ["NA", "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

const validateBloodType = function (bloodType) {
  let status = true;

  if (
    bloodType == null ||
    bloodType == undefined ||
    !isNaN(bloodType) ||
    bloodType == "" ||
    !BLOOD_TYPES.includes(bloodType.toUpperCase())
  ) {
    status = false;
  }
  return status;
};

module.exports = {
  validateBloodType,
};
