import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from "axios";
import {Alert} from 'react-bootstrap'
import { GoogleLoginButton } from "react-social-login-buttons";

import jwt_decode from "jwt-decode";

class GoogleLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {email: '',
            password:'',err1:true,
            err2:true};


    }



    componentWillMount() {

        axios
            .post("http://localhost:4000/test/GoogleLogin")
            .then(res => {
                if (res.data.length===undefined)
                   console.log(res)
                else{
                    localStorage.setItem("token", res.data);
                    console.log(jwt_decode(res.data))
                    this.props.history.push({
                        pathname: "/profile"
                    });
                   }

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


    render() {
        return (
            <div className="app flex-row align-items-center">

            </div>
        );
    }
}

export default GoogleLogin;
