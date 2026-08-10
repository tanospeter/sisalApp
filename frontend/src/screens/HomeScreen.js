import "./HomeScreen.css";
import logo from "../pic/PAGES_logo.png";
import { Alert } from "reactstrap";

const HomeScreen = () => {
  return (
    <div className="homescreen">
      <div className="wrapper">
        <div className="title">
          <h1>The SISAL webApp</h1>
          <p>
            - explore the speleothem climate and environmental archives of the
            world -
          </p>
        </div>
        <div className="intro">
          <h2>Overview</h2>
          <a href="https://pastglobalchanges.org/science/wg/sisal/intro" target="_blank" rel="noreferrer">
            <img src={logo} alt="" />
          </a>
          <p>
            Speleothem (cave carbonate) archives are widely distributed in
            terrestrial regions around the world, and provide high-resolution
            records of past changes in climate and environment, mainly encoded
            in oxygen and carbon isotopes.{" "}
            <a
              href="https://pastglobalchanges.org/science/wg/sisal/intro"
              target="_blank"
              rel="noreferrer"
            >
              SISAL
            </a>{" "}
            (Speleothem Isotope Synthesis and AnaLysis) is an international
            working group of the Past Global Changes (PAGES) project, which aims
            to provide a comprehensive compilation of speleothem isotope records
            for climate reconstruction and model evaluation.
          </p>
          <p>
            The structure of the SISAL{" "}
            <a
              href="https://geochem.hu/SISAL_webApp/database"
              target="_blank"
              rel="noreferrer"
            >
              database
            </a>
            s requires use of codes (SQL, R, Python, MATLAB) which may make it
            difficult to access the database for everyday research. Thus, a{" "}
            <a
              href="https://pastglobalchanges.org/science/wg/sisal/intro"
              target="_blank"
              rel="noreferrer"
            >
              project
            </a>{" "}
            was initiated within the{" "}
            <a
              href="https://pastglobalchanges.org/science/wg/sisal/intro"
              target="_blank"
              rel="noreferrer"
            >
              PAGES-SISAL Working Group
            </a>{" "}
            to construct a web-based interface to access the SISAL database
            using an online javascript web app, with a user-friendly GUI
            front-end to increase SISAL database accessibility. In addition to
            increasing data access, the '<strong>SISAL webApp</strong>' is also
            a teaching tool, it provides instruction on the (i) logic by which
            databases can be mined for required data and (ii) accompanying SQL
            code so you can build on the basic functionalities of the SISAL
            webApp by using a tool like SQL to directly mine the database.
          </p>
          <p>
            We welcome feedback on PAGES' SISAL webApp and encourage
            participation and collaboration from interested researchers in
            different stages of their academic career and working in different
            geographical regions and allied disciplines. You can contact the
            SISAL Working Group{" "}
            <a
              href="https://pastglobalchanges.org/science/wg/sisal/people"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </p>

          <h3>Version history</h3>
          <p>
            1.4. The SISAL webApp hosts and enables the querying of the SISAL_monv1 database{" "}
            <a href="https://doi.org/10.5194/essd-2026-31">https://doi.org/10.5194/essd-2026-31</a>{" "}
            following the well-known logic of the SISALwebApp. <span className="text-muted">- 28.01.2026</span>
          </p>
          <p>
            1.3. The SISAL webApp now enables spatial querying via selecting a
            bounding box on the map at the bottom of the page.{" "}
            <span className="text-muted">- 27.06.2024</span>
          </p>
          <p>
            1.2. The SISAL webApp now queries the SISALv3 database{" "}
            <a
              href="https://doi.org/10.5194/essd-16-1933-2024"
              target="_blank"
              rel="noreferrer"
            >
              https://doi.org/10.5194/essd-16-1933-2024
            </a>{" "}
            please do not forget to cite!{" "}
            <span className="text-muted">- 15.06.2024.</span>{" "}
          </p>
          <p>
            - where you list the repository items, also list that more trace
            elements datafiles, cave site map files, speleothem section image
            files etc. can be found in the repository (see the data availability
            section of the manuscript for details).{" "}
          </p>
          <p>
            1.1. An interactive map has been added which allows the visual
            inspection of the sites queried. In addition, an option to filter
            for composite records has been introduced
            <span className="text-muted">- 29.04.2023.</span>
          </p>

          <Alert color="info">
            <span>🛈</span>
            <span>
              When using the SISALwebApp please cite the app itself
              http://geochem.hu/SISAL_webApp/ AND the corresponding paper{" "}
              <strong>
                Hatvani IG, Kern Z, Tanos P, Wilhelm M, Lechleitner FA, Kaushal
                N (2024). The SISAL webApp: exploring the speleothem climate and
                environmental archives of the world. Quaternary Research 118,
                211-217.{" "}
                <a href="https://doi.org/10.1017/qua.2023.39">
                  https://doi.org/10.1017/qua.2023.39
                </a>
              </strong>{" "}
              .
            </span>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
