import React from "react";
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from "antd";
import Footer from "./components/layout/footer";

const PublicRoute = ({ component: Component, header: Header, sider: Sider, ...rest }) => {
  return <>
    <Layout>

      {Header ? <Header /> : ""}
      <Layout className="site-layout">
        {Sider ? <Sider /> : ""}
        <Layout.Content className="site-layout-background">

          <Route
            {...rest}
            render={
              props => {
                return <Component {...props} />
              }
            }
          />

        </Layout.Content>
      </Layout>

<Footer/>

    </Layout>

  </>


};

const mapStateToProps = state => (
  {
  }
);

export default withRouter(connect(
  mapStateToProps, null, null, { pure: false }
)(PublicRoute));

