const db = require("../config/dbMonv1");

class Monv1Query {
  constructor(siteName, lat, lon) {
    this.siteName = siteName;
    this.lat = lat;
    this.lon = lon;
  }

  queryBuilder() {
    let filters = "";
    let sql = `select distinct s.site_name, s.site_id, precip.precip_site_name, 
    cave_entity_metadata.cave_entity_name,
    cave_entity_metadata.cave_entity_location,
    cave_entity_metadata.cave_entity_contact,
    drip_entity_metadata.*, s.latitude, s.longitude
    from site s
    left join precip_site_metadata precip on s.site_id = precip.site_id
    left join cave_entity_metadata on s.site_id = cave_entity_metadata.site_id
    left join drip_entity_metadata on s.site_id = drip_entity_metadata.site_id
    where 1 = 1`;

    const siteNameFilled = this.siteName != "";
    const latLonFilled =
      this.lat[0] != "" &&
      this.lat[1] != "" &&
      this.lon[0] != "" &&
      this.lon[1] != "";

    if (siteNameFilled) {
      if (latLonFilled) {
        console.log("siteNameFilled, latLonFilled");
        filters = ` and lower(s.site_name) like lower('%${this.siteName}%')
          and s.latitude between ${this.lat[0]} and ${this.lat[1]}
          and s.longitude between ${this.lon[0]} and ${this.lon[1]}`;
      } else {
        console.log("siteNameFilled");
        filters = ` and lower(s.site_name) like lower('%${this.siteName}%')`;
      }
    } else {
      if (latLonFilled) {
        console.log("latLonFilled");
        filters = `  and s.latitude between ${this.lat[0]} and ${this.lat[1]}
          and s.longitude between ${this.lon[0]} and ${this.lon[1]}`;
      }
    }

    sql = sql + filters;
    console.log(sql);
    return sql;
  }

  getMonv1(sql) {
    try {
      return db.execute(sql);
    } catch (error) {
      error.log(error);
    }
  }
}

module.exports = Monv1Query;
