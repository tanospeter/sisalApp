const express = require('express')
const queryControllers = require('../controllers/queryControllers')
const router = express.Router();

//@desc GET entity metadata or dating info
//@route POST - /api/getentitymeta
//@access public
router
  .route("/")
  .post(queryControllers.EntityMetaQuery)

module.exports = router
