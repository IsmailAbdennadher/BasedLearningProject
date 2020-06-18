import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from "axios";
import {Alert} from 'react-bootstrap';


class Login2 extends Component {

    constructor(props) {
        super(props);
        this.state = {email: '',
            password:'',
            err1:true,
            card:true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({email: event.target.value});
    }


    handleSubmit(event) {
        event.preventDefault();
        const email = {
            email: this.state.email,

        };
        axios
            .post("http://localhost:4000/test/reset-password", email)
            .then(res => {
            if(res.data.error !== undefined)
                this.setState({err1: false});
            else
                this.setState({card: false});

            })
            .catch(err => {
                console.log(err);




            });
    }
    componentDidMount() {
        if (localStorage.token !== undefined)
            this.props.history.push({
                pathname: "/profile"
            });
    }
    render() {
        return (
            <div className="app flex-row align-items-center">
                <Alert bsStyle="danger" hidden={this.state.err1}>
                    <strong>oh no!</strong> Verifier votre Email
                </Alert>


                <Container>
                    <Row className="justify-content-center">
                        <Col md="8">
                            <div  hidden={!this.state.card} >
                                <Card  className="p-4" style={{width:"500px",position:"relative",left:"60px"}}>
                                    <CardBody>
                                        <form onSubmit={this.handleSubmit}>
                                            <h1>Mot de passe oublié</h1>
                                            <p>Un mail contenant votre nouveau mot de passe sera envoyer a votre email</p>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-user"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="text" placeholder="email" autoComplete="username" ref="login"  value={this.state.email} onChange={this.handleChange}/>
                                            </InputGroup>

                                            <Row>
                                                <Col xs="6">
                                                    <Button color="btn btn-primary" type="submit" className="px-4" >Envoyer</Button>
                                                </Col>
                                                <Col xs="6" className="text-right">
                                                    <a href="/" color="link" className="px-0">Se connecter ?</a>
                                                </Col>
                                            </Row>
                                        </form>
                                    </CardBody>
                                </Card>
                            </div>
                            <div  hidden={this.state.card} >
                            <Card className="p-4" style={{width:"500px",position:"relative",left:"60px"}}>
                                <CardBody>

                                        <h1>Mot de passe oublié</h1>
                                        <p>Votre nouveau mot de passe vient d'etre envoyer a <strong>{this.state.email}</strong> veuilez verifier votre email.</p>


                                        <Row>

                                            <Col xs="6" className="text-right">
                                                <a href="/" color="link" className="px-0">Se connecter ?</a>
                                            </Col>
                                        </Row>

                                </CardBody>
                            </Card>
                            </div>

                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Login2;
