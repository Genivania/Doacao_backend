var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const insertAddress = async function (addressData) {
  try {
    const insertAddressData = await prisma.address.create({
      data: {
        cep: addressData.cep,
        uf: addressData.uf,
        city: addressData.city,
        neighborhood: addressData.neighborhood,
        street: addressData.street,
        number: addressData.number,
        complement: addressData.complement,
      },
    });

    return insertAddressData; 
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  insertAddress
};
