var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

const getCampaignById = async function (campaignId) {
  const sql = `
    SELECT * FROM tbl_campaign
    WHERE id = ${campaignId};
    `;

  const responseCampaign = await prisma.$queryRawUnsafe(sql);

  if (responseCampaign) {
    return responseCampaign;
  } else {
    return false;
  }
};

const getCampaignsByHospitalId = async function (hospitalId) {
  const sql = `
  SELECT 
  id,
  DATE_FORMAT(date, '%d/%m/%Y') AS date,
  TIME_FORMAT(hour, '%H:%i') AS hour,
  description,
  image
  FROM tbl_campaign
  WHERE id_hospital = ${hospitalId};
  `;

  const responseCampaigns = await prisma.$queryRawUnsafe(sql);

  if (responseCampaigns) {
    return responseCampaigns;
  } else {
    return false;
  }
};

const getCampaigns = async function () {
  const sql = `
  SELECT 
  tbl_campaign.id AS campaign_id,
  tbl_hospital.id AS hospital_id,
  tbl_hospital.name AS hospital_name,
  tbl_photo.url AS hospital_photo,
  DATE_FORMAT(tbl_campaign.date, '%d/%m/%Y') AS date,
  TIME_FORMAT(tbl_campaign.hour, '%H:%i') AS hour,
  tbl_campaign.description,
  tbl_campaign.image
  FROM tbl_campaign
  INNER JOIN tbl_hospital ON tbl_hospital.id = tbl_campaign.id_hospital
  INNER JOIN tbl_photo ON tbl_hospital.id = tbl_photo.id_hospital;
  `;

  const responseCampaigns = await prisma.$queryRawUnsafe(sql);

  if (responseCampaigns) {
    return responseCampaigns;
  } else {
    return false;
  }
};

const insertCampaign = async function (campaignData) {
  try {
    const [day, month, year] = campaignData.date.split("/");
    const ISOdate = `${year}-${month}-${day}T00:00:00Z`;

    const [hour, minute] = campaignData.hour.split(":");
    const ISOhour = `1970-01-01T${hour}:${minute}:00Z`;

    const insertCampaignData = await prisma.campaign.create({
      data: {
        date: ISOdate,
        hour: ISOhour,
        description: campaignData.description,
        image: campaignData.image,
        idHospital: Number(campaignData.hospitalId),
      },
    });

    return insertCampaignData;
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

async function updateCampaign(campaignId, campaignData) {
  try {
    const [day, month, year] = campaignData.date.split("/");
    const ISOdate = `${year}-${month}-${day}T00:00:00Z`;

    const [hour, minute] = campaignData.hour.split(":");
    const ISOhour = `1970-01-01T${hour}:${minute}:00Z`;

    const updatedCampaign = await prisma.campaign.update({
      where: {
        id: Number(campaignId),
      },
      data: {
        date: ISOdate,
        hour: ISOhour,
        description: campaignData.description,
        image: campaignData.image,
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar a campanha:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteCampaignById(campaignId) {
  try {
    const deletedCampaign = await prisma.campaign.delete({
      where: {
        id: Number(campaignId),
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao excluir a campanha:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const getHospitalIdByCampaignId = async function (campaignId) {
  const sql = `
  SELECT 
  id_hospital
  FROM tbl_campaign
  WHERE id = ${campaignId};
  `;

  const responseCampaigns = await prisma.$queryRawUnsafe(sql);
  
  if (responseCampaigns) {
    return responseCampaigns;
  } else {
    return false;
  }
};

module.exports = {
  getCampaignById,
  getCampaignsByHospitalId,
  insertCampaign,
  updateCampaign,
  deleteCampaignById,
  getCampaigns,
  getHospitalIdByCampaignId
};
