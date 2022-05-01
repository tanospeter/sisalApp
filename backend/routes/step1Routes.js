const express = require('express')
const queryControllers = require('../controllers/queryControllers')
const router = express.Router();

//@desc GET step1 metadata or dating info
//@route POST - /api/step1
//@access public
router
  .route("/")
  .post(queryControllers.step1Query)

module.exports = router
