import React, { useState } from "react";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import {
    Card,
    Divider,
    Button,
    Modal,
    Input,
    Form,
    Spin,
    List,
    Typography,
    Checkbox,
    Popconfirm,
} from "antd";
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import Config from "../../config";
import { humanize } from "../../helpers/string-helper";
import userService from "../../services/user-service";
import leadApi from "../../redux/api/lead-api";
import { notifyUser } from "../../services/notification-service";
import moment from "moment";
import InfoWindowEx from "../../components/infoWindowEx";
// import HeartImg from "../../assets/images/heart.svg";
import HeartImg from "../../assets/images/new-map-icon.png";
import defaultImage from "../../assets/images/second-home-facility-default.jpg";
const { Meta } = Card;
const { Text, Title } = Typography;

const MapView = ({ homes, google, client, sendLead }) => {
    const [home, setHome] = React.useState(null);
    const [lead, setLead] = React.useState(null);
    const [infoVisible, setInfoVisible] = React.useState(false);
    const [activeMarker, setActiveMarker] = React.useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const user = userService.getAdminUser();

    const [sendLeadsLoading, setSendLeadsLoading] = useState(false);

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

    function mapConfig() {
        const points = [];
        if (homes !== null) {
            homes.map(({ geo }) => {
                points.push(geo);
            });
        }
        return points;
    }
    const mapPoints = mapConfig();
    const initialMapCenter = mapPoints[0];
    let mapBounds = new google.maps.LatLngBounds();
    for (let i = 0; i < mapPoints.length; i++) {
        mapBounds.extend(mapPoints[i]);
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
                zoom={7}
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
                                lat: home.geo.lat,
                                lng: home.geo.lng,
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
                                // title={home && home.name}
                                description={
                                    <div className="card-details">
                                        {/* {home && home.user_created && (
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
                                        )} */}
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
                                        {/* <p>{home && home.address_line_1}</p> */}
                                    </div>
                                }
                            />
                            {home ? <a href={`/dashboard/home-detail/${home.id}`} target="_blank">Learn More</a> : ""}
                            {/* <a onClick={showDetailModal} style={{ color: "#1B75BC" }}>
                                <EyeOutlined />
                            </a> */}
                        </div>
                        {/* {!lead && (
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
                        )} */}
                    </div>
                </InfoWindowEx>
                <Modal
                    footer={null}
                    title="Details"
                    visible={isDetailModalVisible}
                    onOk={showDetailModal}
                    onCancel={showDetailModal}
                >
                    <div>{mapModalContent(home)}</div>
                </Modal>
            </Map>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: Config.googleMapsAPIkey,
})(MapView);
