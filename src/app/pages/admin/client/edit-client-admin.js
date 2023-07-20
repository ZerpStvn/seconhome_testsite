

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signin } from "../../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../../services/notification-service";
import UserService from "../../../services/user-service";
import { createLeadClient } from "../../../redux/actions/lead-client-actions";
import API from "../../../redux/api/lead-client-api";
import residentAPI from "../../../redux/api/resident-api";
import UserAPI from "../../../redux/api/user-api";
import Config from "../../../config";
import { mileageOptions, clientRelationShipOptions, leadSourceOptions, residentGenderOptions, residentPetOptions, residentLanguageOptions, residentMoveTimeFrameOptions, residentBathroomOptions, residentBedroomOptions, residentHobbiesOptions, housingTypesOptions, residentNightSupervision, residentDialysis } from "../../../constants/defaultValues";
import homeApi from "../../../redux/api/home-api";
import { humanize } from "../../../helpers/string-helper";
import { Space, Collapse, Form, Input, Select, Radio, Checkbox, Button, Card, Row, Col, Spin, List, Avatar, InputNumber, AutoComplete } from "antd";
import Icon from "@ant-design/icons";
import { PhoneOutlined, EnvironmentOutlined, CaretRightOutlined } from "@ant-design/icons";
import { EditSvg } from "../../../components/shared/svg/edit";
import { EyeSvg } from "../../../components/shared/svg/eye";
import { PenSvg } from "../../../components/shared/svg/pen";
import { text } from "dom-helpers";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Geocode from "react-geocode";

Geocode.setApiKey(Config.googleMapsAPIkey);

const EditClient = ({ history }) => {
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);

    const [numOfTestimonials, setnNumOfTestimonials] = useState(3);
    const [form] = Form.useForm();
    const [formPrimaryContact] = Form.useForm();

    const [communitiesTouredOptions, setCommunitiesTouredOptions] = useState([]);
    const [autoCompleteLoaded, setAutoCompleteLoaded] = useState(false);
    const [primaryClientLoaded, setPrimaryClientLoaded] = useState(false);
    const [primaryClient, setPrimaryClient] = useState(false);
    // const [activeContactPanels, setActiveContactPanels] = useState(['primary_contact', 'sources']);
    const [activeContactPanels, setActiveContactPanels] = useState([]);
    const [activeResidentPanels, setActiveResidentPanels] = useState([]);
    const [contactLoading, setContactLoading] = useState(false);
    const [residentLoading, setResidentLoading] = useState(false);
    const [clientAddress, setClientAddress] = useState(null);
    const [clientLocation, setClientLocation] = useState(null);

    const user = UserService.getAdminUser();

    const updateMedia = () => {
        var num = window.innerWidth > 1199 ? 3 : (window.innerWidth < 1199 && window.innerWidth > 767) ? 2 : 1
        setnNumOfTestimonials(num);
    };

    useEffect(() => {
        window.addEventListener("resize", updateMedia);

        !primaryClientLoaded && getPrimaryClient();
        return () => window.removeEventListener("resize", updateMedia);
    }, [primaryClientLoaded]);


    const { Panel } = Collapse;
    const { Option } = Select;
    const getPrimaryClient = async () => {
        var leadClient = await API.listAllLeadClients({ fields: "*,second_contact.*,third_contact.*,primary_resident.*,second_resident.*", filter: { user: { _eq: user.id } }, limit: 1 });
        if (leadClient.data) {
            var client = leadClient.data[0];
            setPrimaryClientLoaded(true);
            setPrimaryClient(client);
            setClientAddress(client.address);
            // client.housing_type
            form.setFieldsValue({ ...client, "housing_type": !!client.housing_type ? client.housing_type : [] });
            var contactPanels = activeContactPanels;
            var residentPanels = activeResidentPanels;
            if (client.second_contact) {
                // contactPanels = [...contactPanels, 'second_contact']
                contactPanels = [...contactPanels]
            }
            if (client.third_contact) { contactPanels = [...contactPanels, 'third_contact'] }

            if (client.primary_resident) { residentPanels = [...residentPanels, 'primary_resident']; }
            if (client.second_resident) { residentPanels = [...residentPanels, 'second_resident']; }
            // setActiveContactPanels(contactPanels);
            // setActiveResidentPanels(residentPanels);
            // setActiveContactPanels([]);
            // setActiveResidentPanels([]);
            setAutoCompleteLoaded(true);
        }
    }

    useEffect(() => {
        if (autoCompleteLoaded) {
            homeApi.listAll({ fields: ['*', 'rooms.*'], filter: { status: { _eq: 'published' } } }).then(Response => {
                let AutocompleteOptions = [];
                Response.data.forEach((Item, Index) => {
                    let TempOPtions = {
                        value: Item.name,
                        label: Item.name
                    }
                    AutocompleteOptions.push(TempOPtions);
                    setCommunitiesTouredOptions(AutocompleteOptions);
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [autoCompleteLoaded]);

    function callback(key) {
        console.log(key)
    }
    function callbackContacts(key) {
        setActiveContactPanels(key);
    }
    function callbackResidentPanel(key) {
        setActiveResidentPanels(key);
    }



    const updateLeadClient = async (values) => {
        setContactLoading(true);
        values.name = values.first_name + " " + values.last_name;
        var response = await API.updateLeadClient(primaryClient.id, values);
        if (response.data) {
            notifyUser("Changes have been saved.", "success");
            setContactLoading(false);
        }
        getPrimaryClient();
    };
    const createSecondContact = async (values) => {
        values.name = values.first_name + " " + values.last_name;
        setContactLoading(true);
        if (primaryClient.second_contact) {
            console.log('ebter');
            var response = await API.updateLeadClient(primaryClient.second_contact.id, values);
        } else {
            console.log('exit');
            var response = await API.createLeadClient(values)
        }
        if (response.data) {
            // notifyUser("2nd Contact Saved.", "success");
            console.log({ ...primaryClient, second_contact: response.data.id });
            notifyUser("Changes have been saved.", "success");
            updateLeadClient({ ...primaryClient, second_contact: response.data.id })
            setContactLoading(false);
        } else {
            notifyUser("There is some error. Please try again.", "error")
            setContactLoading(false);
        }
    };
    const createThirdContact = async (values) => {
        setContactLoading(true);
        values.name = values.first_name + " " + values.last_name;
        if (primaryClient.third_contact) {
            var response = await API.updateLeadClient(primaryClient.third_contact.id, values);
        } else {
            var response = await API.createLeadClient(values)
        }

        if (response.data) {
            // notifyUser("3rd Contact Saved.", "success");
            notifyUser("Changes have been saved.", "success");
            updateLeadClient({ ...primaryClient, third_contact: response.data.id })
            setContactLoading(false);
        } else {
            notifyUser("There is some error. Please try again.", "error")
            setContactLoading(false);
        }
    };
    const createPrimaryResident = async (values) => {
        setResidentLoading(true);
        values.name = values.first_name + " " + values.last_name;

        if (primaryClient.primary_resident) {
            var response = await residentAPI.updateResident(primaryClient.primary_resident.id, values);
        } else {
            var response = await residentAPI.createResident(values)
        }
        if (response.data) {
            primaryClient.primary_resident = response.data
            notifyUser("Resident Saved.", "success");
            updateLeadClient(primaryClient)
            setResidentLoading(false);
        } else {
            notifyUser("There is some error. Please try again.", "error")
            setResidentLoading(false);
        }
    };
    const createSecondResident = async (values) => {
        values.name = values.first_name + " " + values.last_name;
        setResidentLoading(true);
        if (primaryClient.second_resident) {
            var response = await residentAPI.updateResident(primaryClient.second_resident.id, values);
        } else {
            var response = await residentAPI.createResident(values)
        }
        if (response.data) {
            primaryClient.second_resident = response.data
            notifyUser("Resident Saved.", "success");
            updateLeadClient(primaryClient)
            setResidentLoading(false);
        } else {
            notifyUser("There is some error. Please try again.", "error")
            setResidentLoading(false);
        }
    };

    // const communitiesAutocompleteHandle = (Value, saad) => {
    //     console.log(Value.target.value, saad);
    //     let TempOptions = communitiesTouredOptions;
    //     let TempFilteredOptions = TempOptions.filter((Item, Index) => {
    //         console.log(Item, Index);
    //         return Item.label.toLowerCase().includes(Value.target.value.toLowerCase());
    //     });
    //     console.log(TempFilteredOptions);
    //     setCommunitiesTouredOptions(TempFilteredOptions);
    // }

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

    const ClientContactForm = ({ data, onFinish }) => {
        const [clientform] = Form.useForm();
        if (data) {
            clientform.setFieldsValue(data);
        }

        return <Form form={clientform} onFinish={onFinish} >
            <Form.Item
                {...formItemLayout}
                name="first_name"
                label="First Name"
            >
                <Input placeholder="Johan" />
            </Form.Item>
            <Form.Item
                {...formItemLayout}
                name="last_name"
                label="Last Name"
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
                    },
                ]}
            >
                <Input placeholder="johansmith@example.com" />
            </Form.Item>
            <Form.Item
                {...formItemLayout}
                name="cell"
                label="Cell"
                rules={[
                    {
                        required: true,
                        message: 'Please input valid number!',
                        pattern: /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/g,
                        // max: 14
                    },
                ]}
            >
                <Input placeholder="----" />
            </Form.Item>
            <Form.Item
                {...formItemLayout}
                name="phone"
                label="Phone"
                rules={[
                    {
                        required: true,
                        pattern: /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/g,
                        message: 'Please input valid number!',
                        // max: 14
                    },
                ]}
            >
                <Input placeholder="----" />
            </Form.Item>
            <Form.Item
                {...formItemLayout}
                name="relationship"
                label="Relationship"
            >
                <Select defaultValue="">
                    {clientRelationShipOptions.map(({ text, value }) => (
                        <Select.Option key={value} value={value}>
                            {text}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item {...formTailLayout}>
                <Button loading={contactLoading} htmlType="submit" type="primary">Save</Button>
            </Form.Item>
        </Form>
    }

    const ResidentForm = ({ data, onFinish }) => {
        const [residentForm] = Form.useForm();
        if (data == null) {
            data = {
                hobbies: []
            }
        }
        if (data) {
            data.bedroom = data.bedroom !== null && data.bedroom !== "" ? (typeof data.bedroom === "string" ? JSON.parse(data.bedroom) : data.bedroom) : []
            data.bathroom = data.bathroom !== null && data.bathroom !== "" ? (typeof data.bathroom === "string" ? JSON.parse(data.bathroom) : data.bathroom) : []
            data.hobbies = data.hobbies !== null && data.hobbies !== "" ? data.hobbies : []
            residentForm.setFieldsValue(data);
            var detailsPannel = [];
            if (data.cognition || data.wanders || data.confused || data.sundowning || data.dysphagia || data.hospice || data.behavior || data.insulin || data.glucose_testing || data.hearing || data.sight || data.speech || data.dialysis || data.recent_stroke || data.allergies || data.multiple_sclerosis || data.mental_illness || data.suicidal || data.bedridden || data.wounds || data.parkinsons || data.hiv || data.medication_list || data.medical_notes) {
                detailsPannel = [...detailsPannel, 'medical_details']
            }
            if (data.cane || data.walker || data.wheelchair || data.scooter || data.oxygen || data.catheter || data.feeding_tube || data.colostomy || data.ostomy || data.commode || data.iv || data.prosthesis || data.trachea || data.equipment_notes) {
                detailsPannel = [...detailsPannel, 'equipment_details']
            }
            if (data.bathing || data.feeding || data.medication || data.grooming || data.transferring || data.dressing || data.walking_assistance || data.night_supervision || data.incontinent || data.toileting || data.transportation || data.level_of_care_notes) {
                detailsPannel = [...detailsPannel, 'care_details']
            }

            if (data.medi_cal || data.medicare || data.veteran || data.ltc_insurance || data.budget_notes) {
                detailsPannel = [...detailsPannel, 'financial_details']
            }
            if (data.agency_history || data.communities_toured || data.communities_referred || data.current_community) {
                detailsPannel = [...detailsPannel, 'history_details']
            }
            if (data.tour_availability || data.move_time_frame || data.status || data.can_share_phone || data.note_to_owner) {
                detailsPannel = [...detailsPannel, 'other_details']
            }
        }

        const [activeDetailsPannels, setActiveDetailsPannels] = useState([]);
        // console.log(detailsPannel);


        const callbackDetalsPannel = (keys) => {
            setActiveDetailsPannels(keys);
        }



        return <>
            <Form form={residentForm} onFinish={onFinish}>
                <Form.Item
                    {...formItemLayout}
                    name="first_name"
                    label="Resident First Name"
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
                    label="Resident Last Name"
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
                    name="gender"
                    label="Gender"
                >
                    <Select >
                        {residentGenderOptions.map(({ text, value }) => (
                            <Select.Option key={value} value={value}>
                                {text}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    name="age"
                    label="Age"
                // rules={[
                //     {
                //         type: 'number',
                //     },
                // ]}
                >
                    <Input placeholder="----" type={"number"} />
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    name="weight"
                    label="Weight"
                // rules={[
                //     {
                //         type: 'number',
                //     },
                // ]}
                >
                    <Input placeholder="----" type={"number"} />
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    name="height"
                    label="Height"
                // rules={[
                //     {
                //         type: 'number',
                //     },
                // ]}
                >
                    <Input placeholder="----" type={"number"} />
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    name="pet"
                    label="Pet"
                    tooltip="Can resident take care of pet?"
                >
                    <Input />
                    {/* <Select >
                        {residentPetOptions.map(({ text, value }) => (
                            <Select.Option key={value} value={value}>
                                {text}
                            </Select.Option>
                        ))}
                    </Select> */}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    name="hobbies"
                    label="Hobbies"
                >
                    <Select mode="tags" onChange={(value) => console.log(value)}>
                        {residentHobbiesOptions.map(({ text, value }) => (
                            <Select.Option key={value} value={value}>
                                {text}
                            </Select.Option>
                        ))}
                        <Select.Option key={"custom"} value={"custom"}>
                            Custom Answer
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => true
                    }
                >
                    {({ getFieldValue }) =>
                        getFieldValue('hobbies').includes('custom') ? (
                            <Form.Item name="custom_hobbie_answer" label="Custom Answer">
                                <Input />
                            </Form.Item>
                        ) : ''
                    }
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    name="bedroom"
                    label="Bedroom Type"
                >
                    <Select mode="multiple">
                        {residentBedroomOptions.map(({ text, value }) => (
                            <Select.Option key={value} value={value}>
                                {text}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    name="bathroom"
                    label="Bathroom Type"
                >
                    <Select mode="multiple">
                        {residentBathroomOptions.map(({ text, value }) => (
                            <Select.Option key={value} value={value}>
                                {text}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item {...formItemLayout} name="languages" label="Languages" >
                    <Select >
                        {residentLanguageOptions.map(({ text, value }) => (
                            <Select.Option key={value} value={value}>{text}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item {...formTailLayout}>
                    <Button loading={residentLoading} htmlType="submit" type="primary">Save</Button>
                </Form.Item>
            </Form>
            <Collapse onChange={callbackDetalsPannel} expandIconPosition={['right']} activeKey={activeDetailsPannels} showArrow={true} >
                <Panel header="Medical Details" key="medical_details">
                    <Form form={residentForm} onFinish={onFinish} >
                        <Col span={16}>
                            <Form.Item {...formItemLayout} name="cognition" label="Cognition" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="no_issues">No Issues</Option>
                                    <Option value="mild_cognitive_impairment">Mild Cognitive Impairment</Option>
                                    <Option value="diagnosed_dementia">Diagnosed Dementia</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="confused" label="Confused" >
                                <Select >
                                    <Option value="family_unsure">Family Unsure</Option>
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="dysphagia" label="Dysphagia" >
                                <Select >
                                    <Option value="family_unsure">Family Unsure</Option>
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="behavior" label="Behavior" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="no_issues">No Issues</Option>
                                    <Option value="physical">Physical</Option>
                                    <Option value="verbal">Verbal </Option>
                                    <Option value="physical_verbal">Physical/Verbal</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="glucose_testing" label="Glucose Testing" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="no">No</Option>
                                    <Option value="self">Self </Option>
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="sight" label="Sight" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="no_issues">No Issues</Option>
                                    <Option value="impaired">Impaired</Option>
                                    <Option value="blind">Blind</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="dialysis" label="Dialysis" >
                                <Select >
                                    {residentDialysis.map((item, index) => {
                                        return <Option value={item.value} key={index}>{item.text}</Option>
                                    })}
                                    {/* <Option value="no">No</Option>
                                    <Option value="1_week">1/Week</Option>
                                    <Option value="2_week">2/Week</Option>
                                    <Option value="3_week">3/Week</Option>
                                    <Option value="family_unsure">Family Unsure</Option> */}
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="allergies" label="Allergies" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="no">No</Option>
                                    <Option value="food">Food</Option>
                                    <Option value="medication">Medication</Option>
                                    <Option value="food_medication">Food/Medication</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="mental_illness" label="Mental Illness" >
                                <Select >
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="bedridden" label="Bedridden" >
                                <Select >
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="parkinsons" label="Parkinsons" >
                                <Select >
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="medication_list" label="Medication List" >
                                <Input.TextArea />
                            </Form.Item>





                        </Col>
                        <Col span={16}>
                            <Form.Item {...formItemLayout} name="wanders" label="Wanders" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="no">No</Option>
                                    <Option value="during_day">During Day</Option>
                                    <Option value="during_night">During Night </Option>
                                    <Option value="during_day_night">During Day/Night</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="sundowning" label="Sundowning" >
                                <Select >
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="hospice" label="Hospice" >
                                <Select >
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="insulin" label="Insulin" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="no">No</Option>
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="self">Self </Option>
                                    <Option value="oral">Oral </Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="hearing" label="Hearing" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="no_issues">No Issues</Option>
                                    <Option value="hard_hearing">Hard of Hearing</Option>
                                    <Option value="deaf">Deaf</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="speech" label="Speech" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="no_issues">No Issues</Option>
                                    <Option value="not_clear">Not Clear</Option>
                                    <Option value="non_verbal">Non-Verbal</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="recent_stroke" label="Recent Stroke" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="multiple_sclerosis" label="Multiple Sclerosis" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="suicidal" label="Suicidal" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="wounds" label="Wounds" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="family_unsure">Family Unsure</Option>
                                    <Option value="no">No</Option>
                                    <Option value="Stage 1">Stage 1</Option>
                                    <Option value="Stage 2">Stage 2</Option>
                                    <Option value="Stage 3">Stage 3</Option>
                                    <Option value="Stage 4">Stage 4</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="hiv" label="HIV" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>

                            {/* <Form.Item {...formItemLayout} name="awake_night_staff" label="Awake Night Staff" >
                                <Select >
                                    <Option value="family_unsure">Family Unsure</Option>
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                </Select>
                            </Form.Item> */}

                            <Form.Item {...formItemLayout} name="medical_notes" label="Medical Notes" >
                                <Input.TextArea />
                            </Form.Item>

                        </Col>
                        <Form.Item {...formTailLayout}>
                            <Button loading={residentLoading} htmlType="submit" type="primary">Save</Button>
                        </Form.Item>
                    </Form>


                </Panel>
                <Panel header="Equipment Details" key="equipment_details">

                    <Form form={residentForm} onFinish={onFinish} >
                        <Col span={16}>
                            <Form.Item {...formItemLayout} name="cane" label="Cane" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="wheelchair" label="Wheelchair" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="long_distance">Long Distance</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="oxygen" label="Oxygen" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="feeding_tube" label="Feeding Tube" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="ostomy" label="Ostomy" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="iv" label="IV" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="trachea" label="Trachea" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item {...formItemLayout} name="walker" label="Walker" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="scooter" label="Scooter" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="catheter" label="Catheter" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="colostomy" label="Colostomy" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="commode" label="Commode" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="prosthesis" label="Prosthesis" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="leg">Leg </Option>
                                    <Option value="arm">Arm</Option>
                                    <Option value="leg_arm">Leg/Arm</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="equipment_notes" label="Equipment Notes" >
                                <Input.TextArea />
                            </Form.Item>


                        </Col>
                        <Form.Item {...formTailLayout}>
                            <Button loading={residentLoading} htmlType="submit" type="primary">Save</Button>
                        </Form.Item>
                    </Form>

                </Panel>
                <Panel header="Level Of Care Details" key="care_details">
                    <Form form={residentForm} onFinish={onFinish} >
                        <Col span={16}>
                            <Form.Item {...formItemLayout} name="bathing" label="Bathing" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="no">No</Option>
                                    <Option value="sponge_bath">Sponge Bath</Option>
                                    <Option value="stand_by">Stand By</Option>
                                    <Option value="verbal_cue">Verbal Cue</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="medication" label="Medication" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="transferring" label="Transferring" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="no_help">No Help</Option>
                                    <Option value="no">No</Option>
                                    <Option value="1_person_assist">1 Person Assist</Option>
                                    <Option value="2_person_assist">2 Person Assist</Option>
                                    <Option value="deadweight">Deadweight </Option>
                                    <Option value="hoyer">Hoyer </Option>
                                    <Option value="stand_by">Stand By</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="walking_assistance" label="Walking Assistance" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="incontinent" label="Incontinent" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="transportation" label="Transportation" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>

                        </Col>
                        <Col span={16}>
                            <Form.Item {...formItemLayout} name="feeding" label="Feeding" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="chop">Chop</Option>
                                    <Option value="pureed">Pureed</Option>
                                    <Option value="verbal_cue">Verbal Cue</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="grooming" label="Grooming" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="verbal_cue">Verbal Cue</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="dressing" label="Dressing" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="verbal_cue">Verbal Cue</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="night_supervision" label="Night Supervision" >
                                <Select >
                                    {residentNightSupervision.map((item, index) => {
                                        return <Option value={item.value}>{item.text}</Option>
                                    })}

                                    {/* <Option value="no">No</Option>
                                    <Option value="awake_1_2_times">Awake (1-2 times)</Option>
                                    <Option value="awake_3_4_times">Awake (3-4 times)</Option>
                                    <Option value="awake_x_4_times">Awake (x&gt;4 times)</Option>
                                    <Option value="family_unsure">Family Unsure</Option> */}
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="toileting" label="Toileting" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="needs_help">Needs Help</Option>
                                    <Option value="no_help">No Help</Option>
                                    <Option value="verbal_cue">Verbal Cue</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="level_of_care_notes" label="Level of Care Notes" >
                                <Input.TextArea />
                            </Form.Item>


                        </Col>
                        <Form.Item {...formTailLayout}>
                            <Button loading={residentLoading} htmlType="submit" type="primary">Save</Button>
                        </Form.Item>
                    </Form>

                </Panel>
                <Panel header="Financial Details" key="financial_details">
                    <Form form={residentForm} onFinish={onFinish} >
                        <Col span={16}>

                            <Form.Item {...formItemLayout} name="medi_cal" label="Medi-Cal" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="pending">Pending</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="veteran" label="Veteran" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="surviving_spouse">Surviving Spouse</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>

                        </Col>
                        <Col span={16}>
                            <Form.Item {...formItemLayout} name="medicare" label="Medicare" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="ltc_insurance" label="LTC Insurance" >
                                <Select >
                                    {/* <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option> */}
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                    <Option value="family_unsure">Family Unsure</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="budget_notes" label="Budget Notes" >
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                        <Form.Item {...formTailLayout}>
                            <Button loading={residentLoading} htmlType="submit" type="primary">Save</Button>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="History Details" key="history_details">
                    <Form form={residentForm} onFinish={onFinish} >
                        <Col span={24}>
                            <Form.Item {...formItemLayout} name="agency_history" label="Agency History" >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="communities_toured" label="Communities Toured" >
                                {/* <AutoComplete
                                    dropdownClassName="certain-category-search-dropdown"
                                    dropdownMatchSelectWidth={500}

                                    options={communitiesTouredOptions}
                                >
                                    <Input />
                                </AutoComplete> */}
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    mode="multiple"
                                    onChange={() => console.log(0)}
                                    onSearch={() => console.log(0)}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {communitiesTouredOptions.map((item, index) => {
                                        return <Option value={item.value}>{item.label}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="communities_referred" label="Communities Referred" >
                                {/* <InputNumber /> */}
                                {/* <AutoComplete
                                    dropdownClassName="certain-category-search-dropdown"
                                    dropdownMatchSelectWidth={500}
                                    options={communitiesTouredOptions}
                                >
                                    <Input />
                                </AutoComplete> */}
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    mode="multiple"
                                    onChange={() => console.log(0)}
                                    onSearch={() => console.log(0)}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {communitiesTouredOptions.map((item, index) => {
                                        return <Option value={item.value}>{item.label}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name="current_community" label="Current Community Resides" >
                                {/* <Input /> */}
                                {/* <AutoComplete
                                    dropdownClassName="certain-category-search-dropdown"

                                    dropdownMatchSelectWidth={500}
                                    options={communitiesTouredOptions}
                                >
                                    <Input />
                                </AutoComplete> */}
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    mode="multiple"
                                    onChange={() => console.log(0)}
                                    onSearch={() => console.log(0)}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {communitiesTouredOptions.map((item, index) => {
                                        return <Option value={item.value}>{item.label}</Option>
                                    })}
                                </Select>
                            </Form.Item>

                        </Col>
                        <Form.Item {...formTailLayout}>
                            <Button loading={residentLoading} htmlType="submit" type="primary">Save</Button>
                        </Form.Item>
                    </Form>

                </Panel>
                {/* <Panel header="Prefrence Details">
                        <Form form={residentForm} onFinish={onFinish} >
                            <Col span={16}>

                            </Col>
                            <Col span={16}>

                            </Col>
                        </Form>

                </Panel> */}
                <Panel header="Other Details" key="other_details">
                    <Form form={residentForm} onFinish={onFinish} >
                        <Col span={24}>
                            <Form.Item {...formItemLayout} name='tour_availability' label="Tour Availability">
                                {/* <Select >
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                </Select> */}
                                <Input />
                            </Form.Item>
                            <Form.Item {...formItemLayout} name='move_time_frame' label="Move Time Frame">
                                <Select >
                                    {residentMoveTimeFrameOptions.map(({ text, value }) => (
                                        <Select.Option key={value} value={value}>{text}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name='status' label="Status">
                                <Select >
                                    {/* <Option value="published">Published</Option>
                                    <Option value="draft">Draft</Option> */}
                                    <Option value="1st_contact_attempt">1st Contact Attempt</Option>
                                    <Option value="2nd_contact_attempt">2nd Contact Attempt</Option>
                                    <Option value="3rd_contact_attempt">3rd Contact Attempt</Option>
                                    <Option value="enrolled">Enrolled </Option>
                                    <Option value="touring">Touring  </Option>
                                    <Option value="in_escrow">In Escrow </Option>
                                    <Option value="invoice">Invoice </Option>
                                    <Option value="completed">Completed  </Option>
                                    <Option value="on_hold">On Hold  </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item {...formItemLayout} name='can_share_phone' label="Can Share Phone To Owners">
                                <Radio.Group>
                                    <Radio value="yes"> Yes </Radio>
                                    <Radio value="no"> No </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name='note_to_owner' label="Notes to Owner">
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item {...formItemLayout} name='physicians_report' label="Physician's Report">
                                <Select >
                                    <Option value="pending">Pending</Option>
                                    <Option value="client_possession">Client Possession</Option>
                                    <Option value="uploaded">Uploaded</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Form.Item {...formTailLayout}>
                            <Button loading={residentLoading} htmlType="submit" type="primary">Save</Button>
                        </Form.Item>
                    </Form>

                </Panel>
            </Collapse>
        </>
    }

    const onSelectAddress = async (address) => {
        form.setFieldsValue({ address: address.label })
        let response = await Geocode.fromAddress(address.label);
        if (response.results.length) {
            let location = response.results[0].geometry.location;
            form.setFieldsValue({ lat: location.lat, lng: location.lng })
        }
    }

    return (
        <Spin spinning={!primaryClientLoaded} size="large">
            <div className="admin-dashboard">


                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="dashboard-listings">
                    <Col span={24}>
                        <div className="admin-form">
                            <Collapse
                                defaultActiveKey={[]}
                                onChange={callback}
                                expandIconPosition={['right']}
                                showArrow="false"
                            >

                                <Panel header="Preliminary Details" key="preliminary_details" >

                                    <Form loading={!primaryClientLoaded} form={form} onFinish={updateLeadClient} name="dynamic_rule">
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
                                        <Form.Item  {...formItemLayout}
                                            name="budget_type"
                                            label={
                                                <>
                                                    Budget Type
                                                    <a
                                                        onClick={() => form.setFieldsValue({
                                                            budget_type: "",
                                                        })}
                                                        style={{ marginLeft: 20 }}
                                                    >
                                                        Reset
                                                    </a>
                                                </>
                                            }
                                        >
                                            <Radio.Group>
                                                <Radio value="alw">ALW</Radio>
                                                <Radio value="ssi">SSI</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item  {...formItemLayout} label="Locate Address">
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
                                            <Input disabled={true} />
                                        </Form.Item>
                                        <Form.Item
                                            {...formItemLayout}
                                            name="lat"
                                            label="Latitute"
                                            style={{ display: "none" }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            {...formItemLayout}
                                            name="lng"
                                            label="Longitude"
                                            style={{ display: "none" }}
                                        >
                                            <Input />
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
                                        {/* <Form.Item
                                        {...formItemLayout}
                                        name="location"
                                        label="Location"
                                    >
                                        <Input placeholder="Search by zip, address, or community name" />
                                    </Form.Item> */}
                                        <Form.Item
                                            {...formItemLayout}
                                            name="mileage"
                                            label="Mileage"
                                        >
                                            <Select>
                                                {mileageOptions.map(({ text, value }) => (
                                                    <Select.Option key={value} value={value} label={text}>
                                                        {text}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item {...formTailLayout}>
                                            <Button onClick={form.submit} type="primary" loading={contactLoading}>Save</Button>
                                        </Form.Item>
                                    </Form>
                                </Panel>
                                <Panel header="Client Details" key="contact_details" >
                                    <Collapse
                                        activeKey={activeContactPanels}
                                        onChange={callbackContacts}
                                        expandIconPosition={['right']}
                                        showArrow="false"

                                    >
                                        <Panel header="Primary Contact" key="primary_contact" >
                                            <ClientContactForm data={primaryClient} onFinish={updateLeadClient} />
                                        </Panel>
                                        <Panel disabled={!primaryClientLoaded} header="2nd Contact" key="second_contact" >
                                            <ClientContactForm data={primaryClient.second_contact} onFinish={createSecondContact} />
                                        </Panel>
                                        <Panel disabled={!primaryClientLoaded} header="3rd Contact" key="third_contact" >
                                            <ClientContactForm data={primaryClient.third_contact} onFinish={createThirdContact} />
                                        </Panel>
                                        <Panel disabled={!primaryClientLoaded} header="Sources" key="sources" >
                                            <Form onFinish={updateLeadClient} form={form}>
                                                <Form.Item
                                                    {...formItemLayout}
                                                    name="lead_source"
                                                    label="Lead Source"
                                                >
                                                    <Select >
                                                        <Select.Option value="">
                                                            None
                                                        </Select.Option>
                                                        {leadSourceOptions.map(({ text, value }) => (
                                                            <Select.Option key={value} value={value}>
                                                                {text}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...formItemLayout}
                                                    name="referral_name"
                                                    label="Referral Name"
                                                >
                                                    <Input placeholder="Johan" />
                                                </Form.Item>

                                                <Form.Item {...formTailLayout}>
                                                    <Button loading={residentLoading} htmlType="submit" type="primary">Save</Button>
                                                </Form.Item>
                                            </Form>
                                        </Panel>
                                    </Collapse>
                                </Panel>
                                <Panel disabled={!primaryClientLoaded} header="Resident Details" key="resident_details" >
                                    <Collapse
                                        activeKey={activeResidentPanels}
                                        onChange={callbackResidentPanel}
                                        expandIconPosition={['right']}
                                        showArrow="false"
                                    >
                                        <Panel header="Primary Resident" key="primary_resident">
                                            <ResidentForm data={primaryClient.primary_resident} onFinish={createPrimaryResident} />
                                        </Panel>
                                        <Panel header="2nd Resident" key="second_resident" >
                                            <ResidentForm data={primaryClient.second_resident} onFinish={createSecondResident} />
                                        </Panel>
                                    </Collapse>
                                </Panel>
                            </Collapse>

                        </div>
                    </Col>
                </Row>

            </div>
        </Spin>
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
