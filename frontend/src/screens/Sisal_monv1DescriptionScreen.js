import "./Sisal_monv1DescriptionScreen.css";
import ER from "../pic/EER_monv1_db_v8.0.png";

const Monv1DescriptionScreen = () => {
  return (
    <div className="pageContainer">
      <h1>The SISAL webApp with the SISALv3 database</h1>
      <p></p>
      <h2>Overview</h2>
      <p>
        The{" "}
        <a
          href="https://essd.copernicus.org/preprints/essd-2023-364/"
          target="_blank"
          rel="noreferrer"
        >
          SISAL_monv1 database
        </a>{" "}
        created by the PAGES-SISAL Working Group contains dripwater isotope datasets from 75
        caves, with summary information including meta-data on location,
        elevation, cave depth, lithology, measurement methods and citations for
        original publications. Speleothem records previously curated by SISAL in
        SISAL speleothem database versions and corresponding to monitored drip
        sites are also identified in the new SISAL monitoring database. To
        supplement observational data gaps and provide accessible and consistent
        climate data for users, surface climate (precipitation, evaporation,
        temperature) and meteoric water isotope data extracted from global
        climate model products are also included in the database.
      </p>
      <p>
        The draft version of the database can be found at{" "}
        <a
          href="https://repo.researchdata.hu/privateurl.xhtml?token=43a43257-f06e-4dc5-9e96-6603eabe775f"
          target="_blank"
          rel="noreferrer"
        >
          https://repo.researchdata.hu/privateurl.xhtml?token=43a43257-f06e-4dc5-9e96-6603eabe775f
        </a>
        , which will be available under doi: 10.5158/ARP/29W5J3 upon
        publication.
      </p>

      <h2>Instructions / Usage</h2>
      <p>
        With the SISAL webApp one can query the SISAL_monv1 database using a
        simple online tool accessible from any web-browser. It provides the user
        with the metadata of the queried cave monitoring records, such as:
        <ul>
          <li>
            Precipitation amount, precipitation δ<sup>18</sup>O and δ
            <sup>2</sup>H from above/nearby the cave;
          </li>
          <li>
            Cave drip water δ<sup>18</sup>O, δ<sup>2</sup>H and drip rate;
          </li>
          <li>
            Carbonate δ<sup>18</sup>O and δ<sup>13</sup>C of modern carbonates
            grown on substrates in cave experiments and/or active speleothem
            growth from monitored drips.
          </li>
        </ul>
      </p>
      <p>
        In addition to cave monitoring records, the database provides monthly
        climate and precipitation-isotope inputs for each cave entity from four
        global products. For details see Table 2 in the database description
        paper.
      </p>
      <p>
        For further information on database versions, publications and how-to
        guides please visit the{" "}
        <a
          href="https://repo.researchdata.hu/privateurl.xhtml?token=43a43257-f06e-4dc5-9e96-6603eabe775f"
          target="_blank"
          rel="noreferrer"
        >
          repository
        </a>{" "}
        and the related GitHub site:
        <a
          href="https://github.com/istvan60/SISAL_monv1/tree/main"
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/istvan60/SISAL_monv1/tree/main
        </a>
        .
      </p>

      <h3>
        1. Basic querying - 1<sup>st</sup> step
      </h3>
      <p>
        Basic querying provides the tool to extract SISAL database information
        based on the most fundamental filters.
      </p>
      <p>
        After providing an email address (recommended for query logging
        purposes) the user can choose to query based on 'Site name' or within
        spatial - (latitude and longitude limits).
      </p>
      <p>
        At least one of the following “Filter types” must be correctly filled
        out.
        <ul>
          <li>Site name (site_name)</li>
          <li>
            Latitude and Longitude (from - to; default is global coverage values
            from -90 to 90 and from -180 to 180). In the first column, the
            southern and western boundaries should be provided for latitude and
            longitude respectively. Latitude in degrees decimal (N= +, S= -) and
            longitude in degrees decimal (E= +, W= -). Other formats are not
            accepted, the App will return no results.
          </li>
        </ul>
      </p>

      <h3>
        2. Selection based on the metadata - 2<sup>nd</sup> step
      </h3>
      <p>Now a subset of records can be selected based on their metadata.</p>
      <p>
        The site level information is always visible by default. To display the
        entity-level information, the expand icon (“+” ) per site row can be
        used to expand / collapse the given site section.
      </p>

      <h3>
        3. Data extraction - 3<sup>rd</sup> step
      </h3>
      <p>
        By pressing the two download buttons at the bottom of the page one can
        download the (i) metadata of the selected cave sites, (ii) their
        monitoring information, in two separate *.xlsx files.
      </p>
      <p>
        If there is no monitoring information available for a given cave site
        just e.g. precipitation, the 'Download monitoring data' button will
        return no output.
      </p>

      <img src={ER} alt="Sisal Monitor EER" />

      <p>
        The structure of the SISAL_monv1 database showing individual tables (and
        their contents) and the nature of the relationships between them where
        “many to one linkages” indicate that it is possible to have several
        entries in one table linked to a single entry in another table. The
        colors of the format of the particular field.
      </p>
    </div>
  );
};

export default Monv1DescriptionScreen;
