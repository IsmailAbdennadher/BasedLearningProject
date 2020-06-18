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

class EquipesAleatoire extends Component{
    constructor(props){
        super(props);
        this.state={
            equipes:[],
            showCheckbox:false,
            memberChecked:new Map(),
            toPermutekey:[],
            toPermutevalue:[],
            toPermutevalue1:[],
            value:[],
            _notificationSystem: null
        };
        this.handleNotificationClick=this.handleNotificationClick.bind(this);
    }
    handleClick(){

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
    getEquipesUpdated(updated){
        for (var i = 0; i < this.state.equipes.length; i++) {
            for(var key of updated){
                if(key._id==this.state.equipes[i]._id){
                    this.state.equipes[i]=key;
                }
            }
        }
    }
    fairePermutation(){
        //this.setState({showCheckbox:true});
        this.handleNotificationClick("Veuillez selectionner les membres d'un groupe à permuter puis cliquer sur 'faire une permutation'.");
        const x=document.getElementsByClassName('hidden pre'); //var fi 3oudh const da5elha fi 7it haha
        const td=document.getElementsByClassName('action');
        for (var i = 0; i < x.length; i) {
            x.item(i).className="btn btn-default";
        }
        for (var i = 0; i < td.length; i++) {
            td.item(i).removeAttribute("hidden");
        }
        document.getElementById('btnPermute').className +=" hidden";
    }
    async confirmerPermutation(){
        if(this.state.memberChecked.size>2){
            alert("Veuillez selectionner des membres d'une meme equipe");
            this.state.memberChecked.clear();
            this.state.value=[];
            const c=document.getElementsByTagName('input');
            for (var i = 0; i < c.length; i++) {
                console.log('attribut'+c.item(i).getAttribute('type'));
            c.item(i).checked=false;
            }
        }
        else{
            for(var [key,value] of this.state.memberChecked.entries()){
                if(key == this.state.toPermutekey[0]){
                    console.log('key'+key);
                    continue;
                }
                else{
                    this.state.toPermutekey.push(key);
                    if(this.state.value.length!=0){
                    this.state.value=([...new Set(this.state.value)]);
                    for(var w of this.state.value){
                        this.state.toPermutevalue1.push(w);
                    }
                    this.state.value=[];
                    }
                if(!this.state.toPermutevalue1.includes(value))
                    {this.state.toPermutevalue1.push(value);}
                }
            }
            fetch("http://localhost:4000/equipes/permute/", {
              method: "POST",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json"
                },
              body: JSON.stringify({ key: this.state.toPermutekey,valeur1: this.state.toPermutevalue,valeur2:this.state.toPermutevalue1 })
            })
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                console.log('ici');
                console.log(response);
                return response.json();
              }).then(equipe => {
                  console.log(equipe);
                  this.getEquipesUpdated(equipe);
                  //this.setState({equipes:equipe});
                  localStorage.setItem('equipes',JSON.stringify(this.state.equipes));
                  alert('Les equipes ont été mis a jour');
                  window.location.reload();
              })
              .catch(error => {
                this.handleError(error);
              });
        }
        console.log('terminé');
        var ss=Array.from(new Set(this.state.toPermutevalue));
        console.log('membres to permute'+JSON.stringify(ss));
        console.log('with'+this.state.toPermutevalue1);
    }
    plutard(){

        if(this.state.toPermutekey.length!=0){
                //console.log(this.state.toPermute);
                for(var [key,value] of this.state.memberChecked.entries()){
                    if(key !=this.state.toPermutekey[0])
                        {this.state.toPermutekey.push(key);
                            this.state.toPermutevalue.push(value);
                    fetch("http://localhost:4000/equipes/permute/", {
              method: "POST",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json"
                },
              body: JSON.stringify({ key: this.state.toPermutekey,valeur1: this.state.toPermutevalue,valeur2:this.state.toPermutevalue1 })
            })
              .then(response => {
               if (!response.ok) {
                    this.handleResponseError(response);
                }
                console.log('ici');
                console.log(response);
                return response.json();
              }).then(equipe => {
                  console.log(equipe);
                  this.setState({equipes:equipe});
              })
              .catch(error => {
                this.handleError(error);
              });
                }
            }
            }
    }
    handleChecked(){
        if(this.state.memberChecked.size>1){
            alert("Veuillez selectionner des membres d'une meme equipe");
            this.state.memberChecked.clear();
            this.state.value=[];
            const c=document.getElementsByTagName('input');
            console.log('ccc==='+c.length);
            for (var i = 0; i < c.length; i++) {
            c.item(i).checked=false;
        }
        }
        else{
            for(var [key,value] of this.state.memberChecked.entries()){
                this.state.toPermutekey.push(key);
                //console.log('value='+this.state.memberChecked.get(key));
                if(this.state.value.length!=0){
                    this.state.value=([...new Set(this.state.value)]);
                    for(var z of this.state.value){
                        this.state.toPermutevalue.push(z);
                    }
                    this.state.value=[];
                }
                if(!this.state.toPermutevalue.includes(value))
                    {this.state.toPermutevalue.push(value);}
                const t=document.getElementsByClassName('btn btn-default');
                for (var i = 0; i < t.length; i++) {
                    t[i].className +=" hidden";
                }
                const p=document.getElementsByClassName('hidden confirmation');
                for (var i = 0; i < p.length; i) {
                    p[i].className ="btn btn-default";
                }
                document.getElementById("table"+key).setAttribute("hidden","");
                this.handleNotificationClick("Selectionner maintenant les membres à permuter avec puis confimer en cliquant sur 'permuter avec cette equipe'.");
            }
            
        }
    }
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
                            if(props.membres.length>0){
                            return (
                            <Card
                                title={props.nomEquipe}
                                category="les membres de cette equipe"
                                tableFullWidth
                                key={props._id}
                                content={
                                    <Table id={"table"+props._id} striped responsive>
                                        <thead>
                                            <tr>
                                                <th className="text-left">#</th>
                                                <th>Nom</th>
                                                <th>Classe</th>
                                                <th className="text-right action" hidden>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {props.membres.map((prop,keys) => {

                                            return(
                                            <tr key={keys}>
                                                <td className="text-left">{keys+1}</td>
                                                <td>{prop.nom } {prop.prenom? prop.prenom:""}</td>
                                                <td>{prop.classe}</td>
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
                                        <Button id={props._id} onClick={() => {this.handleNotificationClick('tc');
                                            this.handleChecked();}} className={this.state.showCheckbox ? '' : 'hidden pre'}>faire une permutation</Button>
                                        <Button onClick={this.confirmerPermutation.bind(this)} className='hidden confirmation'>permuter avec cette equipe</Button>
                                        </tr>
                                        </tfoot>
                                    </Table>
                                }
                            />
                            );
                        }
                            })}
                       <Button id="btnPermute" onClick={this.fairePermutation.bind(this)}>Effectuer des permutations</Button>
                       
                       //<Button id="SubmitPermute" className="hidden" onClick={this.fairePermutation.bind(this)}>Confirmer permutation</Button>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default EquipesAleatoire;
