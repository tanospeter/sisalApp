const db = require("../config/dbMonv1");

class Monv1Query {
  constructor(siteName, lat, lon) {
    this.siteName = siteName;
    this.lat = lat;
    this.lon = lon;
  }

  queryBuilder() {
    let filters = "";
    let sql = `SELECT DISTINCT s.site_name, s.site_id, 
    precip.precip_site_id,
    precip.precip_site_name, 
    cave_entity_metadata.cave_entity_id,
    cave_entity_metadata.cave_entity_name,
    cave_entity_metadata.cave_entity_location,
    cave_entity_metadata.cave_entity_contact,
    drip_entity_metadata.*, s.latitude, s.longitude
    FROM site s
    LEFT JOIN site_link_precip sp_link ON s.site_id = sp_link.site_id
    LEFT JOIN precip_site_metadata precip ON precip.precip_site_id = sp_link.precip_site_id
    LEFT JOIN cave_entity_metadata ON s.site_id = cave_entity_metadata.site_id
    LEFT JOIN drip_entity_metadata ON s.site_id = drip_entity_metadata.site_id
    WHERE 1 = 1`;

    const siteNameFilled = this.siteName != "";
    const latLonFilled =
      this.lat[0] != "" &&
      this.lat[1] != "" &&
      this.lon[0] != "" &&
      this.lon[1] != "";

    if (siteNameFilled) {
      if (latLonFilled) {
        // console.log("siteNameFilled, latLonFilled");
        filters = ` and lower(s.site_name) like lower('%${this.siteName}%')
          and s.latitude between ${this.lat[0]} and ${this.lat[1]}
          and s.longitude between ${this.lon[0]} and ${this.lon[1]}`;
      } else {
        // console.log("siteNameFilled");
        filters = ` and lower(s.site_name) like lower('%${this.siteName}%')`;
      }
    } else {
      if (latLonFilled) {
        // console.log("latLonFilled");
        filters = `  and s.latitude between ${this.lat[0]} and ${this.lat[1]}
          and s.longitude between ${this.lon[0]} and ${this.lon[1]}`;
      }
    }

    sql = sql + filters;
    return sql;
  }

  getMonv1(sql) {
    try {
      return db.execute(sql);
    } catch (error) {
      error.log(error);
    }
  }

  async getMonitoringData(entityIds) {
    if (!entityIds || entityIds.length === 0) {
      throw new Error("No entity IDs provided.");
    }

    // Gather all unique IDs
    const siteIds = [
      ...new Set(entityIds.map((e) => e.site_id).filter(Boolean)),
    ];
    const caveEntityIds = [
      ...new Set(entityIds.map((e) => e.cave_entity_id).filter(Boolean)),
    ];
    const dripEntityIds = [
      ...new Set(entityIds.map((e) => e.drip_entity_id).filter(Boolean)),
    ];
    const precipSiteIds = [
      ...new Set(entityIds.map((e) => e.precip_site_id).filter(Boolean)),
    ];

    if (
      siteIds.length === 0 ||
      caveEntityIds.length === 0 ||
      dripEntityIds.length === 0 ||
      precipSiteIds.length === 0
    ) {
      console.error("Incomplete entity IDs provided", entityIds);
      throw new Error(
        "Incomplete entity IDs provided. Each entity must have site_id, cave_entity_id, drip_entity_id, and precip_site_id."
      );
    }

    try {
      const [
        [siteInfoData], // Joined site + notes
        [climateData], // Unchanged
        [caveEntityData], // Unchanged
        [dripIsoData], // Joined drip_iso_sample + drip_entity_metadata
        [dripRateData], // Joined drip_rate_sample + drip_entity_metadata
        [modCarbData], // Joined mod_carb_sample + drip_entity_metadata
        [precipEntityData], // Joined precip_entity_metadata + precip_site_metadata
        [precipSampleData], // Joined precip_sample + precip_entity + precip_site
      ] = await Promise.all([
        // --- Query 1: Site Info (Site LEFT JOIN Notes) ---
        // Use db.query() for IN (?)
        db.query(
          `SELECT s.*, n.notes
         FROM site s
         LEFT JOIN notes n ON s.site_id = n.site_id
         WHERE s.site_id IN (?)`,
          [siteIds]
        ),

        // --- Query 2: Climate Data ---
        db.query(`SELECT * FROM p_t_pet_aet WHERE site_id IN (?)`, [siteIds]),

        // --- Query 3: Cave Entity Data ---
        db.query(
          `SELECT * FROM cave_entity_metadata WHERE cave_entity_id IN (?)`,
          [caveEntityIds]
        ),

        // --- Query 4: Drip Entity Samples (Joined with Drip Metadata) ---
        db.query(
          `SELECT dem.*, dis.*
         FROM drip_iso_sample dis
         INNER JOIN drip_entity_metadata dem ON dis.drip_entity_id = dem.drip_entity_id
         WHERE dis.drip_entity_id IN (?)`,
          [dripEntityIds]
        ),

        db.query(
          `SELECT dem.*, drs.*
         FROM drip_rate_sample drs
         INNER JOIN drip_entity_metadata dem ON drs.drip_entity_id = dem.drip_entity_id
         WHERE drs.drip_entity_id IN (?)`,
          [dripEntityIds]
        ),

        db.query(
          `SELECT dem.*, mcs.*
         FROM mod_carb_sample mcs
         INNER JOIN drip_entity_metadata dem ON mcs.drip_entity_id = dem.drip_entity_id
         WHERE mcs.drip_entity_id IN (?)`,
          [dripEntityIds]
        ),

        // --- Query 5: Precip Entities (Joined with Precip Site Metadata) ---
        db.query(
          `SELECT pem.*, psm.precip_site_name, psm.precip_latitude, psm.precip_longitude, psm.precip_elevation
        FROM precip_entity_metadata pem
        INNER JOIN site_link_precip sp_link ON pem.precip_entity_id = sp_link.precip_entity_id
        INNER JOIN precip_site_metadata psm ON psm.precip_site_id = sp_link.precip_site_id
        WHERE sp_link.precip_site_id IN (?)`,
          [precipSiteIds]
        ),

        // --- Query 6: Precip Samples
        db.query(
          `SELECT ps.*
        FROM precip_sample ps
        INNER JOIN precip_entity_metadata pem ON ps.precip_entity_id = pem.precip_entity_id
        INNER JOIN site_link_precip sp_link ON pem.precip_entity_id = sp_link.precip_entity_id
        WHERE sp_link.precip_site_id IN (?)`,
          [precipSiteIds]
        ),
      ]);

      // Assemble the final, structured result.
      // This is now "flatter" and ready for the new exporter.
      const monitoringData = {
        site_info: siteInfoData,
        climate: climateData,
        cave_entity: caveEntityData,
        drip_iso_samples: dripIsoData,
        drip_rate_samples: dripRateData,
        drip_mod_carb_samples: modCarbData,
        precip_entities: precipEntityData,
        precip_samples: precipSampleData,
      };

      if (!monitoringData.site_info || monitoringData.site_info.length === 0) {
        throw new Error("Site not found");
      }

      return monitoringData;
    } catch (error) {
      console.error("Error in getMonitoringData:", error);
      throw error;
    }
  }
}

module.exports = Monv1Query;
