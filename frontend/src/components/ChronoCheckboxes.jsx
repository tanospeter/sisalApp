import {useState, useEffect} from "react"
import {Table, Button, ButtonGroup, Container, Row, Col, Input, FormGroup, Label} from 'reactstrap'

const ChronoCheckboxes = () => {
  
  
   
  
  const [cSelected, setCSelected] = useState([]); //Array(21).fill().map((element, index) => index + 0)

  useEffect(() => {
    let cSelected = Array(21).fill().map((element, index) => index + 0)
    setCSelected(cSelected)
  }, [])

  const onCheckboxBtnClick = (selected) => {
    const index = cSelected.indexOf(selected);
    if (index < 0) {
      cSelected.push(selected);
    } else {
      cSelected.splice(index, 1);
    }
    setCSelected([...cSelected]);
  }


  return (
    <Container>
      
      
      
    </Container>    
  )
}

export default ChronoCheckboxes

/*
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


  e => {
                  let checked = e.target.checked
                  setEntitys(
                    d.map(data => {
                      data.select = checked
                      return data
                    })
                  )
                }
*/


/*
  <Col>
                {
                  checkboxNames1.map(n =>  
                    
                      <div className="form-check">
                        <Input type="checkbox" className="form-check-input"/>          
                        <Label>{n.name}</Label>        
                      </div>
                    
                  )
                }
              </Col> 
              <Col>
                {
                  checkboxNames2.map(n =>  
                    
                      <div className="form-check">
                        <Input type="checkbox" className="form-check-input"/>          
                        <Label>{n.name}</Label>        
                      </div>
                    
                  )
                }
              </Col>   
              <Col>
                {
                  checkboxNames3.map(n =>  
                    
                      <div className="form-check">
                        <Input type="checkbox" className="form-check-input" name={n.name} onChange={handleChange}/>          
                        <Label>{n.name}</Label>        
                      </div>
                    
                  )
                }
              </Col>
*/

/*
  <FormGroup>
      <Label for="exampleSelectMulti">
        Select Multiple
      </Label>
      <Input
        id="exampleSelectMulti"
        multiple
        name="selectMulti"
        type="select"
      >
        <option selected>
          1
        </option>
        <option>
          2
        </option>
        <option>
          3
        </option>
        <option selected>
          4
        </option>
        <option>
          5
        </option>
      </Input>
    </FormGroup>
*/

/*
  <ButtonGroup vertical block = {false}>
      {chronoNames.map ( n => 
        <Button
        color="primary"
        outline
        onClick={() => onCheckboxBtnClick(chronoNames.indexOf(n))}
        active={cSelected.includes(chronoNames.indexOf(n))}>
          {n}
        </Button>
      )}
    </ButtonGroup>
*/