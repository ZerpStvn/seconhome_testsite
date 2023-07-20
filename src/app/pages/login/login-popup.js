import React, { useEffect, useState } from "react";
import { Switch, useHistory, useLocation } from "react-router-dom";
import { Layout, Modal, Typography, Form, Button, Input, Checkbox, Row, Col, Spin } from "antd";
import { signin } from "../../redux/actions/auth-actions";
import { connect, useDispatch } from "react-redux";
import { compose } from "redux";
import { ReactComponent as Logo } from "../../assets/images/second-homes-logo.svg";
import { notifyUser } from "../../services/notification-service";
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { loadCurrentLoggedInUser } from "../../redux/actions/user-actions";
import UserAPI from "../../redux/api/user-api";
import API from "../../redux/api/lead-client-api";
import UserService from "../../services/user-service";
import dollerIcon from "../../../app/assets/images/doller-icon.svg";
import saveIcon from "../../../app/assets/images/save-icon.svg";
import roomIcon from "../../../app/assets/images/room-icon.svg";
import favIcon from "../../../app/assets/images/fav-home-icon.svg";
import Config from "../../config";

const { Title, Paragraph, Text } = Typography;

const LogInPopUp = (props) => {

    let history = useHistory();
    const dispatch = useDispatch();
    const directLogIn = props.logInDirect;
    const loginRedirect = props.loginRedirect;
    const [submitted, setSubmitted] = useState(false);
    // const [directLogIn, setDirectLogIn] = useState(props.logInDirect);
    const [logInModalVisible, setLogInModalVisible] = useState(false);
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [clientAddress, setClientAddress] = useState(null);

    useEffect(() => {
        setLogInModalVisible(props.logInModalVisible);
        setShowSignUpForm(props.createAccount);
    }, [props.logInModalVisible]);


    const logInHandle = () => {
        setLogInModalVisible(true);
    }
    const logInPopUpCancelHandle = () => {
        props.loginModalCancel && props.loginModalCancel();
        setLogInModalVisible(false);
        showSignUpModalHandle();
    }

    const laterHandle = () => {
        props.OnSubmit();
        // dispatch(loadCurrentLoggedInUser())
        logInPopUpCancelHandle();
    }

    const showSignUpModalHandle = () => {
        setShowSignUpForm(!showSignUpForm);
    }

    const onFinish = async (values) => {
        setSubmitted(true);
        const response = await dispatch(signin(values.email, values.password));
        if (response.error && response.error !== "") {
            notifyUser("Invalid Credentials", "error");
            setSubmitted(false);
        } else {
            if (response.redirect && response.redirect !== "") {
                notifyUser("Logged In successfully", "success");
                dispatch(loadCurrentLoggedInUser())
                if (directLogIn && !loginRedirect) {
                    history.push(`/${response.redirect.replace("dashboard/", "")}`);
                } else if (loginRedirect) {
                    history.reload();
                }
                else {
                    laterHandle();
                }

            } else {
                notifyUser("InValid Credentials", "error");
                setSubmitted(false);
            }
        }
    };

    const createAccount = async (values) => {
        setSubmitted(true);
        const users = await UserAPI.loadAllUsers({ meta: 'filter_count', filter: { role: { _eq: "eed0ea0e-d137-42b3-8cef-3e53c9038aa8" } } });
        const countPartners = users.meta.filter_count;
        values.client_code = "C" + ((countPartners + 1) + "").padStart(3, "0");
        values.role = "eed0ea0e-d137-42b3-8cef-3e53c9038aa8";
        values.name = values.first_name + " " + values.last_name;

        UserAPI.addUser({ first_name: values.first_name, last_name: values.last_name, role: "eed0ea0e-d137-42b3-8cef-3e53c9038aa8", email: values.email, password: values.password }).then(async user => {
            if (user.data) {
                dispatch(signin(values.email, values.password)).then(async (loginData) => {
                    if (loginData.error && loginData.error !== "") {
                        notifyUser("Invalid Credentials", "error");
                        setSubmitted(false);
                    } else {
                        if (loginData.redirect && loginData.redirect !== "") {
                            values.user = user.data.id;

                            var response = await API.createLeadClient(values)
                            if (response.data) {
                                user.data.client = [response.data];
                                UserService.setAdminUser(user.data);
                                notifyUser("New Client Added.", "success");
                                history.push(loginData.redirect.replace("dashboard/", ""));
                            } else {
                                notifyUser("There is some error. Please try again.", "error")
                            }

                        } else {
                            notifyUser("InValid Credentials", "error");
                            setSubmitted(false);
                        }
                    }

                });
            }
        }).catch(Error => {
            notifyUser(JSON.parse(Error.response.data).errors[0].message, "error");
            // console.log(JSON.parse(Error.response.data).errors[0].message);
        });
    }

    return (
        <Modal className="new-popup-ui" visible={logInModalVisible} onCancel={logInPopUpCancelHandle} footer={null}>
            <Title level={3}>Log-in or create a free account and access:</Title>
            <Row className="popup-top-list">
                <Col xs={24} sm={24} md={12}>
                    <div className="block">
                        <img src={dollerIcon} alt="logo" />
                        <h4>Monthly Rates</h4>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <div className="block">
                        <img src={saveIcon} alt="logo" />
                        <h4>Saved Searches</h4>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <div className="block">
                        <img src={roomIcon} alt="logo" />
                        <h4>Available Rooms</h4>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <div className="block">
                        <img src={favIcon} alt="logo" />
                        <h4>Favorite Homes</h4>
                    </div>
                </Col>
            </Row>
            <div style={{ display: showSignUpForm ? "none" : "block" }}>
                <Form
                    layout="vertical"
                    name="normal_login"
                    className="login_form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Email!",
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        label="password"
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
                    {/* <Form.Item className="">
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="/forgot-password" style={{ float: 'right' }}>
          Forgot password
        </a>
      </Form.Item> */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button btn-style" loading={submitted}>
                            Continue
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div style={{ display: showSignUpForm ? "block" : "none" }}>
                <Form onFinish={createAccount} name="dynamic_rule" layout="vertical">
                    <div className="">
                        <Form.Item
                            label="First Name"
                            name="first_name"
                            rules={[
                                {
                                    required: true, whitespace: true,
                                    message: 'Please enter First Name',
                                },
                            ]}
                        >
                            <Input placeholder="Johan" />
                        </Form.Item>
                    </div>
                    <div className="">
                        <Form.Item
                            label="Last Name"
                            name="last_name"
                            rules={[
                                {
                                    required: true, whitespace: true,
                                    message: 'Please enter Last Name',
                                },
                            ]}
                        >
                            <Input placeholder="Smith" />
                        </Form.Item>
                    </div>
                    <div className="">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    required: true,
                                    message: 'Please enter Email',
                                },
                            ]}
                        >
                            <Input placeholder="johansmith@example.com" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Password!",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Password"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item >
                        <Button type="primary" htmlType="submit" loading={submitted}>Create Account</Button>
                    </Form.Item>
                </Form>
            </div>

            {/* <Button icon={<GoogleOutlined />} block>Continue with Google</Button>
            <Button icon={<GoogleOutlined />} block>Continue with Facebook</Button>
            <Button icon={<GoogleOutlined />} block>Continue with Apple</Button> */}
            <Typography>
                <Paragraph>
                    {/* <div style={{ textAlign: "center" }}>By creating an account you agree to Second Home's <a href="">Terms of Use</a> and <a href="">Privacy Policy</a></div> */}
                    <div style={{ textAlign: "center" }}>By creating an account you agree to Second Home's <a href={`${Config.MainUrl}/privacy-policy`}>Privacy Policy</a></div>
                </Paragraph>
                <a className="login-form-forgot" href="/dashboard/forgot-password" style={{ display: showSignUpForm ? "none" : "block", float: 'right' }}>
                    Forgot password
                </a>
                {/* <Button className="link-btn" type="link" onClick={showSignUpModalHandle}>{showSignUpForm ? "Already have an account" : "Don't have account"}</Button> */}
                {props.willLater ? <Button className="link-btn" type="text" onClick={laterHandle}>I’ll do it later</Button> : ''}
            </Typography>
        </Modal>

    );
};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        loadCurrentLoggedInUser: () => dispatch(loadCurrentLoggedInUser())
    };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(LogInPopUp);
