const db = require('../config/db')

class Step1query {
  constructor(email,siteName,lat,lon,age){
    this.email = email
    this.siteName = siteName
    this.lat = lat
    this.lon = lon
    this.age = age
  }

  save() {    
    let sql = `
    INSERT INTO query_log(
      email,
      site_name,
      lat_from,
      lat_to,
      long_from,
      long_to,
      interp_age_from,
      interp_age_to
    )
    VALUES(
      '${this.email}',
      '${this.siteName}',
      '${this.lat[0]}',
      '${this.lat[1]}',
      '${this.lon[0]}',
      '${this.lon[1]}',
      '${this.age[0]}',
      '${this.age[1]}'
    )
    `
    return db.execute(sql)    
  }

  findStep1Meta() {
    let sql = 
      `select r.publication_doi, e.*, s.*, oc.interp_age from site s 
      left join entity e on s.site_id = e.site_id
      left join sample sa on e.entity_id = sa.entity_id
      left join original_chronology oc on sa.sample_id = oc.sample_id
      left join d13C on d13c.sample_id = sa.sample_id
      left join d18O on d18o.sample_id = sa.sample_id
      join entity_link_reference elr on elr.entity_id = e.entity_id
      join reference r on r.ref_id = elr.ref_id
      where 1 = 1
      and s.latitude between ${this.lat[0]} and ${this.lat[1]}
      and s.longitude between ${this.lon[0]} and ${this.lon[1]}
      and oc.interp_age between ${this.age[0]} and ${this.age[1]}
      and lower(s.site_name) like lower('%${this.siteName}%')
      group by e.entity_id`

    return db.execute(sql)
  }

  findStep1Dating() {
    let sql = 
      `select s.site_id, s.site_name, e.entity_id, e.entity_name, d.* 
      from dating d 
      where 1 = 1    
      and entity_id in (${this.entity_ids})      
      group by e.entity_id`       
    return db.execute(sql)
  }

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

module.exports = Step1query