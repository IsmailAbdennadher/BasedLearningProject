import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';

import SweetAlert from 'react-bootstrap-sweetalert';

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

import Checkbox from 'elements/CustomCheckbox/CustomCheckbox.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';

class AffectationChoixEquipe extends Component{
    constructor(props){
        super(props);
        this.vForm = this.refs.vForm;
        this.state = {
            // Type
            nomEquipe: "",
            nomEquipeError: "",
            selectedClasse:null,
            classes:[],
            count:0, // a definir /* */
            idEquipes:[],
            equipes:[],
            alert: null,
            show: false
        }
        this.getEtudiants();
        
    }
    getEtudiants(){
        return fetch("http://localhost:4000/users/classe/tout")
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
    dangerAlert(title,motif){
        this.setState({
            alert: (
                <SweetAlert
                    danger
                    style={{display: "block",marginTop: "-100px"}}
                    title={title}
                    onConfirm={() => this.props.history.push("/forms/Listesujetsprojets")}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    {motif}
                </SweetAlert>
            )
        });
    }
    hideAlert(){
        this.setState({
            alert: null
        });
    }
    handleResponseError(response) {
      throw new Error("HTTP error, status = " + response.status);
  }
  handleError(error) {
      console.log(error.message);
  }
    async AffecterChoixEquipe(){
        await fetch("http://localhost:4000/sujets/affecter/aleatoire", {   
              method: "POST",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json"
                },
              body: JSON.stringify({ listEquipes: this.state.idEquipes }) 
            })
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                console.log('ici');
                console.log(response);
                return response.json();
              }).then(equipe => {
                  if(equipe.erreurmsg){
                      this.dangerAlert(equipe.erreurmsg,equipe.motif);
                  }
                  else{
                      this.setState({equipes:equipe});
                  localStorage.setItem('equipes',JSON.stringify(this.state.equipes));
                  this.props.history.push({pathname:"/tables/EquipesChoix",state:{equipes:this.state.equipes}});
                  }
                  
              })
              .catch(error => {
                this.handleError(error);
              });
              //console.log('success'+localStorage.getItem('equipes'));
        
    }
    checkTeams(classe){
        this.state.idEquipes=[];
        return fetch("http://localhost:4000/equipes/equipes/"+classe)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(etudiant => {
                  etudiant.map((prop,key) => {this.state.idEquipes.push(prop._id)});
                  etudiant.map((prop,key) => this.state.count+=prop.membres.length);
                  this.setState({equipes:etudiant});
                  console.log(this.state.count);
                  console.log(this.state.idEquipes);
              })
              .catch(error => {
                this.handleError(error);
              });
    }
    render(){
        return (
            <div className="main-content">
            {this.state.alert}
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Form horizontal>
                                <Card
                                    title={
                                        <legend>Affecter Choix Sujets aux Equipes</legend>
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
                                                    onChange={(value) => {this.setState({selectedClasse:value});
                                                    console.log("f "+value.value);
                                                        this.checkTeams(value.value);} }
                                                />
                                            </Col>
                                            </FormGroup>
                                        </div>
                                    }
                                    ftTextCenter
                                    legend={
                                        <Button fill bsStyle="info" onClick={this.AffecterChoixEquipe.bind(this)}>Valider</Button>
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

export default AffectationChoixEquipe;
