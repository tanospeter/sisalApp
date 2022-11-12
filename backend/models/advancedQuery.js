const db = require('../config/db')

class AdvancedQuery{
  
  constructor(advQueryParams){
    this.advQueryParams = advQueryParams        
  }
  
  queryBuilder() {
    
    let sqlEntity = `select distinct ref.doi, e.*, s.* from site s
      left join entity e on s.site_id = e.site_id
      left join sample sa on e.entity_id = sa.entity_id
      left join original_chronology oc on sa.sample_id = oc.sample_id
      left join d13C on d13c.sample_id = sa.sample_id
      left join d18O on d18o.sample_id = sa.sample_id
      left join (
        select elr.entity_id as entity_id, GROUP_CONCAT(r.publication_DOI ORDER BY r.publication_DOI ASC SEPARATOR '; ') as doi from reference r
        join entity_link_reference elr on r.ref_id = elr.ref_id
        group by elr.entity_id
      ) ref on ref.entity_id = e.entity_id
      where 1 = 1
      and e.entity_id in (${this.advQueryParams.selectedEntity_ids.join(',')})`

    let sqlDating = `select distinct s.site_id, s.site_name, e.entity_id, e.entity_name, d.* from site s 
      left join entity e on s.site_id = e.site_id
      left join dating d on d.entity_id = e.entity_id
      left join sample sa on e.entity_id = sa.entity_id
      left join original_chronology oc on sa.sample_id = oc.sample_id
      where 1 = 1
      and e.entity_id in (${this.advQueryParams.selectedEntity_ids.join(',')})`      
    
    let sqlChrono =`select s.site_id, s.site_name, e.entity_id, e.entity_name, sc.${this.advQueryParams.selectedChrono}, oc.*,d13C.*,d18o.* from site s 
      left join entity e on s.site_id = e.site_id
      left join sample sa on e.entity_id = sa.entity_id
      left join original_chronology oc on sa.sample_id = oc.sample_id
      left join sisal_chronology sc on sc.sample_id = sa.sample_id 
      left join d13C on d13c.sample_id = sa.sample_id
      left join d18O on d18o.sample_id = sa.sample_id      
      where 1 = 1    
      and e.entity_id in (${this.advQueryParams.selectedEntity_ids.join(',')})`
      
    console.log({sqlEntity,sqlDating,sqlChrono})
    
    return {sqlEntity,sqlDating,sqlChrono}
  }

  runAdvancedQuery(sql) {
    try {
      return db.execute(sql)    
    } catch (error) {
      error.log(error)
    }    
  }

  // Advanced query filter 1
  countDateByEntity (entity_ids, minDate, selectedInterpAgeRange, dating) {
    let ageStart = Number(selectedInterpAgeRange[0])
    let ageEnd = Number(selectedInterpAgeRange[1])
    console.log(ageStart, ageEnd, ageStart > 0 && ageEnd > 0)
    let count
    let c = entity_ids.map((e) => {
      if (ageStart > 0 && ageEnd > 0) {        
        let faszom = dating
          .filter((e) => e.date_used !== "no" && e.uncorr_age >= ageStart && e.uncorr_age<= ageEnd)          
          .filter((ee) => ee.entity_id === e)
        console.log(faszom)
        count = faszom.length; 
      }
      else{
        count = dating
          .filter((e) => e.date_used !== "no")
          .filter((ee) => ee.entity_id === e).length;        
      }
      return { entity_id: e, count: count };      
    });  
  
    return c
      .filter((e) => e.count > minDate)
      .map((e) => {
        return e.entity_id;
      });
  };

  // Advanced query filter 2
  chronoFiltering(chrono,maxGap,entity_ids,selectedChrono){
    console.log(maxGap,entity_ids,selectedChrono)
    function m(a) {
      let max = 0;
      a.forEach(e => {
        if(e>max){
          max = e
        }
      })
      return max;
    }
  
    let maxes = entity_ids.map((e) => {
      let b =chrono.filter((ee) => ee.entity_id === e)
      let c =b.map(e => e[selectedChrono])    
      let d =c.map((e,i) => {
        if(c.length-1>i){
          return c[i+1] - e
        }
      })    
      let max = m(d)
      return {entity_id:e, max}
    })
    
    return maxes.filter(e => e.max < maxGap && e.max !== 0)
  }


  
}
module.exports = AdvancedQuery