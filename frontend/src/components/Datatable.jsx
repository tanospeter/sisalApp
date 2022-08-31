import {useState, useEffect} from "react"
//import ChronoCheckboxes from "./ChronoCheckboxes"
import {Table, Button, Container, Row, Col, Input, Label, ButtonGroup} from 'reactstrap'
import {utils, writeFile} from 'xlsx'

const cn = [
  {name:'SISAL chronology'},
  {name:'lin_interp_age'},
  {name:'lin_interp_age_uncert_pos'},
  {name:'lin_interp_age_uncert_neg'},
  {name:'lin_reg_age'},
  {name:'lin_reg_age_uncert_pos'},
  {name:'lin_reg_age_uncert_neg'},   
  {name:'Bchron_age'},
  {name:'Bchron_age_uncert_pos'},
  {name:'Bchron_age_uncert_neg'},
  {name:'Bacon_age'},
  {name:'Bacon_age_uncert_pos'},
  {name:'Bacon_age_uncert_neg'},
  {name:'OxCal_age'},
  {name:'OxCal_age_uncert_pos'},
  {name:'OxCal_age_uncert_neg'},
  {name:'copRa_age'},
  {name:'copRa_age_uncert_pos'},
  {name:'copRa_age_uncert_neg'},
  {name:'StalAge_age'},
  {name:'StalAge_age_uncert_pos'},
  {name:'StalAge_age_uncert_neg'}
]  

const Datatable = ({data}) => {  
  
  const [entitys,setEntitys] = useState([])
  const [chronos,setChronos] = useState([cn])
  //const [selected,setSelected] = useState([])
  const d = data
  
  let columns = data[0] && Object.keys(data[0])  
  
  useEffect(() => {
    setChronos(cn)
  }, [])
  

  const handleOnDownload = () => {
    var workBook = utils.book_new(),
    workSheet = utils.json_to_sheet(data)

    utils.book_append_sheet(workBook, workSheet, "Sheet1")

    writeFile(workBook, "EntityList.xlsx")
  }

  const handleChange = (e) => {
    const {name, checked} = e.target    
    if (name === 'allSelect') {
      let tempChrono = chronos.map((chrono) => {
        return {...chrono, isChecked:checked}
      })
      setChronos(tempChrono)
    } else {
      let tempChrono = chronos.map((chrono) =>
        chrono.name === name ? {...chrono, isChecked:checked} : chrono
      ) 
      setChronos(tempChrono)
    }     
  }

  /*
  const test = () => {
    let selected = entitys.filter(e => {
      return e.select === true      
    })
    selected = selected.map(e => {
      return e.entity_id
    })
    alert (selected)
  }
  */
 
  if (columns) {
    return (            
      <div className="datatable">
        <h2>Filtered metadata</h2>
        <div>          
          <Table responsive hover size="10">
            <thead>
              <tr key="faszom"><th><Input 
                type="checkbox"
                onChange = { e => {
                  let checked = e.target.checked
                  setEntitys(
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
                    setEntitys(
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
        <div className="box">
          <h2>Select chronos</h2>
          <Container>
            <Row>
              <Col sm="4" xs="6">
                <div className="form-check">
                  <Input 
                    type="checkbox"                   
                    className="form-check-input"
                    name="allSelect"
                    onChange={handleChange} 
                  />          
                  <Label>Select all</Label>        
                </div>
              </Col> 
              {
                chronos.map(n =>  
                  <Col sm="4" xs="6">
                    <div className="form-check">
                      <Input 
                        type="checkbox" 
                        className="form-check-input" 
                        name={n.name} 
                        checked={n?.isChecked || false} 
                        onChange={handleChange}
                      />          
                      <Label>{n.name}</Label>        
                    </div>
                  </Col>                  
                )
              }
            </Row>            
          </Container>          
        </div>
        <div>
          <ButtonGroup>
            <Button 
              color="primary"
              outline
              onClick={handleOnDownload}
            >
              Download meta data
            </Button>
            <Button
              color="primary"
              outline 
              onClick={handleOnDownload}
            >
              Download dating information
            </Button>
            <Button 
              color="primary"
              onClick={handleOnDownload}
            >
              Download Sample data (choosen chronology)
            </Button>
          </ButtonGroup>
        </div>        
      </div>
    )      
  }  
}

export default Datatable