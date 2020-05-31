import React, { Component } from 'react';
import { Link , Redirect} from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from "axios";
import {Alert} from 'react-bootstrap'
import { GoogleLoginButton } from "react-social-login-buttons";
import { LinkedInLoginButton } from "react-social-login-buttons";
import jwt_decode from "jwt-decode";
import { LinkedIn } from 'react-linkedin-login-oauth2';
const qs = require('querystring')

class Login2 extends Component {

    constructor(props) {
        super(props);
        this.state = {email: '',
        password:'',err1:true,
            code: '',
            errorMessage: '',
            err2:true,};

        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSuccess = (data) => {
        this.setState({
            code: data.code,
            errorMessage: '',
        });
    }

    handleFailure = (error) => {
        this.setState({
            code: '',
            errorMessage: error.errorMessage,
        });
    }
    handleChange(event) {
        this.setState({email: event.target.value});
    }
    handleChange2(event) {
        this.setState({password: event.target.value});
    }
decode(){
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    setTimeout(() => {
    const requestBody = {
        grant_type: 'authorization_code',
        code: this.state.code,
        client_id: '867i4kcmvg3f7f',
        client_secret: 'zaH7WCaCCjycmTWC',
        redirect_uri: "http://localhost:3000/linkedin"
    }

        console.log(this.state.code)
        axios.post("https://www.linkedin.com/oauth/v2/accessToken", qs.stringify(requestBody), config)
            .then((result) => {
                console.log(result.data)
                axios.get("https://api.linkedin.com/v2/me?oauth2_access_token="+result.data.access_token)
                    .then((res) => {
                        console.log(res)
                        this.props.history.push({
                            pathname: "/lin",
                            state: { nom: res.data.firstName.localized.fr_FR,
                                prenom: res.data.lastName.localized.fr_FR,}
                        })

                    })
                    .catch((err) => {
                        // Do somthing
                    })
            })
            .catch((err) => {
                // Do somthing
            })
    }, 5000);

}
    handleSubmit(event) {
        event.preventDefault();
            const authentication = {
                email: this.state.email,
                password: this.state.password
            };
        axios
            .post("http://localhost:4000/test/login", authentication)
            .then(res => {
               if (res.data.length===undefined)
                this.setState({err1:false})
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
                <Alert bsStyle="warning" hidden={this.state.err2}>
                    <strong>oh no!</strong> Mot de pass incorrect
                </Alert>

                <Container >
                    <Row className="justify-content-center">
                        <Col md="8">
                            <CardGroup >
                                <Card className="p-4">
                                    <CardBody >
                                        <form onSubmit={this.handleSubmit}>
                                            <h1>Login</h1>
                                            <p style={{marginBottom:"30px"}} className="text-muted">Sign In to your account</p>
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
                                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                                    <CardBody className="text-center">
                                        <div>
                                            <h2>Sign up</h2>
                                            <p style={{marginBottom:"50px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                                                labore et dolore magna aliqua.</p>
                                            <a href="http://localhost:4000/test/auth/google"> <GoogleLoginButton  /></a>

                                                <LinkedIn
                                                clientId="867i4kcmvg3f7f"
                                                scope="r_liteprofile"
                                                onFailure={this.handleFailure}
                                                onSuccess={this.handleSuccess}
                                                redirectUri="http://localhost:3000/linkedin"
                                                renderElement={({ onClick, disabled }) => (
                                                    <LinkedInLoginButton   onClick={() => {
                                                        onClick();
                                                        this.decode();
                                                    }} disabled={disabled} />
                                                )}
                                            >
                                                <img src={require('../assets/img/linkedin.png')} alt="Log in with Linked In" style={{ maxWidth: '180px' }} />
                                            </LinkedIn>


                                            <Link to="/register">
                                                <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                                            </Link>
                                        </div>
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

export default Login2;
