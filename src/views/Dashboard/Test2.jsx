import React, { Component, createRef } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';


// function that returns a color based on an interval of numbers
import { scaleLinear } from "d3-scale";

import Message from 'views/Forms/Message.jsx';
import Test from 'views/Dashboard/Test.jsx';
//firebase
import base from 'Base/base.js'
import  'css/App.css'
import  'css/annimations.css'
//Animations
import{
    CSSTransition,
    TransitionGroup
} from 'react-transition-group'

const colorScale = scaleLinear()
.domain([0, 1, 6820])
.range(["#E5E5E5", "#B2B2B2", "#000000"]);

class Test2 extends Component{
     
    state={
        messages:{},
        pseudo:this.props.match.params.pseudo
    }

   // messagesRef = createRef()
  
    componentDidMount(){
        base.syncState('/',{
            context:this,
            state:'messages'
        })
    }
   /* componentDidUpdate(){
        const ref = this.messagesRef.current
        ref.scrollTop = ref.scrollHeight
    }
*/
    addMessage = message =>{

        const messages = {... this.state.messages}
        messages[`message-${Date.now()}`] = message 

        Object  
        .keys(messages)
        .slice(0, -10)
        .forEach(key =>{
            messages[key]=null
        })
        this.setState({messages})
    }

    isUser = pseudo => pseudo === this.state.pseudo
   
    render(){
        const messages = Object
        .keys(this.state.messages)
        .map(key =>(
           < CSSTransition
           timeout={200}
           classNames='fade'
           key={key}>
                 <Message
          
           isUser={this.isUser}
           message = {this.state.messages[key].message}
           pseudo = {this.state.messages[key].pseudo}></Message></CSSTransition>
          
        ))
   
        return (
            <div className="main-content">
                <Grid fluid>
                    <Row>
                    <Col md={12}>
                    
                    <div className='box'>
                        <div>
                            <div className='messages' ref={this.messagesRef}>
                                <TransitionGroup className='message'>
                                    { messages}

                                </TransitionGroup>

                            </div>
                        </div>
       <Test
       length={140}
       pseudo={this.state.pseudo}
       addMessage={this.addMessage}/>
                    </div>
                               
                          
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Test2;
