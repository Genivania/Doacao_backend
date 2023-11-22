var { PrismaClient, STATUS } = require("@prisma/client");
var prisma = new PrismaClient();

const statusDAO = require("../dao/statusDAO");
const hospitalSiteDAO = require("../dao/hospitalSiteDAO");
const donationBankDAO = require("../dao/donationBankDAO");

const insertSchedule = async function (scheduleData) {
  try {
    const insertScheduleData = await prisma.schedule.create({
      data: {
        idUser: scheduleData.idUser,
        idBookSchedule: scheduleData.idBookSchedule,
      },
    });

    return insertScheduleData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

const getScheduleByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT * FROM tbl_schedule WHERE id = ${hospitalId};
  `;

  const responseSchedule = await prisma.$queryRawUnsafe(sql);

  if (responseSchedule) {
    return responseSchedule;
  } else {
    return false;
  }
};

const getSchedulesIdByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT tbl_schedule.id AS schedule_id FROM tbl_hospital
  INNER JOIN tbl_hospital_site ON tbl_hospital_site.id_hospital = tbl_hospital.id
  INNER JOIN tbl_book_schedule ON tbl_book_schedule.id_hospital_site = tbl_hospital_site.id
  INNER JOIN tbl_schedule ON tbl_schedule.id_book_schedule = tbl_book_schedule.id
  INNER JOIN tbl_schedule_status ON tbl_schedule_status.id_schedule = tbl_schedule.id
  WHERE tbl_hospital.id = ${hospitalId};
  `;

  const responseSchedule = await prisma.$queryRawUnsafe(sql);

  if (responseSchedule) {
    return responseSchedule;
  } else {
    return false;
  }
};

const getSchedulesStatisticsByHospitalId = async function (hospitalId) {
  let sql = `
  SELECT
  COUNT(tbl_schedule_status.id_schedule) AS totalSchedules,
  SUM(CASE WHEN tbl_status.status = "PENDING" THEN 1 ELSE 0 END) AS pendingAmount,
  SUM(CASE WHEN tbl_status.status = "SCHEDULED" THEN 1 ELSE 0 END) AS scheduledAmount,
  SUM(CASE WHEN tbl_status.status = "CONCLUDED" THEN 1 ELSE 0 END) AS concludedAmount,
  SUM(CASE WHEN tbl_status.status = "RESCHEDULED" THEN 1 ELSE 0 END) AS rescheduledAmount
  FROM tbl_hospital
  LEFT JOIN tbl_hospital_site ON tbl_hospital.id = tbl_hospital_site.id_hospital
  LEFT JOIN tbl_book_schedule ON tbl_hospital_site.id = tbl_book_schedule.id_hospital_site
  LEFT JOIN tbl_schedule ON tbl_book_schedule.id = tbl_schedule.id_book_schedule
  LEFT JOIN tbl_user ON tbl_schedule.id_user = tbl_user.id
  LEFT JOIN tbl_schedule_status ON tbl_schedule.id = tbl_schedule_status.id_schedule
  LEFT JOIN tbl_status ON tbl_schedule_status.id_status = tbl_status.id
  WHERE tbl_hospital.id = ${hospitalId};
  `;

  let responseSchedulesStatistics = await prisma.$queryRawUnsafe(sql);

  if (responseSchedulesStatistics) {
    return responseSchedulesStatistics;
  } else {
    return false;
  }
};

const getBloodTypeByScheduleId = async function (scheduleId) {
  const sql = `
  SELECT tbl_blood_type.type FROM tbl_schedule
  INNER JOIN tbl_user ON tbl_user.id = tbl_schedule.id_user
  INNER JOIN tbl_blood_type ON tbl_blood_type.id = tbl_user.id_blood_type
  WHERE tbl_schedule.id = ${scheduleId};
  `;

  const responseBloodType = await prisma.$queryRawUnsafe(sql);

  if (responseBloodType) {
    return responseBloodType;
  } else {
    return false;
  }
};

const getHospitalIdByScheduleId = async function (scheduleId) {
  const sql = `
  SELECT tbl_hospital.id AS id_hospital FROM tbl_schedule
  INNER JOIN tbl_book_schedule ON tbl_book_schedule.id = tbl_schedule.id_book_schedule
  INNER JOIN tbl_hospital_site ON tbl_hospital_site.id = tbl_book_schedule.id_hospital_site
  INNER JOIN tbl_hospital ON tbl_hospital.id = tbl_hospital_site.id_hospital
  WHERE tbl_schedule.id = ${scheduleId};
  `;

  const responseHospitalId = await prisma.$queryRawUnsafe(sql);

  if (responseHospitalId) {
    return responseHospitalId;
  } else {
    return false;
  }
};

const getUserIdByScheduleId = async function (scheduleId) {
  const sql = `
  SELECT tbl_schedule.id_user FROM tbl_schedule
  WHERE tbl_schedule.id = ${scheduleId};
  `;

  const responseUserId = await prisma.$queryRawUnsafe(sql);

  if (responseUserId) {
    return responseUserId;
  } else {
    return false;
  }
};

async function updateScheduleCancel(scheduleId, scheduleData) {
  const statusId = await statusDAO.getStatusIdByName("PENDING");

  const sql = `
  UPDATE tbl_schedule_status
  SET 
  id_status = ${statusId[0].id},
  observation = "${scheduleData.observation}"
  WHERE id_schedule = ${scheduleId};
  `;

  const updateSchedule = await prisma.$queryRawUnsafe(sql);

  if (updateSchedule) {
    return updateSchedule;
  } else {
    return false;
  }
}

async function updateScheduleConclude(scheduleId) {
  const statusId = await statusDAO.getStatusIdByName("CONCLUDED");

  const sql = `
  UPDATE tbl_schedule_status
  SET 
  id_status = ${statusId[0].id}
  WHERE id_schedule = ${scheduleId};
  `;

  const updateSchedule = await prisma.$queryRawUnsafe(sql);

  //FAZER UPDATE DO DONATIONBANK AQUI
  const newDate = new Date();
  const currentYear = newDate.getFullYear();

  const bloodType = await getBloodTypeByScheduleId(scheduleId)

  const hospitalId = await getHospitalIdByScheduleId(scheduleId)

  const donationBankData = {
    year: currentYear,
    bloodMl: 350,
    bloodType: bloodType[0].type,
    hospitalId: hospitalId[0].id_hospital,
  };

  //Increment Donation Bank
  await donationBankDAO.updateOrInsertDonationBank(donationBankData);

  if (updateSchedule) {
    return updateSchedule;
  } else {
    return false;
  }
}

async function updateScheduleReschedule(scheduleId, scheduleData) {
  const bookScheduleId = await getBookScheduleId(scheduleId);

  const statusId = await statusDAO.getStatusIdByName("RESCHEDULED");

  const sqlUpdateScheduleStatus = `
  UPDATE tbl_schedule_status
  SET 
  id_status = ${statusId[0].id}
  WHERE id_schedule = ${scheduleId};
  `;

  const splitDate = scheduleData.date.split("/");

  const day = splitDate[0];
  const month = splitDate[1];
  const year = splitDate[2];

  const formattedDate = `${year}/${month}/${day}`;

  const sqlUpdateBookSchedule = `
  UPDATE tbl_book_schedule
  SET 
  date = '${formattedDate}',
  hour = '${scheduleData.hour}'
  where id = ${bookScheduleId[0].id_book_schedule};
  `;

  const hospitalSiteId = await hospitalSiteDAO.getHospitalSiteIdBySiteId(
    scheduleData.siteId
  );

  const sqlUpdateSite = `
  UPDATE tbl_book_schedule
  INNER JOIN tbl_hospital_site ON tbl_book_schedule.id_hospital_site = tbl_hospital_site.id
  INNER JOIN tbl_site ON tbl_site.id = tbl_hospital_site.id_site
  INNER JOIN tbl_schedule ON tbl_schedule.id_book_schedule = tbl_book_schedule.id
  SET tbl_book_schedule.id_hospital_site = ${hospitalSiteId[0].hospital_site_id}
  WHERE tbl_schedule.id = ${scheduleId};
  `;

  const updateSchedule = await prisma.$queryRawUnsafe(sqlUpdateScheduleStatus);
  const updateBookSchedule = await prisma.$queryRawUnsafe(
    sqlUpdateBookSchedule
  );
  const updateSite = await prisma.$queryRawUnsafe(sqlUpdateSite);

  if (updateSchedule && updateBookSchedule && updateSite) {
    return updateSchedule;
  } else {
    return false;
  }
}

async function getSchedules() {
  let sql = `
  SELECT * from tbl_schedule;
  `;

  let responseSchedules = await prisma.$queryRawUnsafe(sql);

  if (responseSchedules) {
    return responseSchedules;
  } else {
    return false;
  }
}

const getBookScheduleId = async function (scheduleId) {
  const sql = `
  SELECT tbl_schedule.id_book_schedule FROM tbl_schedule
  INNER JOIN tbl_book_schedule ON tbl_schedule.id_book_schedule = tbl_book_schedule.id
  WHERE tbl_schedule.id = ${scheduleId};
  `;

  const responseBookSchedule = await prisma.$queryRawUnsafe(sql);

  if (responseBookSchedule) {
    return responseBookSchedule;
  } else {
    return false;
  }
};

const getScheduleIdByBookScheduleId = async function (bookScheduleId) {
  const sql = `
  SELECT tbl_schedule_status.id_schedule FROM tbl_schedule_status
  INNER JOIN tbl_schedule ON tbl_schedule_status.id_schedule = tbl_schedule.id
  INNER JOIN tbl_book_schedule ON tbl_book_schedule.id = tbl_schedule.id_book_schedule
  WHERE tbl_book_schedule.id = ${bookScheduleId};
  `;

  const responseScheduleId = await prisma.$queryRawUnsafe(sql);

  if (responseScheduleId) {
    return responseScheduleId;
  } else {
    return false;
  }
};

const getScheduleIdByUserId = async function (userId) {
  const sql = `
  SELECT tbl_schedule_status.id_schedule FROM tbl_schedule_status
  INNER JOIN tbl_schedule ON tbl_schedule_status.id_schedule = tbl_schedule.id
  INNER JOIN tbl_user ON tbl_schedule.id_user = tbl_user.id
  WHERE tbl_user.id = ${userId};
  `;

  const responseScheduleId = await prisma.$queryRawUnsafe(sql);

  if (responseScheduleId) {
    return responseScheduleId;
  } else {
    return false;
  }
};

const getScheduleIdByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT tbl_schedule_status.id_schedule FROM tbl_schedule_status
  INNER JOIN tbl_schedule ON tbl_schedule_status.id_schedule = tbl_schedule.id
  INNER JOIN tbl_book_schedule ON tbl_schedule.id_book_schedule = tbl_book_schedule.id
  INNER JOIN tbl_hospital_site ON tbl_book_schedule.id_hospital_site = tbl_hospital_site.id
  INNER JOIN tbl_hospital ON tbl_hospital_site.id_hospital = tbl_hospital.id
  WHERE tbl_hospital.id = ${hospitalId};
  `;

  const responseScheduleId = await prisma.$queryRawUnsafe(sql);

  if (responseScheduleId) {
    return responseScheduleId;
  } else {
    return false;
  }
};

module.exports = {
  insertSchedule,
  getScheduleByHospitalId,
  getSchedulesStatisticsByHospitalId,
  updateScheduleCancel,
  updateScheduleConclude,
  updateScheduleReschedule,
  getSchedules,
  getScheduleIdByBookScheduleId,
  getScheduleIdByUserId,
  getScheduleIdByHospitalId,
  getSchedulesIdByHospitalId,
  getHospitalIdByScheduleId,
  getUserIdByScheduleId,
};
