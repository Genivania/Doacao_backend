var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const cron = require("node-cron");

const addressDAO = require("./addressDAO.js");
const phoneDAO = require("./phoneDAO.js");
const photoDAO = require("./photoDAO.js");
const siteDAO = require("./siteDAO.js");
const hospitalSiteDAO = require("./hospitalSiteDAO.js");
const scheduleDAO = require("./scheduleDAO.js");
const bookScheduleDAO = require("./bookScheduleDAO.js");
const donationBankDAO = require("./donationBankDAO.js");

const hospitalLogin = async function (loginData) {
  try {
    //Verify hospital
    const hospital = await getHospitalByEmail(loginData.email);

    // Verify password
    const passwordMatch =
      loginData.password === hospital.password ? true : false;

    if (passwordMatch) {
      return hospital;
    }
  } catch (error) {
    return false;
  }
};

async function insertHospital(hospitalData) {
  try {
    //Address Insert
    let addressInsert = await addressDAO.insertAddress(hospitalData.address);
    let addressId = addressInsert.id;

    //Hospital Insert
    const insertHospitalData = await prisma.hospital.create({
      data: {
        name: hospitalData.hospital.name,
        cnpj: hospitalData.hospital.cnpj,
        email: hospitalData.hospital.email,
        websiteUrl: hospitalData.hospital.website,
        password: hospitalData.hospital.password,
        idAddress: addressId,
      },
    });
    let hospitalId = insertHospitalData.id;

    //Phone Insert
    let phoneInsert = await phoneDAO.insertPhone(
      hospitalData.hospital,
      hospitalId
    );

    //Site Insert
    let insertSite = await siteDAO.insertSite(hospitalData.hospital);

    let donationSiteId = insertSite[0].id;
    let otherDonationSiteId = insertSite[1].id;

    //Hospital Site Insert
    let insertHospitalSite = await hospitalSiteDAO.insertHospitalSite(
      hospitalId,
      donationSiteId,
      otherDonationSiteId
    );

    //Photo Insert
    let insertPhoto = await photoDAO.insertPhoto(
      hospitalData.hospital,
      hospitalId
    );

    //Donation Bank Inserts
    let insertDonationBanks =
      await donationBankDAO.insertBloodTypeDataByHospitalId(hospitalId);

    return true;
  } catch (error) {
    console.error("Erro ao criar o hospital:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const getHospitalById = async function (hospitalId) {
  let sql = `
  SELECT tbl_hospital.id,
  tbl_hospital.name,
  tbl_hospital.cnpj,
  tbl_hospital.email,
  tbl_phone.phone,
  tbl_hospital.website_url,
  tbl_photo.url,
  tbl_address.cep,
  tbl_address.uf,
  tbl_address.city,
  tbl_address.neighborhood,
  tbl_address.street,
  tbl_address.number,
  tbl_address.complement,
  (
      SELECT site
      FROM tbl_hospital_site
          INNER JOIN tbl_site ON tbl_hospital_site.id_site = tbl_site.id
      WHERE tbl_hospital_site.id_hospital = tbl_hospital.id
      ORDER BY tbl_site.id
      LIMIT 1
  ) AS donationSite,
  (
      SELECT site
      FROM tbl_hospital_site
          INNER JOIN tbl_site ON tbl_hospital_site.id_site = tbl_site.id
      WHERE tbl_hospital_site.id_hospital = tbl_hospital.id
      ORDER BY tbl_site.id
      LIMIT 1 OFFSET 1
  ) AS otherDonationSite
FROM tbl_hospital
  INNER JOIN tbl_phone ON tbl_phone.id_hospital = tbl_hospital.id
  INNER JOIN tbl_photo ON tbl_photo.id_hospital = tbl_hospital.id
  INNER JOIN tbl_address ON tbl_hospital.id_address = tbl_address.id
WHERE tbl_hospital.id = ${hospitalId};
  `;

  let responseHospital = await prisma.$queryRawUnsafe(sql);

  if (responseHospital) {
    return responseHospital;
  } else {
    return false;
  }
};

const getHospitalByEmail = async function (hospitalEmail) {
  try {
    const hospital = await prisma.hospital.findFirst({
      where: {
        email: hospitalEmail,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        Photo: {
          select: {
            url: true,
          },
        },
      },
    });
    return hospital;
  } catch (error) {
    return false;
  }
};

const getHospitalSchedules = async function (hospitalId) {
  const sql = `
  SELECT 
  tbl_user.id, 
  tbl_user.name, 
  tbl_user.photo_url, 
  tbl_schedule_status.id_schedule,
  DATE_FORMAT(tbl_book_schedule.date, '%d/%m/%Y') AS date,
  TIME_FORMAT(tbl_book_schedule.hour, '%H:%i') AS hour,
  tbl_site.id AS site_id, 
  tbl_site.site, 
  tbl_status.status,
  tbl_schedule_status.observation
  FROM tbl_user
  INNER JOIN tbl_schedule ON tbl_schedule.id_user = tbl_user.id
  INNER JOIN tbl_book_schedule ON tbl_book_schedule.id = tbl_schedule.id_book_schedule
  INNER JOIN tbl_hospital_site ON tbl_hospital_site.id = tbl_book_schedule.id_hospital_site
  INNER JOIN tbl_site ON tbl_site.id = tbl_hospital_site.id_site
  INNER JOIN tbl_schedule_status ON tbl_schedule_status.id_schedule = tbl_schedule.id
  INNER JOIN tbl_status ON tbl_status.id = tbl_schedule_status.id_status
  INNER JOIN tbl_hospital ON tbl_hospital.id = tbl_hospital_site.id_hospital
  WHERE tbl_hospital.id = ${hospitalId}
  ORDER BY tbl_schedule_status.id_schedule;
  `;

  const responseSchedules = await prisma.$queryRawUnsafe(sql);

  if (responseSchedules) {
    return responseSchedules;
  } else {
    return false;
  }
};

const getHospitalFilteredStatusSchedules = async function (hospitalId, status) {
  const sql = `
  SELECT 
  tbl_user.id, 
  tbl_user.name, 
  tbl_user.photo_url, 
  tbl_schedule_status.id_schedule,
  DATE_FORMAT(tbl_book_schedule.date, '%d/%m/%Y') AS date,
  TIME_FORMAT(tbl_book_schedule.hour, '%H:%i') AS hour,
  tbl_site.id AS site_id, 
  tbl_site.site, 
  tbl_status.status,
  tbl_schedule_status.observation
  FROM tbl_user
  INNER JOIN tbl_schedule ON tbl_schedule.id_user = tbl_user.id
  INNER JOIN tbl_book_schedule ON tbl_book_schedule.id = tbl_schedule.id_book_schedule
  INNER JOIN tbl_hospital_site ON tbl_hospital_site.id = tbl_book_schedule.id_hospital_site
  INNER JOIN tbl_site ON tbl_site.id = tbl_hospital_site.id_site
  INNER JOIN tbl_schedule_status ON tbl_schedule_status.id_schedule = tbl_schedule.id
  INNER JOIN tbl_status ON tbl_status.id = tbl_schedule_status.id_status
  INNER JOIN tbl_hospital ON tbl_hospital.id = tbl_hospital_site.id_hospital
  WHERE tbl_hospital.id = ${hospitalId} AND tbl_status.status = '${status}'
  ORDER BY tbl_schedule_status.id_schedule;
  `;

  const responseSchedules = await prisma.$queryRawUnsafe(sql);

  if (responseSchedules) {
    return responseSchedules;
  } else {
    return false;
  }
};

const getHospitalFilteredNameSchedules = async function (hospitalId, userName) {
  const sql = `
  SELECT 
  tbl_user.id, 
  tbl_user.name, 
  tbl_user.photo_url, 
  tbl_schedule_status.id_schedule,
  DATE_FORMAT(tbl_book_schedule.date, '%d/%m/%Y') AS date,
  TIME_FORMAT(tbl_book_schedule.hour, '%H:%i') AS hour,
  tbl_site.id AS site_id, 
  tbl_site.site, 
  tbl_status.status,
  tbl_schedule_status.observation
  FROM tbl_user
  INNER JOIN tbl_schedule ON tbl_schedule.id_user = tbl_user.id
  INNER JOIN tbl_book_schedule ON tbl_book_schedule.id = tbl_schedule.id_book_schedule
  INNER JOIN tbl_hospital_site ON tbl_hospital_site.id = tbl_book_schedule.id_hospital_site
  INNER JOIN tbl_site ON tbl_site.id = tbl_hospital_site.id_site
  INNER JOIN tbl_schedule_status ON tbl_schedule_status.id_schedule = tbl_schedule.id
  INNER JOIN tbl_status ON tbl_status.id = tbl_schedule_status.id_status
  INNER JOIN tbl_hospital ON tbl_hospital.id = tbl_hospital_site.id_hospital
  WHERE tbl_hospital.id = ${hospitalId} AND tbl_user.name LIKE '%${userName}%'
  ORDER BY tbl_schedule_status.id_schedule;
  `;

  const responseSchedules = await prisma.$queryRawUnsafe(sql);

  if (responseSchedules) {
    return responseSchedules;
  } else {
    return false;
  }
};

async function updateHospital(hospitalId, hospitalData) {
  try {
    const sitesId = await siteDAO.getSitesByHospitalId(hospitalId);

    const updatedHospital = await prisma.hospital.update({
      where: {
        id: Number(hospitalId),
      },
      data: {
        // UPDATE HOSPITAL
        name: hospitalData.hospital.name,
        cnpj: hospitalData.hospital.cnpj,
        email: hospitalData.hospital.email,
        websiteUrl: hospitalData.hospital.website,
        // UPDATE PHONE
        Phone: {
          update: {
            where: {
              id: Number(hospitalId),
            },
            data: {
              phone: hospitalData.hospital.phone,
            },
          },
        },
        // UPDATE PHOTO
        Photo: {
          update: {
            where: {
              id: Number(hospitalId),
            },
            data: {
              url: hospitalData.hospital.photo,
            },
          },
        },
        // UPDATE ADDRESS
        Address: {
          update: {
            cep: hospitalData.address.cep,
            uf: hospitalData.address.uf,
            city: hospitalData.address.city,
            neighborhood: hospitalData.address.neighborhood,
            street: hospitalData.address.street,
            number: hospitalData.address.number,
            complement: hospitalData.address.complement,
          },
        },
      },
    });

    await prisma.site.update({
      where: {
        id: sitesId[0].idSite,
      },
      data: {
        site: hospitalData.hospital.donationSite,
      },
    });

    if (sitesId[1]) {
      await prisma.site.update({
        where: {
          id: sitesId[1].idSite,
        },
        data: {
          site: hospitalData.hospital.otherDonationSite,
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o hospital:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateHospitalPassword(hospitalId, hospitalData) {
  try {
    const oldHospitalData = await prisma.hospital.findUnique({
      where: {
        id: Number(hospitalId),
      },
      select: {
        password: true,
      },
    });

    const updatedHospital = await prisma.hospital.update({
      where: {
        id: Number(hospitalId),
      },
      data: {
        password: hospitalData.password,
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar o hospital password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const getHospitals = async function () {
  let sql = `
  SELECT 
  tbl_hospital.id AS hospitalId,
  tbl_hospital.name,
  tbl_address.uf,
  tbl_address.city,
  tbl_address.neighborhood
  FROM tbl_hospital
  INNER JOIN tbl_address ON tbl_address.id = tbl_hospital.id_address;
  `;

  let responseHospitals = await prisma.$queryRawUnsafe(sql);

  if (responseHospitals) {
    return responseHospitals;
  } else {
    return false;
  }
};

const getHospitalsId = async function () {
  const sql = `
  SELECT 
  tbl_hospital.id
  FROM tbl_hospital;
  `;

  const responseHospitalsId = await prisma.$queryRawUnsafe(sql);

  if (responseHospitalsId) {
    return responseHospitalsId;
  } else {
    return false;
  }
};

async function deleteHospitalById(hospitalId) {
  const sqlDeleteCampaign = `
  DELETE FROM tbl_campaign
  WHERE id_hospital = ${hospitalId};
  `;
  const responseDeleteCampaign = await prisma.$executeRawUnsafe(
    sqlDeleteCampaign
  );

  const sqlDeleteDonationBank = `
  DELETE FROM tbl_donation_bank
  WHERE id_hospital = ${hospitalId};
  `;
  const responseDeleteDonationBank = await prisma.$executeRawUnsafe(
    sqlDeleteDonationBank
  );

  const bookSchedulesId = await bookScheduleDAO.getBookSchedulesByHospitalId(
    hospitalId
  );

  const deletePromisesBookSchedules = bookSchedulesId.map(async (bookSchedule) => {
    await bookScheduleDAO.deleteBookSchedule(bookSchedule.id);
  });

  // Wait for all promises to resolve
  await Promise.all(deletePromisesBookSchedules);

  const independentBookSchedules =
    await bookScheduleDAO.getBookSchedulesByHospitalIdMobile(hospitalId);

  const deletePromisesIndependentBookSchedules = independentBookSchedules.map(async (bookSchedule) => {
    if (bookSchedule.book_schedule_id != null) {
      await bookScheduleDAO.deleteBookSchedule(bookSchedule.book_schedule_id);
    }
  });

  // Wait for all promises to resolve
  await Promise.all(deletePromisesIndependentBookSchedules);

  const sqlDeleteHospitalSite = `
  DELETE FROM tbl_hospital_site
  WHERE id_hospital = ${hospitalId};
  `;

  const responseDeleteHospitalSite = await prisma.$executeRawUnsafe(
    sqlDeleteHospitalSite
  );

  const sqlDeletePhone = `
  DELETE FROM tbl_phone
  WHERE id_hospital = ${hospitalId};
  `;
  const responseDeletePhone = await prisma.$executeRawUnsafe(sqlDeletePhone);

  const sqlDeletePhoto = `
  DELETE FROM tbl_photo
  WHERE id_hospital = ${hospitalId};
  `;
  const responseDeletePhoto = await prisma.$executeRawUnsafe(sqlDeletePhoto);

  const sqlDeleteReview = `
  DELETE FROM tbl_review
  WHERE id_hospital = ${hospitalId};
  `;
  const responseDeleteReview = await prisma.$executeRawUnsafe(sqlDeleteReview);

  const sqlDeleteHospital = `
  DELETE FROM tbl_hospital
  WHERE id = ${hospitalId};
  `;
  const responseDeleteHospital = await prisma.$executeRawUnsafe(
    sqlDeleteHospital
  );

  if (responseDeleteHospital) {
    return responseDeleteHospital;
  } else {
    return false;
  }
}

const insertBloodTypeData = async function () {
  const bloodTypes = ["NA", "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
  const newDate = new Date();
  const currentYear = newDate.getFullYear();

  const hospitalsId = await getHospitalsId();

  try {
    bloodTypes.map(async (bloodType) => {
      const bloodTypeId = await getBloodTypeIdByName(bloodType);

      hospitalsId.forEach(async (hospitalId) => {
        const sql = `
        INSERT INTO tbl_donation_bank (blood_ml, id_hospital, year, id_blood_type)
        VALUES (0, ${hospitalId}, ${currentYear}, ${bloodTypeId});
      `;

        await prisma.$executeRawUnsafe(sql);
      });
    });
  } catch (e) {
    console.error("Failed to create blood type records", e);
  }
};

const checkAndInsertNewYearRecord = async () => {
  const currentYear = new Date().getFullYear();

  // Consulta para verificar se já existe um registro para o ano atual
  const existingRecord = await prisma.donationBank.findUnique({
    where: {
      year: currentYear,
    },
  });

  if (!existingRecord) {
    // Se não houver um registro para o ano atual, faça o INSERT
    await insertBloodTypeData();
    console.log(`Registro inserido para o ano ${currentYear}`);
  } else {
    console.log(`Registro já existe para o ano ${currentYear}`);
  }
};

cron.schedule("0 0 1 1 *", async () => {
  await checkAndInsertNewYearRecord();
  console.log("Verificação e inserção do ano concluídas.");
});

module.exports = {
  hospitalLogin,
  insertHospital,
  getHospitalById,
  getHospitalsId,
  getHospitalByEmail,
  getHospitalSchedules,
  getHospitalFilteredStatusSchedules,
  getHospitalFilteredNameSchedules,
  updateHospital,
  updateHospitalPassword,
  getHospitals,
  deleteHospitalById,
};
