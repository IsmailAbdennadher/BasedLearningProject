import React, { Component } from 'react';
import axios from "axios";
import {Alert, Table, Label, FormControl, FormGroup, ControlLabel} from 'react-bootstrap'
import Header from "./Header"
import Sidebar from "components/Sidebar/Sidebar";
import routes from "routes.js"
import jwt_decode from "jwt-decode";
import {Multiselect} from "react-widgets";

class Group extends Component {

    constructor(props) {
        super(props);

        this.state = {editUser:[],
            err:true,
            err2:true,
            err3:true,
            groups:[],
            tuts:[],
            mycomp:[],
            users: [],
            UE:"C#/.Net" ,
           };


        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({UE: event.target.value});
    }

    createGroup(){
var t = []
        this.state.users.forEach(e=>{
            if(e.groupe.length===0&&e.role[0].nom==="tuteur")
                t.push(e)
        })
        if(t.length<1)
            this.setState({
                err:false
            })
        else{
           const obj = {email:t[0].email}
           console.log(obj)
            axios
                .post("http://localhost:4000/test/group-random",obj)
                .then(res => {
                    console.log(res.data)
window.location.reload()

                })
                .catch(err => {
                    console.log(err);


                });
        }

    }
    createGroupUE() {
        console.log("UE: "+this.state.UE)
        var t = []
        this.state.users.forEach(e => {
            if (e.groupe.length === 0 && e.role[0].nom === "tuteur")
                t.push(e)
        })
        if (t.length < 1)
            this.setState({
                err: false
            })
        
        else {

                 const obj = {email:t[0].email,nomCompetance:this.state.UE}
                 console.log(obj)
                 axios
                     .post("http://localhost:4000/test/group-by-UE",obj)
                     .then(res => {
                         console.log(res.data)
                         if(res.data.groupe.length===0)
                             this.setState({
                                 err3:false
                             })
                         else
                             window.location.reload()


                     })
                     .catch(err => {
                         console.log(err);


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
            axios
                .get("http://localhost:4000/test")
                .then(res => {
                    console.log(res.data)
                    var g = []
                    res.data.forEach(e=>{
                        if(e.groupe.length!==0)
                            g.push({group:e.groupe,tuteurs:e.nom+" "+e.prenom})
                    })
                    console.log(g)
                    this.setState({
                        users:res.data,
                        groups:g
                    })

                })
                .catch(err => {
                    console.log(err);


                });
        }


    }
    componentDidMount() {


    }

    render() {
        return (
            <div className="app flex-row align-items-center" >
                <Header />
                <Sidebar {...this.props} routes={routes} image={this.state.image}
                         color="blue"
                         hasImage={this.state.hasImage}/>
                         <div style={{marginLeft:"300px"}}>
                <Alert bsStyle="danger" hidden={this.state.err}>
                    <strong>oh no!</strong> pas de tuteur disponible
                </Alert>
                <Alert bsStyle="warning" hidden={this.state.err2}>
                    <strong>oh no!</strong> specifier les UE
                </Alert>
                             <Alert bsStyle="warning" hidden={this.state.err3}>
                    <strong>oh no!</strong> pas d'apprenant disponible pour se critére
                </Alert></div>
                <div  style={{marginLeft:"300px"}}  >
                    <h1>List des Tuteurs</h1>
                    <br/>
                    <Table striped bordered condensed hover responsive>
                        <thead>
                        <tr >
                            <th>Nom</th>
                            <th>Prenom</th>
                            <th>Email</th>
                            <th>Etat</th>
                            <th>Groupe</th>
                        </tr>
                        </thead>
                        <tbody>

                        {this.state.users.map(u => {
                            console.log(u.groupe.length)
                            if(u.role[0].nom==="tuteur")
                            return( <tr>
                                <td>{u.nom}</td>
                                <td>{u.prenom}</td>
                                <td>{u.email}</td>

                                <td  hidden={ u.isActif}><Label style={{fontSize:"15px"}} bsStyle="danger">inactif</Label></td>
                                <td hidden={ !u.isActif}><Label style={{fontSize:"15px"}} bsStyle="success" >actif</Label></td>
                                   <td hidden={u.groupe.length===0}>{
                                       u.groupe.map(n=>
                                   {
                                       return(<>{"-"+n.nom+" "+n.prenom } <br/></>)})}
                                </td>
                                <td hidden={u.groupe.length!==0}>
                                   pas de groupes.
                                </td>
                            </tr>)
                        })}

                        </tbody>
                    </Table>
                </div>
                <div  style={{marginLeft:"300px"}}  >
                    <h1>List des Groupes</h1>
                    <br/>
                    <Table striped bordered condensed hover responsive>
                        <thead>
                        <tr >
                            <th>Etudiants</th>
                            <th>Tuteurs</th>

                        </tr>
                        </thead>
                        <tbody>

                        {this.state.groups.map(u => {

                                return( <tr>

                                    <td>{u.group.map(g=>{
                                        console.log(g)
                                        return(<>{g.nom+" "+g.prenom    }<br/></>)})}</td>
                                    <td>{u.tuteurs}</td>
                                </tr>)
                        })}

                        </tbody>
                    </Table>
                    <button className="btn btn-danger"  onClick={() => this.createGroup()}>Ajouter Groupe</button>
                    <div style={{display:"flex",float: 'right'}}>
                    <button className="btn btn-danger"  onClick={() => this.createGroupUE()}>Ajouter UE Groupe</button>

                    <div style={{width:'300px'}}>
                        <select value={this.state.UE} onChange={this.handleChange} style={{width:'150px',height:'50px',fontSize:'20px'}}  >
                            <option value="Java">Java</option>
                            <option value="Python">Python</option>
                            <option selected value="C#/.Net">C#/.Net</option>
                            <option value="Mean">Mean</option>
                            <option value="Ruby">Ruby</option>
                        </select>
                    </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Group;
