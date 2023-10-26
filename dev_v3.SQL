-- Ez a fájl csak a dev_v3 ágban szerepelhet a masterben nem!


-- QUERY_LOG TÁNLA LÉTREHOZÁSA A V3-BAN:
CREATE TABLE `sisalv3`.`query_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `site_name` VARCHAR(100) NULL DEFAULT NULL,
  `lat_from` VARCHAR(10) NULL DEFAULT NULL,
  `lat_to` VARCHAR(10) NULL DEFAULT NULL,
  `long_from` VARCHAR(10) NULL DEFAULT NULL,
  `long_to` VARCHAR(10) NULL DEFAULT NULL,
  `interp_age_from` VARCHAR(10) NULL DEFAULT NULL,
  `interp_age_to` VARCHAR(10) NULL DEFAULT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- TESZTEK
USE sisalv3;


-- 1) ENTITY LIST
select distinct ref.doi, s.site_name, e.*, s.* 
from site s
left join entity e on s.site_id = e.site_id
left join sample sa on e.entity_id = sa.entity_id
left join original_chronology oc on sa.sample_id = oc.sample_id
left join d13c on d13c.sample_id = sa.sample_id
left join d18o on d18o.sample_id = sa.sample_id
left join (
  select elr.entity_id as entity_id, GROUP_CONCAT(r.publication_DOI ORDER BY r.publication_DOI ASC SEPARATOR '; ') as doi from reference r
  join entity_link_reference elr on r.ref_id = elr.ref_id
  group by elr.entity_id
) ref on ref.entity_id = e.entity_id
where 1 = 1 and lower(s.site_name) like lower('%Bittoo%')
and s.latitude between 30 and 31
and s.longitude between 77 and 78
and oc.interp_age between 800 and 300000;

-- 2) DATING INFORMATION
select distinct s.site_id, s.site_name, e.entity_id, e.entity_name, d.* 
from site s 
left join entity e on s.site_id = e.site_id
left join dating d on d.entity_id = e.entity_id
left join sample sa on e.entity_id = sa.entity_id
left join original_chronology oc on sa.sample_id = oc.sample_id
where 1 = 1
and e.entity_id in (1,2,3,4,5,6,7,8,9,10);

-- 3) SAMPLE DATA
select s.site_id, s.site_name, e.entity_id, e.entity_name, sa.depth_sample, oc.interp_age, oc.*, sc.lin_interp_age, sc.lin_interp_age_uncert_pos, sc.lin_interp_age_uncert_neg, sc.lin_reg_age, sc.lin_reg_age_uncert_pos, sc.lin_reg_age_uncert_neg, sc.Bchron_age, sc.Bchron_age_uncert_pos, sc.Bchron_age_uncert_neg, sc.Bacon_age, sc.Bacon_age_uncert_pos, sc.Bacon_age_uncert_neg, sc.OxCal_age, sc.OxCal_age_uncert_pos, sc.OxCal_age_uncert_neg, sc.copRa_age, sc.copRa_age_uncert_pos, sc.copRa_age_uncert_neg, sc.StalAge_age, sc.StalAge_age_uncert_pos, sc.StalAge_age_uncert_neg,d13c.*,d18o.* 
from site s 
left join entity e on s.site_id = e.site_id
left join sample sa on e.entity_id = sa.entity_id
left join original_chronology oc on sa.sample_id = oc.sample_id
left join sisal_chronology sc on sc.sample_id = sa.sample_id 
left join d13c on d13c.sample_id = sa.sample_id
left join d18o on d18o.sample_id = sa.sample_id      
where 1 = 1    
and e.entity_id in (1,2,3,4,5,6,7,8,9,10)
and oc.interp_age between 800 and 300000;
