import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { listAllLeads, updateLead, setLeadListLoading } from "../../../redux/actions/lead-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { notifyUser } from "../../../services/notification-service";
import { Tabs, Divider, Row, Col, Button, PageHeader, Table, Tag, Space, Breadcrumb, Select, Form, Input, Popover, Tooltip } from "antd";
import { compose } from "redux";
import { DownOutlined, EditOutlined, FilterFilled, FilterOutlined, TagFilled } from '@ant-design/icons';
import { data } from "jquery";
import { leadApprovalOptions, leadStatusOptions } from "../../../constants/defaultValues";
import { humanize } from "../../../helpers/string-helper";
import { getColumnSearchProps } from "../../../helpers/columnSearchProps";
import UserService from "../../../services/user-service";
import moment from 'moment';
const { TextArea } = Input;





const { TabPane } = Tabs;
const PartnerTourList = ({ leadList, leadListLoading, leadMessage, leadUpdated, leadListMeta }) => {
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
    const [scheduleTour, setScheduleTour] = useState([]);
    const [scheduledTour, setScheduledTour] = useState([]);
    const [pastTour, setPastTour] = useState([]);
    const timeZone = new Date().getTimezoneOffset();
    const dispatch = useDispatch();
    const handelApprovalChange = (values, leadId) => {
        dispatch(updateLead(leadId, values));

    }
    useEffect(() => {
        leadListLoading && dispatch(listAllLeads({ fields: ['*', "client.*", "client.primary_resident.*", "home.*"], filter: filters }));
        // leadListLoading && dispatch(listAllLeads({ fields: ['*', "client.*", "client.primary_resident.*", "home.*"], filter: filters, sort, page: pagination.current, limit: pagination.pageSize, meta: "*" }));
        leadListMeta && setPagination({ ...pagination, total: leadListMeta.filter_count })
        if (leadUpdated) {
            notifyUser(leadMessage, "success");
        }
        console.log(leadList);
        if (leadList.length != 0) {
            let tempScheduleTour = [];
            let tempScheduledTour = [];
            let tempPastTour = [];
            leadList.forEach((Item, index) => {
                let finalTime;
                if (Item.scheduled_date) {
                    let time = new Date(Item.scheduled_date).getTime();
                    finalTime = time + (-timeZone * 60000)

                }
                if (Item.tour_status === 'scheduled' && (new Date(finalTime).getTime() < new Date().getTime())) {
                    tempPastTour.push({
                        key: index,
                        name: Item.home && humanize(Item.home.name),
                        client_name: Item.client && humanize(Item.client.name),
                        // status: <Tag color="blue" key={index}>
                        //     {humanize(Item.tour_status)}
                        // </Tag>,
                        date: Item.scheduled_date ? `${moment(finalTime).format('MM-DD-YYYY')} ${moment(finalTime).format('LT')}` : "N/A",
                    });
                }
                else if (Item.tour_status === 'scheduled') {
                    tempScheduledTour.push({
                        key: index,
                        name: Item.home && humanize(Item.home.name),
                        client_name: Item.client && humanize(Item.client.name),
                        status: <Tag color="blue" key={index}>
                            {humanize(Item.tour_status)}
                        </Tag>,
                        date: Item.scheduled_date ? `${moment(finalTime).format('MM-DD-YYYY')} ${moment(finalTime).format('LT')}` : "N/A",
                    });
                }
                else {
                    tempScheduleTour.push({
                        key: index,
                        name: Item.home && humanize(Item.home.name),
                        client_name: Item.client && humanize(Item.client.name),
                        status: <Tag color="blue" key={index}>
                            {humanize(Item.tour_status)}
                        </Tag>,
                        date: Item.scheduled_date ? `${moment(finalTime).format('MM-DD-YYYY')} ${moment(finalTime).format('LT')}` : "N/A",
                    });
                }
            });
            setScheduleTour(tempScheduleTour);
            setScheduledTour(tempScheduledTour);
            setPastTour(tempPastTour);
        }

        return () => {
            console.log("Communities Unmounting");
        };
    }, [leadUpdated, leadMessage, leadListLoading]);


    const scheduledTourColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            //sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Client Name',
            dataIndex: 'client_name',
            // sorter: {
            //     compare: (a, b) => a.client_name - b.client_name,
            //     multiple: 3,
            // },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            // sorter: {
            //     compare: (a, b) => a.status - b.status,
            //     multiple: 3,
            // },
        },
        {
            title: 'Date & Time',
            dataIndex: 'date',
            //sorter: (a, b) => a.date.localeCompare(b.date),
        },
    ];
    const scheduleTourColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            //sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Client Name',
            dataIndex: 'client_name',
            //sorter: {
            //     compare: (a, b) => a.client_name - b.client_name,
            //     multiple: 3,
            // },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            //sorter: {
            //     compare: (a, b) => a.status - b.status,
            //     multiple: 3,
            // },
        },
    ];
    const pastTourColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            // sorter: {
            //     compare: (a, b) => a.name - b.name,
            //     multiple: 4,
            // },
        },
        {
            title: 'Client Name',
            dataIndex: 'client_name',
            // sorter: {
            //     compare: (a, b) => a.client_name - b.client_name,
            //     multiple: 3,
            // },
        },
        {
            title: 'Date & Time',
            dataIndex: 'date',
            // sorter: {
            //     compare: (a, b) => a.date - b.date,
            //     multiple: 2,
            // },
        },
    ];

    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }
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
                    <Link to="">Tours</Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <div>
                <Tabs defaultActiveKey="scheduleTour" onChange={() => console.log(0)}>
                    {/* <TabPane tab="Schedule Tour" key="scheduleTour">
                        <Table columns={scheduleTourColumns} dataSource={scheduleTour} onChange={onChange} />
                    </TabPane> */}
                    <TabPane tab="Scheduled Tour" key="scheduledTour">
                        <Table columns={scheduledTourColumns} dataSource={scheduledTour} onChange={onChange} />
                    </TabPane>
                    <TabPane tab="Past Tour" key="pastTour">
                        <Table columns={pastTourColumns} dataSource={pastTour} onChange={onChange} />
                    </TabPane>
                </Tabs>
            </div>

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

export default compose(connect(mapStateToProps, mapDispatchToProps))(PartnerTourList);
