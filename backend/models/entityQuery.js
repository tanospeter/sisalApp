const db = require('../config/db')

class EntityMetaQuery {
  
  constructor(email,siteName,lat,lon,age, speleothemType){
    this.email = email
    this.siteName = siteName
    this.lat = lat
    this.lon = lon
    this.age = age    
    this.speleothemType = speleothemType    
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
    let speleothemTypeFilter = ''
    let sql = `select distinct ref.doi, s.site_name, e.*, s.* from site s
    left join entity e on s.site_id = e.site_id
    left join sample sa on e.entity_id = sa.entity_id
    left join original_chronology oc on sa.sample_id = oc.sample_id
    left join d13C on d13C.sample_id = sa.sample_id
    left join d18O on d18O.sample_id = sa.sample_id
    left join (
      select elr.entity_id as entity_id, GROUP_CONCAT(r.publication_DOI ORDER BY r.publication_DOI ASC SEPARATOR '; ') as doi from reference r
      join entity_link_reference elr on r.ref_id = elr.ref_id
      group by elr.entity_id
    ) ref on ref.entity_id = e.entity_id
    where 1 = 1`
    
    const siteNameFilled = this.siteName != ''
    const latLonFilled = this.lat[0] !='' && this.lat[1] !='' && this.lon[0] !='' && this.lon[1] !=''
    const ageFilled = this.age[0] !='' && this.age[1] !=''
    
    let nonComposite = this.speleothemType[0].isChecked
    let composite = this.speleothemType[1].isChecked
    
    if (composite === true) {
      if (nonComposite === false) {
        speleothemTypeFilter = ` and speleothem_type in ('composite')`
      }
    } else {speleothemTypeFilter = ` and speleothem_type not in ('composite')`}
    console.log(`speleothemTypeFilter = ${speleothemTypeFilter}`)

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
    //sql = sql + filters + ' group by e.entity_id'
    sql = sql + filters + speleothemTypeFilter
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