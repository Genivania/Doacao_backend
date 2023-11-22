const bookScheduleDAO = require("../model/dao/bookScheduleDAO.js");

const message = require("./module/config.js");

// VALIDATIONS
const { validateId } = require("../validations/validate-id.js");
const { validateDate } = require("../validations/validate-date.js");
const { validateHour } = require("../validations/validate-hour.js");

const bookScheduleInsert = async function (bookScheduleData) {
  for (const bookSchedule of bookScheduleData) {
    if (
      !validateId(bookSchedule.hospitalSiteId) ||
      !validateDate(bookSchedule.date) ||
      !validateHour(bookSchedule.hour)
    ) {
      return message.ERROR_REQUIRED_DATA;
    }
  }

  const status = await bookScheduleDAO.insertBookSchedule(bookScheduleData);
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const bookScheduleGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const bookScheduleData = await bookScheduleDAO.getBookScheduleByHospitalId(
    hospitalId
  );

  if (bookScheduleData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (bookScheduleData) {
    const jsonBookScheduleData = {};

    jsonBookScheduleData.status = message.OK.status;
    jsonBookScheduleData.bookSchedule = bookScheduleData;

    return jsonBookScheduleData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const bookSchedulesGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const bookSchedulesData = await bookScheduleDAO.getBookSchedulesByHospitalId(
    hospitalId
  );

  if (bookSchedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (bookSchedulesData) {
    const jsonBookSchedulesData = {};

    jsonBookSchedulesData.status = message.OK.status;
    jsonBookSchedulesData.bookSchedules = bookSchedulesData;

    return jsonBookSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const bookSchedulesMobileGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const bookSchedulesData =
    await bookScheduleDAO.getBookSchedulesByHospitalIdMobile(hospitalId);

  if (bookSchedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (bookSchedulesData) {
    const jsonBookSchedulesData = {};

    const filteredBookSchedules = bookSchedulesData.filter(bookSchedule => {
      return bookSchedule.book_schedule_id != null
    })

    jsonBookSchedulesData.status = message.OK.status;
    jsonBookSchedulesData.bookSchedules = filteredBookSchedules;

    return jsonBookSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const bookScheduleUpdate = async function (bookScheduleId, bookScheduleData) {
  if (!validateId(bookScheduleId)) {
    return message.ERROR_INVALID_ID;
  } else if (
    !validateDate(bookScheduleData.date) ||
    !validateHour(bookScheduleData.hour) ||
    !validateId(bookScheduleData.siteId)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const bookSchedule = await bookScheduleDAO.getBookScheduleByHospitalId(
    bookScheduleId
  );

  if (bookSchedule.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await bookScheduleDAO.updateBookSchedule(
    bookScheduleId,
    bookScheduleData
  );
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const bookScheduleDelete = async function (bookScheduleId) {
  if (!validateId(bookScheduleId)) {
    return message.ERROR_INVALID_ID;
  } else {
    const bookSchedule = await bookScheduleDAO.getBookScheduleByHospitalId(
      bookScheduleId
    );

    if (bookSchedule.length == 0) {
      return message.ERROR_RESOURCE_NOT_FOUND;
    }

    const status = await bookScheduleDAO.deleteBookSchedule(bookScheduleId);
    if (status) {
      return message.NO_CONTENT;
    } else {
      return message.ERROR_INTERNAL_SERVER;
    }
  }
};

const hospitalIdBookScheduleIdGet = async function (bookScheduleId) {
  if (!validateId(bookScheduleId)) {
    return message.ERROR_INVALID_ID;
  }

  const schedulesData = await bookScheduleDAO.getHospitalIdByBookScheduleId(bookScheduleId);

  if (schedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (schedulesData) {
    const jsonSchedulesData = {};

    jsonSchedulesData.status = message.OK.status;
    jsonSchedulesData.hospitalId = schedulesData;

    return jsonSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  bookScheduleInsert,
  bookScheduleGet,
  bookSchedulesGet,
  bookSchedulesMobileGet,
  bookScheduleUpdate,
  bookScheduleDelete,
  hospitalIdBookScheduleIdGet
};
