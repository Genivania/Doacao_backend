const hospitalDAO = require("../model/dao/hospitalDAO.js");

const message = require("./module/config.js");

const { JWT_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");

// ADDRESS VALIDATIONS
const { validateCEP } = require("../validations/address/validate-cep");
const { validateCity } = require("../validations/address/validate-city");
const {
  validateComplement,
} = require("../validations/address/validate-complement");
const {
  validateNeighborhood,
} = require("../validations/address/validate-neighborhood");
const { validateNumber } = require("../validations/address/validate-number");
const { validateStreet } = require("../validations/address/validate-street");
const { validateUF } = require("../validations/address/validate-uf");

// HOSPITAL VALIDATIONS
const { validateId } = require("../validations/validate-id");
const { validateName } = require("../validations/validate-name");
const { validateCNPJ } = require("../validations/validate-cnpj");
const { validateEmail } = require("../validations/validate-email");
const { validatePhone } = require("../validations/validate-phone");
const { validateWebsite } = require("../validations/validate-website");
const {
  validateDonationSite,
} = require("../validations/validate-donation-site");
const { validatePhoto } = require("../validations/validate-photo");
const { validatePassword } = require("../validations/validate-password");

const loginHospital = async function (loginData) {
  if (
    !validateEmail(loginData.email) ||
    !validatePassword(loginData.password)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const hospitalData = await hospitalDAO.hospitalLogin(loginData);

  if (hospitalData == null || hospitalData == undefined) {
    return message.LOGIN_INCORRECT;
  } else if (hospitalData) {
    const jsonHospitalData = {};

    const token = jwt.sign(
      { hospitalId: hospitalData.id, email: hospitalData.email },
      JWT_SECRET
    );

    jsonHospitalData.status = message.LOGIN_CORRECT.status;
    jsonHospitalData.hospitalData = {
      id: hospitalData.id,
      email: hospitalData.email,
      name: hospitalData.name,
      photo: hospitalData.Photo[0].url,
      token: token,
    };

    return jsonHospitalData;
  } else {
    return message.LOGIN_INCORRECT;
  }
};

const hospitalInsert = async function (hospitalData) {
  if (
    !validateName(hospitalData.hospital.name) ||
    !validateCNPJ(hospitalData.hospital.cnpj) ||
    !validateEmail(hospitalData.hospital.email) ||
    !validatePhone(hospitalData.hospital.phone) ||
    !validateWebsite(hospitalData.hospital.website) ||
    !validateDonationSite(hospitalData.hospital.donationSite) ||
    !validateDonationSite(hospitalData.hospital.otherDonationSite) ||
    !validatePhoto(hospitalData.hospital.photo) ||
    !validatePassword(hospitalData.hospital.password) ||
    !validateCEP(hospitalData.address.cep) ||
    !validateUF(hospitalData.address.uf) ||
    !validateCity(hospitalData.address.city) ||
    !validateNeighborhood(hospitalData.address.neighborhood) ||
    !validateStreet(hospitalData.address.street) ||
    !validateNumber(hospitalData.address.number) ||
    !validateComplement(hospitalData.address.complement)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await hospitalDAO.insertHospital(hospitalData);
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const hospitalData = await hospitalDAO.getHospitalById(hospitalId);

  if (hospitalData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (hospitalData) {
    const jsonHospitalData = {};

    jsonHospitalData.status = message.OK.status;
    jsonHospitalData.hospital = {
      name: hospitalData[0].name,
      cnpj: hospitalData[0].cnpj,
      email: hospitalData[0].email,
      phone: hospitalData[0].phone,
      website: hospitalData[0].website_url,
      donationSite: hospitalData[0].donationSite,
      otherDonationSite: hospitalData[0].otherDonationSite,
      photo: hospitalData[0].url,
    };
    jsonHospitalData.address = {
      cep: hospitalData[0].cep,
      uf: hospitalData[0].uf,
      city: hospitalData[0].city,
      neighborhood: hospitalData[0].neighborhood,
      street: hospitalData[0].street,
      complement: hospitalData[0].complement,
      number: hospitalData[0].number,
    };

    return jsonHospitalData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalEmailGet = async function (hospitalEmail) {
  if (!validateEmail(hospitalEmail.email)) {
    return message.ERROR_REQUIRED_DATA;
  }

  const hospitalData = await hospitalDAO.getHospitalByEmail(
    hospitalEmail.email
  );

  if (hospitalData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (hospitalData) {
    const jsonHospitalData = {};

    jsonHospitalData.status = message.LOGIN_CORRECT.status;
    jsonHospitalData.hospitalData = {
      id: hospitalData.id,
      email: hospitalData.email,
      password: hospitalData.password,
      photo: hospitalData.Photo[0].url,
    };

    return jsonHospitalData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalGetSchedules = async function (hospitalId) {
  const schedulesData = await hospitalDAO.getHospitalSchedules(hospitalId);

  if (schedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (schedulesData) {
    const jsonSchedulesData = {};
    jsonSchedulesData.status = 200;
    jsonSchedulesData.schedules = [];

    for (scheduleData in schedulesData) {
      let scheduleObject = {
        user: {
          userId: schedulesData[scheduleData].id,
          name: schedulesData[scheduleData].name,
          photo: schedulesData[scheduleData].photo_url,
        },
        schedule: {
          scheduleId: schedulesData[scheduleData].id_schedule,
          date: schedulesData[scheduleData].date,
          hour: schedulesData[scheduleData].hour,
          site: schedulesData[scheduleData].site,
          siteId: schedulesData[scheduleData].site_id,
          status: schedulesData[scheduleData].status,
          observation: schedulesData[scheduleData].observation,
        },
      };

      jsonSchedulesData.schedules.push(scheduleObject);
    }
    return jsonSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalGetFilteredStatusSchedules = async function (hospitalId, status) {
  const schedulesData = await hospitalDAO.getHospitalFilteredStatusSchedules(hospitalId, status);

  if (schedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (schedulesData) {
    const jsonSchedulesData = {};
    jsonSchedulesData.status = 200;
    jsonSchedulesData.schedules = [];

    for (scheduleData in schedulesData) {
      let scheduleObject = {
        user: {
          userId: schedulesData[scheduleData].id,
          name: schedulesData[scheduleData].name,
          photo: schedulesData[scheduleData].photo_url,
        },
        schedule: {
          scheduleId: schedulesData[scheduleData].id_schedule,
          date: schedulesData[scheduleData].date,
          hour: schedulesData[scheduleData].hour,
          site: schedulesData[scheduleData].site,
          siteId: schedulesData[scheduleData].site_id,
          status: schedulesData[scheduleData].status,
          observation: schedulesData[scheduleData].observation,
        },
      };

      jsonSchedulesData.schedules.push(scheduleObject);
    }
    return jsonSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalGetFilteredNameSchedules = async function (hospitalId, userName) {
  const schedulesData = await hospitalDAO.getHospitalFilteredNameSchedules(hospitalId, userName);

  if (schedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (schedulesData) {
    const jsonSchedulesData = {};
    jsonSchedulesData.status = 200;
    jsonSchedulesData.schedules = [];

    for (scheduleData in schedulesData) {
      let scheduleObject = {
        user: {
          userId: schedulesData[scheduleData].id,
          name: schedulesData[scheduleData].name,
          photo: schedulesData[scheduleData].photo_url,
        },
        schedule: {
          scheduleId: schedulesData[scheduleData].id_schedule,
          date: schedulesData[scheduleData].date,
          hour: schedulesData[scheduleData].hour,
          site: schedulesData[scheduleData].site,
          siteId: schedulesData[scheduleData].site_id,
          status: schedulesData[scheduleData].status,
          observation: schedulesData[scheduleData].observation,
        },
      };

      jsonSchedulesData.schedules.push(scheduleObject);
    }
    return jsonSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalUpdate = async function (hospitalId, hospitalData) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  } else if (
    !validateName(hospitalData.hospital.name) ||
    !validateCNPJ(hospitalData.hospital.cnpj) ||
    !validateEmail(hospitalData.hospital.email) ||
    !validatePhone(hospitalData.hospital.phone) ||
    !validateWebsite(hospitalData.hospital.website) ||
    !validateDonationSite(hospitalData.hospital.donationSite) ||
    !validateDonationSite(hospitalData.hospital.otherDonationSite) ||
    !validatePhoto(hospitalData.hospital.photo) || 
    !validateCEP(hospitalData.address.cep) ||
    !validateUF(hospitalData.address.uf) ||
    !validateCity(hospitalData.address.city) ||
    !validateNeighborhood(hospitalData.address.neighborhood) ||
    !validateStreet(hospitalData.address.street) ||
    !validateNumber(hospitalData.address.number) ||
    !validateComplement(hospitalData.address.complement)
  ) {
    console.log('erro de validacao');
    return message.ERROR_REQUIRED_DATA;
  }

  const hospital = await hospitalDAO.getHospitalById(hospitalId);

  if (hospital.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await hospitalDAO.updateHospital(hospitalId, hospitalData);
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalPasswordUpdate = async function (hospitalId, hospitalData) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  } else if (!validatePassword(hospitalData.password)) {
    return message.ERROR_REQUIRED_DATA;
  }

  const hospital = await hospitalDAO.getHospitalById(hospitalId);
  if (hospital.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await hospitalDAO.updateHospitalPassword(
    hospitalId,
    hospitalData
  );
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalsGet = async function () {
  const hospitalsData = await hospitalDAO.getHospitals();

  if (hospitalsData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (hospitalsData) {
    const jsonHospitalsData = {};
    jsonHospitalsData.status = 200;
    jsonHospitalsData.hospitals = [];

    for (hospitalData in hospitalsData) {
      if (hospitalsData) {
        let hospitalObject = {
          hospital: {
            hospitalId: hospitalsData[hospitalData].hospitalId,
            name: hospitalsData[hospitalData].name,
          },
          address: {
            uf: hospitalsData[hospitalData].uf,
            city: hospitalsData[hospitalData].city,
            neighborhood: hospitalsData[hospitalData].neighborhood,
          },
        };

        jsonHospitalsData.hospitals.push(hospitalObject);
      }
    }
    return jsonHospitalsData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalDelete = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  } else {
    const hospital = await hospitalDAO.getHospitalById(hospitalId);

    if (hospital.length == 0) {
      return message.ERROR_RESOURCE_NOT_FOUND;
    }

    const status = await hospitalDAO.deleteHospitalById(hospitalId);
    if (status) {
      return message.NO_CONTENT;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  loginHospital,
  hospitalInsert,
  hospitalGet,
  hospitalEmailGet,
  hospitalGetSchedules,
  hospitalGetFilteredStatusSchedules,
  hospitalGetFilteredNameSchedules,
  hospitalUpdate,
  hospitalPasswordUpdate,
  hospitalsGet,
  hospitalDelete,
};
