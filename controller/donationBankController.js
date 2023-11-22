const donationBankDAO = require("../model/dao/donationBankDAO.js");
const bloodTypeDAO = require("../model/dao/bloodTypeDAO.js");

const message = require("./module/config.js");

// VALIDATIONS
const { validateId } = require("../validations/validate-id.js");
const { validateYear } = require("../validations/validate-year.js");
const { validateBloodMl } = require("../validations/validate-blood-ml.js");
const { validateBloodType } = require("../validations/validate-blood-type.js");

const donationBankInsert = async function (donationBankData) {
  const bloodTypeId = await bloodTypeDAO.getBloodTypeIdByName(
    donationBankData.bloodType
  );

  if (
    !validateId(donationBankData.hospitalId) ||
    !validateId(bloodTypeId) ||
    !validateYear(donationBankData.year) ||
    !validateBloodMl(donationBankData.bloodMl)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await donationBankDAO.insertDonationBank(
    donationBankData,
    bloodTypeId,
    donationBankData.hospitalId
  );
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const donationBanksGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const donationBanksData = await donationBankDAO.getDonationBanksByHospitalId(
    hospitalId
  );

  if (donationBanksData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (donationBanksData) {
    const jsonDonationBanksData = {};

    jsonDonationBanksData.status = message.OK.status;
    jsonDonationBanksData.donationBanks = donationBanksData;

    return jsonDonationBanksData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const donationBankYearsGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const donationBanksData = await donationBankDAO.getDonationBanksYearByHospitalId(
    hospitalId
  );

  if (donationBanksData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (donationBanksData) {
    const jsonDonationBanksData = {};

    jsonDonationBanksData.status = message.OK.status;
    jsonDonationBanksData.years = donationBanksData;

    return jsonDonationBanksData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const donationBankUpdate = async function (donationBankData) {
  if (
    !validateId(donationBankData.hospitalId) ||
    !validateBloodType(donationBankData.bloodType) ||
    !validateYear(donationBankData.year) ||
    !validateBloodMl(donationBankData.bloodMl)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await donationBankDAO.updateOrInsertDonationBank(donationBankData);
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  donationBankInsert,
  donationBanksGet,
  donationBankUpdate,
  donationBankYearsGet
};
