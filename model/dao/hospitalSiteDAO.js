var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const insertHospitalSite = async function (hospitalId, siteId, otherSiteId) {
  try {
    const insertHospitalSiteData = await prisma.hospitalSite.createMany({
      data: [
        {
          idHospital: hospitalId,
          idSite: siteId,
        },
        {
          idHospital: hospitalId,
          idSite: otherSiteId,
        },
      ],
    });

    return insertHospitalSiteData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

async function getHospitalSiteIdBySiteId(siteId) {
  const sql = `
  SELECT tbl_hospital_site.id AS hospital_site_id FROM tbl_hospital_site
  INNER JOIN tbl_site ON tbl_hospital_site.id_site = tbl_site.id
  WHERE tbl_site.id = ${siteId};
  `;

  const hospitalSiteId = await prisma.$queryRawUnsafe(sql);

  if (hospitalSiteId) {
    return hospitalSiteId;
  } else {
    return false;
  }
}

module.exports = {
  insertHospitalSite,
  getHospitalSiteIdBySiteId,
};
