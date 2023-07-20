import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { notifyUser } from "../../../../services/notification-service";
import { List, Radio, Row, Col, Button, Tabs, Form, Input, Card, Image, Select, InputNumber } from "antd";
import { compose } from "redux";
import { identity } from "ramda";
import Geocode from "react-geocode";
import Config from "../../../../config";
import { careOfferdValues, licenseStatusValues, homeGendersAcceptedOptions, homeCareOfferedOptions, homeLicenseStatusOptions, homeVerificationOptions, homeStatusOptions } from "../../../../constants/defaultValues";
import { useForm } from "../../../../constants/use-form";
import Locator from "../../../../components/forms/locator";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Meta } = Card;

const careOfferdOptions = [];
const licenseStatusOptions = [];
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const formSubItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
{
  Object.entries(careOfferdValues).forEach(([key, value]) =>
    careOfferdOptions.push(
      <Select.Option key={key} value={key}>{value}</Select.Option>
    )
  );
}

{
  Object.entries(licenseStatusValues).forEach(([key, value]) =>
    licenseStatusOptions.push(
      <Select.Option key={key} value={key}>{value}</Select.Option>
    )
  );
}




const EditCommunityProfile = ({ editHome, handleSave, loading }) => {
  const [form] = Form.useForm();
  const formFields = (({ name, phone, website, parent_company, address_line_1, address_line_2, city, state, zip, country, care_offered, license_number, license_status_report, license_status, capacity, year_started, short_description, minimum_age_accepted, genders_accepted, rating, status, verification, state_report, county }) => ({ name, phone, website, parent_company, address_line_1, address_line_2, city, state, zip, country, care_offered, license_number, license_status_report, license_status, capacity, year_started, short_description, minimum_age_accepted, genders_accepted, rating, status, verification, state_report, county }))(editHome);
  const [location, setLocation] = useState(editHome.geo || {
    lat: 0,
    lng: 0
  });
  useEffect(() => {
    console.log(formFields);
    // form.setFieldsValue(formFields);
    form.setFieldsValue({ ...formFields, "care_offered": !!formFields.care_offered ? formFields.care_offered : [] });
    return () => {
      console.log("Edit Communities Profile Unmounting");
    };
  }, []);

  const setLatLong = (cords, locationObj) => {
    var _cords = location;
    if (cords && cords !== null && cords !== undefined) {
      _cords.lat = cords.lat;
      _cords.lng = cords.lng;
    }
    setLocation(_cords);
    // console.log(_cords,locationObj)
    if (locationObj && locationObj.state) {
      form.setFieldsValue({
        address_line_1: locationObj.address,
        city: locationObj.city,
        state: locationObj.state,
        zip: locationObj.zip,
        county: locationObj.county
      });
    }
  }

  const handelProfileSave = (values) => {
    values.geo = location
    handleSave(editHome.id, values)
  }

  const onSelectAddress = async (address) => {
    console.log(address, "addressaddressaddress");
    let response = await getAddressComponets(address.label);
    if (response) {
      form.setFieldsValue({ ...response });
    }
  };

  const getAddressComponets = async (address) => {
    let response = await Geocode.fromAddress(address);
    let addressComponents = {};
    if (response.results.length) {
      console.log(response, "responseresponseresponse");
      console.log(response.results[0].formatted_address, "asaa");
      let location = response.results[0].geometry.location;
      setLocation({
        lat: location.lat,
        lng: location.lng
      });

      // addressComponents.geo.lat = location.lat;
      // addressComponents.geo.lng = location.lng;
      // addressComponents.address = response.formatted_address
      let acCity = response.results[0].address_components.find(
        (r) => r.types.indexOf("locality") > -1
      );
      if (acCity && acCity.long_name) {
        addressComponents.city = acCity.long_name;
      }
      let acCounty = response.results[0].address_components.find(
        (r) => r.types.indexOf("administrative_area_level_2") > -1
      );

      if (acCounty && acCounty.long_name) {
        addressComponents.county = acCounty.long_name;
      }
      let acState = response.results[0].address_components.find(
        (r) => r.types.indexOf("administrative_area_level_1") > -1
      );
      if (acState && acState.long_name) {
        addressComponents.state = acState.long_name;
      }
      let acZip = response.results[0].address_components.find(
        (r) => r.types.indexOf("postal_code") > -1
      );
      if (acZip && acZip.long_name) {
        addressComponents.zip = acZip.long_name;
      }

      let addressLine = address.replace(addressComponents.city, "").replace(addressComponents.state, "").replace(addressComponents.county, "").replace(addressComponents.zip, "").replace(acCounty.short_name, "").replace(/,/g, "").trim();

      addressComponents.address_line_1 = addressLine
    }
    return addressComponents;
  };

  const [formChanged, setFormChanged] = useState(false);

  return (
    <>
      <Row gutter={30}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card
            hoverable
            cover={<img src={`${Config.API}/assets/${editHome.image}`} />}
            className="home-main-title"
          >
            <Meta className="cap-letter" title={editHome.name} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Form
            form={form}
            layout={"horizontal"}
            onFinish={handelProfileSave}
            onFieldsChange={(changedFields) => { setFormChanged(true) }}
          >
            <Card
              title="Basic Details"
            >
              <Form.Item
                {...formItemLayout}
                label="Community Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please Input Name!",
                    whitespace: true,
                  },
                ]}
              >
                <Input
                  maxLength={255}

                  placeholder="Add Name"
                />
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Office Phone" name="phone" rules={[
                {
                  required: true,
                  pattern: /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/g,
                  message: 'Please input valid number!',
                  // max: 14
                },
              ]}>
                <Input placeholder="Add Phone" />
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Website" name="website" >
                <Input maxLength={255} placeholder="Add Website" />
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Parent Company" name="parent_company" >
                <Input maxLength={255} placeholder="Add Parent company" />
              </Form.Item>
              {/* <Form.Item label="Community Description" tooltip="Write a description about your community that you want to showcase to potential families." name="short_description" >
                <TextArea autoSize={true} placeholder="Add Description" />
              </Form.Item> */}
              <Form.Item  {...formItemLayout} label="Community Description" tooltip="Write a description about your community that you want to showcase to potential families." name="short_description" rules={[{
                pattern: "^([^0-9]*)$",
                message: "Only Text is Allowed !"
              }]}
              >
                <TextArea autoSize={true} placeholder="Add Description" />
              </Form.Item>

            </Card>
            <Card
              title="Location Details"
            >
              <Form.Item
                {...formItemLayout}
                name="location"
                label={"Address"}
              >
                <GooglePlacesAutocomplete
                  selectProps={{

                    placeholder: "Enter Address, Zip or City to look up",
                    onChange: onSelectAddress,
                  }}
                  apiKey={Config.googleMapsAPIkey}
                  autocompletionRequest={{
                    componentRestrictions: { country: ["us"] },
                  }}
                />
                {/* <Locator on_locate={setLatLong} cords={location} radius={20} radius_input={null} defaultAddress={null} /> */}
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Address Line 1" name="address_line_1" >
                <TextArea maxLength={255} placeholder="Add Address Line 1" />
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Address Line 2" name="address_line_2" >
                <TextArea maxLength={255} placeholder="Add Address Line 2" />
              </Form.Item>
              <Form.Item  {...formItemLayout} label="City" name="city" >
                <Input maxLength={255} placeholder="Add City" disabled/>
              </Form.Item>
              <Form.Item  {...formItemLayout} label="State" name="state" >
                <Input maxLength={255} placeholder="Add State" disabled/>
              </Form.Item>
              <Form.Item  {...formItemLayout} label="County" name="county" >
                <Input maxLength={255} placeholder="Add County" disabled/>
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Zip" name="zip" >
                <Input maxLength={255} placeholder="Add Zip" disabled/>
              </Form.Item>
            </Card>
            <Card title="Type of Community">
              <Form.Item  {...formItemLayout} label="Care Offered" tooltip={"Select all that apply"} name="care_offered" >
                <Select mode="multiple" >
                  {homeCareOfferedOptions.map(({ text, value }) => <Select.Option key={value} value={value}>{text}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Genders Accepted" name="genders_accepted" >
                <Select>
                  {homeGendersAcceptedOptions.map(({ text, value }) => <Select.Option key={value} value={value}>{text}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Minimum Age Accepted" name="minimum_age_accepted" >
                <InputNumber max={100} />
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Capacity" name="capacity" >
                <InputNumber />
              </Form.Item>
            </Card>
            <Card
              title="License Information"
            >
              <Form.Item {...formItemLayout} label="License Number" name="license_number" >
                <Input maxLength={255} placeholder="Add License Number" />
              </Form.Item>

              <Form.Item {...formItemLayout} label="Year Started" name="year_started" >
                <InputNumber max={new Date().getFullYear()} />
              </Form.Item>
              <Form.Item {...formItemLayout} label="License Status" name="license_status" >
                <Select  >
                  {homeLicenseStatusOptions.map(({ text, value }) => <Select.Option key={value} value={value}>{text}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Status" name="status" >
                <Select  >
                  {homeStatusOptions.map(({ text, value }) => <Select.Option key={value} value={value}>{text}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="State Report" name="state_report" >
                <TextArea />
              </Form.Item>
              <Form.Item {...formItemLayout} label="Verification" name="verification" >
                <Select  >
                  {homeVerificationOptions.map(({ text, value }) => <Select.Option key={value} value={value}>{text}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item name='rating' label={<>
                Rating
                <a style={{ marginLeft: "10px" }} onClick={(e) => {
                  form.setFieldsValue({
                    rating: "",
                  });
                }}>Reset</a>
              </>}>
                <Radio.Group >
                  <Radio value={'a'}>A</Radio>
                  <Radio value={'b'}>B</Radio>
                  <Radio value={'c'}>C</Radio>
                  <Radio value={'d'}>D</Radio>
                </Radio.Group>
              </Form.Item>

            </Card>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(EditCommunityProfile);
