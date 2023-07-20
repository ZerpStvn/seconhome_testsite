

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import UserService from "../../../services/user-service";
import API from "../../../redux/api/lead-client-api";
import { updateRoom } from '../../../redux/actions/room-actions';
import { housingTypesOptions } from "../../../constants/defaultValues";
import { Breadcrumb, Tabs, Tag, Table, Space, DatePicker } from "antd";
import moment from "moment";
import { humanize } from "../../../helpers/string-helper";
import DateAvailablePopOver from "./date-available-popover";
import { notifyUser } from "../../../services/notification-service";

const { TabPane } = Tabs;
const dateFormat = "MMM DD, YYYY";
const AvailableRooms = ({ history }) => {
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [userData, setUserData] = useState({});

    const [availableRooms, setAvailableRooms] = useState([]);

    const [primaryClientLoaded, setPrimaryClientLoaded] = useState(true);
    const [loading, setLoading] = useState(false);

    const user = UserService.getAdminUser();


    useEffect(() => {
        primaryClientLoaded && getPrimaryClient();
    }, [primaryClientLoaded]);


    const getPrimaryClient = async () => {
        var leadClient = await API.listAllLeadClients({ fields: "*,leads.*,leads.home.*,leads.home.rooms.*", filter: { user: { _eq: user.id } } });
        if (leadClient.data) {
            setUserData(leadClient.data[0]);
            let leadData = leadClient.data[0].leads;
            let tempAvailableRooms = [];
            leadData.forEach((Item) => {
                if (Item.home && Item.approval === "accepted") {
                    console.log('Item.home:',Item.home);
                    Item.home.rooms.forEach((room, index) => {
                        if (room.availability !== "no" && room.status === "published") {
                            tempAvailableRooms.push({
                                key: index,
                                homeName: Item.home.name,
                                roomId: Item.home.id,
                                roomName: room.name,
                                pricing: room.base_rate ? `$${room.base_rate}` : "N/A",
                                floorLevel: room.floor_level ? room.floor_level : "N/A",
                                roomCareType: room.room_care_type ? room.room_care_type.map((type) => {
                                    let Data;
                                    housingTypesOptions.forEach((Item) => {
                                        if (Item.value === type) {
                                            Data = <Tag color="blue">{humanize(Item.text)}</Tag>
                                        }
                                    });
                                    return Data;
                                }) : "NA",
                                room_type: room.type ? <Tag color="blue">{humanize(room.type)}</Tag> : "N/A",
                                bathroom_type: room.bathroom_type ? humanize(room.bathroom_type) : "N/A",
                                availability: <>
                                    <DateAvailablePopOver data={room} updateAvailableRoom={updateAvailableRoom} />
                                    {/* <Space direction="vertical" size="middle">
                                        <DatePicker
                                            format={dateFormat}
                                            allowClear={false}
                                            defaultValue={room.date_available && moment(room.date_available, "YYYY-MM-DD")}
                                            onChange={(date, dateString) =>
                                                handelDateAvailableChange(date, dateString, room.id)
                                            }
                                        />
                                    </Space> */}
                                </>
                            });
                        }

                    });
                }



            });
            setAvailableRooms(tempAvailableRooms);

            setPrimaryClientLoaded(false);

        }
    }

    const updateAvailableRoom = async (data, values) => {
        setLoading(true)
        try {
            if (values.availability && values.date_available) {
                await dispatch(updateRoom(data.id, { availability: values.availability, date_available: values.date_available.format("YYYY-MM-DD") }));
                setLoading(false);
                setPrimaryClientLoaded(true)

            }
        } catch (error) {
            notifyUser(JSON.parse(error.response.data).errors[0].message, "error");
        }
        // dispatch(updateRoom(roomId, { date_available: date.format("YYYY-MM-DD") }));
    }

    const handelDateAvailableChange = (date, dateString, roomId) => {
        dispatch(updateRoom(roomId, { date_available: date.format("YYYY-MM-DD") }));
    };

    const columns = [
        {
            title: 'Home Name',
            dataIndex: 'homeName',
            // sorter: {
            //     compare: (a, b) => a.homeName - b.homeName,
            //     multiple: 4,
            // },
            render: (text, roomId) => (
                (<a className="home-name" href={`/dashboard/home-detail/${roomId.roomId}`}>{text}</a>)
                // <Space size="middle">
                //   <Link to={`/admin/partners/communities/${homeId}/rooms/${room.key}`}>{text}</Link>
        
                // </Space>
            )
        },
        {
            title: 'Room Name',
            dataIndex: 'roomName',
            // sorter: {
            //     compare: (a, b) => a.roomName - b.roomName,
            //     multiple: 3,
            // },
        },
        {
            title: 'Pricing',
            dataIndex: 'pricing',
            // sorter: {
            //     compare: (a, b) => a.pricing - b.pricing,
            //     multiple: 2,
            // },
            // render:()=>{

            // }
        },
        {
            title: 'Floor Level',
            dataIndex: 'floorLevel',
            // sorter: {
            //     compare: (a, b) => a.floorLevel - b.floorLevel,
            //     multiple: 1,
            // },
        },
        {
            title: 'Room Care Type',
            dataIndex: 'roomCareType',
            // sorter: {
            //     compare: (a, b) => a.roomCareType - b.roomCareType,
            //     multiple: 1,
            // },
        },
        {
            title: 'Room Type',
            dataIndex: 'room_type',
            // sorter: {
            //     compare: (a, b) => a.room_type - b.room_type,
            //     multiple: 1,
            // },
        },
        {
            title: 'Bathroom Type',
            dataIndex: 'bathroom_type',
            // sorter: {
            //     compare: (a, b) => a.room_type - b.room_type,
            //     multiple: 1,
            // },
        },
        {
            title: 'Availability Date',
            dataIndex: 'availability',
            // sorter: {
            //     compare: (a, b) => a.availability - b.availability,
            //     multiple: 1,
            // },
            // render: (text) => {
            //     if (!text) {
            //         return "N/A";
            //     }
            //     var date = new Date(text);
            //     var year = date.getFullYear();

            //     var month = (1 + date.getMonth()).toString();
            //     month = month.length > 1 ? month : '0' + month;

            //     var day = date.getDate().toString();
            //     day = day.length > 1 ? day : '0' + day;

            //     return (
            //         <Space size="middle">
            //             {`${month}/${day}/${year}`}
            //         </Space>
            //     )
            // }
        },
    ];

    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }

    return (
        <React.Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>Client</Breadcrumb.Item>
                <Breadcrumb.Item>{humanize(userData.name)}</Breadcrumb.Item>
                <Breadcrumb.Item>Available Rooms</Breadcrumb.Item>
            </Breadcrumb>
            <div>

                <Table loading={primaryClientLoaded || loading} columns={columns} dataSource={availableRooms} onChange={onChange} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AvailableRooms);
