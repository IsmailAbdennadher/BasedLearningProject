import React, { Component, Fragment } from 'react';
import {
    Grid, Row, Col,
    Table,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap';
// react component that creates a switch button that changes from on to off mode
import Switch from 'react-bootstrap-switch';

import Card from '../../components/Card/Card.jsx';

import Button from '../../elements/CustomButton/CustomButton.jsx';
import Checkbox from '../../elements/CustomCheckbox/CustomCheckbox.jsx';

import Notifications from '../../views/Components/Notifications.jsx';

import { style } from "../../variables/Variables.jsx";

import NotificationSystem from 'react-notification-system';

import img1 from '../../assets/img/blog-1.jpg';
import img2 from '../../assets/img/blog-2.jpg';
import img3 from '../../assets/img/blog-3.jpg';
import img4 from '../../assets/img/blog-4.jpg';
import img5 from '../../assets/img/blog-5.jpg';

class EquipesChoixTable extends Component{
    constructor(props){
        super(props);
        this.state={
            equipes:[],
            showCheckbox:false,
            memberChecked:new Map(),
            listIdEquipes:[],
            toPermutevalue:[],
            toPermutevalue1:[],
            value:[],
            _notificationSystem: null
        };
        //this.handleClick();
    }
    handleClick(){
        return fetch("http://localhost:4000/equipes/equipes/3A33")
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(equipes => {
                  this.setState({equipes:equipes});

              })
              .catch(error => {
                this.handleError(error);
              });
    }
    handleResponseError(response) {
      throw new Error("HTTP error, status = " + response.status);
  }
  handleError(error) {
      console.log(error.message);
  }
    componentDidMount(){
        this.setState({_notificationSystem: this.refs.notificationSystem});
        console.log('avant formation');
        this.state.equipes=JSON.parse(localStorage.getItem('equipes'));
        //this.setState({equipes:this.props.location.state.equipes});
    }
    getEquipesId(){
        for (var i = 0; i < this.state.equipes.length; i++) {
            this.state.listIdEquipes.push(this.state.equipes[i]._id);
        }
    }
    /*fairePermutation(){
        this.getEquipesId();
        fetch("http://localhost:4000/sujets/affecter/aleatoire" , {
              method: "POST",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json"
                },
              body: JSON.stringify({ listEquipes: this.state.listIdEquipes })
            })
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
              }).then(equipes => {
                  this.setState({equipes:equipes});

              })
              .catch(error => {
                this.handleError(error);
              });
    }*/
    handleNotificationClick(message){
        this.state._notificationSystem.addNotification({
            title: (<span data-notify="icon" className="pe-7s-gift"></span>),
            message: (
                <div>
                    {message}
                </div>
            ),
            level: 'info',
            position: "tc",
            autoDismiss: 6,
        });
    }
    render(){
        return (
            <div className="main-content">
            <NotificationSystem ref="notificationSystem" style={style}/>
                <Grid fluid>
                    <Row>
                        <Col md={9}>
                        {this.state.equipes.map((props,key) => {
                            return (
                            <Card
                                title={props.nomEquipe}
                                category="les choix de cette equipe"
                                tableFullWidth
                                key={props._id}
                                content={
                                    <Table id={"table"+props._id} striped responsive>
                                        <thead>
                                            <tr>
                                                <th className="text-left">Choix n°</th>
                                                <th>Titre</th>
                                                <th className="text-right action" hidden>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {props.choixSujet.map((prop,keys) => {
                                            console.log('jawek fes fes');
                                            var color=props.sujet;
                                            var styling="white";
                                            color ? (props.sujet.titre===prop.titre ? styling="lightblue" : color=false) : color=false ;

                                            return(
                                            <tr key={keys} style={ {backgroundColor : styling} }>
                                                <td className="text-left">{keys+1}</td>
                                                <td>{prop.titre}</td>
                                                <td className="text-right action" hidden>
                                                    <Checkbox
                                                        isChecked={false}
                                                        number={prop._id}
                                                        value={props._id}
                                                        onClick={(e) => {if(this.state.memberChecked.has(e.target.value))
                                                                              {this.state.value.push(this.state.memberChecked.get(e.target.value));
                                                                               this.state.memberChecked.set(e.target.value,e.target.id);}
                                                                              else{
                                                                                  this.state.memberChecked.set(e.target.value,e.target.id);
                                                                              }
                                                                          }}
                                                    />
                                                </td>
                                            </tr>

                                            );
                                            
                                            })}
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                        <span style={ {color : "blue"} }>{props.sujet ? "Sujet affecté: "+props.sujet.titre : "Sujet affecté: aucun sujet n'est affecté"}</span>
                                        </tr>
                                        </tfoot>
                                    </Table>
                                }
                            />
                            );
                            })}
                       {/*<Button id="btnPermute" onClick={this.fairePermutation.bind(this)}>Attribuer les sujets</Button>*/}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default EquipesChoixTable;
