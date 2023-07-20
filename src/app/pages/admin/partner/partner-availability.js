import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { listAllRooms, updateRoom, setRoomListLoading } from "../../../redux/actions/room-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Input, Popover, Row, Col, Button, PageHeader, Table, Tag, Space, Breadcrumb, Select, DatePicker, Tooltip, } from "antd";
import { compose } from "redux";
import { EditOutlined, FilterFilled } from "@ant-design/icons";
import { roomAvailabilityOptions, roomTypesOptions, roomCareTypesOptions, floorLevelOptions, roomAvailabilityOptionsAdmin, } from "../../../constants/defaultValues";
import { humanize } from "../../../helpers/string-helper";
import { getNumberWithOrdinal } from "../../../helpers/number-helper";
import moment from "moment";
import { getColumnSearchProps } from "../../../helpers/columnSearchProps";
import UserService from "../../../services/user-service";
import PriceChange from "./PriceChange";
import DateAvailablePopOver from "./date-available-popover";

const dateFormat = "MMM DD, YYYY";

const PartnersAvailability = ({ roomList, roomListLoading, roomUpdated, roomMessage, roomListMeta, }) => {
    const user = UserService.getAdminUser();
    const [pagination, setPagination] = useState({
        pageSize: 20,
        current: 1,
    });
    const [sort, setSort] = useState([]);
    const [filters, setFilters] = useState({
        "home": {
            "user_created": {
                "_eq": user.id
            }
        }
    });
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            listAllRooms({
                fields: ["*", "home.*"],
                filter: filters,
                sort,
                page: pagination.current,
                limit: pagination.pageSize,
                meta: "*",
            })
        );
        roomListMeta &&
            setPagination({ ...pagination, total: roomListMeta.filter_count });

        return () => {
            console.log("Rooms Unmounting");
        };
    }, [roomUpdated, roomListLoading]);

    const handelTableChange = ({ current }, tableFilters, sorter) => {
        if (sorter && sorter.field) {
            if (sorter.order == "ascend") {
                setSort(sorter.field);
            } else {
                setSort("-" + sorter.field);
            }
        }

        let _filters = {
            "home": {
                "user_created": {
                    "_eq": user.id
                }
            }
        };

        Object.entries(tableFilters).forEach(([key, value]) => {
            let orFilter = [];
            if (value) {
                switch (key) {
                    case "availability":
                        _filters.availability = { _in: value };
                        break;

                    case "room_care_type":
                        orFilter = [];
                        value.map((data) => {
                            orFilter.push({ room_care_type: { _contains: data } });
                        });
                        _filters._or = orFilter;
                        break;
                    case "floor_level":
                        _filters.floor_level = { _in: value };
                        break;
                    case "name":
                        orFilter = [];
                        value.map((data) => {
                            orFilter.push({ name: { _contains: data } });
                        });
                        _filters._or = orFilter;
                        break;
                    case "base_rate":
                        _filters.base_rate = { _in: value };
                        break;
                    case "home_name":
                        orFilter = [];
                        value.map((data) => {
                            orFilter.push({ home: { name: { _contains: data } } });
                        });
                        _filters._or = orFilter;
                        break;

                    default:
                        _filters = {
                            "home": {
                                "user_created": {
                                    "_eq": user.id
                                }
                            }
                        }
                        break;
                }
            } else {
            }
        });
        setFilters({ ..._filters });
        setPagination({ ...pagination, current });
        dispatch(setRoomListLoading(true));
    };

    const handelAvailabilityChange = (value, roomId) => {
        if (value == "no") {
            dispatch(
                updateRoom(roomId, { availability: value })
            );
        } else {
            dispatch(updateRoom(roomId, { availability: value }));
        }
    };

    const handelDateAvailableChange = (date, dateString, roomId) => {
        dispatch(updateRoom(roomId, { date_available: date.format("YYYY-MM-DD") }));
    };

    const updateRoomPrice = (roomId, price) => {
        dispatch(updateRoom(roomId, { base_rate: price }));
    }


    const columns = [
        {
            title: "Home Name",
            dataIndex: "home_name",
            key: "home_name",
            //...getColumnSearchProps("home_name"),
            render: (text, room) => (
                <Space size="middle">
                    <Link to={`/admin/partners/communities/${room.home_id}`}>{humanize(text)}</Link>
                </Space>
            ),
        },

        {
            title: "Room Name",
            dataIndex: "name",
            key: "name",
            //sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            //...getColumnSearchProps("name"),
            render: (text, room) => (
                <Space size="middle">
                    <Link to={`/admin/partners/communities/${room.home_id}/rooms/${room.key}`}>
                        {text}
                    </Link>
                </Space>
            ),
        },
        {
            title: "Pricing",
            dataIndex: "base_rate",
            key: "base_rate",
            //sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            //...getColumnSearchProps("base_rate"),
            render: (text, room) => !!text && <PriceChange Key={room.key} Price={text} UpdateRoomPrice={updateRoomPrice} />,
        },
        {
            title: "Floor Level",
            dataIndex: "floor_level",
            key: "floor_level",
            //sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            //filters: floorLevelOptions,
            filterIcon: (
                <Tooltip title="Filter">
                    <FilterFilled />
                </Tooltip>
            ),
            render: (text, room) => (
                !!text &&
                <Space size="middle">{`${getNumberWithOrdinal(text)} Floor`}</Space>
            ),
        },
        {
            title: "Room Type",
            dataIndex: "type",
            key: "type",
            //sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            //filters: roomCareTypesOptions,
            filterIcon: (
                <Tooltip title="Filter">
                    <FilterFilled />
                </Tooltip>
            ),
            render: (text) =>

                <Tag color="blue">
                    {humanize(text)}
                </Tag>

        },
        {
            title: "Room Care Type",
            dataIndex: "room_care_type",
            key: "room_care_type",
            //sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            //filters: roomCareTypesOptions,
            filterIcon: (
                <Tooltip title="Filter">
                    <FilterFilled />
                </Tooltip>
            ),
            render: (room_care_type) => (
                <Tag color="blue">
                    {humanize(room_care_type)}
                </Tag>
            ),

        },

        {
            title: "Availability",
            dataIndex: "availability",
            key: "availability",
            style: { width: "130px" },
            //sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            //filters: roomAvailabilityOptionsAdmin,
            filterIcon: (
                <Tooltip title="Filter">
                    <FilterFilled />
                </Tooltip>
            ),
            render: (value, room) => (
                <>
                    <DateAvailablePopOver data={value} updateRoom={updateRoom} />
                    {/*} <Select
                        style={{ width: "130px" }}
                        defaultValue={value}
                        onChange={(value) => handelAvailabilityChange(value, room.key)}
                    >
                        {roomAvailabilityOptions.map((option) => {
                            return (
                                <Select.Option value={option.value}>{option.text}</Select.Option>
                            );
                        })}
                    </Select> */}
                </>
            ),
        },
        // {
        //     title: "Date Available",
        //     dataIndex: "date_available",
        //     key: "date_available",
        //     sorter: true,
        //     sortDirections: ["ascend", "descend", "ascend"],
        //     render: (text, room) => (
        //         <Space direction="vertical" size="middle">
        //             <DatePicker
        //                 format={dateFormat}
        //                 defaultValue={text && moment(text, "YYYY-MM-DD")}
        //                 onChange={(date, dateString) =>
        //                     handelDateAvailableChange(date, dateString, room.key)
        //                 }
        //             />
        //         </Space>
        //     ),
        // },
        // {
        //     title: "Status",
        //     dataIndex: "status",
        //     key: "status",
        //     sorter: true,
        //     sortDirections: ["ascend", "descend", "ascend"],
        //     render: (text, room) => (
        //         <Space direction="vertical" size="middle">
        //             {humanize(text)}
        //         </Space>
        //     ),
        // },
    ];

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/admin">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/admin/partners">Partners</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/admin/partner/overview">{humanize(user.first_name)} {humanize(user.last_name)}</Link></Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="">Availability</Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Row gutter={30}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Table
                        columns={columns}
                        loading={roomListLoading}
                        dataSource={roomList.map((item) => {
                            return {
                                name: item.name,
                                base_rate: item.base_rate,
                                room_care_type: item.room_care_type,
                                floor_level: item.floor_level,
                                key: item.id,
                                home_name: item.home ? item.home.name : null,
                                availability: item,
                                date_available: item.date_available,
                                home_id: item.home ? item.home.id : null,
                                status: item.status,
                                type: item.type
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
        roomList: state.room.roomList,
        roomListLoading: state.room.roomListLoading,
        roomUpdated: state.room.roomUpdated,
        roomMessage: state.room.roomMessage,
        roomListMeta: state.room.roomListMeta,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        listAllRooms: () => dispatch(listAllRooms()),
        updateRoom: () => dispatch(updateRoom()),
        setRoomListLoading: () => dispatch(setRoomListLoading()),
    };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    PartnersAvailability
);
