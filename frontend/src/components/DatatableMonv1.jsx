import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Button, Input, ButtonGroup } from "reactstrap";
import * as XLSX from "xlsx";
import axios from "axios";

function entity_id(entity) {
  return [
    entity.site_id,
    entity.cave_entity_id,
    entity.drip_entity_id,
    entity.precip_site_id,
    entity.drip_iso_sample_id,
    entity.precip_sample_id,
  ].join("_");
}

const keyColumns = [
  "site_id",
  "site_name",
  "latitude",
  "longitude",
  "elevation",
];

const Datatable = ({ data, query }) => {
  const [entities, setEntities] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);

  useEffect(() => {
    setEntities(data.map((entity) => ({ ...entity, isChecked: false })));
    setExpandedGroups([]);
  }, [data]);

  const columns = useMemo(() => {
    const cols = data[0] && Object.keys(data[0]);
    return cols?.filter(
      (col) =>
        col === "cave_entity_name" ||
        col === "drip_entity_name" ||
        col === "precip_site_name" ||
        col === "drip_iso_start_yyyy" ||
        col === "drip_iso_end_yyyy" ||
        col === "precip_start_yyyy" ||
        col === "precip_end_yyyy"
    );
  }, [data]);

  const distinctCounts = useMemo(() => {
    const counts = {};
    if (data && data.length > 0) {
      const allColumns = Object.keys(data[0]);
      allColumns.forEach((col) => {
        const distinctValues = new Set(
          data.map((row) => row[col]).filter((val) => val !== null && val !== undefined)
        );
        counts[col] = distinctValues.size;
      });
    }
    return counts;
  }, [data]);

  const handleOnDownload = (dataArray, sql, title) => {
    if (dataArray.length <= 30000) {
      var workBook = XLSX.utils.book_new(),
        workSheet1 = XLSX.utils.json_to_sheet(dataArray),
        workSheet2 = XLSX.utils.json_to_sheet(sql);
      XLSX.utils.book_append_sheet(workBook, workSheet1, title);
      XLSX.utils.book_append_sheet(workBook, workSheet2, "SQL query");
      XLSX.writeFile(workBook, `${title}.xlsx`);
    } else {
      alert(
        "Download request denied! In the case of queries that result in a high number of samples > 30,000 lines could take up to multiple minutes. Therefore, for such tasks use the MySQL database or the flat csv files located https://researchdata.reading.ac.uk/256/. The SISAL App is limited to providing 30,000 lines of output. Another option is to reduce the number of selected entities in the Filtered metadata list, or move to the Advanced querying to narrow the output.",
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
    const entityIds = entities.map((entity) => ({
      site_id: entity.site_id,
      cave_entity_id: entity.cave_entity_id,
      drip_entity_id: entity.drip_entity_id,
      precip_site_id: entity.precip_site_id,
    }));

    axios
      .post(
        `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_SERVER_API}/getMonv1/monitoring`,
        { entityIds: entityIds },
      )
      .then((response) => {
        exportMonitoringDataToExcel(
          response.data,
          "Sisal_monv1_monitoring_data.xlsx",
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

    // Helper check to prevent crashes if data is missing
    const safeAdd = (sheetName, data) => {
      if (data && data.length > 0) {
        addSheet(workbook, sheetName, data);
      }
    };

    // --- 1. Site & Climate ---
    safeAdd("Site_Info", monitoringData.site_info);
    safeAdd("Climate", monitoringData.climate);

    // --- 2. Entities (Metadata) ---
    // Note: Backend key changed from 'cave_entity' to 'cave_entities'
    safeAdd("Cave_Entities", monitoringData.cave_entities);

    // NEW: Drip entities are now separate from samples
    safeAdd("Drip_Entities", monitoringData.drip_entities);

    safeAdd("Precip_Entities", monitoringData.precip_entities);

    // --- 3. Samples (Data) ---
    safeAdd("Drip_Iso_Samples", monitoringData.drip_iso_samples);
    safeAdd("Drip_Rate_Samples", monitoringData.drip_rate_samples);
    safeAdd("Drip_ModCarb_Samples", monitoringData.drip_mod_carb_samples);
    safeAdd("Precip_Samples", monitoringData.precip_samples);

    // --- 4. References ---
    // This sheet will contain the unified list with 'link_type' and 'citation'
    safeAdd("References", monitoringData.references);

    // --- Save the file ---
    try {
      XLSX.writeFile(workbook, outputPath);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw error;
    }
  }

  // Entity selector function for 'Filtered metadata' section
  const selectEntity = useCallback(
    (e) => {
      const { name, checked } = e.target;

      const tempEntity =
        name === "allSelect"
          ? entities.map((entity) => ({ ...entity, isChecked: checked }))
          : entities.map((entity) =>
              entity_id(entity) === name
                ? { ...entity, isChecked: checked }
                : entity,
            );

      setEntities(tempEntity);
    },
    [entities],
  );

  const groupedEntities = useMemo(() => {
    const groups = {};

    entities.forEach((entity) => {
      const key = keyColumns.map((col) => entity[col] || "N/A").join("_");

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(entity);
    });

    return groups;
  }, [entities]);

  const toggleGroup = (groupKey) => {
    if (expandedGroups.includes(groupKey)) {
      setExpandedGroups(expandedGroups.filter((key) => key !== groupKey));
    } else {
      setExpandedGroups([...expandedGroups, groupKey]);
    }
  };

  if (columns) {
    return (
      <div className="datatable">
        <h2>Filtered metadata</h2>
        <div
          style={{
            maxHeight: "80vh",
            maxWidth: "80vw",
            overflowY: "auto",
            overflowX: "auto",
            border: "1px solid #ddd",
          }}
        >
          <Table hover size="10" style={{ marginBottom: 0 }}>
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#fff",
                zIndex: 1,
              }}
            >
              <tr key="h">
                <th>
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    name="allSelect"
                    onChange={selectEntity}
                  />
                </th>
                <th></th>
                <th># metadata</th>
                {keyColumns.map((col) => (
                  <th key={col}>{col} ({distinctCounts[col] || 0})</th>
                ))}
                {columns
                  .filter((column) => !keyColumns.includes(column))
                  .map((column) => (
                    <th key={column}>{column} ({distinctCounts[column] || 0})</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedEntities).map((groupKey) => {
                const isExpanded = expandedGroups.includes(groupKey);
                const groupEntities = groupedEntities[groupKey];
                const groupEntity = groupEntities[0];
                const allChecked = groupEntities.every((e) => e.isChecked);
                const someChecked = groupEntities.some((e) => e.isChecked);

                return (
                  <React.Fragment key={groupKey}>
                    {/* Group Header Row */}
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <td>
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          name={`group_${groupKey}`}
                          checked={allChecked}
                          indeterminate={someChecked && !allChecked ? true : undefined}
                          onChange={(e) => {
                            const { checked } = e.target;
                            const updated = entities.map((entity) =>
                              groupEntities.includes(entity)
                                ? { ...entity, isChecked: checked }
                                : entity,
                            );
                            setEntities(updated);
                          }}
                        />
                      </td>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => toggleGroup(groupKey)}
                        >
                          {isExpanded ? "−" : "+"}
                        </Button>
                      </td>
                      <td>{groupEntities.length}</td>
                      {keyColumns.map((col) => (
                        <td style={{ fontWeight: "bold" }}>
                          {groupEntity[col]}
                        </td>
                      ))}
                    </tr>

                    {/* Expanded Detail Rows */}
                    {isExpanded &&
                      groupEntities.map((row) => (
                        <tr
                          key={entity_id(row)}
                          style={{ backgroundColor: "#fafafa" }}
                        >
                          <td></td>
                          <td>
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              name={entity_id(row)}
                              checked={row?.isChecked || false}
                              onChange={selectEntity}
                            />
                          </td>
                          <td></td>
                          {keyColumns.map((col) => (
                            <td>{row[col]}</td>
                          ))}
                          {columns
                            .filter((column) => !keyColumns.includes(column))
                            .map((column) => (
                              <td>{row[column]}</td>
                            ))}
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
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
    if (query && query.length !== 0) {
      return (
        <div className="datatable">
          <h2>No data retrieved!</h2>
        </div>
      );
    }
  }
};

export default Datatable;
