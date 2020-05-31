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
import 'react-select/dist/react-select.css';
import jwt_decode from "jwt-decode";

class ChoixEquipeSujets extends Component{
    constructor(props){
        super(props);
        this.vForm = this.refs.vForm;
        this.state = {
            // Register
            equipe_id: "",
            description: "",
            type: new Map(), //select box
            accepte: false,
            last: [],
            nbrEquipeParProjet:1,
            nbrEquipeParProjetError:null,
            descriptionError: null,
            alert: null,
            sujets: [],
            selectOptions:[], //TODO
            selectOptionsDefault:[],
            resultOptions:[]
        }
        this.getTopics();

    }
    getTopics(){
        return fetch("http://localhost:4000/events/"+localStorage.projet)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(projet => {
                  projet.projet.sujets.map((prop,key) => {this.state.selectOptions.push({value:prop._id,label:prop.titre});
                      this.state.selectOptionsDefault.push({value:prop._id,label:prop.titre});});
                  this.setState({sujets:projet.projet.sujets});

              })
              .catch(error => {
                this.handleError(error);
              });
    }
    getEquipeId(){
      return fetch("http://localhost:4000/equipes/memberinteam/"+jwt_decode(localStorage.token).user._id)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(equipe => {
                  this.setState({equipe_id:equipe._id});

              })
              .catch(error => {
                this.handleError(error);
              });
    }
    successAlert(){
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{display: "block",marginTop: "-100px"}}
                    title="Choix Sujets ajouté!"
                    onConfirm={() => console.log('Done!')}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    Vos sujets ont été ajouté avec succès!
                </SweetAlert>
            )
        });
    }
    hideAlert(){
        this.setState({
            alert: null
        });
    }
    handleTypeValidation(e){
        var digitRex = /^\d+$/;
        digitRex.test(this.state.nbrEquipeParProjet) === false ? this.setState({ nbrEquipeParProjetError: (<small className="text-danger">Nombre d'equipe par sujet doit etre un nombre.</small>) }):this.setState({ nbrEquipeParProjetError: null });
        var descriptionRex = /[-a-zA-Z:%&?!=//\s]{10,}$/;
        descriptionRex.test(this.state.description) === false ? this.setState({ descriptionError: (<small className="text-danger">La description est obligatoire et doit etre de longueur 10 min.</small>) }):this.setState({ descriptionError: null });
        var titreRex = /[-a-zA-Zéçà]+$/;
        titreRex.test(this.state.titre) === false ? this.setState({ titreError: (<small className="text-danger">Le titre est obligatoire.</small>) }):this.setState({ titreError: null });
        this.state.nomEquipe === "" ? this.setState({ nomEquipeError: (<small className="text-danger">Nom Equipe est obligatoire.</small>) }):this.setState({ nomEquipeError: null });
        if(descriptionRex.test(this.state.description)&&titreRex.test(this.state.titre)&&digitRex.test(this.state.nbrEquipeParProjet)){
            e.preventDefault();
            return fetch("http://localhost:4000/sujets/add", {
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
      updateOptions(key){
          for (var i = 0; i < this.state.selectOptions.length; i++) {
              if(this.state.last[key]!=undefined && this.state.last[key]!=null){ //for value of
                  console.log(this.state.selectOptions.indexOf(this.state.last[i]));
                  if(this.state.selectOptions.indexOf(this.state.last[key])!=-1){
                      this.state.selectOptions.splice(this.state.selectOptions.indexOf(this.state.last[key]),1);
                  }
              }
          }
          this.setState({selectOptions:this.state.selectOptions});
      }

      test(e){
          e.preventDefault();
          var x=document.getElementsByName('singleSelect');
          console.log('default length='+this.state.selectOptionsDefault.length);
          if(x.length < this.state.selectOptionsDefault.length)
              {alert('Veuillez remplir toutes les cases');
                 return;}
          for (var i = 0; i < x.length; i++) {
              this.state.resultOptions.push(x[i].value);
          }
          // TODO affecter choix sujet a l'equipe
          return fetch("http://localhost:4000/equipes/addSujets", {
              method: "POST",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json"
                },
              body: JSON.stringify({ id:this.state.equipe_id,choixSujet:this.state.resultOptions}) // TODO id_equipe
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
                                        <legend>Choix sujets</legend>
                                    }
                                    content={
                                        <div>
                                        {this.state.sujets.map((prop,key) => 

                                            {console.log('e');
                                                return(
                                                <FormGroup controlId="formHorizontalNumber">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Choix n° {key+1}
                                                </Col>
                                                <Col sm={6}>
                                                <Select
                                                    placeholder="Single Select"
                                                    name="singleSelect"
                                                    
                                                    value={this.state.type.get(key)}
                                                    options={this.state.selectOptions}
                                                    onChange={(value) => { if(value==null){
                                                        this.state.selectOptions.push(this.state.last[key]);
                                                    }
                                                    console.log('key'+key+'v='+value);
                                                    this.state.type.set(key,value);
                                                    this.state.last[key]=value;
                                                    this.updateOptions(key);
                                                        this.setState({type:this.state.type});
                                                         } }
                                                />
                                            </Col>
                                            </FormGroup>
                                            );}
                                            )}
                                            
                                        </div>
                                    }
                                    ftTextCenter
                                    legend={
                                        <Button fill bsStyle="info" type="submit" onClick={this.test.bind(this)}>Validate Inputs</Button>
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

export default ChoixEquipeSujets;
