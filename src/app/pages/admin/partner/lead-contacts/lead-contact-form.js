import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Button, Form, Input, Card, Select, InputNumber } from "antd";
import { compose } from "redux";
import { listAll } from "../../../../redux/actions/home-actions";
import UserService from "../../../../services/user-service";


const { TextArea } = Input;
const { Meta } = Card;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const formSubItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};



const LeadContactForm = ({ initialValues, handleSave, homeList, homeListLoading, buttonLoading }) => {

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = UserService.getAdminUser();
  useEffect(() => {
    let homesValue = [];
    console.log(initialValues, 'initialValues');
    initialValues.homes && initialValues.homes.length && initialValues.homes.forEach(item => {
      homesValue.push(item.homes_id)
    });
    dispatch(listAll({ "fields": "id,name", filter: { "user_created": { "_eq": user.id } } }));
    form.setFieldsValue({ ...initialValues, homes: homesValue })


  }, []);




  return (
    <>
      <Form
        form={form}
        layout={"horizontal"}
        onFinish={handleSave}
      >
        <Card
          title="Details"
        >
          <Form.Item
            {...formItemLayout}
            label="First Name"
            name="first_name"
            rules={[
              {
                required: true,
                message: "Please enter First Name!",
                whitespace: true,
              },
            ]}
          >
            <Input
              maxLength={255}

              placeholder="First Name"
            />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Last Name"
            name="last_name"
            rules={[
              {
                required: true,
                message: "Please enter Last Name!",
                whitespace: true,
              },
            ]}
          >
            <Input
              maxLength={255}
              placeholder="Last Name"
            />
          </Form.Item>
          <Form.Item  {...formItemLayout} label="Associated Community" name="homes" rules={[
            {
              required: true,
              message: 'Please Select Community',
            },
          ]}>
            <Select mode="multiple">
              {homeList && homeList.map(({ id, name }) =>
                <Select.Option key={id} value={id}>{name}</Select.Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item  {...formItemLayout} label="Cell Phone" name="phone" rules={[
            {
              required: true,
              pattern: /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/g,
              message: 'Please input valid number!',
              // max: 14
            },
          ]}>
            <Input placeholder="Phone" />
          </Form.Item>

          <Form.Item  {...formItemLayout} label="Email" name="email" rules={[
            {
              type: 'email',
              required: true,
              message: 'Please enter valid Email',
            },
          ]} >
            <Input maxLength={255} placeholder="Add Email" />
          </Form.Item>
          <Form.Item  {...formItemLayout} label="Fax" name="fax" >
            <InputNumber placeholder="Fax" rules={[
              {
                required: true,
                message: 'Please input valid number!',
              },
            ]} />
          </Form.Item>

          <Form.Item  {...formItemLayout} label="Job Title" name="job_title" >
            <Input maxLength={255} placeholder="Job Title" />
          </Form.Item>
          {/* <Form.Item label="Status" name="status" >
            <Select  >
              <Select.Option value="published">Published</Select.Option>
              <Select.Option value="draft">Draft</Select.Option>
            </Select>
          </Form.Item> */}

        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={buttonLoading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

function mapStateToProps(state) {
  return {
    homeList: state.home.homeList,
    homeListLoading: state.home.homeListLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAll: () => dispatch(listAll()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(LeadContactForm);
