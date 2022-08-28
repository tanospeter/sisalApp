import {useState, useEffect} from "react"
import './Datatable.css'
import {Table, Button, Container, Row, Input} from 'reactstrap'
import {utils, writeFile} from 'xlsx'


const Datatable = ({data}) => {  
  
  const [entity,setEntity] = useState([])
  const d = data
  
  let columns = data[0] && Object.keys(data[0])  
  
  const handleOnDownload = () => {
    var workBook = utils.book_new(),
    workSheet = utils.json_to_sheet(data)

    utils.book_append_sheet(workBook, workSheet, "Sheet1")

    writeFile(workBook, "EntityList.xlsx")
  }
 
  if (columns) {
    return (      
      <div className="datatable">
        <div>          
          <Table responsive={true} hover>
            <thead>
              <tr key="faszom"><th><Input 
                type="checkbox"
                onChange = { e => {
                  let checked = e.target.checked
                  setEntity(
                    d.map(data => {
                      data.select = checked
                      return data
                    })
                  )
                }} /></th>{data[0] && columns.map((heading) => <th>{heading}</th>)}</tr>
            </thead>
            <tbody>
              {data.map(row => <tr key={row.entity_id}><td>
                <Input 
                  onChange={event => {
                    let checked = event.target.checked;
                    setEntity(
                      d.map(data => {
                        if (row.entity_id === data.entity_id) {
                          data.select = checked;
                        }
                        return data;
                      })
                    );
                  }}
                  type="checkbox"
                  checked={d.select} 
                />
                </td> {columns.map(column => <td>{row[column]}</td>)}
              </tr>)}
            </tbody>
          </Table>
        </div>
        <div>
          <Button onClick={handleOnDownload}>
            Download Entity List
          </Button>
        </div>        
      </div>
    )      
  }  
}

export default Datatable