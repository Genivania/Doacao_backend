var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const getBloodTypeIdByName = async function (bloodTypeData) {
  try {
    const bloodTypeName = await prisma.bloodType.findFirst({
      where: {
        type: bloodTypeData.toUpperCase(),
      },
    });

    return bloodTypeName.id;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  getBloodTypeIdByName,
};
