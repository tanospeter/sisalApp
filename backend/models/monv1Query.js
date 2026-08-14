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
    cave_entity.cave_entity_id,
    cave_entity.cave_entity_name,
    cave_entity.cave_entity_location,
    cave_entity.cave_entity_contact,
    drip_entity.*,
    s.latitude, s.longitude, s.elevation
    FROM site s
    LEFT JOIN site_link_precip sp_link ON s.site_id = sp_link.site_id
    LEFT JOIN precip_site precip ON precip.precip_site_id = sp_link.precip_site_id
    LEFT JOIN cave_entity ON s.site_id = cave_entity.site_id
    LEFT JOIN drip_entity ON s.site_id = drip_entity.site_id
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

  async getMonitoringOverview(siteName = "", lat = ["", ""], lon = ["", ""]) {
    try {
      const siteNameFilled = siteName != null && siteName !== "";
      const latLonFilled =
        Array.isArray(lat) &&
        Array.isArray(lon) &&
        lat[0] !== "" &&
        lat[1] !== "" &&
        lon[0] !== "" &&
        lon[1] !== "";

      const siteFilters = [];
      if (siteNameFilled) {
        siteFilters.push(`LOWER(site_name) LIKE LOWER('%${siteName}%')`);
      }
      if (latLonFilled) {
        siteFilters.push(`latitude BETWEEN ${lat[0]} AND ${lat[1]}`);
        siteFilters.push(`longitude BETWEEN ${lon[0]} AND ${lon[1]}`);
      }

      const siteFilterSql = siteFilters.length
        ? `WHERE ${siteFilters.join(" AND ")}`
        : "";

      const sql = `
        WITH site_filtered AS (
          SELECT site_id, site_name, latitude, longitude
          FROM site
          ${siteFilterSql}
        ),
        precip_dates AS (
          SELECT
            ps.precip_entity_id,
            CASE
              WHEN ps.precip_start_yyyy IS NOT NULL
                AND ps.precip_start_mm IS NOT NULL
                AND ps.precip_start_dd IS NOT NULL
                THEN CONCAT(
                  CAST(ps.precip_start_yyyy AS CHAR), '-',
                  LPAD(CAST(ps.precip_start_mm AS CHAR), 2, '0'), '-',
                  LPAD(CAST(ps.precip_start_dd AS CHAR), 2, '0')
                )
              WHEN ps.precip_start_yyyy IS NOT NULL
                THEN CAST(ps.precip_start_yyyy AS CHAR)
              ELSE NULL
            END AS sample_start_date,
            CASE
              WHEN ps.precip_end_yyyy IS NOT NULL
                AND ps.precip_end_mm IS NOT NULL
                AND ps.precip_end_dd IS NOT NULL
                THEN CONCAT(
                  CAST(ps.precip_end_yyyy AS CHAR), '-',
                  LPAD(CAST(ps.precip_end_mm AS CHAR), 2, '0'), '-',
                  LPAD(CAST(ps.precip_end_dd AS CHAR), 2, '0')
                )
              WHEN ps.precip_end_yyyy IS NOT NULL
                THEN CAST(ps.precip_end_yyyy AS CHAR)
              ELSE NULL
            END AS sample_end_date,
            CAST(ps.precip_start_yyyy AS SIGNED) AS sample_start_year,
            CAST(ps.precip_end_yyyy AS SIGNED) AS sample_end_year
          FROM precip_sample ps
        ),
        drip_iso_dates AS (
          SELECT
            d.drip_entity_id,
            CASE
              WHEN d.drip_iso_start_yyyy IS NOT NULL
                AND d.drip_iso_start_mm IS NOT NULL
                AND d.drip_iso_start_dd IS NOT NULL
                THEN CONCAT(
                  CAST(d.drip_iso_start_yyyy AS CHAR), '-',
                  LPAD(CAST(d.drip_iso_start_mm AS CHAR), 2, '0'), '-',
                  LPAD(CAST(d.drip_iso_start_dd AS CHAR), 2, '0')
                )
              WHEN d.drip_iso_start_yyyy IS NOT NULL
                THEN CAST(d.drip_iso_start_yyyy AS CHAR)
              ELSE NULL
            END AS sample_start_date,
            CASE
              WHEN d.drip_iso_end_yyyy IS NOT NULL
                AND d.drip_iso_end_mm IS NOT NULL
                AND d.drip_iso_end_dd IS NOT NULL
                THEN CONCAT(
                  CAST(d.drip_iso_end_yyyy AS CHAR), '-',
                  LPAD(CAST(d.drip_iso_end_mm AS CHAR), 2, '0'), '-',
                  LPAD(CAST(d.drip_iso_end_dd AS CHAR), 2, '0')
                )
              WHEN d.drip_iso_end_yyyy IS NOT NULL
                THEN CAST(d.drip_iso_end_yyyy AS CHAR)
              ELSE NULL
            END AS sample_end_date,
            CAST(d.drip_iso_start_yyyy AS SIGNED) AS sample_start_year,
            CAST(d.drip_iso_end_yyyy AS SIGNED) AS sample_end_year
          FROM drip_iso_sample d
        ),
        drip_rate_dates AS (
          SELECT
            d.drip_entity_id,
            CASE
              WHEN d.drip_rate_start_yyyy IS NOT NULL
                AND d.drip_rate_start_mm IS NOT NULL
                AND d.drip_rate_start_dd IS NOT NULL
                THEN CONCAT(
                  CAST(d.drip_rate_start_yyyy AS CHAR), '-',
                  LPAD(CAST(d.drip_rate_start_mm AS CHAR), 2, '0'), '-',
                  LPAD(CAST(d.drip_rate_start_dd AS CHAR), 2, '0')
                )
              WHEN d.drip_rate_start_yyyy IS NOT NULL
                THEN CAST(d.drip_rate_start_yyyy AS CHAR)
              ELSE NULL
            END AS sample_start_date,
            CASE
              WHEN d.drip_rate_end_yyyy IS NOT NULL
                AND d.drip_rate_end_mm IS NOT NULL
                AND d.drip_rate_end_dd IS NOT NULL
                THEN CONCAT(
                  CAST(d.drip_rate_end_yyyy AS CHAR), '-',
                  LPAD(CAST(d.drip_rate_end_mm AS CHAR), 2, '0'), '-',
                  LPAD(CAST(d.drip_rate_end_dd AS CHAR), 2, '0')
                )
              WHEN d.drip_rate_end_yyyy IS NOT NULL
                THEN CAST(d.drip_rate_end_yyyy AS CHAR)
              ELSE NULL
            END AS sample_end_date,
            CAST(d.drip_rate_start_yyyy AS SIGNED) AS sample_start_year,
            CAST(d.drip_rate_end_yyyy AS SIGNED) AS sample_end_year
          FROM drip_rate_sample d
        ),
        mod_carb_dates AS (
          SELECT
            m.drip_entity_id,
            CASE
              WHEN m.mod_carb_start_yyyy IS NOT NULL
                AND m.mod_carb_start_mm IS NOT NULL
                AND m.mod_carb_start_dd IS NOT NULL
                THEN CONCAT(
                  CAST(m.mod_carb_start_yyyy AS CHAR), '-',
                  LPAD(CAST(m.mod_carb_start_mm AS CHAR), 2, '0'), '-',
                  LPAD(CAST(m.mod_carb_start_dd AS CHAR), 2, '0')
                )
              WHEN m.mod_carb_start_yyyy IS NOT NULL
                THEN CAST(m.mod_carb_start_yyyy AS CHAR)
              ELSE NULL
            END AS sample_start_date,
            CASE
              WHEN m.mod_carb_end_yyyy IS NOT NULL
                AND m.mod_carb_end_mm IS NOT NULL
                AND m.mod_carb_end_dd IS NOT NULL
                THEN CONCAT(
                  CAST(m.mod_carb_end_yyyy AS CHAR), '-',
                  LPAD(CAST(m.mod_carb_end_mm AS CHAR), 2, '0'), '-',
                  LPAD(CAST(m.mod_carb_end_dd AS CHAR), 2, '0')
                )
              WHEN m.mod_carb_end_yyyy IS NOT NULL
                THEN CAST(m.mod_carb_end_yyyy AS CHAR)
              ELSE NULL
            END AS sample_end_date,
            CAST(m.mod_carb_start_yyyy AS SIGNED) AS sample_start_year,
            CAST(m.mod_carb_end_yyyy AS SIGNED) AS sample_end_year
          FROM mod_carb_sample m
        )
        SELECT
          'precip_iso' AS data_type,
          sf.site_id,
          sf.site_name,
          COUNT(*) AS n_samples,
          MIN(pd.sample_start_date) AS start_date,
          MAX(pd.sample_end_date) AS end_date,
          CASE
            WHEN MIN(pd.sample_start_date) REGEXP '^[0-9]{4}$'
              OR MAX(pd.sample_end_date) REGEXP '^[0-9]{4}$'
              THEN MAX(pd.sample_end_year) - MIN(pd.sample_start_year)
            ELSE ROUND(DATEDIFF(MAX(pd.sample_end_date), MIN(pd.sample_start_date)) / 365.25, 1)
          END AS duration_years
        FROM precip_dates pd
        JOIN precip_entity pe ON pe.precip_entity_id = pd.precip_entity_id
        JOIN site_link_precip sl ON sl.precip_entity_id = pe.precip_entity_id
        JOIN site_filtered sf ON sf.site_id = sl.site_id
        GROUP BY sf.site_id, sf.site_name

        UNION ALL

        SELECT
          'drip_iso' AS data_type,
          sf.site_id,
          sf.site_name,
          COUNT(*) AS n_samples,
          MIN(dd.sample_start_date) AS start_date,
          MAX(dd.sample_end_date) AS end_date,
          CASE
            WHEN MIN(dd.sample_start_date) REGEXP '^[0-9]{4}$'
              OR MAX(dd.sample_end_date) REGEXP '^[0-9]{4}$'
              THEN MAX(dd.sample_end_year) - MIN(dd.sample_start_year)
            ELSE ROUND(DATEDIFF(MAX(dd.sample_end_date), MIN(dd.sample_start_date)) / 365.25, 1)
          END AS duration_years
        FROM drip_iso_dates dd
        JOIN drip_entity de ON de.drip_entity_id = dd.drip_entity_id
        JOIN site_filtered sf ON sf.site_id = de.site_id
        GROUP BY sf.site_id, sf.site_name

        UNION ALL

        SELECT
          'drip_rate' AS data_type,
          sf.site_id,
          sf.site_name,
          COUNT(*) AS n_samples,
          MIN(rd.sample_start_date) AS start_date,
          MAX(rd.sample_end_date) AS end_date,
          CASE
            WHEN MIN(rd.sample_start_date) REGEXP '^[0-9]{4}$'
              OR MAX(rd.sample_end_date) REGEXP '^[0-9]{4}$'
              THEN MAX(rd.sample_end_year) - MIN(rd.sample_start_year)
            ELSE ROUND(DATEDIFF(MAX(rd.sample_end_date), MIN(rd.sample_start_date)) / 365.25, 1)
          END AS duration_years
        FROM drip_rate_dates rd
        JOIN drip_entity de ON de.drip_entity_id = rd.drip_entity_id
        JOIN site_filtered sf ON sf.site_id = de.site_id
        GROUP BY sf.site_id, sf.site_name

        UNION ALL

        SELECT
          'mod_carb' AS data_type,
          sf.site_id,
          sf.site_name,
          COUNT(*) AS n_samples,
          MIN(md.sample_start_date) AS start_date,
          MAX(md.sample_end_date) AS end_date,
          CASE
            WHEN MIN(md.sample_start_date) REGEXP '^[0-9]{4}$'
              OR MAX(md.sample_end_date) REGEXP '^[0-9]{4}$'
              THEN MAX(md.sample_end_year) - MIN(md.sample_start_year)
            ELSE ROUND(DATEDIFF(MAX(md.sample_end_date), MIN(md.sample_start_date)) / 365.25, 1)
          END AS duration_years
        FROM mod_carb_dates md
        JOIN drip_entity de ON de.drip_entity_id = md.drip_entity_id
        JOIN site_filtered sf ON sf.site_id = de.site_id
        GROUP BY sf.site_id, sf.site_name
        ORDER BY site_name, data_type;`;

      const [overviewData] = await db.query(sql);
      return overviewData;
    } catch (error) {
      console.error("Error creating monitoring overview view:", error);
      throw error;
    }
  }

  async getMonitoringData(entityIds) {
    // 1. Validation & Setup
    if (!entityIds || entityIds.length === 0) {
      throw new Error("No entity IDs provided.");
    }

    // Extract unique IDs, filtering out nulls
    const siteIds = [
      ...new Set(entityIds.map((e) => e.site_id).filter(Boolean)),
    ];
    const caveEntityIds = [
      ...new Set(entityIds.map((e) => e.cave_entity_id).filter(Boolean)),
    ];
    const dripEntityIds = [
      ...new Set(entityIds.map((e) => e.drip_entity_id).filter(Boolean)),
    ];
    // We also need precip_entity_ids for the reference link query
    const precipEntityIds = [
      ...new Set(entityIds.map((e) => e.precip_entity_id).filter(Boolean)),
    ];

    // Minimal check: We must at least have a Site ID. Others are optional.
    if (siteIds.length === 0) {
      console.error("Incomplete entity IDs provided", entityIds);
      throw new Error("Invalid Request: No valid Site IDs found.");
    }

    try {
      // Helper: Safely run a query only if the ID list is not empty.
      // Returns an empty array [] if no IDs exist, preventing SQL syntax errors.
      const runQuery = (sql, ids) =>
        ids.length > 0 ? db.query(sql, [ids]) : Promise.resolve([]);

      // 2. Parallel Data Fetching
      const [
        [siteInfoData],
        [climateData],
        [caveEntityData],
        [dripEntityData], // Metadata separate from samples
        [dripIsoData],
        [dripRateData],
        [modCarbData],
        [precipEntityData], // Metadata separate from samples
        [precipSampleData],
        [referenceData], // All references in one unified list
      ] = await Promise.all([
        // --- Q1: Site Info (Left Join includes notes even if null) ---
        runQuery(
          `SELECT s.*, n.notes 
           FROM site s 
           LEFT JOIN notes n ON s.site_id = n.site_id 
           WHERE s.site_id IN (?)`,
          siteIds,
        ),

        // --- Q2: Climate Data ---
        runQuery(`SELECT * FROM p_t_pet_aet WHERE site_id IN (?)`, siteIds),

        // --- Q3: Cave Entity Metadata ---
        runQuery(
          `SELECT * FROM cave_entity WHERE cave_entity_id IN (?)`,
          caveEntityIds,
        ),

        // --- Q4: Drip Entity Metadata (Crucial: Fetches entities even without samples) ---
        runQuery(
          `SELECT * FROM drip_entity WHERE drip_entity_id IN (?)`,
          dripEntityIds,
        ),

        // --- Q5: Drip Samples (Raw Data Only - Normalized) ---
        // We do NOT join 'drip_entity' here to save bandwidth.
        // We match them in JS later using 'drip_entity_id'.
        runQuery(
          `SELECT * FROM drip_iso_sample WHERE drip_entity_id IN (?)`,
          dripEntityIds,
        ),
        runQuery(
          `SELECT * FROM drip_rate_sample WHERE drip_entity_id IN (?)`,
          dripEntityIds,
        ),
        runQuery(
          `SELECT * FROM mod_carb_sample WHERE drip_entity_id IN (?)`,
          dripEntityIds,
        ),

        // --- Q6: Precip Entity Metadata ---
        // Must join through 'site_link_precip' to ensure they belong to our specific Sites.
        runQuery(
          `SELECT 
              pem.*, 
              psm.precip_site_name, 
              psm.precip_latitude, 
              psm.precip_longitude, 
              psm.precip_elevation
           FROM precip_entity pem
           INNER JOIN site_link_precip sp_link ON pem.precip_entity_id = sp_link.precip_entity_id
           INNER JOIN precip_site psm ON psm.precip_site_id = sp_link.precip_site_id
           WHERE sp_link.site_id IN (?)`,
          siteIds,
        ),

        // --- Q7: Precip Samples ---
        // Fetches samples linked to the sites via the entity link
        runQuery(
          `SELECT ps.* FROM precip_sample ps
           INNER JOIN site_link_precip sp_link ON ps.precip_entity_id = sp_link.precip_entity_id
           WHERE sp_link.site_id IN (?)`,
          siteIds,
        ),

        // --- Q8: Unified References (Denormalized) ---
        // Fetches ALL citations for Sites, Caves, Drips, and Precip in one go.
        // Uses UNION ALL to stack results into a single list with a 'link_type'.
        db.query(
          `
          /* 1. Site Refs */
          SELECT 
            r.ref_id, 
            r.citation, 
            r.publication_DOI, 
            'site' as link_type, 
            slr.site_id as link_id, 
            s.site_name as entity_name  -- Fetching the name!
          FROM reference r
          JOIN site_link_reference slr ON r.ref_id = slr.ref_id
          JOIN site s ON slr.site_id = s.site_id
          WHERE slr.site_id IN (?)
          
          UNION ALL
          
          /* 2. Cave Refs */
          SELECT 
            r.ref_id, 
            r.citation, 
            r.publication_DOI, 
            'cave' as link_type, 
            elr.cave_entity_id as link_id,
            ce.cave_entity_name as entity_name
          FROM reference r
          JOIN entity_link_reference elr ON r.ref_id = elr.ref_id
          JOIN cave_entity ce ON elr.cave_entity_id = ce.cave_entity_id
          WHERE elr.cave_entity_id IN (?)
          
          UNION ALL
          
          /* 3. Drip Refs */
          SELECT 
            r.ref_id, 
            r.citation, 
            r.publication_DOI, 
            'drip' as link_type, 
            elr.drip_entity_id as link_id,
            de.drip_entity_name as entity_name
          FROM reference r
          JOIN entity_link_reference elr ON r.ref_id = elr.ref_id
          JOIN drip_entity de ON elr.drip_entity_id = de.drip_entity_id
          WHERE elr.drip_entity_id IN (?)
          
          UNION ALL
          
          /* 4. Precip Refs */
          SELECT 
            r.ref_id, 
            r.citation, 
            r.publication_DOI, 
            'precip' as link_type, 
            elr.precip_entity_id as link_id,
            pe.precip_entity_name as entity_name
          FROM reference r
          JOIN entity_link_reference elr ON r.ref_id = elr.ref_id
          JOIN precip_entity pe ON elr.precip_entity_id = pe.precip_entity_id
          WHERE elr.precip_entity_id IN (?)
          `,
          [
            siteIds.length ? siteIds : [0],
            caveEntityIds.length ? caveEntityIds : [0],
            dripEntityIds.length ? dripEntityIds : [0],
            precipEntityIds.length ? precipEntityIds : [0],
          ],
        ),
      ]);

      // 3. Verification
      if (!siteInfoData || siteInfoData.length === 0) {
        throw new Error("Site not found in database.");
      }

      // 4. Assembly
      // Returns flat arrays. The frontend matches them by IDs.
      const monitoringData = {
        site_info: siteInfoData,
        climate: climateData,
        cave_entities: caveEntityData,
        drip_entities: dripEntityData,
        drip_iso_samples: dripIsoData,
        drip_rate_samples: dripRateData,
        drip_mod_carb_samples: modCarbData,
        precip_entities: precipEntityData,
        precip_samples: precipSampleData,
        references: referenceData, // Single list: [{ref_id, citation, link_type: 'drip', link_id: 5}, ...]
      };

      return monitoringData;
    } catch (error) {
      console.error("Error in getMonitoringData:", error);
      throw error;
    }
  }
}

module.exports = Monv1Query;
