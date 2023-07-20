import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { listAll, setHomeListLoading, deleteHome, cloneHome, updateHome } from "../../../../redux/actions/home-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { notifyUser } from "../../../../services/notification-service";
import { List, Divider, Row, Col, Button, Select, Table, Tag, Space, Breadcrumb, Tooltip, Popconfirm, Popover, Form, Input, Skeleton } from "antd";
import { compose } from "redux";
import { CopyOutlined, DeleteOutlined, EditOutlined, FilterFilled } from "@ant-design/icons";
import { data } from "jquery";
import { licenseStatusValues, homeLicenseVerificationOptions, statusOptions, homeVerificationOptions, homeStatusOptions } from "../../../../constants/defaultValues";
import { getColumnSearchProps } from "../../../../helpers/columnSearchProps";
import { humanize } from "../../../../helpers/string-helper";
import UserService from "../../../../services/user-service";
import GetClonButtonContent from "./clone-community";

const PartnerListCommunities = ({ homeList, homeListLoading, homeMessage, homeUpdated, homeListMeta, }) => {
    const user = UserService.getAdminUser();
    console.log(user, "useruseruser");
    const [pagination, setPagination] = useState({
        pageSize: 15,
        current: 1,
    });
    const [sort, setSort] = useState([]);
    const [filters, setFilters] = useState({ user_created: { _eq: user.id } });
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        (loading || homeListLoading) &&
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

        let _filters = { user_created: { _eq: user.id } };

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
                    case "status":
                        _filters.status = { _in: value };
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


    const statusHandle = async (home, value) => {
        setLoading(true)
        const response = await dispatch(updateHome(home.key, { status: value, }))
        // console.log(response);
        notifyUser("Details have been saved", "success")
        setLoading(false)
    }
    const verificationStatusHandle = async (home, value) => {
        setLoading(true)
        const response = await dispatch(updateHome(home.key, { verification: value, }))
        // console.log(response);
        notifyUser("Details have been saved", "success")
        setLoading(false)
    }

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
                    <Link className="cap-letter" to={`/admin/partners/communities/${home.key}`}>{text}</Link>
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
        // {
        //     title: "State",
        //     dataIndex: "state",
        //     key: "state",
        //     sorter: true,
        //     sortDirections: ["ascend", "descend", "ascend"],
        //     ...getColumnSearchProps("state"),
        // },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            //filters: statusOptions,
            filterIcon: (
                <Tooltip title="Filter">
                    <FilterFilled />
                </Tooltip>
            ),
            //sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            render: (text, home) => (
                <Select
                    style={{ width: "130px" }}
                    defaultValue={text}
                    onChange={(text) => statusHandle(home, text)}
                >
                    {/* <Select.Option value={"option.value"}>{"option.text"}</Select.Option> */}
                    {homeStatusOptions.map((option) => {
                        return (
                            <Select.Option value={option.value}>{option.text}</Select.Option>
                        );
                    })}
                </Select>
                // <Space size="middle">{text && humanize(text)}</Space>
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
                <Select
                    style={{ width: "130px" }}
                    defaultValue={text}
                    onChange={(text) => verificationStatusHandle(home, text)}
                >
                    {/* <Select.Option value={"option.value"}>{"option.text"}</Select.Option> */}
                    {homeLicenseVerificationOptions.map((option) => {
                        return (
                            <Select.Option value={option.value}>{option.text}</Select.Option>
                        );
                    })}
                </Select>
                // <Space size="middle">{text && humanize(text)}</Space>
            ),
        },

        {
            title: "Action",
            key: "action",
            render: (text, home) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Link to={`/admin/partners/communities/${home.key}`}>
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
                        <Breadcrumb.Item><Link to="/admin">Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/admin/partners">Partners</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/admin/partner/overview">{humanize(user.first_name)} {humanize(user.last_name)}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/admin/partners/communities">Communities</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4} className="text-right">
                    <Button href={"/dashboard/admin/partners/communities/add"}>Add Community</Button>
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
                                zip,
                                license_status,
                                id,
                                verification,
                                status
                            }) => {
                                return {
                                    name,
                                    address_line_1,
                                    license_status: licenseStatusValues[license_status],
                                    key: id,
                                    city,
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
    PartnerListCommunities
);
