import { useState } from "react";
import { Table, Button, Input, ButtonGroup } from "reactstrap";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function entity_id(entity) {
  return [
    entity.site_id,
    entity.cave_entity_id,
    entity.drip_entity_id,
    entity.precip_site_name,
  ].join("_");
}

const Datatable = ({ data, query }) => {
  const [entities, setEntities] = useState([]);

  let columns = data[0] && Object.keys(data[0]);
  let d = data;

  const handleOnDownload = (query, sql, title) => {
    if (query.length <= 30000) {
      var workBook = XLSX.utils.book_new(),
        workSheet1 = XLSX.utils.json_to_sheet(query),
        workSheet2 = XLSX.utils.json_to_sheet(sql);
      XLSX.utils.book_append_sheet(workBook, workSheet1, title);
      XLSX.utils.book_append_sheet(workBook, workSheet2, "SQL query");
      XLSX.writeFile(workBook, `${title}.xlsx`);
    } else {
      alert(
        "Download request denied! In the case of queries that result in a high number of samples > 30,000 lines could take up to multiple minutes. Therefore, for such tasks use the MySQL database or the flat csv files located https://researchdata.reading.ac.uk/256/. The SISAL App is limited to providing 30,000 lines of output. Another option is to reduce the number of selected entities in the Filtered metadata list, or move to the Advanced querying to narrow the output."
      );
    }
  };

  const dowloadEntities = () => {
    let selectedEntites = entities.filter((e) => e.isChecked === true);
    if (selectedEntites.length !== 0) {
      handleOnDownload(selectedEntites, [{ sql: query }], "EntityList");
    } else {
      alert("Download request denied! Please select at least one entity!");
    }
  };

  // minden munkalapra 1-1 tábla (excl. entity_link_reference), csak selected
  const handleOnDownloadMonitoring = async () => {
    const queryBySite = data.reduce((acc, obj) => {
      if (!acc[obj.site_name]) {
        acc[obj.site_name] = [];
      }
      acc[obj.site_name].push(obj);
      return acc;
    }, {});

    const zip = new JSZip();

    await Promise.all(
      Object.values(queryBySite).map(async (siteData) => {
        const siteName = siteData[0].site_name;
        let workBook = XLSX.utils.book_new();
        const workSheet1 = XLSX.utils.json_to_sheet(siteData);
        XLSX.utils.book_append_sheet(workBook, workSheet1, siteName);
        // Generate XLSX as Uint8Array
        const wbout = XLSX.write(workBook, { bookType: "xlsx", type: "array" });
        zip.file(`${siteName}.xlsx`, wbout);
      })
    );

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "Sisal_monv1_monitoring_data.zip");
    });
  };

  const comparePropsAndHook = () => {
    let entitiesFromData = d.map((entity) => {
      return entity_id(entity);
    });
    let entitiesFromEntitiesHook = entities.map((entity) => {
      return entity_id(entity);
    });

    return entitiesFromData.toString() === entitiesFromEntitiesHook.toString();
  };

  // Entity selector function for 'Filtered metadata' section
  const selectEntity = (e) => {
    const { name, checked } = e.target;
    //console.log(name, checked)
    const isIdentical = comparePropsAndHook();
    if (!isIdentical) {
      // prop and hook are not identical
      if (name === "allSelect") {
        let tempEntity = d.map((entity) => {
          return { ...entity, isChecked: checked };
        });
        setEntities(tempEntity);
      } else {
        let tempEntity = d.map((entity) =>
          //console.log(typeof entity.entity_id.toString(), typeof name, entity.entity_id == name) // true
          entity_id(entity) === name
            ? { ...entity, isChecked: checked }
            : entity
        );
        //console.log(tempEntity.entity_id)
        setEntities(tempEntity);
      }
    } else {
      //prop and hook are identical
      if (name === "allSelect") {
        let tempEntity = entities.map((entity) => {
          return { ...entity, isChecked: checked };
        });
        setEntities(tempEntity);
      } else {
        let tempEntity = entities.map((entity) =>
          //console.log(typeof entity.entity_id.toString(), typeof name, entity.entity_id == name) // true
          entity_id(entity) === name
            ? { ...entity, isChecked: checked }
            : entity
        );
        //console.log(tempEntity.entity_id)
        setEntities(tempEntity);
      }
    }
  };

  if (columns) {
    const isIdentical = comparePropsAndHook();
    if (!isIdentical) {
      return (
        <div className="datatable">
          <h2>Filtered metadata</h2>
          <div>
            <Table responsive hover size="10">
              <thead>
                <tr key="h">
                  <th>
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      name="allSelect"
                      onChange={selectEntity}
                    />
                  </th>
                  {d[0] && columns.map((heading) => <th>{heading}</th>)}
                </tr>
              </thead>
              <tbody>
                {d.map((row) => (
                  <tr key={entity_id(row)}>
                    <td>
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        name={entity_id(row)}
                        checked={row?.isChecked || false}
                        onChange={selectEntity}
                      />
                    </td>{" "}
                    {columns.map((column) => (
                      <td>{row[column]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div>
            <ButtonGroup>
              <Button color="primary" outline onClick={dowloadEntities}>
                Download selected meta data
              </Button>
              <Button
                className="downloadMetaDataBtn"
                color="primary"
                outline
                onClick={handleOnDownloadMonitoring}
              >
                Download monitoring data
              </Button>
            </ButtonGroup>
          </div>
        </div>
      );
    } else {
      return (
        <div className="datatable">
          <h2>Filtered metadata</h2>
          <div>
            <Table responsive hover size="10">
              <thead>
                <tr key="h">
                  <th>
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      name="allSelect"
                      onChange={selectEntity}
                    />
                  </th>
                  {d[0] && columns.map((heading) => <th>{heading}</th>)}
                </tr>
              </thead>
              <tbody>
                {entities.map((row) => (
                  <tr key={entity_id(row)}>
                    <td>
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        name={entity_id(row)}
                        checked={row?.isChecked || false}
                        onChange={selectEntity}
                      />
                    </td>{" "}
                    {columns.map((column) => (
                      <td>{row[column]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div>
            <ButtonGroup>
              <Button
                className="downloadMetaDataBtn"
                color="primary"
                outline
                onClick={dowloadEntities}
              >
                Download selected meta data
              </Button>
              <Button
                className="downloadMetaDataBtn"
                color="primary"
                outline
                onClick={handleOnDownloadMonitoring}
              >
                Download monitoring data
              </Button>
            </ButtonGroup>
          </div>
        </div>
      );
    }
  } else {
    if (query.length !== 0) {
      return (
        <div className="datatable">
          <h2>No data retrieved!</h2>
        </div>
      );
    }
  }
};

export default Datatable;
