import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { listAllRooms, setRoomListLoading, deleteRoom, cloneRoom } from "../../../../redux/actions/room-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { notifyUser } from "../../../../services/notification-service";
import { List, Divider, Row, Col, Button, PageHeader, Table, Tag, Space, Breadcrumb, Tooltip, Popconfirm } from "antd";
import { compose } from "redux";
import { EditOutlined, CopyOutlined, DeleteOutlined, FilterFilled } from '@ant-design/icons';
import { data } from "jquery";
import { roomTypesOptions, roomCareTypesOptions, floorLevelOptions, bathroomTypesOptions } from "../../../../constants/defaultValues";
import { clone, values } from "ramda";
import { getNumberWithOrdinal } from "../../../../helpers/number-helper";
import { getColumnSearchProps } from "../../../../helpers/columnSearchProps";
import { humanize } from "../../../../helpers/string-helper";

const ListRooms = ({ homeId, roomList, roomListLoading, roomMessage, roomUpdated, roomListMeta }) => {

  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
  });
  const [sort, setSort] = useState([]);
  const [filters, setFilters] = useState({ home: { _eq: homeId } });
  const [loading, setLoading] = useState(roomListLoading);
  const [initialLoader, setInitialLoader] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (roomListLoading || initialLoader) {
      dispatch(listAllRooms({ filter: filters, sort, page: pagination.current, limit: pagination.pageSize, meta: "*" }));
      setInitialLoader(false);
    }
    if (roomListMeta) {
      setPagination({ ...pagination, total: roomListMeta.filter_count })
    }
    if (roomUpdated) {
      notifyUser(roomMessage, "success");
    }
    setLoading(roomListLoading);
    return () => {
      console.log("Rooms Unmounting");
    };
  }, [roomListLoading]);

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
          case "type":
            _filters.type = { _in: value }
            break;

          case "room_care_type":
            orFilter = [];
            value.map((data) => { orFilter.push({ room_care_type: { _contains: data } }) })
            _filters._or = orFilter;
            break;
          case "floor_level":
            _filters.floor_level = { _in: value }
            break;
          case "name":
            orFilter = [];
            value.map((data) => { orFilter.push({ name: { _contains: data } }) })
            _filters._or = orFilter;
            break;
          case "base_rate":
            _filters.base_rate = { _in: value }
            break;
          case "bathroom_type":
            _filters.bathroom_type = { _in: value }
            break;

          default:
            break;
        }
      } else {

      }

    });
    setFilters({ ..._filters, home: { _eq: homeId } });
    setPagination({ ...pagination, current });
    dispatch(setRoomListLoading(true));
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      //sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      //...getColumnSearchProps('name'),
      render: (text, room) => (
        <Space size="middle">
          <Link to={`/owner/communities/${homeId}/rooms/${room.key}`}>{text}</Link>

        </Space>
      )
    },

    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      //filters: roomTypesOptions,
      filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
      //sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text, room) => (
        <Space size="middle">
          {humanize(text)}

        </Space>
      )
    },
    {
      title: 'Bathroom Type',
      dataIndex: 'bathroom_type',
      key: 'bathroom_type',
      //filters: bathroomTypesOptions,
      filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
      //sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text, room) => (
        <Space size="middle">
          {humanize(text)}

        </Space>
      )
    },

    {
      title: 'Pricing',
      dataIndex: 'base_rate',
      key: 'base_rate',
      //sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      //...getColumnSearchProps('base_rate'),
      render: (text, room) => (
        <Space size="middle">
          {text && `$${text}`}
          {/* {`$${text}`} */}
        </Space>
      )

    },
    {
      title: 'Room Care Type',
      dataIndex: 'room_care_type',
      key: 'room_care_type',
      //filters: roomCareTypesOptions,
      filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
      render: (room_care_type) => (
        room_care_type !== null && room_care_type.map(tag => (
          <Tag color="blue" key={tag}>
            {humanize(tag)}
          </Tag>
        ))
      )
    },
    {
      title: 'Floor Level',
      dataIndex: 'floor_level',
      key: 'floor_level',
      //sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      //filters: floorLevelOptions,
      filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
      render: (text, room) => (
        <Space size="middle">
          {text && `${getNumberWithOrdinal(text)} Floor`}

        </Space>
      )
    },

    {
      title: 'Action',
      key: 'action',
      render: (text, room) => (
        <Space size="middle">
          <Tooltip title="Edit"><Link to={`/owner/communities/${homeId}/rooms/${room.key}`}><EditOutlined /></Link></Tooltip>
          <Tooltip title="Clone">
            <Link onClick={() => { handelOnClone(room.key) }}>
              <CopyOutlined />
            </Link>
          </Tooltip>

          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this Room?"
              onConfirm={() => { handelOnDelete(room.key) }}
              okText="Yes"
              cancelText="No">
              <Link onClick={() => { }}>
                <DeleteOutlined />
              </Link>
            </Popconfirm>

          </Tooltip>

        </Space>
      ),
    },
  ];

  const handelOnDelete = (id) => {
    setLoading(true);
    // dispatch(setRoomListLoading(true));
    dispatch(deleteRoom(id))
  }
  const handelOnClone = (id) => {
    setLoading(true);
    // dispatch(setRoomListLoading(true));
    dispatch(cloneRoom(id))
  }


  return (
    <>
      <Row gutter={30}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Space style={{ marginBottom: 16 }} className="btn-group-right">
            <Button href={`/dashboard/owner/communities/${homeId}/rooms/add`}>Add Room</Button>
          </Space>
          <Table
            columns={columns}
            loading={roomListLoading || initialLoader}
            dataSource={
              roomList.map(({ name, type, base_rate, id, room_care_type, floor_level, bathroom_type }) => {
                return { name, type, base_rate, room_care_type, floor_level, key: id, bathroom_type };
              })
            }
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
    roomList: state.room.roomList,
    roomListLoading: state.room.roomListLoading,
    roomListMeta: state.room.roomListMeta,

  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAllRooms: () => dispatch(listAllRooms()),
    setRoomListLoading: () => dispatch(setRoomListLoading()),
    deleteRoom: () => dispatch(deleteRoom()),
    cloneRoom: () => dispatch(cloneRoom()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(ListRooms);
