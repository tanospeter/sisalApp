const express = require('express')
const queryControllers = require('../controllers/queryControllers')
const router = express.Router();

//@desc GET entity metadata or dating info
//@route POST - /api/getsisalchrono
//@access public
router
  .route("/")
  .get(queryControllers.SisalChronosQuery)

module.exports = router
