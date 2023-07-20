

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import UserService from "../../../services/user-service";
import { Form, Input, Button, Row, Col, } from "antd";
import Icon from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const PasswordAdminClient = ({ history }) => {
    const [form] = Form.useForm();
    const user = UserService.getAdminUser();

    console.log('user => ', user);
    useEffect(() => {

    }, []);



    return (
        <div className="admin-dashboard">


            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="dashboard-listings">
                <Col span={24}>
                    <div className="admin-form change-password-form">
                        <Form form={form} name="dynamic_rule">
                            <Form.Item
                                name="email"
                                label="Email"
                            >
                                <Input defaultValue={user.email} disabled />
                            </Form.Item>
                            <Form.Item
                                name="new_password"
                                label="New Password"
                            >
                                <Input.Password
                                    placeholder="New Password"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirm_password"
                                label="Confirm Password"
                            >
                                <Input.Password
                                    placeholder="Confirm Password"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <Form.Item >
                                <Button onClick={form.submit} type="primary">Update</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordAdminClient);
