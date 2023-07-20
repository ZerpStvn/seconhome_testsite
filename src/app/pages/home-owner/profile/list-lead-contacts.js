import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { listAllLeadContacts, updateLeadContact, } from "../../../redux/actions/lead-contact-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { notifyUser } from "../../../services/notification-service";
import { List, Divider, Row, Col, Button, PageHeader, Table, Tag, Space, Breadcrumb, Card, Descriptions, Form, Select, Input, } from "antd";
import { compose } from "redux";
import { EditOutlined } from "@ant-design/icons";
import { data } from "jquery";
import { humanize } from "../../../helpers/string-helper";
import { loadCurrentLoggedInUser, updateUser, } from "../../../redux/actions/user-actions";
import UploadDocuments from "../../../components/upload-documents";
import Config from "../../../config";
import fileAPI from "../../../redux/api/file-api";
import { update } from "lodash";
import userService from "../../../services/user-service";

const formatNumber = (e) => {
  if (e) {
      var x = e.toString().replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

  }
}

const ListLeadContact = ({
  leadContactList,
  leadContactListLoading,
  currentLoggedInUser,
  userUpdated,
}) => {
  const user = userService.getLoggedInUser();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [documentList, setdDocumentList] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(leadContactList);
  const columns = [
    {
      title: "Community",
      dataIndex: "home_name",
      key: "home_name",
      render: (homes, leadContact) => (
        <>
          {homes && homes.map((item, index) => {
            return item.homes_id && item.homes_id.name
          }).join(', ')}
        </>
        // <Space size="middle">

        //   <Link to={`/owner/communities/${leadContact.home_id}`}>{text}</Link>
        // </Space>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, leadContact) => (
        <Space size="middle">
          <Link to={`/owner/lead-contacts/${leadContact.key}`}>{humanize(text)}</Link>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, leadContact) => <Space size="middle">{text}</Space>,
    },

    {
      title: "Cell",
      dataIndex: "phone",
      key: "phone",
      render: (text, leadContact) => <Space size="middle">{formatNumber(text)}</Space>,
    },

    {
      title: "Job Title",
      dataIndex: "job_title",
      key: "job_title",
      render: (text) => <Space size="middle">{`${text}`}</Space>,
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (text) => (
    //     <Space>
    //       <Tag color={text == "published" ? "green" : "red"}>
    //         {humanize(text)}
    //       </Tag>
    //     </Space>
    //   ),
    // },
  ];

  useEffect(() => {
    if (
      !currentLoggedInUser ||
      !currentLoggedInUser.contract ||
      !currentLoggedInUser.contract.id ||
      userUpdated
    ) {
      dispatch(loadCurrentLoggedInUser({ fields: "*,contract.*" }));
    }

    setdDocumentList(
      currentLoggedInUser && currentLoggedInUser.contract
        ? [
          {
            uid: currentLoggedInUser.contract.id,
            id: currentLoggedInUser.contract.id,
            status: "done",
            url: `${Config.API}/assets/${currentLoggedInUser.contract.id}`,
            name: currentLoggedInUser.contract.filename_download,
          },
        ]
        : []
    );
    console.log(user, "user");
    dispatch(listAllLeadContacts({
      'fields': ["*", "homes.*", "homes.homes_id.*"], filter: {
        "user_created": {
          "_eq": user.id
        }
      }
    }));
    if (userUpdated) {
      setLoading(false);
    }

    return () => {
      console.log("Communities Unmounting");
    };
    // }, [currentLoggedInUser, userUpdated]);
  }, []);

  const handleSave = async (values) => {
    setLoading(true);
    var _contract = null;
    _contract = await getFilesArray(documentList);
    values.contract = _contract;
    await dispatch(updateUser(currentLoggedInUser.id, values));

    window.location.reload();
  };

  const handelDocumentChange = ({ fileList }) => {
    setdDocumentList(fileList);
  };

  const getFilesArray = async (fileList) => {
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

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/owner">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/owner/profile">Profile</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={30}>
        {/* {console.log(currentLoggedInUser, 'currentLoggedInUser')} */}
        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
          {currentLoggedInUser && (
            <Card
              title={`${currentLoggedInUser.first_name} ${currentLoggedInUser.last_name}`}
            >
              <Descriptions column={1}>
                <Descriptions.Item label="Email">
                  {currentLoggedInUser.email}
                </Descriptions.Item>
                <Descriptions.Item label="Partner Code">
                  {currentLoggedInUser.code}
                </Descriptions.Item>
              </Descriptions>

              <Form
                form={form}
                layout={"vertical"}
                onFinish={handleSave}
              // initialValues={currentLoggedInUser}
              >
                {/* {console.log(currentLoggedInUser, 'currentLoggedInUser')} */}
                {/* <Form.Item label="Contract">
                  <UploadDocuments
                    documentList={documentList}
                    handelDocumentListChange={handelDocumentChange}
                  />
                </Form.Item> */}
                <Form.Item name="contract_status" label="Contract Status">
                  {/* <Select disabled={true}>
                    <Select.Option key="pending" value="pending">
                      Pending
                    </Select.Option>
                    <Select.Option key="signed" value="signed">
                      Signed
                    </Select.Option>
                  </Select> */}
                  <Input disabled={true} defaultValue={humanize(currentLoggedInUser.contract_status)} />
                </Form.Item>
                <Form.Item name="description" label="Background">
                  <Input.TextArea placeholder="Tell us about you and your company. How did you get started? How do you stand a part from your competitors?" defaultValue={humanize(currentLoggedInUser.description)} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" loading={loading} disabled={loading} htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </Card>

          )}
          {currentLoggedInUser && (
            <Card
              title={`Billing Details`}
            >
              <Descriptions column={1}>
                <Descriptions.Item label="Name">
                  {currentLoggedInUser.first_name} {currentLoggedInUser.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {currentLoggedInUser.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {currentLoggedInUser.cell}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Col>
        <Col xs={24} sm={24} md={24} lg={14} xl={14}>
          <Card
            title="Lead Contacts"
            extra={
              <Button href={"/dashboard/owner/lead-contacts/add"}>
                Add Lead Contact
              </Button>
            }
          >
            <Table
              columns={columns}
              loading={leadContactListLoading}
              dataSource={leadContactList.map(
                ({
                  first_name,
                  last_name,
                  phone,
                  email,
                  // status,
                  id,
                  job_title,
                  homes

                }) => {
                  return {
                    name: first_name + " " + last_name,
                    phone,
                    email,
                    key: id,
                    // status,
                    job_title: !!job_title ? job_title : '',
                    home_name: homes && homes,
                    // home_id: homes && homes.home_id
                  };
                }
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

function mapStateToProps(state) {
  return {
    leadContactList: state.leadContact.leadContactList,
    leadContactListLoading: state.leadContact.leadContactListLoading,
    currentLoggedInUser: state.user.currentLoggedInUser,
    userUpdated: state.user.userUpdated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAllLeadContacts: () => dispatch(listAllLeadContacts()),
    updateLeadContact: () => dispatch(updateLeadContact()),
    loadCurrentLoggedInUser: () => dispatch(loadCurrentLoggedInUser()),
    updateUser: () => dispatch(updateUser()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ListLeadContact
);
