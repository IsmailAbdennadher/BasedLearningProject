import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Accordion, PanelGroup, Panel,
    Nav, NavItem,
    Tab
} from 'react-bootstrap/lib';
import {
    Switch,
    Route,
    Redirect,
    Link,
    BrowserRouter as Router
} from 'react-router-dom';

import Card from '../../components/Card/Card.jsx';

import SweetAlert from 'react-bootstrap-sweetalert';


class ListeProjets extends Component{
    /*componentDidUpdate(e){
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this._reactInternalInstance._currentElement._owner._instance._reactInternalInstance._currentElement._owner._instance.componentDidUpdate(e);
        }
    }*/
    isMac(){
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
    constructor(props){
        super(props);
        this.state = {
            alert: null,
            show: false,
            projets:[]
        }
        this.hideAlert = this.hideAlert.bind(this);
        this.successDelete = this.successDelete.bind(this);
        this.warningWithConfirmMessage= this.warningWithConfirmMessage.bind(this);
        //this.getprojets();
        console.log(this.state.projets);
    }
    handleResponseError(response) {
      throw new Error("HTTP error, status = " + response.status);
  }
  handleError(error) {
      console.log(error.message);
  }
    componentDidMount(){
        return fetch("http://localhost:4000/events/projets")
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(projet => {
                  console.log(projet);
                  this.setState({projets:projet});
              })
              .catch(error => {
                this.handleError(error);
              });
    }
    hideAlert(){
        this.setState({
            alert: null
        });
    }
    successDelete(id){
        console.log('id='+id);
        fetch("http://localhost:4000/events/"+id, {
              method: "DELETE",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json"
                }
            })
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                console.log(response.json());
              })
              .catch(error => {
                this.handleError(error);
              });
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{display: "block",marginTop: "-100px"}}
                    title="Supprimé!"
                    onConfirm={() => window.location.reload()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    Le projet a été supprimé.
                </SweetAlert>
            )
        });
        
    }
    warningWithConfirmMessage(id){
        this.setState({
            alert: (
                <SweetAlert
                    warning
                    style={{display: "block",marginTop: "-100px"}}
                    title="Etes vous sûre?"
                    onConfirm={() => this.successDelete(id)}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                    cancelBtnBsStyle="danger"
                    confirmBtnText="Oui, Supprimer le projet!"
                    cancelBtnText="Annuler"
                    showCancel
                >
                    Cette action est irréversible.
                </SweetAlert>
            )
        });
    }
    gererProjet(id,nom){
        localStorage.setItem('projet',id);
        localStorage.setItem('projet-nom',nom);
        window.location.reload();
        console.log(localStorage.projet);
    }
    render(){

        const defaultPanel = this.state.projets.map((props,key) =>
            <PanelGroup id="accordion" ref="panels" onClick={() => this.forceUpdate()}>
                <Panel eventKey="1">
                            <Panel.Heading>
                          <Panel.Title toggle>{props.projet.nom}</Panel.Title>
                        </Panel.Heading>
                    <Panel.Body collapsible>
                    <b>Annee universitaire</b>: {props.projet.anneeScolaire} <br/>
                    <b>Niveau concerne</b>: {props.projet.niveau_concerne} <br/>
                    <b>Categorie</b>: {props.categorie} <br />
                    <b>Description</b>: {props.description} <br/>
                    <b>Nombre d'equipe par projet</b>: {props.projet.nbrEquipeMax} <br/>
                    <b>Date debut</b>: {props.dateDebut.substr(0,10)} <br/>
                    <b>Date fin</b>: {props.dateFin.substr(0,10)} <br/>
                    <button className="btn-wd btn btn-success" onClick={this.gererProjet.bind(this,props._id,props.projet.nom)}>Gérer le projet</button>
                    <button className="btn-wd btn btn-default"><span className="btn-label"><i className="fa fa-edit"></i></span><Link to={"/edit/projets/"+props._id}>Modifier projet</Link></button>
                    <button className="btn-wd btn btn-danger" onClick={this.warningWithConfirmMessage.bind(this,props._id)}><span className="btn-label"><i className="fa fa-trash"></i></span>Supprimer projet</button>
                </Panel.Body>
                </Panel>
            </PanelGroup>
        );
        const tabs = (
            <Tab.Container id="tabs-with-dropdown" defaultActiveKey="info">
                <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs">
                            <NavItem eventKey="info">Info</NavItem>
                            <NavItem eventKey="account">Account</NavItem>
                            <NavItem eventKey="style">Style</NavItem>
                            <NavItem eventKey="settings">Settings</NavItem>
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content animation>
                            <Tab.Pane eventKey="info">
                                Agency is a group of professional individuals looking to create amazing pieces of clothing. We have studied at the best schools of design, we have tailored the suits for the most stylish men in the industry, we are what you need!
                            </Tab.Pane>
                            <Tab.Pane eventKey="account">
                                We are Houses Inc., a group of architects and interior designers based in Chicago and operating for clients worldwide. We’ve been designing stunningly beautiful houses and making clients happy for years.
                            </Tab.Pane>
                            <Tab.Pane eventKey="style">
                                Explore a wide variety of styles, personalise your finishes, and let us design the perfect home for you. It's what we do best and you can see proof in the products and reviews below.
                            </Tab.Pane>
                            <Tab.Pane eventKey="settings">
                                Explore a wide Houses Inc., a group of architects and interior designers based in Chicago and operating for clients worldwide. We’ve been designing stunningly beautiful houses and making clients happy for years.
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
        const tabsIcons = (
            <Tab.Container id="tabs-with-dropdown" defaultActiveKey="info">
                <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs">
                            <NavItem eventKey="info">
                                <i className="fa fa-info"></i> Info
                            </NavItem>
                            <NavItem eventKey="account">
                                <i className="fa fa-user"></i> Account
                            </NavItem>
                            <NavItem eventKey="style">
                                <i className="fa fa-cube"></i> Style
                            </NavItem>
                            <NavItem eventKey="settings">
                                <i className="fa fa-cog"></i> Settings
                            </NavItem>
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content animation>
                            <Tab.Pane eventKey="info">
                                Agency is a group of professional individuals looking to create amazing pieces of clothing. We have studied at the best schools of design, we have tailored the suits for the most stylish men in the industry, we are what you need!
                            </Tab.Pane>
                            <Tab.Pane eventKey="account">
                                We are Houses Inc., a group of architects and interior designers based in Chicago and operating for clients worldwide. We’ve been designing stunningly beautiful houses and making clients happy for years.
                            </Tab.Pane>
                            <Tab.Pane eventKey="style">
                                Explore a wide variety of styles, personalise your finishes, and let us design the perfect home for you. It's what we do best and you can see proof in the products and reviews below.
                            </Tab.Pane>
                            <Tab.Pane eventKey="settings">
                                Explore a wide Houses Inc., a group of architects and interior designers based in Chicago and operating for clients worldwide. We’ve been designing stunningly beautiful houses and making clients happy for years.
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
        const pageSubcategories = (
            <Tab.Container id="nav-with-icons" defaultActiveKey="description">
                <div>
                    <div className="nav-container">
                        <Nav bsStyle="tabs" bsClass="nav nav-icons">
                            <NavItem eventKey="description">
                                <i className="fa fa-info-circle"></i><br /> Description
                            </NavItem>
                            <NavItem eventKey="location">
                                <i className="fa fa-map-marker"></i><br /> Location
                            </NavItem>
                            <NavItem eventKey="legal">
                                <i className="fa fa-legal"></i><br /> Legal Info
                            </NavItem>
                            <NavItem eventKey="help">
                                <i className="fa fa-life-ring"></i><br /> Help Center
                            </NavItem>
                        </Nav>
                    </div>
                    <Tab.Content>
                        <Tab.Pane eventKey="description">
                            <Card
                                title="Description about product"
                                category="More information here"
                                content={
                                    <div>
                                        <p>Larger, yet dramatically thinner. More powerful, but remarkably power efficient. With a smooth metal surface that seamlessly meets the new Retina HD display.</p>
                                        <p>The first thing you notice when you hold the phone is how great it feels in your hand. There are no distinct edges. No gaps. Just a smooth, seamless bond of metal and glass that feels like one continuous surface.</p>
                                    </div>
                                }
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey="location">
                            <Card
                                title="Location of product"
                                category="Here is some text"
                                content={
                                    <div>
                                        <p>Another Text. The first thing you notice when you hold the phone is how great it feels in your hand. The cover glass curves down around the sides to meet the anodized aluminum enclosure in a remarkable, simplified design.</p>
                                        <p>Larger, yet dramatically thinner.It’s one continuous form where hardware and software function in perfect unison, creating a new generation of phone that’s better by any measure.</p>
                                    </div>
                                }
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey="legal">
                            <Card
                                title="Legal items"
                                category="More information here"
                                content={
                                    <div>
                                        <p>The first thing you notice when you hold the phone is how great it feels in your hand. The cover glass curves down around the sides to meet the anodized aluminum enclosure in a remarkable, simplified design.</p>
                                        <p>Larger, yet dramatically thinner.It’s one continuous form where hardware and software function in perfect unison, creating a new generation of phone that’s better by any measure.</p>
                                    </div>
                                }
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey="help">
                            <Card
                                title="Help center"
                                category="More information here"
                                content={
                                    <div>
                                        <p>From the seamless transition of glass and metal to the streamlined profile, every detail was carefully considered to enhance your experience. So while its display is larger, the phone feels just right.</p>
                                        <p>Another Text. The first thing you notice when you hold the phone is how great it feels in your hand. The cover glass curves down around the sides to meet the anodized aluminum enclosure in a remarkable, simplified design.</p>
                                    </div>
                                }
                            />
                        </Tab.Pane>
                    </Tab.Content>
                </div>
            </Tab.Container>
        );
        return (
            <div className="main-content">
            {this.state.alert}
                <Grid fluid>
                    <Row>
                        <Col md={9}>
                            <Card
                                title="Liste des projets"
                                category=""
                                content={defaultPanel}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default ListeProjets;
