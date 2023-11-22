var { PrismaClient } = require("@prisma/client");
var prisma = new PrismaClient();

async function insertReview(reviewData) {
  // const [day, month, year] = reviewData.date.split('/');
  // const ISOdate = `${year}-${month}-${day}T00:00:00Z`;

  try {
    const insertReviewData = await prisma.review.create({
      data: {
        opinion: reviewData.opinion,
        date: new Date(),
        idUser: reviewData.idUser,
        idHospital: reviewData.idHospital,
        idStar: reviewData.idStar,
      },
    });

    return true;
  } catch (error) {
    console.error("Erro ao criar o review:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const getRatingsStatisticsByHospitalId = async function (hospitalId) {
  let sql = `
  SELECT 
  oneStarsRating,
  twoStarsRating,
  threeStarsRating,
  fourStarsRating,
  fiveStarsRating,
  totalReviews,
  ROUND((oneStarsRating * 1 + twoStarsRating * 2 + threeStarsRating * 3 + fourStarsRating * 4 + fiveStarsRating * 5) / totalReviews, 1) AS average
FROM (
  SELECT
    SUM(CASE WHEN id_star = 1 THEN 1 ELSE 0 END) AS oneStarsRating,
    SUM(CASE WHEN id_star = 2 THEN 1 ELSE 0 END) AS twoStarsRating,
    SUM(CASE WHEN id_star = 3 THEN 1 ELSE 0 END) AS threeStarsRating,
    SUM(CASE WHEN id_star = 4 THEN 1 ELSE 0 END) AS fourStarsRating,
    SUM(CASE WHEN id_star = 5 THEN 1 ELSE 0 END) AS fiveStarsRating,
    COUNT(*) AS totalReviews
  FROM tbl_review
  INNER JOIN tbl_hospital ON tbl_hospital.id = tbl_review.id_hospital
  WHERE tbl_hospital.id = ${hospitalId}
) AS subquery;
  `;

  let responseRatingsStatistics = await prisma.$queryRawUnsafe(sql);

  if (responseRatingsStatistics) {
    return responseRatingsStatistics;
  } else {
    return false;
  }
};

const getReviewsStatisticsByHospitalId = async function (hospitalId) {
  let sql = `
  SELECT 
  tbl_user.id AS userId, 
  tbl_user.name, 
  tbl_user.photo_url AS photo, 
  tbl_review.opinion, 
  DATE_FORMAT(tbl_review.date, '%d/%m/%Y') AS date,
  tbl_review.id_star AS starRating
  FROM tbl_user
  INNER JOIN tbl_review ON tbl_review.id_user = tbl_user.id
  INNER JOIN tbl_hospital ON tbl_hospital.id = tbl_review.id_hospital
  WHERE tbl_hospital.id = ${hospitalId};
  `;

  let responseReviewsStatistics = await prisma.$queryRawUnsafe(sql);

  if (responseReviewsStatistics) {
    return responseReviewsStatistics;
  } else {
    return false;
  }
};

module.exports = {
  insertReview,
  getRatingsStatisticsByHospitalId,
  getReviewsStatisticsByHospitalId,
};
