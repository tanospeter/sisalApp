const Query = require('../models/query')

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
    
    let query = new Query(
      email,
      siteName,
      lat,
      lon,
      age,
      )
    
    if (req.body.type == 'meta') {
     
      await query.save()
      
      const [meta, _] = await query.getEntityMeta()

      res.status(201).json({count: meta.length, meta})

    } else if (req.body.type == 'dating') {
      
      const [dating, _] = await query.findStep1Dating()
      
      res.status(201).json({count: dating.length, dating})

    }
    
  
  } catch (error) {
    console.log(error)
    next(error)
  }
}
// a query.js-t szét kell szedni!
exports.datingQuery = async (req, res, next) =>{
  try {
    let {entity_ids} =req.body

    let query = new Query(entity_ids)

    const [dating, _] = await query.getDating()

    res.status(201).json({count: dating.length, dating})

  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.SisalChronosQuery = async (req, res, next) => {
  try {
    let {
      email,
      siteName,
      lat,      
      lon,
      age
    } = req.body
    
    let query = new Query(
      email,
      siteName,
      lat,
      lon,
      age,
      )
    
      
    const [chronos, _] = await query.getSisalChronos()

    res.status(201).json({count: chronos.length, chronos})    
  
  } catch (error) {
    console.log(error)
    next(error)
  }
}
