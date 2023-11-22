const siteDAO = require("../model/dao/siteDAO.js");

const message = require("./module/config.js");

// VALIDATIONS
const { validateId } = require("../validations/validate-id");

const sitesGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }
  const hospitalData = await siteDAO.getSitesByHospitalId(hospitalId);

  if (hospitalData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (hospitalData) {
    const jsonHospitalData = {};

    jsonHospitalData.status = message.OK.status;
    jsonHospitalData.sites = hospitalData;

    return jsonHospitalData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalIdSiteIdGet = async function (siteId) {
  if (!validateId(siteId)) {
    return message.ERROR_INVALID_ID;
  }
  const hospitalData = await siteDAO.getHospitalIdBySiteId(siteId);

  if (hospitalData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (hospitalData) {
    const jsonHospitalData = {};

    jsonHospitalData.status = message.OK.status;
    jsonHospitalData.hospitalId = hospitalData;

    return jsonHospitalData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  sitesGet,
  hospitalIdSiteIdGet
};
