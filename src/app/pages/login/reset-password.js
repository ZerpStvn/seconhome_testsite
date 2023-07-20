import { Form, Input, Button, Checkbox, Row, Col, Typography, Spin } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { connect } from "react-redux";
import { resetPassword } from "../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../services/notification-service";
import { ReactComponent as Logo } from "../../../app/assets/images/second-homes-logo.svg";


const ResetPassword = ({ history }) => {
    const Token = history.location.search.replace("?token=", "");
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);

    const onFinish = async (values) => {
        try {
            setSubmitted(true);
            let data = {
                "token": Token,
                "password": values.password
            }
            await resetPassword(data);
            // console.log(response);
            notifyUser("Reset Successfully, Please login again", "success");
            history.push("/");
            setSubmitted(false);
        } catch (error) {
            console.log(error, "errorerrorerror");
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

                        <Spin spinning={submitted}></Spin>
                        <Form
                            name="normal_login"
                            className="login_form"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button btn-style">
                                    Reset Password
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
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
