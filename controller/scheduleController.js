const scheduleDAO = require("../model/dao/scheduleDAO.js");

const message = require("./module/config.js");

// VALIDATIONS
const { validateId } = require("../validations/validate-id");
const { validateOpinion } = require("../validations/validate-opinion");
const { validateDate } = require("../validations/validate-date");
const { validateHour } = require("../validations/validate-hour");

const scheduleInsert = async function (scheduleData) {
  if (
    !validateId(scheduleData.idUser) ||
    !validateId(scheduleData.idBookSchedule)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await scheduleDAO.insertSchedule(scheduleData);
  if (status) {
    const jsonScheduleInsert = {};
    jsonScheduleInsert.message = message.CREATED_ITEM.message;
    jsonScheduleInsert.status = message.CREATED_ITEM.status;
    jsonScheduleInsert.idSchedule = status.id;

    return jsonScheduleInsert;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const scheduleGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const scheduleData = await scheduleDAO.getScheduleByHospitalId(hospitalId);

  if (scheduleData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (scheduleData) {
    const jsonScheduleData = {};

    jsonScheduleData.status = message.OK.status;
    jsonScheduleData.schedule = scheduleData;

    return jsonScheduleData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const schedulesStatisticsGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }
  const schedulesStatisticsData =
    await scheduleDAO.getSchedulesStatisticsByHospitalId(hospitalId);

  if (schedulesStatisticsData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (schedulesStatisticsData) {
    const jsonSchedulesStatisticsData = {};

    jsonSchedulesStatisticsData.status = message.OK.status;
    jsonSchedulesStatisticsData.schedulesStatistics = {
      totalSchedules: Number(schedulesStatisticsData[0].totalSchedules),
      pendingAmount: schedulesStatisticsData[0].pendingAmount,
      scheduledAmount: schedulesStatisticsData[0].scheduledAmount,
      concludedAmount: schedulesStatisticsData[0].concludedAmount,
      rescheduledAmount: schedulesStatisticsData[0].rescheduledAmount,
    };

    return jsonSchedulesStatisticsData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const scheduleCancelUpdate = async function (scheduleId, scheduleData) {
  if (!validateId(scheduleId)) {
    return message.ERROR_INVALID_ID;
  } else if (!validateOpinion(scheduleData.observation)) {
    return message.ERROR_REQUIRED_DATA;
  }

  const schedule = await scheduleDAO.getScheduleByHospitalId(scheduleId);

  if (schedule.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await scheduleDAO.updateScheduleCancel(
    scheduleId,
    scheduleData
  );
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const scheduleConcludeUpdate = async function (scheduleId) {
  if (!validateId(scheduleId)) {
    return message.ERROR_INVALID_ID;
  }

  const schedule = await scheduleDAO.getScheduleByHospitalId(scheduleId);

  if (schedule.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await scheduleDAO.updateScheduleConclude(scheduleId);
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const scheduleRescheduleUpdate = async function (scheduleId, scheduleData) {
  if (!validateId(scheduleId)) {
    return message.ERROR_INVALID_ID;
  } else if (
    !validateDate(scheduleData.date) ||
    !validateHour(scheduleData.hour) ||
    !validateId(scheduleData.siteId)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const schedule = await scheduleDAO.getScheduleByHospitalId(scheduleId);

  if (schedule.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  }

  const status = await scheduleDAO.updateScheduleReschedule(
    scheduleId,
    scheduleData
  );
  if (status) {
    return message.UPDATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const schedulesGet = async function () {
  const schedulesData = await scheduleDAO.getSchedules();

  if (schedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (schedulesData) {
    const jsonSchedulesData = {};

    jsonSchedulesData.status = message.OK.status;
    jsonSchedulesData.schedules = schedulesData;

    return jsonSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const hospitalIdScheduleIdGet = async function (scheduleId) {
  if (!validateId(scheduleId)) {
    return message.ERROR_INVALID_ID;
  }

  const schedulesData = await scheduleDAO.getHospitalIdByScheduleId(scheduleId);

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

const userIdScheduleIdGet = async function (scheduleId) {
  if (!validateId(scheduleId)) {
    return message.ERROR_INVALID_ID;
  }

  const schedulesData = await scheduleDAO.getUserIdByScheduleId(scheduleId);

  if (schedulesData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (schedulesData) {
    const jsonSchedulesData = {};

    jsonSchedulesData.status = message.OK.status;
    jsonSchedulesData.userId = schedulesData;

    return jsonSchedulesData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  scheduleInsert,
  scheduleGet,
  schedulesStatisticsGet,
  scheduleCancelUpdate,
  scheduleConcludeUpdate,
  scheduleRescheduleUpdate,
  schedulesGet,
  hospitalIdScheduleIdGet,
  userIdScheduleIdGet
};
