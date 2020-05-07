import React, { Component } from "react";
import "../assets/css/isConnect.css";
import jwt_decode from "jwt-decode";
class IsConnect extends Component {
  constructor() {
    super();
    this.state = {
      nom: "",
      prenom: "",
      notification: "",
      notificationBool: false
    };
  }
  componentWillMount() {

    var user = jwt_decode(localStorage.token).user;
    this.setState({
      nom: user.nom,
      prenom: user.prenom,
      classe: user.classe
    });
  }
  disconnect() {
    localStorage.removeItem("token");
    this.props.disconnect();
  }

  render() {
    return (
      <div className="container-fluid isConnect">
        <ul>

             <li>
            {this.state.nom}
            {this.state.prenom} - {this.state.classe}
          </li>
          <li onClick={this.disconnect.bind(this)}>Déconnexion</li>
        </ul>
      </div>
    );
  }
}

export default IsConnect;