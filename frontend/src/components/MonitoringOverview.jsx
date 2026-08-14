import React from "react";
import { Table } from "reactstrap";

const formatDate = (value) => {
  if (!value) return "-";

  if (typeof value === "string") {
    return value.includes("T") ? value.slice(0, 10) : value;
  }

  return String(value);
};

const formatYears = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
};

const MonitoringOverview = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  const preferredOrder = [
    "data_type",
    "site_id",
    "site_name",
    "n_samples",
    "start_date",
    "end_date",
    "duration_years",
  ];

  const columns = preferredOrder.filter((key) =>
    Object.prototype.hasOwnProperty.call(data[0] || {}, key),
  );

  return (
    <div className="monitoring-overview" style={{ marginBottom: "1.5rem" }}>
      <h2>Monitoring duration overview</h2>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
        }}
      >
        <Table hover size="sm" style={{ marginBottom: 0 }}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#fff",
              zIndex: 1,
            }}
          >
            <tr>
              {columns.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={`${row.data_type}-${row.site_id}`}>
                {columns.map((key) => {
                  const value = row[key];

                  if (key === "start_date" || key === "end_date") {
                    return <td key={`${key}-${index}`}>{formatDate(value)}</td>;
                  }

                  if (key === "duration_years") {
                    return <td key={`${key}-${index}`}>{formatYears(value)}</td>;
                  }

                  return <td key={`${key}-${index}`}>{value ?? "-"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MonitoringOverview;
