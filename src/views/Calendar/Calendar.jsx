
import React, { Component } from 'react';
//import { Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from "axios";
//import 'react-big-scheduler/lib/css/style.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
//import withDragDropContext from './test'
import BigCalendar from 'react-big-calendar'

import {
  Modal, Button
} from 'react-bootstrap';

const localizer = BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
  state = {
    evt: [],
    modal: false,
    selectedEvent: {},
    startDate: new Date(),
    endDate: new Date()
  }
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
  }
  onSelectEvent(event, e) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedEvent: {
        name: event.title,
        description: event.description
      },
      startDate: event.start,
      endDate: event.end
    }));
    console.log(event);
  }
  toggle() {
    console.log('dkhlt')
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  componentDidMount() {

    const events = [];
    axios.get("http://localhost:5000/liste").then(
      result => {
        let evts = result.data;
        evts.forEach(element => {
          let e = {
            id: element._id,
            title: element.nom,
            description: element.description,
            start: new Date(element.dateEvent),
            end: new Date(element.dateEvent)
          }
          console.log(e)
          events.push(e);
        });
        this.setState({
          evt: events
        })
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
    this.setState({
      evt: events
    })
  }



  render() {
    return (
      <div className="animated fadeIn">


        <BigCalendar
          localizer={localizer}
          events={this.state.evt}
          defaultView='week'
          views={['month', 'week', 'day']}
          defaultDate={new Date()}
          onSelectEvent={this.onSelectEvent}
        />
        <Modal show={this.state.modal} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.selectedEvent.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.selectedEvent.description}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => { this.toggle() }}>
              Close
          </Button>
          </Modal.Footer>
        </Modal>
      </div>)


  }
}


//export default withDragDropContext(Calendar);
export default (Calendar);
