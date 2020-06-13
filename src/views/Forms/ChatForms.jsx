import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';

import Checkbox from 'elements/CustomCheckbox/CustomCheckbox.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';
import{Redirect} from 'react-router-dom'
 
class ChatForms extends Component{
   
 state = {
     pseudo:'',
     goToChat:false
 }
 handleChange = event =>{
   
    const pseudo =event.target.value
    this.setState({pseudo})

 }

   handleSubmit = event=>{
       event.preventDefault()
       this.setState({goToChat:true})
   }

    render(){
        if(this.state.goToChat){
            return <Redirect push to={`/pseudo/${this.state.pseudo}`}/>
        }
        return (
            <div className="main-content">
                <Grid fluid>
                    <Row>
                     
                       
                        <Col md={12}>
                            <Form onSubmit={this.handleSubmit} >
                                <Card
                                    title={
                                        <legend>Chat</legend>
                                    }
                                    content={
                                        <div>
                                            <FormGroup controlId="formHorizontalRequiredText">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                 pseudo
                                                </Col>
                                                <Col sm={6}> 
                                                    <FormControl type="text" value={this.state.pseudo}  required 
                                                 onChange={this.handleChange}
                                                    
                                                    />
                                                   
                                                </Col>
                                            </FormGroup>
                                            
                                          
                                          
                                            
                                         
                                          
                                        </div>
                                    }
                                    ftTextCenter
                                    legend={
                                        <Button fill bsStyle="info" type="submit" >Submit</Button>
                                    }
                                />
                            </Form>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default ChatForms;
