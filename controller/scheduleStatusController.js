const scheduleStatusDAO = require("../model/dao/scheduleStatusDAO.js");

// VALIDATIONS
const { validateOpinion } = require("../validations/validate-opinion.js");
const { validateId } = require("../validations/validate-id.js");

const message = require("./module/config.js");

const scheduleStatusInsert = async function (scheduleStatusData) {
  if (
    !validateOpinion(scheduleStatusData.observation) ||
    !validateId(scheduleStatusData.idSchedule)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }

  const status = await scheduleStatusDAO.insertScheduleStatus(
    scheduleStatusData
  );
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  scheduleStatusInsert,
};
