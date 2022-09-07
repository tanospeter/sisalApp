const entityQuery = require('../models/entityQuery')
const datingQuery = require('../models/datingQuery')
const chronoQuery = require('../models/chronoQuery')

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
    
    const [meta, _] = await query.getEntityMeta()

    res.status(201).json({count: meta.length, meta})    
  
  } catch (error) {
    console.log(error)
    next(error)
  }
}
// a query.js-t szét kell szedni!
exports.DatingQuery = async (req, res, next) =>{
  try {
    let {entity_ids} =req.body

    let query = new datingQuery(entity_ids)

    const [dating, _] = await query.getDating()

    res.status(201).json({count: dating.length, dating})

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
    
      
    const [sisalChronos, _] = await query.getSisalChronos()

    res.status(201).json({count: sisalChronos.length, sisalChronos})    
  
  } catch (error) {
    console.log(error)
    next(error)
  }
}
