import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { notifyUser } from "../../../../services/notification-service";
import { List, Divider, Row, Col, Button, Tabs, Form, Input, Card, Image, Select, Typography } from "antd";
import { compose } from "redux";
import { identity } from "ramda";
import Config from "../../../../config";
import { homeCareServicesOptions, waiversOptions, devicesAcceptedOptions, specialServicesOptions, medicalStaffOptions, homeActivitiesOptions, communityAmenitiesOptions, cultureOptions } from "../../../../constants/defaultValues";
import { useForm } from "../../../../constants/use-form";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Meta } = Card;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const formSubItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const EditCommunityServicesAmenities = ({ editHome, handleSave }) => {

  const [form] = Form.useForm();
  const [combativeBehaviors, setCombativeBehaviors] = useState(editHome.special_services);

  useEffect(() => {
    var values = (({ care_services, special_services, medical_staff, devices_accepted, waivers, activities, community_amenities, culture }) => ({ care_services, special_services, medical_staff, devices_accepted, waivers, activities, community_amenities, culture }))(editHome);

    const valuesArr = Object.entries(values);
    const filteredArr = valuesArr.map(function ([key, value]) {
      if (value !== null) {
        return { key: value }
      } else {
        return { key: [] };
      }
    });
    const newValues = Object.fromEntries(filteredArr);

    form.setFieldsValue(newValues);
    return () => {
      console.log("Edit Communities Profile Unmounting");
    };
  }, []);


  const specialServiceHandle = (e) => {
    setCombativeBehaviors(e)
    if (e.includes("combative_behaviors")) {
      form.setFieldsValue({ combative_behaviors: "physical" })

    }
    else {
      form.setFieldsValue({ combative_behaviors: "" })
    }

  }

  return (
    <>

      <Row gutter={30}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card
            hoverable
            className="home-main-title"
          >
            <Meta className="cap-letter" title={editHome.name} />
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
                <Select mode="tags" defaultValue={!!editHome.care_services ? editHome.care_services : []}>
                  {homeCareServicesOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Devices Accepted" tooltip="Select all that apply. Type to add a new item." name="devices_accepted" >
                <Select mode="tags" defaultValue={!!editHome.devices_accepted ? editHome.devices_accepted : []} >
                  {devicesAcceptedOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Waivers" tooltip="Select all that apply. Type to add a new item." name="waivers" >
                <Select mode="tags" defaultValue={!!editHome.waivers ? editHome.waivers : []}>
                  {waiversOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Special Services" tooltip="Select all that apply. Type to add a new item." name="special_services" >
                <Select mode="tags" onChange={specialServiceHandle} defaultValue={!!editHome.special_services ? editHome.special_services : []}>
                  {specialServicesOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              {console.log(combativeBehaviors)}
              <Form.Item
              {...formItemLayout}
                noStyle
                shouldUpdate={(prevValues, currentValues) => true
                }
              >
                {({ getFieldValue }) =>
                  combativeBehaviors && combativeBehaviors.includes('combative_behaviors') ? (
                    <Form.Item {...formItemLayout} name="combative_behaviors" label="Combative Behaviors">
                      <Select defaultValue={editHome.combative_behaviors}>
                        <Option value="physical">Physical</Option>
                        <Option value="verbal">Verbal </Option>
                        <Option value="physical_verbal">Physical/Verbal</Option>
                      </Select>
                    </Form.Item>
                  ) : ''
                }
              </Form.Item>


              <Form.Item {...formItemLayout} label="Medical Staff" tooltip="Select all that apply. Type to add a new item." name="medical_staff" >
                <Select mode="tags" defaultValue={!!editHome.medical_staff ? editHome.medical_staff : []}>
                  {medicalStaffOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Activities" tooltip="Select all that apply. Type to add a new item." name="activities" >
                <Select mode="tags" defaultValue={!!editHome.activities ? editHome.activities : []}>
                  {homeActivitiesOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Community Amenities" tooltip="Select all that apply. Type to add a new item." name="community_amenities" >
                <Select mode="tags" defaultValue={!!editHome.community_amenities ? editHome.community_amenities : []}>
                  {communityAmenitiesOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Culture" tooltip="Select all that apply. Type to add a new item." name="culture" >
                <Select mode="tags" defaultValue={!!editHome.culture ? editHome.culture : []}>
                  {cultureOptions.map(({ text, value }) => <Select.Option key={value} value={value} >{text}</Select.Option>)}</Select>
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
