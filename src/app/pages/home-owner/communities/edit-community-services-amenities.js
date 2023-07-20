import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { notifyUser } from "../../../services/notification-service";
import { List, Divider, Row, Col, Button, Tabs, Form, Input, Card, Image, Select, Typography } from "antd";
import { compose } from "redux";
import { identity } from "ramda";
import Config from "../../../config";
import { homeCareServicesOptions, waiversOptions, devicesAcceptedOptions, specialServicesOptions, medicalStaffOptions, homeActivitiesOptions, communityAmenitiesOptions } from "../../../constants/defaultValues";
import { useForm } from "../../../constants/use-form";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Meta } = Card;

const EditCommunityServicesAmenities = ({ editHome, handleSave }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  
  const formSubItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  useEffect(() => {
    editHome.care_services = editHome.care_services !== null && editHome.care_services !== "" ? editHome.care_services : [];
    editHome.devices_accepted = editHome.devices_accepted !== null && editHome.devices_accepted !== "" ? editHome.devices_accepted : [];
    editHome.waivers = editHome.waivers !== null && editHome.waivers !== "" ? editHome.waivers : [];
    editHome.special_services = editHome.special_services !== null && editHome.special_services !== "" ? editHome.special_services : [];
    editHome.medical_staff = editHome.medical_staff !== null && editHome.medical_staff !== "" ? editHome.medical_staff : [];
    editHome.activities = editHome.activities !== null && editHome.activities !== "" ? editHome.activities : [];
    editHome.community_amenities = editHome.community_amenities !== null && editHome.community_amenities !== "" ? editHome.community_amenities : [];
    form.setFieldsValue(editHome);
    return () => {
      console.log("Edit Communities Profile Unmounting");
    };
  }, []);




  return (
    <>

      <Row gutter={30}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card
            hoverable
            className="home-main-title"
          >
            <Meta title={editHome.name} />
          </Card>

        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Form
            form={form}
            layout={"horizontal"}
            onFinish={(values) => handleSave(editHome.id, values)}
          >
            <Card
              title="Services and Amenities "
            >
              <Form.Item {...formItemLayout} label="Care Services" tooltip="Select all that apply. Type to add a new item." name="care_services" >
                <Select mode="tags" disabled={true} > {homeCareServicesOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Devices Accepted" tooltip="Select all that apply. Type to add a new item." name="devices_accepted" >
                <Select mode="tags" > {devicesAcceptedOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Waivers" tooltip="Select all that apply. Type to add a new item." name="waivers" >
                <Select mode="tags" > {waiversOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Special Services" tooltip="Select all that apply. Type to add a new item." name="special_services" >
                <Select mode="tags" > {specialServicesOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Medical Staff" tooltip="Select all that apply. Type to add a new item." name="medical_staff" >
                <Select mode="tags" >{medicalStaffOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Activities" tooltip="Select all that apply. Type to add a new item." name="activities" >
                <Select mode="tags" >{homeActivitiesOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Community Amenities" tooltip="Select all that apply. Type to add a new item." name="community_amenities" >
                <Select mode="tags" >{communityAmenitiesOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>

            </Card>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>



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

export default compose(connect(mapStateToProps, mapDispatchToProps))(EditCommunityServicesAmenities);
