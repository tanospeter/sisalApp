const db = require('../config/db')

class EntityMetaQuery {
  
  constructor(email,siteName,lat,lon,age){
    this.email = email
    this.siteName = siteName
    this.lat = lat
    this.lon = lon
    this.age = age    
  }

  save() {    
    try {
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
    } catch (error) {
      error.log(error)
    }        
  }

  queryBuilder() {
    let filters = ''
    let sql = `select r.publication_doi, e.*, s.* from site s 
      left join entity e on s.site_id = e.site_id
      left join sample sa on e.entity_id = sa.entity_id
      left join original_chronology oc on sa.sample_id = oc.sample_id
      left join d13c on d13c.sample_id = sa.sample_id
      left join d18o on d18o.sample_id = sa.sample_id
      join entity_link_reference elr on elr.entity_id = e.entity_id
      join reference r on r.ref_id = elr.ref_id
      where 1 = 1`
    
    const siteNameFilled = this.siteName != ''
    const latLonFilled = this.lat[0] !='' && this.lat[1] !='' && this.lon[0] !='' && this.lon[1] !=''
    const ageFilled = this.age[0] !='' && this.age[1] !=''
    
   
    if (siteNameFilled) {
      if (latLonFilled) {
        if (ageFilled) {
          console.log('siteNameFilled, latLonFilled, ageFilled')
          filters = ` and lower(s.site_name) like lower('%${this.siteName}%')
          and s.latitude between ${this.lat[0]} and ${this.lat[1]}
          and s.longitude between ${this.lon[0]} and ${this.lon[1]}
          and oc.interp_age between ${this.age[0]} and ${this.age[1]}`
        }
        else {
          console.log('siteNameFilled, latLonFilled')
          filters = ` and lower(s.site_name) like lower('%${this.siteName}%')
          and s.latitude between ${this.lat[0]} and ${this.lat[1]}
          and s.longitude between ${this.lon[0]} and ${this.lon[1]}`
        } 
      }
      else {
        if (ageFilled) {
          console.log('siteNameFilled, ageFilled')
          filters = ` and lower(s.site_name) like lower('%${this.siteName}%')            
          and oc.interp_age between ${this.age[0]} and ${this.age[1]}`
        } else {
          console.log('siteNameFilled')
          filters = ` and lower(s.site_name) like lower('%${this.siteName}%')`
        }
      }
    }
    else {
      if (latLonFilled) {
        if (ageFilled) {
          console.log('latLonFilled, ageFilled')
          filters = ` and s.latitude between ${this.lat[0]} and ${this.lat[1]}
          and s.longitude between ${this.lon[0]} and ${this.lon[1]}
          and oc.interp_age between ${this.age[0]} and ${this.age[1]}`
        } else {
          console.log('latLonFilled')
          filters = `  and s.latitude between ${this.lat[0]} and ${this.lat[1]}
          and s.longitude between ${this.lon[0]} and ${this.lon[1]}`
        }          
      } else {
        if (ageFilled) {
          console.log('ageFilled')
          filters = ` and oc.interp_age between ${this.age[0]} and ${this.age[1]}`
        }
      }
    }
    sql = sql + filters + ' group by e.entity_id'
    console.log(sql) 
    return sql
  }

  getEntityMeta(sql) {
    try{
      //let sql = this.queryBuilder()      
      return db.execute(sql)
    } catch (error) {
      error.log(error)
    }
  }
}




module.exports = EntityMetaQuery