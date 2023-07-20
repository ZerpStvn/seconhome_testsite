import React, { useState, useEffect } from "react";
import { compose } from "redux";
import { Row, Col, Input, Badge, Menu, Dropdown } from "antd";
import {
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { signOut } from "../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { ReactComponent as Logo } from "../../assets/images/second-homes-logo.svg";
import { Link } from "react-router-dom";

const { Search } = Input;
const Header = ({ loggedInUser, isSideBarCollapse, toggleSidebar }) => {
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState();

  const [ShowMenu, setShowMenu] = useState(false);

  useEffect(() => {
    getSelectedKey();
  }, []);

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
  const getSelectedKey = () => {
    var selectedKey = null;
    const curruntUrl = window.location.href;
    if (
      curruntUrl.includes("admin/clients") ||
      curruntUrl.includes("admin/client")
    ) {
      setSelectedKey("clients");
    }
    if (
      curruntUrl.includes("admin/partners") ||
      curruntUrl.includes("admin/partner")
    ) {
      setSelectedKey("partners");
    }
    return selectedKey;
  };

  return (
    <div
      id={"header"}
      className={isSideBarCollapse ? "fixed" : "collapsed-fixed"}
    >
      <Row gutter={24} className="header-row">
        <Col xs={16} sm={12} md={7} lg={4} xl={4}>
          <div className="header-left ">
            <Link to={"/"}>
              <div className="logo" style={{ color: "white" }}>
                <Logo />
              </div>
            </Link>
            <span className="sidemenu-trigger"></span>
          </div>
        </Col>

        {/* {loggedInUser ? (
        <Col md={12} lg={10} xl={10} className="search-sec">
           <Search placeholder="input search text" enterButton />
        </Col>
        ) : (
          ""
        )} */}

        <Col xs={8} sm={12} md={17} lg={20} xl={20} className="header-right">
          {loggedInUser ? (
            <>


              <div className="admin-header-menu mobileShow">
                <Menu mode="horizontal" selectedKeys={selectedKey}>
                  <Menu.Item key="home">
                    <Link to={"/"}>Home</Link>
                  </Menu.Item>
                  {/* <Menu.Item key="tasks">Tasks</Menu.Item>
                <Menu.Item key="leads">Leads</Menu.Item> */}
                  <Menu.Item key="clients">
                    <Link to={"/admin/clients"}>Clients</Link>
                  </Menu.Item>
                  <Menu.Item key="partners">
                    <Link to={"/admin/partners"}>Partners</Link>
                  </Menu.Item>
                  {/* <Menu.Item key="stats">Stats</Menu.Item>
                <Menu.Item key="admins">Admins</Menu.Item> */}
                  <Menu.Item key="email_templates">
                    <Link to={"/admin/email_template"}>Templates</Link>
                  </Menu.Item>
                </Menu>

                {/* <Search placeholder="Search here....." required={false} /> */}

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
