var { PrismaClient } = require("@prisma/client");

var prisma = new PrismaClient();

const insertSite = async function (siteData) {
  try {
    const insertDonationSiteData = await prisma.$transaction([
      prisma.site.create({
        data: {
          site: siteData.donationSite,
        },
      }),
      prisma.site.create({
        data: {
          site: siteData.otherDonationSite,
        },
      }),
    ]);

    return insertDonationSiteData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

const getSitesByHospitalId = async function (hospitalId) {
  let sql = `
  SELECT tbl_hospital_site.id_site AS idSite, tbl_site.site FROM tbl_hospital_site
  INNER JOIN tbl_site ON tbl_site.id = tbl_hospital_site.id_site
  WHERE id_hospital = ${hospitalId};
  `;

  let responseSites = await prisma.$queryRawUnsafe(sql);

  if (responseSites) {
    return responseSites;
  } else {
    return false;
  }
};

async function getHospitalIdBySiteId(siteId) {
  const sql = `
  SELECT tbl_hospital.id AS hospital_id FROM tbl_hospital_site
  INNER JOIN tbl_site ON tbl_hospital_site.id_site = tbl_site.id
  INNER JOIN tbl_hospital ON tbl_hospital.id = tbl_hospital_site.id_hospital
  WHERE tbl_site.id = ${siteId};
  `;

  const hospitalId = await prisma.$queryRawUnsafe(sql);

  if (hospitalId) {
    return hospitalId;
  } else {
    return false;
  }
}

module.exports = {
  insertSite,
  getSitesByHospitalId,
  getHospitalIdBySiteId
};
