import React, { useState } from 'react';
import {
  Collapse,  
  DropdownToggle,
  DropdownMenu,
  DropdownItem  
} from 'reactstrap';

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
                            NOTE: Leave blank this field if you don't want to use this filter!
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
                            NOTE: Leave blank this field if you don't want to use this filter!
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