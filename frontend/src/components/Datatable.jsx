import React from "react";
import './Datatable.css'
import {Table} from 'reactstrap';

export default function Datatable({data}) {
  const tmp = "check"
  let columns = data[0] && Object.keys(data[0])  
  console.log(columns)
  return <Table>
    <thead>
      <tr>{data[0] && columns.map((heading) => <th>{heading}</th>)}</tr>
    </thead>
    <tbody>
      {data.map(row => <tr key={row.publication_doi}><td><input type="checkbox"/></td>
        {
          columns.map(column => <td>{row[column]}</td>)
        }
      </tr>)}
    </tbody>
  </Table>
}