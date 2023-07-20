

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signin } from "../../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../../services/notification-service";
import UserService from "../../../services/user-service";
import { createLeadClient } from "../../../redux/actions/lead-client-actions";
import API from "../../../redux/api/lead-client-api";
import UserAPI from "../../../redux/api/user-api";
import Config from "../../../config";
import { partnerContractStatusOptions, partnerVerificationOptions, partnerStatusOptions } from "../../../constants/defaultValues";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {
    Breadcrumb,
    Space, Collapse,
    Form, Input, Select,
    Radio, Checkbox, Button,
    Card, Row, Col, Spin,
    List, Avatar, InputNumber
} from "antd";
import Icon from "@ant-design/icons";
import { PhoneOutlined, EnvironmentOutlined, CaretRightOutlined } from "@ant-design/icons";
import { EditSvg } from "../../../components/shared/svg/edit";
import { EyeSvg } from "../../../components/shared/svg/eye";
import { PenSvg } from "../../../components/shared/svg/pen";
import { placeholder } from "@babel/types";
import { Link } from "react-router-dom";
import { humanize } from "../../../helpers/string-helper";

const EditClient = ({ history }) => {
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [primaryClient, setPrimaryClient] = useState(false);
    const [numOfTestimonials, setnNumOfTestimonials] = useState(3);
    const [clientAddress, setClientAddress] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [form] = Form.useForm();
    const user = UserService.getAdminUser();


    const updateMedia = () => {
        var num = window.innerWidth > 1199 ? 3 : (window.innerWidth < 1199 && window.innerWidth > 767) ? 2 : 1
        setnNumOfTestimonials(num);
    };

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        form.setFieldsValue(user);
        return () => window.removeEventListener("resize", updateMedia);
    }, []);



    const onFinish = async (values) => {

        setButtonLoading(true);
        values.name = values.first_name + " " + values.last_name;
        console.log(
            values, "valuesvalues"
        );
        try {
            var userUpdatedData = await UserAPI.updateUser(user.id, values);
            if (userUpdatedData.data) {
                UserService.setAdminUser(userUpdatedData.data);
                notifyUser("Partner Updated", "success");
                history.push(`/admin/partner/overview`);
            }
        } catch (error) {
            notifyUser(JSON.parse(error.response.data).errors[0].message, "error");
            setButtonLoading(false);
        }

    };



    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const formSubItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };
    const formTailLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18, offset: 6 },
    };



    return (
        <>
            <Row gutter={30} className="content-header">
                <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/admin">Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/admin/partners">Partners</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/admin/partner/overview">{humanize(user.first_name)} {humanize(user.last_name)}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>Edit</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>
            <div className="admin-dashboard">



                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="dashboard-listings">
                    <Col span={24}>
                        <div className="admin-form change-password-form">
                            <Form form={form} onFinish={onFinish} name="dynamic_rule">
                                <Form.Item
                                    {...formItemLayout}
                                    name="first_name"
                                    label="First Name"
                                    rules={[
                                        {
                                            required: true, whitespace: true,
                                            message: 'Please enter First Name',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Johan" />
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    name="last_name"
                                    label="Last Name"
                                    rules={[
                                        {
                                            required: true, whitespace: true,
                                            message: 'Please enter Last Name',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Smith" />
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    name="email"
                                    label="Email"
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
                                {/* <Form.Item
                                    {...formItemLayout}
                                    name="password"
                                    label="Password"
                                >
                                    <Input.Password
                                        placeholder="Password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item> */}
                                <Form.Item
                                    {...formItemLayout}
                                    name="cell"
                                    label="Cell"
                                    rules={[
                                        {
                                            required: true,
                                            pattern: /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/g,
                                            message: 'Please input valid number!',
                                            // max: 14
                                        },
                                    ]}
                                >
                                    <Input placeholder="Cell" />
                                </Form.Item>

                                <Form.Item
                                    {...formItemLayout}
                                    name="status"
                                    label="Status"
                                >
                                    <Select>
                                        {partnerStatusOptions.map((option) => {
                                            return (
                                                <Select.Option value={option.value}>{option.text}</Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    name="contract_status"
                                    label="Contract Status"
                                >
                                    <Select>
                                        <Select.Option value="">None</Select.Option>
                                        {partnerContractStatusOptions.map((option) => {
                                            return (
                                                <Select.Option value={option.value}>{option.text}</Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout}
                                    name="verification"
                                    label="Verification"
                                >
                                    <Select>
                                        {partnerVerificationOptions.map((option) => {
                                            return (
                                                <Select.Option value={option.value}>{option.text}</Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>


                                <Form.Item {...formTailLayout}>
                                    <Button onClick={form.submit} loading={buttonLoading} type="primary">Update</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditClient);
