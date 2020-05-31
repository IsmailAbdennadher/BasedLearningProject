import React, { useState,Fragment } from "react";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
    Button, FormGroup, FormControl, ControlLabel, Grid,
    Row,
    Col,
    Radio, Alert
} from "react-bootstrap";
import "../assets/css/login.css";
import axios from "axios";
import "../assets/css/register.css";
import DatePicker from "react-datepicker"
import {Card, CardBody, CardGroup, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
export default function Register(props) {
var TodayDate = new Date()
        const [startDate, setStartDate] = useState(TodayDate.setMonth(TodayDate.getMonth()+1));
        const [nom, setNom] = useState("");
        const [prenom, setPrenom] = useState("");
        const [adresse, setAdresse] = useState("");
        const [email, setEmail] = useState("");
        const [confirmEmail, setConfirmEmail] = useState("");
        const [password, setPassword] = useState("");
        const [role, setRole] = useState("");
        const [industrie, setIndustrie] = useState("");
        const [sexe, setSexe] = useState("");
        const [occupation, setOccupation] = useState("");
        const [test, setTest] = useState("");


        function validateForm() {
            return email.length > 0 && password.length > 3;
        }

        function nameValidator() {
            if (nom.length > 0)
                return "success"
            return "error"
        }

        function LnameValidator() {
            if (prenom.length > 0)
                return "success"
            return "error"
        }

        function emailValidator() {
            if (confirmEmail === email && email.length > 0)
                return "success"
            return "error"
        }

        function EmailValidator2() {
            if (email.indexOf('@') > 0 && email.indexOf('.') !== -1 && email.indexOf('.') > email.indexOf('@') + 1)
                return "success"
            console.log(email.indexOf("."))
            return "error"
        }

        function roleValidator() {
            if (role.length > 0)
                return "success"
            return "error"
        }

        function testRole() {
            return !(role === "tuteur" || role === "porteur" || role === "formateur");

        }


        function myAlert(test) {
            if (test)
                return (<Alert bsStyle="danger">
                        <strong>oh no!</strong> Votre Email est deja utiliser <a href="/"><strong> Se Connecter
                        ? </strong></a>
                    </Alert>

                )
            else return (<Fragment></Fragment>)

        }


        function handleSubmit(event) {
            event.preventDefault();
            const User = {
                nom: nom,
                prenom: prenom,
                adresse: adresse,
                email: email,
                password: password,
                role: [{nom: role, date: startDate}],
                login: email,
                sexe: sexe,
                occupation: occupation,
                industrie: industrie
            };
            axios
                .post("http://localhost:4000/test/register", User)
                .then(res => {
                    if (res.data.error !== undefined)
                        setTest(true)
                    else
                        props.history.push({
                            pathname: "/"
                        });

                })

                .catch(err => {
                    console.log(err);
                });
        }

    if (localStorage.token !== undefined){
        props.history.push({
            pathname: "/profile"
        });
    return (<Fragment></Fragment>)}
    else {
        return (
            <div  className="app flex-row align-items-center" >
                {myAlert(test)}
                <div className="Register">

                    <CardGroup >
                        <Card className="p-4" style={{position:"relative",left:"350px"}}>
                            <CardBody >
                    <Grid fluid>
                        <form onSubmit={handleSubmit}>
                            <h1>Register</h1>
                            <p style={{marginBottom:"15px"}} className="text-muted">crée votre compte :</p>

                            <Row className="justify-content-md-center">
                                <Col xs={5}>
                                    <FormGroup controlId="nom" bsSize="small" validationState={nameValidator()}>
                                        <ControlLabel>Nom</ControlLabel>
<div style={{display:"flex"}}>
    <InputGroupText style={{width:"30px"}}>
        <i className="icon-user"></i>
    </InputGroupText>

    <FormControl
                                            autoFocus
                                            type="text"
                                            value={nom}
                                            onChange={e => setNom(e.target.value)}
                                        />
                                        <FormControl.Feedback/>
</div>
                                    </FormGroup>
                                </Col>
                                <Col md={5}>

                                    <FormGroup controlId="prenom" bsSize="small" validationState={LnameValidator()}>
                                        <ControlLabel>Prenom</ControlLabel>
                                        <div style={{display:"flex"}}>
                                            <InputGroupText style={{width:"30px"}}>
                                                <i className="icon-user"></i>
                                            </InputGroupText>
                                        <FormControl
                                            autoFocus
                                            type="text"
                                            value={prenom}
                                            onChange={e => setPrenom(e.target.value)}
                                        />
                                        <FormControl.Feedback/>
                                        </div>

                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={10}>
                                    <FormGroup controlId="adresse">
                                        <ControlLabel>adresse</ControlLabel>
                                        <FormControl
                                            componentClass="textarea"
                                            value={adresse}
                                            onChange={e => setAdresse(e.target.value)}
                                        />

                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row className="justify-content-md-center">
                                <Col md={5}>
                                    <FormGroup controlId="email" bsSize="small" validationState={EmailValidator2()}>
                                        <ControlLabel>Email</ControlLabel>
                                        <div style={{display:"flex"}}>
                                            <InputGroupText style={{width:"30px"}}>
                                                <i className="icon-signin"></i>
                                            </InputGroupText>
                                        <FormControl
                                            autoFocus
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                            <FormControl.Feedback/></div>
                                    </FormGroup>
                                </Col>
                                <Col md={5}>
                                    <FormGroup controlId="confirmEmail" bsSize="small"
                                               validationState={emailValidator()}>
                                        <ControlLabel>Confirmer Email</ControlLabel>
                                        <div style={{display:"flex"}}>
                                            <InputGroupText style={{width:"30px"}}>
                                                <i className="icon-signin"></i>
                                            </InputGroupText>
                                        <FormControl
                                            autoFocus
                                            type="email"
                                            value={confirmEmail}
                                            onChange={e => setConfirmEmail(e.target.value)}

                                        />
                                            <FormControl.Feedback/></div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={5}>
                                    <FormGroup controlId="password" bsSize="small">
                                        <ControlLabel>Password</ControlLabel>
                                        <div style={{display:"flex"}}>
                                            <InputGroupText style={{width:"30px"}}>
                                                <i className="icon-lock"></i>
                                            </InputGroupText>
                                        <FormControl
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            type="password"
                                        /></div>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup controlId="role" bsSize="small" validationState={roleValidator()}>
                                        <ControlLabel>Role</ControlLabel>
                                        <div style={{display:"flex"}}>
                                            <InputGroupText style={{width:"30px"}}>
                                                <i className="icon-male"></i>
                                            </InputGroupText>
                                        <FormControl
                                            componentClass="select"
                                            onChange={e => setRole(e.target.value)}
                                        >
                                            <option value="" selected disabled hidden>role...</option>
                                            <option value="tuteur">tuteur</option>
                                            <option value="porteur">porteur</option>
                                            <option value="formateur">formateur</option>
                                            <option value="admin">admin</option>
                                            <option value="coordinateur">coordinateur</option>
                                            <option value="apprenant">apprenant</option>
                                        </FormControl></div>
                                        <FormControl.Feedback/>

                                    </FormGroup>
                                </Col>
                                <Col md={5} hidden={testRole()}>
                                    <FormGroup controlId="industrie" bsSize="small">
                                        <ControlLabel>industrie</ControlLabel>
                                        <FormControl
                                            autoFocus
                                            type="text"
                                            value={industrie}
                                            onChange={e => setIndustrie(e.target.value)}
                                        />
                                        <FormControl.Feedback/>

                                    </FormGroup>

                                </Col>
                                <Col md={5} hidden={testRole()}>
                                    <FormGroup controlId="occupation" bsSize="small">
                                        <ControlLabel>occupation</ControlLabel>
                                        <FormControl
                                            autoFocus
                                            type="text"
                                            value={occupation}
                                            onChange={e => setOccupation(e.target.value)}
                                        />
                                        <FormControl.Feedback/>

                                    </FormGroup>

                                </Col>
                                <Col hidden={role === "admin"}>
                                    <ControlLabel>date d'expiration</ControlLabel> <br/>
                                    <div style={{display:"flex"}}>
                                        <InputGroupText style={{width:"30px"}}>
                                            <i className="icon-calendar"></i>
                                        </InputGroupText>
                                        <DatePicker selected={startDate} onChange={date => setStartDate(date)}/></div>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{marginLeft: "10px"}}>
                                    <FormGroup>
                                        <Radio name="Homme" inline onChange={e => setSexe(e.target.name)}>
                                            Homme
                                        </Radio>{' '}
                                        <Radio name="Femme" inline onChange={e => setSexe(e.target.name)}>
                                            Femme
                                        </Radio>{' '}
                                        <Radio name="" inline onChange={e => setSexe(e.target.name)}>
                                            Autre
                                        </Radio>

                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={3}>
                                    <Button block bsSize="small"
                                            disabled={roleValidator() === "error" || !validateForm() || nameValidator() === "error" || LnameValidator() === "error" || emailValidator() === "error"}
                                            type="submit">
                                        Login
                                    </Button>
                                </Col><Col>
                                <ControlLabel style={{fontSize:"10px",position:"relative",left:"300px"}}>vous avez deja un compte ?</ControlLabel>
                                <br/>
                                <a href="/" color="link" className="px-0" style={{fontSize:"20px",position:"relative",left:"300px"}}>Se connecter</a>
                            </Col>
                            </Row>

                        </form>
                    </Grid>
                            </CardBody>
                        </Card>
                    </CardGroup>
                </div>

            </div>
        );
    }
}