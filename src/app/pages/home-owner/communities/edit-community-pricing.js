import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { notifyUser } from "../../../services/notification-service";
import { List, Divider, Row, Col, Button, Tabs, Form, Input, Card, Image, Select, Space, Checkbox, InputNumber, Tooltip } from "antd";
import { compose } from "redux";
import { identity } from "ramda";
import Config from "../../../config";
import { careOfferdValues, licenseStatusValues } from "../../../constants/defaultValues";
import { MinusCircleOutlined, PlusOutlined, DollarOutlined, InfoOutlined, InfoCircleOutlined } from '@ant-design/icons';


const { TabPane } = Tabs;
const { TextArea } = Input;
const { Meta } = Card;



const EditCommunityPricing = ({ editHome, handleSave, loading }) => {
  const [form] = Form.useForm();
  console.log('adsadsads => ', editHome);
  const formFields = {};
  formFields.respite_daily_rates = editHome.respite_daily_rates;
  formFields.care_costs_included = editHome.care_costs_included;
  formFields.community_fee = editHome.community_fee;
  formFields.care_levels = editHome.care_levels;
  formFields.point_system = editHome.point_system;
  formFields.a_la_carte = editHome.a_la_carte;
  formFields.current_specials = editHome.current_specials;
  const [currentSpecials, setCurrentSpecials] = useState(editHome.current_specials);
  const [respiteDailyRatesChecked, setRespiteDailyRatesChecked] = useState(editHome.respite_daily_rates ? true : false);
  const [careLevelsChecked, setCareLevelsChecked] = useState(editHome.care_levels ? true : false);
  const [pointSystemChecked, setPointSystemChecked] = useState(editHome.point_system ? true : false);
  const [aLaCarteChecked, setALaCarteChecked] = useState(editHome.a_la_carte ? true : false);
  const [additionalFee, setAdditionalFee] = useState(editHome.additional_fee);
  const [careLevelsDisabled, setCareLevelsDisabled] = useState(editHome.care_costs_included ? true : false);
  const [careCostsIncludedDisabled, setCareCostsIncludedDisabled] = useState(editHome.care_levels ? true : false);


  useEffect(() => {

    console.log(formFields);
    form.setFieldsValue(formFields);
    return () => {
      console.log("Edit Communities Profile Unmounting");
    };
  }, []);

  const handelFormSubmit = (values) => {
    var _formFields = {};
    _formFields.respite_daily_rates = values.respite_daily_rates || null;
    _formFields.care_costs_included = values.care_costs_included || false;
    _formFields.community_fee = values.community_fee || null;
    _formFields.care_levels = values.care_levels || null;
    _formFields.point_system = values.point_system || null;
    _formFields.a_la_carte = values.a_la_carte || null;
    _formFields.current_specials = values.current_specials || null;
    _formFields.additional_fee = values.additional_fee || null;
    handleSave(editHome.id, _formFields);
  }

  const onChangeRespiteDailyChanges = (e) => {
    setRespiteDailyRatesChecked(e.target.checked)
    if (!e.target.checked) {
      form.setFieldsValue({ respite_daily_rates: null });
    }
  }
  const onChangePointSystem = (e) => {
    setPointSystemChecked(e.target.checked)
    if (!e.target.checked) {
      form.setFieldsValue({ point_system: null });
    }
  }
  const onChangeALaCarte = (e) => {
    setALaCarteChecked(e.target.checked)
    if (!e.target.checked) {
      form.setFieldsValue({ a_la_carte: null });
    }
  }
  const onChangeCareLevels = (e) => {
    setCareLevelsChecked(e.target.checked)
    setCareCostsIncludedDisabled(e.target.checked)
    if (!e.target.checked) {
      form.setFieldsValue({ care_levels: null });

    }
  }
  const onChangeCostsIncluded = (e) => {
    setCareLevelsDisabled(e.target.checked)
    if (e.target.checked) {
      form.setFieldsValue({ care_levels: null });

    }
  }





  return (
    <>

      <Row gutter={30}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card
            hoverable
            cover={<img src={`${Config.API}/assets/${editHome.image}`} />}
            className="home-main-title"
          >
            <Meta title={editHome.name} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Form
            form={form}
            layout={"horizontal"}
            onFinish={handelFormSubmit}
          >
            <Card title="Move-In Specials" >
              <Form.Item name="current_specials">
                <TextArea />
              </Form.Item>
            </Card>
            <Card title={<>Respite Daily Rates <Tooltip title="Check the box to enter information"><InfoCircleOutlined /></Tooltip></>} extra={<Checkbox checked={respiteDailyRatesChecked} onChange={onChangeRespiteDailyChanges}></Checkbox>}>
              {respiteDailyRatesChecked &&
                <>
                  <Form.Item label="Shared Room" name={["respite_daily_rates", "shared_room"]}>
                    <InputNumber
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                  <Form.Item label="Private Room" name={["respite_daily_rates", "private_room"]}  >
                    <InputNumber
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>

                </>}
            </Card>
            <Card title="Level of Care Rates">
              <Form.Item name="care_costs_included" valuePropName="checked">
                <Checkbox disabled={careCostsIncludedDisabled} onChange={onChangeCostsIncluded}>Care Costs Included </Checkbox>
              </Form.Item>
              <Checkbox disabled={careLevelsDisabled} onChange={onChangeCareLevels} checked={!careLevelsDisabled && careLevelsChecked} >Care Levels <Tooltip title="Check the box to enter information"><InfoCircleOutlined /></Tooltip></Checkbox>
              {careLevelsChecked &&
                <Form.List name="care_levels" initialValue={currentSpecials}>
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item className="btn-group-right">
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                          Add Care Level
                        </Button>
                      </Form.Item>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 12 }} align="baseline">
                          <Form.Item
                            {...restField}
                            name={[name, 'key']}
                            fieldKey={[fieldKey, 'key']}
                            rules={[{ required: true, message: 'Care Level Name Missing' }]}
                          >
                            <Input placeholder="Care Level Name" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'value']}
                            fieldKey={[fieldKey, 'value']}
                            rules={[{ required: true, message: 'Care Level Price Missing' }]}
                          >
                            <InputNumber
                              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                    </>
                  )}
                </Form.List>

              }

            </Card>
            <Card title={<>Point System <Tooltip title="Check the box to enter information"><InfoCircleOutlined /></Tooltip></>} extra={<Checkbox checked={pointSystemChecked} onChange={onChangePointSystem}></Checkbox>}>
              {pointSystemChecked &&
                <>
                  <Space key="point_system-space" className="form-columns" align="baseline">
                    <Form.Item label="Point" name={["point_system", "point"]}  >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                    <Form.Item label="Total Points" name={["point_system", "total_points"]}  >
                      <InputNumber />
                    </Form.Item>
                  </Space>
                </>}
            </Card>
            <Card title={<>A La Carte <Tooltip title="Check the box to enter information"><InfoCircleOutlined /></Tooltip></>} extra={<Checkbox checked={aLaCarteChecked} onChange={onChangeALaCarte}></Checkbox>}>
              {aLaCarteChecked &&
                <>
                  <Space key="a_la_carte-space_1" className="form-columns" align="baseline">
                    <Form.Item label="Bathing" name={["a_la_carte", "bathing"]} >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                    <Form.Item label="Dressing" name={["a_la_carte", "dressing"]}  >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Space>
                  <Space key="a_la_carte-space_2" className="form-columns" align="baseline">
                    <Form.Item label="Grooming" name={["a_la_carte", "grooming"]}   >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                    <Form.Item label="1 Person Transfer" name={["a_la_carte", "one_person_transfer"]}  >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Space>
                  <Space key="a_la_carte-space_3" className="form-columns" align="baseline">
                    <Form.Item label="2 Person Transfer" name={["a_la_carte", "two_person_transfer"]}  >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                    <Form.Item label="Medication Management" name={["a_la_carte", "medication"]} >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Space>
                  <Space key="a_la_carte-space_4" className="form-columns" align="baseline">
                    <Form.Item label="Laundry" name={["a_la_carte", "laundry"]}  >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                    <Form.Item label="Feeding" name={["a_la_carte", "feeding"]}   >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Space>
                  <Space key="a_la_carte-space_5" className="form-columns" align="baseline">

                    <Form.Item label="Meal Escort" name={["a_la_carte", "meal_escort"]}  >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                    <Form.Item label="Diabetic Management" name={["a_la_carte", "diabetic_management"]}  >
                      <InputNumber
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Space>
                </>}
            </Card>
            <Card title="Community Fee">
              <Form.Item name="community_fee"  >
                <Input
                />
              </Form.Item>
            </Card>
            <Card title="Additional Fees">
              <Form.List name="additional_fee" initialValue={additionalFee}>
                {(fields, { add, remove }) => (
                  <>
                    <Form.Item className="btn-group-right">
                      <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                        Add Additional Fee
                      </Button>
                    </Form.Item>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 12 }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, 'key']}
                          fieldKey={[fieldKey, 'key']}
                          rules={[{ required: true, message: 'Additional Fee Name Missing' }]}
                        >
                          <Input placeholder="Additional Fee Name" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'value']}
                          fieldKey={[fieldKey, 'value']}
                          rules={[{ required: true, message: 'Additional Fee Price Missing' }]}
                        >
                          <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                  </>
                )}
              </Form.List>

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

export default compose(connect(mapStateToProps, mapDispatchToProps))(EditCommunityPricing);
