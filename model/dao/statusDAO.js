var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const getStatusIdByName = async function (status) {
  const sql = `
  SELECT id FROM tbl_status
  WHERE status = '${status}';
  `;

  const responseStatus = await prisma.$queryRawUnsafe(sql);

  if (responseStatus) {
    return responseStatus;
  } else {
    return false;
  }
};

module.exports = {
  getStatusIdByName,
};
