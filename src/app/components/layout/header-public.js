import React, { useState } from "react";
import { compose } from "redux";
import { useHistory } from "react-router-dom";
import { Row, Col, Input, Menu, Form } from "antd";
import { CaretDownOutlined, MenuOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { signOut } from "../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { ReactComponent as Logo } from "../../assets/images/second-homes-logo.svg";
import { Link } from "react-router-dom";
import Config from "./../../config";
import LogInPopUp from "../../pages/login/login-popup";

const { SubMenu } = Menu;
const { Search } = Input;

const Header = ({ loggedInUser, isSideBarCollapse, userRole }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const [showSearch, setShowSearch] = useState(false);
  const [ShowMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [logInDirect, setLogInDirect] = useState(true);
  const [logInModalVisible, setLogInModalVisible] = useState(false);
  const [doLaterEnable, setDoLaterEnable] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);

  const userDashboardUrl = loggedInUser
    ? Config.userRoleTypes[loggedInUser.role].url.replace("dashboard/", "")
    : "/";
  /**** Sticky header *****/
  window.addEventListener("scroll", () => {
    let WindowScroll = window.scrollY;
    let Form = document.getElementById("home_banner_form");

    if (Form !== null) {
      let FormScroll = Form.offsetTop + Form.offsetHeight;
      if (WindowScroll > FormScroll) {
        document.getElementById("main_header").classList.add("sticky_header");
        setShowSearch(true);
      } else {
        document
          .getElementById("main_header")
          .classList.remove("sticky_header");
        setShowSearch(false);
      }
    }
  });
  /**** Sticky header *****/

  // const onHomeSearch = (Values) => {
  //   // let data = { search: Values }
  //   history.push("/search", Values);
  // }

  const formModalVisibleHandle = () => {
    if (!userRole) {
      setLogInModalVisible(!logInModalVisible);
      setDoLaterEnable(true);
    } else {
      history.push("/search", searchValue);
    }
  };
  const modalVisibleHandle = () => {
    setLogInModalVisible(!logInModalVisible);
    setDoLaterEnable(false);
  };

  const loginModalCancel = () => {
    setLogInModalVisible(false);
    setCreateAccount(!createAccount);
  }

  const loginModalSubmitHandle = () => {
    history.push("/search", searchValue);
  };

  return (
    <div id={"header"} className="fixed site-main-header">
      <div className="container">
        <Row gutter={24} className="header-row">
          <Col>
            <Link to={"/"}>
              <div className="logo logo_left" style={{ color: "white" }}>
                <Logo />
              </div>
            </Link>
          </Col>

          <Col className="header-center">
            {showSearch ? (
              <Search
                placeholder="Search zip, address, community name"
                allowClear
                form={form}
                size="large"
                className="main_search"
                onSearch={(value) => {
                  setSearchValue(value);
                  setLogInDirect(false);
                  formModalVisibleHandle();
                }}
              />
            ) : (
              <>
                <MenuOutlined className="mobile-menu-toggle" onClick={() => setShowMenu(prevCheck => !prevCheck)} />
                {ShowMenu ? <>
                  <Menu className={"home-main-menu " + (ShowMenu ? "mobileShow" : "mobileHide")} mode={ShowMenu ? "inline" : "horizontal"}>
                    <Menu.Item key="home">
                      <Link to={"/"}>Home</Link>
                    </Menu.Item>
                    <SubMenu
                      key="living-options"
                      title="Living Options"
                      icon={<CaretDownOutlined />}
                    >
                      <Menu.Item key="assisted-living-facilities">
                        <a href={`${Config.MainUrl}/assisted-living-facilities`}>Assisted Living Facilities</a>
                      </Menu.Item>
                      <Menu.Item key="board-care-homes">
                        <a href={`${Config.MainUrl}/board-care-homes`}>Board & Care Homes</a>
                      </Menu.Item>
                      <Menu.Item key="memory-care-facilities">
                        <a href={`${Config.MainUrl}/memory-care-facilities`}>Memory Care Facilities</a>
                      </Menu.Item>
                      <Menu.Item key="independent-living">
                        <a href={`${Config.MainUrl}/independent-living`}>Independent Living{" "}</a>
                      </Menu.Item>
                      <Menu.Item key="retirement-community">
                        <a href={`${Config.MainUrl}/retirement-community`}>Retirement Community{" "}</a>
                      </Menu.Item>
                      <Menu.Item key="skilled-nursing-facility">
                        <a href={`${Config.MainUrl}/skilled-nursing-facility`}>Skilled Nursing Facility</a>
                      </Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="resources_submenu"
                      title="Resources"
                      icon={<CaretDownOutlined />}
                    >
                      <Menu.Item key="resources">
                        <a href={`${Config.MainUrl}/resources/`}>Resources</a>
                      </Menu.Item>
                      <Menu.Item key="blog">
                        <a href={`${Config.MainUrl}/blog/`}>Blog</a>
                      </Menu.Item>
                      <Menu.Item key="senior-living-fAQ ">
                        <a href={`${Config.MainUrl}/senior-living-faq/`}> Senior Living FAQ{" "}</a>
                      </Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="about"
                      title="About"
                      icon={<CaretDownOutlined />}
                    >
                      <Menu.Item key="how-we-help">
                        <a href={`${Config.MainUrl}/how-we-help/`}> How We Help</a>
                      </Menu.Item>
                      <Menu.Item key="about-us">
                        <a href={`${Config.MainUrl}/about-us/`}> About Us</a>
                      </Menu.Item>
                      <Menu.Item key="contact-us">
                        <a href={`${Config.MainUrl}/contact-us/`}> Contact Us</a>
                      </Menu.Item>
                      <Menu.Item key="work-with-us">
                        <a href={`${Config.MainUrl}/work-with-us/`}> Work With Us</a>
                      </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="tel">
                      <a href="tel:8772632272"> (877) 263-2272</a>
                    </Menu.Item>
                    {!loggedInUser ? (
                      <>
                      {/* <Menu.Item key="sign-in" className="outline-btn">
                        <Link
                          onClick={() => {
                            setLogInDirect(true);
                            setCreateAccount(false);
                            modalVisibleHandle();
                          }}
                        >
                          {" "}
                          Log-In
                        </Link>
                      </Menu.Item> */}
                      </>
                    ) : (
                      <Menu.Item key="sign-In">
                        <Link to={`/${userDashboardUrl}`}> Dashboard</Link>
                      </Menu.Item>
                    )}
                    {/* {!loggedInUser ? (
                      <Menu.Item key="sign-up" className="btn">
                        <Link
                          onClick={() => {
                            setLogInDirect(true);
                            setCreateAccount(true);
                            modalVisibleHandle();
                          }}
                        >
                          {" "}
                          Sign-Up
                        </Link>
                      </Menu.Item>
                    ) : ""} */}
                  </Menu>
                </> : <>
                  <Menu className={"home-main-menu " + (ShowMenu ? "mobileShow" : "mobileHide")} mode={ShowMenu ? "inline" : "horizontal"}>
                    <Menu.Item key="home">
                      <Link to={"/"}>Home</Link>
                    </Menu.Item>
                    <SubMenu
                      key="living-options"
                      title="Living Options"
                      icon={<CaretDownOutlined />}
                    >
                      <Menu.Item key="assisted-living-facilities">
                        <a href={`${Config.MainUrl}/assisted-living-facilities`}>Assisted Living Facilities</a>
                      </Menu.Item>
                      <Menu.Item key="board-care-homes">
                        <a href={`${Config.MainUrl}/board-care-homes`}>Board & Care Homes</a>
                      </Menu.Item>
                      <Menu.Item key="memory-care-facilities">
                        <a href={`${Config.MainUrl}/memory-care-facilities`}>Memory Care Facilities</a>
                      </Menu.Item>
                      <Menu.Item key="independent-living">
                        <a href={`${Config.MainUrl}/independent-living`}>Independent Living{" "}</a>
                      </Menu.Item>
                      <Menu.Item key="retirement-community">
                        <a href={`${Config.MainUrl}/retirement-community`}>Retirement Community{" "}</a>
                      </Menu.Item>
                      <Menu.Item key="skilled-nursing-facility">
                        <a href={`${Config.MainUrl}/skilled-nursing-facility`}>Skilled Nursing Facility</a>
                      </Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="resources_submenu"
                      title="Resources"
                      icon={<CaretDownOutlined />}
                    >
                      <Menu.Item key="resources">
                        <a href={`${Config.MainUrl}/resources/`}>Resources</a>
                      </Menu.Item>
                      <Menu.Item key="blog">
                        <a href={`${Config.MainUrl}/blog/`}>Blog</a>
                      </Menu.Item>
                      <Menu.Item key="senior-living-fAQ ">
                        <a href={`${Config.MainUrl}/senior-living-faq/`}> Senior Living FAQ{" "}</a>
                      </Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="about"
                      title="About"
                      icon={<CaretDownOutlined />}
                    >
                      <Menu.Item key="how-we-help">
                        <a href={`${Config.MainUrl}/how-we-help/`}> How We Help</a>
                      </Menu.Item>
                      <Menu.Item key="about-us">
                        <a href={`${Config.MainUrl}/about-us/`}> About Us</a>
                      </Menu.Item>
                      <Menu.Item key="contact-us">
                        <a href={`${Config.MainUrl}/contact-us/`}> Contact Us</a>
                      </Menu.Item>
                      <Menu.Item key="work-with-us">
                        <a href={`${Config.MainUrl}/work-with-us/`}> Work With Us</a>
                      </Menu.Item>
                    </SubMenu>
                  </Menu>
                </>}

              </>
            )}
          </Col>
          <Col className="header-right">
            <Menu className="home-info-menu">
              <Menu.Item key="tel">
                <a href="tel:8772632272"> (877) 263-2272</a>
              </Menu.Item>
              {!loggedInUser ? (
                <>
                {/* <Menu.Item key="sign-in" className="outline-btn">
                  <Link
                    onClick={() => {
                      setLogInDirect(true);
                      setCreateAccount(false);
                      modalVisibleHandle();
                    }}
                  >
                    {" "}
                    Log-In
                  </Link>
                </Menu.Item> */}
                </>
              ) : (
                <Menu.Item key="sign-In">
                  <Link to={`/${userDashboardUrl}`}> Dashboard</Link>
                </Menu.Item>
              )}
              {/* {!loggedInUser ? (
                <Menu.Item key="sign-up" className="btn">
                  
                  <Link
                    onClick={() => {
                      setLogInDirect(true);
                      setCreateAccount(true);
                      modalVisibleHandle();
                    }}
                  >
                    {" "}
                    Sign-Up
                  </Link>
                </Menu.Item>
              ) : (
                ""
              )} */}
            </Menu>
          </Col>
        </Row>
      </div>
      {/* <LogInPopUp logInModalVisible={logInModalVisible} OnSubmit={loginModalSubmitHandle} ModalVisibleHandle={modalVisibleHandle} willLater={doLaterEnable} /> */}
      <LogInPopUp
        logInModalVisible={logInModalVisible}
        OnSubmit={loginModalSubmitHandle}
        willLater={doLaterEnable}
        logInDirect={logInDirect}
        createAccount={createAccount}
        loginModalCancel={loginModalCancel}
      />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    userRole: state.user.userRole,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signOut: () => dispatch(signOut()),
  };
}
export default compose(connect(mapStateToProps, mapDispatchToProps))(Header);
