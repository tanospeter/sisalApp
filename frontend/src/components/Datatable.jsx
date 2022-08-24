import {useState} from "react"
import './Datatable.css'
import {Table, Button, Container, Row, Input} from 'reactstrap'
import {utils, writeFile} from 'xlsx'
import Step1Screen from '../screens/Step1Screen'

const Datatable = ({data}) => {  
  
  let columns = data[0] && Object.keys(data[0])  
  
  const handleOnDownload = () => {
    var workBook = utils.book_new(),
    workSheet = utils.json_to_sheet(data)

    utils.book_append_sheet(workBook, workSheet, "Sheet1")

    writeFile(workBook, "EntityList.xlsx")
  }

  const selectAllEntity = () => {
    Step1Screen.setEntityList([])    
  }

  if (columns) {
    return (      
      <div className="datatable">
        <p>          
          <Table responsive={true} hover>
            <thead>
              <tr><th><Input type="checkbox" id="selectAllEntity" onChange={selectAllEntity} chec/></th>{data[0] && columns.map((heading) => <th>{heading}</th>)}</tr>
            </thead>
            <tbody>
              {data.map(row => <tr key={row.entity_id}><td><Input type="checkbox" id={row.entity_id} /></td>
                {
                  columns.map(column => <td>{row[column]}</td>)
                }
              </tr>)}
            </tbody>
          </Table>
        </p>
        <p>
          <Button
            onClick={handleOnDownload}
          >
            Download Entity List
          </Button>
        </p>        
      </div>
    )      
  }  
}

export default Datatable