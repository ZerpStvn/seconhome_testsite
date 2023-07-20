import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Col, Dropdown, Image, List, Menu, Row, Segmented, Space, Spin, } from "antd";
import { getById } from "../../redux/actions/home-actions";
import sliderImg1 from "../../../app/assets/images/home-details-banner1.jpg";
import sliderImg2 from "../../../app/assets/images/save-financial-resources.jpg";
import { LikeFilled, DislikeFilled, DownOutlined, DownCircleFilled, HeartOutlined, StarOutlined, ManOutlined, HomeOutlined, UpCircleFilled, } from "@ant-design/icons";
import { floorLevelOptions } from "../../constants/defaultValues";
import { humanize } from "../../helpers/string-helper";
import Config, { MainUrl } from "../../config";
import LoginPopup from "../login/login-popup";


const RoomCard = ({ Room, currentLoggedInUser }) => {
    const [showDetail, setShowDetail] = useState(false);
    const [logInModalVisible, setLogInModalVisible] = useState(false);

    const openRoomHandle = () => {
        setShowDetail(!showDetail);
    };

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    const modalVisibleHandle = () => {
        setLogInModalVisible(!logInModalVisible);
    };
    const loginModalCancel = () => {
        setLogInModalVisible(false);
    };

    const image = (img) => {
        if (!!img) {
            let finalImage = require(`../../../app/assets/images/${img}.png`);
            return <Image src="error" fallback={finalImage} />;
        }
    };

    return (
        <>
            <div className="single-property-intro price-type-content">
                <Row>
                    <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                        <div className="property-intro">
                            <h2 className="property-name">
                                {humanize(Room.name)}
                                <a href="#">
                                    {floorLevelOptions.map((item) =>
                                        item.value == Room.floor_level ? ` - ${item.text}` : ""
                                    )}{" "}
                                </a>
                            </h2>
                            <div className="address">
                                {/* Redondo Beach is a coastal city in Los Angeles. */}
                            </div>
                        </div>
                    </Col>
                    <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                        <div className="property-review">
                            <div className="roomtype">
                                {/* <button color="blue">Assisted Living</button> */}

                                {Room.room_care_type && <button color="blue">{humanize(Room.room_care_type[0])}</button>}

                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                        <div className="budget">
                            {" "}
                            {/* <span>{formatter.format(Room.base_rate)}/</span> + Level of
                            care/Monthly */}
                            {formatter.format(Room.base_rate)} + Level of
                            care/Monthly
                        </div>
                    </Col>
                    <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                        <div className="read-deatl-btn">
                            <div className="deatl-edit-btn">
                                <a
                                    className="assisted-btn"
                                    color="blue"
                                    onClick={openRoomHandle}
                                >
                                    Room details{" "}
                                    {showDetail ? <UpCircleFilled /> : <DownCircleFilled />}
                                </a>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div
                    className="RoomAmenities"
                    style={{ display: showDetail ? "block" : "none" }}
                >
                    <Row gutter={24}>
                        {Room.profile ? <Col sm={24} md={8} lg={8} xl={8}>
                            <div className={`img-option ${!currentLoggedInUser ? "blur-block" : ""}`} >
                                <Image src={`${Config.API}/assets/${Room.profile}`} />
                            </div>
                        </Col> : ''}

                        {Room.photos &&
                            Room.photos.length > 0 &&
                            Room.photos.map((item, index) => {
                                return (
                                    <Col sm={24} md={8} lg={8} xl={8} key={index}>
                                        <div className={`img-option ${!currentLoggedInUser ? "blur-block" : ""}`} >
                                            <Image
                                                src={`${Config.API}/assets/${item.directus_files_id}`}
                                            />
                                        </div>
                                    </Col>
                                );
                            })}
                    </Row>
                    <div className="room-facility">
                        <Row gutter={24}>
                            <Col sm={24} md={12} lg={12} xl={12}>
                                <div className="room-facility-content-left">
                                    <h2>Room Type</h2>
                                </div>
                            </Col>
                            <Col sm={24} md={12} lg={12} xl={12}>
                                <div className="room-facility-content-right">
                                    <h2>{humanize(Room.type)}</h2>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="room-facility">
                        <Row gutter={24}>
                            <Col sm={24} md={12} lg={12} xl={12}>
                                <div className="room-facility-content-left">
                                    <h2>Bathroom Type</h2>
                                </div>
                            </Col>
                            <Col sm={24} md={12} lg={12} xl={12}>
                                <div className="room-facility-content-right">
                                    <h2>{humanize(Room.bathroom_type)}</h2>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="room-facility">
                        <Row gutter={24}>
                            <Col sm={24} md={12} lg={12} xl={12}>
                                <div className="room-facility-content-left">
                                    <h2>Non-Ambulatory:</h2>
                                </div>
                            </Col>
                            <Col sm={24} md={12} lg={12} xl={12}>
                                <div className="room-facility-content-right">
                                    <h2>{Room.non_ambulatory ? "Yes" : "No"}</h2>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="room-facility">
                        <Row gutter={24}>
                            <Col sm={24} md={12} lg={24} xl={24}>
                                <div className="room-facility-content-left">
                                    <h2>Room Amenities</h2>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="room-features">
                        <Row gutter={24}>
                            {!!Room.room_amenities
                                ? Room.room_amenities.map((item, index) => {
                                    return (
                                        <Col sm={12} md={12} lg={12} xl={8} key={index}>
                                            <div className="features-option">
                                                <h2>
                                                    {image(item)}
                                                    {humanize(item)}
                                                </h2>
                                            </div>
                                        </Col>
                                    );
                                })
                                : ""}
                        </Row>
                    </div>
                    <div className="check-availability">
                        {/* {!currentLoggedInUser ? <Button type="success-color" onClick={() => {
                            modalVisibleHandle();
                        }}>Check Availability</Button> : <Button type="success-color" href={`${MainUrl}/` + JSON.parse(localStorage.user).redirect}>Check Availability</Button>} */}
                        <Button href={`${MainUrl}/contact-us`} type="primary">
                            Check Availability
                        </Button>
                    </div>
                    <LoginPopup
                        logInModalVisible={logInModalVisible}
                        // OnSubmit={loginModalSubmitHandle}
                        // willLater={doLaterEnable}
                        logInDirect={true}
                        createAccount={false}
                        loginModalCancel={loginModalCancel}
                    />
                </div>
            </div>
        </>
    );
};
export default RoomCard;
