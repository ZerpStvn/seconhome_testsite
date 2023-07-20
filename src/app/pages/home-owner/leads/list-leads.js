import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { listAllLeads, updateLead, setLeadListLoading } from "../../../redux/actions/lead-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { notifyUser } from "../../../services/notification-service";
import { Row, Col, Table, Space, Breadcrumb, Tooltip } from "antd";
import { compose } from "redux";
import { FilterFilled } from '@ant-design/icons';
import { leadApprovalOptions, leadStatusOptions, residentMoveTimeFrameOptions } from "../../../constants/defaultValues";
import { getColumnSearchProps } from "../../../helpers/columnSearchProps";
import moment from "moment";
import LeadApproval from "./lead-approval";

const ListCommunities = ({ leadList, leadListLoading, leadMessage, leadUpdated, leadListMeta }) => {

  const [pagination, setPagination] = useState({
    pageSize: 5,
    current: 1,
  });
  const [sort, setSort] = useState([]);
  const [filters, setFilters] = useState({});
  const dispatch = useDispatch();
  const handelApprovalChange = (values, leadId) => {
    dispatch(updateLead(leadId, values));
  }
  useEffect(() => {
    leadListLoading && dispatch(listAllLeads({ fields: ['*', "client.*", "client.primary_resident.*", "client.second_resident.*", "home.*"], filter: filters, sort, page: pagination.current, limit: pagination.pageSize, meta: "*" }));
    leadListMeta && setPagination({ ...pagination, total: leadListMeta.filter_count })
    if (leadUpdated) {
      notifyUser(leadMessage, "success");
    }
    dispatch({
      type: 'RESET'
    })
    return () => {
      console.log("Communities Unmounting");
    };
  }, [leadUpdated, leadMessage, leadListLoading]);

  const handelTableChange = ({ current }, tableFilters, sorter) => {
    if (sorter && sorter.field) {
      if (sorter.order == "ascend") {
        setSort(sorter.field);
      } else {
        setSort("-" + sorter.field);
      }
    }

    let _filters = {};


    Object.entries(tableFilters).forEach(([key, value]) => {
      let orFilter = [];
      if (value) {
        switch (key) {
          case "approval":
            _filters.approval = { _in: value }
            break;
          case "status":
            _filters.status = { _in: value }
            break;

          case "budget":
            orFilter = [];
            value.map((data) => { orFilter.push({ budget: { _eq: data } }) })
            _filters._or = orFilter;
            break;

          case "client_name":
            orFilter = [];
            value.map((data) => { orFilter.push({ clients: { name: { _contains: data } } }) })
            _filters._or = orFilter;
            break;
          case "resident_name":
            orFilter = [];
            value.map((data) => { orFilter.push({ residents: { name: { _contains: data } } }) })
            _filters._or = orFilter;
            break;

          default:
            break;
        }
      } else {

      }

    });
    setFilters({ ..._filters });
    setPagination({ ...pagination, current });
    dispatch(setLeadListLoading(true));
  }

  const getTimeFrameValue = (client) => {
    let timeFrameValue = ""
    if (client) {
      if (client.primary_resident) {
        residentMoveTimeFrameOptions.forEach(Item => {
          if (Item.value == client.primary_resident.move_time_frame) {
            timeFrameValue = Item.text
          }
        })
      }
      if (client.second_resident) {
        residentMoveTimeFrameOptions.forEach(Item => {
          if (Item.value == client.second_resident.move_time_frame) {
            timeFrameValue = Item.text
          }
        })
      }
    }
    return timeFrameValue
  }


  const columns = [
    {
      title: 'Client Name',
      dataIndex: 'client_name',
      key: 'client_name',
      //...getColumnSearchProps("client_name"),
      render: (text, lead) => (
        <Space size="middle">
          <Link to={`/owner/leads/${lead.key}`}>{text}</Link>

        </Space>
      )
    },

    {
      title: 'Resident Name',
      dataIndex: 'resident_name',
      key: 'resident_name',
     // ...getColumnSearchProps("resident_name"),
      render: (text, lead) => (
        <Space size="middle">
          <Link to={`/owner/leads/${lead.key}/resident`}>{text}</Link>

        </Space>
      )
    },
    {
      title: 'Second Resident Name',
      dataIndex: 'second_resident_name',
      key: 'resident_name',
     // ...getColumnSearchProps("resident_name"),
      render: (text, lead) => (
        <Space size="middle">
          <Link to={`/owner/leads/${lead.key}/resident`}>{text}</Link>

        </Space>
      )
    },
    {
      title: 'Community',
      dataIndex: 'home_name',
      key: 'home_name',
      //...getColumnSearchProps("home_name"),
      render: (text, lead) => (
        <Space size="middle">
          <Link to={`/owner/communities/${lead.home_id}`}>{text}</Link>

        </Space>
      )
    },


    {
      title: 'Date Sent',
      dataIndex: 'date_created',
      key: 'date_created',
      //sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text) => {
        var date = new Date(text);
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return (
          <Space size="middle">
            {`${month}/${day}/${year}`}
          </Space>
        )
      }

    },
    {
      title: 'Time Sent',
      dataIndex: 'time_sent',
      key: 'time_sent',
      //sorter: false,
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text) => {
        var date = new Date(text);
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return (
          <Space size="middle">
            {moment(text).format('LT')}
          </Space>
        )
      }

    },
    // {
    //   title: 'Budget',
    //   dataIndex: 'budget',
    //   key: 'budget',
    //   sorter: true,
    //   sortDirections: ['ascend', 'descend', 'ascend'],
    //   ...getColumnSearchProps("budget"),
    //   render: (text) => (
    //     <Space size="middle">
    //       {`$${text !== null ? text : '0'}`}
    //     </Space>
    //   )
    // },
    {
      title: 'Budget Notes',
      dataIndex: 'budget_notes',
      key: 'budget_notes',
      render: (text) => (
        <Space size="middle">
          {text && text}
        </Space>
      )
    },
    {
      title: 'Approval',
      dataIndex: 'approval',
      key: 'approval',
      style: { width: "130px" },
      //sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      //filters: leadApprovalOptions,
      //filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
      render: (value, lead) => {
        return <LeadApproval value={value} lead={lead} handelApprovalChange={handelApprovalChange} />
        /*const [form] = Form.useForm();
        const [approval, setApproval] = useState(value);
        const [deniedRreason, setDeniedReason] = useState(lead.denied_reason);
        const handelSubmit = (values) => {
          if (!values.denied_reason) {
            values.denied_reason = null;
          }
          handelApprovalChange(values, lead.key)
        }
        const overlay = (
          <Form key={lead.key} form={form} layout={"vertical"} initialValues={lead} onFinish={handelSubmit} >
            <Form.Item label="Approval" name="approval">
              <Select style={{ width: "180px" }} onChange={setApproval}>
                {leadApprovalOptions.map((option) => {
                  return (<Select.Option value={option.value}>{option.text}</Select.Option>)
                })}
              </Select>
            </Form.Item>
            {(approval == "denied_other") &&
              <Form.Item label="Reason" name="denied_reason">
                <TextArea onChange={(e) => { setDeniedReason(e.target.value) }} />
              </Form.Item>
            }

            <Form.Item>
              <Button type="primary" htmlType="submit"> Save </Button>
            </Form.Item>

          </Form>
        );
        return (
          <Popover placement="bottomLeft" content={overlay} trigger="click">
            <Tag>
              <a onClick={e => e.preventDefault()}>
                {humanize(value)} <DownOutlined />
              </a>

            </Tag>
          </Popover>
        )*/
      }
    },
    {
      title: 'Move Time Frame',
      dataIndex: 'move_time_frame',
      key: 'move_time_frame',
      //sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      // filters: leadStatusOptions,
      // filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
      render: (text) => (
        <Space >
          {getTimeFrameValue(text)}
        </Space>
      )
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   sorter: true,
    //   sortDirections: ['ascend', 'descend', 'ascend'],
    //   filters: leadStatusOptions,
    //   filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
    //   render: (text) => (
    //     <Space >
    //       {humanize(text)}
    //     </Space>
    //   )
    // },


  ];

  const getBudgetNotesValue = (editLead) => {
    let budgetNotesValue = ""
    if (editLead) {
      if (editLead.primary_resident) {
        budgetNotesValue = editLead.primary_resident.budget_notes
      }
      else if (editLead.second_resident) {
        budgetNotesValue = editLead.second_resident.budget_notes
      }
      else {
        budgetNotesValue = ""
      }
    }
    return budgetNotesValue
  }


  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/owner">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/owner/leads">Leads</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={30}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table
            columns={columns}
            loading={leadListLoading}
            dataSource={leadList.map(({ client, budget, budget_notes, approval, status, id, denied_reason, date_created, home }) => {
              console.log(client, 'client');
              return { client_name: client ? client.name : "", resident_name: (client && client.primary_resident) ? client.primary_resident.name : "", second_resident_name: (client && client.second_resident) ? client.second_resident.name : "", budget, budget_notes: getBudgetNotesValue(client), approval, key: id, denied_reason, date_created, home_name: home && home.name, home_id: home.id, time_sent: date_created, move_time_frame: client };
            })}
            pagination={pagination}
            onChange={handelTableChange}
          />
        </Col>
      </Row>
    </>
  );
};

function mapStateToProps(state) {
  return {
    leadList: state.lead.leadList,
    leadListLoading: state.lead.leadListLoading,
    leadListMeta: state.lead.leadListMeta,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAllLeads: () => dispatch(listAllLeads()),
    updateLead: () => dispatch(updateLead()),
    setLeadListLoading: () => dispatch(setLeadListLoading()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(ListCommunities);
