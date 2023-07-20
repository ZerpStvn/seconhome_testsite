

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signin } from "../../../redux/actions/auth-actions";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../../services/notification-service";
import UserService from "../../../services/user-service";
import { createLeadClient } from "../../../redux/actions/lead-client-actions";
import API from "../../../redux/api/lead-client-api";
import UserAPI from "../../../redux/api/user-api";
import Config from "../../../config";
import { updateLead } from "../../../redux/actions/lead-actions";
import { mileageOptions, clientRelationShipOptions, leadSourceOptions } from "../../../constants/defaultValues";
import { Breadcrumb, Tabs, Popconfirm, message, Collapse, Form, Input, Select, Table, Checkbox, Button, Card, Row, Col, Spin, List, Avatar } from "antd";
import Icon from "@ant-design/icons";
import { PhoneOutlined, LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { EditSvg } from "../../../components/shared/svg/edit";
import { EyeSvg } from "../../../components/shared/svg/eye";
import { PenSvg } from "../../../components/shared/svg/pen";
import { humanize } from "../../../helpers/string-helper";
import { listAllLikedLeadClients, setLeadClientListLoading, } from "../../../redux/actions/lead-client-actions";

const { TabPane } = Tabs;
const AdminListFavorite = ({ history }) => {
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [allLeads, setAllLeads] = useState({});

    const [likeLeadData, setLikeLeadData] = useState([]);
    const [disLikeLeadData, setDisLikeLeadData] = useState([]);

    const [primaryClientLoaded, setPrimaryClientLoaded] = useState(true);

    const user = UserService.getAdminUser();


    useEffect(() => {

        primaryClientLoaded && getPrimaryClient();
    }, [primaryClientLoaded]);


    function popConfirmCancel(e) {
        console.log(e);
        message.error('Canceled');
    }

    const getPrimaryClient = async () => {
        var leadClient = await API.listAllLeadClients({ fields: "leads.*,leads.home.*", filter: { user: { _eq: user.id } } });
        if (leadClient.data) {
            console.log(leadClient);
            let leadData = leadClient.data[0].leads;
            let likedData = [];
            let disLikedData = [];
            leadData.forEach((Item, index) => {
                if (Item.is_liked) {
                    if (Item.home) {
                        likedData.push({
                            key: `like_${index}`,
                            name: Item.home.name,
                            address: Item.home.address_line_1,
                            city: Item.home.city,
                            state: Item.home.state,
                            clientStatus: humanize(Item.approval.replaceAll('_', ' ')),
                            verification: humanize(Item.home.verification),
                            action: <>
                                <Select
                                    style={{ width: "130px" }}
                                    defaultValue={Item.is_liked}
                                    onChange={(text) => likeHandler(Item.id, text)}
                                >
                                    <Select.Option value={1}>Like</Select.Option>
                                    <Select.Option value={0}>Dislike</Select.Option>
                                    <Select.Option value={null}>Neither</Select.Option>
                                </Select>
                                {/* <Popconfirm
                                title="Are you sure to Dislike?"
                                onConfirm={() => likeHandler(Item.id, false)}
                                onCancel={popConfirmCancel}
                                okText="Yes"
                                cancelText="No"
                            >

                                <a href="#">Dislike <DislikeOutlined /></a>
                            </Popconfirm> */}
                            </>,
                        });
                    }

                }
                else if (Item.is_liked === 0) {
                    if (Item.home) {
                        disLikedData.push({
                            key: `dislike_${index}`,
                            name: Item.home.name,
                            address: Item.home.address_line_1,
                            city: Item.home.city,
                            state: Item.home.state,
                            clientStatus: humanize(Item.approval.replaceAll('_', ' ')),
                            verification: humanize(Item.home.verification),
                            action: <>
                                <Select
                                    style={{ width: "130px" }}
                                    defaultValue={Item.is_liked}
                                    onChange={(text) => likeHandler(Item.id, text)}
                                >
                                    <Select.Option value={1}>Like</Select.Option>
                                    <Select.Option value={0}>Dislike</Select.Option>
                                    <Select.Option value={null}>Neither</Select.Option>
                                </Select>
                                {/* <Popconfirm
                                title="Are you sure to Dislike?"
                                onConfirm={() => likeHandler(Item.id, true)}
                                onCancel={popConfirmCancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <a href="#">Like <LikeOutlined /></a>
                            </Popconfirm> */}
                            </>,
                        });
                    }

                }
            });
            setLikeLeadData(likedData);
            setDisLikeLeadData(disLikedData);
            setPrimaryClientLoaded(false);

        }
    }

    const likeHandler = async (Id, likeValue) => {
        // setPrimaryClientLoaded(true);
        const data = { is_liked: likeValue };
        try {
            await dispatch(updateLead(Id, data));
            setPrimaryClientLoaded(true);
        } catch (e) {
            console.log(e);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            // sorter: {
            //     compare: (a, b) => a.name - b.name,
            //     multiple: 4,
            // },
        },
        {
            title: 'Address',
            dataIndex: 'address',
            // sorter: {
            //     compare: (a, b) => a.address - b.address,
            //     multiple: 3,
            // },
        },
        {
            title: 'City',
            dataIndex: 'city',
            // sorter: {
            //     compare: (a, b) => a.city - b.city,
            //     multiple: 2,
            // },
        },
        // {
        //     title: 'State',
        //     dataIndex: 'state',
        //     sorter: {
        //         compare: (a, b) => a.state - b.state,
        //         multiple: 1,
        //     },
        // },
        {
            title: 'Client Status',
            dataIndex: 'clientStatus',
            // sorter: {
            //     compare: (a, b) => a.clientStatus - b.clientStatus,
            //     multiple: 1,
            // },
        },
        // {
        //     title: 'Verification',
        //     dataIndex: 'verification',
        //     sorter: {
        //         compare: (a, b) => a.verification - b.verification,
        //         multiple: 1,
        //     },
        // },
        {
            title: 'Action',
            dataIndex: 'action',
            // sorter: {
            //     compare: (a, b) => a.action - b.action,
            //     multiple: 1,
            // },
        },
    ];


    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }

    return (
        <React.Fragment>
            {console.log('ll:',user)}
            <Breadcrumb>
                <Breadcrumb.Item> <Link to="/admin">Client </Link></Breadcrumb.Item>
                <Breadcrumb.Item ><Link className="cap-letter" to="/admin/client/overview">{user && user.client && user.client.length > 0 && user.client[0].name}</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Favorites/Dislikes</Breadcrumb.Item>
            </Breadcrumb>
            <div>
                <Tabs defaultActiveKey="favorites" onChange={() => console.log(0)}>
                    <TabPane tab="Favorites" key="favorites">
                        <Table columns={columns} dataSource={likeLeadData} onChange={onChange} loading={primaryClientLoaded} />
                    </TabPane>

                    <TabPane tab="Dislikes" key="dislikes">
                        <Table columns={columns} dataSource={disLikeLeadData} onChange={onChange} loading={primaryClientLoaded} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminListFavorite);
