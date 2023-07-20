import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { createHome, updateHome } from "../../../../redux/actions/home-actions";
import {
  Breadcrumb, Button, Card, Col, Form,
  Input, InputNumber, PageHeader, Radio, Row, Select, Tabs
} from "antd";
import Geocode from "react-geocode";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Link } from "react-router-dom";
import { compose } from "redux";
import Locator from "../../../../components/forms/locator";
import {
  careOfferdValues, homeCareOfferedOptions, homeGendersAcceptedOptions, homeLicenseStatusOptions, homeVerificationOptions, licenseStatusValues
} from "../../../../constants/defaultValues";
import API from "../../../../redux/api/home-api";
import UserService from "../../../../services/user-service";
import config from "../../../../config";
import { humanize } from "../../../../helpers/string-helper";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Meta } = Card;

const careOfferdOptions = [];
const licenseStatusOptions = [];
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const formSubItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
{
  Object.entries(careOfferdValues).forEach(([key, value]) =>
    careOfferdOptions.push(
      <Select.Option key={key} value={key}>
        {value}
      </Select.Option>
    )
  );
}

{
  Object.entries(licenseStatusValues).forEach(([key, value]) =>
    licenseStatusOptions.push(
      <Select.Option key={key} value={key}>
        {value}
      </Select.Option>
    )
  );
}

const AddCommunity = ({ history }) => {
  const [form] = Form.useForm();
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = UserService.getAdminUser();
  useEffect(() => {
    return () => {
      console.log("Add Community Unmounting");
    };
  }, []);

  /* const setLatLong = (cords, locationObj) => {
     var _cords = location;
     if (cords && cords !== null && cords !== undefined) {
       _cords.lat = cords.lat;
       _cords.lng = cords.lng;
     }
     setLocation(_cords);
     // console.log(_cords,locationObj)
     if (locationObj && locationObj.state) {
       console.log(cords, locationObj, 'cords, locationObj');
       form.setFieldsValue({
         address_line_1: locationObj.address,
         city: locationObj.city,
         state: locationObj.state,
         zip: locationObj.zip,
         county: locationObj.county
       });
     }
   };*/

  const onSelectAddress = async (address) => {
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

  const handelSave = async (values) => {
    setLoading(true);
    values.geo = location;

    // dispatch(createHome(values));
    await API.createHome(values).then(async (Data) => {
      values.user_created = user.id;
      await dispatch(updateHome(Data.data.id, values));
      history.push("/admin/partners/communities");
    });
    // history.push("/admin/partners/communities");
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/partners">Partners</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/admin/partner/overview">{humanize(user.first_name)} {humanize(user.last_name)}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/partners/communities">Communities</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/admin/partners/communities/add`}>Add Community</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <PageHeader className="site-page-header" title="Add Community" />

      <Row gutter={30}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Form form={form} layout={"horizontal"} onFinish={handelSave} initialValues={{ genders_accepted: "male_female" }}>
            <Card title="Basic Details">
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
                <Input maxLength={255} placeholder="Add Name" />
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Office Phone" name="phone" rules={[
                {
                  required: true,
                  pattern: /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/g,
                  message: 'Please input valid number!',
                  // max: 14
                },
              ]}>
                <Input placeholder="Add Phone" />
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Website" name="website">
                <Input maxLength={255} placeholder="Add Website" />
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Parent Company" name="parent_company">
                <Input maxLength={255} placeholder="Add Parent company" />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="Community Description"
                tooltip="Write a description about your community that you want to showcase to potential families."
                name="short_description" rules={[{
                  pattern: "^([^0-9]*)$",
                  message: "Only Text is Allowed !"
                }]}
              >
                <TextArea autoSize={true} placeholder="Add Description" />
              </Form.Item>
            </Card>
            <Card title="Location Details">
              <Form.Item   {...formItemLayout} name="location" label={"Address"}>
                <GooglePlacesAutocomplete
                  selectProps={{

                    placeholder: "Enter Address, Zip or City to look up",
                    onChange: onSelectAddress,
                  }}
                  apiKey={config.googleMapsAPIkey}
                  autocompletionRequest={{
                    componentRestrictions: { country: ["us"] },
                  }}
                />
                {/* <Locator
                  on_locate={setLatLong}
                  cords={location}
                  radius={20}
                  radius_input={null}
                  defaultAddress={null}
                /> */}
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Address Line 1" name="address_line_1">
                <TextArea maxLength={255} placeholder="Add Address Line 1" />
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Address Line 2" name="address_line_2">
                <TextArea maxLength={255} placeholder="Add Address Line 2" />
              </Form.Item>
              <Form.Item   {...formItemLayout} label="City" name="city" >
                <Input maxLength={255} placeholder="Add City" disabled/>
              </Form.Item>
              <Form.Item   {...formItemLayout} label="State" name="state" >
                <Input maxLength={255} placeholder="Add State" disabled/>
              </Form.Item>
              {/* <Form.Item label="Country" name="country">
                <Input maxLength={255} placeholder="Add Country" />
              </Form.Item> */}
              <Form.Item   {...formItemLayout} label="County" name="county" >
                <Input maxLength={255} placeholder="Add County" disabled/>
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Zip" name="zip" >
                <Input maxLength={255} placeholder="Add Zip" disabled/>
              </Form.Item>
            </Card>
            <Card title="Type of Community">
              <Form.Item   {...formItemLayout}
                label="Care Offered"
                tooltip={"Select all that apply"}
                name="care_offered"
              >
                <Select mode="multiple">
                  {homeCareOfferedOptions.map(({ text, value }) => (
                    <Select.Option key={value} value={value}>
                      {text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Genders Accepted" name="genders_accepted" >
                <Select>
                  {homeGendersAcceptedOptions.map(({ text, value }) => (
                    <Select.Option key={value} value={value}>
                      {text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="Minimum Age Accepted"
                name="minimum_age_accepted"
              >
                <InputNumber max={100} />
              </Form.Item>
            </Card>
            <Card title="License Information">
              <Form.Item   {...formItemLayout} label="License Number" name="license_number">
                <Input maxLength={255} placeholder="Add License Number" />
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Capacity" name="capacity">
                <InputNumber />
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Year Started" name="year_started">
                <InputNumber max={new Date().getFullYear()} />
              </Form.Item>
              <Form.Item   {...formItemLayout} label="License Status" name="license_status">
                <Select>
                  {homeLicenseStatusOptions.map(({ text, value }) => (
                    <Select.Option key={value} value={value}>
                      {text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item   {...formItemLayout} label="State Report" name="state_report" >
                <TextArea />
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Verification" name="verification" >
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
                <Radio.Group>
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
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    createHome: () => dispatch(createHome()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  AddCommunity
);
