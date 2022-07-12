const Query = require('../models/query')

exports.step1Query = async (req, res, next) => { 
  try {
    console.log(`queryControllers.step1Query: ${JSON.stringify(req.body)}`)
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
      
      const [meta, _] = await query.findStep1Meta()

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

exports.step2Query = async (req, res, next) => {
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
    
      
    const [chronos, _] = await query.findStep2Chronos()

    res.status(201).json({count: chronos.length, chronos})    
  
  } catch (error) {
    console.log(error)
    next(error)
  }
}
