import './HomeScreen.css'
import logo from '../pic/PAGES_logo.png'

const HomeSrean = () => {
  return (
    <div className="homescreen">
      <div className="wrapper">
        <div className="title">
          <h1>The SISAL App</h1>
          <p>
            - explore the speleothem climate and environment archives of the world -
          </p>
        </div>
        <div className="intro">
          <h2>Overview</h2>
          <a href="https://pastglobalchanges.org/science/wg/sisal/intro"><img src={logo} alt="" /></a>
          <p>
            Speleothem (cave carbonate) archives are widely distributed in terrestrial regions around the world, and provide
            high-resolution records of past changes in climate and environment, encoded in oxygen and carbon isotopes.
            <a href="https://pastglobalchanges.org/science/wg/sisal/intro">SISAL</a> (Speleothem Isotope Synthesis and AnaLysis)
            is an international working group of the Past Global Changes (PAGES) project, which aims to provide a comprehensive
            compilation of speleothem isotope records for climate reconstruction and model evaluation.
          </p>
          <p>
            The SISALv3 database is an update and extension of the SISALv2 database created by the PAGES-SISAL Phase 2 Working
            Group. The newest version of the database provides 700 speleothem records from 293 cave sites, 500 of which have
            standardized chronologies. The database provides increased access to records, extensive metadata and has enabled
            regional-to-global scale analysis of climatic patterns using a variety of approaches. Some examples can be seen
            in the PAGES-SISAL <a href="https://pastglobalchanges.org/taxonomy/term/119/publications">product</a> page.
          </p>
          <p>
            The structure of the SISAL <a href="https://tanospeter.github.io/sisalv2_eer.html">database</a> requires use of codes
            (SQL, R,Python, Matlab) which may make it difficult to access  the database for everyday research. Thus, a
            <a href="https://pastglobalchanges.org/science/wg/sisal/intro">project</a> was initiated within the
            <a href="https://pastglobalchanges.org/science/wg/sisal/intro">PAGES-SISAL working group</a> to construct a web-based
            interface to access the SISAL database using an online javascript web app, with a user-friendly GUI front-end to increase
            SISAL database accessibility. In addition to increasing data access, The SISAL app is also a teaching tool, it
            provides instruction on the (i) logic by which databases can be mined for required data and (ii) accompanying SQL
            code so you can build on the basic functionalities of The SISAL app by using a tool like SQL to directly mine the database.
          </p>
          <p>
            We welcome feedback on PAGES' <strong>The SISAL App</strong> and encourage participation and collaboration from
            interested researchers in different stages of their academic career and working in different geographical
            regions and allied disciplines. You can contact us <a href="https://pastglobalchanges.org/science/wg/sisal/people">here</a>.
          </p>

          <h2>Instructions / Usage</h2>
          <p>
            With the The SISAL App one can query the SISALv3 database using a simple online tool accessible from any web-browser.
            It will provide the user with the metadata of the queried speleothem records, their sample data (d18O and d13C) and dating
            information including the original author-generated as well as SISAL-generated standardized chronologies. For further
            information on database versions, publications and how-to guides please visit the University of Reading page:
            <a href="https://researchdata.reading.ac.uk/256/">https://researchdata.reading.ac.uk/256/</a>
          </p>
          <h3>1. Basic querying - 1st step</h3>
          <p>Basic querying provides the tool to extract SISAL database information based on the most fundamental filters.
            After providing an email address (recommended for logging purposes) the user can choose to query based on
            'Site name' or spatial- (lat - lon) and / or temporal constraints (interp_age).
          </p>
          <p>
            At least one of the following “Filter types” must be correctly filled out
          </p>
          <ul>
            <li>
              Site name
            </li>
            <li>
              Latitude and Longitude (from - to; default is global coverage values from -90 to 90 and from -180 to 180). In the first column the southern and western boundaries should be provided for latitude and longitude respectively. Latitude in degrees decimal (N= +, S= -) and longitude in degrees decimal (E= +, W= -).   Other formats are not accepted, the App will return no results.
            </li>
            <li>
              Interp_age (from younger - to older) which stands for calendar age of the sample in years according to the original published
              age model. For details see Sect. 2.2 and Table S9 of <a href="https://essd.copernicus.org/articles/10/1687/2018/">Atsawawaranunt et al. (2018)</a>.
            </li>
            <li>
              University of Reading page: <a href="https://researchdata.reading.ac.uk/256/">https://researchdata.reading.ac.uk/256/</a>. 
              <p/>Please note, in case of large output tables, querying may take up to minutes.
            </li>
            <li>
              The SISAL app a stepping stone in the usage of the SISAL database (and other databases like it).
              <p/>The extracted Sample data is trimmed according to the temporal constraints if applied in 'Filter type 3 (interp_age)', while the complete dating information table is given for the selected record(s) meeting the filter criteria applied
            </li>
          </ul>
          <h3>Selection based on the metadata - 2nd step</h3>
          <p>
            Now a subset of records can be selected based on their metadata (e.g. mineralogy), also extracted from the SISAL database.
          </p>
          <p>
            Besides the originally published chronologies (if even existing) alternative age-depth models (with corresponding uncertainties)
            were provided by SISAL (<a href="https://essd.copernicus.org/articles/12/2579/2020/">Comas-Bru et al. 2020</a>) for records
            that are not composites (i.e. time series based on more than one speleothem record) and which are purely <sup>230</sup>Th/U dated
            (see Sect. 2.1 in <a href="https://essd.copernicus.org/articles/12/2579/2020/">Comas-Bru et al. 2020</a>). The user of The
            SISAL app can choose, which chronology(s) should be extracted - including uncertainties - for the queried records.
          </p>
          <h3>Data extraction  - 3rd step</h3>
          <p>
            By pressing the three download buttons at the bottom of the page one can download the (i) metadata of the selected records,
            (ii) their dating information, (iii) selected chronologies and the sample data in three separate *.xlsx files.
          </p>
          <p>
            As an additional output the SQL codes will be provided by the app to help the user get a deeper insight into how the
            database is queried. It is our clear intention to make The SISAL app a stepping stone in the usage of the SISAL database
            (and other databases like it).
          </p>
          <h3>3. Advanced querying</h3>
          <p>Advanced querying provides the tool to extract SISAL database information based on available radiometric ages and sample
            data resolution. This option is available after one Basic filter is applied and a corresponding list of records/data received.
            Two filters can be applied and combined.
          </p>
          <ul>
            <li>
              minimum number of radiometric ages for the chosen record(s) regarding the whole available time interval, or shorter if
              filter is applied in the Basic querying part; 1st Step
            </li>
            <li>
              maximum allowed age gap in the chosen original chronology (interp_age), or in another chosen SISAL chronology,
              regarding the whole available time interval, or shorter if filter is applied in the Basic querying part; 1st Step
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HomeSrean