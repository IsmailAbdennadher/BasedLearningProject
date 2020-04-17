import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Table,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap';
// react component that creates a switch button that changes from on to off mode
import Switch from 'react-bootstrap-switch';

import Card from 'components/Card/Card.jsx';

import Button from 'elements/CustomButton/CustomButton.jsx';

import img1 from 'assets/img/blog-1.jpg';
import img2 from 'assets/img/blog-2.jpg';
import img3 from 'assets/img/blog-3.jpg';
import img4 from 'assets/img/blog-4.jpg';
import img5 from 'assets/img/blog-5.jpg';

class EquipesAleatoire extends Component{
    constructor(props){
        super(props);
        this.state={
            equipes:[],
            showCheckbox:false,
        };
    }
    handleResponseError(response) {
      throw new Error("HTTP error, status = " + response.status);
  }
  handleError(error) {
      console.log(error.message);
  }
    componentDidMount(){
        console.log('avant formation');
        return fetch("http://localhost:5000/equipes/former/aleatoire/"+this.props.location.state.classe, {
              method: "POST",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json"
                },
              body: JSON.stringify({ idProjet: this.props.location.state.idProjet })
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
    render(){
        return (
            <div className="main-content">
                <Grid fluid>
                    <Row>
                        <Col md={9}>
                        {this.state.equipes.map((props,key) => {
                            return (
                            <Card
                                title={props.nomEquipe}
                                category="les membres de cette equipe"
                                tableFullWidth
                                key={props._id}
                                content={
                                    <Table striped responsive>
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th>Name</th>
                                                <th>Job Position</th>
                                                <th className="text-right">Salary</th>
                                                <th className="text-right">Active</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {props.membres.map((prop,keys) => {
                                            return(
                                            <tr key={keys}>
                                                <td className="text-center">{keys+1}</td>
                                                <td>{prop.nom}</td>
                                                <td>{prop.classe}</td>
                                                <td className="text-right">€ 99,225</td>
                                                <td className="text-right">
                                                    <Switch
                                                        onText=""
                                                        offText=""
                                                        defaultValue={false}
                                                    />
                                                </td>
                                            </tr>
                                            );
                                            })}
                                        </tbody>
                                    </Table>
                                }
                            />
                            );
                            })}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default EquipesAleatoire;
