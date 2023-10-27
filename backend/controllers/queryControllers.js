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
      age,
      speleothemType
    } = req.body    
    
    let query = new entityQuery(
      email,
      siteName,
      lat,
      lon,
      age,
      speleothemType
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
      chronos,
      age,
      caSrs
    } = req.body
    
    let query = new chronoQuery(entity_ids, chronos, age, caSrs)
    
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
    console.log(`filteredEntityIdsByDating:${filteredEntityIdsByDating}`)
    let filteredEntityIdsByChrono = query.chronoFiltering(chrono,req.body.params.maxGap,req.body.params.selectedEntity_ids,req.body.params.selectedChrono)
    console.log(`filteredEntityIdsByChrono:${filteredEntityIdsByChrono}`)
    //let filteredEntityIdsByAdvancedFilters = filteredEntityIdsByDating.concat(filteredEntityIdsByChrono)
    let filteredEntityIdsByAdvancedFilters = filteredEntityIdsByDating.filter(element => filteredEntityIdsByChrono.includes(element))
    console.log(`filteredEntityIdsByAdvancedFilters: ${filteredEntityIdsByAdvancedFilters}`)
    
    filteredEntityIdsByAdvancedFilters = filteredEntityIdsByAdvancedFilters.filter((item,index)=>{
      return (filteredEntityIdsByAdvancedFilters.indexOf(item) == index)
    })

    console.log(filteredEntityIdsByAdvancedFilters)

    let reportInfo = {
      selectedEntity_ids : req.body.params.selectedEntity_ids,
      FilterType3 : req.body.params.selectedInterpAgeRange,
      AdvancedFilter1 : req.body.params.minDate,
      AdvancedFilter2SelectedChrono : req.body.params.selectedChrono,
      AdvancedFilter2MaxGap : req.body.params.maxGap,
      ResEntity_idsAdvancedFilter1 : filteredEntityIdsByDating,
      ResEntity_idsAdvancedFilter2 : filteredEntityIdsByChrono,
      ResEntity_idsAdvancedFilters : filteredEntityIdsByAdvancedFilters
    }

    if(filteredEntityIdsByAdvancedFilters.length !== 0) {
      
      let queryFiltered = new advancedQuery({
        selectedEntity_ids : filteredEntityIdsByAdvancedFilters,
        selectedChrono : req.body.params.selectedChrono,
        selectedInterpAgeRange: req.body.params.selectedInterpAgeRange
      })

      let sqlFiltered = queryFiltered.queryBuilder()
      
      const [entityFiltered, ____] = await queryFiltered.runAdvancedQuery(sqlFiltered.sqlEntity)
      const [datingFiltered, _____] = await queryFiltered.runAdvancedQuery(sqlFiltered.sqlDating)
      const [chronoFiltered, ______] = await queryFiltered.runAdvancedQuery(sqlFiltered.sqlChrono)

      res.status(201).json({
        dating, 
        entity, 
        chrono, 
        sql, 
        filteredEntityIdsByDating, 
        filteredEntityIdsByChrono, 
        filteredEntityIdsByAdvancedFilters, 
        reportInfo : JSON.stringify(reportInfo),
        sqlFiltered,
        entityFiltered,
        datingFiltered,
        chronoFiltered
      })
    } else {
      res.status(201).json({
        dating, 
        entity, 
        chrono, 
        sql, 
        filteredEntityIdsByDating, 
        filteredEntityIdsByChrono, 
        filteredEntityIdsByAdvancedFilters, 
        reportInfo : JSON.stringify(reportInfo),
        sqlFiltered: [],
        entityFiltered: [],
        datingFiltered: [],
        chronoFiltered: []
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}
