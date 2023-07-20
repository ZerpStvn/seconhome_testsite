import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Tabs,
  Spin,
  Carousel,
  Select,
  Modal,
} from "antd";
import {
  HeartOutlined,
  SearchOutlined,
  StarOutlined,
  LeftOutlined,
  RightOutlined,
  StarFilled,
  PlusOutlined,
  CaretDownOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signin } from "../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../services/notification-service";
import HomeBanner from "../../../app/assets/images/home-banner.png";
import WhyUsImg1 from "../../../app/assets/images/save-financial-resources.jpg";
import WhyUsImg2 from "../../../app/assets/images/peaceofmind.jpg";
import WhyUsImg3 from "../../../app/assets/images/save-time.jpg";
import HelpImg1 from "../../../app/assets/images/assistance.jpg";
import HelpImg2 from "../../../app/assets/images/need-help.jpg";
import HelpImg3 from "../../../app/assets/images/search-by-own.jpg";
import SearchLocation from "../../../app/assets/images/search-banner.jpg";
import SearchLocationImg from "../../../app/assets/images/search-banner.jpg";
import AlsCommunity from "../../../app/assets/images/assisted-living-seniors.jpg";
import McsCommunity from "../../../app/assets/images/memory-care-seniors.jpg";
import BannerHomeSearchIcon from "../../../app/assets/images/banner-home-search-icon.svg";
import HomeSearch from "../../../app/assets/images/home-search.svg";
import HomeMap from "../../../app/assets/images/home-map.svg";
import Searchicon from "../../../app/assets/images/search-icon.svg";
import Personalapproach from "../../../app/assets/images/personal-approach.svg";
import Teamofintegrity from "../../../app/assets/images/team-of-integrity.svg";
import listenempathize from "../../../app/assets/images/listen-empathize.svg";
import locallybased from "../../../app/assets/images/locally-based.svg";
import imggg from "../../../app/assets/images/imggg.png";
import dot from "../../../app/assets/images/dot.png";
import desktop from "../../../app/assets/images/desktop.png";
import coin from "../../../app/assets/images/coin.png";
import heart from "../../../app/assets/images/heart.png";
import comment from "../../../app/assets/images/comment.png";
import clock from "../../../app/assets/images/clock.png";
import clockh from "../../../app/assets/images/clockh.png";
import check from "../../../app/assets/images/check.png";
import clientcon from "../../../app/assets/images/client-con.png";
import circlecheck from "../../../app/assets/images/circle-check.png";
import newsback from "../../../app/assets/images/news-back.png";
import YouTube from "react-youtube";

import SouthBayImg from "../../../app/assets/images/south-bay-los-angeles.jpeg";
import WestLosAngelesImg from "../../../app/assets/images/west-los-angeles.jpeg";
import SanFernandoValleyImg from "../../../app/assets/images/san-fernando-valley.jpeg";
import LongBeachImg from "../../../app/assets/images/newport-beach.jpeg";
import LogInPopUp from "../../pages/login/login-popup";

const Homepage = ({ history, userRole }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [numOfTestimonials, setnNumOfTestimonials] = useState(3);
  const [openModal, setOpenModal] = useState(false);
  const [SearchValue, SetSearchValue] = useState({});
  const [logInModalVisible, setLogInModalVisible] = useState(false);

  const updateMedia = () => {
    var num =
      window.innerWidth > 1199
        ? 3
        : window.innerWidth < 1199 && window.innerWidth > 767
        ? 2
        : 1;
    setnNumOfTestimonials(num);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const OnSubmit = () => {
    // sessionStorage.setItem("searchFormData", JSON.stringify(data));
    if (!userRole) {
      setLogInModalVisible(!logInModalVisible);
    } else {
      history.push("/search", form.getFieldValue().search);
    }
  };

  const loginModalSubmitHandle = () => {
    history.push("/search", form.getFieldValue().search);
  };

  const { Option } = Select;
  const { TabPane } = Tabs;
  const { Meta } = Card;

  const youtubeOptions = {
    height: "250",
    width: "100%",
  };

  const youtubeModalOptions = {
    height: "350",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  /* Disable right click and f12 */
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });

  document.onkeypress = function(event) {
    event = event || window.event;
    if (event.keyCode == 123) {
      return false;
    }
  };
  document.onmousedown = function(event) {
    event = event || window.event;
    if (event.keyCode == 123) {
      return false;
    }
  };
  document.onkeydown = function(event) {
    event = event || window.event;
    if (event.keyCode == 123) {
      return false;
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == "I".charCodeAt(0)) {
      return false;
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == "C".charCodeAt(0)) {
      return false;
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == "J".charCodeAt(0)) {
      return false;
    }
    if (event.ctrlKey && event.keyCode == "U".charCodeAt(0)) {
      return false;
    }
  };

  document.ondragstart = function(event) {
    return false;
  };
  /* Disable right click and f12 */

  const videoModalCloseHandle = () => {
    setOpenModal(false);
  };
  const Pause = (e) => {
    console.log(e);
  };
  return (
    <>
      <div className="home-page">
        {/* HOME BANNER START */}
        <section className="home-banner">
          <div className="container">
            <Row gutter={16} className="home-banner-content-row">
              <Col xs={24} md={12}>
                <div className="home-banner-content">
                  <img src={BannerHomeSearchIcon} alt="logo" width="50px" />
                  <h1>Locate Licensed Senior Living</h1>
                  <p>
                    Second Home operates similarly to local real estate agents,
                    but tailored to assisted living, board and care, and memory
                    care facilities. All at no-cost to you!
                  </p>
                  <div className="bannerSearchForm">
                    <Form
                      name="home_banner_form"
                      form={form}
                      layout="vertical"
                      onFinish={OnSubmit}
                    >
                      <Form.Item name="housing_type">
                        <img src={HomeSearch} alt="logo" className="Home Map" />
                        <Select
                          suffixIcon={<CaretDownOutlined />}
                          className="optionform"
                          defaultValue="I'm looking for..."
                          style={{ width: "100%" }}
                        >
                          <Option value="assisted_living">
                            Assisted Living
                          </Option>
                          <Option value="memory_care">
                            Memory Care Community
                          </Option>
                          <Option value="board_and_care_home">
                            Board and Care Home
                          </Option>
                          <Option value="independent_living">
                            Independent Living
                          </Option>
                          <Option value="continuing_care_retirement_community">
                            Continuing Care Retirement Community
                          </Option>
                          <Option value="active_adult_community">
                            Active Older Adult Community (55+)
                          </Option>
                          <Option value="skilled_nursing_facility">
                            Skilled Nursing Facility
                          </Option>
                        </Select>
                      </Form.Item>
                      <Form.Item name="search">
                        {/* <img src={HomeMap} alt="logo" className="Home Map" /> */}
                        <Input
                          type="number"
                          placeholder="Enter ZIP code"
                          suffix={
                            <img
                              src={HomeMap}
                              alt="logo"
                              className="Home Map"
                            />
                          }
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="searchBtn"
                        >
                          Search <SearchOutlined />
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="bannerImg">
                  <img src={HomeBanner} alt="logo" className="banner-img" />
                  <svg
                    width="0"
                    height="0"
                    viewBox="0 0 598.6 564.2"
                    preserveAspectRatio="none"
                  >
                    <clipPath
                      id="BannerSvgPath"
                      clipPathUnits="objectBoundingBox"
                      transform="scale(0.00153846154, 0.0017699115)"
                    >
                      <path
                        style={{ Fill: "#000" }}
                        d="M488.7,140c0,0-133-138-221-140s-134,76-134,76s-190,293-117,384s159,97,159,97s271.8,53,407.9-130,C583.6,427,666.7,304,488.7,140z"
                      />
                    </clipPath>
                  </svg>
                </div>
              </Col>
            </Row>
          </div>
        </section>
        {/* /HOME BANNER END */}
        {/* HELP SECTION START */}

        {/* WHY FAMILY */}
        <section className="professional-experienced ">
          <div className="container">
            <Row gutter={32} className="professional-experienced-row">
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <div className="professional-experienced-content">
                  <h4>WHY FAMILIES TRUST US</h4>
                  <h3>Professional & Experienced Senior Living Advisors</h3>
                  <p>
                    Second Home has guided hundreds of families on making
                    confident and informed decisions regarding senior living for
                    their loved ones.
                  </p>
                  <br></br>
                  <p>
                    Our senior living placement service aims to match your loved
                    one with care homes according to their specialized needs,
                    budget and the services offered by the facility.
                  </p>
                  <Row gutter={32}>
                    <Col xs={24} md={24}>
                      <div className="persnl-approch-section">
                        <div className="personal-approach">
                          <div className="personal-approach-img">
                            <img
                              src={Personalapproach}
                              alt="logo"
                              width={50}
                              height={50}
                            />
                            <span> Personal Approach</span>
                          </div>
                          <div className="personal-approach-img">
                            <img
                              src={Teamofintegrity}
                              alt="logo"
                              width={50}
                              height={50}
                            />
                            <span>Team of Integrity</span>
                          </div>
                        </div>
                        <div className="personal-approach">
                          <div className="personal-approach-img">
                            <img
                              src={locallybased}
                              alt="logo"
                              width={50}
                              height={50}
                            />
                            <span> Locally Based</span>
                          </div>
                          <div className="personal-approach-img">
                            <img
                              src={listenempathize}
                              alt="logo"
                              width={50}
                              height={50}
                            />
                            <span> Listen & Empathize</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="btn-trst">
                    <div type="primary">
                      <h3> Family Owned & Operated</h3>
                      <p>Since 2013</p>
                    </div>
                  </div>

                  <div className="btn-trst-learn ">
                    <Button type="primary searchBtn">
                      Learn More <BulbOutlined />
                    </Button>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} className="img-col">
                <div className="professional-experienced-image">
                  <div className="dot">
                    <img src={dot} alt="Preserve ﬁnancial resources" />
                  </div>
                  <img src={imggg} alt="Preserve ﬁnancial resources" />
                  <div className="professional-experienced-image-video">
                    <YouTube
                      videoId="yAoLSRbwxL8"
                      opts={youtubeOptions}
                      onPlay={(e) => {
                        setOpenModal(true);
                        e.target.stopVideo();
                      }}
                    />
                    <Modal
                      className="popup-video"
                      title="Video"
                      visible={openModal}
                      onCancel={videoModalCloseHandle}
                      footer={null}
                    >
                      <YouTube
                        videoId="yAoLSRbwxL8"
                        opts={youtubeModalOptions}
                      />
                    </Modal>
                    {/* <iframe
                    width="100%"
                    height="250"
                    src="https://www.youtube.com/embed/yAoLSRbwxL8"
                    title="YouTube video player"
                    frameborder="0"
                    onClick={console.log("Event click")}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe> */}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>
        <section className="seniour-advisor">
          <div className="container">
            <h4>HOW WE HELP YOU</h4>
            <h2> Your Personal Senior Living Advisors</h2>
            <Row gutter={32} className="seniour-advisor-row">
              <Col xs={24} sm={24} md={24} lg={12} xl={12} className="img-col">
                <img src={desktop} alt="Preserve ﬁnancial resources" />
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <div className="seniour-advisor-content">
                  <h2>Client Portal</h2>
                  <p>
                    Your personal Second Home portal puts you in control of your
                    senior living search.
                  </p>

                  <p className="font-weight">
                    What can our clients privately access?.
                  </p>

                  <Row gutter={32}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <div className="seniour-advisor-icon">
                        <div className="advisor-icon-content">
                          <div className="advisor-icon-img">
                            <div className="ai-img">
                              <img src={coin} alt="logo" width={80} />
                            </div>
                            <span>Room rates, photos, & availability</span>
                          </div>
                        </div>
                        <div className="advisor-icon-content">
                          <div className="advisor-icon-img">
                            <div className="ai-img">
                              <img src={comment} alt="logo" width={80} />
                            </div>
                            <span>Direct message with owners</span>
                          </div>
                        </div>
                        <div className="advisor-icon-content">
                          <div className="advisor-icon-img">
                            <div className="ai-img">
                              <img src={check} alt="logo" width={80} />
                            </div>
                            <span> Schedule same-day facility tours</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <div className="persnl-approch-section">
                        <div className="advisor-icon-content">
                          <div className="advisor-icon-img">
                            <div className="ai-img">
                              <img src={heart} alt="logo" width={80} />
                            </div>
                            <span>Save your favorite communities</span>
                          </div>
                        </div>
                        <div className="advisor-icon-content">
                          <div className="advisor-icon-img">
                            <div className="ai-img">
                              <img src={clock} alt="logo" width={80} />
                            </div>
                            <span>Create custom search alerts</span>
                          </div>
                        </div>
                        <div className="advisor-icon-content">
                          <div className="advisor-icon-img">
                            <div className="ai-img">
                              <img src={clockh} alt="logo" width={80} />
                            </div>
                            <span> View CA state licensing reports</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="btn-trst-learn ">
                    <Button type="primary searchBtn">
                      Sign-up today <PlusOutlined />
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>
        <section className="client-concierge ">
          <div className="container">
            <Row gutter={32} className="client-concierge-row">
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <div className="client-concierge-content">
                  <h2>Client Concierge</h2>
                  <p>
                    Our Client Concierge program guides you from the first step
                    of your senior living journey–to the day you find a new
                    place to call home.
                  </p>

                  <Row gutter={32}>
                    <Col xs={24} md={24}>
                      <div className="client-concierge-section">
                        <div className="client-conciergeapproach">
                          <div className="client-concierge-img">
                            <span>
                              <QuestionCircleOutlined /> Do you need to find
                              senior living now?
                            </span>
                          </div>
                          <div className="icon-list">
                            <ul>
                              <li>
                                <img
                                  src={circlecheck}
                                  alt="Preserve ﬁnancial resources"
                                />
                                Schedule same-day tours
                              </li>
                              <li>
                                <img
                                  src={circlecheck}
                                  alt="Preserve ﬁnancial resources"
                                />
                                Facilitate move-in within 24 hours!
                              </li>
                              <li>
                                <img
                                  src={circlecheck}
                                  alt="Preserve ﬁnancial resources"
                                />
                                Negotiate rates
                              </li>
                            </ul>
                          </div>
                          <div className="client-concierge-img">
                            <span>
                              <QuestionCircleOutlined />
                              Are you confused about where to begin?
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="icon-list">
                    <ul>
                      <li>
                        <img
                          src={circlecheck}
                          alt="Preserve ﬁnancial resources"
                        />
                        It’s ok! We take the work off your plate!
                      </li>
                      <li>
                        <img
                          src={circlecheck}
                          alt="Preserve ﬁnancial resources"
                        />
                        Free phone consultations
                      </li>

                      <li>
                        <img
                          src={circlecheck}
                          alt="Preserve ﬁnancial resources"
                        />
                        Senior living education
                      </li>
                    </ul>
                  </div>
                  <div className="btn-trst-learn ">
                    <Button type="primary searchBtn">
                      get help today
                      <HeartOutlined />
                    </Button>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} className="img-col">
                <div className="client-concierge-image">
                  <img src={clientcon} alt="Preserve ﬁnancial resources" />
                </div>
              </Col>
            </Row>
          </div>
        </section>
        {/* /WHY FAMILY END */}
        {/* TESTIMONIAL START */}
        <section className="testimonial-section">
          <div className="container">
            <h2>Words From Our Clients</h2>
            <Carousel
              slidesPerRow={numOfTestimonials}
              autoplay={true}
              arrows={true}
              prevArrow={<LeftOutlined />}
              nextArrow={<RightOutlined />}
              className="testimonial-slider"
            >
              <div className="slider-item">
                <Card
                  cover={
                    <img
                      src={SearchLocationImg}
                      alt="Preserve ﬁnancial resources"
                    />
                  }
                >
                  <h4>Angela Ristovska</h4>
                  <div className="ratings">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <p>
                    Save the time and stress of calling and scheduling handle
                    all the grunt work. Save the time and stress of calling and
                    scheduling handle all the grunt work. Save the time and
                    stress of calling and scheduling handle all the grunt work.
                  </p>
                </Card>
              </div>
              <div className="slider-item">
                <Card
                  cover={
                    <img
                      src={SearchLocationImg}
                      alt="Preserve ﬁnancial resources"
                    />
                  }
                >
                  <h4>John Doe</h4>
                  <div className="ratings">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <p>
                    Save the time and stress of calling and scheduling handle
                    all the grunt work. Save the time and stress of calling and
                    scheduling handle all the grunt work.
                  </p>
                </Card>
              </div>
              <div className="slider-item">
                <Card
                  cover={
                    <img
                      src={SearchLocationImg}
                      alt="Preserve ﬁnancial resources"
                    />
                  }
                >
                  <h4>Tom Pain</h4>
                  <div className="ratings">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <p>
                    Save the time and stress of calling and scheduling handle
                    all the grunt work. Save the time and stress of calling and
                    scheduling handle all the grunt work.
                  </p>
                </Card>
              </div>
              <div className="slider-item">
                <Card
                  cover={
                    <img
                      src={SearchLocationImg}
                      alt="Preserve ﬁnancial resources"
                    />
                  }
                >
                  <h4>Marie Jain</h4>
                  <div className="ratings">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <p>
                    Save the time and stress of calling and scheduling handle
                    all the grunt work. Save the time and stress of calling and
                    scheduling handle all the grunt work.
                  </p>
                </Card>
              </div>
              <div className="slider-item">
                <Card
                  cover={
                    <img
                      src={SearchLocationImg}
                      alt="Preserve ﬁnancial resources"
                    />
                  }
                >
                  <h4>Halena John</h4>
                  <div className="ratings">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <p>
                    Save the time and stress of calling and scheduling handle
                    all the grunt work.
                  </p>
                </Card>
              </div>
              <div className="slider-item">
                <Card
                  cover={
                    <img
                      src={SearchLocationImg}
                      alt="Preserve ﬁnancial resources"
                    />
                  }
                >
                  <h4>Michel Doe</h4>
                  <div className="ratings">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarOutlined />
                  </div>
                  <p>
                    Save the time and stress of calling and scheduling handle
                    all the grunt work.
                  </p>
                </Card>
              </div>
            </Carousel>
          </div>
        </section>
        {/* /TESTIMONIAL END */}
        {/* LOCATION SEARCH START */}
        <section className="location-search-section">
          <div className="container">
            <h2>Search By Location</h2>
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="Los Angeles County" key="los_angeles_county">
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                      className="location-banner"
                      cover={<img src={SouthBayImg} alt="South Bay " />}
                    >
                      <Meta title="South Bay " />
                      <a href="#"> Learn More</a>
                    </Card>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <Card
                      cover={
                        <img
                          src={WestLosAngelesImg}
                          alt="Preserve ﬁnancial resources"
                        />
                      }
                      actions={[<a href="#"> Learn More</a>]}
                    >
                      <Meta title=" West Los Angeles" />
                    </Card>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <Card
                      cover={
                        <img
                          src={SanFernandoValleyImg}
                          alt="San Fernando Valley"
                        />
                      }
                      actions={[<a href="#"> Learn More</a>]}
                    >
                      <Meta title="San Fernando Valley" />
                    </Card>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <Card
                      cover={
                        <img
                          src={LongBeachImg}
                          alt="Long Beach & Gateway Cities
"
                        />
                      }
                      actions={[<a href="#"> Learn More</a>]}
                    >
                      <Meta
                        title="Long Beach & Gateway Cities
"
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Orange County" key="orange_county">
                Orange County
              </TabPane>
              <TabPane tab="San Diego County" key="san_diego_county">
                San Diego County
              </TabPane>
            </Tabs>
          </div>
        </section>
        {/* /LOCATION SEARCH END */}
        {/* SEARCH NEAR START */}
        <section
          className="search-near-section"
          style={{ backgroundImage: "url(" + newsback + ")" }}
        >
          <div className="container">
            <div className="Newsletter">
              <Row gutter={16} align="middle">
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                  <h3>
                    Subscribe for alerts about{" "}
                    <span className="border-under">new availability</span> in
                    your area
                  </h3>
                </Col>

                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                  <Form name="horizontal_login">
                    <Row gutter={16}>
                      <Col xs={24} sm={24} md={24} lg={9} xl={9}>
                        <Form.Item>
                          <Input placeholder="Enter an address, city" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={9} xl={9}>
                        <Form.Item>
                          <Input placeholder="Enter an ZIP code" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="searchBtn"
                          >
                            Subscribe <SearchOutlined />
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>
          </div>
        </section>
        {/* /SEARCH NEAR END */}
        {/* COMMUNITY START */}
        <section className="community-section">
          <div className="container">
            <h2>Type of Community</h2>
            <p className="sub-title">Learn More About Community Types</p>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Card
                  cover={
                    <img src={AlsCommunity} alt="Assisted Living Seniors" />
                  }
                  actions={[<a href="#"> Learn More</a>]}
                >
                  <Meta title="Assisted Living" />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Card
                  cover={<img src={McsCommunity} alt="Memory Care Seniors" />}
                  actions={[<a href="#"> Learn More</a>]}
                >
                  <Meta title="Board and Care Homes" />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Card
                  cover={<img src={McsCommunity} alt="Memory Care Seniors" />}
                  actions={[<a href="#"> Learn More</a>]}
                >
                  <Meta title="Memory Care Living" />
                </Card>
              </Col>
            </Row>
          </div>
        </section>
        {/* /COMMUNITY END */}
        <section className="home-blog">
          <div className="container">
            <h2>Recent Blog Posts</h2>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                <Card
                  hoverable
                  cover={<img src={HelpImg1} alt="Immediate Assistance" />}
                >
                  <div className="blog-content-home">
                    <p className="blog-star">
                      <StarFilled />
                      No Reviews
                    </p>
                    <h4>We Will Create Your Dreams Busniess Logo...</h4>
                    <p>
                      Starting From <span>$100.00</span>
                    </p>
                    <div className="blog-bottom">
                      <p>
                        <span>0</span> Order in queue
                      </p>
                      <img src={HelpImg1} alt="Immediate Assistance" />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                <Card
                  hoverable
                  cover={<img src={HelpImg2} alt="Need Help Soon?" />}
                >
                  <div className="blog-content-home">
                    <p className="blog-star">
                      <StarFilled />
                      No Reviews
                    </p>
                    <h4>We Will Create Your Dreams Busniess Logo...</h4>
                    <p>
                      Starting From <span>$100.00</span>
                    </p>
                    <div className="blog-bottom">
                      <p>
                        <span>0</span> Order in queue
                      </p>
                      <img src={HelpImg1} alt="Immediate Assistance" />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                <Card
                  hoverable
                  cover={<img src={HelpImg3} alt="Need Help Soon?" />}
                >
                  <div className="blog-content-home">
                    <p className="blog-star">
                      <StarFilled />
                      No Reviews
                    </p>
                    <h4>We Will Create Your Dreams Busniess Logo...</h4>
                    <p>
                      Starting From <span>$100.00</span>
                    </p>
                    <div className="blog-bottom">
                      <p>
                        <span>0</span> Order in queue
                      </p>
                      <img src={HelpImg1} alt="Immediate Assistance" />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                <Card
                  hoverable
                  cover={<img src={HelpImg3} alt="Need Help Soon?" />}
                >
                  <div className="blog-content-home">
                    <p className="blog-star">
                      <StarFilled />
                      No Reviews
                    </p>
                    <h4>We Will Create Your Dreams Busniess Logo...</h4>
                    <p>
                      Starting From <span>$100.00</span>
                    </p>
                    <div className="blog-bottom">
                      <p>
                        <span>0</span> Order in queue
                      </p>
                      <img src={HelpImg1} alt="Immediate Assistance" />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
        {/* /HELP SECTION END */}
      </div>
      {!userRole ? (
        <LogInPopUp
          logInModalVisible={logInModalVisible}
          OnSubmit={loginModalSubmitHandle}
          willLater={true}
          logInDirect={false}
        />
      ) : (
        ""
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    userRole: state.user.userRole,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signin: (email, password) => dispatch(signin(email, password)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
