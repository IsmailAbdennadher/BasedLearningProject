import React, { Component } from 'react';

import { LinkedIn } from 'react-linkedin-login-oauth2';
import axios from "axios";
import {
    Button,
    Card,
    CardBody,
    CardGroup,
    Col, Container,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from "reactstrap";
import jwt_decode from "jwt-decode";
import {Alert} from "react-bootstrap";

class LinkedInPage extends Component {
    constructor() {

        super();
        this. state = {
            err:true,
            nom: '',
            prenom: '',
            email:'',
            password:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
componentWillMount() {
this.setState({
    nom: this.props.location.state.nom,
    prenom: this.props.location.state.prenom,
})
}

    handleChange(event) {
        this.setState({email: event.target.value});
    }
    handleChange2(event) {
        this.setState({password: event.target.value});
    }
    handleChange3(event) {
        this.setState({nom: event.target.value});
    }
    handleChange4(event) {
        this.setState({prenom: event.target.value});
    }


    handleSubmit(event) {
        event.preventDefault();
        var TodayDate = new Date()
        var date =TodayDate.setMonth(TodayDate.getMonth()+1)
        const User = {
            nom: this.state.nom,
            prenom: this.state.prenom,
            adresse: '',
            email: this.state.email,
            password: this.state.password,
            role: [{nom: "apprenant", date: date}],
            sexe: "",
            occupation: "",
            industrie: ""
        };
        axios
            .post("http://localhost:4000/test/register", User)
            .then(res => {
                console.log(res.data)
              if(res.data.error=== undefined)
                  this.setState({
                      err:false
                  })
                else{
                  const authentication = {
                      email: this.state.email,
                      password: this.state.password
                  }; setTimeout(() => {
                  axios
                      .post("http://localhost:4000/test/login", authentication)
                      .then(res => {
                          console.log(res.data)
                          if (res.data.length===undefined)
                              this.setState({err:false})
                          else{
                              localStorage.setItem("token", res.data);
                              console.log(jwt_decode(res.data))

                              this.props.history.push({
                                  pathname: "/profile"

                              })}

                      })
                      .catch(err => {
                          console.log(err);
                          if (err.message==="Invalid toktok specified")
                              this.setState({
                                  err1:false
                              })
                          else
                              this.setState({
                                  err2:false
                              })


                      });
                  }, 1000);
              }


            })

            .catch(err => {
                console.log(err);
            });
    }



    render() {

        return (
            <div>
                <Alert bsStyle="danger" hidden={this.state.err}>
                    <strong>oh no!</strong> Verifier vos coordonnees
                </Alert>
                <Container >
                    <Row className="justify-content-center">
                <Card className="p-4">
                    <CardBody >
                        <form onSubmit={this.handleSubmit}>
                            <h1>Complete Registration</h1>

                            <h1>Nom</h1>
                            <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="icon-user"></i>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input style={{marginBottom:"15px"}} type="text" placeholder="Username" autoComplete="username" ref="login"  value={this.state.nom} onChange={this.handleChange3}/>
                            </InputGroup>
                            <h1>Prenom</h1>
                            <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="icon-user"></i>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input style={{marginBottom:"15px"}} type="text" placeholder="Username" autoComplete="username" ref="login"  value={this.state.prenom} onChange={this.handleChange4}/>
                            </InputGroup>
                            <h1>Email</h1>
                            <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="icon-user"></i>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input style={{marginBottom:"15px"}} type="text" placeholder="Username" autoComplete="username" ref="login"  value={this.state.email} onChange={this.handleChange}/>
                            </InputGroup>
                            <h1>Mot de passe</h1>
                            <InputGroup className="mb-4" >
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="icon-lock"></i>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input style={{marginBottom:"55px"}} type="password" placeholder="Password" autoComplete="current-password" value={this.state.password} onChange={this.handleChange2} ref="password"/>
                            </InputGroup>
                            <Row>
                                <Col xs="6">
                                    <Button color="btn btn-primary" type="submit" className="px-4" >Login</Button>
                                </Col>
                                <Col xs="6" className="text-right">
                                    <a href="/forgotPassword" color="link" className="px-0">Mot de passe oublier ?</a>
                                </Col>
                            </Row>
                        </form>
                    </CardBody>
                </Card>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default LinkedInPage;