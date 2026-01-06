import { useState } from "react";
import { Table, Button, Input, ButtonGroup } from "reactstrap";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";

function entity_id(entity) {
  return [
    entity.site_id,
    entity.cave_entity_id,
    entity.drip_entity_id,
    entity.precip_site_id,
  ].join("_");
}

const Datatable = ({ data, query }) => {
  const [entities, setEntities] = useState([]);

  let columns = data[0] && Object.keys(data[0]);
  columns = columns?.filter(
    (col) =>
      col !== "cave_entity_id" &&
      col !== "drip_entity_id" &&
      col !== "precip_site_id"
  );
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

  const dowloadEntities = (type) => {
    let selectedEntites = entities.filter((e) => e.isChecked === true);
    if (selectedEntites.length !== 0) {
      if (type === "monitoring") {
        handleOnDownloadMonitoring(selectedEntites);
      } else if (type === "metadata") {
        handleOnDownload(selectedEntites, [{ sql: query }], "EntityList");
      }
    } else {
      alert("Download request denied! Please select at least one entity!");
    }
  };

  const handleOnDownloadMonitoring = async (entities) => {
    const entityIds = entities.map((entity) => {
      return {
        site_id: entity.site_id,
        cave_entity_id: entity.cave_entity_id,
        drip_entity_id: entity.drip_entity_id,
        precip_site_id: entity.precip_site_id,
      };
    });

    let monitoringData = [];

    axios
      .post(
        `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_SERVER_API}/getMonv1/monitoring`,
        { entityIds: entityIds }
      )
      .then((response) => {
        monitoringData = response.data;
        exportMonitoringDataToExcel(
          monitoringData,
          "Sisal_monv1_monitoring_data.xlsx"
        );
      })
      .catch((error) => console.log(error));
  };

  function addSheet(workbook, sheetName, data) {
    // Ensure data is an array, wrapping single objects
    const dataArray = Array.isArray(data)
      ? data.length > 0
        ? data
        : [{}]
      : [data || {}];

    // Handle null/undefined data gracefully, create an empty sheet
    if (dataArray.length === 1 && Object.keys(dataArray[0]).length === 0) {
      // console.log(`No data for sheet: ${sheetName}. Creating empty sheet.`);
      // Create a worksheet with a placeholder if data is empty
      const emptyWs = XLSX.utils.json_to_sheet([
        { Message: "No data available." },
      ]);
      XLSX.utils.book_append_sheet(workbook, emptyWs, sheetName);
      return;
    }

    // Convert the array of objects to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataArray);

    // Auto-fit columns
    try {
      const objectMaxLength = [];
      // Get header lengths
      const headers = Object.keys(dataArray[0]);
      headers.forEach((header) => {
        objectMaxLength.push(Math.max(10, header.length)); // Min width of 10 or header length
      });

      // Get data lengths
      for (const row of dataArray) {
        headers.forEach((header, i) => {
          const value = row[header];
          if (value != null) {
            const length = value.toString().length;
            if (objectMaxLength[i] < length) {
              objectMaxLength[i] = length;
            }
          }
        });
      }
      // Apply column widths (wch = width in characters)
      worksheet["!cols"] = objectMaxLength.map((width) => ({ wch: width + 2 })); // Add 2 for padding
    } catch (e) {
      // Fallback in case of error (e.g., empty data array)
      // console.warn("Could not auto-fit columns for sheet:", sheetName, e);
    }
    // --- End auto-fit ---

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  async function exportMonitoringDataToExcel(monitoringData, outputPath) {
    // Create a new blank workbook
    const workbook = XLSX.utils.book_new();

    // --- Add a sheet for each piece of data ---
    addSheet(workbook, "Site_Info", monitoringData.site_info);
    addSheet(workbook, "Cave_Entity", monitoringData.cave_entity);
    addSheet(workbook, "Climate", monitoringData.climate);

    // Drip data is now denormalized
    addSheet(workbook, "Drip_Iso_Samples", monitoringData.drip_iso_samples);
    addSheet(workbook, "Drip_Rate_Samples", monitoringData.drip_rate_samples);
    addSheet(
      workbook,
      "Drip_ModCarb_Samples",
      monitoringData.drip_mod_carb_samples
    );

    // Precip data is now denormalized
    addSheet(workbook, "Precip_Entities", monitoringData.precip_entities);
    addSheet(workbook, "Precip_Samples", monitoringData.precip_samples);

    // --- Save the file ---
    try {
      // Write the workbook to a file
      XLSX.writeFile(workbook, outputPath);
      // console.log(`Successfully exported monitoring data to ${outputPath}`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw error;
    }
  }

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
          entity_id(entity) === name
            ? { ...entity, isChecked: checked }
            : entity
        );
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
          entity_id(entity) === name
            ? { ...entity, isChecked: checked }
            : entity
        );
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
              <Button
                color="primary"
                outline
                onClick={() => dowloadEntities("metadata")}
              >
                Download selected meta data
              </Button>
              <Button
                className="downloadMetaDataBtn"
                color="primary"
                outline
                onClick={() => dowloadEntities("monitoring")}
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
                onClick={() => dowloadEntities("metadata")}
              >
                Download selected meta data
              </Button>
              <Button
                className="downloadMetaDataBtn"
                color="primary"
                outline
                onClick={() => dowloadEntities("monitoring")}
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
