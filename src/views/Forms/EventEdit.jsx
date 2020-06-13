import React, { Component } from 'react';
import axios from 'axios'
import {
    Grid, Row, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import { NavLink,withRouter } from 'react-router-dom';


import Card from 'components/Card/Card.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import Checkbox from 'elements/CustomCheckbox/CustomCheckbox.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Datetime from 'react-datetime';
class EventsForms extends Component{
    constructor(props) {
		super(props)
        this.hideAlert = this.hideAlert.bind(this);
		this.state = {
			nom: '',
            type: '',
			nombrePlace: '',
			description: '',
			categorie: '',
            lieu: '',
            image:'',
            dateEvent: '',
            alert: null,
            show: false,
            nomError: null,
			typeError: null,
			nombrePlaceError: null,
            descriptionError: null,
            lieuError: null,
            image:'',
            dateEventError: null,
           
        }
       
    }
    changeHandler = e => {
		this.setState({ [e.target.name]: e.target.value })
	}
    handleprofilChange= (event)=>{
        this.setState({
          image:event.target.value.substring(12, 50)
        })
      console.log("imageee novvvv",this.state.image)
      }
    

      componentDidMount(){
        console.log('id='+this.props.match.params.id);
        fetch("http://localhost:5000/event/"+this.props.match.params.id)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(sujet => {
                  this.setState({nom: sujet.nom,type: sujet.type,nombrePlace:sujet.nombrePlace,description:sujet.description,categorie:sujet.categorie,lieu:sujet.lieu,image:sujet.image,dateEvent:sujet.dateEvent});
              })
              .catch(error => {
                this.handleError(error);
              });

    }

    submitHandler = e => {
        var nomRex = /[-a-zA-Zéçà]+$/;
        nomRex.test(this.state.nom) === false ? this.setState({ nomError: (<small className="text-danger">Le nom est obligatoire.</small>) }):this.setState({ nomError: null });
        var typeRex = /[-a-zA-Zéçà]+$/;
        typeRex.test(this.state.type) === false ? this.setState({ typeError: (<small className="text-danger">Le type est obligatoire.</small>) }):this.setState({ typeError: null });
        var nombreplaceRex= /^\d+$/;
        nombreplaceRex.test(this.state.nombrePlace) === false ? this.setState({ nombrePlaceError: (<small className="text-danger">Nombre de place  doit etre un nombre.</small>) }):this.setState({ nombrePlaceError: null });
        var descriptionRex = /[-a-zA-Z:%&?!=//\s]{10,}$/;
        descriptionRex.test(this.state.description) === false ? this.setState({ descriptionError: (<small className="text-danger">La description est obligatoire et doit etre de longueur 10 min.</small>) }):this.setState({ descriptionError: null });
       
        var lieuRex = /[-a-zA-Zéçà]+$/;
        lieuRex.test(this.state.lieu) === false ? this.setState({ lieuError: (<small className="text-danger">Le lieu est obligatoire.</small>) }):this.setState({ lieuError: null });
        //var dateeventRex = /[-a-zA-Zéçà]+$/;
        //dateeventRex.test(this.state.dateEvent) === false ? this.setState({ dateEventError: (<small className="text-danger">La date est obligatoire.</small>) }):this.setState({ dateEventError: null });
        if(nomRex.test(this.state.nom)&&typeRex.test(this.state.type)&&nombreplaceRex.test(this.state.nombrePlace)&&descriptionRex.test(this.state.description)&&lieuRex.test(this.state.lieu)){
        e.preventDefault();
        
  
		console.log(this.state)
		axios
			.post('http://localhost:5000/modif/'+this.props.match.params.id)
			.then(response => {
                console.log(response)
                
        
                this.successAlert();
                return response.json();
			})
			.catch(error => {
				console.log(error)
            })
        }
        else{
            e.preventDefault();
        }
    }
    successAlert(){
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{display: "block",marginTop: "-100px"}}
                    title=" Evenement modifie!"
                    onConfirm={() => this.props.history.push("/tables/data-tables")}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                   Votre evenement a été mis à jour!
                </SweetAlert>
            )
        });
    }
    
    hideAlert(){
        this.setState({
            alert: null
        });
    }

    render(){
        const { nom, type, nombrePlace,description,categorie,lieu,image,dateEvent } = this.state
        return (
            <div className="main-content">
                 {this.state.alert}
                <Grid fluid>
                    <Row>
                     
                       
                        <Col md={12}>
                            <Form  horizontal  onSubmit={this.submitHandler.bind(this)} >
                                <Card
                                    title={
                                        <legend>Modifier Evenements</legend>
                                    }
                                    content={
                                        <div>
                                            <FormGroup controlId="formHorizontalRequiredText">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                 nom
                                                </Col>
                                                <Col sm={6}> 
                                                    <FormControl type="text" name="nom" value={this.state.nom} onChange={this.changeHandler}/>
                                                    {this.state.nomError}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalEmail">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                    type
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="text" value ={this.state.type} name="type" 
                                                    
                                                    onChange={this.changeHandler}
                                                    />
                                                    {this.state.typeError}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalEmail">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                nombrePlace
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="number" value ={this.state.nombrePlace} name="nombrePlace" 
                                                    
                                                    onChange={(event) => {
                                                        this.setState({nombrePlace: event.target.value});
                                                        var nombreplaceRex= /^\d+$/;
                                                        nombreplaceRex.test(event.target.value) === false ? this.setState({ nombrePlaceError: (<small className="text-danger">nombre de place has to be a number.</small>) }):this.setState({ nombrePlaceError: null });
                                                    }}
                                                    />
                                                    {this.state.nombrePlaceError}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalEmail">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                description <small className="text-danger">*</small>
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="textarea"  name="description" value={this.state.description} onChange={(event) => {
                                                        this.setState({description: event.target.value});
                                                        var descriptionRex = /[-a-zA-Z:%&?!=//\s]{10,}$/;
                                                        descriptionRex.test(this.state.description) === false ? this.setState({ descriptionError: (<small className="text-danger">La description est obligatoire et doit etre de longueur 10 min.</small>) }):this.setState({ descriptionError: null });
                                                    }}
                                                    
                                                   
                                                    />
                                                     {this.state.descriptionError}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalEmail">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                categorie
                                                </Col>
                                                <Col sm={6}>
                                                <FormControl type="text" value={this.state.categorie} name="categorie"
                                                    
                                                    onChange={this.changeHandler}
                                                    />
                                                 
                                                </Col>
                                            </FormGroup>
                                            <FormGroup controlId="formHorizontalEmail">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                lieu
                                                </Col>
                                                <Col sm={6}>
                                                    <FormControl type="text" value ={lieu} name="lieu" value={this.state.lieu}
                                                    
                                                    onChange={this.changeHandler}
                                                    />
                                                    {this.state.lieuError}
                                                </Col>
                                            </FormGroup>
                                               <FormGroup controlId="formHorizontalEmail">
                                               <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                image
                                                </Col>
                                                <Col sm={6}>
                                                    <input id="profile-image-upload"  type="file"     onChange={this.handleprofilChange}/>
                                                    </Col>
                                                 </FormGroup>
                                            <FormGroup controlId="formHorizontalEmail">
                                                <Col componentClass={ControlLabel} sm={2} smOffset={2}>
                                                dateEvent
                                                </Col>
                                                <Col sm={6}>
                                                   
                                                    <Datetime
                                                    timeFormat={false}
                                                    inputProps={{placeholder:"Date Picker Here"}}
                                                    defaultValue={new Date()}
                                                    value ={this.state.dateEvent}
                                                    onChange={(value) => {this.setState({dateEvent:value})}}
                                                 
                                                  //  onChange={this.changeHandler}
                                                    />
                                                    
                                                </Col>
                                            </FormGroup>
                                        </div>
                                    }
                                    ftTextCenter
                                    legend={
                                        <Button fill bsStyle="info" type="submit" >Modifier</Button>
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

export default EventsForms;
