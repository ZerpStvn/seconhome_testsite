import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker, Circle } from "google-maps-react";
import {
  Button,
  Row,
  Col,
  Input,
  AutoComplete
} from "antd";
import Geocode from "react-geocode";
import Config from "../../config"
import axios from "axios";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';


var mapStyles = {
  container: {
    position: "relative",
    width: "100%",
    height: "400px"
  },
  map: {
    position: "relative",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
};

const googleMapsAPIkey = Config.googleMapsAPIkey || 'AIzaSyA6eaMRrfLzlYUe-H1sL6D9tkVXjS6O7BQ';

Geocode.setApiKey(googleMapsAPIkey);
//Geocode.enableDebug();

class Locator extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.mapRef = React.createRef();
    this.circleRef = React.createRef();
    this.markerRef = React.createRef();
    this.addressInput = React.createRef();
    this.state = {
      markers: [],
      cloneMarkers: [],
      locations: [],
      activeMarker: {},
      showingDetails: true,
      latLngFromAddress: {},
      zoom: 17,
      formData: "",
      geocodeError: "",
      locateBtnText: "Locate",
      radiusdata: [],
      isCheckbox: false,
      locateBtnDisabled: true,
      locationObj: {
        address: null,
        address_2: null,
        city: null,
        state: null,
        zip: null
      },
      addressOptions: []
    };
    this.onMarkerDrag = this.onMarkerDrag.bind(this);
    this.onLngChange = this.onLngChange.bind(this);
    this._map = null;
  }

  autoCenterMap = ({ google }, map) => {
    this._map = map;
    const bounds = new google.maps.LatLngBounds();
    if (
      typeof this.state.markers !== "undefined" &&
      this.state.markers.length > 0
    ) {
      this.state.markers.forEach(mrk => {
        const { lat, lng } = mrk;
        map.panTo({ lat, lng });
        bounds.extend(new google.maps.LatLng(lat, lng));
      });
    }
  };

  async componentDidMount() {
    let position = {};
    if (this.props.cords && this.props.cords.lat && this.props.cords.lat !== "") {
      position.lat = parseFloat(this.props.cords.lat);
      position.lng = parseFloat(this.props.cords.lng);
      this.setState({
        markers: [position],
        zoom: this.state.zoom
      });
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            position.lat = pos.coords.latitude;
            position.lng = pos.coords.longitude;

            this.setState({
              markers: [position],
              zoom: this.state.zoom
            }, () => this.onChangeLatLngOrDragMarker(position, false));
          },
          () => {
            position.lat = 43.653225;
            position.lng = -79.383186;
            this.setState({
              markers: [position],
              zoom: this.state.zoom
            }, () => this.onChangeLatLngOrDragMarker(position, false));
          }
        );
      } else {
        position.lat = 43.653225;
        position.lng = -79.383186;
        this.setState({
          markers: [position],
          zoom: this.state.zoom
        }, () => this.onChangeLatLngOrDragMarker(position, false));
      }
    }
    if (this.props.defaultAddress) {
      this.setState({
        address: this.props.defaultAddress
      })
    }
    /* if(this.markerRef !== null && this.markerRef.current && this.circleRef !== null && this.circleRef.current){
      this.markerRef.current.addListener('drag', function(event) {                     
        this.circleRef.current.setOptions({center:{lat:event.latLng.lat(),lng:event.latLng.lng()}});        
      });
    } */
  }

  getLatLngFromAddress = () => {
    this.setState({ geocodeError: "", locateBtnText: "Please wait.." });
    let address = this.state.address;
    if (address !== "") {
      Geocode.fromAddress(address).then(
        response => {
          this.setState({
            locateBtnText: "Locate",
            latLngFromAddress: response.results[0].geometry.location
          });
          this.setState({
            markers: [
              {
                lat: response.results[0].geometry.location.lat,
                lng: response.results[0].geometry.location.lng
              }

            ],
            showingInfoWindow: true,
            showingDetails: true,
            zoom: this.state.zoom
          }, () => {
            let position = {
              lat: response.results[0].geometry.location.lat,
              lng: response.results[0].geometry.location.lng
            };
            this.getAddressFromLatLng(position).then(response => {
              this.setState({
                locateBtnDisabled: !((response.address && response.address !== '') || (this.state.address && this.state.address !== '')),
                address: response.address,
                locationObj: response
              }, () => this.onChangeLatLngOrDragMarker(position, false));
            });
          });
          this._map.panTo(response.results[0].geometry.location);
        }
      ).catch(e => {
        this.setState({ geocodeError: "No results found. Please try with different keywords.", locateBtnText: "Locate" });
      });
    }
  };

  getLatLngFromAddress2 = (address) => {
    this.setState({ geocodeError: "", locateBtnText: "Please wait.." });
    if (address !== "") {
      Geocode.fromAddress(address).then(
        response => {
          this.setState({
            locateBtnText: "Locate",
            latLngFromAddress: response.results[0].geometry.location
          });
          this.setState({
            markers: [
              {
                lat: response.results[0].geometry.location.lat,
                lng: response.results[0].geometry.location.lng
              }

            ],
            showingInfoWindow: true,
            showingDetails: true,
            zoom: this.state.zoom
          }, () => {
            let position = {
              lat: response.results[0].geometry.location.lat,
              lng: response.results[0].geometry.location.lng
            };
            this.getAddressFromLatLng(position).then(response => {
              this.setState({
                locateBtnDisabled: !((response.address && response.address !== '') || (this.state.address && this.state.address !== '')),
                address: response.address,
                locationObj: response
              }, () => this.onChangeLatLngOrDragMarker(position, false));
            });
          });
          this._map.panTo(response.results[0].geometry.location);
        }
      ).catch(e => {
        this.setState({ geocodeError: "No results found. Please try with different keywords.", locateBtnText: "Locate" });
      });
    }
  };

  onMarkerDrag = (_props, marker) => {
    let tempMarker = this.state.markers[0];
    let position = {
      lat: marker.position.lat(),
      lng: marker.position.lng()
    };
    this.getAddressFromLatLng(position).then(response => {
      this.setState({
        locateBtnDisabled: !((response.address && response.address !== '') || (this.state.address && this.state.address !== '')),
        address: response.address,
        locationObj: response
      }, () => this.onChangeLatLngOrDragMarker(position, false));
    });
    tempMarker.lat = position.lat;
    tempMarker.lng = position.lng;
    if (this.circleRef !== null && this.circleRef.circle !== null) {
      this.circleRef.circle.center = (position);
    }
    this.setState({ markers: [tempMarker] }, () => this.onChangeLatLngOrDragMarker(position, false));
  };

  onLatChange = (e) => {
    let position = {
      lat: e.currentTarget.value,
      lng: this.state.markers.length > 0 && this.state.markers[0].lng ? this.state.markers[0].lng : 0
    };
    this.getAddressFromLatLng(position).then(response => {
      this.setState({
        locateBtnDisabled: !((response.address && response.address !== '') || (this.state.address && this.state.address !== '')),
        address: response.address,
        locationObj: response
      }, () => this.onChangeLatLngOrDragMarker(position));
    });
    this.setState({
      markers: [position]
    }, () => this.onChangeLatLngOrDragMarker(position));
  }

  onLngChange = (e) => {
    let position = {
      lat: this.state.markers.length > 0 && this.state.markers[0].lat ? this.state.markers[0].lat : 0,
      lng: e.currentTarget.value
    };
    this.getAddressFromLatLng(position).then(response => {
      this.setState({
        locateBtnDisabled: !((response.address && response.address !== '') || (this.state.address && this.state.address !== '')),
        address: response.address,
        locationObj: response
      }, () => this.onChangeLatLngOrDragMarker(position));
    });
    this.setState({
      markers: [position]
    }, () => this.onChangeLatLngOrDragMarker(position));
  }

  onChangeLatLngOrDragMarker = (position, focus) => {
    if (typeof focus === 'undefined') {
      focus = true;
    }
    this.props.on_locate(position, this.state.locationObj);
  }

  onChangeLocatorLocation = (e) => {
    let _locationObj = this.state.locationObj;
    // debugger;
    _locationObj.address = e.currentTarget.value;
    this.setState({
      locateBtnDisabled: !(e.currentTarget.value !== ''),
      address: e.currentTarget.value,
      locationObj: _locationObj
    }, () => {
      this.z(null, false);
    });
  }

  onPressLocatorEnterKey = (e) => {
    if (e.currentTarget.value !== '') {
      var code = e.keyCode || e.which;
      if (code === 13) {
        this.getLatLngFromAddress();
        e.preventDefault();
      }
    }
  }

  getAddressFromLatLng = async (position) => {
    let _locationObj = this.state.locationObj;
    await Geocode.fromLatLng(position.lat, position.lng).then(positionDetails => {
      let addressComponent = positionDetails.results[0];

      let drCountryAlpha = '';
      if (positionDetails && positionDetails.plus_code && positionDetails.plus_code.compound_code) {
        drCountryAlpha = positionDetails.plus_code.compound_code.split(',');
        drCountryAlpha = drCountryAlpha[drCountryAlpha.length - 1].trim();
      }

      let drCountry = positionDetails.results.find(r => r.types.indexOf("country") > -1);
      if (drCountry && drCountry.formatted_address) {
        drCountry = drCountry.formatted_address;
      }

      let drState = positionDetails.results.find(r => r.types.indexOf("administrative_area_level_1") > -1);
      let acState = drState.address_components.find(r => r.types.indexOf("administrative_area_level_1") > -1);
      if (acState && acState.long_name) {
        _locationObj.state = acState.long_name;
      }
      let drCounty = positionDetails.results.find(r => r.types.indexOf("administrative_area_level_2") > -1);
      let acCounty = drCounty.address_components.find(r => r.types.indexOf("administrative_area_level_2") > -1);
      if (acCounty && acCounty.long_name) {
        _locationObj.county = acCounty.long_name;
      }
      // debugger;
      let drCity = positionDetails.results.find(r => r.types.indexOf("locality") > -1);
      if (drCity) {
        let acCity = drCity.address_components.find(r => r.types.indexOf("locality") > -1);
        if (acCity && acCity.long_name) {
          _locationObj.city = acCity.long_name;
        }
      }


      let drZip = positionDetails.results.find(r => r.types.indexOf("postal_code") > -1);
      let acZip = drZip.address_components.find(r => r.types.indexOf("postal_code") > -1);
      if (acZip && acZip.long_name) {
        _locationObj.zip = acZip.long_name;
      }


      let drAddress = positionDetails.results[0];
      if (drAddress && drAddress.formatted_address) {
        drAddress = drAddress.formatted_address.replace(drCountryAlpha, "");
        drAddress = drAddress.replace(drCountry, "");
        drAddress = drAddress.replace(_locationObj.state, "");
        drAddress = drAddress.replace(_locationObj.county, "");
        drAddress = drAddress.replace(acState.short_name, "");
        drAddress = drAddress.replace(_locationObj.city, "");
        drAddress = drAddress.replace(_locationObj.zip, "");
        drAddress = drAddress.replace(_locationObj.county, "");
        drAddress = drAddress.replace(/,/g, "").trim();
        _locationObj.address = drAddress;
      }
    });
    return _locationObj;
  }

  render() {
    return (
      <div className="UserMap">
        <Row gutter={24}>
          <Col xs={24} sm={12} className={this.props.nullAddressError ? "ant-form-item-has-error" : ''}>
            {/* <Input 
              placeholder="Type address here..."
              type="text"
              ref={this.addressInput}
              value={
                this.state.address ? this.state.address : ""
              }
              onChange={this.onChangeLocatorLocation}
              onKeyPress={this.onPressLocatorEnterKey}
            /> */}
            <GooglePlacesAutocomplete selectProps={{ placeholder: "Enter Address", value: this.state.address, onChange: (value) => { this.setState({ address: value.label }); this.getLatLngFromAddress2(value.label) } }} apiKey={Config.googleMapsAPIkey} />
            {this.props.nullAddressError && <div className="ant-col ant-form-item-control"><div className="ant-form-item-explain">Address is required.</div></div>}
          </Col>
          {/* <Col xs={24} sm={12}>
            <Button
              type="primary"
              className="ant-btn ant-input-search-button ant-btn-primary ant-btn-lg"
              htmlType="button"
              onClick={this.getLatLngFromAddress}
              disabled={this.state.locateBtnDisabled}
            >
              {this.state.locateBtnText}
            </Button>
          </Col> */}
        </Row>
        <Row gutter={24} style={{ display: (this.state.geocodeError !== "") ? 'block' : 'none' }}>
          <p style={{ color: "red" }}>{this.state.geocodeError}</p>
        </Row>
        <br />
        {this.state.markers.length > 0 ?
          (<>
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <span style={{ display: 'block', marginBottom: 7 }}>Latitude</span>
                <Input
                  placeholder="Latitude"
                  type="text"
                  value={
                    this.state.markers[0].lat ? this.state.markers[0].lat : ""
                  }
                  onChange={this.onLatChange}
                />
              </Col>
              <Col xs={24} sm={12}>
                <span style={{ display: 'block', marginBottom: 7 }}>Longitude</span>
                <Input
                  placeholder="Longitude"
                  type="text"
                  value={
                    this.state.markers[0].lng ? this.state.markers[0].lng : ""
                  }
                  onChange={this.onLngChange}
                />
              </Col>
            </Row>
            <br />
          </>)
          : ''}
        <Row gutter={24}>
          <Col xs={24}>
            <div style={mapStyles.container}>
              {this.state.markers.length > 0 && (
                <Map
                  ref={(ref) => this.mapRef = ref}
                  google={this.props.google}
                  zoom={this.state.zoom}
                  style={mapStyles}
                  onReady={this.autoCenterMap}
                >
                  {this.props.radius > 0 && this.state.markers[0].lat ?
                    <Circle
                      ref={(ref) => this.circleRef = ref}
                      center={this.state.markers[0]}
                      radius={this.props.radius}
                      strokeColor="#0000FF"
                      strokeOpacity={0.2}
                      strokeWeight={1}
                      fillColor="#0000FF"
                      fillOpacity={0.2}
                      editable={false}
                      draggable={false}
                    />
                    : ""}

                  {this.state.markers.map((place, i) => {
                    return (
                      <Marker
                        ref={(ref) => this.markerRef = ref}
                        key={i}
                        place_={place}
                        position={{ lat: place.lat, lng: place.lng }}
                        draggable={true}
                        onDragend={this.onMarkerDrag}
                      ></Marker>
                    );
                  })}
                </Map>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default GoogleApiWrapper({ apiKey: googleMapsAPIkey })(Locator);