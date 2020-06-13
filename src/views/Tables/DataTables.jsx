import React, { Component } from 'react';
import axios from 'axios'
// jQuery plugin - used for DataTables.net
import $ from 'jquery';
import {
    Grid, Row, Col
} from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import {
    Switch,
    Route,
    Redirect,
    Link,
    BrowserRouter as Router
} from 'react-router-dom';
import EventEdit from 'views/Forms/EventEdit.jsx';
// DataTables.net plugin - creates a tables with actions on it
require('datatables.net-responsive');
$.DataTable = require('datatables.net-bs');






class DataTables extends Component{
    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            show: false,
            posts:[]
        }
        this.hideAlert = this.hideAlert.bind(this);
        this.res = this.res.bind(this);
        this.warningWithConfirmMessage= this.warningWithConfirmMessage.bind(this);
        this.warningWithConfirmMessageSupp= this.warningWithConfirmMessageSupp.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:5000/liste') 
        .then(response => {
            console.log(response)
            this.setState({posts: response.data})

        })
        .catch(error =>{
            console.log(error)
        })
    }
    hideAlert(){
        this.setState({
            alert: null
        });
    } 
    deleteEvents(id) {
        axios.delete('http://localhost:5000/delete/'+ id)
        .then((res) => {
            console.log('Student successfully deleted!')
        }).catch((error) => {
            console.log(error)
        })
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{display: "block",marginTop: "-100px"}}
                    title="Supprimé!"
                    onConfirm={() => window.location.reload()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    L evenement a été supprimé.
                </SweetAlert>
            )
        });
    }
    warningWithConfirmMessageSupp(id){
        this.setState({
            alert: (
                <SweetAlert
                    warning
                    style={{display: "block",marginTop: "-100px"}}
                    title="Etes vous sûre?"
                    onConfirm={() => this.deleteEvents(id)}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                    cancelBtnBsStyle="danger"
                    confirmBtnText="Oui, Supprimer l evenement!"
                    cancelBtnText="Annuler"
                    showCancel
                >
                    Cette action est irréversible.
                </SweetAlert>
            )
        });
    }
    res(id,nombrePlace) {
        var a ={
            "_id":"5edf7be2de87b852043c826d"
      
        }
        console.log('aziz')
   
     console.log(nombrePlace)
     console.log('aziz')
   if(nombrePlace==0){
   
        this.setState({
            alert: (
                <SweetAlert
                    style={{display: "block",marginTop: "-100px"}}
                    title="il n'existe plus des place pour cet evenement"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                />
            )
        });
    
   }else{
    axios.post('http://localhost:5000/part/'+id,a)
        .then((res) => {
            console.log('aaaaaaaaaaaaaaaaaaaaa')
            console.log(res.data)
            
            if (res.data==1){
                this.setState({
                    alert: (
                        <SweetAlert
                            success
                            style={{display: "block",marginTop: "-100px"}}
                            title="Oups!"
                            onConfirm={() => window.location.reload()}
                            onCancel={() => this.hideAlert()}
                            confirmBtnBsStyle="info"
                        >
vous avez deja effectué une reservation                       
                        </SweetAlert>
                    )
                });
               
            }
            if(res.data==0){
                this.setState({
                    alert: (
                        <SweetAlert
                            success
                            style={{display: "block",marginTop: "-100px"}}
                            title="Réserve!"
                            onConfirm={() => window.location.reload()}
                            onCancel={() => this.hideAlert()}
                            confirmBtnBsStyle="info"
                        >
                            L evenement a été reserver.
                        </SweetAlert>
                    )
                });
                axios.get('http://localhost:5000/res/'+id)
                .then((res) => {
                    console.log('Student successfully deleted!')
                }).catch((error) => {
                    console.log(error)
                })
            }
            console.log('aaaaaaaaaaaaaaaaaaaaa')
        }).catch((error) => {
            console.log(error)
        })
        
   }
       
        

    }
    warningWithConfirmMessage(id,nombrePlace){
        this.setState({
            alert: (
                <SweetAlert
                    warning
                    style={{display: "block",marginTop: "-100px"}}
                    title="Etes vous sûre?"
                    onConfirm={() => this.res(id,nombrePlace)}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                    cancelBtnBsStyle="danger"
                    confirmBtnText="Oui, reserver l evenement!"
                    cancelBtnText="Annuler"
                    showCancel
                >
                    Cette action est irréversible.
                </SweetAlert>
            )
        });
    }
    
    render() {
        const { posts }= this.state
        return (
            <div className="main-content">
                 {this.state.alert}
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <h4 className="title">liste des evenements</h4>
                            
                            <Card
                                title="EVENEMENTS"
                                content={
                                    <div className="fresh-datatables">
                                        <table id="datatables" ref="main" className="table table-striped table-no-bordered table-hover" cellSpacing="0" width="100%" style={{width:"100%"}}>
                                           
                                            <thead>
                                                <tr>
                                                <th>Nom Event</th>
                                                <th>TYPE EVENT</th>
                                                <th>DATE EVENT</th>
                                                <th>NOMBRE DE PLACE</th>
                                                <th>DESCRIPTION</th>
		                                        <th>LIEU</th>
                                                <th>IMAGE</th>
		                                      	<th>CATEGORIE</th>
                                                 
                                                </tr>
                                            </thead>
                             <tbody>              
                                            {posts.map((p, i) => {
            //const splitPath = p.posts.split("\\");
           // const path = splitPath[splitPath.length - 1];
            return (
              <tr key={i}>
                <td>{p.nom}</td>
                <td>{p.type}</td>
				 <td>{p.dateEvent}</td>
				  <td>{p.nombrePlace}</td>
				    <td>{p.description}</td>
					 <td>{p.lieu}</td>
                      <td>{p.image}</td>
					 <td>{p.categorie}</td>
                <td>
                </td>
                <td>
                </td> 
                <td >
                                                      
                <button className="btn-wd btn btn-danger" onClick={this.warningWithConfirmMessageSupp.bind(this,p._id)}><span className="btn-label"><i className="fa fa-trash"></i></span>supprimer</button>
                <button className="btn-wd btn btn-default"><span className="btn-label"><i className="fa fa-edit"></i></span><Link to={"/edit/event/"+p._id}>Modifier </Link></button>
                <button className="btn-wd btn btn-danger" onClick={this.warningWithConfirmMessage.bind(this,p._id,p.nombrePlace)}><span className="btn-label"><i className="fa fa-trash"></i></span>reserver</button>
                                                                
                                                                </td>
              </tr>
            );
          })}
        </tbody>
                                        </table>
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default DataTables;
