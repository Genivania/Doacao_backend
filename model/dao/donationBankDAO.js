var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const { getBloodTypeIdByName } = require("./bloodTypeDAO");

const getDonationBanksByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT tbl_donation_bank.id, tbl_donation_bank.year, tbl_donation_bank.blood_ml, tbl_blood_type.type FROM tbl_donation_bank
  INNER JOIN tbl_blood_type ON tbl_blood_type.id = tbl_donation_bank.id_blood_type
  WHERE id_hospital = ${hospitalId};
      `;

  const responseDonationBanks = await prisma.$queryRawUnsafe(sql);

  if (responseDonationBanks) {
    return responseDonationBanks;
  } else {
    return false;
  }
};

const getDonationBankId = async function (hospitalId, year, bloodType) {
  const sql = `
  SELECT 
  tbl_donation_bank.id AS id_donation_bank, 
  tbl_donation_bank.blood_ml, 
  tbl_donation_bank.id_blood_type, 
  tbl_blood_type.type 
  FROM tbl_donation_bank
  INNER JOIN tbl_blood_type ON tbl_donation_bank.id_blood_type = tbl_blood_type.id
  WHERE 
  tbl_donation_bank.year = ${year} AND type = '${bloodType}' AND id_hospital = ${hospitalId};
  `;

  const responseDonationBankId = await prisma.$queryRawUnsafe(sql);

  if (responseDonationBankId) {
    return responseDonationBankId;
  } else {
    return false;
  }
};

const getDonationBanksYearByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT year FROM tbl_donation_bank
  WHERE id_hospital = ${hospitalId}
  GROUP BY year
  ORDER BY year;
  `;

  const responseDonationBanksYears = await prisma.$queryRawUnsafe(sql);

  if (responseDonationBanksYears) {
    return responseDonationBanksYears;
  } else {
    return false;
  }
};

const insertDonationBank = async function (
  donationBankData,
  bloodTypeId,
  hospitalId
) {
  try {
    const insertDonationBankData = await prisma.donationBank.create({
      data: {
        year: donationBankData.year,
        bloodMl: donationBankData.bloodMl,
        idHospital: hospitalId,
        idBloodType: bloodTypeId,
      },
    });

    return insertDonationBankData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

async function updateOrInsertDonationBank(donationBankData) {
  const { year, bloodType, hospitalId, bloodMl } = donationBankData;

  const existingRecord = await prisma.donationBank.findFirst({
    where: {
      year,
      BloodType: {
        type: bloodType,
      },
      idHospital: hospitalId,
    },
  });

  if (existingRecord) {
    // Update existing record
    const updatedRecord = await prisma.donationBank.update({
      where: {
        id: existingRecord.id,
      },
      data: {
        bloodMl: bloodMl,
      },
    });

    return updatedRecord;
  } else {
    // Insert new record
    const newRecord = await prisma.donationBank.create({
      data: {
        year,
        bloodMl: bloodMl,
        BloodType: {
          connect: {
            type: bloodType,
          },
        },
        Hospital: {
          connect: {
            id: hospitalId,
          },
        },
      },
    });

    return newRecord;
  }
}

const insertBloodTypeDataByHospitalId = async function (hospitalId) {
  const bloodTypes = ["NA", "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
  const newDate = new Date();
  const currentYear = newDate.getFullYear();

  try {
    bloodTypes.map(async (bloodType) => {
      const bloodTypeId = await getBloodTypeIdByName(bloodType);

      const sql = `
      INSERT INTO tbl_donation_bank (blood_ml, id_hospital, year, id_blood_type)
      VALUES (0, ${hospitalId}, ${currentYear}, ${bloodTypeId});
    `;

      await prisma.$executeRawUnsafe(sql);
    });
  } catch (e) {
    console.error("Failed to create blood type records", e);
  }
};

module.exports = {
  getDonationBanksByHospitalId,
  getDonationBankId,
  insertDonationBank,
  updateOrInsertDonationBank,
  insertBloodTypeDataByHospitalId,
  getDonationBanksYearByHospitalId,
};
