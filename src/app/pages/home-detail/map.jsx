import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Col, Dropdown, Image, List, Menu, Row, Segmented, Space, Spin } from "antd";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import config from "../../config";

const homeMap = ({ Home, google }) => {
    return (
        <Map
            google={google}
            containerStyle={{
                position: 'relative',
                width: '100%',
                height: '400px'
            }}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }}
            initialCenter={{
                lat: Home.geo.lat,
                lng: Home.geo.lng
            }}
        //   zoom={15}
        //   onClick={this.onMapClicked}
        >
            <Marker
                name={"Current location"}
                // icon={{
                //     // url: HeartImg,
                //     anchor: new google.maps.Point(32, 32),
                //     scaledSize: new google.maps.Size(32, 32),
                // }}
                position={{
                    lat: Home.geo.lat,
                    lng: Home.geo.lng
                }}
            // onClick={(_, marker) => onMarkerClick(marker, home, leadData)}
            />
            <Marker name={'Current location'} />
        </Map>
    );
}


export default GoogleApiWrapper({
    apiKey: config.googleMapsAPIkey,
})(homeMap);
