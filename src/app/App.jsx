import React, { useEffect, useState } from "react";
import { Switch, useHistory } from "react-router-dom";
import routeOptions from "../app/routes/route";
import "./App.less";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrivateRoute } from "./private-route.jsx";
import PublicRoute from "./public-route.jsx";
import { Layout, Modal, Typography, Form, Button, Input, Checkbox, Row, Col, Spin } from "antd";
import { signin } from "./redux/actions/auth-actions";
import SideBar from "./components/layout/sidebar/sidebar";
import DashboardHeader from "./components/layout/header";
import DashboardHeaderPublic from "./components/layout/header-public";
import DashboardHeaderAdmin from "./components/layout/header-admin";
import homeOwneroptions from "./components/layout/sidebar/dashboard-options";
import clientOptions from "./components/layout/sidebar/client-options";
import adminOptions from "./components/layout/sidebar/admin-options";
import UserService from "./services/user-service";
import { connect, useDispatch } from "react-redux";
import { compose } from "redux";
import RedirectWithStatus from "./redirect-w-status.jsx";
import Config from "./config";
import LogInPopUp from "./pages/login/login-popup";
import { loadCurrentLoggedInUser } from "./redux/actions/user-actions";

const { Title, Paragraph, Text } = Typography;

const { Header, Sider, Content } = Layout;
const App = ({ isLoggedIn }) => {
  const dispatch = useDispatch();

  const uri = window.location.pathname;
  const [collapsed, setCollapsed] = useState(true);
  const loggedInUser = UserService.getLoggedInUser();
  const userRole = loggedInUser ? Config.userRoleTypes[loggedInUser.role].name : '';
  var sideBarOptions = [];
  switch (userRole) {
    case "admin":
      const admin_user = UserService.getAdminUser();
      const adminUserRole = admin_user ? Config.userRoleTypes[admin_user.role].name : '';
      if (adminUserRole == 'client') {
        sideBarOptions = adminOptions.adminClientOptions;
      }
      if (adminUserRole == 'home-owner') {
        sideBarOptions = adminOptions.adminPartnerOptions;
      }
      sideBarOptions = false;
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
    if (loggedInUser) {
      dispatch(loadCurrentLoggedInUser());
    }

  }, []);

  /* Disable right click and f12 */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  document.onkeypress = function (event) {
    event = (event || window.event);
    if (event.keyCode == 123) {
      return false;
    }
  }
  document.onmousedown = function (event) {
    event = (event || window.event);
    if (event.keyCode == 123) {
      return false;
    }
  }
  document.onkeydown = function (event) {
    event = (event || window.event);
    if (event.keyCode == 123) {
      return false;
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 'I'.charCodeAt(0)) {
      return false;
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 'C'.charCodeAt(0)) {
      return false;
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 'J'.charCodeAt(0)) {
      return false;
    }
    if (event.ctrlKey && event.keyCode == 'U'.charCodeAt(0)) {
      return false;
    }
  }

  document.ondragstart = function (event) {
    return false;
  }
  /* Disable right click and f12 */


  const [isSideBarCollapse, setIsSideBarCollapse] = useState(false);
  function toggleSidebar() {
    setCollapsed(!collapsed);
  }

  const SiderDashboard = () => <Sider
    breakpoint="xl"
    collapsible
    collapsedWidth="0"
    width="260px"
    className="sidebar"
  // onBreakpoint={(broken) => {
  // }}
  // onCollapse={(collapsed, type) => {
  //   setIsSideBarCollapse(collapsed);
  // }}
  >
    <SideBar />
  </Sider>

  const HeaderDashboard = () => <Header
    id="main_header"
    className="site-layout-background"
    style={{
      background: "#f2f5f9",
      zIndex: 100,
      top: 0,
      width: "100%",
      padding: 0,
    }}
  >
    <DashboardHeader
      loggedInUser={loggedInUser}
      isCollapsed={collapsed}
      toggleSidebar={toggleSidebar}
      isSideBarCollapse={isSideBarCollapse}
    />
  </Header>
  const HeaderDashboardAdmin = () => <Header
    id="main_header"
    className="site-layout-background"
    style={{
      background: "#f2f5f9",
      zIndex: 100,
      top: 0,
      width: "100%",
      padding: 0,
    }}
  >
    <DashboardHeaderAdmin
      loggedInUser={loggedInUser}
      isCollapsed={collapsed}
      toggleSidebar={toggleSidebar}
      isSideBarCollapse={isSideBarCollapse}
      userRole={userRole}
    />
  </Header>
  const HeaderDashboardPublic = () => <Header
    id="main_header"
    className="site-layout-background"
    style={{
      background: "#f2f5f9",
      zIndex: 100,
      top: 0,
      width: "100%",
      padding: 0,
    }}
  >
    <DashboardHeaderPublic
      loggedInUser={loggedInUser}
      isCollapsed={collapsed}
      toggleSidebar={toggleSidebar}
      isSideBarCollapse={isSideBarCollapse}
    />
  </Header>




  let routes = routeOptions.routes.map(({ path, component, exact, showHeader, showSider }, i) => (
    <PublicRoute key={Math.random() + "ROUTE_"} exact={exact} path={path} component={component} header={showHeader ? HeaderDashboardPublic : false} sider={showSider ? SiderDashboard : false} />
  ));




  let privateRoutes = routeOptions.privateRoutes.map(({ path, component, exact, roles, showSider }, i) => {

    if (roles && roles.length > 0) {
      if (userRole == 'admin') {
        return (
          <PrivateRoute
            key={Math.random() + "ROUTE_"}
            exact={exact}
            path={path}
            component={component}
            roles={roles}
            header={HeaderDashboardAdmin}
            sider={showSider ? SiderDashboard : false}
          />
        )

      } if (roles.includes(userRole)) {
        return (
          <PrivateRoute
            key={Math.random() + "ROUTE_"}
            exact={exact}
            path={path}
            component={component}
            roles={roles}
            header={HeaderDashboard}
            sider={SiderDashboard}
          />
        )
      }
    } else {
      return (
        <PrivateRoute
          key={Math.random() + "ROUTE_"}
          exact={exact}
          path={path}
          component={component}
          roles={roles}
          sider={false}

        />
      )
    }


  });
  let redirects = routeOptions.redirects.map(({ from, to, status }, i) => (
    <RedirectWithStatus
      key={Math.random() + "REDIRECT_"}
      from={from}
      to={to}
      status={status}
    />
  ));





  return (
    <div className="app-container App">
      <Switch>
        {routes}
        {privateRoutes}
        {redirects}
      </Switch>

    </div>
  );
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.isLoggedIn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signin: (email, password) => dispatch(signin(email, password)),
    loadCurrentLoggedInUser: () => dispatch(loadCurrentLoggedInUser())
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(App);
