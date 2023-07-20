import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { listAllRooms, setRoomListLoading, deleteRoom, cloneRoom, updateRoom } from "../../../../../redux/actions/room-actions";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { notifyUser } from "../../../../../services/notification-service";
import { List, Divider, Row, Col, Button, PageHeader, Table, Tag, Space, Breadcrumb, Tooltip, Popconfirm, Select } from "antd";
import { compose } from "redux";
import { EditOutlined, CopyOutlined, DeleteOutlined, FilterFilled } from '@ant-design/icons';
import { data } from "jquery";
import { roomTypesOptions, roomCareTypesOptions, floorLevelOptions, bathroomTypesOptions, statusOptions } from "../../../../../constants/defaultValues";
import { clone, values } from "ramda";
import { getNumberWithOrdinal } from "../../../../../helpers/number-helper";
import { getColumnSearchProps } from "../../../../../helpers/columnSearchProps";
import { humanize } from "../../../../../helpers/string-helper";
import API from "../../../../../redux/api/room-api";
import UserService from "../../../../../services/user-service";



const ListRooms = ({ homeId, roomList, roomListLoading, roomMessage, roomUpdated, roomListMeta }) => {
  const { id } = useParams();
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
  });
  const [sort, setSort] = useState([]);
  const [filters, setFilters] = useState({ home: { _eq: id } });
  const [loading, setLoading] = useState(true);

  const user = UserService.getAdminUser();
  const dispatch = useDispatch();
  useEffect(() => {
    if (loading || roomListLoading) {
      dispatch(listAllRooms({ filter: filters, sort, page: pagination.current, limit: pagination.pageSize, meta: "*" }));
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
          case "status":
            _filters.status = { _in: value }
            break;

          default:
            break;
        }
      } else {

      }

    });
    setFilters({ ..._filters, home: { _eq: homeId } });
    setPagination({ ...pagination, current });
    setLoading(true);
    dispatch(setRoomListLoading(true));
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      ...getColumnSearchProps('name'),
      render: (text, room) => (
        <Space size="middle">
          <Link className="cap-letter" to={`/admin/partners/communities/${homeId}/rooms/${room.key}`}>{text}</Link>

        </Space>
      )
    },

    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: roomTypesOptions,
      filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
      sorter: true,
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
      filters: bathroomTypesOptions,
      filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
      sorter: true,
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
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      ...getColumnSearchProps('base_rate'),
      render: (text, room) => (
        <Space size="middle">
          {text && `$${text}`}
        </Space>
      )

    },
    {
      title: 'Room Care Type',
      dataIndex: 'room_care_type',
      key: 'room_care_type',
      filters: roomCareTypesOptions,
      filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
      render: (room_care_type) => (
        room_care_type && room_care_type.map(tag => (
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
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      filters: floorLevelOptions,
      filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
      render: (text, room) => (
        <Space size="middle">
          {text && `${getNumberWithOrdinal(text)} Floor`}
        </Space>
      )
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   sorter: true,
    //   sortDirections: ['ascend', 'descend', 'ascend'],
    //   filters: statusOptions,
    //   filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
    //   render: (text, room) => (
    //     <Space size="middle">
    //       {humanize(text)}
    //       ,
    //     </Space>
    //   ),
    //   render: (value, room) => (
    //     <Select
    //       style={{ width: "130px" }}
    //       defaultValue={value}
    //       onChange={(value) => handelStatusChange(value, room.key)}
    //     >
    //       {statusOptions.map((option) => {
    //         return (
    //           <Select.Option value={option.value}>{option.text}</Select.Option>
    //         );
    //       })}
    //     </Select>
    //   ),
    // },

    {
      title: 'Action',
      key: 'action',
      render: (text, room) => (
        <Space size="middle">
          <Tooltip title="Edit"><Link to={`/admin/partners/communities/${homeId}/rooms/${room.key}`}><EditOutlined /></Link></Tooltip>
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

  const handelStatusChange = (value, roomId) => {
    dispatch(updateRoom(roomId, { status: value }));
  };

  const handelOnDelete = (id) => {
    setLoading(true);
    // dispatch(setRoomListLoading(true));
    dispatch(deleteRoom(id))
  }
  const handelOnClone = async (id) => {
    setLoading(true);
    console.log(id);
    let values = roomList.filter((Item, Index) => {
      return parseInt(Item.id) === parseInt(id);
    });
    // console.log('dsafsfsf', values);
    // dispatch(setRoomListLoading(true));
    // dispatch(cloneRoom(id));
    await API.cloneRoom(id).then(async (Data) => {
      values.user_created = user.id;
      values.id = Data;
      await dispatch(updateRoom(Data, values));
    });
  }


  return (
    <>
      <Row gutter={30}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Space style={{ marginBottom: 16 }} className="btn-group-right">
            <Button href={`/dashboard/admin/partners/communities/${homeId}/rooms/add`}>Add Room</Button>
          </Space>
          <Table
            columns={columns}
            loading={loading}
            dataSource={
              roomList.map(({ name, type, base_rate, id, room_care_type, floor_level, bathroom_type, status }) => {
                return { name, type, base_rate, room_care_type, floor_level, key: id, bathroom_type, status };
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
