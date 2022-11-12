const entityQuery = require('../models/entityQuery')
const datingQuery = require('../models/datingQuery')
const chronoQuery = require('../models/chronoQuery')
const advancedQuery = require('../models/advancedQuery')

exports.EntityMetaQuery = async (req, res, next) => { 
  try {
    console.log(`queryControllers.EntityMetaQuery: ${JSON.stringify(req.body)}`)
    let {
      email,
      siteName,
      lat,      
      lon,
      age
    } = req.body
    
    let query = new entityQuery(
      email,
      siteName,
      lat,
      lon,
      age,
      )
         
    await query.save()
    
    let sql = query.queryBuilder()
    
    const [meta, _] = await query.getEntityMeta(sql)

    res.status(201).json({meta,sql})
  
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.DatingQuery = async (req, res, next) =>{
  try {
    let {entity_ids} =req.body

    let query = new datingQuery(entity_ids)

    let sql = query.queryBuilder()

    const [dating, _] = await query.getDating(sql)

    res.status(201).json({dating, sql})

  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.SisalChronosQuery = async (req, res, next) => {
  console.log(req.body)
  try {
    let {
      entity_ids,
      chronos
    } = req.body
    
    let query = new chronoQuery(entity_ids, chronos)
    
    let sql = query.queryBuilder()
      
    const [sisalChronos, _] = await query.getSisalChronos(sql)

    res.status(201).json({sisalChronos, sql})    
  
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.AdvancedQuery = async (req, res, next) =>{
  try {    
    console.log(req.body.params)
    
    let query = new advancedQuery(req.body.params)

    let sql = query.queryBuilder()
    
    const [entity, _] = await query.runAdvancedQuery(sql.sqlEntity)
    const [dating, __] = await query.runAdvancedQuery(sql.sqlDating)
    const [chrono, ___] = await query.runAdvancedQuery(sql.sqlChrono)

    let filteredEntityIdsByDating = query.countDateByEntity (req.body.params.selectedEntity_ids, req.body.params.minDate, req.body.params.selectedInterpAgeRange, dating)
    let filteredEntityIdsByChrono = query.chronoFiltering(chrono,req.body.params.maxGap,req.body.params.selectedEntity_ids,req.body.params.selectedChrono)

    res.status(201).json({dating, entity, chrono, sql, filteredEntityIdsByDating, filteredEntityIdsByChrono})

  } catch (error) {
    console.log(error)
    next(error)
  }
}
