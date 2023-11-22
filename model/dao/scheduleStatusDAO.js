var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const statusDAO = require('./statusDAO')

const insertScheduleStatus = async function (scheduleStatusData) {
  const idStatus = await statusDAO.getStatusIdByName(scheduleStatusData.status)

  try {
    const insertScheduleStatusData = await prisma.scheduleStatus.create({
      data: {
        observation: scheduleStatusData.observation,
        idStatus: idStatus[0].id,
        idSchedule: scheduleStatusData.idSchedule,
      },
    });

    return insertScheduleStatusData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  insertScheduleStatus,
};
