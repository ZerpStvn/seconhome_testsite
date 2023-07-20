import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Button, Form, Input, Card, Select, Breadcrumb, PageHeader, DatePicker, Menu } from "antd";
import { compose } from "redux";
import { createStaff } from "../../../../redux/actions/staff-actions";
import { staffTitles, staffCredentials, staffLanguages } from "../../../../constants/defaultValues";
import moment from 'moment';
import UploadPhotos from "../../../../components/upload-photos";
import fileAPI from "../../../../redux/api/file-api";

const { TextArea } = Input;

const dateFormat = 'YYYY-MM-DD';
const viewDateFormat = 'MMM DD, YYYY';




const AddStaff = ({ history }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [photoList, setPhotoList] = useState([]);
  const [dateStarted, setDateStarted] = useState('');
  const [loading, setLoading] = useState(false);
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const formSubItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  useEffect(() => {

    return () => {
      console.log("Edit Staff Unmounting");
    };
  }, []);

  const handleSave = async (values) => {
    setLoading(true)
    const photos = await getPhotosArray();
    values.photos = photos;
    values.home = id;
    values.start_date = dateStarted;
    await dispatch(createStaff(values))
    history.push("/owner/communities/" + id + "/staff")
  };


  const handelPhotoListChange = ({ fileList, file }) => {
    setPhotoList(fileList)
  }

  const getPhotosArray = async () => {
    let imageIds = [];
    for (let i = 0; i < photoList.length; i++) {
      let photo = photoList[i];
      if (photo.id) {
        imageIds.push(photo.id)
      } else {
        const response = await fileAPI.uploadFile(photo);
        imageIds.push({ directus_files_id: response.data.id })
      }
    }
    return imageIds;
  }







  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/owner">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/owner/communities">Communities</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/owner/communities/${id}/staff`}>Staff</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/owner/communities/${id}/staff/add`}>Add Staff</Link>
        </Breadcrumb.Item>

      </Breadcrumb>
      <PageHeader className="site-page-header" title="Add Staff" />


      <Row gutter={30}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Menu selectedKeys={["staff"]} mode="horizontal">
            <Menu.Item key="profile" >
              <Link to={`/owner/communities/${id}/profile`}>Profile</Link>
            </Menu.Item>
            <Menu.Item key="rooms">
              <Link to={`/owner/communities/${id}/rooms`}>Rooms</Link>
            </Menu.Item>
            <Menu.Item key="pricing">
              <Link to={`/owner/communities/${id}/pricing`}>Pricing</Link>
            </Menu.Item>
            <Menu.Item key="services-amenities" >
              <Link to={`/owner/communities/${id}/services-amenities`}>Services & Amenities</Link>
            </Menu.Item>
            <Menu.Item key="photos" >
              <Link to={`/owner/communities/${id}/photos`}>Photos</Link>
            </Menu.Item>
            <Menu.Item key="staff" >
              <Link to={`/owner/communities/${id}/staff`}>Staff</Link>
            </Menu.Item>
            <Menu.Item key="Documents" >
              <Link to={`/owner/communities/${id}/documents`}>Documents</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Form
            form={form}
            layout={"horizontal"}
            onFinish={handleSave}
          >
            <Card
              title="Basic Details"
            >
              <Form.Item
                {...formItemLayout}
                label="Staff Name "
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter Staff Name!",
                    whitespace: true,
                  },
                ]}
              >
                <TextArea
                  maxLength={255}

                  placeholder="Add Name"
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="Staff Phone" name="phone" rules={[
                {
                  required: true,
                  message: 'Please input valid number!',
                  pattern: /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/g,
                  // max: 14
                },
              ]}>
                <TextArea placeholder="Add Staff Phone" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="Staff Email" name="email" >
                <TextArea maxLength={255} type="email" placeholder="Add Staff Email" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="Start Date" name="start_date" rules={[
                {
                  required: true,
                  message: "Please enter valid date",
                }
              ]}>
                <DatePicker dateFormat={dateFormat} onChange={(date, dateString) => setDateStarted(dateString)} value={dateStarted && moment(dateStarted, dateFormat)} />
              </Form.Item>
              <Form.Item {...formItemLayout} label="Staff Title" name="title" >
                <Select >
                  {staffTitles.map(({ text, value }) =>
                    <Select.Option key={value} value={value}>{text}</Select.Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Credentials" name="credentials" >
                <Select >
                  {staffCredentials.map(({ text, value }) =>
                    <Select.Option key={value} value={value}>{text}</Select.Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Languages" name="languages" >
                <Select mode="multiple" >
                  {staffLanguages.map(({ text, value }) =>
                    <Select.Option key={value} value={value}>{text}</Select.Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Biography" name="biography" >
                <TextArea placeholder="Add Biography" />
              </Form.Item>
              {/* <Form.Item label="Status" name="status" >
                <Select  >
                  <Select.Option value="published">Published</Select.Option>
                  <Select.Option value="draft">Draft</Select.Option>
                </Select>
              </Form.Item> */}
            </Card>
            <Card
              title="Photos"
            >
              <UploadPhotos photoList={photoList} handelPhotoListChange={handelPhotoListChange} />
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
    createStaff: () => dispatch(createStaff()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(AddStaff);