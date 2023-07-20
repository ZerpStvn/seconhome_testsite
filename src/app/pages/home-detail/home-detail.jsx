import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Col, Dropdown, Image, List, Menu, Row, Segmented, Space, Spin } from "antd";
import { getById, updateHome } from "../../redux/actions/home-actions";
import sliderImg1 from "../../../app/assets/images/home-details-banner1.jpg";
import sliderImg2 from "../../../app/assets/images/save-financial-resources.jpg";
import { ActivitiesSvgIcon, ThumbsUpSvgIcon, ThumbsDownSvgIcon, PhotoSvgIcon, VideoSvgIcon } from "../../../app/assets/svg-icon/icon";
import { LikeFilled, DislikeFilled, DownOutlined, DownCircleFilled, HeartOutlined, StarOutlined, ManOutlined, HomeOutlined, UpCircleFilled, } from "@ant-design/icons";
import { homeCareOfferedOptions, homeCareServicesOptions, homeActivitiesOptions, communityAmenitiesOptions, specialServicesOptions } from "../../constants/defaultValues";
import { humanize } from "../../helpers/string-helper";
import RoomCard from "./room-card";
import Map from "./map";
import { updateLead } from "../../redux/actions/lead-actions";
import config, { MainUrl } from "../../config";
import LoginPopup from "../login/login-popup";
import userService from "../../services/user-service";
import leadClientApi from "../../redux/api/lead-client-api";

const menu = (
    <Menu
        items={[
            {
                label: "1st Studio",
            },
            {
                label: "2st Studio",
            },
            {
                label: "3st Studio",
            },
        ]}
    />
);




const HomeDetail = ({ editHomeLoading, editHome, currentLoggedInUser }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const [servicesDetails, setServicesDetails] = useState({
        careService: false,
        activities: false,
        amenities: false,
        specialServices: false,
    });
    const [logInModalVisible, setLogInModalVisible] = useState(false);
    const loginPopup = () => {
        setLogInModalVisible(!logInModalVisible);
    }

    const loginModalSubmitHandle = () => {
        //history.push("/search", form.getFieldValue().search);
    }
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    const [budget, setBudget] = useState({
        max_budget: 0,
        min_budget: 0,
    });
    const [sqFt, setsqFt] = useState({
        max: 0,
        min: 0,
    });

    const [bathTypes, setbathTypes] = useState([]);
    const [client, setClient] = useState({});
    const [isClient, setIsClient] = useState(false);
    const [leadData, setLeadData] = useState({});
    const [leadLikeValue, setLeadLikeValue] = useState("")
    const [stickyFormWidth, setStickyFormWidth] = useState("")



    /**********************/
    // useEffect(() => {
    //     console.log(isClient, "isClient");
    //     getClient();
    //     return;
    // }, [editHomeLoading]);


    useEffect(() => {
        (async () => {
            if (editHomeLoading && id) {
                const editHome = await dispatch(getById(id, { fields: "*.*,rooms.photos.*" }));
                console.log(editHome, "editHome");
                if (editHome.rooms) {

                    setBudget({
                        max_budget: getMaxRoomCost(editHome.rooms),
                        min_budget: getMinRoomCost(editHome.rooms),
                    });
                    setsqFt({
                        max: getMaxRoomSize(editHome.rooms),
                        min: getMinRoomSize(editHome.rooms),
                    });
                }
            }
        })()
    }, [editHomeLoading]);

    // const getClient = async () => {
    //     var user = await userService.getLoggedInUser();
    //     if (user && user.client.length) {
    //         var clientData = await leadClientApi.getLeadClientById(
    //             user.client[0],
    //             { fields: ["*", "leads.*", "primary_resident.*"] }
    //         );
    //         if (clientData.data) {
    //             setClient(clientData.data);
    //             setIsClient(true);
    //         }
    //     }
    //     else {
    //         setIsClient(true);
    //     }
    // };




    window.addEventListener("scroll", (e) => {
        let windowScroll = window.scrollY;
        let callUsDiv = document.getElementById("callUs_single");

        if (callUsDiv) {
            setStickyFormWidth(callUsDiv.offsetWidth - 24);
            let divOffset = callUsDiv.offsetTop - 80;
            if (windowScroll > divOffset) {
                callUsDiv.classList.add("callUs_single_fixed")
            }
            else {
                callUsDiv.classList.remove("callUs_single_fixed")
            }
        }



    });


    // useEffect(() => {
    //     if (editHome) {
    //         console.log(editHome, "editHome");
    //         setLeadLikeValue(editHome.is_liked == 1 ? true : editHome.is_liked == 0 ? false : "")
    //         setBudget({
    //             max_budget: getMaxRoomCost(editHome.rooms),
    //             min_budget: getMinRoomCost(editHome.rooms),
    //         });
    //         setsqFt({
    //             max: getMaxRoomSize(editHome.rooms),
    //             min: getMinRoomSize(editHome.rooms),
    //         });
    //         // editHome.max_budget = getMaxRoomCost(editHome.rooms);
    //         // editHome.min_budget = getMinRoomCost(editHome.rooms);
    //     }
    // }, [editHome]);

    function getBathTypes(Item) {
        let arr = [];
        let arrBathTypes = ['no_bath', 'jack_and_jill', 'one_bath', 'one_and_a_half_bath', 'two_bath']
        Item.map((type) => {
            if (type.bathroom_type) {
                !arr.includes(type.bathroom_type) && arr.push(type.bathroom_type);
            }
        })
        arr.sort((a, b) => arrBathTypes.indexOf(a.trim()) - arrBathTypes.indexOf(b.trim()));


        let firstElem = humanize(arr[0]);
        let lastElem = humanize(arr[arr.length - 1]);

        return (
            <>
                {firstElem == lastElem ? firstElem : firstElem + ' - ' + lastElem}
            </>
        )
    }

    function getbedRoomTypes(Item) {
        let arr = [];
        let arrBedroomTypes = ['shared_3_people', 'shared_2_people', 'private_room', '1_bedroom', '2_bedroom']
        Item.map((room) => {
            if (room.type) {
                !arr.includes(room.type) && arr.push(room.type);
            }
        })

        arr.sort((a, b) => arrBedroomTypes.indexOf(a.trim()) - arrBedroomTypes.indexOf(b.trim()));

        let firstElem = humanize(arr[0]);
        let lastElem = humanize(arr[arr.length - 1]);
        return (
            <>
                {firstElem == lastElem ? firstElem : firstElem + ' - ' + lastElem}
            </>
        )

    }

    const getMaxRoomSize = (rooms) => {
        if (rooms.length) {
            return Math.max.apply(
                null,
                rooms.length
                    ? rooms.map(function (room) {
                        return room.size ? room.size : 0;
                    })
                    : [0]
            );
        } else {
            return 0;
        }
    };

    const getMinRoomSize = (rooms) => {
        if (rooms.length) {
            return Math.min.apply(
                null,
                rooms.map(function (room) {
                    return room.size ? room.size : 0;
                })
            );
        } else {
            return 0;
        }
    };

    const getMaxRoomCost = (rooms) => {
        if (rooms.length) {
            return Math.max.apply(
                null,
                rooms.length
                    ? rooms.map(function (room) {
                        return room.base_rate ? room.base_rate : 0;
                    })
                    : [0]
            );
        } else {
            return 0;
        }
    };

    const getMinRoomCost = (rooms) => {
        if (rooms.length) {
            return Math.min.apply(
                null,
                rooms.map(function (room) {
                    return room.base_rate ? room.base_rate : 0;
                })
            );
        } else {
            return 0;
        }
    };

    /**********************/
    const careOfferedMap = (Item) => {
        return Item && Item.map((type) => {
            let Data;
            homeCareOfferedOptions.forEach((Item) => {
                if (Item.value === type) {
                    Data = (
                        <button className="assisted-btn" color="blue">
                            {humanize(Item.text)}
                        </button>
                    );
                }
            });
            return Data;
        });
    };

    const homeLikeDislikeHandle = (e) => {
        const data = { is_liked: e.target.value };
        try {
            dispatch(updateHome(editHome.id, data));

        } catch (e) {
            console.log(e);
        }
    };

    const likeHandler = async (likeValue) => {
        if (leadData) {
            // setLoading(true);
            const data = { is_liked: likeValue.target.value };
            try {
                await dispatch(updateLead(leadData.id, data));
                setLeadLikeValue(likeValue.target.value);
            } catch (e) {
                console.log(e);
            }
            // setLoading(false);
        }
    };

    return (
        <div>
            {editHomeLoading ? (
                <Spin size="large" />
            ) : (
                <>
                    <section className={`homeDetailsBanner ${!currentLoggedInUser ? "guestUserBlock" : ""}`}>
                        <Image.PreviewGroup>
                            <Row gutter={9}>

                                <Col sm={24} md={12}>
                                    {/* <div className={`homeImg ${!currentLoggedInUser ? "blur-block" : ""}`}> */}
                                    <div className={`homeImg `}>
                                        {editHome.image ?
                                            <Image src={`${config.API}/assets/${editHome.image.id}`} />
                                            :
                                            <img src={`https://via.placeholder.com/600X400`} />
                                        }
                                    </div>
                                </Col>
                                <Col sm={24} md={12}>
                                    {!!editHome.photos && editHome.photos.length ?
                                        <>
                                            <Row gutter={9}>
                                                {editHome.photos.map((item, index) => {
                                                    return (
                                                        <Col sm={24} md={12} key={index} style={{ display: `${index > 3 ? "none" : ""}` }}>
                                                            <div className={`homeImg ${!currentLoggedInUser ? "blur-block" : ""}`}>
                                                                {/* <Image src={sliderImg2} /> */}
                                                                <Image src={`${config.API}/assets/${item.directus_files_id}`} />

                                                            </div>
                                                        </Col>
                                                    )
                                                })}
                                                {/* <Col sm={24} md={12}>
                                                    <div className={`homeImg ${!currentLoggedInUser ? "blur-block" : ""}`}>
                                                        <Image src={sliderImg2} />
                                                    </div>
                                                </Col>
                                                <Col sm={24} md={12}>
                                                    <div className={`homeImg ${!currentLoggedInUser ? "blur-block" : ""}`}>
                                                        <Image src={sliderImg1} />
                                                    </div>
                                                </Col>
                                                <Col sm={24} md={12}>
                                                    <div className={`homeImg ${!currentLoggedInUser ? "blur-block" : ""}`}>
                                                        <Image src={sliderImg1} />
                                                    </div>
                                                </Col>
                                                <Col sm={24} md={12}>
                                                    <div className={`homeImg ${!currentLoggedInUser ? "blur-block" : ""}`}>
                                                        <Image src={sliderImg2} />
                                                    </div>
                                                </Col> */}
                                            </Row>

                                        </> :
                                        <>
                                            <Row gutter={9}>
                                                <Col sm={24} md={12}>
                                                    <div className={`homeImg ${!currentLoggedInUser ? "blur-block" : ""}`}>
                                                        <img src={`https://via.placeholder.com/300X200`} />
                                                    </div>
                                                </Col>
                                                <Col sm={24} md={12}>
                                                    <div className={`homeImg ${!currentLoggedInUser ? "blur-block" : ""}`}>
                                                        <img src={`https://via.placeholder.com/300X200`} />
                                                    </div>
                                                </Col>
                                                <Col sm={24} md={12}>
                                                    <div className={`homeImg ${!currentLoggedInUser ? "blur-block" : ""}`}>
                                                        <img src={`https://via.placeholder.com/300X200`} />
                                                    </div>
                                                </Col>
                                                <Col sm={24} md={12}>
                                                    <div className={`homeImg ${!currentLoggedInUser ? "blur-block" : ""}`}>
                                                        <img src={`https://via.placeholder.com/300X200`} />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>}

                                </Col>
                            </Row>
                        </Image.PreviewGroup>
                    </section>

                    {/* Home Details Top section */}
                    <section className="homeTopDetails">
                        <div className="wrap">
                            <div className="VP-counts">
                                <ul>
                                    <li>

                                        <PhotoSvgIcon />
                                        <span className="count">{(editHome.photos && editHome.image) ? editHome.photos.length + 1 : editHome.image ? "1" : "0"}</span> Photos
                                    </li>
                                    {/* <li>
                                        <VideoSvgIcon />
                                        <span className="count">15</span> Videos
                                    </li> */}
                                </ul>
                            </div>
                            <div className="single-property-intro">
                                <Row>
                                    <Col xs={24} sm={18} md={18} lg={18} xl={20}>
                                        <div className="property-intro">
                                            <h2 className="property-name">
                                                {/* RB01 | <a>{editHome.name}</a> */}
                                                <a className="cap-letter">{editHome.name}</a>
                                            </h2>
                                            <div className="address">
                                                <div
                                                    className=""
                                                    style={{
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: editHome.short_description,
                                                    }}
                                                ></div>
                                                {editHome.short_description ?
                                                    <p
                                                        style={{
                                                            cursor: "pointer"
                                                        }}
                                                        className="read-more-scroll"
                                                        onClick={scrollToDescription}
                                                    >
                                                        Read More
                                                    </p>
                                                    : ""}

                                            </div>
                                            <div className="property-status">
                                                {editHome.verification === "approved" ? (
                                                    <div className="verified">
                                                        <i className="fas fa-certificate"></i>Verified
                                                        Listing
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                    {/* <Col xs={24} sm={6} md={6} lg={6} xl={4}>
                                        <div className="property-review">
                                            {leadData && <div>
                                                <Segmented
                                                    // value={leadLikeValue}
                                                    defaultValue={leadLikeValue}
                                                    options={[

                                                        {
                                                            value: true,
                                                            icon: <ThumbsUpSvgIcon />,
                                                        },
                                                        {
                                                            value: false,
                                                            icon: <ThumbsDownSvgIcon />,
                                                        },

                                                    ]}
                                                    onChange={likeHandler}
                                                />
                                            </div>}
                                        </div>
                                    </Col> */}
                                    {currentLoggedInUser && currentLoggedInUser.role == config.userId.client ? (
                                        <Col sm={24} md={12} xs={24} lg={4} xl={4}>
                                            {editHome ? (
                                                <div className={`property-review`}>
                                                    <Segmented
                                                        defaultValue={editHome.is_liked ? true : !editHome.is_liked ? false : ""}
                                                        options={[
                                                            {
                                                                value: true,
                                                                icon: <LikeFilled />,
                                                            },
                                                            {
                                                                value: false,
                                                                icon: <DislikeFilled />,
                                                            },
                                                        ]}
                                                        onChange={homeLikeDislikeHandle}
                                                    />
                                                </div>
                                            ) : ""}
                                        </Col>
                                    ) : ""}

                                </Row>
                                <Row>
                                    <Col sm={24} md={8} xs={24} lg={8} xl={8}>
                                        <div className="budget">
                                            {/* {`$${budget.min_budget}-$${budget.max_budget}`}<span>/Monthly</span> */}
                                            {formatter.format(budget.min_budget)}-
                                            {formatter.format(budget.max_budget)}
                                            <span>/Monthly</span>
                                        </div>
                                    </Col>
                                    <Col sm={24} md={16} xs={24} lg={16} xl={16}>
                                        <div className="roomtype">
                                            {careOfferedMap(editHome.care_offered)}

                                            {/* <button className="assisted-btn" color="blue">
                                            Assisted Living
                                        </button>
                                        <button color="blue">Memory Care</button> */}
                                        </div>
                                    </Col>
                                </Row>
                                {currentLoggedInUser ? (
                                    <div className="current-special">
                                        <Row>
                                            <Col xs={24}>
                                                <div className="cs-inner">
                                                    <div className="btn">
                                                        <i className="fas fa-star"></i> Current Special
                                                    </div>
                                                    <p>
                                                        {editHome.current_specials}
                                                    </p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ) : ''}

                            </div>
                            <div className="property-basic-details">
                                <Row gutter={24}>
                                    <Col>
                                        <List itemLayout="vertical">
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<i className="fas fa-home"></i>}
                                                    title={"Monthly Rent"}
                                                    description={`${formatter.format(
                                                        budget.min_budget
                                                    )}-${formatter.format(budget.max_budget)}`}
                                                />
                                            </List.Item>
                                        </List>
                                    </Col>
                                    <Col>
                                        <List itemLayout="vertical">
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<i className="fas fa-bed"></i>}
                                                    title={"Bedrooms"}
                                                    description={getbedRoomTypes(editHome.rooms)}
                                                // description={[...new Set(editHome.rooms.map((item, index) => {
                                                //     return (
                                                //         humanize(item.type)
                                                //     )
                                                // }))].join(", ")}
                                                />
                                            </List.Item>
                                        </List>
                                    </Col>
                                    <Col >
                                        <List itemLayout="vertical">
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<i className="fas fa-shower"></i>}
                                                    title={"bathrooms"}
                                                    // description="Jack & Jill-2 Bathrooms"
                                                    description={getBathTypes(editHome.rooms)}
                                                />
                                            </List.Item>
                                        </List>
                                    </Col>
                                    <Col >
                                        <List itemLayout="vertical">
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<i className="fas fa-retweet"></i>}
                                                    title={"Square Feet"}
                                                    description={`${sqFt.min}-${sqFt.max} sq ft`}
                                                />
                                            </List.Item>
                                        </List>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </section>

                    {/* Price and Room Type  */}
                    <section className="price-room-type">
                        <div className="wrap">
                            <Row gutter={24}>
                                <Col
                                    // className="home-deatil-scroll"
                                    className=""
                                    sm={24}
                                    xs={24}
                                    md={24}
                                    lg={15}
                                    xl={15}
                                >
                                    <div className="fliterTitle">
                                        <h3>Pricing & Room Types</h3>
                                        {/* <Dropdown overlay={menu}>
                                            <a onClick={(e) => e.preventDefault()}>
                                                <Space>
                                                    Studio <DownOutlined />
                                                </Space>
                                            </a>
                                        </Dropdown> */}
                                    </div>

                                    {editHome.rooms.map((item, index) => {
                                        if (item.status == "published") {
                                            return (
                                                <RoomCard
                                                    Room={item}
                                                    key={index}
                                                    currentLoggedInUser={currentLoggedInUser}
                                                />
                                            );
                                        }
                                    })}
                                    <div className="community-pricing">
                                        <div className="fliterTitle">
                                            <h3>Community Pricing</h3>
                                        </div>

                                        {editHome.a_la_carte &&
                                            Object.keys(editHome.a_la_carte).map((key) => {
                                                return (
                                                    <div className="room-facility">
                                                        <Row gutter={24}>
                                                            <Col xs={12}>
                                                                <div className="room-facility-content-left">
                                                                    <h2>{humanize(key)}</h2>
                                                                </div>
                                                            </Col>
                                                            <Col xs={12}>
                                                                <div
                                                                    className={`room-facility-content-right ${!currentLoggedInUser ? "blur-block" : ""
                                                                        }`}
                                                                >
                                                                    <h2>${editHome.a_la_carte[key]}</h2>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                );
                                            })}

                                        {/* <div className="room-facility">
                                            <Row gutter={24}>
                                                <Col xs={12}>
                                                    <div className="room-facility-content-left">
                                                        <h2>Community Fee</h2>
                                                    </div>
                                                </Col>
                                                <Col xs={12}>
                                                    <div className={`room-facility-content-right ${!currentLoggedInUser ? "blur-block" : ''}`}>
                                                        <h2>{formatter.format(editHome.community_fee)}</h2>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="room-facility">
                                            <Row gutter={24}>
                                                <Col xs={12}>
                                                    <div className="room-facility-content-left">
                                                        <h2>Level of Care Rates</h2>
                                                    </div>
                                                </Col>
                                                <Col xs={12}>
                                                    <div className={`room-facility-content-right ${!currentLoggedInUser ? "blur-block" : ''}`}>
                                                        <h2>Jack & Jill</h2>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="room-facility">
                                            <Row gutter={24}>
                                                <Col xs={12}>
                                                    <div className="room-facility-content-left">
                                                        <h2>Transportation</h2>
                                                    </div>
                                                </Col>
                                                <Col xs={12}>
                                                    <div className={`room-facility-content-right ${!currentLoggedInUser ? "blur-block" : ''}`}>
                                                        <h2>Jack & Jill</h2>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="room-facility">
                                            <Row gutter={24}>
                                                <Col xs={12}>
                                                    <div className="room-facility-content-left">
                                                        <h2>Wander Guard</h2>
                                                    </div>
                                                </Col>
                                                <Col xs={12}>
                                                    <div className={`room-facility-content-right ${!currentLoggedInUser ? "blur-block" : ''}`}>
                                                        <h2>Jack & Jill</h2>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="room-facility">
                                            <Row gutter={24}>
                                                <Col xs={12}>
                                                    <div className="room-facility-content-left">
                                                        <h2>Second Person Fee </h2>
                                                    </div>
                                                </Col>
                                                <Col xs={12}>
                                                    <div className={`room-facility-content-right ${!currentLoggedInUser ? "blur-block" : ''}`}>
                                                        <h2>{formatter.format(editHome.a_la_carte && editHome.a_la_carte.two_person_transfer)}</h2>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="room-facility">
                                            <Row gutter={24}>
                                                <Col xs={12}>
                                                    <div className="room-facility-content-left">
                                                        <h2>Pet Fee</h2>
                                                    </div>
                                                </Col>
                                                <Col xs={12}>
                                                    <div className={`room-facility-content-right ${!currentLoggedInUser ? "blur-block" : ''}`}>
                                                        <h2>Jack & Jill</h2>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="room-facility">
                                            <Row gutter={24}>
                                                <Col xs={12}>
                                                    <div className="room-facility-content-left">
                                                        <h2>Incontinence Care</h2>
                                                    </div>
                                                </Col>
                                                <Col xs={12}>
                                                    <div className={`room-facility-content-right ${!currentLoggedInUser ? "blur-block" : ''}`}>
                                                        <h2>Jack & Jill</h2>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div> */}
                                    </div>
                                    <div className="check-availability">
                                        {/* {!currentLoggedInUser ? <Button onClick={loginPopup} type="success-color">Access All Pricing</Button> : ""} */}
                                        <Button href={`${MainUrl}/contact-us`} type="primary">
                                            Access All Pricing
                                        </Button>
                                    </div>
                                    <div className="about-paragraph" id="detail-description">
                                        <div className="fliterTitle">
                                            {/* <h3>About | RB01</h3> */}
                                            <h3>About</h3>
                                        </div>
                                        <div
                                            className=""
                                            dangerouslySetInnerHTML={{
                                                __html: editHome.short_description,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="location-deatil ">
                                        <div className="fliterTitle">
                                            <h3>Location</h3>
                                        </div>
                                        {/* <p>Redondo Beach, California, United States</p> */}
                                        <p>
                                            {editHome.city && `${editHome.city}, `}{" "}
                                            {editHome.state && `${editHome.state}, `}{" "}
                                            {editHome.county}
                                        </p>
                                        {/* <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13004082.928417291!2d-104.65713107818928!3d37.275578278180674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sin!4v1651474031436!5m2!1sen!2sin"
                                        width="100%"
                                        height="300"
                                        allowfullscreen=""
                                        loading="lazy"
                                        referrerpolicy="no-referrer-when-downgrade"
                                    ></iframe> */}
                                        <Map Home={editHome} />
                                    </div>
                                    {editHome.care_services && (
                                        <div className=" price-type-content our-services">
                                            <Row>
                                                <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                                                    <div className="property-intro">
                                                        <h2 className="property-name">
                                                            <HeartOutlined />
                                                            Care Services
                                                        </h2>
                                                    </div>
                                                </Col>
                                                <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                                                    <div className="read-deatl-btn">
                                                        <div className="deatl-edit-btn">
                                                            <a
                                                                className="assisted-btn"
                                                                color="blue"
                                                                onClick={() => {
                                                                    setServicesDetails((values) => {
                                                                        return {
                                                                            ...values,
                                                                            careService: !servicesDetails.careService,
                                                                        };
                                                                    });
                                                                }}
                                                            >
                                                                {" "}
                                                                Details {servicesDetails.careService ? <UpCircleFilled /> : <DownCircleFilled />}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div
                                                className="our-services-content"
                                                style={{
                                                    display: servicesDetails.careService
                                                        ? "block"
                                                        : "none",
                                                }}
                                            >
                                                {/* <div className="RoomAmenities">
                                                <Row gutter={24}>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div> */}
                                                <div className="services-features">
                                                    {/* {editHome.care_services} */}
                                                    <ul>
                                                        {editHome.care_services &&
                                                            editHome.care_services.map((type) => {
                                                                let Data;
                                                                homeCareServicesOptions.forEach((Item) => {
                                                                    if (Item.value === type) {
                                                                        Data = <li>{Item.text}</li>;
                                                                    }
                                                                });
                                                                return Data;
                                                            })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {editHome.activities && (
                                        <div className=" price-type-content our-services">
                                            <Row>
                                                <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                                                    <div className="property-intro">
                                                        <h2 className="property-name">
                                                            <ActivitiesSvgIcon />
                                                            Activities
                                                        </h2>
                                                    </div>
                                                </Col>
                                                <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                                                    <div className="read-deatl-btn">
                                                        <div className="deatl-edit-btn">
                                                            <a
                                                                className="assisted-btn"
                                                                color="blue"
                                                                onClick={() => {
                                                                    setServicesDetails((values) => {
                                                                        return {
                                                                            ...values,
                                                                            activities: !servicesDetails.activities,
                                                                        };
                                                                    });
                                                                }}
                                                            >
                                                                {" "}
                                                                Details {servicesDetails.activities ? <UpCircleFilled /> : <DownCircleFilled />}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div
                                                className="our-services-content"
                                                style={{
                                                    display: servicesDetails.activities
                                                        ? "block"
                                                        : "none",
                                                }}
                                            >
                                                {/* <div className="RoomAmenities">
                                                <Row gutter={24}>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div> */}
                                                <div className="services-features">
                                                    {/* {editHome.care_services} */}
                                                    <ul>
                                                        {editHome.activities &&
                                                            editHome.activities.map((type) => {
                                                                let Data;
                                                                homeActivitiesOptions.forEach((Item) => {
                                                                    if (Item.value === type) {
                                                                        Data = <li>{Item.text}</li>;
                                                                    }
                                                                });
                                                                return Data;
                                                            })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {editHome.community_amenities && (
                                        <div className=" price-type-content our-services">
                                            <Row>
                                                <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                                                    <div className="property-intro">
                                                        <h2 className="property-name">
                                                            <HomeOutlined />
                                                            Community Amenities
                                                        </h2>
                                                    </div>
                                                </Col>
                                                <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                                                    <div className="read-deatl-btn">
                                                        <div className="deatl-edit-btn">
                                                            <a
                                                                className="assisted-btn"
                                                                color="blue"
                                                                onClick={() => {
                                                                    setServicesDetails((values) => {
                                                                        return {
                                                                            ...values,
                                                                            amenities: !servicesDetails.amenities,
                                                                        };
                                                                    });
                                                                }}
                                                            >
                                                                {" "}
                                                                Details {servicesDetails.amenities ? <UpCircleFilled /> : <DownCircleFilled />}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div
                                                className="our-services-content"
                                                style={{
                                                    display: servicesDetails.amenities ? "block" : "none",
                                                }}
                                            >
                                                {/* <div className="RoomAmenities">
                                                <Row gutter={24}>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div> */}
                                                <div className="services-features">
                                                    {/* {editHome.care_services} */}
                                                    <ul>
                                                        {editHome.community_amenities &&
                                                            editHome.community_amenities.map((type) => {
                                                                let Data;
                                                                communityAmenitiesOptions.forEach((Item) => {
                                                                    if (Item.value === type) {
                                                                        Data = <li>{Item.text}</li>;
                                                                    }
                                                                });
                                                                return Data;
                                                            })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {editHome.special_services.length ? (
                                        <div className=" price-type-content our-services">
                                            <Row>
                                                <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                                                    <div className="property-intro">
                                                        <h2 className="property-name">
                                                            <StarOutlined />
                                                            Special Services
                                                        </h2>
                                                    </div>
                                                </Col>
                                                <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                                                    <div className="read-deatl-btn">
                                                        <div className="deatl-edit-btn">
                                                            <a
                                                                className="assisted-btn"
                                                                color="blue"
                                                                onClick={() => {
                                                                    setServicesDetails((values) => {
                                                                        return {
                                                                            ...values,
                                                                            specialServices: !servicesDetails.specialServices,
                                                                        };
                                                                    });
                                                                }}
                                                            >
                                                                {" "}
                                                                Details {servicesDetails.specialServices ? <UpCircleFilled /> : <DownCircleFilled />}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div
                                                className="our-services-content"
                                                style={{
                                                    display: servicesDetails.specialServices
                                                        ? "block"
                                                        : "none",
                                                }}
                                            >
                                                {/* <div className="RoomAmenities">
                                                <Row gutter={24}>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                    <Col sm={24} md={8} lg={8} xl={8}>
                                                        <div className="img-option">
                                                            <Image src={sliderImg1} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div> */}
                                                <div className="services-features">
                                                    {/* {editHome.care_services} */}
                                                    <ul>
                                                        {editHome.special_services &&
                                                            editHome.special_services.map((type) => {
                                                                let Data;
                                                                specialServicesOptions.forEach((Item) => {
                                                                    if (Item.value === type) {
                                                                        Data = <li>{Item.text}</li>;
                                                                    }
                                                                });
                                                                return Data;
                                                            })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ) : ""}

                                </Col>
                                <Col sm={24} xs={24} md={24} lg={9} xl={9} id="callUs_single">
                                    <div className="callUs_single" style={{ width: `${stickyFormWidth}px` }}>
                                        <h3>Call us for help</h3>
                                        <div className="call_info">
                                            <a href="tel:(877) 263-2272">
                                                <i className="fas fa-phone-alt"></i>(877) 263-2272
                                            </a>
                                        </div>
                                        <hr></hr>
                                        <div className="contact-communitybtn">
                                            <Button href={`${MainUrl}/contact-us`} type="primary">
                                                Contact Community
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </section>
                </>
            )}
            <LoginPopup logInModalVisible={logInModalVisible} redirect={true} OnSubmit={loginModalSubmitHandle} willLater={false} logInDirect={false} />

        </div>
    );
};

function scrollToDescription() {
    document.getElementById("detail-description").scrollIntoView();
}

function mapStateToProps(state) {
    return {
        editHomeLoading: state.home.editHomeLoading,
        currentLoggedInUser: state.user.currentLoggedInUser,
        editHome: state.home.editHome,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getById: dispatch(getById),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeDetail);
