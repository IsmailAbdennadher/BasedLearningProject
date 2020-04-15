import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Accordion, PanelGroup, Panel,
    Nav, NavItem,
    Tab
} from 'react-bootstrap';
import {
    Switch,
    Route,
    Redirect,
    Link,
    BrowserRouter as Router
} from 'react-router-dom';

import Card from 'components/Card/Card.jsx';

import SweetAlert from 'react-bootstrap-sweetalert';

import SujetEdit from 'views/Forms/SujetEdit.jsx';


class ListeSujets extends Component{
    componentDidUpdate(e){
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this._reactInternalInstance._currentElement._owner._instance._reactInternalInstance._currentElement._owner._instance.componentDidUpdate(e);
        }
    }
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
            sujets:[]
        }
        this.hideAlert = this.hideAlert.bind(this);
        this.successDelete = this.successDelete.bind(this);
        this.warningWithConfirmMessage= this.warningWithConfirmMessage.bind(this);
        //this.getSujets();
        console.log(this.state.sujets);
    }
    handleResponseError(response) {
      throw new Error("HTTP error, status = " + response.status);
  }
  handleError(error) {
      console.log(error.message);
  }
    componentDidMount(){
        return fetch("http://localhost:5000/sujets/")
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(sujet => {
                  console.log(sujet);
                  this.setState({sujets:sujet});
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
        fetch("http://localhost:5000/sujets/"+id, {
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
                    Le sujet a été supprimé.
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
                    confirmBtnText="Oui, Supprimer le sujet!"
                    cancelBtnText="Annuler"
                    showCancel
                >
                    Cette action est irréversible.
                </SweetAlert>
            )
        });
    }
    render(){

        const defaultPanel = this.state.sujets.map((props,key) =>
            <PanelGroup id="accordion" ref="panels" onClick={() => this.forceUpdate()}>
                <Panel
                    collapsible
                    header={
                        <div>
                            {props.titre}
                            <b className="caret"></b>
                        </div>
                    }
                    eventKey="1">
                    <b>Type</b>: {props.type} <br />
                    <b>Description</b>: {props.description} <br/>
                    <b>Nombre d'equipe par projet</b>: {props.nbrEquipeParProjet} <br/>
                    {props.accepte? <button className="btn-wd btn btn-success">Accepter sujet</button> : "" }
                    <button className="btn-wd btn btn-default"><span className="btn-label"><i className="fa fa-edit"></i></span><Link to={"/edit/sujets/"+props._id}>Modifier sujet</Link></button>
                    <button className="btn-wd btn btn-danger" onClick={this.warningWithConfirmMessage.bind(this,props._id)}><span className="btn-label"><i className="fa fa-trash"></i></span>Supprimer sujet</button>
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
                                title="Liste des sujets proposés"
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

export default ListeSujets;
