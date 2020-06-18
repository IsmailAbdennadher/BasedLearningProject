/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component,Fragment } from "react";
//import routes from "routes.js";
import axios from "axios";

import {
    Grid,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
    ProgressBar,
    Label

} from "react-bootstrap";
import Panel from 'react-bootstrap/lib/Panel';
import jwt_decode from "jwt-decode";
//import WarningIcon from '@material-ui/icons/Warning';

import { UserCard } from "components/Card/UserCard.jsx";
import Sidebar from "components/Sidebar/Sidebar";
import Button from "elements/CustomButton/CustomButton.jsx";
import avatar from "assets/img/faces/face-3.jpg";
import Header from "./Header"
class UserProfile extends Component {
    constructor() {

        super();
        this.state = {
            isConnect: false,
            path: "",
           user:[],
            competence:[],
            hasError: false
        };
        this.getProject();
    }
    getProject(){
        if(jwt_decode(localStorage.token).user.role[0].nom==="apprenant"){
            var str = jwt_decode(localStorage.token).user.classe;
      var patt = /[0-9]+\b/;
      var result = str.match(patt);
      var niveau = str.replace(result,"");
      return fetch("http://localhost:4000/events/projet/"+niveau)
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              })
              .then(projet => {
                  localStorage.setItem('projet',projet._id);
                  localStorage.setItem('projet-nom',projet.projet.nom);
              })
              .catch(error => {
                this.handleError(error);
              });
        }
    }
    handleResponseError(response) {
      throw new Error("HTTP error, status = " + response.status);
  }
  handleError(error) {
      console.log(error.message);
  }
    componentWillMount() {
console.log(localStorage)
      if (localStorage.token === undefined)
          this.props.history.push({
            pathname: "/"
        });
        else{
            if(jwt_decode(localStorage.token).user.competances===undefined)
            this.setState({
                isConnect: true,
                user:jwt_decode(localStorage.token).user,
                competence:[]

            });
            else
                this.setState({
                    isConnect: true,
                    user:jwt_decode(localStorage.token).user,
                    competence:jwt_decode(localStorage.token).user.competances

                });
          axios.get("http://localhost:4000/test/expired")
              .then(res => {console.log(res)
              });
        }


    }



    render() {
        if (localStorage.token === undefined){
            this.props.history.push({
                pathname: "/"
            });
        return (<Fragment></Fragment>);
        }
        else
        return (
            <div className="">
                <Header/>
                {/*<Sidebar {...this.props} routes={routes} image={this.state.image}
                         color="blue"
                         hasImage={this.state.hasImage}/>*/}


                <Grid fluid>

                    <Row style={{marginLeft:"30%"}}>
                        <Col>
                        <UserCard
                            bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                            avatar={avatar}
                            name=  {this.state.user.nom+" "+this.state.user.prenom}

                            userName=  {this.state.user.sexe}
                            description={
                                <span>
                                    {this.state.user.adresse}
                                    <br />
                                    <span hidden={this.state.user.universite===null}>
                                    universite : {this.state.user.universite}
                                    <br />
                                    </span>
                                    <span hidden={this.state.user.diplome===null}>
                                            diplome : {this.state.user.diplome}
                                </span>
                                     <br />
                                 <span hidden={this.state.user.industrie===""}>
                                            industrie : {this.state.user.industrie}
                                </span>
                                     <br />
                                 <span hidden={this.state.user.occupation===""}>
                                            occupation : {this.state.user.occupation}
                                </span></span>
                            }
                            socials={
                                <div>
                                    <Button simple>
                                        <i className="fa fa-facebook-square" />
                                    </Button>
                                    <Button simple>
                                        <i className="fa fa-twitter" />
                                    </Button>
                                    <Button simple>
                                        <i className="fa fa-google-plus-square" />
                                    </Button>
                                </div>
                            }
                        />
                        </Col>
                        <Col  style={{paddingLeft:"0px"}}>
                            <Panel  bsStyle="primary" >
                                <Panel.Heading  style={{paddingLeft:"0px",paddingRight:"350px"}}>
                                    <Panel.Title componentClass="h3">A propos de moi</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>{this.state.user.aPropos}</Panel.Body>
                            </Panel>
                            <Panel  bsStyle="primary" hidden={this.state.user.role[0].nom !== "porteur" && this.state.user.role[0].nom !== "tuteur" && this.state.user.role[0].nom !== "formateur" && this.state.user.role[0].nom !== "coordinateur"}  >
                                <Panel.Heading>
                                    <Panel.Title componentClass="h3">Experience</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>  <div style={{display:'flex'}}>
                                    <p>0</p><p hidden={this.state.user.experience !==10} style={{paddingLeft:this.state.user.experience*45+"px",position:"absolute"}}>+</p><p hidden={this.state.user.experience ===10} style={{paddingLeft:this.state.user.experience*45+"px",position:"absolute"}}>{this.state.user.experience}</p><p style={{paddingLeft:"450px"}}>10</p></div>
                                    <ProgressBar bsStyle="info" now={this.state.user.experience*10} />  </Panel.Body>
                            </Panel>
                            <Panel  bsStyle="primary" eventKey="1" hidden={this.state.user.role[0].nom==="apprenant"}>
                                <Panel.Heading>
                                    <Panel.Title toggle componentClass="h3">Mes competances</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible style={{display:"flex"}}>{this.state.user.competances.map(e=>{
                                    return(<div>
                                        <Label style={{fontSize:"15px"}} bsStyle="default">{ e.nom }</Label>    &nbsp;  </div>                                  )
                                })
                                }</Panel.Body>
                            </Panel>
                            <Panel  bsStyle="primary" eventKey="1" hidden={this.state.user.role[0].nom!=="apprenant"}>
                                <Panel.Heading>
                                    <Panel.Title toggle componentClass="h3">Mes competances</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible style={{display:"flex"}}>{this.state.user.competances.map(e=>{
                                    return(<div>
                                        <Label style={{fontSize:"15px"}} bsStyle="default">{ e.nom } : {e.UE}</Label>    &nbsp;  </div>                                  )
                                })
                                }</Panel.Body>
                            </Panel>
                            <Panel  bsStyle="primary" eventKey="1" hidden={this.state.user.role[0].nom!=='tuteur'||this.state.user.role[0].nom!=='admin'||this.state.user.role[0].nom!=='coordinateur'}>
                                <Panel.Heading>
                                    <Panel.Title toggle componentClass="h3">Specialite</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible style={{display:"flex"}}>{this.state.user.competencesRecherche.map(e=>{
                                    return(<div>
                                        <Label style={{fontSize:"15px"}} bsStyle="danger">{ e }</Label>    &nbsp;  </div>                                  )
                                })
                                }</Panel.Body>
                            </Panel>
                            <Panel  bsStyle="primary" eventKey="1" hidden={this.state.user.role[0].nom==='tuteur'||this.state.user.role[0].nom==='admin'||this.state.user.role[0].nom==='coordinateur'}>
                                <Panel.Heading>
                                    <Panel.Title toggle componentClass="h3">competances Recherche</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible style={{display:"flex"}}>{this.state.user.competencesRecherche.map(e=>{
                                    return(<div>
                                        <Label style={{fontSize:"15px"}} bsStyle="danger">{ e }</Label>    &nbsp;  </div>                                  )
                                })
                                }</Panel.Body>
                            </Panel>
                        </Col>

                    </Row>
                    <Row>
                        <Col style={{paddingLeft:"400px"}} hidden={this.state.user.diplome!==null}>
                            <a href="/complete" className="btn btn-danger">Completer votre profil</a>
                        </Col>
                        <Col style={{paddingLeft:"400px"}}  hidden={this.state.user.diplome===null}>
                            <a href="/complete" className="btn btn-primary">Modifier votre profil</a>
                        </Col>
                    </Row>

                </Grid>
            </div>
        );
    }
}

export default UserProfile;
