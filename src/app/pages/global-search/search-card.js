import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Tag, Select, Card, Divider, Button, Modal, Input, Form, Spin, List, Avatar, Checkbox, Typography, Segmented, Row, Col } from "antd";
import moment from "moment";
import { updateLead } from "../../redux/actions/lead-actions";
import { humanize } from "../../helpers/string-helper";
import { homeCareOfferedOptions, residentBedroomOptions } from "../../constants/defaultValues";
import Config from "../../config";
import { SpaceContext } from "antd/lib/space";
import Slider from "react-slick";
import { ThumbsDownSvgIcon, ThumbsUpSvgIcon, ThumbsUpSvgIconNew } from "../../assets/svg-icon/icon";
import { updateHome } from "../../redux/actions/home-actions";
import { faL } from "@fortawesome/free-solid-svg-icons";
import defaultImage from "../../assets/images/second-home-facility-default.jpg";

const { Text, Link } = Typography;
const { Meta } = Card;
const { TextArea } = Input;

const SearchCard = ({ home, history, currentLoggedInUser, lead }) => {
    // console.log(home.is_liked, home.id, "home");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [leadLikeValue, setLeadLikeValue] = useState(home.is_liked == 1 ? true : lead.is_liked == 0 ? false : "")

    const roomTypes = (Rooms) => {
        let TempRooms = [];
        Rooms.forEach((Item, Index) => {
            if (Item.status == "published" && Item.availability !== null) {
                if (!TempRooms.includes(Item.type) && Item.type !== null) {
                    if (Item.availability == "shared_male") {
                        Item.type == "shared_2_people" && TempRooms.push("Shared 2 People Male");
                        Item.type == "shared_3_people" && TempRooms.push("Shared 3 People Male")
                    }
                    else if (Item.availability == "shared_female") {
                        Item.type == "shared_2_people" && TempRooms.push("Shared 2 People Female");
                        Item.type == "shared_3_people" && TempRooms.push("Shared 3 People Female")
                    }
                    else if (Item.availability !== "shared_male" && Item.availability !== "shared_female") {
                        TempRooms.push(Item.type);
                    }

                }
            }

        })
        // console.log(TempRooms);
        // console.log([...new Set(TempRooms)], "dasdadada");
        TempRooms = [...new Set(TempRooms)];
        return TempRooms.map((item, index) => {
            // let Value = '';
            // residentBedroomOptions.forEach(Item => {
            //     if (Item.value.trim() === item.trim()) {
            //         Value = Item.text;
            //     }
            // });
            return <Tag key={index} color="blue">{humanize(item)}</Tag>
        });
    }
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const likeHandler = async (likeValue) => {
        setLoading(true)
        const data = { is_liked: likeValue };
        try {
            await dispatch(updateHome(home.id, data));
            setLeadLikeValue(likeValue);
            // setLoading(false)
        } catch (e) {
            console.log(e);
        }
        setLoading(false);

    };

    return (
        <React.Fragment>
            <Card>
                <div className="card-content">
                    <Meta
                        description={
                            <div className="card-details" style={{ marginBottom: '0' }}>

                                <div className="card-img">
                                    {/* <Tag color="blue" className="home-status">
                                        Available
                                    </Tag> */}
                                    <Slider {...settings} className={`search-slider ${!currentLoggedInUser ? "search-slider-non-user" : ""}`}>
                                        {home.image ? <div className="img-height"><img src={`${Config.API}/assets/${home.image}`} /></div> : <div className="img-height"> <img src={defaultImage} /></div>}
                                        {home.photos && home.photos.length && home.photos.map((item, index) => {
                                            return <div key={index}><img src={`${Config.API}/assets/${item.directus_files_id}`} /></div>
                                        })}
                                    </Slider>
                                    {/* {home.image ?
                                        <img src={`${Config.API}/assets/${home.image}`} />
                                        :
                                        <img src={`https://via.placeholder.com/600X400`} />
                                    } */}
                                    {/* <img src={`${Config.API}/assets/${home.image}`} /> */}
                                </div>
                                <div className="home-content">
                                    {/* <Slider {...settings}>
                                        <div>
                                            <h3>1</h3>
                                        </div>
                                        <div>
                                            <h3>2</h3>
                                        </div>
                                        <div>
                                            <h3>3</h3>
                                        </div>
                                        <div>
                                            <h3>4</h3>
                                        </div>
                                        <div>
                                            <h3>5</h3>
                                        </div>
                                        <div>
                                            <h3>6</h3>
                                        </div>
                                    </Slider> */}
                                    {/* {home.status}<br />
                                    {home.id} */}
                                    <Row>
                                        <Col xs={24} xl={16}>
                                            <h1 className="cap-letter">{home.name && home.name}</h1>
                                            <div className="title cap-letter">{home.care_offered && home.care_offered.map((item, index) => {
                                                let Value = '';
                                                homeCareOfferedOptions.forEach(Item => {
                                                    if (Item.value === item) {
                                                        Value = Item.text;
                                                    }
                                                });
                                                return Value
                                            }).join(", ")}</div></Col>
                                        {currentLoggedInUser && currentLoggedInUser.role == Config.userId.client ? (<>
                                            <Col xs={24} xl={8} className="likeHandler">
                                                {loading ? <Spin /> :
                                                    <>
                                                        <div  onClick={() => likeHandler(true)} className={leadLikeValue == true ? "like-active feedbackIcon" : "feedbackIcon"}>
                                                            <ThumbsUpSvgIconNew />
                                                        </div>
                                                        <div  onClick={() => likeHandler(false)} className={leadLikeValue == false ? "feedbackIcon dislike-active" : "feedbackIcon"}>
                                                            <ThumbsDownSvgIcon />
                                                        </div>
                                                    </>
                                                }

                                                {/*<Segmented
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
                                               /> */}
                                            </Col>
                                        </>) : ""}

                                        {/* {lead && <Col xs={24} xl={8} className="likeHandler">
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
                                        </Col>} */}
                                    </Row>
                                    <div className="budget">
                                        {/* {`$${home.min_budget} - $${home.max_budget}`} */}
                                        {formatter.format(home.min_budget)} - {formatter.format(home.max_budget)}
                                    </div>
                                    <div className="roomtype" >{roomTypes(home.rooms)}</div>
                                    <div className="d-flex">
                                        <div className="address" style={{ marginBottom: '0' }}>

                                            {home.city}{home.state && `, ${home.state}`}{home.zip && `, ${home.zip}`}
                                        </div>
                                        {/* <Button className="learn-btn" onClick={() => {
                                            history.push(`/home-detail/${home.id}`);
                                        }} style={{ marginTop: '10px' }}>Learn More</Button> */}
                                        <a href={`/dashboard/home-detail/${home.id}`} target="_blank">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </div>
            </Card>
        </React.Fragment >
    );
};

export default SearchCard;
