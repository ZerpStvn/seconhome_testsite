import { Form, Input, Button, Checkbox, Row, Col, Typography, Spin } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { connect } from "react-redux";
import { requestPassword } from "../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../services/notification-service";
import { ReactComponent as Logo } from "../../../app/assets/images/second-homes-logo.svg";
import { loadUsers } from "../../redux/actions/user-actions";
import userApi from "../../redux/api/user-api";
import { Link } from "react-router-dom";


const ForgotPassword = ({ history, userList }) => {
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const onFinish = async (values) => {
        setSubmitted(true);
        await userApi.loadAllUsers({
            filter: {
                "email": {
                    "_eq": values.email
                }
            }
        }).then(async (Data) => {
            if (Data.data.length) {
                try {
                    values.reset_url = process.env.REACT_APP_PASSWORD_RESET_URL_ALLOW_LIST;
                    console.log(values);
                    await requestPassword(values);
                    notifyUser("Please check your email", "success");
                    setSubmitted(false);

                } catch (error) {
                    notifyUser(JSON.parse(Error.response.data).errors[0].message, "error");
                }
            }
            else {
                notifyUser("Email doesn't Exist", "error");
                setSubmitted(false);
            }
        });

        // dispatch(loadUsers({
        //     fields: ".*.*.*", filter: {
        //         "email": {
        //             "_eq": values.email
        //         }
        //     }
        // }).then((sasa) => {
        //     console.log(sasa);
        // }))
        // console.log(ddd);

        // try {
        //     setSubmitted(true);
        //     values.reset_url = process.env.REACT_APP_PASSWORD_RESET_URL_ALLOW_LIST;
        //     console.log(values);
        //     await requestPassword(values);
        //     // console.log(response);
        //     notifyUser("Please check your email", "success");
        //     setSubmitted(false);

        // } catch (error) {
        //     console.log(error, "errorerrorerrorerror");
        // }
    };

    return (
        <>
            <Row gutter={30} className="login-page">
                <Col xs={24} sm={24} md={12} className="pull-right">
                    <div className="login-form">
                        <Link to={"/"}>
                            <div className="sidemenu-trigger logo-login">
                                <Logo />
                            </div>
                        </Link>
                        <Spin spinning={submitted}></Spin>
                        <Form
                            name="normal_login"
                            className="login_form"
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
                                <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button btn-style">
                                    Send
                                </Button>
                            </Form.Item>
                            {/* <div style={{ textAlign: 'center' }}>
                                Already have an account{" "}
                                <a className="login-form-forgot" href="/login">
                                    Login
                                </a>
                            </div> */}
                        </Form>
                    </div>
                </Col>
            </Row>
        </>
    );
};

function mapStateToProps(state) {
    console.log(state);
    return {
        userList: state.user.userList
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadUsers: () => dispatch(loadUsers()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
