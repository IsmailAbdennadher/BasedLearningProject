import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from "axios";
import {Alert, Modal, FormGroup, ControlLabel, HelpBlock, Radio, Grid, Table} from 'react-bootstrap'
import Header from "./Header"
import { Multiselect } from 'react-widgets'
import Sidebar from "components/Sidebar/Sidebar";
import routes from "routes.js"
import jwt_decode from "jwt-decode";
import WarningIcon from '@material-ui/icons/Warning';
import TableList from "../views/TableList"

class ListUsers extends Component {

    constructor(props) {
        super(props);

        this.state = {editUser:[],
            msg:'vous allez supprimer un utilisateur',
            err:false,
            myA:true,
            mycomps:[],
            users: [],
            show: false,
            show2: false};

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow2 = this.handleShow2.bind(this);
        this.handleClose2 = this.handleClose2.bind(this);


    }

    handleClose() {
        this.setState({ show: false });
    }
    handleClose2() {
        this.setState({ show2: false });
    }

delete(){
    const authentication = {
        email: this.state.editUser.email,
        password: this.state.password
    };
        if(authentication.email===this.state.user.email)
        { axios
            .post("http://localhost:4000/test/delete", authentication)
            .then(res => {
                console.log(res.data)
                localStorage.removeItem("token");
                this.handleClose2()
                this.props.history.push({
                    pathname: "/profile"
                });
            })
            .catch(err => {
                console.log(err);


            });}

    else{
    axios
        .post("http://localhost:4000/test/delete", authentication)
        .then(res => {
            console.log(res.data)

        })
        .catch(err => {
            console.log(err);


        });
    this.handleClose2()
            window.location.reload();}
}
    toggleActivity(u){
        const User = u;
        User.isActif = !User.isActif
        axios
            .put("http://localhost:4000/test/edit", User)
            .then(res => {
                console.log(User.email===this.state.user.email)
                if(User.email===this.state.user.email){
                    localStorage.removeItem("token");
                    localStorage.setItem("token", res.data);
                    this.props.history.push({
                        pathname: "/profile"
                    });}
            })
            .catch(err => {
                console.log(err);


            });
        window.location.reload();
    }
save(){
        var today = new Date()
    var todayPlusMonth = today.setMonth(today.getMonth()+1);
        if(this.state.mycomps.length===0)
            this.setState({
                err:true
            })
            else{
    const User = this.state.editUser;
   let roles = []
    this.state.mycomps.forEach(c =>   {
roles.push({nom:c,date:todayPlusMonth })
   })
   User.role=roles;
    axios
        .put("http://localhost:4000/test/edit", User)
        .then(res => {
            console.log(User.email===this.state.user.email)
         if(User.email===this.state.user.email){
             localStorage.removeItem("token");
            localStorage.setItem("token", res.data);
            this.props.history.push({
                pathname: "/profile"
            });}
        })
        .catch(err => {
            console.log(err);


        });
    this.handleClose()}
}
    handleShow(u) {
        let comp=[];
       u.role.forEach(e=>{
            comp.push(e.nom)
        });
        this.setState({ show: true, mycomps: comp,editUser : u });
    }
    handleShow2(u) {
        if (u.email === this.state.user.email)
            this.setState({
                show2: true,
                editUser: u, msg: 'attention Votre compte sera perdue a jamais', myA:false,
            });

        else {
            this.setState({
                show2: true,
                editUser: u, msg: 'vous allez supprimer un utilisateur', myA:true,
            });
        }
    }
    componentWillMount() {
        if (localStorage.token === undefined)
            this.props.history.push({
                pathname: "/profile"
            });
        else  if(jwt_decode(localStorage.token).user.role[0].nom !== 'admin' && jwt_decode(localStorage.token).user.role[0].nom !== 'coordinateur')
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
        axios
            .get("http://localhost:4000/test")
            .then(res => {
                console.log(res.data)
              this.setState({
                  users:res.data
              })

            })
            .catch(err => {
                console.log(err);


            });


    }

    render() {
        return (
            <div className="app flex-row align-items-center" >
                <Header />
                <Sidebar {...this.props} routes={routes} image={this.state.image}
                         color="blue"
                         hasImage={this.state.hasImage}/>
                <Alert bsStyle="danger" hidden={true}>
                    <strong>oh no!</strong> verifier vos infos
                </Alert>
                <Modal show={this.state.show2} onHide={this.handleClose2}>
                    <Modal.Header closeButton>
                        <Modal.Title>Supprimer Utilisateur</Modal.Title>
                        <Alert bsStyle="danger" >
                            <strong>oh no!</strong> {this.state.msg}
                        </Alert><div hidden={this.state.myA}>
                        <WarningIcon fontSize="large"     color="action"/></div>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>l'Utilisateur {this.state.editUser.nom} sera supprimer definitivement</h4>

                        <button className="btn btn-danger"  style={{marginTop:'10px',marginBottom:'20px'}} onClick={() => this.delete()}>Supprimer definitivement</button>
                        <br/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose2}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Alert bsStyle="danger" hidden={!this.state.err}>
                            <strong>oh no!</strong> le champ role ne peut pas etre vide
                        </Alert>
                        <Modal.Title>Modifier Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Roles</h4>
                        <Multiselect
                            onChange={mycomps => this.setState({ mycomps })}
                            dropUp
                            value={this.state.mycomps}
                            data={[
                                'admin',
                                'tuteur',
                                'formateur',
                                'porteur',
                                'coordinateur',
                                'apprenant'
                            ]}
                        />
                        <button className="btn btn-primary"  style={{marginTop:'10px',marginBottom:'20px'}} onClick={() => this.save()}>Enregistrer</button>
                 <br/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>



                    <div  style={{marginLeft:"300px"}}  >
                        <h1>List des utilisateurs</h1>
                        <br/>
                        <Table striped bordered condensed hover responsive>
                            <thead>
                            <tr >
                                <th>Nom</th>
                                <th>Prenom</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Etat</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>

                                {this.state.users.map(u => {
                                    return( <tr>
                                            <td>{u.nom}</td>
                                        <td>{u.prenom}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role.map(n=>{return(<>{n.nom } </>)})}
                                        <button style={{float: 'right',marginLeft:'10px'}} className="btn btn-warning" onClick={() => this.handleShow(u)}>Modifier role</button>
                                       </td>
                                        <td hidden={u.isActif}>
                                            <button style={{float: 'right',marginLeft:'10px'}} className="btn btn-secondary" onClick={() => this.toggleActivity(u)}>Inactif</button>

                                        </td>
                                        <td hidden={!u.isActif}>
                                            <button style={{float: 'right',marginLeft:'10px'}} className="btn btn-success" onClick={() => this.toggleActivity(u)}>Actif</button>

                                        </td>
                                        <td>
                                            <button className="btn btn-danger"  onClick={() => this.handleShow2(u)}>supprimer utilisateur</button>

                                       </td>
                                    </tr>)
                                })}

                            </tbody>
                        </Table>
                    </div>
    </div>
        );
    }
}

export default ListUsers;
