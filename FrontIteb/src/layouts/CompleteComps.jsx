import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from "axios";
import {Alert, FormControl, FormGroup, ControlLabel, HelpBlock, Radio, Table} from 'react-bootstrap'
import Header from "./Header"
import { Multiselect } from 'react-widgets'
import Slider from 'react-input-slider';
import Sidebar from "components/Sidebar/Sidebar";
import routes from "routes.js"
import jwt_decode from "jwt-decode";
import {logicalExpression} from "@babel/types";

class CompleteComps extends Component {

    constructor(props) {
        super(props);

        this.state = {user: [],
            comps: [],
            values: [],
            err:false,
            msg:''

        };


    }


    componentWillMount() {
        if (localStorage.token === undefined)
            this.props.history.push({
                pathname: "/"
            });

        else  if(jwt_decode(localStorage.token).user.role[0].nom !== 'apprenant')
            this.props.history.push({
                pathname: "/profile"
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

        let x = {}
for (let i=0;i<this.state.user.competances.length;i++){
    x={...x,[i]:this.state.user.competances[i].UE.toString()}


}


        console.log(this.state.values)
        this.setState({
            comps: this.state.user.competances,
            values:x

        })
    }
    getIndex(value, arr, prop) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                return i;
            }
        }
        return -1; //to handle the case where the value doesn't exist
    }
    handleChange(i, e) {
        this.setState({
            values: { ...this.state.values, [i]: e.target.value }
        });


    }

    enregistrer(){
        let errArray=[]
        let c = this.state.comps
        for(let i =0;i<this.state.comps.length;i++){
            console.log(this.state.values[i])
            if (!isNaN(parseInt(this.state.values[i]))){
                console.log('not NaN:'+parseInt(this.state.values[i]) +"&& "+  this.state.user.competances[i].UE)
                c[i].UE = parseInt(this.state.values[i])}
            else {
                console.log('is NaN:'+parseInt(this.state.values[i])+" &&"+  this.state.user.competances[i].UE)
                c[i].UE = this.state.user.competances[i].UE
            }
        }
        c.forEach(e=>{
            if(20<e.UE || e.UE<0){
                errArray.push(e.nom)
            }
        })
        console.log(this.state.comps)
        if(errArray.length!==0)
          this.setState({
              err:true,
              msg:errArray.toString()
          })
        else{
            let req = {email:this.state.user.email,comps:c}
            axios
                .post("http://localhost:4000/test/edit-competences", req)
                .then(res => {
                    localStorage.removeItem("token");
                    localStorage.setItem("token", res.data);
                    console.log(jwt_decode(res.data))

                    this.props.history.push({
                        pathname: "/profile"

                    })

                })
                .catch(err => {
console.log(err)
                });
        }

    }



    render() {
        return (
            <div className="app flex-row align-items-center" >
                <Header />
                <Sidebar {...this.props} routes={routes} image={this.state.image}
                         color="blue"
                         hasImage={this.state.hasImage}/>
                <Alert bsStyle="danger" hidden={!this.state.err}>
                    <strong>oh no!</strong> Verifier les notes de {this.state.msg}
                </Alert>

                <Container style={{top:"20px",position:"absolute",left:"50px"}}>
                    <Row className="justify-content-center">
                        <Col md="8">
                            <Card className="p-4" style={{left:"0",position:"absolute",width:"900px"}}>
                                <CardBody>
                                    <h1>Informations</h1>
                                    <p>terminer vos Competances</p>
                                    <Table striped bordered condensed hover>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Competance</th>
                                            <th>Ancienne note</th>
                                            <th>Nouvelle note</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.comps.map(e=>{return(
                                            <tr>
                                                <td>{this.getIndex(e.nom, this.state.user.competances, 'nom')}</td>
                                                <td>{e.nom}</td>
                                                <td>{e.UE}  </td>
                                                <td> <input
                                                    type="number"
                                                    value={this.state.values[this.getIndex(e.nom, this.state.comps, 'nom')]}
                                                    name={this.state.values[this.getIndex(e.nom, this.state.comps, 'nom')]}
                                                    onChange={this.handleChange.bind(this, this.getIndex(e.nom, this.state.comps, 'nom'))} />
                                                </td>
                                            </tr>
                                        )}) }


                                        </tbody>
                                        <button onClick={this.enregistrer.bind(this)} className="btn btn-info">Enregistrer</button>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default CompleteComps;
