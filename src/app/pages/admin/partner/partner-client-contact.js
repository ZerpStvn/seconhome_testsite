import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { listAllLeads, updateLead, setLeadListLoading } from "../../../redux/actions/lead-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { notifyUser } from "../../../services/notification-service";
import { List, Divider, Row, Col, Button, PageHeader, Table, Tag, Space, Breadcrumb, Select, Form, Input, Popover, Tooltip } from "antd";
import { compose } from "redux";
import { DownOutlined, EditOutlined, FilterFilled, FilterOutlined, TagFilled } from '@ant-design/icons';
import { data } from "jquery";
import { leadApprovalOptions, leadStatusOptions } from "../../../constants/defaultValues";
import { humanize } from "../../../helpers/string-helper";
import { getColumnSearchProps } from "../../../helpers/columnSearchProps";
import UserService from "../../../services/user-service";
import PartnerClientApproval from "./partner-client-approval";
const { TextArea } = Input;






const PartnersClientContact = ({ leadList, leadListLoading, leadMessage, leadUpdated, leadListMeta }) => {
    const user = UserService.getAdminUser();

    const [pagination, setPagination] = useState({
        pageSize: 5,
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
    const handelApprovalChange = (values, leadId) => {
        dispatch(updateLead(leadId, values));
    }
    useEffect(() => {
        leadListLoading && dispatch(listAllLeads({ fields: ['*', "client.*", "client.primary_resident.*", "home.*"], filter: filters, }));
        // leadListLoading && dispatch(listAllLeads({ fields: ['*', "client.*", "client.primary_resident.*", "home.*"], filter: filters, sort, page: pagination.current, limit: pagination.pageSize, meta: "*" }));
        leadListMeta && setPagination({ ...pagination, total: leadListMeta.filter_count })
        if (leadUpdated) {
            notifyUser(leadMessage, "success");
        }
        return () => {
            console.log("Communities Unmounting");
        };
    }, [leadUpdated, leadMessage, leadListLoading]);

    const handelTableChange = ({ current }, tableFilters, sorter) => {
        console.log({ current }, tableFilters, sorter);
        console.log('clivk');
        setPagination((values) => {
            return {
                ...values,
                current: current
            }
        });
        // if (sorter && sorter.field) {
        //     if (sorter.order == "ascend") {
        //         setSort(sorter.field);
        //     } else {
        //         setSort("-" + sorter.field);
        //     }
        // }

        // let _filters = {};


        // Object.entries(tableFilters).forEach(([key, value]) => {
        //     let orFilter = [];
        //     if (value) {
        //         switch (key) {
        //             case "approval":
        //                 _filters.approval = { _in: value }
        //                 break;
        //             case "status":
        //                 _filters.status = { _in: value }
        //                 break;

        //             case "budget":
        //                 orFilter = [];
        //                 value.map((data) => { orFilter.push({ budget: { _eq: data } }) })
        //                 _filters._or = orFilter;
        //                 break;

        //             case "client_name":
        //                 orFilter = [];
        //                 value.map((data) => { orFilter.push({ clients: { name: { _contains: data } } }) })
        //                 _filters._or = orFilter;
        //                 break;
        //             case "resident_name":
        //                 orFilter = [];
        //                 value.map((data) => { orFilter.push({ residents: { name: { _contains: data } } }) })
        //                 _filters._or = orFilter;
        //                 break;

        //             default:
        //                 break;
        //         }
        //     } else {

        //     }

        // });
        // setFilters({ ..._filters });
        // setPagination({ ...pagination, current });
        // dispatch(setLeadListLoading(true));
    }


    const columns = [
        {
            title: 'Community',
            dataIndex: 'home_name',
            key: 'home_name',
            //...getColumnSearchProps("home_name"),
            render: (text, lead) => (
                <Space size="middle">
                    <Link to={`/admin/partners/communities/${lead.home_id}`}>{text}</Link>

                </Space>
            )
        },
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
            //...getColumnSearchProps("resident_name"),
            render: (text, lead) => (
                <Space size="middle">
                    <Link to={`/owner/leads/${lead.key}/resident`}>{text}</Link>

                </Space>
            )
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
            key: 'budget',
            //sorter: true,
            sortDirections: ['ascend', 'descend', 'ascend'],
            //...getColumnSearchProps("budget"),
            render: (text) => (
                <Space size="middle">
                    {text && `${text}`}
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
            filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
            render: (value, lead) => {
                return <PartnerClientApproval value={value} lead={lead} handelApprovalChange={handelApprovalChange} />
            }
        },
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     key: 'status',
        //     sorter: true,
        //     sortDirections: ['ascend', 'descend', 'ascend'],
        //     filters: leadStatusOptions,
        //     filterIcon: (<Tooltip title="Filter"><FilterFilled /></Tooltip>),
        //     render: (text) => (
        //         <Space >
        //             {humanize(text)}
        //         </Space>
        //     )
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
                    <Link to="">Client Contact</Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Row gutter={30}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Table
                        columns={columns}
                        loading={leadListLoading}
                        dataSource={leadList.map(({ client, budget, approval, status, id, denied_reason, date_created, home }) => {
                            console.log(client, budget, approval, status, id, denied_reason, date_created, home, "client, budget, approval, status, id, denied_reason, date_created, home");
                            return { client_name: client ? client.name : "", resident_name: (client && client.primary_resident) ? client.primary_resident.name : "", budget: (client && client.primary_resident) ? client.primary_resident.budget_notes : "", approval, key: id, status, denied_reason, date_created, home_name: home && home.name, home_id: home && home.id };
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(PartnersClientContact);
