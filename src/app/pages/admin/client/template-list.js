import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import Config from "../../../config";
import htmlToDraft from "html-to-draftjs";
import API from "../../../redux/api/lead-client-api";
import {
  Tooltip,
  Space,
  Tabs,
  Popconfirm,
  message,
  Collapse,
  Form,
  Input,
  Select,
  Table,
  Checkbox,
  Button,
  Card,
  Row,
  Col,
  Spin,
  List,
  Avatar,
} from "antd";
import Icon from "@ant-design/icons";
import { PhoneOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EditSvg } from "../../../components/shared/svg/edit";
import { EyeSvg } from "../../../components/shared/svg/eye";
import { PenSvg } from "../../../components/shared/svg/pen";
import { humanize } from "../../../helpers/string-helper";
import {
  listAllLikedLeadClients,
  setLeadClientListLoading,
} from "../../../redux/actions/lead-client-actions";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TemplateList = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  const deleteTemplate = async (Id) => {
    setLoading(true);
    let Response = await API.deleteEmailTemplate(Id);
    console.log("Response ===>", Response);
  };

  useEffect(() => {
    if (loading) {
      API.getEmailTemplate().then((Data) => {
        console.log(Data);
        let TempData = [];
        Data.data.forEach((Item, Index) => {
          console.log(Item, Index);
          TempData.push({
            key: Index,
            name: humanize(Item.name),
            subject: Item.subject,
            attachment: `${Config.API}/assets/${Item.attachment}`,
            status: humanize(Item.status),
            action: (
              <>
                <Space size="middle">
                  <Tooltip title="Edit">
                    <Link to={`/admin/email_template/${Item.id}`}>
                      <EditOutlined />
                    </Link>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Popconfirm
                      title="Are you sure want to delete?"
                      onConfirm={() => deleteTemplate(Item.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Link onClick={() => { }}>
                        <DeleteOutlined />
                      </Link>
                    </Popconfirm>
                  </Tooltip>
                </Space>
              </>
            ),
          });
        });
        setTableData(TempData);
        setLoading(false);
      });
    }
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Attachment",
      dataIndex: "attachment",
      key: "attachment",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <React.Fragment>
      <div className="admin-dashboard email-box">
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          className="admin-countbox"
        >
          <Col xs={24} sm={24} lg={24}>
            <Space className="btn-group-right">
              <Button href={"/dashboard/admin/email_template/add"}>
                Add Email Template
              </Button>
            </Space>
          </Col>
          <Col xs={24} sm={24} lg={24}>
            <Table loading={loading} dataSource={tableData} columns={columns} />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateList);
