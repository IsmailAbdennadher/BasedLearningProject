import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import {
  
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

// react component used to create charts
import ChartistGraph from 'react-chartist';
// function that returns a color based on an interval of numbers
import { scaleLinear } from "d3-scale";
import Message from 'views/Forms/Message.jsx';
// react components used to create a SVG / Vector map
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from "react-simple-maps";

import Card from 'components/Card/Card.jsx';
import StatsCard from 'components/Card/StatsCard.jsx';
import Tasks from 'components/Tasks/Tasks.jsx';

import {
    dataPie,
    dataSales,
    optionsSales,
    responsiveSales,
    dataBar,
    optionsBar,
    responsiveBar,
    table_data
} from 'variables/Variables.jsx';

const colorScale = scaleLinear()
.domain([0, 1, 6820])
.range(["#E5E5E5", "#B2B2B2", "#000000"]);

class Test extends Component{
   
  
    state ={
        message:'',
        length: this.props.length
        
    }
     
    createMessage = () => {
           
        const {addMessage,pseudo,length}  = this.props

        const message={
            pseudo,
            message: this.state.message
        }

        addMessage(message)

        //reset

        this.setState({ message:'',length})
    }


    handleSubmit= event=>{
        event.preventDefault()
        this.createMessage()
    }
    handleChange= event=>{
        const  message=event.target.value
       const length = this.props.length - message.length
        this.setState({message,length})
    }
    handleKeyUp = event => {
        if (event.key === 'Enter'){

            this.createMessage()
        }
        
    }
   
    render(){
    
        return (
            <div className="main-content">
                <Grid fluid>
                    <Row>
                    <Col md={12}>
                    
                                <Card
                                    title={
                                        <legend>Chat</legend>
                                       
                                    }
                                    content={
                                        
                                    
                                        <form className='form' 
                                        onSubmit={this.handleSubmit}
                                         >
                                             
                                             
                                              <textarea   
                                              
                                              value={this.state.message}
                                              onChange={this.handleChange}
                                              onKeyUp={this.handleKeyUp}
                                              required
                                              maxLength={this.props.length}
                                                />
                                              <div className='info'>
                                                  { this.state.length }
                                                
                                                  
                                              </div>
                                              <button type='submit'>
                                              Envoyer!
                                              </button>
                                             
                                              </form>  
                                    
                                    }
                                  
                                />
                          
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Test;
