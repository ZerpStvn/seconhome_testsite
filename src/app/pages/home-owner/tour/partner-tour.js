import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { listAllLeads, updateLead, setLeadListLoading } from "../../../redux/actions/lead-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Tabs, Button, Table, Breadcrumb, Popconfirm, message } from "antd";
import { compose } from "redux";
import moment from 'moment';
import RescheduleTour from "./RescheduleTour";
import { humanize } from "../../../helpers/string-helper";




const { TabPane } = Tabs;
const Tours = ({ leadList, leadListLoading, leadMessage, leadUpdated, leadListMeta }) => {

    const [scheduleTour, setScheduleTour] = useState([]);
    const [scheduledTour, setScheduledTour] = useState([]);
    const [pastTour, setPastTour] = useState([]);
    const dispatch = useDispatch();
    const timeZone = new Date().getTimezoneOffset();

    useEffect(() => {
        leadListLoading && dispatch(listAllLeads({ fields: ['*', "client.*", "client.primary_resident.*", "home.*"], filter: {} }));

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
                if (Item.tour_status === 'scheduled' && (new Date(Item.scheduled_date).getTime() < new Date().getTime())) {
                    tempPastTour.push({
                        key: index,
                        communityName: Item.home && humanize(Item.home.name),
                        clientName: Item.client && humanize(Item.client.name),
                        residentName: (Item.client && Item.client.primary_resident) ? humanize(Item.client.primary_resident.name) : '',
                        dateTime: Item.scheduled_date ? `${moment(finalTime).format('MM-DD-YYYY')} ${moment(finalTime).format('LT')}` : "N/A",
                    });
                }
                else if (Item.tour_status === 'scheduled') {
                    tempScheduledTour.push({
                        key: index,
                        communityName: Item.home && humanize(Item.home.name),
                        clientName: Item.client && humanize(Item.client.name),
                        residentName: (Item.client && Item.client.primary_resident) ? humanize(Item.client.primary_resident.name) : '',
                        dateTime: Item.scheduled_date ? `${moment(finalTime).format('MM-DD-YYYY')} ${moment(finalTime).format('LT')}` : "N/A",
                        action: <>
                            <RescheduleTour LeadId={Item.id} updateLeadData={updateLeadData} Date={Item.scheduled_date && moment(new Date(finalTime), "YYYY-MM-DD, hh:mm A")} buttonTitle={"Reschedule"} />
                            <Popconfirm
                                title="Are you sure you want to cancel?"
                                onConfirm={() => updateLeadData(Item.id, { tour_status: "canceled" })}
                                onCancel={popConfirmCancel}
                                okText="Yes"
                                cancelText="No"
                            ><Button danger shape="round" >Cancel</Button>
                            </Popconfirm></>,
                    });
                }
                else {
                    tempScheduleTour.push({
                        key: index,
                        communityName: Item.home && humanize(Item.home.name),
                        clientName: Item.client && humanize(Item.client.name),
                        residentName: (Item.client && Item.client.primary_resident) ? humanize(Item.client.primary_resident.name) : '',
                        action: <>
                            <RescheduleTour LeadId={Item.id} updateLeadData={updateLeadData} Date={Item.scheduled_date && moment(new Date(finalTime), "YYYY-MM-DD, hh:mm A")} buttonTitle={"Schedule"} /></>,
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

    const popConfirmCancel = (e) => {
        console.log(e);
        // message.error('Click on No');
    }

    const updateLeadData = (LeadId, Data) => {
        console.log('LeadId, Data => ', LeadId, Data);
        dispatch(updateLead(LeadId, Data));
    }

    const scheduledTourColumns = [
        {
            title: 'Community Name',
            dataIndex: 'communityName',
            //sorter: (a, b) => a.communityName.localeCompare(b.communityName),
        },
        {
            title: 'Client Name',
            dataIndex: 'clientName',
            //sorter: {
            //     compare: (a, b) => a.clientName - b.clientName,
            //     multiple: 3,
            // },
        },
        {
            title: 'Resident Name',
            dataIndex: 'residentName',
            // sorter: {
            //     compare: (a, b) => a.residentName - b.residentName,
            //     multiple: 3,
            // },
        },
        {
            title: 'Date & Time',
            dataIndex: 'dateTime',
            // sorter: (a, b) => a.dateTime.localeCompare(b.dateTime),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            // sorter: {
            //     compare: (a, b) => a.action - b.action,
            //     multiple: 1,
            // },
        },
    ];
    const scheduleTourColumns = [
        {
            title: 'Community Name',
            dataIndex: 'communityName',
            // sorter: (a, b) => a.communityName.localeCompare(b.communityName),
        },
        {
            title: 'Client Name',
            dataIndex: 'clientName',
            // sorter: {
            //     compare: (a, b) => a.clientName - b.clientName,
            //     multiple: 3,
            // },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            // sorter: {
            //     compare: (a, b) => a.action - b.action,
            //     multiple: 1,
            // },
        },
    ];
    const pastTourColumns = [
        {
            title: 'Community Name',
            dataIndex: 'communityName',
            // sorter: {
            //     compare: (a, b) => a.communityName - b.communityName,
            //     multiple: 4,
            // },
        },
        {
            title: 'Client Name',
            dataIndex: 'clientName',
            // sorter: {
            //     compare: (a, b) => a.clientName - b.clientName,
            //     multiple: 3,
            // },
        },
        {
            title: 'Resident Name',
            dataIndex: 'residentName',
            // sorter: {
            //     compare: (a, b) => a.residentName - b.residentName,
            //     multiple: 3,
            // },
        },
        {
            title: 'Date & Time',
            dataIndex: 'dateTime',
            // sorter: {
            //     compare: (a, b) => a.dateTime - b.dateTime,
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(Tours);
