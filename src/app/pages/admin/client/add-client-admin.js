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
import { mileageOptions, clientRelationShipOptions, leadSourceOptions, housingTypesOptions } from "../../../constants/defaultValues";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {
    Space, Collapse,
    Form, Input, Select,
    Radio, Checkbox, Button,
    Card, Row, Col, Spin,
    List, Avatar, InputNumber
} from "antd";
import Icon from "@ant-design/icons";
import { EyeTwoTone, EyeInvisibleOutlined, CaretRightOutlined } from "@ant-design/icons";
import { EditSvg } from "../../../components/shared/svg/edit";
import { EyeSvg } from "../../../components/shared/svg/eye";
import { PenSvg } from "../../../components/shared/svg/pen";
import { placeholder } from "@babel/types";
import Geocode from "react-geocode";
import { faL } from "@fortawesome/free-solid-svg-icons";

Geocode.setApiKey(Config.googleMapsAPIkey);


const AddClient = ({ history }) => {
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [primaryClient, setPrimaryClient] = useState(false);
    const [numOfTestimonials, setnNumOfTestimonials] = useState(3);
    const [clientAddress, setClientAddress] = useState(null);
    const [loading, setLoading] = useState(false);
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

    function callback(key) {
    }

    const AddZero = (num, size) => {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }

    const onFinish = async (values) => {

        setLoading(true);
        const users = await UserAPI.loadAllUsers({ meta: 'filter_count', filter: { role: { _eq: "eed0ea0e-d137-42b3-8cef-3e53c9038aa8" } } });
        const countPartners = users.meta.filter_count;
        values.client_code = "C" + ((countPartners + 1) + "").padStart(3, "0");
        values.role = "eed0ea0e-d137-42b3-8cef-3e53c9038aa8";


        values.name = values.first_name + " " + values.last_name;

        UserAPI.addUser({ first_name: values.first_name, last_name: values.last_name, role: "eed0ea0e-d137-42b3-8cef-3e53c9038aa8", email: values.email, password: values.password }).then(async user => {
            if (user.data) {
                values.user = user.data.id;
                values.address = clientAddress
                var response = await API.createLeadClient(values)
                if (response.data) {
                    user.data.client = [response.data];
                    UserService.setAdminUser(user.data);

                    // var updateLeadResponse = await API.updateLeadClient(response.data.id, { client_code: AddZero(response.data.id, 3) });
                    // if (updateLeadResponse.data) {
                    notifyUser("New Client Added.", "success");
                    history.push(`/admin/client/overview`);
                    setLoading(false);
                    // }
                    // history.push(`/admin/client/overview`)
                } else {
                    notifyUser("There is some error. Please try again.", "error")
                    setLoading(false);
                }
            }
        }).catch(Error => {
            notifyUser(JSON.parse(Error.response.data).errors[0].message, "error");
            console.log(JSON.parse(Error.response.data).errors[0].message);
            setLoading(false);
        });

        // console.log(response.data);

    };
    const onFinishLeadSource = async (values) => {
        console.log(values);
        dispatch(createLeadClient(values));
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
        form.setFieldsValue({ address: address.label })
        let response = await Geocode.fromAddress(address.label);
        console.log(response);
        if (response.results.length) {
            let location = response.results[0].geometry.location;
            form.setFieldsValue({ lat: location.lat, lng: location.lng })
        }
    }

    return (
        <div className="admin-dashboard">


            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="dashboard-listings">
                <Col span={24}>
                    <div className="admin-form change-password-form">

                        <Collapse
                            defaultActiveKey={['1']}
                            onChange={callback}
                            expandIconPosition={['right']}
                            showArrow="false"
                        >

                            <Panel header="Preliminary Details" key="1" >
                                <Form form={form} onFinish={onFinish} name="dynamic_rule" autoComplete="off">
                                    <div className="">
                                        <Form.Item
                                            {...formItemLayout}
                                            name="first_name"
                                            label="First Name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter First Name', whitespace: true,
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Johan" />
                                        </Form.Item>
                                    </div>
                                    <div className="">
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
                                    </div>
                                    <div className="">
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
                                    </div>

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
                                        label="Budget"
                                    >
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <div className="noasterisk">
                                                    <Form.Item
                                                        {...formSubItemLayout}
                                                        name="min_budget"
                                                        label="Min"
                                                    // rules={[
                                                    //     {
                                                    //         required: true,
                                                    //         message: 'Please enter Minimum Budget',
                                                    //     },
                                                    // ]}
                                                    >
                                                        <InputNumber placeholder="----" />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="noasterisk">
                                                    <Form.Item
                                                        {...formSubItemLayout}
                                                        name="max_budget"
                                                        label="Max"
                                                    // rules={[
                                                    //     {

                                                    //         required: true,
                                                    //         message: 'Please Enter Maximum Budget',
                                                    //     },
                                                    // ]}
                                                    >
                                                        <InputNumber placeholder="----" />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Form.Item {...formItemLayout}
                                        name="budget_type"
                                        label="Budget Type">
                                        <Radio.Group>
                                            <Radio value="alw">ALW</Radio>
                                            <Radio value="ssi">SSI</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout}
                                        name="housing_type"
                                        label="Housing Type"
                                    >
                                        <Select mode="multiple" showArrow={true}>
                                            {housingTypesOptions.map(({ text, value }) => <Select.Option value={value}>{text}</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label="Locate Address">
                                        {/* <Input placeholder="Address"/> */}
                                        <GooglePlacesAutocomplete
                                            selectProps={{
                                                placeholder: "Enter Address, Zip or City",
                                                onChange: onSelectAddress,
                                                // inputValue: clientAddress,
                                                //onInputChange: setClientAddress
                                            }}
                                            apiKey={Config.googleMapsAPIkey}
                                            autocompletionRequest={{
                                                componentRestrictions: { country: ["us"] },
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout}
                                        name="address"
                                        label="Address"
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout}
                                        name="lat"
                                        label="Latitute"
                                    // style={{display:"none"}}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout}
                                        name="lng"
                                        label="Longitude"
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...formItemLayout}
                                        name="mileage"
                                        label="Mileage"
                                    >
                                        <Select>
                                            {mileageOptions.map(({ text, value }) => (
                                                <Select.Option key={value} value={value}>
                                                    {text}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item {...formTailLayout}>
                                        <Button onClick={form.submit} type="primary" loading={loading}>Save</Button>
                                    </Form.Item>
                                </Form>
                            </Panel>
                        </Collapse>
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
