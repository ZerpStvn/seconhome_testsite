import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteHome, listAll, setHomeListLoading } from "../../../redux/actions/home-actions";

import { CopyOutlined, DeleteOutlined, EditOutlined, FilterFilled } from "@ant-design/icons";
import { Breadcrumb, Button, Col, Popconfirm, Popover, Row, Space, Table, Tooltip } from "antd";
import { compose } from "redux";
import { humanize } from "../../../helpers/string-helper";
import { notifyUser } from "../../../services/notification-service";
import userService from "../../../services/user-service";
import GetClonButtonContent from "./clone-community";

const ListCommunities = ({ homeList, homeListLoading, homeMessage, homeUpdated, homeListMeta, }) => {
  const user = userService.getLoggedInUser();
  const [pagination, setPagination] = useState({
    pageSize: 15,
    current: 1,
  });
  const [sort, setSort] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(homeListLoading);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'RESET'
    })
  }, []);
  useEffect(() => {
    homeListLoading &&
      dispatch(
        listAll({
          filter: filters,
          sort,
          page: pagination.current,
          limit: pagination.pageSize,
          meta: "*",
        })
      );
    homeListMeta &&
      setPagination({ ...pagination, total: homeListMeta.filter_count });
    if (homeUpdated) {
      notifyUser(homeMessage, "success");
    }
    setLoading(homeListLoading);
    return () => {
      console.log("Communities Unmounting");
    };
  }, [homeUpdated, homeMessage, homeListLoading]);

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
          case "name":
            orFilter = [];
            value.map((data) => {
              orFilter.push({ name: { _contains: data } });
            });
            _filters._or = orFilter;
            break;
          case "address_line_1":
            orFilter = [];
            value.map((data) => {
              orFilter.push({ address_line_1: { _contains: data } });
            });
            _filters._or = orFilter;
            break;
          case "city":
            orFilter = [];
            value.map((data) => {
              orFilter.push({ city: { _contains: data } });
            });
            _filters._or = orFilter;
            break;
          case "state":
            orFilter = [];
            value.map((data) => {
              orFilter.push({ state: { _contains: data } });
            });
            _filters._or = orFilter;
            break;
          case "license_status":
            _filters.license_status = { _in: value };
            break;

          default:
            _filters[key] = { _in: value };
            break;
        }
      } else {
      }
    });
    setFilters({ ..._filters });
    setPagination({ ...pagination, current });
    dispatch(setHomeListLoading(true));
  };

  const handelOnDelete = (id) => {
    setLoading(true);
    dispatch(deleteHome(id));
  };



  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      //sorter: true,
      sortDirections: ["ascend", "descend", "ascend"],
      //...getColumnSearchProps("name"),
      render: (text, home) => (
        <Space size="middle">
          <Link className="cap-letter" to={`/owner/communities/${home.key}`}>{text}</Link>
        </Space>
      ),
    },

    {
      title: "Address",
      dataIndex: "address_line_1",
      key: "address_line_1",
      //sorter: true,
      sortDirections: ["ascend", "descend", "ascend"],
      //...getColumnSearchProps("address_line_1"),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      //sorter: true,
      sortDirections: ["ascend", "descend", "ascend"],
      //...getColumnSearchProps("city"),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      //sorter: true,
      sortDirections: ["ascend", "descend", "ascend"],
      //...getColumnSearchProps("state"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // filters: licenseStatusOptions,
      // filterIcon: (
      //   <Tooltip title="Filter">
      //     <FilterFilled />
      //   </Tooltip>
      // ),
      // sorter: true,
      // sortDirections: ["ascend", "descend", "ascend"],
      render: (text, home) => (
        text && humanize(text)
      ),
    },
    {
      title: "Verification",
      dataIndex: "verification",
      key: "verification",
      //filters: homeVerificationOptions,
      filterIcon: (
        <Tooltip title="Filter">
          <FilterFilled />
        </Tooltip>
      ),
      //sorter: true,
      sortDirections: ["ascend", "descend", "ascend"],
      render: (text, home) => (
        <Space size="middle">{text && humanize(text)}</Space>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (text, home) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Link to={`/owner/communities/${home.key}`}>
              <EditOutlined />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure want to delete?"
              onConfirm={() => {
                handelOnDelete(home.key);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Link onClick={() => { }}>
                <DeleteOutlined />
              </Link>
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Clone">
            <Popover
              title="Clone Community"
              trigger="click"
              content={<GetClonButtonContent id={home.key} user={user} />}
            >
              <Link onClick={() => { }}>
                <CopyOutlined />
              </Link>
            </Popover>
          </Tooltip>
        </Space>
      ),
    },
  ];


  return (
    <>
      <Row gutter={30} className="content-header">
        <Col xs={24} sm={24} md={24} lg={20} xl={20}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/owner">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/owner/communities">Communities</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col xs={24} sm={24} md={24} lg={4} xl={4} className="text-right">
          <Button href={"/dashboard/owner/communities/add"}>Add Community</Button>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table
            columns={columns}
            loading={loading}
            dataSource={homeList.map(
              ({
                name,
                address_line_1,
                address_line_2,
                city,
                state,
                status,
                zip,
                license_status,
                id,
                verification,
              }) => {
                return {
                  name,
                  address_line_1,
                  //license_status: homeLicenseStatusOptions.map(item => { return item.value == license_status ? item.text : "" }),
                  key: id,
                  city,
                  state,
                  status,
                  verification,
                };
              }
            )}
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
    homeList: state.home.homeList,
    homeListLoading: state.home.homeListLoading,
    homeListMeta: state.home.homeListMeta,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAll: () => dispatch(listAll()),
    setHomeListLoading: () => dispatch(setHomeListLoading()),
    deleteHome: () => dispatch(deleteHome()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ListCommunities
);
