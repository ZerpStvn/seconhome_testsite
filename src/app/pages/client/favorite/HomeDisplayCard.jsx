import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Divider, Button, Modal, Input, Form, Spin, List, Avatar, Descriptions } from "antd";
import { EyeOutlined, LikeOutlined, DislikeOutlined, MessageOutlined, } from "@ant-design/icons";
import { homeCareOfferedOptions } from "../../../constants/defaultValues";
import Config from "../../../config";
import { SendOutlined } from "@ant-design/icons";
import { humanize } from "../../../helpers/string-helper";
import moment from "moment";
import { NotesListCard } from "../../../components/shared/displayCard";
import avatar from '../../../assets/images/notes.png';
import { updateHome } from "../../../redux/actions/home-actions";

const { Meta } = Card;
const { TextArea } = Input;

const HomeDisplayCard = ({ name, address, approval, coverImage, liked, home, homeID, rooms }) => {

    const dispatch = useDispatch();
    const imageUrl = coverImage ? `${Config.API}/assets/${coverImage}` : null;
    const badgeBG = approval === "accepted" ? "#52c41a" : approval === "pending" ? "#ff6d00" : "#ff0000";
    const likeColor = liked == true ? "#008000" : "#000";
    const dislikeColor = liked == false ? "#ff0000" : "#000";


    const [openNote, setOpenNote] = useState(false);
    const [openConnect, setOpenConnect] = useState(false);
    const [likeButtonColor, setLikeButtonColor] = useState(likeColor);
    const [dislikeButtonColor, setDislikeButtonColor] = useState(dislikeColor);

    const [noteData, setNoteData] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);






    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };



    const likeHandler = async (likeValue) => {
        console.log(likeValue);
        console.log(liked);
        if (likeValue != null && liked != likeValue) {
            setLoading(true);
            // const data = { is_liked: likeValue };
            const data = { is_liked: likeValue };

            try {
                await dispatch(updateHome(home.id, data));
                // await dispatch(updateLead(leadID, data));
                if (likeValue === true) {
                    setDislikeButtonColor("#000");
                    setLikeButtonColor("#008000");
                } else {
                    setDislikeButtonColor("#ff0000");
                    setLikeButtonColor("#000");
                }
            } catch (e) {
                console.log(e);
            }
            // loadingHandle();
            setLoading(false);
        }
        else {
            setLoading(true);
            // const data = { is_liked: likeValue };
            const data = { is_liked: null };
            try {
                await dispatch(updateHome(home.id, data));
                // await dispatch(updateLead(leadID, data));

            } catch (e) {
                console.log(e);
            }
            // loadingHandle();
            setLoading(false);
        }
    };



    const getMaxRoomCost = () => {
        return Math.max.apply(
            Math,
            rooms.map(function (room) {
                return room.base_rate;
            })
        );
    };

    const getMinRoomCost = () => {
        return Math.min.apply(
            Math,
            rooms.map(function (room) {
                return room.base_rate;
            })
        );
    };

    const showDetailModal = () => {
        setIsDetailModalVisible(!isDetailModalVisible);
    };

    return (
        <React.Fragment>
            <Card
                style={{ maxWidth: '100%' }}
                cover={
                    <div>

                        <span
                            className=" home-status"
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "10px",
                                left: 'auto',
                                background: 'blue'
                            }}
                        >
                            Available
                        </span>
                        <img
                            style={{
                                width: "100%",
                                height: "300px",
                                backgroundPosition: "center center",
                                backgroundRepeat: "no-repeat",
                                objectFit: "cover",
                            }}
                            alt="home-image"
                            src={imageUrl ? imageUrl : "https://via.placeholder.com/600X400"}
                        />
                    </div>
                }
                actions={[

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginRight: 10,
                        }}
                    >
                        {loading && !openConnect && !openNote ? (
                            <Spin
                                style={{
                                    padding: 10,
                                    backgroundColor: "#fff",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            />
                        ) : (
                            <React.Fragment>
                                <LikeOutlined
                                    key="like"
                                    style={{ fontSize: "20px", color: likeButtonColor }}
                                    onClick={() => likeHandler(true)}
                                />
                                <Divider type="vertical" />
                                <DislikeOutlined
                                    key="dislike"
                                    style={{ fontSize: "20px", color: dislikeButtonColor }}
                                    onClick={() => likeHandler(false)}
                                />
                            </React.Fragment>
                        )}
                    </div>,
                ]}
            >
                <div className="card-content community_detail">
                    <Meta
                        title={name}
                        description={
                            <div className="card-details">
                                <p className="budget">
                                    ${getMinRoomCost()} - ${getMaxRoomCost()} / Month
                                </p>
                                <div className="community_type">
                                    {home.care_offered &&
                                        home.care_offered.map((item, index) => {
                                            return humanize(item)
                                        }).join(', ')}
                                </div>
                                <p className="address-deatils">{address}</p>
                            </div>
                        }
                    />
                    <ul className="align-center" style={{ display: "flex" }}>

                        <li >
                            <a onClick={showDetailModal} style={{ color: "#1B75BC" }}>
                                <EyeOutlined />
                            </a>
                        </li>
                    </ul>

                </div>
            </Card>
            <Modal
                footer={null}
                title="Community Details"
                visible={isDetailModalVisible}
                onOk={showDetailModal}
                onCancel={showDetailModal}
            >
                <div className="client-details">
                    <Descriptions title="User Info" column={2}>

                        {home.name && <Descriptions.Item label="Name">{home.name}</Descriptions.Item>}
                        <Descriptions.Item label="Address">{home.address_line_1} {home.address_line_2}</Descriptions.Item>
                        {home.city && <Descriptions.Item label="City">{home.city}</Descriptions.Item>}
                        {home.zip && <Descriptions.Item label="Zip">{home.zip}</Descriptions.Item>}
                        {home.state && <Descriptions.Item label="State">{home.state}</Descriptions.Item>}
                        {home.county && <Descriptions.Item label="County">{home.county}</Descriptions.Item>}
                        {home.phone && <Descriptions.Item label="Phone">{home.phone}</Descriptions.Item>}
                        {home.user_created && <Descriptions.Item label="Partner Name">{home.user_created.first_name} {home.user_created.last_name}</Descriptions.Item>}
                        {home.license_number && <Descriptions.Item label="License Number">{home.license_number}</Descriptions.Item>}
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
                        {home.user_created && home.user_created.cell && <Descriptions.Item label="Cell">{home.user_created.cell}</Descriptions.Item>}
                        {home.user_created && home.user_created.email && <Descriptions.Item label="Email">{home.user_created.email}</Descriptions.Item>}
                        {home.community_fee && <Descriptions.Item label="Community Fee">${home.community_fee}</Descriptions.Item>}
                        {home.current_specials && <Descriptions.Item label="Move-in Specials">{home.current_specials}</Descriptions.Item>}
                        {home.capacity && <Descriptions.Item label="Capacity">{home.capacity}</Descriptions.Item>}
                        {home.year_started && <Descriptions.Item label="Year Started">{home.year_started}</Descriptions.Item>}
                        {home.state_report && <Descriptions.Item label="State Report"><a href={home.state_report}>{home.state_report}</a></Descriptions.Item>}
                        {home.website && <Descriptions.Item label="Website"><a href={home.website}>{home.website}</a></Descriptions.Item>}
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
                </div>
            </Modal>

        </React.Fragment>
    );
};

export default HomeDisplayCard;
