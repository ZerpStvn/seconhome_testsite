import React, { useState, useEffect } from "react";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import { Card, Button, Modal, Typography, Popconfirm, Descriptions, } from "antd";
import { homeCareOfferedOptions } from "../../../constants/defaultValues";
import { EyeOutlined } from "@ant-design/icons";
import Config from "../../../config";
import { humanize } from "../../../helpers/string-helper";
import userService from "../../../services/user-service";
import moment from "moment";
import InfoWindowEx from "../../../components/infoWindowEx";
// import HeartImg from "../../../assets/images/heart.svg";
import HeartImg from "../../../assets/images/new-map-icon.png";
import defaultImage from "../../../assets/images/second-home-facility-default.jpg";

const { Meta } = Card;
const { Text, Title } = Typography;

const MapViewCommunity = ({ mapExpand, homes, google, client, sendLead }) => {
  const [home, setHome] = React.useState(null);
  const [lead, setLead] = React.useState(null);
  const [infoVisible, setInfoVisible] = React.useState(false);
  const [activeMarker, setActiveMarker] = React.useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const user = userService.getAdminUser();

  const [sendLeadsLoading, setSendLeadsLoading] = useState(false);
  let initialMapCenter;
  let mapBounds;
  useEffect(() => {
    const mapPoints = mapConfig();
    initialMapCenter = mapPoints[0];
    mapBounds = new google.maps.LatLngBounds();
    // console.log({ mapBounds });
    for (let i = 0; i < mapPoints.length; i++) {
      mapBounds.extend(mapPoints[i]);
    }
  }, [mapExpand]);

  const onMarkerClick = (marker, location, lead) => {
    setHome(location);
    setLead(lead);
    setInfoVisible(true);
    setActiveMarker(marker);
  };

  const closeInfo = (e) => {
    setHome(null);
    setInfoVisible(false);
    setActiveMarker(null);
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
  };

  function mapConfig() {
    const points = [];
    if (homes !== null) {
      homes.map(({ geo }) => {
        points.push(geo);
      });
    }
    return points;
  }


  const sendLeads = async (include_client_phone, Id) => {
    setSendLeadsLoading(true);
    sendLead(include_client_phone, Id);
    closeInfo(Id);
  };
  const getMaxRoomCost = () => {
    if (home && home.rooms.length) {
      return Math.max.apply(
        Math,
        home.rooms.map(function (room) {
          return room.base_rate;
        })
      );
    } else {
      return false;
    }
  };

  const getMinRoomCost = () => {
    if (home && home.rooms.length) {
      return Math.min.apply(
        Math,
        home.rooms.map(function (room) {
          return room.base_rate;
        })
      );
    } else {
      return false;
    }
  };

  const mapModalContent = (Item) => {
    if (Item !== null) {
      return Object.entries(Item).map((Key, Value) => {
        let content;
        if (
          Key[1] !== null &&
          Key[1] !== "" &&
          Key[0] !== "user_created" &&
          Key[0] !== "geo" &&
          Key[0] !== "rooms"
        ) {
          content = (
            <div key={Value}>
              <Text strong>{humanize(Key[0])} :</Text>
              <Text>
                {Key[0] === "date_created" ? (
                  moment(Key[1]).format("MM-DD-YYYY")
                ) : (
                  <>
                    {typeof Key[1] !== "object"
                      ? Key[1]
                      : Key[1].length &&
                      Key[1]
                        .map((item) => {
                          return humanize(item.toString());
                        })
                        .join(", ")}
                  </>
                )}
              </Text>
            </div>
          );
          return content;
        }
      });
    }
  };

  const showDetailModal = () => {
    setIsDetailModalVisible(!isDetailModalVisible);
  };

  const addhttp = (s) => {
    let prefix = 'http://';
    if (s.substr(0, prefix.length) !== prefix) {
      s = prefix + s;
    }
    return s
  }

  const formatNumber = (e) => {
    if (e) {
        var x = e.toString().replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

    }
}

  return (
    <div
      className="scroll_remove"
      style={{
        position: "relative",
        height: "calc(100vh - 66px)",
      }}
    >
      <Map
        style={{}}
        zoom={5}
        initialCenter={initialMapCenter}
        google={google}
        bounds={mapBounds}
      >
        {homes.map(function (home, index) {
          var leadData = false;
          if (client && client.leads) {
            client.leads.map((lead) => {
              if (home.id == lead.home) {
                leadData = lead;
              }
            });
          }

          return (
            <Marker
              key={index}
              name={"Current location"}
              icon={{
                url: HeartImg,
                anchor: new google.maps.Point(32, 45),
                scaledSize: new google.maps.Size(32, 45),
              }}
              position={{
                lat: home.geo && home.geo.lat,
                lng: home.geo && home.geo.lng,
              }}
              onClick={(_, marker) => onMarkerClick(marker, home, leadData)}
            />
          );
        })}

        <InfoWindowEx
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
                  : defaultImage
              }
            />
            <div className="map_card">
              <Meta
                title={home && home.name}
                description={
                  <div className="card-details">
                    {home && home.user_created && (
                      <div
                        className="community-name"
                        style={{
                          color: "#7b7b7b",
                          fontSize: "12px",
                          letterSpacing: "1px",
                          marginTop: "-5px",
                          marginBottom: "0px",
                        }}
                      >{`${home.user_created.first_name} ${home.user_created.last_name}`}</div>
                    )}
                    {/* {moment(lead.date_created)} */}
                    {/* <div>Created Date: {moment(lead.date_created).format('MM-DD-YYYY')}</div> */}
                    <div className="housing-type">
                      {home &&
                        home.care_offered &&
                        home.care_offered.map((text, index) => (
                          <span key={index}>
                            {text === "continuing_care_retirement_community"
                              ? text.toUpperCase()
                              : humanize(text)}
                          </span>
                        ))}
                    </div>
                    <p>
                      {/* ${getMinRoomCost()} - ${getMaxRoomCost()} / Month */}
                      {getMinRoomCost() !== false &&
                        `$${getMinRoomCost()} - $${getMaxRoomCost()}`}
                    </p>
                    <p>{home && home.address_line_1}</p>
                  </div>
                }
              />
              <a onClick={showDetailModal} style={{ color: "#1B75BC" }}>
                <EyeOutlined />
              </a>
            </div>
            {/* {console.log(home, "home")} */}
            {/* {home ? <a href={`/dashboard/home-detail/${home.id}`} target="_blank">Learn More</a> : ""} */}

            {/* <Button style={{ marginTop: "10px" }} >
              Learn More
            </Button> */}
            {!lead && (
              <Button style={{ marginTop: "10px" }} loading={sendLeadsLoading}>
                <Popconfirm
                  title="Include Client's Phone?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => sendLeads(true, home.id)}
                  onCancel={() => sendLeads(false, home.id)}
                >
                  Send Lead
                </Popconfirm>{" "}
              </Button>
            )}
          </div>
        </InfoWindowEx>
        <Modal
          footer={null}
          title="Community Details"
          visible={isDetailModalVisible}
          onOk={handleDetailModalCancel}
          onCancel={handleDetailModalCancel}
        >
          {!!home && (<div className="client-details">
            <Descriptions title="User Info" column={2}>
              {home.name && <Descriptions.Item label="Name">{humanize(home.name)}</Descriptions.Item>}
              {lead && lead.date_created && <Descriptions.Item label="Date & Time">{moment(lead.date_created).format('MM/DD/YY')} {moment(lead.date_created).format('LT')} </Descriptions.Item>}
              <Descriptions.Item label="Address">{humanize(home.address_line_1)} {humanize(home.address_line_2)}</Descriptions.Item>
              {home.city && <Descriptions.Item label="City">{humanize(home.city)}</Descriptions.Item>}
              {home.zip && <Descriptions.Item label="Zip">{home.zip}</Descriptions.Item>}
              {home.county && <Descriptions.Item label="County">{humanize(home.county)}</Descriptions.Item>}
              {home.state && <Descriptions.Item label="State">{humanize(home.state)}</Descriptions.Item>}
              {home.phone && <Descriptions.Item label="Phone">{formatNumber(home.phone)}</Descriptions.Item>}
              {home.rating && <Descriptions.Item label="Rating">{humanize(home.rating)}</Descriptions.Item>}
              {home.care_offered && (
                <Descriptions.Item label="Care Offered">
                  {home.care_offered.map((item, index) => {
                    let Value = '';
                    homeCareOfferedOptions.forEach(Item => {
                      if (Item.value === item) {
                        Value = Item.text;
                      }
                    });
                    return Value
                  }).join(", ")}

                </Descriptions.Item>
              )}
              {home.user_created && home.user_created.cell && <Descriptions.Item label="Cell">{formatNumber(home.user_created.cell)}</Descriptions.Item>}
              {home.user_created && home.user_created.email && <Descriptions.Item label="Email">{home.user_created.email}</Descriptions.Item>}
              {home.community_fee && <Descriptions.Item label="Community Fee">{home.community_fee}</Descriptions.Item>}
              {home.current_specials && <Descriptions.Item label="Move-in Specials">{home.current_specials}</Descriptions.Item>}
              {home.capacity && <Descriptions.Item label="Capacity">{home.capacity}</Descriptions.Item>}
              {home.year_started && <Descriptions.Item label="Year Started">{home.year_started}</Descriptions.Item>}
              {home.state_report && <Descriptions.Item label="State Report"><a href={addhttp(home.state_report)}>{home.state_report}</a></Descriptions.Item>}
              {home.website && <Descriptions.Item label="Website"><a href={addhttp(home.website)}>{home.website}</a></Descriptions.Item>}
            </Descriptions>
            {home.respite_daily_rates && (
              <Descriptions title="Respite Daily Rates" column={2}>
                {home.respite_daily_rates.shared_room && <Descriptions.Item label="Shared Room">${home.respite_daily_rates.shared_room}</Descriptions.Item>}
                {home.respite_daily_rates.private_room && <Descriptions.Item label="Private Room">${home.respite_daily_rates.private_room}</Descriptions.Item>}
              </Descriptions>
            )}
            {home.point_system && (
              <Descriptions title="Point System" column={2}>
                {home.point_system.point && <Descriptions.Item label="Point">${home.point_system.point}</Descriptions.Item>}
                {home.point_system.total_points && <Descriptions.Item label="Total Points">{home.point_system.total_points}</Descriptions.Item>}
              </Descriptions>
            )}
            <Descriptions title="Care Levels" column={2}>
              <Descriptions.Item label="Care Costs Included">{home.care_costs_included ? "Yes" : "No"}</Descriptions.Item>
              {home.care_levels && (
                home.care_levels.map((item, index) => {
                  return (
                    <Descriptions.Item key={index} label={item.key}>${item.value}</Descriptions.Item>
                  )
                })
              )}
            </Descriptions>
            {home.additional_fee && (
              <Descriptions title="Additional Fee" column={2}>
                {home.additional_fee.map((item, index) => {
                  return (
                    <Descriptions.Item key={index} label={item.key}>${item.value}</Descriptions.Item>
                  )
                })}
              </Descriptions>
            )}
            {home.a_la_carte && (
              <Descriptions title="A La Carte" column={2}>
                {Object.entries(home.a_la_carte).map((item, index) => {
                  return (
                    <Descriptions.Item key={index} label={humanize(item[0])}>${item[1]}</Descriptions.Item>
                  )
                })}
              </Descriptions>
            )}
            {/* {home.community_fee && (
            <Descriptions title="A La Carte" column={2}>
              {Object.entries(home.a_la_carte).map((item, index) => {
                return (
                  <Descriptions.Item key={index} label={humanize(item[0])}>${item[1]}</Descriptions.Item>
                )
              })}
            </Descriptions>
          )} */}
          </div>)}
        </Modal>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: Config.googleMapsAPIkey,
})(MapViewCommunity);
