import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';

import Checkbox from 'elements/CustomCheckbox/CustomCheckbox.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';
import{Redirect} from 'react-router-dom'


    const Message =({pseudo,message,isUser})=> {
        if(isUser(pseudo)){
            return (
                <p className='user-message'>
                    {message}
                
                </p>
                         )
        } else{
            return (
                <p className='not-user-message'>
                <strong>{pseudo}: </strong>    {message}
                
                </p>
                         )
        }

       
    }
   
export default Message


