import React, { Component,Fragment } from 'react';
import {
    Grid, Row, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import Card from '../../components/Card/Card.jsx';

import SweetAlert from 'react-bootstrap-sweetalert';


import { NavLink,withRouter } from 'react-router-dom';

import Checkbox from '../../elements/CustomCheckbox/CustomCheckbox.jsx';
import Button from '../../elements/CustomButton/CustomButton.jsx';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SujetEdit extends Component{
    constructor(props){
        super(props);
        this.vForm = this.refs.vForm;
        this.hideAlert = this.hideAlert.bind(this);
        this.state = {
            // Register
            titre: "",
            description: "",
            type: null, //select box
            accepte: false,
            titreError: null,
            nbrEquipeParProjet:null,
            nbrEquipeParProjetError:null,
            descriptionError: null,
            alert: null,
            show: false,
            selectOptions:[{value:'web-plateforme',label:'web-plateforme'},{value:'app mobile',label:'app mobile'},{value:'pi-Bi',label:'pi-Bi'}
            ],
        }
    }
    successAlert(){
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{display: "block",marginTop: "-100px"}}
                    title="Sujet mis à jour!"
                    onConfirm={() => this.props.history.push("/forms/Listesujets")}
                    onCancel={() => this.hideAlert()}
                   
                >
                    Votre sujet a été mis à jour!

                </SweetAlert>
            )
        });
    }
    hideAlert(){
        this.setState({
            alert: null
        });
    }
    componentDidMount(){
        console.log('id='+this.props.match.params.id);
        fetch("http://localhost:5000/sujets/"+this.props.match.params.id)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(sujet => {
                  this.setState({titre: sujet.titre,description: sujet.description,type:{value:sujet.type,label:sujet.type},accepte:sujet.accepte,nbrEquipeParProjet:sujet.nbrEquipeParProjet});
              })
              .catch(error => {
                this.handleError(error);
              });

    }
    handleTypeValidation(e){
        var digitRex = /^\d+$/;
        digitRex.test(this.state.nbrEquipeParProjet) === false ? this.setState({ nbrEquipeParProjetError: (<small className="text-danger">Nombre d'equipe par sujet doit etre un nombre.</small>) }):this.setState({ nbrEquipeParProjetError: null });
        var descriptionRex = /[-a-zA-Z:%&?!=//\s]{10,}$/;
        descriptionRex.test(this.state.description) === false ? this.setState({ descriptionError: (<small className="text-danger">La description est obligatoire et doit etre de longueur 10 min.</small>) }):this.setState({ descriptionError: null });
        var titreRex = /[-a-zA-Zéçà0-9]+$/;
        titreRex.test(this.state.titre) === false ? this.setState({ titreError: (<small className="text-danger">Le titre est obligatoire.</small>) }):this.setState({ titreError: null });
        this.state.nomEquipe === "" ? this.setState({ nomEquipeError: (<small className="text-danger">Nom Equipe est obligatoire.</small>) }):this.setState({ nomEquipeError: null });
        if(descriptionRex.test(this.state.description)&&titreRex.test(this.state.titre)&&digitRex.test(this.state.nbrEquipeParProjet)){
            e.preventDefault();
            console.log('updating...');
            return fetch("http://localhost:5000/sujets/update/"+this.props.match.params.id, {
              method: "POST",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json"
                },
              body: JSON.stringify({ titre: this.state.titre,description:this.state.description,type:this.state.type.value,nbrEquipeParProjet:this.state.nbrEquipeParProjet })
            })
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                this.successAlert();
                return response.json();
              })
              .catch(error => {
                this.handleError(error);
              });
        }
        else{
            e.preventDefault();
        }
    }
    handleResponseError(response) {
      throw new Error("HTTP error, status = " + response.status);
      }
    handleError(error) {
          console.log(error.message);
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
                                        <legend>Proposer un sujet</legend>
                                    }
                                    content={
                                        <div>
                                            <FormGroup controlId="formHorizontalRequiredText">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Titre<small className="text-danger">*</small>
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="text" name="titre" value={this.state.titre} onChange={(event) => {
                                                        this.setState({titre: event.target.value});
                                                        event.target.value === "" ? this.setState({ type_textError: (<small className="text-danger">Text is required.</small>) }):this.setState({ type_textError: null });
                                                    }}/>
                                                    {this.state.type_textError}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalEmail">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Description <small className="text-danger">*</small>
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="textarea" value={this.state.description} name="description" onChange={(event) => {
                                                        this.setState({description: event.target.value});
                                                        var descriptionRex = /[-a-zA-Z:%&?!=//\s]{10,}$/;
                                                        descriptionRex.test(this.state.description) === false ? this.setState({ descriptionError: (<small className="text-danger">La description est obligatoire et doit etre de longueur 10 min.</small>) }):this.setState({ descriptionError: null });
                                                    }}/>
                                                    {this.state.descriptionError}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalNumber">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Type du sujet
                                                </Col>
                                                <Col sm={6}>
                                                <Select
                                                    placeholder="Single Select"
                                                    name="singleSelect"
                                                    value={this.state.type}
                                                    options={this.state.selectOptions}
                                                    onChange={(value) => {
                                                        this.setState({ type: value}) } }
                                                />
                                            </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalNumber">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Nombre d'equipe par sujet
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="number" name="nbrEquipeParProjet" value={this.state.nbrEquipeParProjet} onChange={(event) => {
                                                        this.setState({nbrEquipeParProjet: event.target.value});
                                                        var digitRex = /^\d+$/;
                                                        digitRex.test(event.target.value) === false ? this.setState({ nbrEquipeParProjetError: (<small className="text-danger">nbrEquipeParProjet has to be a number.</small>) }):this.setState({ nbrEquipeParProjetError: null });
                                                    }}/>
                                                    {this.state.nbrEquipeParProjetError}
                                                </Col>
                                            </FormGroup>
                                        </div>
                                    }
                                    ftTextCenter
                                    legend={
                                        <Button fill bsStyle="info" type="submit" onClick={this.handleTypeValidation.bind(this)}>Validate Inputs</Button>
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

export default SujetEdit;
