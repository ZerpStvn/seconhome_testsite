import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { listAllStaff, setStaffListLoading } from "../../../../redux/actions/staff-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { notifyUser } from "../../../../services/notification-service";
import { List, Divider, Row, Col, Button, PageHeader, Table, Tag, Space, Breadcrumb, Tooltip } from "antd";
import { compose } from "redux";
import { EditOutlined } from '@ant-design/icons';
import { getColumnSearchProps } from "../../../../helpers/columnSearchProps";

const ListStaff = ({ homeId, staffList, staffListLoading, staffMessage, staffUpdated, staffListMeta }) => {

  const [pagination, setPagination] = useState({
    pageSize: 5,
    current: 1,
  });
  const [sort, setSort] = useState([]);
  const [filters, setFilters] = useState({ home: { _eq: homeId } });

  const dispatch = useDispatch();
  useEffect(() => {
    staffListLoading && dispatch(listAllStaff({ filter: filters, sort, page: pagination.current, limit: pagination.pageSize, meta: "*" }));
    if (staffUpdated) {
      notifyUser(staffMessage, "success");
    }
    return () => {
      console.log("Staff Unmounting");
    };
  }, [staffUpdated, staffMessage, staffListLoading]);

  const handelTableChange = ({ current }, tableFilters, sorter) => {
    console.log(tableFilters);
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
            value.map((data) => { orFilter.push({ name: { _contains: data } }) })
            _filters._or = orFilter;
            break;
          case "email":
            orFilter = [];
            value.map((data) => { orFilter.push({ email: { _contains: data } }) })
            _filters._or = orFilter;
            break;
          case "phone":
            orFilter = [];
            value.map((data) => { orFilter.push({ phone: { _contains: data } }) })
            _filters._or = orFilter;
            break;

          default:
            break;
        }
      } else {

      }

    });
    setFilters({ ..._filters, home: { _eq: homeId } });
    setPagination({ ...pagination, current });
    dispatch(setStaffListLoading(true));
  }

  const formatNumber = (e) => {
    if (e) {
        var x = e.toString().replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

    }
}


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      ...getColumnSearchProps('name'),
      render: (text, staff) => (
        <Space size="middle">
          <Link className="cap-letter" to={`/owner/communities/${homeId}/staff/${staff.key}`}>{text}</Link>

        </Space>
      )
    },

    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      ...getColumnSearchProps('email'),
      render: (text, staff) => (
        <Space size="middle">
          {text}
        </Space>
      )
    },

    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      ...getColumnSearchProps('phone'),
      render: (text, staff) => (
        <Space size="middle">
          {`${formatNumber(text)}`}
        </Space>
      )

    },
    {
      title: 'Action',
      key: 'action',
      render: (text, staff) => (
        <Space size="middle">
          <Tooltip title="Edit"><Link to={`/owner/communities/${homeId}/staff/${staff.key}`}><EditOutlined /></Link></Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Row gutter={30}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Space style={{ marginBottom: 16 }} className="btn-group-right">
            <Button href={`/dashboard/owner/communities/${homeId}/staff/add`}>Add Staff</Button>
          </Space>
          <Table
            columns={columns}
            loading={staffListLoading}
            dataSource={staffList.map(({ name, email, phone, id }) => {
              return { name, email, phone, key: id };
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
    staffList: state.staff.staffList,
    staffListLoading: state.staff.staffListLoading,
    staffListMeta: state.staff.staffListMeta
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAllStaff: () => dispatch(listAllStaff()),
    setStaffListLoading: () => dispatch(setStaffListLoading()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(ListStaff);
