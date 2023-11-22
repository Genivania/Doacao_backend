var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const insertPhone = async function (phoneData, hospitalId) {
  try {
    const insertPhoneData = await prisma.phone.create({
      data: {
        phone: phoneData.phone,
        idHospital: hospitalId,
      },
    });

    return insertPhoneData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  insertPhone
};
