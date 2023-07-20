import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { List, Divider, Row, Col, Button, Tabs, Form, Input, Card, Image, Select, Switch, Skeleton, Breadcrumb, PageHeader, InputNumber, Menu, Tooltip } from "antd";
import { compose } from "redux";
import { identity } from "ramda";
import Config from "../../../../../config";
import { getRoomById, createRoom, updateRoom } from "../../../../../redux/actions/room-actions";
import { roomCareTypes, bathroomTypes, financialTypes, roomCareTypesOptions, roomAmenitiesOptions, roomTypesOptions } from "../../../../../constants/defaultValues";
import { getNumberWithOrdinal } from "../../../../../helpers/number-helper";
import UploadPhotos from "../../../../../components/upload-photos";
import UploadDocuments from "../../../../../components/upload-documents";
import fileAPI from "../../../../../redux/api/file-api";
import API from "../../../../../redux/api/room-api";
import UserService from "../../../../../services/user-service";
import { InfoCircleOutlined } from "@ant-design/icons";
import { faL } from "@fortawesome/free-solid-svg-icons";


const { TabPane } = Tabs;
const { TextArea } = Input;
const { Meta } = Card;

const roomCareOptions = [];
const floorLevelOptions = []
const bathroomOptions = [];
const financialOptions = [];
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const formSubItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
{
  Object.entries(roomCareTypes).forEach(([key, value]) =>
    roomCareOptions.push(
      <Select.Option key={key} value={key}>{value}</Select.Option>
    )
  );
}

{
  [...Array(21).keys()]
    .map((value) => {
      if (value > 0) {
        floorLevelOptions.push(
          <Select.Option key={value} value={value}>{`${getNumberWithOrdinal(value)} Floor`}</Select.Option>
        )
      }
      /* else {
        floorLevelOptions.push(
          <Select.Option key={value} value={value}>Ground Floor</Select.Option>
        )
      }*/
    })
}

{
  Object.entries(bathroomTypes).forEach(([key, value]) =>
    bathroomOptions.push(
      <Select.Option key={key} value={key}>{value}</Select.Option>
    )
  );
}
{
  Object.entries(financialTypes).forEach(([key, value]) =>
    financialOptions.push(
      <Select.Option key={key} value={key}>{value}</Select.Option>
    )
  );
}




const AddRoom = ({ addRoom, history }) => {
  const { id } = useParams();
  const [non_ambulatory, setNonAmbulatory] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [photoList, setPhotoList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [profilePhotoList, setProfilePhotoList] = useState([]);
  const user = UserService.getAdminUser();
  const [buttonLoading, setButtonLoading] = useState(false);


  useEffect(() => {

    return () => {
      console.log("Edit Room Unmounting");
    };
  }, []);

  const handleSave = async (values) => {
    setButtonLoading(true);
    values.non_ambulatory = non_ambulatory;
    values.home = id;
    const photos = await getFilesArray(photoList);
    values.photos = photos;

    const documents = await getFilesArray(documentList);
    values.documents = documents;
    const profile = await getProfilePhotoId(profilePhotoList)
    values.profile = profile
    // const response = await dispatch(createRoom(values))
    await API.createRoom(values).then(async (Data) => {
      values.user_created = user.id;
      await dispatch(updateRoom(Data.data.id, values));
      history.push("/admin/partners/communities/" + id + "/rooms")
    });
    // history.push("/admin/partners/communities/" + id + "/rooms")
  };

  const handelPhotoListChange = ({ fileList, file }) => {
    setPhotoList(fileList)
  }
  const handelDocumentListChange = ({ fileList, file }) => {
    setDocumentList(fileList)
  }
  const handelProfilePhotoListChange = ({ fileList, file }) => {
    setProfilePhotoList(fileList)
  }

  const getProfilePhotoId = async (fileList) => {
    if (fileList.length) {
      let file = fileList[0];
      if (file.id) {
        return file.id;
      } else {
        const response = await fileAPI.uploadFile(file);
        return response.data.id
      }
    }
  }





  const getFilesArray = async (fileList) => {
    let fileIds = [];
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      if (file.id) {
        fileIds.push(file.id)
      } else {
        const response = await fileAPI.uploadFile(file);
        fileIds.push({ directus_files_id: response.data.id })
      }
    }
    return fileIds;
  }





  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/partners">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/partners/communities">Communities</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/admin/partners/communities/${id}/rooms`}>Rooms</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/admin/partners/communities/${id}/rooms/add`}>Add Room</Link>
        </Breadcrumb.Item>

      </Breadcrumb>
      <PageHeader className="site-page-header" title="Add Room" />


      <Row gutter={30}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <Menu selectedKeys={["rooms"]} mode="horizontal">
            <Menu.Item key="profile" >
              <Link to={`/admin/partners/communities/${id}/profile`}>Profile</Link>
            </Menu.Item>
            <Menu.Item key="rooms">
              <Link to={`/admin/partners/communities/${id}/rooms`}>Rooms</Link>
            </Menu.Item>
            <Menu.Item key="pricing">
              <Link to={`/admin/partners/communities/${id}/pricing`}>Pricing</Link>
            </Menu.Item>
            <Menu.Item key="services-amenities" >
              <Link to={`/admin/partners/communities/${id}/services-amenities`}>Services & Amenities</Link>
            </Menu.Item>
            <Menu.Item key="photos" >
              <Link to={`/admin/partners/communities/${id}/photos`}>Photos</Link>
            </Menu.Item>
            <Menu.Item key="staff" >
              <Link to={`/admin/partners/communities/${id}/staff`}>Staff</Link>
            </Menu.Item>
            <Menu.Item key="Documents" >
              <Link to={`/admin/partners/communities/${id}/documents`}>Documents</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <Form className="label_width"
            form={form}
            layout={"horizontal"}
            onFinish={handleSave}
          >
            <Card
              title="Basic Details"
            >

              <Form.Item
                {...formItemLayout}
                label="Room Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter Room Name!",
                    whitespace: true,
                  },
                ]}
                tooltip="Board and care room? Use the room number used for licensing."
              >

                <Input
                  maxLength={255}

                  placeholder="Add Name"
                />
              </Form.Item>
              <Form.Item   {...formItemLayout} label="Room Type" name="type" >
                <Select  >
                  {roomTypesOptions.map(({ text, value }) => <Select.Option value={value} key={value}> {text}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Size (Sq. Ft.)" name="size" >
                <InputNumber />
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Base Rate" name="base_rate" >
                <InputNumber
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Room Care Type" name="room_care_type" >
                <Select >
                  {roomCareTypesOptions.map(({ text, value }) => <Select.Option value={value} key={value}> {text}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Bathroom Type" name="bathroom_type" >
                <Select  >
                  {bathroomOptions}
                </Select>
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Financial Type" name="financial_type" >
                <Select  >
                  {financialOptions}
                </Select>
              </Form.Item>
              <Form.Item  {...formItemLayout} label="Floor Level" name="floor_level" >
                <Select  >
                  {floorLevelOptions}
                </Select>
              </Form.Item>

              <Form.Item  {...formItemLayout} label="Non Ambulatory" name="non_ambulatory" >
                <Switch checkedChildren="Yes" unCheckedChildren="No" checked={non_ambulatory} onChange={(checked) => setNonAmbulatory(checked)} />
              </Form.Item>

              <Form.Item  {...formItemLayout} label="Room Amenities" name="room_amenities" >
                <Select mode="multiple" >
                  {roomAmenitiesOptions.map(({ text, value }) => <Select.Option value={value} key={value}> {text}</Select.Option>)}
                </Select>
              </Form.Item>
              {/* <Form.Item label="Status" name="status" >
                <Select  >
                  <Select.Option value="published">Published</Select.Option>
                  <Select.Option value="draft">Draft</Select.Option>
                </Select>
              </Form.Item> */}

            </Card>
            <Card title={
              <>
                Profile Photo{" "}
                <Tooltip title="Image ratio should be in 600x400">
                  <InfoCircleOutlined />
                </Tooltip>
              </>
            }>
              <UploadPhotos multiple={false} photoList={profilePhotoList} handelPhotoListChange={handelProfilePhotoListChange} />
            </Card>
            <Card title={
              <>
                Photos{" "}
                <Tooltip title="Image ratio should be in 600x400">
                  <InfoCircleOutlined />
                </Tooltip>
              </>
            }>
              <UploadPhotos multiple photoList={photoList} handelPhotoListChange={handelPhotoListChange} />
            </Card>
            <Card
              title="Floor Plans"
            >
              <UploadDocuments documentList={documentList} handelDocumentListChange={handelDocumentListChange} />
            </Card>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={buttonLoading}>
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
    addRoom: state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createRoom: () => dispatch(createRoom()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(AddRoom);
