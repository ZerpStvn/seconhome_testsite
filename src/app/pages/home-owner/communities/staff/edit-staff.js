import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Button, Form, Input, Card, Select, Skeleton, Breadcrumb, PageHeader, DatePicker, Menu } from "antd";
import { compose } from "redux";
import Config from "../../../../config";
import { getStaffById, updateStaff } from "../../../../redux/actions/staff-actions";
import { staffTitles, staffCredentials, staffLanguages } from "../../../../constants/defaultValues";
import moment from 'moment';
import UploadPhotos from "../../../../components/upload-photos";
import fileAPI from "../../../../redux/api/file-api";
import { humanize } from "../../../../helpers/string-helper";

const { TextArea } = Input;
const { Meta } = Card;

const viewDateFormat = 'MMM DD, YYYY';
const dateFormat = 'YYYY-MM-DD';





const EditStaff = ({ editStaff, editStaffLoading, history }) => {
  const { id, staffId } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [photoList, setPhotoList] = useState([]);
  const [dateStarted, setDateStarted] = useState('');


  useEffect(() => {
    if (!editStaff) {
      dispatch(getStaffById(staffId, { fields: "*,photos.*,photos.directus_files_id.*" }));
    }

    let _photoList = [];

    editStaff && editStaff.photos.map(({ id, directus_files_id }) => {
      _photoList.push({
        uid: directus_files_id.id,
        id: id,
        status: 'done',
        url: `${Config.API}/assets/${directus_files_id.id}`,
        name: directus_files_id.filename_download
      })
    })

    editStaff && setDateStarted(editStaff.start_date)
    setPhotoList(_photoList)
    return () => {
      console.log("Edit Staff Unmounting");
    };
  }, [editStaffLoading]);

  const handleSave = async (values) => {
    const photos = await getPhotosArray();
    values.photos = photos;
    values.start_date = dateStarted;
    dispatch(updateStaff(staffId, values))
    history.push("/owner/communities/" + id + "/staff")
  };


  const handelPhotoListChange = ({ fileList, file }) => {
    console.log(fileList, file, photoList)
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
        {editStaff && (
          <Breadcrumb.Item>
            <Link to={`/owner/communities/${id}/staff/${staffId}`}>{`${humanize(editStaff.name)}`}</Link>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      <PageHeader className="site-page-header" title={editStaff && `${humanize(editStaff.name)}`} />
      <Skeleton loading={editStaffLoading}>
        {editStaff && (

          <Row gutter={30}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>

              <Card
                hoverable
                cover={editStaff.photos[0] && <img src={`${Config.API}/assets/${editStaff.photos[0].directus_files_id.id}`} />}
              >
                <Meta title={editStaff.name} />
              </Card>
            </Col>
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

              <Form
                form={form}
                layout={"horizontal"}
                onFinish={handleSave}
                // initialValues={editStaff}
                initialValues={{ ...editStaff, start_date: moment(editStaff.start_date) }}

              >
                <Card
                  title="Basic Details"
                >
                  <Form.Item
                    label="Staff Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Staff Name!",
                        whitespace: true,
                      },
                    ]}
                  >
                    <Input
                      maxLength={255}

                      placeholder="Add Name"
                    />
                  </Form.Item>
                  <Form.Item label="Staff Phone" name="phone" rules={[
                    {
                      required: true,
                      pattern: /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/g,
                      message: 'Please input valid number!',
                      // max: 14
                    },
                  ]}>
                    <Input placeholder="Add Staff Phone" />
                  </Form.Item>
                  <Form.Item label="Staff Email" name="email" >
                    <Input maxLength={255} type="email" placeholder="Add Staff Email" />
                  </Form.Item>
                  <Form.Item label="Start Date" name="start_date" rules={[
                    {
                      required: true,
                      message: "Please enter valid date",
                    }
                  ]}>
                    <DatePicker format={viewDateFormat} onChange={(date, dateString) => setDateStarted(date.format(dateFormat))} value={dateStarted && moment(dateStarted, dateFormat)} />
                  </Form.Item>
                  <Form.Item label="Staff Title" name="title" >
                    <Select >
                      {staffTitles.map(({ text, value }) =>
                        <Select.Option key={value} value={value}>{text}</Select.Option>
                      )}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Credentials" name="credentials" >
                    <Select >
                      {staffCredentials.map(({ text, value }) =>
                        <Select.Option key={value} value={value}>{text}</Select.Option>
                      )}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Languages" name="languages" >
                    <Select mode="multiple" >
                      {staffLanguages.map(({ text, value }) =>
                        <Select.Option key={value} value={value}>{text}</Select.Option>
                      )}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Biography" name="biography" >
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
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>


        )}
      </Skeleton>




    </>
  );
};

function mapStateToProps(state) {
  return {
    editStaff: state.staff.editStaff,
    editStaffLoading: state.staff.editStaffLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getStaffById: () => dispatch(getStaffById()),
    updateStaff: () => dispatch(updateStaff()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(EditStaff);
