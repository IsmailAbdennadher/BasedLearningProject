import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import Card from '../../components/Card/Card.jsx';

import {
    Switch,
    Route,
    Redirect,
    NavLink,
    BrowserRouter as Router
} from 'react-router-dom';

// react component that creates a dropdown menu for selection
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import Checkbox from '../../elements/CustomCheckbox/CustomCheckbox.jsx';
import Button from '../../elements/CustomButton/CustomButton.jsx';

class GetSujetsEquipe extends Component{
    constructor(props){
        super(props);
        this.vForm = this.refs.vForm;
        this.state = {
            // Type
            niveau: "",
            nomEquipeError: "",
            multipleSelect:null,
            selectedClasse:null,
            classes:[],
            membres:[],
            limit:null, // a definir /* */
            equipes:[]
        }
        this.getClasses();
        
    }
    async getClasses(){
        await fetch("http://localhost:4000/events/"+localStorage.projet)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(projet => {
                   this.setState({niveau:projet.projet.niveau_concerne});
              })
              .catch(error => {
                this.handleError(error);
              });
        return fetch("http://localhost:4000/users/classepar/"+this.state.niveau)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(etudiant => {
                  etudiant.map((prop,key) => this.state.classes.push({value:prop,label:prop}));
              })
              .catch(error => {
                this.handleError(error);
              });
    }
    handleResponseError(response) {
      throw new Error("HTTP error, status = " + response.status);
  }
  handleError(error) {
      console.log(error.message);
  }
    async formerEquipe(){
        await fetch("http://localhost:4000/equipes/equipes/"+this.state.selectedClasse.value)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(equipe => {
                  console.log(equipe);
                  this.setState({equipes:equipe});
                  localStorage.setItem('equipes',JSON.stringify(this.state.equipes));
              })
              .catch(error => {
                this.handleError(error);
              });
              //console.log('ess'+localStorage.getItem('equipes'));
        this.props.history.push({pathname:"/tables/EquipesChoix",state:{equipes:this.state.equipes}});
    }
    render(){
        return (
            <div className="main-content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                                <Card
                                    title={
                                        <legend>Former les equipes aleatoirement</legend>
                                    }
                                    content={
                                        <div>
                                            <FormGroup controlId="formHorizontalNumber">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Classe
                                                </Col>
                                                <Col sm={6}>
                                                <Select
                                                    placeholder="Single Select"
                                                    name="singleSelect"
                                                    
                                                    value={this.state.selectedClasse}
                                                    options={this.state.classes}
                                                    onChange={(value) => {this.setState({selectedClasse:value});} }
                                                />
                                            </Col>
                                            </FormGroup>
                                        </div>
                                    }
                                    ftTextCenter
                                    legend={
                                        <Button fill bsStyle="info" onClick={this.formerEquipe.bind(this)}>Valider</Button>
                                    }
                                />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default GetSujetsEquipe;
