import React from "react";
import { GoogleApiWrapper, Map, InfoWindow, Marker } from "google-maps-react";
import Config from "../../../config";
// import HeartImg from "../../../assets/images/heart.svg";
import HeartImg from "../../../assets/images/new-map-icon.png";
// import config from "../../../config";

const coords = { lat: 40.727197, lng: -73.999894 };
const style = {
  width: "10%",
  height: "10%",
  top: 10,
};

const MapViewTour = (props) => {
  const leadData = props.lead;
  const [home, setHome] = React.useState(null);
  const [infoVisible, setInfoVisible] = React.useState(false);
  const [activeMarker, setActiveMarker] = React.useState(null);

  const onMarkerClick = (marker, location) => {
    setHome(location);
    setInfoVisible(true);
    setActiveMarker(marker);
  };

  const closeInfo = (e) => {
    console.log(e);
    setHome(null);
    setInfoVisible(false);
    setActiveMarker(null);
  };

  function mapConfig() {
    const points = [];
    if (leadData !== null) {
      leadData.map(function (lead) {
        if (lead.home !== null) {
          points.push(lead.home.geo);
        }
      });
    }
    return points;
  }
  const mapPoints = mapConfig();
  const initialMapCenter =
    leadData !== null &&
      leadData.length > 0 &&
      leadData[0].home !== null &&
      leadData[0].home.geo !== null
      ? leadData[0].home.geo
      : mapPoints[0];
  let mapBounds = new props.google.maps.LatLngBounds();
  for (let i = 0; i < mapPoints.length; i++) {
    mapBounds.extend(mapPoints[i]);
  }

  return (
    <div
      style={{
        position: "relative",
        height: "calc(100vh - 20px)",
      }}
    >
      <Map
        style={{}}
        zoom={7}
        initialCenter={initialMapCenter}
        google={props.google}
        bounds={mapBounds}
      >
        {leadData.map(function (item, index) {
          /*if (props.tourType) {
            if (
              item.tour_status === props.tourType &&
              item.home !== null
            ) {
              return (
                <Marker
                  key={index}
                  name={"Current location"}
                  icon={{
                    url: "/img/heart.svg",
                    anchor: new props.google.maps.Point(32, 32),
                    scaledSize: new props.google.maps.Size(64, 64),
                  }}
                  position={{
                    lat: item.home.geo.lat,
                    lng: item.home.geo.lng,
                  }}
                  onClick={(_, marker) => onMarkerClick(marker, item.home)}
                />
              );
            }
          } else {
            if (item.home !== null) {
              return (
                <Marker
                  key={index}
                  name={"Current location"}
                  icon={{
                    url: "/img/heart.svg",
                    anchor: new props.google.maps.Point(32, 32),
                    scaledSize: new props.google.maps.Size(64, 64),
                  }}
                  position={{
                    lat: item.home.geo.lat,
                    lng: item.home.geo.lng,
                  }}
                  onClick={(_, marker) => onMarkerClick(marker, item.home)}
                />
              );
            }
          }*/
          if (props.tourType == "scheduled") {
            if (item.tour_status === 'scheduled' && (new Date(item.scheduled_date).getTime() > new Date().getTime()) &&
              item.home !== null) {
              return (
                <Marker
                  key={index}
                  name={"Current location"}
                  icon={{
                    url: HeartImg,
                    anchor: new props.google.maps.Point(32, 45),
                    scaledSize: new props.google.maps.Size(32, 45),
                  }}
                  position={{
                    lat: item.home.geo.lat,
                    lng: item.home.geo.lng,
                  }}
                  onClick={(_, marker) => onMarkerClick(marker, item.home)}
                />
              );
            }
          }
          if (props.tourType == "completed") {
            if (item.tour_status === 'scheduled' && (new Date(item.scheduled_date).getTime() < new Date().getTime()) &&
              item.home !== null) {
              return (
                <Marker
                  key={index}
                  name={"Current location"}
                  icon={{
                    url: HeartImg,
                    anchor: new props.google.maps.Point(32, 32),
                    scaledSize: new props.google.maps.Size(32, 32),
                  }}
                  position={{
                    lat: item.home.geo.lat,
                    lng: item.home.geo.lng,
                  }}
                  onClick={(_, marker) => onMarkerClick(marker, item.home)}
                />
              );
            }
          }
        })}

        <InfoWindow
          visible={infoVisible}
          marker={activeMarker}
          onClose={(e) => closeInfo(e)}
        >
          <div>
            <img
              style={{
                width: "100%",
                height: "200px",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              src={
                home && home.image
                  ? `${Config.API}/assets/${home.image}`
                  : `https://via.placeholder.com/600X400`
              }
            />
            <h1 style={{ fontWeight: "bold" }}>{home && home.name}</h1>
            <p>{home && home.address_line_1}</p>
            <p>
              {home && home.city} {home && home.state} {home && home.zip}
            </p>
            <p>{home && home.country}</p>
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
};
export default GoogleApiWrapper({
  apiKey: Config.googleMapsAPIkey,
})(MapViewTour);
