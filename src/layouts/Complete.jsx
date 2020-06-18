import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from "axios";
import {Alert, FormControl, FormGroup, ControlLabel, HelpBlock, Radio} from 'react-bootstrap';
import Header from "./Header.jsx";
import { Multiselect } from 'react-widgets';
import Sidebar from "../components/Sidebar/Sidebar.jsx";
//import routes from "routes.js"
import jwt_decode from "jwt-decode";

class Complete extends Component {

    constructor(props) {
        super(props);

        this.state = {user: [],
        nom:'',
        prenom:"",
        adresse:'',
        universite:"",
        Sexe:"",
        aPropos:"",
        diplome:"",
        mycomp:[],
            reqcomp:[]};
        this.handleChangenom = this.handleChangenom.bind(this);
        this.handleChangeprenom = this.handleChangeprenom.bind(this);
        this.handleChangeadresse = this.handleChangeadresse.bind(this);
        this.handleChangeuniversite = this.handleChangeuniversite.bind(this);
        this.handleChangesexe = this.handleChangesexe.bind(this);
        this.handleChangeaPropos = this.handleChangeaPropos.bind(this);
        this.handleChangediplome = this.handleChangediplome.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangenom(event) {
        this.setState({nom: event.target.value});
    }
    handleChangeprenom(event) {
        this.setState({prenom: event.target.value});
    }
    handleChangeadresse(event) {
        this.setState({adresse: event.target.value});
    }
    handleChangesexe(event) {
        this.setState({sexe: event.target.value});
    }
    handleChangeuniversite(event){
        this.setState({universite: event.target.value});
    }
    handleChangeaPropos(event){
        this.setState({aPropos: event.target.value});
    }
    handleChangediplome(event){
        this.setState({diplome: event.target.value});
    }




    handleSubmit(event) {
        event.preventDefault();
        const comp =[]
        let ue
        console.log( this.state.mycomp)
        console.log( this.state.user.competances)
        this.state.mycomp.forEach(e=>{
            ue=0
            this.state.user.competances.forEach(c =>{
                if(c.nom===e){
                    ue=c.UE
                }

            })

            comp.push({nom:e,UE:ue})
        })
        const User = {
            nom: this.state.nom,
            prenom: this.state.prenom,
            adresse:this.state.adresse,
            email: this.state.user.email,
            password: this.state.user.password,
            sexe:   this.state.sexe,
            universite : this.state.universite,
            diplome : this.state.diplome,
            aPropos:this.state.aPropos,
            competances:comp,
            industrie:this.state.industrie,
            occupation:this.state.occupation,
            experience:this.state.x,
            groupe:this.state.user.groupe,
            competencesRecherche:this.state.reqcomp




        };

        axios
            .put("http://localhost:4000/test/edit", User)
            .then(res => {
                console.log((jwt_decode(res.data)))
                localStorage.removeItem("token");
                localStorage.setItem("token", res.data);
                this.props.history.push({
                    pathname: "/full"
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
        else{ this.setState({
            isConnect: true,
            user:jwt_decode(localStorage.token).user,

        });

        }
    }
    componentDidMount() {
        let comp=[]
        this.state.user.competances.forEach(e=>{
            comp.push(e.nom)
        })

        this.setState({
            nom: this.state.user.nom,
            prenom: this.state.user.prenom,
            adresse:this.state.user.adresse,
            sexe:   this.state.user.sexe,
            universite : this.state.user.universite,
            diplome : this.state.user.diplome,
            aPropos:this.state.user.aPropos,
            mycomp:comp,
            reqcomp:this.state.user.competencesRecherche,
        })
        console.log(this.state.user)
    }

    render() {
        return (
            <div className="app flex-row align-items-center" >
                <Header />
                {/*<Sidebar {...this.props} routes={routes} image={this.state.image}
                                     color="blue"
                                     hasImage={this.state.hasImage}/>*/}
                <Alert bsStyle="danger" hidden={true}>
                    <strong>oh no!</strong> verifier vos infos
                </Alert>

                <Container>
                    <Row className="justify-content-center">
                        <Col md="8">
                            <CardGroup>
                                <Card className="p-4">
                                    <CardBody>
                                        <h1>Informations</h1>
                                        <p>modifier vos Informations</p>
                                        <form>

                                            <FormGroup
                                                controlId="formBasicText"

                                            >
                                                <ControlLabel>nom</ControlLabel>
                                                <FormControl
                                                    type="text"
                                                    value={this.state.nom}
                                                    placeholder="Enter text"
                                                    onChange={this.handleChangenom}
                                                />
                                                <FormControl.Feedback />

                                            </FormGroup>

                                                    <FormGroup
                                                        controlId="formBasicText"

                                                    >
                                                        <ControlLabel>prenom</ControlLabel>
                                                        <FormControl
                                                            type="text"
                                                            value={this.state.prenom}
                                                            placeholder="Enter text"
                                                            onChange={this.handleChangeprenom}
                                                        />
                                                        <FormControl.Feedback />

                                                    </FormGroup>
                                            <FormGroup
                                                controlId="formBasicText"

                                            >
                                                <ControlLabel>adresse</ControlLabel>
                                                <FormControl
                                                    componentClass="textarea"
                                                    value={this.state.adresse}
                                                    placeholder="Enter text"
                                                    onChange={this.handleChangeadresse}
                                                />
                                                <FormControl.Feedback />

                                            </FormGroup>
                                            <FormGroup
                                                controlId="formBasicText"

                                            >
                                                <ControlLabel>universite</ControlLabel>
                                                <FormControl
                                                    type="text"
                                                    value={this.state.universite}
                                                    placeholder="Enter text"
                                                    onChange={this.handleChangeuniversite}

                                                />
                                                <FormControl.Feedback />

                                            </FormGroup>

                                        </form>
                                    </CardBody>
                                </Card>
                                <Card className="py-5" style={{ width: '50%' }}>
                                    <CardBody >
                                        <form onSubmit={this.handleSubmit}>
                                            <ControlLabel>mes competence</ControlLabel>
                                            <Multiselect
                                                onChange={mycomp => this.setState({ mycomp })}
                                                dropDown
                                                value={this.state.mycomp}
                                                data={[
                                                    'Java',
                                                    'Python',
                                                    'C#/.Net',
                                                    'Mean',
                                                    'Ruby'
                                                ]}
                                            />


                                            <ControlLabel>competences Recherche</ControlLabel>

                                            <Multiselect
                                                onChange={reqcomp => this.setState({ reqcomp })}
                                                dropDown
                                                value={this.state.reqcomp}
                                                data={[
                                                    'HTML/CSS',
                                                    'JavaScript',
                                                    'Responsive Design',
                                                    'Control/Git',
                                                    'Testing/Debugging'
                                                ]}
                                            />

                                            <FormGroup
                                                controlId="formBasicText"

                                            >
                                                <ControlLabel>sexe</ControlLabel>
                                                <br/>

                                                    <Radio name="radioGroup" inline>
                                                       Homme
                                                    </Radio>{' '}
                                                    <Radio name="radioGroup" inline>
                                                        Femme
                                                    </Radio>{' '}
                                                    <Radio name="radioGroup" inline>
                                                        ne pas specifier
                                                    </Radio>


                                            </FormGroup>
                                            <FormGroup
                                                controlId="formBasicText"

                                            >
                                                <ControlLabel>a propos</ControlLabel>
                                                <FormControl

                                                    componentClass="textarea"
                                                    value={this.state.aPropos}
                                                    placeholder="Enter text"
                                                    onChange={this.handleChangeaPropos}


                                                />
                                                <FormControl.Feedback />

                                            </FormGroup>
                                            <FormGroup
                                                controlId="formBasicText"

                                            >
                                                <ControlLabel>Diplome</ControlLabel>
                                                <FormControl
                                                    type="text"
                                                    value={this.state.diplome}
                                                    placeholder="Enter text"
                                                    onChange={this.handleChangediplome}

                                                />
                                                <FormControl.Feedback />

                                            </FormGroup>
                                            <button  type="submit" className="btn btn-info">Suivant ></button>
                                        </form>
                                    </CardBody>
                                </Card>
                            </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Complete;
