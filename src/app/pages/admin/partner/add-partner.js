

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
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Collapse, Form, Input, Select, Button, Row, Col, InputNumber } from "antd";

const AddClient = ({ history }) => {
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [primaryClient, setPrimaryClient] = useState(false);
    const [numOfTestimonials, setnNumOfTestimonials] = useState(3);
    const [clientAddress, setClientAddress] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [form] = Form.useForm();


    const updateMedia = () => {
        var num = window.innerWidth > 1199 ? 3 : (window.innerWidth < 1199 && window.innerWidth > 767) ? 2 : 1
        setnNumOfTestimonials(num);
    };

    useEffect(() => {
        window.addEventListener("resize", updateMedia);

        return () => window.removeEventListener("resize", updateMedia);
    }, []);


    const { Panel } = Collapse;
    const { Option } = Select;


    const onFinish = async (values) => {
        setButtonLoading(true);
        const users = await UserAPI.loadAllUsers({ meta: 'filter_count', filter: { role: { _eq: "8091cbf7-fafb-4255-b1be-42a2e1a6d436" } } });
        const countPartners = users.meta.filter_count;

        values.code = "P" + ((countPartners + 1) + "").padStart(3, "0");
        values.role = "8091cbf7-fafb-4255-b1be-42a2e1a6d436";
        values.name = values.first_name + " " + values.last_name;
        console.log('values =>', values);
        try {
            var user = await UserAPI.addUser({ ...values });
            console.log('user =>', user);
            if (user.data) {
                UserService.setAdminUser(user.data);
                notifyUser("New Partner Added", "success");
                history.push(`/admin/partner/overview`);
            }
        } catch (error) {
            console.log(error);
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



    const onSelectAddress = async (address) => {
        setClientAddress(address.label);

    }


    return (
        <div className="admin-dashboard">


            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="dashboard-listings">
                <Col span={24}>
                    <div className="admin-form change-password-form">
                        <Form form={form} onFinish={onFinish} name="dynamic_rule" autoComplete="off">
                            <Form.Item
                                {...formItemLayout}
                                name="first_name"
                                label="First Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter First Name',
                                        whitespace: true
                                    }
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
                                        required: true,
                                        message: 'Please enter Last Name', whitespace: true,
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
                            <Form.Item
                                {...formItemLayout}
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter Password',
                                    },
                                    {
                                        validator: (_, value) =>
                                          !value.includes(" ")
                                            ? Promise.resolve()
                                            : Promise.reject(new Error("No spaces allowed"))
                                      }
                                ]}
                            >
                                <Input.Password
                                    placeholder="Password"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="cell"
                                label="Cell"
                                rules={[
                                    {
                                        required: false,
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
                                <Select defaultValue={"draft"}>
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
                                <Select defaultValue={"pending"}>
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
                                <Select defaultValue={"pending"}>
                                    {partnerVerificationOptions.map((option) => {
                                        return (
                                            <Select.Option value={option.value}>{option.text}</Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>


                            <Form.Item {...formTailLayout}>
                                <Button onClick={form.submit} loading={buttonLoading} type="primary">Save</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddClient);
