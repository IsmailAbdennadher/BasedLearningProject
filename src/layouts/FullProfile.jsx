import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from "axios";
import {Alert, FormControl, FormGroup, ControlLabel, HelpBlock, Radio} from 'react-bootstrap'
import Header from "./Header"
import { Multiselect } from 'react-widgets'
import Slider from 'react-input-slider';
import Sidebar from "components/Sidebar/Sidebar";
//import routes from "routes.js"
import jwt_decode from "jwt-decode";
import {logicalExpression} from "@babel/types";

class FullProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {user: [],
            industrie:'',
            occupation:"",
            x:2,
            typeDeProject:"",

        };
        this.handleChangeindustrie = this.handleChangeindustrie.bind(this);
        this.handleChangeoccupation = this.handleChangeoccupation.bind(this);
        this.handleChangetypeDeProject = this.handleChangetypeDeProject.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeindustrie(event) {
        this.setState({industrie: event.target.value});
    }
    handleChangeoccupation(event) {
        this.setState({occupation: event.target.value});
    }

    handleChangetypeDeProject(event) {
        this.setState({typeDeProject: event.target.value});
    }




    handleSubmit(event) {
        event.preventDefault();
        const User = {
            nom: this.state.user.nom,
            prenom: this.state.user.prenom,
            adresse:this.state.user.adresse,
            email: this.state.user.email,
            password: this.state.user.password,
            sexe:   this.state.user.sexe,
            universite : this.state.user.universite,
            diplome : this.state.user.diplome,
            aPropos:this.state.user.aPropos,
            competances:this.state.user.competances,
            competencesRecherche:this.state.user.reqcomp,
            industrie:this.state.industrie,
            occupation:this.state.occupation,
            experience:this.state.x,
            groupe:this.state.user.groupe,




        };

        axios
            .put("http://localhost:4000/test/edit", User)
            .then(res => {
                console.log(this.state.user.competances)

                console.log((jwt_decode(res.data)))
                    localStorage.removeItem("token");
                localStorage.setItem("token", res.data);
                this.props.history.push({
                    pathname: "/profile"
                });

            })
            .catch(err => {
                console.log(err);


            });

    }
    componentWillMount() {
        if (localStorage.token === undefined)
            this.props.history.push({
                pathname: "/profile"
            });
else  if(jwt_decode(localStorage.token).user.role[0].nom === 'admin')
            this.props.history.push({
                pathname: "/profile"
            });
        else  if(jwt_decode(localStorage.token).user.role[0].nom === 'apprenant')
            this.props.history.push({
                pathname: "/completecomps"
            });
        else{
            console.log(jwt_decode(localStorage.token).user)
            this.setState({
            isConnect: true,
            user:jwt_decode(localStorage.token).user,

        });


        }
    }
    componentDidMount() {
        console.log(this.state.user.competances)

        this.setState({
            industrie: this.state.user.industrie,
            occupation: this.state.user.occupation,
            x: this.state.user.experience,

        })
    }

    render() {
        return (
            <div className="app flex-row align-items-center" >
                <Header />
                {/*<Sidebar {...this.props} routes={routes} image={this.state.image}
                         color="blue"
                         hasImage={this.state.hasImage}/>*/}
                <Container style={{top:"20px",position:"absolute",left:"50px"}}>
                    <Row className="justify-content-center">
                        <Col md="8">
                                <Card className="p-4" style={{left:"0",position:"absolute",width:"900px"}}>
                                    <CardBody>
                                        <h1>Informations</h1>
                                        <p>terminer vos Informations</p>
                                        <form onSubmit={this.handleSubmit}>

                                            <FormGroup
                                                controlId="formBasicText"

                                            >
                                                <ControlLabel>industrie</ControlLabel>
                                                <FormControl
                                                    type="text"
                                                    value={this.state.industrie}
                                                    placeholder="Enter text"
                                                    onChange={this.handleChangeindustrie}
                                                />
                                                <FormControl.Feedback />

                                            </FormGroup>

                                            <FormGroup
                                                controlId="formBasicText"

                                            >
                                                <ControlLabel>occupation</ControlLabel>
                                                <FormControl
                                                    type="text"
                                                    value={this.state.occupation}
                                                    placeholder="Enter text"
                                                    onChange={this.handleChangeoccupation}
                                                />
                                                <FormControl.Feedback />

                                            </FormGroup>
                                            <FormGroup
                                                controlId="formBasicText"

                                            >
                                                <ControlLabel>experience</ControlLabel><br/>
                                                <div hidden={this.state.x===10}>{ this.state.x+' Années'}</div>
                                                <div hidden={this.state.x!==10}>{ this.state.x+'+ Années'}</div>
                                                <div>
                                                <Slider
                                                    axis="x"
                                                    xstep={1}
                                                    xmin={0}
                                                    xmax={10}
                                                    x={this.state.x}
                                                    onChange={({ x }) => this.setState({ x: parseFloat(x.toFixed(2)) })}
                                                />
                                                </div>
                                            </FormGroup>
                                            <FormGroup
                                                controlId="formBasicText"

                                            >
                                                <ControlLabel>type de projet</ControlLabel>
                                                <FormControl
                                                    type="text"
                                                    value={this.state.typeDeProject}
                                                    placeholder="Enter text"
                                                    onChange={this.handleChangetypeDeProject}

                                                />
                                                <FormControl.Feedback />

                                            </FormGroup>
                                            <button style={{left:"750px",position:"relative"}} type="submit" className="btn btn-info">Terminer </button>
                                        </form>
                                    </CardBody>
                                </Card>


                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default FullProfile;
