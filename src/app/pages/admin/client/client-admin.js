

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signin } from "../../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../../services/notification-service";
import { humanize } from "../../../helpers/string-helper";
import { listAllLeadClients } from "../../../redux/actions/lead-client-actions";
import userAPI from "../../../redux/api/user-api";
import userService from "../../../services/user-service";

import { Space, Collapse, Form, Input, Select, Radio, Checkbox, Button, Card, Row, Col, Spin, Popconfirm, List, Avatar } from "antd";
import Icon from "@ant-design/icons";
import { PhoneOutlined, EnvironmentOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { EditSvg } from "../../../components/shared/svg/edit";
import { EyeSvg } from "../../../components/shared/svg/eye";
import { PenSvg } from "../../../components/shared/svg/pen";

const EditIcon = (props) => <Icon component={EditSvg} {...props} />;
const EyeIcon = (props) => <Icon component={EyeSvg} {...props} />;
const PenIcon = (props) => <Icon component={PenSvg} {...props} />;

const { Search } = Input;

const Dashboard = ({ history, leadClientList, leadClientListLoading, leadClientMeta }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState({ ClientId: "", loader: false });
    const [clientListLoading, setClientListLoading] = useState(true);
    const [inputVal, setInputVal] = useState("");
    const [leadClients, setLeadClients] = useState();


    useEffect(() => {
        (clientListLoading) && dispatch(listAllLeadClients({ meta: 'filter_count', limit: -1, filter: { user: { _nnull: null } } })).then(data => setClientListLoading(false));
        // 
    }, [clientListLoading]);

    useEffect(() => {
        if (leadClientList.length > 0) {
            setLeadClients(leadClientList)
        }
    }, [leadClientList]);

    const totalCount = leadClientMeta && leadClientMeta.filter_count;




    const setAdminUser = async (client) => {
        setLoading({ ClientId: client.id, loader: true });
        var user = await userAPI.loadUserById(client.user, { fields: ['*', 'client.*'] });
        if (user.data) {
            await userService.setAdminUser(user.data);
            history.push(`/admin/client/overview`);
        }

    }
    const deletePartner = async (Id) => {
        await userAPI.deleteClient(Id);
        setInputVal("");
        setClientListLoading(true)
    }

    const searchClient = (e) => {
        setInputVal(e.target.value.toLowerCase());
        let filteredClientList = leadClientList.filter(item => {
            if (item.name.toLowerCase().includes(e.target.value.toLowerCase())) {
                return item
            }
            if (item.email.toLowerCase().includes(e.target.value.toLowerCase())) {
                return item

            }
        });
        setLeadClients(filteredClientList);
    }

    return (
        <div className="admin-dashboard">

            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="admin-countbox">
                <Col xs={24} sm={24} lg={24}>
                    <Space className="btn-group-right">
                        <Button href={'/dashboard/admin/clients/add'}>Add Client</Button>
                    </Space>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <div className="countbox">
                        <span className="count">{totalCount}</span>
                        <p>Total Clients</p>
                    </div>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <div className="countbox green-countbox">
                        <span className="count">{totalCount}</span>
                        <p>Active Clients</p>
                    </div>
                </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="dashboard-listings">
                <Col xs={24} md={24} >
                    <Spin spinning={clientListLoading} size="large">
                        <Card title="Total Clients" extra={
                            <Input placeholder="Search by name or email" value={inputVal} onChange={searchClient} />
                        }>
                            <List
                                itemLayout="horizontal"
                                dataSource={leadClients}
                                pagination={{
                                    onChange: page => {
                                        console.log(page);
                                    },
                                    pageSize: 6,
                                }}
                                renderItem={item => (
                                    <List.Item
                                        actions={[<a onClick={() => setAdminUser(item)} className="list-edit" key="list-edit">{loading.loader && loading.ClientId === item.id ? <LoadingOutlined /> : <PenIcon />}</a>, <a className="list-view" key="list-view" ><Popconfirm onConfirm={() => deletePartner(item.id)} title="Are you sure you want to delete the Client?"> <DeleteOutlined /></Popconfirm></a>]}
                                    >
                                        <List.Item.Meta
                                            className="list-clients"
                                            avatar={<Avatar >{item.name.charAt(0)}</Avatar>}
                                            title={<a onClick={() => setAdminUser(item)}>{humanize(item.name)} </a>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Spin>

                </Col>
                {/* <Col xs={24} md={12}>
                    <Spin spinning={leadClientListLoading} size="large">
                        <Card title="Total Clients">
                            <List
                                itemLayout="horizontal"
                                dataSource={leadClientList}
                                pagination={{
                                    onChange: page => {
                                        console.log(page);
                                    },
                                    pageSize: 6,
                                }}
                                renderItem={item => (
                                    <List.Item
                                        actions={[<a onClick={() => setAdminUser(item)} className="list-edit" key="list-edit">{loading.loader && loading.ClientId === item.id ? <LoadingOutlined /> : <PenIcon />}</a>, <a className="list-view" key="list-view" ><Popconfirm onConfirm={() => deletePartner(item.id)} title="Are you sure you want to delete the client?"> <DeleteOutlined /></Popconfirm></a>]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar >{item.name.charAt(0)}</Avatar>}
                                            title={<a onClick={() => setAdminUser(item)}>{item.name}</a>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Spin>
                </Col> */}
            </Row>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        leadClientList: state.leadClient.leadClientList,
        leadClientListLoading: state.leadClient.leadClientListLoading,
        leadClientMeta: state.leadClient.leadClientMeta,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        listAllLeadClients: () => dispatch(listAllLeadClients()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
