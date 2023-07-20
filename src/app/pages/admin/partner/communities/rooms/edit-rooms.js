import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { List, Divider, Row, Col, Button, Tabs, Form, Input, Card, Image, Select, Switch, Skeleton, Breadcrumb, PageHeader, InputNumber, Menu, Spin, Tooltip, } from "antd";
import { compose } from "redux";
import { identity } from "ramda";
import Config from "../../../../../config";
import { getRoomById, updateRoom, cloneRoom, } from "../../../../../redux/actions/room-actions";
import { roomTypesOptions, bathroomTypes, financialTypes, roomCareTypesOptions, roomAmenitiesOptions, } from "../../../../../constants/defaultValues";
import { getNumberWithOrdinal } from "../../../../../helpers/number-helper";
import UploadPhotos from "../../../../../components/upload-photos";
import UploadDocuments from "../../../../../components/upload-documents";
import fileAPI from "../../../../../redux/api/file-api";
import { InfoCircleOutlined } from "@ant-design/icons";
import { humanize } from "../../../../../helpers/string-helper";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Meta } = Card;

const floorLevelOptions = [];
const bathroomOptions = [];
const financialOptions = [];

{
  [...Array(21).keys()].map((value) => {
    if (value > 0) {
      floorLevelOptions.push(
        <Select.Option key={value} value={value}>{`${getNumberWithOrdinal(
          value
        )} Floor`}</Select.Option>
      );
    }
  });
}

{
  Object.entries(bathroomTypes).forEach(([key, value]) =>
    bathroomOptions.push(
      <Select.Option key={key} value={key}>
        {value}
      </Select.Option>
    )
  );
}
{
  Object.entries(financialTypes).forEach(([key, value]) =>
    financialOptions.push(
      <Select.Option key={key} value={key}>
        {value}
      </Select.Option>
    )
  );
}

const EditRoom = ({ editRoom, editRoomLoading, history }) => {
  const { id, roomId } = useParams();
  const [non_ambulatory, setNonAmbulatory] = useState(true);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [photoList, setPhotoList] = useState([]);
  const [typeValue, setTypeValue] = useState("");
  const [profilePhotoList, setProfilePhotoList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [loading, setLoading] = useState(editRoomLoading);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    dispatch(
      getRoomById(roomId, {
        fields:
          "*,photos.*,photos.directus_files_id.*,documents.*,documents.directus_files_id.*,profile.*",
      })
    );

    if (editRoom) {
      if (!(!!editRoom.room_amenities)) {
        editRoom.room_amenities = [];
      }
      setTypeValue(editRoom.type);
      form.setFieldsValue(editRoom);
      setNonAmbulatory(editRoom.non_ambulatory);
      let _photoList = [];
      editRoom.photos.map(({ id, directus_files_id }) => {
        _photoList.push({
          uid: directus_files_id.id,
          id: id,
          status: "done",
          url: `${Config.API}/assets/${directus_files_id.id}`,
          name: directus_files_id.filename_download,
        });
      });

      let _documentList = [];
      editRoom.documents.map(({ id, directus_files_id }) => {
        _documentList.push({
          uid: directus_files_id.id,
          id: id,
          name: directus_files_id.filename_download,
          type: directus_files_id.type,
        });
      });

      setPhotoList(_photoList);
      setDocumentList(_documentList);
      setProfilePhotoList(
        editRoom.profile
          ? [
            {
              uid: editRoom.profile.id,
              id: editRoom.profile.id,
              name: editRoom.profile.filename_download,
              status: "done",
              url: `${Config.API}/assets/${editRoom.profile.id}`,
            },
          ]
          : []
      );
      setLoading(editRoomLoading);
    }

    return () => {
      console.log("Edit Room Unmounting");
    };
  }, [editRoomLoading]);

  const handleSave = async (values) => {
    setButtonLoading(true);
    values.non_ambulatory = non_ambulatory;
    const photos = await getFilesArray(photoList);
    values.photos = photos;

    const documents = await getFilesArray(documentList);
    values.documents = documents;
    const profile = await getProfilePhotoId(profilePhotoList);
    values.profile = profile;
    if (typeValue !== values.type) {
      values.availability = "no"
    }
    const response = await dispatch(updateRoom(roomId, values));
    // console.log(values, 'values');
    history.push("/admin/partners/communities/" + id + "/rooms");
  };

  const handelPhotoListChange = ({ fileList, file }) => {
    setPhotoList(fileList);
  };
  const handelProfilePhotoListChange = ({ fileList, file }) => {
    setProfilePhotoList(fileList);
  };
  const handelDocumentListChange = ({ fileList, file }) => {
    // console.log(file);
    setDocumentList(fileList);
  };

  const getFilesArray = async (fileList) => {
    let fileIds = [];
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      if (file.id) {
        fileIds.push(file.id);
      } else {
        const response = await fileAPI.uploadFile(file);
        fileIds.push({ directus_files_id: response.data.id });
      }
    }
    return fileIds;
  };

  const getProfilePhotoId = async (fileList) => {
    if (fileList.length) {
      let file = fileList[0];
      if (file.id) {
        return file.id;
      } else {
        const response = await fileAPI.uploadFile(file);
        return response.data.id;
      }
    }
  };

  const onCloneRoomClick = (roomId) => {
    setLoading(true);
    dispatch(cloneRoom(roomId));
    history.push("/admin/partners/communities/" + id + "/rooms");
  };

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
        {editRoom && (
          <Breadcrumb.Item>
            <Link
              to={`/admin/partners/communities/${id}/rooms/${roomId}`}
            >{`${humanize(editRoom.name)}`}</Link>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      <PageHeader
        className="site-page-header"
        title={editRoom && `${humanize(editRoom.name)}`}
        extra={
          <>
            <Button
              disabled={loading}
              onClick={() => onCloneRoomClick(editRoom.id)}
            >
              Clone Room
            </Button>
            <Button

              onClick={() => form.submit()}
            >
              Save
            </Button>
          </>
        }
      />
      <Skeleton loading={loading}>
        {editRoom && (
          <Row gutter={30}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Card
                hoverable
                cover={
                  editRoom.profile && (
                    <img src={`${Config.API}/assets/${editRoom.profile.id}`} />
                  )
                }
              >
                <Meta title={humanize(editRoom.name)} />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <Menu selectedKeys={["rooms"]} mode="horizontal">
                <Menu.Item key="profile">
                  <Link to={`/admin/partners/communities/${id}/profile`}>Profile</Link>
                </Menu.Item>
                <Menu.Item key="rooms">
                  <Link to={`/admin/partners/communities/${id}/rooms`}>Rooms</Link>
                </Menu.Item>
                <Menu.Item key="pricing">
                  <Link to={`/admin/partners/communities/${id}/pricing`}>Pricing</Link>
                </Menu.Item>
                <Menu.Item key="services-amenities">
                  <Link to={`/admin/partners/communities/${id}/services-amenities`}>
                    Services & Amenities
                  </Link>
                </Menu.Item>
                <Menu.Item key="photos">
                  <Link to={`/admin/partners/communities/${id}/photos`}>Photos</Link>
                </Menu.Item>
                <Menu.Item key="staff">
                  <Link to={`/admin/partners/communities/${id}/staff`}>Staff</Link>
                </Menu.Item>
                <Menu.Item key="Documents">
                  <Link to={`/admin/partners/communities/${id}/documents`}>
                    Documents
                  </Link>
                </Menu.Item>
              </Menu>
              <Form form={form} layout={"horizontal"} onFinish={handleSave}>
                <Card title="Basic Details">
                  <Form.Item
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
                    <Input maxLength={255} placeholder="Add Name" />
                  </Form.Item>
                  <Form.Item label="Room Type" name="type">
                    <Select>
                      {roomTypesOptions.map(({ text, value }) => (
                        <Select.Option value={value} key={value}>
                          {" "}
                          {text}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Size (Sq. Ft.)" name="size">
                    <InputNumber />
                  </Form.Item>
                  <Form.Item label="Base Rate" name="base_rate">
                    <InputNumber
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                  <Form.Item label="Room Care Type" name="room_care_type">
                    <Select>
                      {roomCareTypesOptions.map(({ text, value }) => (
                        <Select.Option value={value} key={value}>
                          {" "}
                          {text}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Bathroom Type" name="bathroom_type">
                    <Select>{bathroomOptions}</Select>
                  </Form.Item>
                  <Form.Item label="Financial Type" name="financial_type">
                    <Select>{financialOptions}</Select>
                  </Form.Item>
                  <Form.Item label="Floor Level" name="floor_level">
                    <Select>{floorLevelOptions}</Select>
                  </Form.Item>

                  <Form.Item label="Non Ambulatory" name="non_ambulatory">
                    <Switch
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      checked={non_ambulatory}
                      onChange={(checked) => setNonAmbulatory(checked)}
                    />
                  </Form.Item>

                  <Form.Item label="Room Amenities" name="room_amenities">
                    <Select mode="multiple">
                      {roomAmenitiesOptions.map(({ text, value }) => (
                        <Select.Option value={value} key={value}>
                          {" "}
                          {text}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* <Form.Item label="Status" name="status">
                    <Select>
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
                  <UploadPhotos
                    multiple={false}
                    photoList={profilePhotoList}
                    handelPhotoListChange={handelProfilePhotoListChange}
                  />
                </Card>
                <Card title={
                  <>
                    Photos{" "}
                    <Tooltip title="Image ratio should be in 600x400">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </>
                }>
                  <UploadPhotos
                    multiple
                    photoList={photoList}
                    handelPhotoListChange={handelPhotoListChange}
                  />
                </Card>
                <Card title="Floor Plans">
                  <UploadDocuments
                    documentList={documentList}
                    handelDocumentListChange={handelDocumentListChange}
                  />
                </Card>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={buttonLoading}>
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
    editRoom: state.room.editRoom,
    editRoomLoading: state.room.editRoomLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRoomById: () => dispatch(getRoomById()),
    updateRoom: () => dispatch(updateRoom()),
    cloneRoom: () => dispatch(cloneRoom()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(EditRoom);
