

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import UserService from "../../../services/user-service";
import API from "../../../redux/api/lead-client-api";
import { updateLead } from "../../../redux/actions/lead-actions";
import { Breadcrumb, Tabs, message, Table, Popconfirm, Button } from "antd";
import moment from 'moment';
import RescheduleTour from './RescheduleTour';

const { TabPane } = Tabs;
const Tours = ({ history }) => {
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [allLeads, setAllLeads] = useState({});
    const [scheduleTour, setScheduleTour] = useState([]);
    const [scheduledTour, setScheduledTour] = useState([]);
    const [pastTour, setPastTour] = useState([]);
    const [primaryClientLoaded, setPrimaryClientLoaded] = useState(false);
    const user = UserService.getAdminUser();
    const timeZone = new Date().getTimezoneOffset();

    useEffect(() => {
        !primaryClientLoaded && getPrimaryClient();
    }, [primaryClientLoaded]);


    const getPrimaryClient = async () => {
        var leadClient = await API.listAllLeadClients({ fields: "*,leads.*,leads.home.*", filter: { user: { _eq: user.id } } });
        if (leadClient.data.length > 0) {
            // console.log(leadClient.data, '<==leadClient.data');
            let leadData = leadClient.data[0].leads;
            let tempScheduleTour = [];
            let tempScheduledTour = [];
            let tempPastTour = [];
            leadData.forEach((Item, index) => {
                // console.log(Item, 'Item');
                if (Item.home && (Item.approval == "accepted" || Item.approval == "pending")) {
                    let finalTime;
                    if (Item.scheduled_date) {
                        let time = new Date(Item.scheduled_date).getTime();
                        finalTime = time + (-timeZone * 60000)

                    }
                    if (Item.tour_status === 'scheduled' && !!Item.scheduled_date && (new Date(finalTime).getTime() < new Date().getTime())) {
                        tempPastTour.push({
                            key: index,
                            communityName: Item.home && Item.home.name,
                            clientName: leadClient.data[0].name,
                            dateTime: Item.scheduled_date ? `${moment(finalTime).format('MM-DD-YYYY')} ${moment(finalTime).format('LT')}` : "N/A",
                        });
                    }
                    else if (Item.tour_status === 'scheduled' && !!Item.scheduled_date) {
                        let finalTime;
                        if (Item.scheduled_date) {
                            let time = new Date(Item.scheduled_date).getTime();
                            finalTime = time + (-timeZone * 60000)

                        }
                        tempScheduledTour.push({
                            key: index,
                            communityName: Item.home && Item.home.name,
                            clientName: leadClient.data[0].name,
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
                        let finalTime;
                        if (Item.scheduled_date) {
                            let time = new Date(Item.scheduled_date).getTime();
                            finalTime = time + (-timeZone * 60000)

                        }
                        console.log(Item);
                        tempScheduleTour.push({
                            key: index,
                            communityName: Item.home && Item.home.name,
                            clientName: leadClient.data[0].name,
                            //dateTime: Item.scheduled_date ? `${moment(Item.scheduled_date).format('MM-DD-YYYY')} ${moment(Item.scheduled_date).format('LT')}` : "N/A",
                            action: <>
                                <RescheduleTour LeadId={Item.id} updateLeadData={updateLeadData} Date={Item.scheduled_date && moment(new Date(finalTime), "YYYY-MM-DD, hh:mm A")} buttonTitle={"Schedule"} /></>,
                        });
                    }
                }
            });
            setScheduleTour(tempScheduleTour);
            setScheduledTour(tempScheduledTour);
            setPastTour(tempPastTour);
            setPrimaryClientLoaded(true);

        }
    }
    const popConfirmCancel = (e) => {
        // message.error('Click on No');
    }

    const updateLeadData = async (LeadId, Data) => {
        try {
            await dispatch(updateLead(LeadId, Data));
        } catch (e) {
            console.log(e);
        }
        getPrimaryClient();
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
            // sorter: {
            //     compare: (a, b) => a.clientName - b.clientName,
            //     multiple: 3,
            // },
        },
        {
            title: 'Date & Time',
            dataIndex: 'dateTime',
            //sorter: (a, b) => a.dateTime.localeCompare(b.dateTime),
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
            //sorter: (a, b) => a.communityName.localeCompare(b.communityName),
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
        <React.Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>Client</Breadcrumb.Item>
                <Breadcrumb.Item>Communities</Breadcrumb.Item>
                <Breadcrumb.Item>Tours</Breadcrumb.Item>
            </Breadcrumb>
            <div>
                <Tabs defaultActiveKey="scheduleTour" onChange={() => console.log(0)}>
                    <TabPane tab="Schedule Tour" key="scheduleTour">
                        <Table columns={scheduleTourColumns} dataSource={scheduleTour} onChange={onChange} />
                    </TabPane>
                    <TabPane tab="Scheduled Tour" key="scheduledTour">
                        <Table columns={scheduledTourColumns} dataSource={scheduledTour} onChange={onChange} />
                    </TabPane>

                    <TabPane tab="Past Tour" key="pastTour">
                        <Table columns={pastTourColumns} dataSource={pastTour} onChange={onChange} />
                    </TabPane>
                </Tabs>
            </div>

        </React.Fragment >
    );
};


function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tours);
