import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Button,
  Col,
  Dropdown,
  Image,
  Layout,
  List,
  Menu,
  Row,
  Segmented,
  Space,
  Tag,
} from "antd";
import sliderImg1 from "../../../app/assets/images/home-details-banner1.jpg";
import sliderImg2 from "../../../app/assets/images/save-financial-resources.jpg";
import kitchen from "../../../app/assets/images/kitchenette.png";
import air from "../../../app/assets/images/air_conditioning.png";
import almera from "../../../app/assets/images/fully_furnished.png";
import shower from "../../../app/assets/images/walk-in_shower.png";
import tv from "../../../app/assets/images/tv_installed.png";
import wash from "../../../app/assets/images/washer_and_dryer.png";
import wifi from "../../../app/assets/images/wifi.png";
import floor from "../../../app/assets/images/hardwood_floors.png";
import {
  LikeFilled,
  DislikeFilled,
  SmileOutlined,
  DownOutlined,
  DownCircleFilled,
  HeartOutlined,
  StarOutlined,
  ManOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
const HomeDetails = ({ history }) => {
  return (
    <>
      <section className="homeDetailsBanner">
        <Image.PreviewGroup>
          <Row gutter={9}>
            <Col sm={24} md={12}>
              <div className="homeImg">
                <Image src={sliderImg1} />
              </div>
            </Col>
            <Col sm={24} md={12}>
              <Row gutter={9}>
                <Col sm={24} md={12}>
                  <div className="homeImg blur-block">
                    <Image src={sliderImg2} />
                  </div>
                </Col>
                <Col sm={24} md={12}>
                  <div className="homeImg blur-block">
                    <Image src={sliderImg1} />
                  </div>
                </Col>
              </Row>
              <Row gutter={9}>
                <Col sm={24} md={12}>
                  <div className="homeImg blur-block">
                    <Image src={sliderImg1} />
                  </div>
                </Col>
                <Col sm={24} md={12}>
                  <div className="homeImg blur-block">
                    <Image src={sliderImg2} />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Image.PreviewGroup>
      </section>

      {/* Home Details Top section */}
      <section className="homeTopDetails">
        <div className="wrap">
          <div className="single-property-intro">
            <Row>
              <Col sm={24} md={12} xs={24} lg={20} xl={20}>
                <div className="property-intro">
                  <h2 className="property-name">
                    RB01 | <a href="#">Redondo Beach</a>
                  </h2>
                  <div className="address">
                    Redondo Beach is a coastal city in Los Angeles.
                  </div>
                  <div className="property-status">
                    <div className="verified">
                      <i className="fas fa-certificate"></i>Verified Listing
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm={24} md={12} xs={24} lg={4} xl={4}>
                <div className="property-review">
                  <Segmented
                    options={[
                      {
                        value: "like",
                        icon: <LikeFilled />,
                      },
                      {
                        value: "Dislike",
                        icon: <DislikeFilled />,
                      },
                    ]}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={6} xs={24} lg={6} xl={6}>
                <div className="budget">
                  {" "}
                  $6,840-$12,320<span>/Monthly</span>
                </div>
              </Col>
              <Col sm={24} md={18} xs={24} lg={18} xl={18}>
                <div className="roomtype ">
                  <button className="assisted-btn" color="blue">
                    Assisted Living
                  </button>
                  <button color="blue">Memory Care</button>
                </div>
              </Col>
            </Row>
            <div className="current-special">
              <Row>
                <Col xs={24}>
                  <div className="cs-inner">
                    <div className="btn">
                      <i className="fas fa-star"></i> Current Special
                    </div>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="property-basic-details">
            <Row gutter={24}>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <List itemLayout="vertical">
                  <List.Item>
                    <List.Item.Meta
                      avatar={<i className="fas fa-home"></i>}
                      title={"Monthly Rent"}
                      description="$6,840-$12,320"
                    />
                  </List.Item>
                </List>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <List itemLayout="vertical">
                  <List.Item>
                    <List.Item.Meta
                      avatar={<i className="fas fa-bed"></i>}
                      title={"Bedrooms"}
                      description="Studio-2 Bed"
                    />
                  </List.Item>
                </List>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <List itemLayout="vertical">
                  <List.Item>
                    <List.Item.Meta
                      avatar={<i className="fas fa-shower"></i>}
                      title={"bathrooms"}
                      description="1-2 Bathrooms"
                    />
                  </List.Item>
                </List>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <List itemLayout="vertical">
                  <List.Item>
                    <List.Item.Meta
                      avatar={<i className="fas fa-retweet"></i>}
                      title={"Square Feet"}
                      description="600-834 sq ft"
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
              className="home-deatil-scroll"
              sm={24}
              xs={24}
              md={24}
              lg={15}
              xl={15}
            >
              <div className="fliterTitle">
                <h3>Pricing & Room Types</h3>
                <Dropdown overlay={menu}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      Studio <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </div>
              <div className="single-property-intro price-type-content">
                <Row>
                  <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                    <div className="property-intro">
                      <h2 className="property-name">
                        The Redondo<a href="#"> - 1st Floor </a>
                      </h2>
                      <div className="address">
                        Redondo Beach is a coastal city in Los Angeles.
                      </div>
                    </div>
                  </Col>
                  <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                    <div className="property-review">
                      <div className="roomtype ">
                        <button color="blue">Assisted Living</button>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                    <div className="budget">
                      {" "}
                      <span>$ 6,840/</span> + Level of care/Monthly
                    </div>
                  </Col>
                  <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                    <div className="read-deatl-btn">
                      <div className="deatl-edit-btn">
                        <a className="assisted-btn" color="blue" href="">
                          {" "}
                          Room details <DownCircleFilled />
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="single-property-intro price-type-content">
                <Row>
                  <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                    <div className="property-intro">
                      <h2 className="property-name">
                        The Redondo<a href="#"> - 1st Floor </a>
                      </h2>
                      <div className="address">
                        Redondo Beach is a coastal city in Los Angeles.
                      </div>
                    </div>
                  </Col>
                  <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                    <div className="property-review">
                      <div className="roomtype">
                        <button color="blue">Assisted Living</button>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                    <div className="budget">
                      {" "}
                      <span>$ 6,840/</span> + Level of care/Monthly
                    </div>
                  </Col>
                  <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                    <div className="read-deatl-btn">
                      <div className="deatl-edit-btn">
                        <a className="assisted-btn" color="blue" href="">
                          {" "}
                          Room details <DownCircleFilled />
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="RoomAmenities">
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
                  <div className="room-facility">
                    <Row gutter={24}>                    
                      <Col sm={24} md={12} lg={12} xl={12}>
                        <div className="room-facility-content-left">
                          <h2>Bathroom Type</h2>
                        </div>
                      </Col>
                      <Col sm={24} md={12} lg={12} xl={12}>
                        <div className="room-facility-content-right">
                          <h2>Jack & Jill</h2>
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
                          <h2>Yes</h2>
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
                      <Col sm={12} md={12} lg={12} xl={8}>
                        <div className="features-option">
                          <h2>
                            <Image src={kitchen} />
                            Kitchenette{" "}
                          </h2>
                        </div>
                      </Col>
                      <Col sm={12} md={12} lg={12} xl={8}>
                        <div className="features-option">
                          <h2>
                            {" "}
                            <Image src={wash} /> Washer & Dryer{" "}
                          </h2>
                        </div>
                      </Col>
                      <Col sm={12} md={12} lg={12} xl={8}>
                        <div className="features-option">
                          <h2>
                            {" "}
                            <Image src={wifi} />
                            Wifi{" "}
                          </h2>
                        </div>
                      </Col>
                      <Col sm={12} md={12} lg={12} xl={8}>
                        <div className="features-option">
                          <h2>
                            <Image src={floor} />
                            Hardwood Floors
                          </h2>
                        </div>
                      </Col>
                      <Col sm={12} md={12} lg={12} xl={8}>
                        <div className="features-option">
                          <h2>
                            <Image src={almera} />
                            Fully Furnished{" "}
                          </h2>
                        </div>
                      </Col>
                      <Col sm={12} md={12} lg={12} xl={8}>
                        <div className="features-option">
                          <h2>
                            <Image src={shower} />
                            Roll-in Shower{" "}
                          </h2>
                        </div>
                      </Col>
                      <Col sm={12} md={12} lg={12} xl={8}>
                        <div className="features-option">
                          <h2>
                            {" "}
                            <Image src={air} />
                            Air Conditioning{" "}
                          </h2>
                        </div>
                      </Col>
                      <Col sm={12} md={12} lg={12} xl={8}>
                        <div className="features-option">
                          <h2>
                            {" "}
                            <Image src={tv} />
                            TV Installed{" "}
                          </h2>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="check-availability">
                    <Button type="success-color">Check Availability</Button>
                  </div>
                </div>
              </div>
              <div className="community-pricing">
                <div className="fliterTitle">
                  <h3>Community Pricing</h3>
                </div>
                <div className="room-facility">
                  <Row gutter={24}>
                    <Col xs={12}>
                      <div className="room-facility-content-left">
                        <h2>Community Fee</h2>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="room-facility-content-right blur-block">
                        <h2>Jack & Jill</h2>
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
                      <div className="room-facility-content-right blur-block">
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
                      <div className="room-facility-content-right blur-block">
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
                      <div className="room-facility-content-right blur-block">
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
                      <div className="room-facility-content-right blur-block">
                        <h2>Jack & Jill</h2>
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
                      <div className="room-facility-content-right blur-block">
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
                      <div className="room-facility-content-right blur-block">
                        <h2>Jack & Jill</h2>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="check-availability">
                <Button type="success-color">Access All Pricing </Button>
              </div>
              <div className="about-paragraph">
                <div className="fliterTitle">
                  <h3>About | RB01</h3>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Tellus diam eleifend cum fringilla dolor. Tellus sed diam
                  ultrices sollicitudin. Sit tortor ullamcorper pellentesque
                  tincidunt et auctor varius id ullamcorper. Sit nisi arcu sed
                  venenatis vulputate nibh. Volutpat quis malesuada tincidunt
                  quis libero aliquet pellentesque diam. Adipiscing risus in nec
                  eu maecenas elementum. Arcu luctus suspendisse lorem id ipsum
                  faucibus volutpat.
                </p>
              </div>
              <div className="location-deatil ">
                <div className="fliterTitle">
                  <h3>Location</h3>
                </div>
                <p>Redondo Beach, California, United States</p>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13004082.928417291!2d-104.65713107818928!3d37.275578278180674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sin!4v1651474031436!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
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
                        <a className="assisted-btn" color="blue" href="">
                          {" "}
                          Room details <DownCircleFilled />
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="our-services-content">
                  <div className="RoomAmenities">
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
                  </div>
                  <div className="services-features">
                    <ul>
                      <li>Bathing Assistance</li>
                      <li> Dressing Assistance </li>
                      <li>Feeding Assistance</li>
                      <li>Transfer Assistance</li>
                      <li> Grooming Assistance </li>
                      <li>Night Supervision </li>
                      <li> Walking Assistance </li>
                      <li>Toileting Assistance </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className=" price-type-content our-services">
                <Row>
                  <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                    <div className="property-intro">
                      <h2 className="property-name">
                        <StarOutlined />
                        Care Services
                      </h2>
                    </div>
                  </Col>
                  <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                    <div className="read-deatl-btn">
                      <div className="deatl-edit-btn">
                        <a className="assisted-btn" color="blue" href="">
                          {" "}
                          Room details <DownCircleFilled />
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className=" price-type-content our-services">
                <Row>
                  <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                    <div className="property-intro">
                      <h2 className="property-name">
                        <ManOutlined />
                        Activities
                      </h2>
                    </div>
                  </Col>
                  <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                    <div className="read-deatl-btn">
                      <div className="deatl-edit-btn">
                        <a className="assisted-btn" color="blue" href="">
                          {" "}
                          Room details <DownCircleFilled />
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className=" price-type-content our-services">
                <Row>
                  <Col sm={24} md={12} xs={24} lg={18} xl={18}>
                    <div className="property-intro">
                      <h2 className="property-name">
                        <HomeOutlined />
                        Amenities
                      </h2>
                    </div>
                  </Col>
                  <Col sm={24} md={12} xs={24} lg={6} xl={6}>
                    <div className="read-deatl-btn">
                      <div className="deatl-edit-btn">
                        <a className="assisted-btn" color="blue" href="">
                          {" "}
                          Room details <DownCircleFilled />
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col sm={24} xs={24} md={24} lg={9} xl={9}>
              <div className="callUs_single">
                <h3>Call us for help</h3>
                <div className="call_info">
                  <a href="tel:(877) 263-2272">
                    <i className="fas fa-phone-alt"></i>(877) 263-2272
                  </a>
                </div>
                <hr></hr>
                <div className="contact-communitybtn">
                  <Button type="primary">Contact Community</Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeDetails);
