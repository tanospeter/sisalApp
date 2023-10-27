const db = require('../config/db')

class SisalChronoQuery{

  constructor(entity_ids, chronos, age, caSrs){
    this.entity_ids = entity_ids
    this.chronos = chronos
    this.age = age
    this.caSrs = caSrs
  }

  basicQuery() {
    let chronoWithUncert = this.chronos.map((e) => {  
      return `sc.${e}, sc.${e}_uncert_pos, sc.${e}_uncert_neg`
    })
    //console.log(chronoWithUncert)

    let select = `select s.site_id, s.site_name, e.entity_id, e.entity_name, sa.depth_sample, oc.*, ${chronoWithUncert}, d13c.*, d18o.*`
    
    let from = `\nfrom site s`

    let join = 
`\nleft join entity e on s.site_id = e.site_id
left join sample sa on e.entity_id = sa.entity_id
left join original_chronology oc on sa.sample_id = oc.sample_id
left join sisal_chronology sc on sc.sample_id = sa.sample_id 
left join d13c on d13c.sample_id = sa.sample_id
left join d18o on d18o.sample_id = sa.sample_id`
    
    let where = `\nwhere e.entity_id in (${this.entity_ids.join(',')})`

    if (this.age[0].length !== 0 && this.age[1].length !== 0 ) {
      where = where + `\nand oc.interp_age between ${this.age[0]} and ${this.age[1]}`
    }

    return {select:select,from:from,join:join,where:where}
  }

  queryBuilder() {
    let basicQuery = this.basicQuery()
    //console.log(basicQuery)

    if(this.caSrs.length === 0){
      let sql = `${basicQuery.select}${basicQuery.from}${basicQuery.join}${basicQuery.where}`
      console.log(sql)
      return sql
    }
    else {
      let caScFields = this.caSrs.map((e) => {  
        return `${e}.${e}_measurement, ${e}.${e}_precision`
      })
      //console.log(caScFields)
      let caScJoins = this.caSrs.map((e) => {
        return `left join ${e} on sa.sample_id = ${e}.sample_id`
      })
      //console.log(caScJoins)
      let sql = `${basicQuery.select},${caScFields}${basicQuery.from}${basicQuery.join}\n${caScJoins.join('\n')}${basicQuery.where}`
      console.log(sql)
      return sql
    }    
  }

  getSisalChronos(sql) {
    try {      
      return db.execute(sql)
    } catch (error) {
      error.log(error)
    }
  }

}  
module.exports = SisalChronoQuery