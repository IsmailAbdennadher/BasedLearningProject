import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';

import SweetAlert from 'react-bootstrap-sweetalert';

import Checkbox from 'elements/CustomCheckbox/CustomCheckbox.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';
import Select from 'react-select';
import Datetime from 'react-datetime';
import 'react-select/dist/react-select.css';
import{
    anneeScolaire
} from 'variables/Variables.jsx';

class ProjetForms extends Component{
    constructor(props){
        super(props);
        this.vForm = this.refs.vForm;
        this.state = {
            // Register
            nom: "",
            description: "",
            categorie: null, //select box
            nomProjet: "",
            niveau:"",
            anneeScolaire:null,
            dateDebut:new Date(),
            dateFin: new Date(),
            nomError: null,
            nomProjetError:null,
            nbrEquipeParProjet:1,
            nbrEquipeParProjetError:null,
            descriptionError: null,
            alert: null,
            show: false,
            selectOptions:[{value:'web-plateforme',label:'web-plateforme'},{value:'app mobile',label:'app mobile'},{value:'pi-Bi',label:'pi-Bi'}
            ],
        }
        this.state.categorie=this.state.selectOptions[0];
    }
    successAlert(){
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{display: "block",marginTop: "-100px"}}
                    title="Projet modifié!"
                    onConfirm={() => this.props.history.push("/forms/Listeprojets")}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    Votre projet a été modifié avec succès!
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
        fetch("http://localhost:4000/events/"+this.props.match.params.id)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(projet => {
                  this.setState({nom: projet.nom,description: projet.description,categorie:{value:projet.categorie,label:projet.categorie},
                      nomProjet:projet.projet.nom,nbrEquipeParProjet:projet.projet.nbrEquipeMax,dateDebut: projet.dateDebut,dateFin:projet.dateFin,
                      anneeScolaire:projet.projet.anneeScolaire,niveau:projet.projet.niveau_concerne});
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
        this.state.nom === "" ? this.setState({ nomError: (<small className="text-danger">Nom d'evenement est obligatoire.</small>) }):this.setState({ nomError: null });
        //this.state.anneeScolaire !== null
        if(descriptionRex.test(this.state.description)&&digitRex.test(this.state.nbrEquipeParProjet)&&!(this.state.nom === "")&&!(this.state.nomProjet === "")
            &&!(this.state.niveau === "")&&!(this.state.anneeScolaire === null)){
            e.preventDefault();
  var projet={};
      projet.nom=this.state.nomProjet;
      projet.niveau_concerne= this.state.niveau;
      projet.nbrEquipeMax= this.state.nbrEquipeParProjet;
      projet.anneeScolaire=this.state.anneeScolaire;
            return fetch("http://localhost:4000/events/projets/update/"+this.props.match.params.id, {
              method: "POST",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json"
                },
              body: JSON.stringify({ nom: this.state.nom,description:this.state.description,nbrPlace:0,
                  categorie:this.state.categorie.value,dateDebut: new Date(this.state.dateDebut).toISOString(),
                   dateFin: new Date(this.state.dateFin).toISOString(),projet:projet })
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
            console.log('mat3adetch');
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
                                        <legend>Modifier un projet</legend>
                                    }
                                    content={
                                        <div>
                                            <FormGroup controlId="formHorizontalRequiredText">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Nom de l'evenement<small className="text-danger">*</small>
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="text" value={this.state.nom} name="nom" onChange={(event) => {
                                                        this.setState({nom: event.target.value});
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
                                                    Categorie
                                                </Col>
                                                <Col sm={6}>
                                                    <Select
                                                    placeholder="Categorie"
                                                    name="singleSelect"
                                                    value={this.state.categorie}
                                                    options={this.state.selectOptions}
                                                    onChange={(value) => { console.log(value);
                                                        this.setState({ categorie: value}) } }
                                                />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalDatePicker">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Date debut
                                                </Col>
                                                <Col sm={6}>
                                                <Datetime
                                                timeFormat={false}
                                                inputProps={{placeholder:"Date Picker Here"}}
                                                value={new Date(this.state.dateDebut)}
                                                onChange={(value) => {this.setState({dateDebut:value})}}
                                                />
                                            </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalDatePicker">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Date fin
                                                </Col>
                                                <Col sm={6}>
                                                <Datetime
                                                timeFormat={false}
                                                inputProps={{placeholder:"Date Picker Here"}}
                                                value={new Date(this.state.dateFin)}
                                                onChange={(value) => {this.setState({dateFin:value})}}
                                                />
                                            </Col>
                                            </FormGroup>
                                            <FormGroup>
                                            <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    <b>Projet:</b>
                                                </Col>
                                                </FormGroup>
                                            <FormGroup controlId="formHorizontalNumber">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Nom du projet
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="text" value={this.state.nomProjet} name="nomProjet" onChange={(event) => {
                                                        this.setState({nomProjet: event.target.value});
                                                        event.target.value === "" ? this.setState({ type_textError: (<small className="text-danger">Text is required.</small>) }):this.setState({ type_textError: null });
                                                    }}/>
                                                    {this.state.type_textError}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalNumber">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Niveau concerné
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="text" value={this.state.niveau} name="nomProjet" onChange={(event) => {
                                                        this.setState({niveau: event.target.value});
                                                        event.target.value === "" ? this.setState({ type_textError: (<small className="text-danger">Text is required.</small>) }):this.setState({ type_textError: null });
                                                    }}/>
                                                    {this.state.type_textError}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalNumber">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Membre max par equipe
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="number" value={this.state.nbrEquipeParProjet} name="nbrEquipeParProjet" onChange={(event) => {
                                                        this.setState({nbrEquipeParProjet: event.target.value});
                                                        var digitRex = /^\d+$/;
                                                        digitRex.test(event.target.value) === false ? this.setState({ nbrEquipeParProjetError: (<small className="text-danger">nbrEquipeParProjet has to be a number.</small>) }):this.setState({ nbrEquipeParProjetError: null });
                                                    }}/>
                                                    {this.state.nbrEquipeParProjetError}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalNumber">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Année Universitaire
                                                </Col>
                                                <Col sm={6}>
                                                    <Select
                                                    placeholder="Année Universitaire"
                                                    name="singleSelect"
                                                    value={this.state.anneeScolaire}
                                                    options={anneeScolaire}
                                                    onChange={(value) => { console.log(value);
                                                        this.setState({ anneeScolaire: value.value}) } }
                                                />
                                                </Col>
                                            </FormGroup>
                                        </div>
                                    }
                                    ftTextCenter
                                    legend={
                                        <Button fill bsStyle="info" type="submit" onClick={this.handleTypeValidation.bind(this)}>Modifier Projet</Button>
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

export default ProjetForms;
