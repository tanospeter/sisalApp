const express = require('express')
const queryControllers = require('../controllers/queryControllers')
const router = express.Router();

//@desc GET all chronos fit to selected entities
//@route POST - /api/...
//@access public
router
  .route("/")  
  .post(queryControllers.AdvancedQuery)

module.exports = router