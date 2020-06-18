import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';

// react component that creates a dropdown menu for selection
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import Checkbox from 'elements/CustomCheckbox/CustomCheckbox.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';

class EquipeForms extends Component{
    constructor(props){
        super(props);
        this.vForm = this.refs.vForm;
        this.state = {
            // Type
            nomEquipe: "",
            nomEquipeError: "",
            multipleSelect:null,
            membres:[],
            limit:null, // a definir /* */
        }
        this.getEtudiants('3A22');
        
    }
    getEtudiants(classe){
        return fetch("http://localhost:4000/users/"+classe)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(etudiant => {
                  etudiant.map((prop,key) => this.state.membres.push({value:prop._id,label:prop.nom}));
              })
              .catch(error => {
                this.handleError(error);
              });
    }
    handleEmailChange(event){
        this.setState({
            email: event.target.value
        });
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        re.test(event.target.value) === false ? this.setState({ emailError: (<small className="text-danger">Email is required and format should be <i>john@doe.com</i>.</small>) }):this.setState({ emailError: null });
    }
    handlePasswordChange(event){
        this.setState({
            password: event.target.value
        });
        event.target.value.length < 6 ? this.setState({ passwordError: (<small className="text-danger">You must enter a password of at least 6 characters.</small>) }):this.setState({ passwordError: null });
    }
    handleCfPasswordChange(event){
        this.setState({
            cfpassword: event.target.value
        });
        event.target.value !== this.state.password ? this.setState({ cfpasswordError: (<small className="text-danger">Passwords do not match.</small>) }):this.setState({ cfpasswordError: null });
    }
    handleRegisterSubmit(){
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        re.test(this.state.email) === false ? this.setState({ emailError: (<small className="text-danger">Email is required and format should be <i>john@doe.com</i>.</small>) }):this.setState({ emailError: null });
        this.state.password.length < 6 ? this.setState({ passwordError: (<small className="text-danger">You must enter a password of at least 6 characters.</small>) }):this.setState({ passwordError: null });
        this.state.cfpassword !== this.state.password ? this.setState({ cfpasswordError: (<small className="text-danger">Passwords do not match.</small>) }):this.setState({ cfpasswordError: null });
    }
    handleLoginEmail(event){
        this.setState({
            emailLogin: event.target.value
        });
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        re.test(event.target.value) === false ? this.setState({ emailErrorLogin: (<small className="text-danger">Email is required and format should be <i>john@doe.com</i>.</small>) }):this.setState({ emailErrorLogin: null });
    }
    handleLoginPassword(event){
        this.setState({
            passwordLogin: event.target.value
        });
        event.target.value.length < 6 ? this.setState({ passwordErrorLogin: (<small className="text-danger">You must enter a password of at least 6 characters.</small>) }):this.setState({ passwordErrorLogin: null });
    }
    handleLoginSubmit(){
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        re.test(this.state.emailLogin) === false ? this.setState({ emailErrorLogin: (<small className="text-danger">Email is required and format should be <i>john@doe.com</i>.</small>) }):this.setState({ emailErrorLogin: null });
        this.state.passwordLogin < 6 ? this.setState({ passwordErrorLogin: (<small className="text-danger">You must enter a password of at least 6 characters.</small>) }):this.setState({ passwordErrorLogin: null });
    }
    handleResponseError(response) {
      throw new Error("HTTP error, status = " + response.status);
  }
  handleError(error) {
      console.log(error.message);
  }
    handleTypeValidation(e){
        this.state.nomEquipe === "" ? this.setState({ nomEquipeError: (<small className="text-danger">Nom Equipe est obligatoire.</small>) }):this.setState({ nomEquipeError: null });
        if(this.state.nomEquipeError==null){
            e.preventDefault();
            const idmembres=[];
            this.state.multipleSelect.map((prop,key) => {
                idmembres.push(prop.value);
            })
            return fetch("http://localhost:4000/equipes/add", {
              method: "POST",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json"
                },
              body: JSON.stringify({ nomEquipe: this.state.nomEquipe,idMembre:idmembres })
            })
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                alert('equipe ajouté!');
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
    render(){
        return (
            <div className="main-content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Form horizontal action='google.com'>
                                <Card
                                    title={
                                        <legend>Ajout equipe</legend>
                                    }
                                    content={
                                        <div>
                                            <FormGroup controlId="formHorizontalRequiredText">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Nom equipe
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="text" name="nomEquipe" onChange={(event) => {
                                                        this.setState({nomEquipe: event.target.value});
                                                        event.target.value === "" ? this.setState({ nomEquipeError: (<small className="text-danger">Nom Equipe est obligatoire.</small>) }):this.setState({ nomEquipeError: null });
                                                    }}/>
                                                    {this.state.nomEquipeError}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalRequiredText">
                                            <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    Membres de l'equipe
                                                </Col>
                                            <Col sm={6}>
                                                <Select
                                                    placeholder={"Multiple Select "}
                                                    closeOnSelect={false}
                                                    multi={true}
                                                    name="multipleSelect"
                                                    value={this.state.multipleSelect}
                                                    options={this.state.membres}
                                                    onChange={(value) => { this.setState({ multipleSelect: value})}}
                                                />
                                            </Col>
                                            </FormGroup>
                                        </div>
                                    }
                                    ftTextCenter
                                    legend={
                                        <Button fill bsStyle="info" type="submit" onClick={this.handleTypeValidation.bind(this)}>Valider</Button>
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

export default EquipeForms;
