const express = require('express')
const queryControllers = require('../controllers/queryControllers')
const router = express.Router();

//@desc GET monv1 data
//@route POST - /api/getmonv1
//@access public
router
  .route("/")
  .post(queryControllers.Monv1Query)

//@desc GET monitoring data from all tables
//@route POST - /api/getmonv1/monitoring
//@access public
router
  .route("/monitoring")
  .post(queryControllers.Monv1QueryMonitoring)

//@desc GET monitoring overview summary for the filtered site set
//@route POST - /api/getmonv1/overview
//@access public
router
  .route("/overview")
  .post(queryControllers.Monv1QueryOverview)

module.exports = router
