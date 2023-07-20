import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { Avatar } from "antd";
import { compose } from "redux";
import { connect } from "react-redux";
import clientOptions from "./client-options";
import adminOptions from "./admin-options";
import UserService from "../../../services/user-service";
import homeOwneroptions from "./dashboard-options";
import Config, { MainUrl } from "../../../config"

import { ReactComponent as Logo } from "../../../assets/images/second-homes-logo.svg";
import {
  PhoneOutlined, MailOutlined,
  FormOutlined, BellOutlined
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { loadCurrentLoggedInUser } from "./../../../redux/actions/user-actions";
const { SubMenu } = Menu;

const Sidebar = ({ }) => {
  const dispatch = useDispatch();
  const [currentURI, setCurrentURI] = useState(window.location.pathname);
  const [menuActiveKey, setMenuActiveKey] = useState("");
  const [menuActiveKeySetUp, setMenuActiveKeySetUp] = useState(false);
  const loggedInUser = UserService.getLoggedInUser();
  const userRole = loggedInUser ? Config.userRoleTypes[loggedInUser.role].name : '';
  var sideBarOptions = [];
  var currentLoggedInUser = loggedInUser;
  switch (userRole) {
    case "admin":
      const admin_user = UserService.getAdminUser();
      const adminUserRole = admin_user ? Config.userRoleTypes[admin_user.role].name : '';
      currentLoggedInUser = admin_user ? (admin_user.client.length ? admin_user.client[0] : admin_user) : loggedInUser;
      sideBarOptions = false;
      if (adminUserRole == 'client') {
        sideBarOptions = adminOptions.adminClientOptions;
      }
      if (adminUserRole == 'home-owner') {
        sideBarOptions = adminOptions.adminPartnerOptions;
      }

      break;
    case "home-owner":
      sideBarOptions = homeOwneroptions.dashBoardOptions;
      break;
    case "client":
      sideBarOptions = clientOptions.clientOptions;
      break;

    default:
      break;
  }
  useEffect(() => {

    return () => {
      console.log("SideBar Unmounting");
    };
  }, []);

  if (currentLoggedInUser) {
    currentLoggedInUser.avatar = `${currentLoggedInUser.first_name.charAt(0).toUpperCase()}${currentLoggedInUser.last_name && currentLoggedInUser.last_name.charAt(0).toUpperCase()}`
  }

  const handleClick = (values) => {
    setCurrentURI(values.key);
  };

  function getMenuItem(singleOption) {
    const { key, label, leftIcon, children, activeMenuKey } = singleOption;
    if (children) {
      return (
        <SubMenu
          key={activeMenuKey}
          title={
            <span className="isoMenuHolder">
              {leftIcon}
              <span className="nav-text">{label}</span>
            </span>
          }
        >
          {children.map((child) => {
            if (child.key === window.location.pathname && !menuActiveKeySetUp) {
              setMenuActiveKey(activeMenuKey)
              setMenuActiveKeySetUp(true)
            }
            return (
              <Menu.Item key={child.key}>
                <Link to={child.key}>
                  {child.leftIcon}
                  {child.label}
                  {child.alertsCount}
                </Link>
              </Menu.Item>
            );
          })}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={key} >
          <Link to={`${key}`}>
            <span className="isoMenuHolder">
              {leftIcon}
              <span className="nav-text">{label}</span>
            </span>
          </Link>
        </Menu.Item>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="sidebar-menu">
        {/* <div className="logo" style={{ color: "white" }}>
          <Logo />
        </div> */}
        <div className="nav-menu-items">
          {currentLoggedInUser ? (
            <div className="doctor-avtar">
              <Avatar>
                {currentLoggedInUser && currentLoggedInUser.avatar
                  ? currentLoggedInUser.avatar
                  : ""}
              </Avatar>
              <div className="doctor-detail">
                <div className="name-icon">
                  {`${currentLoggedInUser.first_name} ${currentLoggedInUser.last_name}`}
                </div>
                <div className="email">{currentLoggedInUser.email}</div>
              </div>
              <div className="profile-actions">
                <ul>
                  <li><PhoneOutlined /></li>
                  <li><MailOutlined /></li>
                  <li><FormOutlined /></li>
                  {/* <li><Link to={{pathname:'/profile',state:{from:'notifications'}}}><BellOutlined /></Link></li> */}
                  <li><BellOutlined /></li>
                </ul>
              </div>
            </div>
          ) : (
            ""
          )}
          <Menu
            theme="light"
            mode="inline"
            onClick={handleClick}
            // defaultSelectedKeys="/"
            defaultOpenKeys={menuActiveKey}
          // selectedKeys={currentURI}
          >
            {sideBarOptions &&
              Object.keys(sideBarOptions).length > 0 &&
              sideBarOptions.map((singleOption) => getMenuItem(singleOption))}
          </Menu>
        </div>
      </div>
    </React.Fragment>
  );
};
function mapStateToProps(state) {

}

function mapDispatchToProps(dispatch) {

}
export default compose(connect(mapStateToProps, mapDispatchToProps))(Sidebar);
