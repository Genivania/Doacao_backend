const reviewDAO = require("../model/dao/reviewDAO.js");

const message = require("./module/config.js");

// VALIDATIONS
const { validateId } = require("../validations/validate-id");
const { validateOpinion } = require("../validations/validate-opinion");
const { validateStar } = require("../validations/validate-star");

const reviewInsert = async function (reviewData) {
  if (
    !validateOpinion(reviewData.opinion) ||
    !validateId(reviewData.idUser) ||
    !validateId(reviewData.idHospital) ||
    !validateStar(reviewData.idStar)
  ) {
    return message.ERROR_REQUIRED_DATA;
  }
  const status = await reviewDAO.insertReview(reviewData);
  if (status) {
    return message.CREATED_ITEM;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const ratingsStatisticsGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const ratingsStatisticsData =
    await reviewDAO.getRatingsStatisticsByHospitalId(hospitalId);

  if (ratingsStatisticsData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (ratingsStatisticsData) {
    const jsonRatingsStatisticsData = {};

    jsonRatingsStatisticsData.status = message.OK.status;
    jsonRatingsStatisticsData.ratingsStatistics = {
      oneStarsRating: ratingsStatisticsData[0].oneStarsRating,
      twoStarsRating: ratingsStatisticsData[0].twoStarsRating,
      threeStarsRating: ratingsStatisticsData[0].threeStarsRating,
      fourStarsRating: ratingsStatisticsData[0].fourStarsRating,
      fiveStarsRating: ratingsStatisticsData[0].fiveStarsRating,
      totalReviews: Number(ratingsStatisticsData[0].totalReviews),
      average: ratingsStatisticsData[0].average,
    };

    return jsonRatingsStatisticsData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

const reviewsStatisticsGet = async function (hospitalId) {
  if (!validateId(hospitalId)) {
    return message.ERROR_INVALID_ID;
  }

  const reviewsStatisticsData =
    await reviewDAO.getReviewsStatisticsByHospitalId(hospitalId);

  if (reviewsStatisticsData.length == 0) {
    return message.ERROR_RESOURCE_NOT_FOUND;
  } else if (reviewsStatisticsData) {
    const jsonReviewsStatisticsData = {};

    jsonReviewsStatisticsData.status = message.OK.status;
    jsonReviewsStatisticsData.reviewsStatistics = reviewsStatisticsData;

    return jsonReviewsStatisticsData;
  } else {
    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  reviewInsert,
  ratingsStatisticsGet,
  reviewsStatisticsGet,
};
