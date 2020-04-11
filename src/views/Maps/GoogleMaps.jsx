import React, { Component } from 'react';
import {
    Grid, Row, Col
} from 'react-bootstrap';
// react components used to create a google map
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

import MapCard from 'components/Card/MapCard.jsx';

class GoogleMaps extends Component{
    render(){
        return (
            <div className="main-content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <MapCard
                                title="Satellite Map"
                                content={
                                    <Map
                                        mapType={'Satellite'}
                                        containerStyle={{position: 'relative'}}
                                        style={{width: '100%', height: '300px', position: 'relative'}}
                                        google={this.props.google}
                                        initialCenter={{
                                          lat: 40.7484405,
                                          lng: -73.9856644
                                        }}
                                        zoom={3}
                                        clickableIcons={false}
                                    >
                                        <Marker onClick={this.onMarkerClick}
                                            name={'Current location'}
                                        />
                                    </Map>
                                }
                            />
                        </Col>
                        <Col md={12}>
                            <MapCard
                                title="Regular Map"
                                content={
                                    <Map
                                        containerStyle={{position: 'relative'}}
                                        style={{width: '100%', height: '300px', position: 'relative'}}
                                        google={this.props.google}
                                        initialCenter={{
                                          lat: 40.7484405,
                                          lng: -73.9856644
                                        }}
                                        zoom={13}
                                        clickableIcons={false}
                                    >
                                        <Marker onClick={this.onMarkerClick}
                                            name={'Current location'}
                                        />
                                    </Map>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
export default GoogleApiWrapper({
    apiKey: "YOUR_API_KEY_HERE"
})(GoogleMaps);
