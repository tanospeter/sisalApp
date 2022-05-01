const express = require('express')
const queryControllers = require('../controllers/queryControllers')
const router = express.Router();

//@desc GET all chronos fit to step1 entities
//@route POST - /api/step1
//@access public
router
  .route("/")  
  .post(queryControllers.step2Query)

module.exports = router