import {useState, useEffect} from "react"
//import ChronoCheckboxes from "./ChronoCheckboxes"
import {Table, Button, Container, Row, Col, Input, Label, ButtonGroup, Collapse, CardBody, Card, Form,  FormGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormText} from 'reactstrap'
import {utils, writeFile} from 'xlsx'
import axios from 'axios'

/*
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
*/
const cn = [  
  {name:'lin_interp_age'},  
  {name:'lin_reg_age'},  
  {name:'Bchron_age'},
  {name:'Bacon_age'},
  {name:'OxCal_age'},
  {name:'copRa_age'},
  {name:'StalAge_age'}
]  

const Datatable = ({data, query, interpAgeFrom, interpAgeTo}) => {  
  
  const [entities,setEntities] = useState([])
  const [chronos,setChronos] = useState([cn]) 
  const [advancedFilter1, setAdvancedFilter1] = useState("")
  const [advancedFilter2, setAdvancedFilter2] = useState("")
  
  let columns = data[0] && Object.keys(data[0])  
  let d = data
  
  useEffect(() => {
    setChronos(cn)     
  }, [])  

  const handleOnDownload = (query, sql, title) => {
    if (query.length <= 30000) {
      var workBook = utils.book_new(),
      workSheet1 = utils.json_to_sheet(query),
      workSheet2 = utils.json_to_sheet(sql)
      utils.book_append_sheet(workBook, workSheet1, title)
      utils.book_append_sheet(workBook, workSheet2, 'SQL query')
      writeFile(workBook, `${title}.xlsx`)
    } else {
      alert("Download request denied! In the case of queries that result in a high number of samples > 30,000 lines could take up to multiple minutes. Therefore, for such tasks use the MySQL database or the flat csv files located https://researchdata.reading.ac.uk/256/. The SISAL App is limited to providing 30,000 lines of output. Another option is to reduce the number of selected entities in the Filtered metadata list, or move to the Advanced querying to narrow the output.")
    }
    
  }

  const dowloadEntities = () => { 
    let selectedEntites = entities.filter((e) => e.isChecked === true)
    if (selectedEntites.length !== 0) {
      handleOnDownload(selectedEntites, [{sql:query}], "EntityList")  
    } else {
      alert("Download request denied! Please select at least one entity!")
    }
    
  }

  const dowloadDating = () => {
    let selectedEntites = entities.filter((e) => e.isChecked === true)

    if (selectedEntites.length !== 0) {
      
      axios.post(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_SERVER_API}/getdatinginfo`, {        
        
        entity_ids:selectedEntites.map((e) => { return e.entity_id})       
      
      }).then((response) => {          
        //console.log(response.data.sisalChronos)  
        handleOnDownload(response.data.dating, [{sql:response.data.sql}], "DatingInfo")              
      
      }).catch(error => console.log(error))

    } else {
      
      alert("Download request denied! Please select at least one entity!")

    }
  }

  const dowloadChrono = () => {
    let selectedChronos = chronos.filter((e) => e.isChecked === true && e.name !== "SISAL chronology")
    let selectedEntites = entities.filter((e) => e.isChecked === true)
    //console.log({selectedChronos, selectedEntites})

    if (selectedChronos.length !== 0 && selectedEntites.length !== 0){
      
      axios.post(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_SERVER_API}/getsisalchrono`, {
        
        entity_ids:selectedEntites.map((e) => { return e.entity_id}),
        chronos:selectedChronos.map((c) => { return c.name}),
        age: [interpAgeFrom, interpAgeTo]   
      }).then((response) => {          
        //console.log(response.data.sisalChronos)  
        handleOnDownload(response.data.sisalChronos, [{sql:response.data.sql}], "SampleData")              
      
      }).catch(error => console.log(error))

    } else {
      
      alert("Download request denied! Please select at least one entity AND one sisal chronology!")
    
    }

  }

  const downloadAdvRes = () => {
    let selectedEntity_ids = entities.filter((e) => e.isChecked === true).map((e) => {return e.entity_id})    
    let minDate = advancedFilter1
    let maxGap = advancedFilter2
    let selectedChrono = dropdownState
    let selectedInterpAgeRange = [interpAgeFrom, interpAgeTo]
    console.log({selectedEntity_ids, minDate, maxGap, selectedChrono, selectedInterpAgeRange})
    if (selectedEntity_ids.length === 0) {
      alert("Download request denied! Please select at least one entity!")
    }
    else if (maxGap.length !==0 && selectedChrono === 'Select a chronology' ){
      alert("Download request denied! Please select a chronology or Leave this field blank if you don't want to use 'Advanced query filter 2'!")
    }
    else if (selectedInterpAgeRange[0] > selectedInterpAgeRange[1]) {
      alert("Download request denied! Filter type 3 (interp_age) younger > older!")
    }
    else {
      axios.post(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_SERVER_API}/getAdvancedRes`, {        
        
        params:{selectedEntity_ids, minDate, maxGap, selectedChrono, selectedInterpAgeRange}       
      
      }).then((response) => {          
        console.log(response.data)  
        if (response.data.chrono.length <= 30000) {
          var workBook = utils.book_new(),        
          workSheet0 = utils.json_to_sheet([{reportInfo:response.data.reportInfo}]),
          workSheet1 = utils.json_to_sheet(response.data.entityFiltered),
          workSheet2 = utils.json_to_sheet(response.data.datingFiltered),
          workSheet3 = utils.json_to_sheet(response.data.chronoFiltered),
          workSheet4 = utils.json_to_sheet([
            {
              sqlEntity:response.data.sqlFiltered.sqlEntity,
              sqlDating:response.data.sqlFiltered.sqlDating,
              sqlChrono:response.data.sqlFiltered.sqlChrono
            }
          ]),
          workSheet5 = utils.json_to_sheet(response.data.entity),
          workSheet6 = utils.json_to_sheet(response.data.dating),
          workSheet7 = utils.json_to_sheet(response.data.chrono),
          workSheet8 = utils.json_to_sheet([
            {
              sqlEntity:response.data.sql.sqlEntity,
              sqlDating:response.data.sql.sqlDating,
              sqlChrono:response.data.sql.sqlChrono
            }
          ])
          
          utils.book_append_sheet(workBook, workSheet0, 'reportInfo')
          utils.book_append_sheet(workBook, workSheet1, 'entityAdvFiltered')
          utils.book_append_sheet(workBook, workSheet2, 'datingAdvFiltered')
          utils.book_append_sheet(workBook, workSheet3, 'chronoAdvFiltered')
          utils.book_append_sheet(workBook, workSheet4, 'SQLsAdvFiltered')
          utils.book_append_sheet(workBook, workSheet5, 'entity')
          utils.book_append_sheet(workBook, workSheet6, 'dating')
          utils.book_append_sheet(workBook, workSheet7, 'chrono')
          utils.book_append_sheet(workBook, workSheet8, 'SQLs')

                
          writeFile(workBook, `advancedRes.xlsx`) 
        } else {
          alert("Download request denied! In the case of queries that result in a high number of samples > 30,000 lines could take up to multiple minutes. Therefore, for such tasks use the MySQL database or the flat csv files located https://researchdata.reading.ac.uk/256/. The SISAL App is limited to providing 30,000 lines of output. Another option is to reduce the number of selected entities in the Filtered metadata list, or move to the Advanced querying to narrow the output.")
        }
                   
      
      }).catch(error => console.log(error))
    } 
  }

  const comparePropsAndHook = () => {
    let entitiesFromData = d.map((entity) => {
      return entity.entity_id
    })
    let entitiesFromEntitiesHook = entities.map((entity) => {
      return entity.entity_id
    })
    
    return entitiesFromData.toString() === entitiesFromEntitiesHook.toString()
  }

  // Entity selector function for 'Filtered metadata' section 
  const selectEntity = (e) => {
    const {name, checked} = e.target
    //console.log(name, checked)  
    const isIdentical = comparePropsAndHook()
    if (!isIdentical) { 
      // prop and hook are not identical     
      if (name === 'allSelect') {      
        let tempEntity = d.map((entity) => {        
          return {...entity, isChecked:checked}
        })        
        setEntities(tempEntity)         
      } else {
        let tempEntity = d.map((entity) => 
          //console.log(typeof entity.entity_id.toString(), typeof name, entity.entity_id == name) // true
          entity.entity_id.toString() === name ? {...entity, isChecked:checked} : entity
        )
        //console.log(tempEntity.entity_id)         
        setEntities(tempEntity)        
      }
    } else {
      //prop and hook are identical
      if (name === 'allSelect') {      
        let tempEntity = entities.map((entity) => {        
          return {...entity, isChecked:checked}
        })        
        setEntities(tempEntity)         
      } else {
        let tempEntity = entities.map((entity) => 
          //console.log(typeof entity.entity_id.toString(), typeof name, entity.entity_id == name) // true
          entity.entity_id.toString() === name ? {...entity, isChecked:checked} : entity
        )         
        //console.log(tempEntity.entity_id)
        setEntities(tempEntity)        
      }
    }
    
  }
  
  // Checkbox handling function for 'Select chronos' section
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

  // Colapsed filed
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  // handling dropdown controller  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownState, setDropdownState] = useState('Select a chronology')
  const toggleDropdown = () => setDropdownOpen(prevState => !prevState)
  
  const cnAdv = ['Original author chronology','lin_interp_age','lin_reg_age','Bchron_age','Bacon_age','OxCal_age','copRa_age','StalAge_age']

  if (columns) { 
    const isIdentical = comparePropsAndHook()   
    if (!isIdentical) {
      return (            
        <div className="datatable">
          <h2>Filtered metadata</h2>
          <div>          
            <Table responsive hover size="10">
              <thead>
                <tr key="f"><th><Input 
                  type="checkbox"
                  className="form-check-input"
                  name="allSelect"
                  onChange = {selectEntity} />
                </th>{d[0] && columns.map((heading) => <th>{heading}</th>)}</tr>
              </thead>
              <tbody>
                {
                  d.map(row => <tr key={row.entity_id}><td>
                    <Input 
                      type="checkbox"
                      className="form-check-input"
                      name={row.entity_id}
                      checked={row?.isChecked || false} 
                      onChange={selectEntity}                  
                    /></td> {columns.map(column => <td>{row[column]}</td>)}
                  </tr>)              
                }
              </tbody>
            </Table>
          </div>
          <div className="box">
            <h2>Select chronos</h2>
            <p>The original author chronology is included in every case. SISAL chronologies can also be selected from below.</p>
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
                onClick={dowloadEntities}
              >
                Download meta data
              </Button>
              <Button
                color="primary"
                outline 
                onClick={dowloadDating}
              >
                Download dating information
              </Button>
              <Button 
                color="primary"
                onClick={dowloadChrono}
              >
                Download Sample data (choosen chronology)
              </Button>
            </ButtonGroup>
          </div>
          <div className="box">
            <Button color="link" onClick={toggle} style={{ marginBottom: '1rem' }}>
              Advanced Query Parameters
            </Button>
            <Collapse isOpen={isOpen}>
              <Card>
                <CardBody>                  
                  <Form inline>
                    <Row>
                      <Col>
                        <h5 className="filterTitle">Advanced query filter 1</h5>                                                                 
                        <FormGroup floating>
                          <Input
                            id="AdvQueryFilterDatingInformation"
                            name="AdvQueryFilterDatingInformation"
                            placeholder="Min number of radoimetric date"                            
                            onChange={(event)=>{
                              if(isNaN(event.target.value)){
                                alert('"Advanced query filter 1" got NaN value. Please enter a natural number!')
                                event.target.value=''
                              }
                              else {setAdvancedFilter1(event.target.value)}                              
                            }}
                          />
                          <Label for="Min number of radoimetric date">
                            At least n radiometric dates in each and every entity (numeric)
                          </Label>
                          <FormText>
                            NOTE: Leave this field blank if you do not want to use this filter!
                          </FormText>              
                        </FormGroup>                        
                      </Col>  
                      <Col></Col>                                 
                    </Row>
                    <Row>
                      <h5 className="filterTitle">Advanced query filter 2</h5>
                      <Col>                          
                        <FormGroup floating>
                          <Input
                            id="AdvQueryFilterChronoGap"
                            name="AdvQueryFilterChronoGap"
                            placeholder="Max gap in chrono"                            
                            onChange={(event)=>{
                              if(isNaN(event.target.value)){
                                alert('"Advanced query filter 2" got NaN value. Please enter a natural number!')
                                event.target.value=''
                              }
                              else {setAdvancedFilter2(event.target.value)}
                            }}
                          />
                          <Label for="Max gap in chrono">
                            Max gap in the chosen chronology (numeric)
                          </Label>
                          <FormText>
                            NOTE: Leave this field blank if you do not want to use this filter!
                          </FormText>                
                        </FormGroup>
                      </Col>
                      <Col>                          
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} direction='right' size='lg'>
                          <DropdownToggle caret>{dropdownState}</DropdownToggle>
                          <DropdownMenu>                            
                            <DropdownItem header>Select a chronology</DropdownItem>
                            {cnAdv.map((c) => {return <DropdownItem onClick={() => setDropdownState(c)}>{c}</DropdownItem> })}
                          </DropdownMenu>
                        </Dropdown>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button 
                          color="primary"                          
                          onClick={downloadAdvRes}
                        >
                          Download advanced result
                        </Button>
                      </Col>
                      <Col>
                      </Col>                      
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Collapse>
          </div>        
        </div>
      ) 
    } else {
      
       return (            
        <div className="datatable">
          <h2>Filtered metadata</h2>
          <div>          
            <Table responsive hover size="10">
              <thead>
                <tr key="f"><th><Input 
                  type="checkbox"
                  className="form-check-input"
                  name="allSelect"
                  onChange = {selectEntity} />
                </th>{d[0] && columns.map((heading) => <th>{heading}</th>)}</tr>
              </thead>
              <tbody>
                {
                  entities.map(row => <tr key={row.entity_id}><td>
                    <Input 
                      type="checkbox"
                      className="form-check-input"
                      name={row.entity_id}
                      checked={row?.isChecked || false} 
                      onChange={selectEntity}                  
                    /></td> {columns.map(column => <td>{row[column]}</td>)}
                  </tr>)              
                }
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
                className="downloadMetaDataBtn"                 
                color="primary"
                outline
                onClick={dowloadEntities}
              >
                Download meta data
              </Button>
              <Button
                color="primary"
                outline 
                onClick={dowloadDating}
              >
                Download dating information
              </Button>
              <Button 
                color="primary"
                onClick={dowloadChrono}
              >
                Download Sample data (choosen chronology)
              </Button>
            </ButtonGroup>            
          </div> 
          <div className="box">
            <Button color="link" onClick={toggle} style={{ marginBottom: '1rem' }}>
              Advanced Query Parameters
            </Button>
            <Collapse isOpen={isOpen}>
              <Card>
                <CardBody>                  
                  <Form inline>
                    <Row>
                      <Col>
                        <h5 className="filterTitle">Advanced query filter 1</h5>                                                                 
                        <FormGroup floating>
                          <Input
                            id="AdvQueryFilterDatingInformation"
                            name="AdvQueryFilterDatingInformation"
                            placeholder="Min number of radoimetric date"                            
                            onChange={(event)=>{
                              if(isNaN(event.target.value)){
                                alert('"Advanced query filter 1" got NaN value. Please enter a natural number!')
                                event.target.value=''
                              }
                              else {setAdvancedFilter1(event.target.value)}                              
                            }}
                          />
                          <Label for="Min number of radoimetric date">
                            At least n radiometric dates in each and every entity (numeric)
                          </Label>
                          <FormText>
                            NOTE: Leave this field blank if you do not want to use this filter!
                          </FormText>              
                        </FormGroup>                        
                      </Col>  
                      <Col></Col>                                 
                    </Row>
                    <Row>
                      <h5 className="filterTitle">Advanced query filter 2</h5>
                      <Col>                          
                        <FormGroup floating>
                          <Input
                            id="AdvQueryFilterChronoGap"
                            name="AdvQueryFilterChronoGap"
                            placeholder="Max gap in chrono"                            
                            onChange={(event)=>{
                              if(isNaN(event.target.value)){
                                alert('"Advanced query filter 2" got NaN value. Please enter a natural number!')
                                event.target.value=''
                              }
                              else {setAdvancedFilter2(event.target.value)}
                            }}
                          />
                          <Label for="Max gap in chrono">
                            Max gap in the chosen chronology (numeric)
                          </Label>
                          <FormText>
                            NOTE: Leave this field blank if you do not want to use this filter!
                          </FormText>                
                        </FormGroup>
                      </Col>
                      <Col>                          
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} direction='right' size='lg'>
                          <DropdownToggle caret>{dropdownState}</DropdownToggle>
                          <DropdownMenu>                            
                            <DropdownItem header>Select a chronology</DropdownItem>
                            {cnAdv.map((c) => {return <DropdownItem onClick={() => setDropdownState(c)}>{c}</DropdownItem> })}
                          </DropdownMenu>
                        </Dropdown>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button 
                          color="primary"                          
                          onClick={downloadAdvRes}
                        >
                          Download advanced result
                        </Button>
                      </Col>
                      <Col>
                      </Col>                      
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Collapse>
          </div>       
        </div>
      )
    }    
  }  
}

export default Datatable
