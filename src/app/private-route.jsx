
import { Layout } from "antd";
import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, header: Header, sider: Sider, logInHandle: logInHandle, ...rest }) => (
  <>
    <Layout>
      {Header !== undefined ?
        <Header />
        : ''}
      <Layout className="site-layout">
        {Sider ? <Sider /> : ""}
        <Layout.Content className="site-layout-background">
          <div className="container-wrapper">
            <Route
              {...rest}
              render={(props) =>

                localStorage.getItem("access_token") ? (
                  <Component {...props} />
                ) : (
                  <Redirect to={{ pathname: "/" }} />
                  // logInHandle()
                )
              }
            />
          </div>

        </Layout.Content>
      </Layout>



    </Layout>

  </>
);
