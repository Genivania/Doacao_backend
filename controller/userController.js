const userDAO = require("../model/dao/userDAO.js");
const { JWT_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");

const message = require("./module/config.js");

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

// USER VALIDATIONS
const { validateId } = require("../validations/validate-id");
const { validateName } = require("../validations/validate-name");
const { validateCPF } = require("../validations/validate-cpf");
const { validateEmail } = require("../validations/validate-email");
const { validatePhone } = require("../validations/validate-phone");
const { validateDate } = require("../validations/validate-date");
const { validateWeight } = require("../validations/validate-weight");
const { validatePhoto } = require("../validations/validate-photo");
const { validatePassword } = require("../validations/validate-password");
const { validateSex } = require("../validations/validate-sex");
const { validateBloodType } = require("../validations/validate-blood-type");

const loginUser = async function (loginData) {
  if (
    !validateEmail(loginData.email) ||
    !validatePassword(loginData.password)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const userData = await userDAO.userLogin(loginData);

  if (userData == null || userData == undefined) {
    return message.LOGIN_INCORRECT;
  } else if (userData) {
    const jsonUserData = {};

    const token = jwt.sign(
      { userId: userData.id, email: userData.email },
      JWT_SECRET
    );

    jsonUserData.status = message.LOGIN_CORRECT.status;
    jsonUserData.userData = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      photo: userData.photoUrl,
      token: token,
    };

    return jsonUserData;
  } else {
    return message.LOGIN_INCORRECT;
  }
};

const userInsert = async function (userData) {
  if (
    !validateName(userData.user.name) ||
    !validateCPF(userData.user.cpf) ||
    !validateEmail(userData.user.email) ||
    !validatePhone(userData.user.phone) ||
    !validateDate(userData.user.dateOfBirth) ||
    !validateWeight(userData.user.weight) ||
    !validatePhoto(userData.user.photo) ||
    !validatePassword(userData.user.password) ||
    !validateSex(userData.user.sex) ||
    !validateBloodType(userData.user.bloodType) ||
    !validateCEP(userData.address.cep) ||
    !validateUF(userData.address.uf) ||
    !validateCity(userData.address.city) ||
    !validateNeighborhood(userData.address.neighborhood) ||
    !validateStreet(userData.address.street) ||
    !validateNumber(userData.address.number) ||
    !validateComplement(userData.address.complement)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await userDAO.insertUser(userData);
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userGet = async function (userId) {
  if (!validateId(userId)) {
    return message.ERROR_INVALID_ID;
  }

  const userData = await userDAO.getUserById(userId);
  if (userData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (userData) {
    const jsonUserData = {};

    const age = Number(userData[0].age);

    jsonUserData.status = message.OK.status;
    jsonUserData.user = {
      id: userData[0].id,
      name: userData[0].name,
      photo: userData[0].photo_url,
      email: userData[0].email,
      phone: userData[0].phone,
      weight: userData[0].weight,
      dateOfBirth: userData[0].date_of_birth,
      age: age,
      bloodType: userData[0].type,
      sex: userData[0].sex,
      cpf: userData[0].cpf,
    };
    jsonUserData.address = {
      cep: userData[0].cep,
      uf: userData[0].uf,
      city: userData[0].city,
      neighborhood: userData[0].neighborhood,
      street: userData[0].street,
      complement: userData[0].complement,
      number: userData[0].number,
    };

    return jsonUserData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userEmailGet = async function (userEmail) {
  if (!validateEmail(userEmail.email)) {
    return message.ERROR_REQUIRED_DATA;
  }

  const userData = await userDAO.getUserByEmail(userEmail.email);

  if (userData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (userData) {
    const jsonUserData = {};

    jsonUserData.status = message.OK.status;
    jsonUserData.userData = {
      id: userData.id,
      email: userData.email,
      passwordResetToken: userData.password_reset_token,
      passwordResetExpires: userData.password_reset_expires
      // password: userData.password
    };

    return jsonUserData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userUpdate = async function (userId, userData) {
  if (!validateId(userId)) {
    return message.ERROR_INVALID_ID;
  } else if (
    !validateName(userData.user.name) ||
    !validateCPF(userData.user.cpf) ||
    !validateEmail(userData.user.email) ||
    !validatePhone(userData.user.phone) ||
    !validateDate(userData.user.dateOfBirth) ||
    !validateWeight(userData.user.weight) ||
    !validatePhoto(userData.user.photo) ||
    !validatePassword(userData.user.password) ||
    !validateSex(userData.user.sex) ||
    !validateBloodType(userData.user.bloodType) ||
    !validateCEP(userData.address.cep) ||
    !validateUF(userData.address.uf) ||
    !validateCity(userData.address.city) ||
    !validateNeighborhood(userData.address.neighborhood) ||
    !validateStreet(userData.address.street) ||
    !validateNumber(userData.address.number) ||
    !validateComplement(userData.address.complement)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const user = await userDAO.getUserById(userId);

  if (user.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await userDAO.updateUser(userId, userData);
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userForgotPasswordUpdate = async function (userId, userData) {
  const status = await userDAO.updatePasswordForgotUser(userId, userData);
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userGetSchedules = async function (userId) {
  if (!validateId(userId)) {
    return message.ERROR_INVALID_ID;
  }

  const userSchedulesData = await userDAO.getSchedulesUserById(userId);

  if (userSchedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (userSchedulesData) {
    let jsonUserSchedulesData = {};
    jsonUserSchedulesData.status = message.OK.status;
    jsonUserSchedulesData.schedules = [];

    for (userSchedule in userSchedulesData) {
      if (userSchedulesData) {
        let userSchedulesObject = {
          scheduleId: userSchedulesData[userSchedule].id_schedule,
          date: userSchedulesData[userSchedule].date,
          hour: userSchedulesData[userSchedule].hour,
          site: userSchedulesData[userSchedule].site,
          status: userSchedulesData[userSchedule].status,
          hospital: userSchedulesData[userSchedule].name,
        };

        jsonUserSchedulesData.schedules.push(userSchedulesObject);
      }
    }
    return jsonUserSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userGetSchedulesHospital = async function (hospitalId, userId) {
  if (!validateId(userId) || !validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const userSchedulesData = await userDAO.getSchedulesUserByHospitalId(hospitalId, userId);

  if (userSchedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (userSchedulesData) {
    let jsonUserSchedulesData = {};
    jsonUserSchedulesData.status = message.OK.status;
    jsonUserSchedulesData.schedules = [];

    for (userSchedule in userSchedulesData) {
      if (userSchedulesData) {
        let userSchedulesObject = {
          scheduleId: userSchedulesData[userSchedule].id_schedule,
          date: userSchedulesData[userSchedule].date,
          hour: userSchedulesData[userSchedule].hour,
          site: userSchedulesData[userSchedule].site,
          siteId: userSchedulesData[userSchedule].site_id,
          status: userSchedulesData[userSchedule].status,
          observation: userSchedulesData[userSchedule].observation,
          hospital: userSchedulesData[userSchedule].name,
        };

        jsonUserSchedulesData.schedules.push(userSchedulesObject);
      }
    }
    return jsonUserSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const userPasswordUpdate = async function (userId, userData) {
  if (!validateId(userId)) {
    return message.ERROR_INVALID_ID;
  } else if (!validatePassword(userData.password)) {
    return message.ERROR_REQUIRED_DATA;
  }

  const user = await userDAO.getUserById(userId);
  if (user.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await userDAO.updateUserPassword(userId, userData);
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};
const userDelete = async function (userId) {
  if (!validateId(userId)) {
    return message.ERROR_INVALID_ID;
  } else {
    const user = await userDAO.getUserById(userId);

    if (user.length == 0) {
      return message.ERROR_RESOURCE_NOT_FOUND;
    }

    const status = await userDAO.deleteUserById(userId);
    if (status) {
      return message.NO_CONTENT;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

module.exports = {
  loginUser,
  userInsert,
  userGet,
  userEmailGet,
  userUpdate,
  userGetSchedules,
  userPasswordUpdate,
  userForgotPasswordUpdate,
  userDelete,
  userGetSchedulesHospital
};
