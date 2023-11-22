var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const insertPhoto = async function (photoData, hospitalId) {
  try {
    const insertPhotoData = await prisma.photo.create({
      data: {
        url: photoData.photo,
        idHospital: hospitalId,
      },
    });

    return insertPhotoData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  insertPhoto
};
