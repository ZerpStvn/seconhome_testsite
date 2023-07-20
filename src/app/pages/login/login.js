import {
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Typography,
  Spin,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { connect } from "react-redux";
import { signin } from "../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../services/notification-service";
import { ReactComponent as Logo } from "../../../app/assets/images/second-homes-logo.svg";
import { Redirect } from "react-router-dom";

const Login = ({ history }) => {
  if (localStorage.getItem("access_token")) {
    return <Redirect to={{ pathname: "/" }} />;
  }

  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values) => {
    setSubmitted(true);
    const response = await dispatch(signin(values.email, values.password));
    console.log("response =>", response);
    if (response.error && response.error !== "") {
      notifyUser("Invalid Credentials", "error");
      setSubmitted(false);
    } else {
      if (response.redirect && response.redirect !== "") {
        notifyUser("Logged In successfully", "success");
        history.push(response.redirect);
      } else {
        notifyUser("InValid Credentials", "error");
        setSubmitted(false);
      }
    }
  };

  return (
    <>
      <Row gutter={30} className="login-page">
        <Col xs={24} sm={24} md={12} className="pull-right">
          <div className="login-form">
            <div className="sidemenu-trigger logo-login">
              <Logo />
            </div>
            {/* <Row gutter={24}>
            <Col xs={24}>
              <Typography.Title level={4}>Login</Typography.Title>
            </Col>
          </Row> */}
            <Spin spinning={submitted}></Spin>
            <Form
              name="normal_login"
              className="login_form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item className="">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a
                  className="login-form-forgot"
                  href="/dashboard/forgot-password"
                  style={{ float: "right" }}
                >
                  Forgot password
                </a>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button btn-style"
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    signin: (email, password) => dispatch(signin(email, password)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
