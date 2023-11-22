var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const getSexIdByName = async function (sexData) {
  try {
    const sexName = await prisma.sex.findFirst({
      where: {
        sex: sexData.toUpperCase(),
      },
    });

    return sexName.id;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  getSexIdByName,
};
