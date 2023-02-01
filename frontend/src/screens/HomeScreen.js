import './HomeScreen.css'
import logo from '../pic/PAGES_logo.png'

const HomeSrean = () => {
  return (
    <div className="homescreen">
      <div className="wrapper">
        <div className="title">
          <h1>The SISAL webApp</h1>
          <p>
            - explore the speleothem climate and environment archives of the world -
          </p>
        </div>
        <div className="intro">
          <h2>Overview</h2>
          <a href="https://pastglobalchanges.org/science/wg/sisal/intro"><img src={logo} alt="" /></a>
          <p>
            Speleothem (cave carbonate) archives are widely distributed in terrestrial regions around the world, and provide
            high-resolution records of past changes in climate and environment, mainly encoded in oxygen and carbon 
            isotopes. <a href="https://pastglobalchanges.org/science/wg/sisal/intro" target="_blank">SISAL</a> (Speleothem Isotope Synthesis
            and AnaLysis) is an international working group of the Past Global Changes (PAGES) project, which aims to provide a
            comprehensive compilation of speleothem isotope records for climate reconstruction and model evaluation.
          </p>
          <p>
            The <a href="https://essd.copernicus.org/articles/12/2579/2020/" target="_blank">SISALv2 database</a> created by the
            PAGES-SISAL Working Group provides 700 speleothem records from 293 cave sites, 500 of which have standardized chronologies.
            The database provides increased access to records, extensive metadata and has enabled regional-to-global scale analysis of
            climatic patterns using a variety of approaches. Some examples can be seen in the PAGES-SISAL <a href="https://pastglobalchanges.org/taxonomy/term/119/publications" target="_blank">product</a> page.
          </p>
          <p>
            The structure of the SISAL <a href="https://tanospeter.github.io/sisalv2_eer.html" target="_blank">database</a> requires
            use of codes (SQL, R, Python, MATLAB) which may make it difficult to access  the database for everyday research. Thus, 
            a <a href="https://pastglobalchanges.org/science/wg/sisal/intro" target="_blank">project</a> 
            was initiated within 
            the <a href="https://pastglobalchanges.org/science/wg/sisal/intro" target="_blank">PAGES-SISAL Working Group</a> to construct
            a web-based interface to access the SISAL database using an online javascript web app, with a user-friendly GUI front-end
            to increase SISAL database accessibility. In addition to increasing data access, the '<strong>SISAL webApp</strong>' is
            also a teaching tool, it provides instruction on the (i) logic by which databases can be mined for required data and
            (ii) accompanying SQL code so you can build on the basic functionalities of the SISAL webApp by using a tool like SQL to
            directly mine the database.
          </p>
          <p>
            We welcome feedback on PAGES' SISAL webApp and encourage participation and collaboration from interested researchers in
            different stages of their academic career and working in different geographical regions and allied disciplines. You can
            contact the SISAL Working Group <a href="https://pastglobalchanges.org/science/wg/sisal/people" target="_blank">here</a>.
          </p>

          <p>
            SISAL is releasing version 3 of the database in late-2023, the SISAL webApp will receive an update accordingly afterwards.
          </p>

          <h2>Instructions / Usage</h2>
          <p>
            With the SISAL webApp one can query the SISALv2 database using a simple online tool accessible from any web-browser. It
            provides the user with the metadata of the queried speleothem records, their sample data (δ<sup>18</sup>O and δ<sup>13</sup>C) and dating
            information including the original author-generated - as well as SISAL-generated standardized - chronologies. For further
            information on database versions, publications and how-to guides please visit 
            the <a href="https://researchdata.reading.ac.uk/256/" target="_blank">SISAL page at University of Reading</a>.
          </p>
          <h3>1. Basic querying - 1<sup>st</sup> step</h3>
          <p>Basic querying provides the tool to extract SISAL database information based on the most fundamental filters. </p>
          <p>After providing an email address (recommended for query logging purposes) the user can choose to query based on
            'Site name' or within spatial - (latitude and longitude limits) and / or within temporal constraints (interp_age). </p>
          <p> At least one of the following “Filter types” must be correctly filled out.</p>
          <ul>
            <li>
              Site name (site_name)
            </li>
            <li>
              Latitude and Longitude (from - to; default is global coverage values from -90 to 90 and from -180 to 180). In the first
              column the southern and western boundaries should be provided for latitude and longitude respectively. Latitude in degrees
              decimal (N= +, S= -) and longitude in degrees decimal (E= +, W= -). Other formats are not accepted, the App will return no results.
            </li>
            <li>
              interp_age (from younger - to older) according to the original author-generated age model expressed in year BP, where BP
              refers to “before present”, where present is 1950 CE. For details see Sect. 2.2 and Table S9 
              of <a href="https://essd.copernicus.org/articles/10/1687/2018/" target="_blank">Atsawawaranunt et al. (2018)</a> 
              and the <a href="https://researchdata.reading.ac.uk/256/" target="_blank">SISAL page at University of Reading</a>.
            </li>
          </ul>
          <p>
            Please note, in case of large output tables (maximized in 30,000 lines), querying may take up to minutes.
          </p>
          <h4>1.1 Selection based on the metadata - 2<sup>nd</sup> step</h4>
          <p>
            Now a subset of records can be selected based on their metadata (e.g. mineralogy). Besides the author-generated chronologies
            alternative age-depth models (with corresponding uncertainties) were provided by SISAL
            (<a href="https://essd.copernicus.org/articles/12/2579/2020/" target="_blank">Comas-Bru et al. 2020</a>) for records that 
            are not composites (i.e. time series based on more than one speleothem record) and which are <sup>230</sup>Th/U dated (see Sect. 2.1 
            in <a href="https://essd.copernicus.org/articles/12/2579/2020/" target="_blank">Comas-Bru et al. 2020</a>). The original
            author-generated chronology is a default output and the user of the App has to choose at least one SISAL chronology to be
            extracted - including uncertainties - for the queried records.
          </p>
          <h4>1.2 Data extraction  - 3<sup>rd</sup> step</h4>
          <p>
            By pressing the three download buttons at the bottom of the page one can download the (i) metadata of the selected records,
            (ii) their dating information, (iii) selected chronologies and the sample data in three separate *.xlsx files.
          </p>
          <p>
            As an additional output, the SQL codes will be provided by the app to help the user get a deeper insight into how the database
            is queried. It is our clear intention to make the SISAL webApp a stepping stone in the usage of the SISAL database (and other
            databases like it).
          </p>
          <p>
            The extracted Sample data is trimmed according to the temporal constraints if applied in 'Filter type 3 (interp_age)',
            while the complete dating information table is given for the selected record(s) meeting the filter criteria applied.
            The list of speleothem records in the database will appear including their site and entity metadata fulfilling the search
            criteria provided by the user.
          </p>
          <h3>2. Advanced querying</h3>
          <p>
            Advanced querying provides the tool to extract SISAL database information based on available radiometric ages and sample
            data resolution. This option is available after one Basic filter is applied and a corresponding list of records/data received.
          </p>
          <p>
            Two filters can be applied and combined.
          </p>
          <ul>
            <li>
            minimum number of radiometric ages for the chosen record(s) regarding the whole available time interval, or shorter if filter is 
            applied in the Basic querying part: 1<sup>st</sup> Step. Note that only those ages are considered, which were 'date_used ≠ no' in the database.
            </li>
            <li>
            maximum allowed 'age gap' (hiatus and/or sampling step) in the chosen original chronology (interp_age), or in another chosen 
            SISAL chronology, regarding the whole available time interval, or shorter if filter is applied in the Basic querying part: 1<sup>st</sup> Step.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HomeSrean