import React, { useState } from "react";
import { compose } from "redux";
import { Row, Col, Input, Badge, Menu, Dropdown } from "antd";
import {
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined,
  LoginOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { signOut } from "./../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { ReactComponent as Logo } from "../../assets/images/second-homes-logo.svg";
import { Link, useHistory } from "react-router-dom";
import Config from "../../config"
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const { Search } = Input;
const Header = ({ loggedInUser, isSideBarCollapse }) => {
  const dispatch = useDispatch();
  const [ShowMenu, setShowMenu] = useState(false);

  const history = useHistory();

  const menu = (
    <Menu className="notification-menu">
      <h3>Account Settings</h3>
      {/* <Menu.Item onClick={(e) => handleViewProfile(e)} key="1">
        <ProfileOutlined />
        View Profile
      </Menu.Item> */}
      <Menu.Item onClick={(e) => handleSignOut(e)} key="2">
        <LogoutOutlined />
        Sign Out
      </Menu.Item>
    </Menu>
  );

  const loginMenu = (
    <Menu className="notification-menu">
      <h3>Login</h3>

      <Menu.Item key="2">
        <Link to={`/login`}>
          <LoginOutlined /> Log In
        </Link>
      </Menu.Item>
    </Menu>
  );

  const handleViewProfile = (event) => { };

  const handleSignOut = (event) => {
    dispatch(signOut());
  };


  const onSelectAddress = async (address) => {
    sessionStorage.setItem("searchFormData", JSON.stringify({
      address: address.label
    }));
    history.push("/search");

  };

  return (
    <div
      id={"header"}
      className={isSideBarCollapse ? "fixed" : "collapsed-fixed"}
    >
      <Row gutter={24} className="header-row">
        <Col xs={16} sm={12} md={7} lg={4} xl={4}>
          {/* <div className="logo" style={{ color: "white" }}>
            <Logo />
          </div> */}
          <Link to={"/"}>
            <div className="logo" style={{ color: "white" }}>
              <Logo />
            </div>
          </Link>
          <span className="sidemenu-trigger"></span>
        </Col>

        <Col xs={8} sm={12} md={17} lg={20} xl={20} className="header-right">
          {loggedInUser ? (
            <>

              <div className="admin-header-menu mobileShow">
                {/* <Menu mode="horizontal">
                <Menu.Item key="home">HOME</Menu.Item>
                <Menu.Item key="tasks">TASKS</Menu.Item>
                <Menu.Item key="leads">LEADS</Menu.Item>
                <Menu.Item key="clients">CLIENTS</Menu.Item>
                <Menu.Item key="partners">PARTNERS</Menu.Item>
                <Menu.Item key="stats">STATS</Menu.Item>
                <Menu.Item key="admins">ADMINS</Menu.Item>
              </Menu> */}
                {loggedInUser.role == Config.userId.client ?
                  <>
                    {/* <Search placeholder="Search here....." enterButton /> */}
                    <GooglePlacesAutocomplete
                      selectProps={{
                        placeholder: "Enter Zip",
                        onChange: onSelectAddress,
                        onKeyDown: (e) => {
                          // if (!/\d/.test(e.key)) {
                          //   e.preventDefault();
                          // }
                          const isNumberKey = /\d/.test(e.key);
                          const isBackspaceKey = e.key === 'Backspace';

                          if (!isNumberKey && !isBackspaceKey) {
                            e.preventDefault();
                          }
                        },
                      }}
                      apiKey={Config.googleMapsAPIkey}
                      autocompletionRequest={{
                        componentRestrictions: { country: ["us"] },
                      }}
                    />
                    {/* <Search
                      placeholder="Search zip, address, community name"
                      allowClear
                      // form={form}
                      size="large"
                      className="main_search"
                      onSearch={(value) => {
                        sessionStorage.setItem("searchFormData", JSON.stringify({
                          search_text: value
                        }));
                        history.push("/search");
                      }}
                    /> */}
                  </> : ""
                }


                <Dropdown overlay={menu} className="account-setting">
                  <Badge>
                    <a onClick={(e) => e.preventDefault()}>
                      <SettingOutlined />
                    </a>
                  </Badge>
                </Dropdown>
              </div>
            </>

          ) : (
            <Menu className="home-main-menu">
              <Menu.Item key="resources">Resources</Menu.Item>
              <Menu.Item key="living-options">Living Options</Menu.Item>
              <Menu.Item key="sign-up">Sign In/Sign Up</Menu.Item>
            </Menu>
          )}
        </Col>
      </Row>
    </div>
  );
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    signOut: () => dispatch(signOut()),
  };
}
export default compose(connect(mapStateToProps, mapDispatchToProps))(Header);
