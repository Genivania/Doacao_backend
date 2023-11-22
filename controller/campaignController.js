const campaignDAO = require("../model/dao/campaignDAO.js");

const message = require("./module/config.js");

// VALIDATIONS
const { validateId } = require("../validations/validate-id.js");
const { validatePhoto } = require("../validations/validate-photo.js");
const {
  validateDescription,
} = require("../validations/validate-description.js");
const { validateDate } = require("../validations/validate-date.js");
const { validateHour } = require("../validations/validate-hour.js");

const campaignInsert = async function (campaignData) {

  if (
    !validateId(campaignData.hospitalId) ||
    !validatePhoto(campaignData.image) ||
    !validateDescription(campaignData.description) ||
    !validateDate(campaignData.date) ||
    !validateHour(campaignData.hour)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await campaignDAO.insertCampaign(campaignData);
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const campaignsHospitalGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const campaignsData = await campaignDAO.getCampaignsByHospitalId(hospitalId);

  if (campaignsData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (campaignsData) {
    const jsonCampaignsData = {};

    jsonCampaignsData.status = message.OK.status;
    jsonCampaignsData.campaigns = campaignsData;

    return jsonCampaignsData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const campaignsGet = async function () {
  const campaignsData = await campaignDAO.getCampaigns();

  if (campaignsData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (campaignsData) {
    const jsonCampaignsData = {};

    jsonCampaignsData.status = message.OK.status;
    jsonCampaignsData.campaigns = campaignsData;

    return jsonCampaignsData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const campaignUpdate = async function (campaignId, campaignData) {
  if (!validateId(campaignId)) {
    return message.ERROR_INVALID_ID;
  } else if (
    !validatePhoto(campaignData.image) ||
    !validateDescription(campaignData.description) ||
    !validateDate(campaignData.date) ||
    !validateHour(campaignData.hour)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const campaign = await campaignDAO.getCampaignById(campaignId);

  if (campaign.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await campaignDAO.updateCampaign(campaignId, campaignData);
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const campaignDelete = async function (campaignId) {
  if (!validateId(campaignId)) {
    return message.ERROR_INVALID_ID;
  } else {
    const campaign = await campaignDAO.getCampaignById(campaignId);

    if (campaign.length == 0) {
      return message.ERROR_RESOURCE_NOT_FOUND;
    }

    const status = await campaignDAO.deleteCampaignById(campaignId);
    if (status) {
      return message.NO_CONTENT;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const hospitalIdCampaignIdGet = async function (campaignId) {
  if (!validateId(campaignId)) {
    return message.ERROR_INVALID_ID;
  }

  const hospitalIdData = await campaignDAO.getHospitalIdByCampaignId(campaignId);

  if (hospitalIdData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (hospitalIdData) {
    const jsonHospitalIdData = {};

    jsonHospitalIdData.status = message.OK.status;
    jsonHospitalIdData.hospitalId = hospitalIdData;

    return jsonHospitalIdData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  campaignInsert,
  campaignsHospitalGet,
  campaignsGet,
  campaignUpdate,
  campaignDelete,
  hospitalIdCampaignIdGet
};
