const db = require('../config/db')

class SisalChronoQuery{

  constructor(entity_ids, chronos, age){
    this.entity_ids = entity_ids
    this.chronos = chronos
    this.age = age
  }

  queryBuilder() {
    let chronoWithUncert = this.chronos.map((e) => {  
      return `${e}, sc.${e}_uncert_pos, sc.${e}_uncert_neg`
    })

    let sql = 
      `select s.site_id, s.site_name, e.entity_id, e.entity_name, sa.depth_sample, oc.interp_age, oc.*, sc.${chronoWithUncert.join(', sc.')},d13c.*,d18o.* from site s 
      left join entity e on s.site_id = e.site_id
      left join sample sa on e.entity_id = sa.entity_id
      left join original_chronology oc on sa.sample_id = oc.sample_id
      left join sisal_chronology sc on sc.sample_id = sa.sample_id 
      left join d13c on d13c.sample_id = sa.sample_id
      left join d18o on d18o.sample_id = sa.sample_id      
      where 1 = 1    
      and e.entity_id in (${this.entity_ids.join(',')})`
    console.log(this.age)  
    if (this.age[0].length !== 0 && this.age[1].length !== 0 ) {
      sql = sql + `\nand oc.interp_age between ${this.age[0]} and ${this.age[1]}`
    }
    console.log(sql)
    return sql
  }

  getSisalChronos(sql) {
    try {      
      return db.execute(sql)
    } catch (error) {
      error.log(error)
    }
  }

}
  /*

  findStep2Chronos() {
    let sql = 
      `select s.site_id, s.site_name, e.entity_id, e.entity_name, sc.*, oc.*,d13C.*,d18o.* from site s 
      left join entity e on s.site_id = e.site_id
      left join sample sa on e.entity_id = sa.entity_id
      left join original_chronology oc on sa.sample_id = oc.sample_id
      left join sisal_chronology sc on sc.sample_id = sa.sample_id 
      left join d13C on d13c.sample_id = sa.sample_id
      left join d18O on d18o.sample_id = sa.sample_id      
      where 1 = 1    
      and s.latitude between ${this.lat[0]} and ${this.lat[1]}
      and s.longitude between ${this.lon[0]} and ${this.lon[1]}
      and oc.interp_age between ${this.age[0]} and ${this.age[1]}
      and lower(s.site_name) like lower('%${this.siteName}%')
      group by e.entity_id`

    return db.execute(sql)
  }
}
*/
module.exports = SisalChronoQuery