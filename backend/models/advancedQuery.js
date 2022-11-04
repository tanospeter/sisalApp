const db = require('../config/db')

class AdvancedQuery{
  /*
  constructor(entity_ids){
    this.entity_ids = entity_ids        
  }
  queryBuilder() {
    let sql = 
      `select distinct s.site_id, s.site_name, e.entity_id, e.entity_name, d.* from site s 
      left join entity e on s.site_id = e.site_id
      left join dating d on d.entity_id = e.entity_id
      left join sample sa on e.entity_id = sa.entity_id
      left join original_chronology oc on sa.sample_id = oc.sample_id
      where 1 = 1
      and e.entity_id in (${this.entity_ids.join(',')})`      
      
    console.log(sql)
    return sql
  }

  getDating(sql) {
    try {
      return db.execute(sql)    
    } catch (error) {
      error.log(error)
    }    
  }
  */
}
module.exports = AdvancedQuery