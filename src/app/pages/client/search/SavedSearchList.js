

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signin } from "../../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../../services/notification-service";
import UserService from "../../../services/user-service";
import { createLeadClient } from "../../../redux/actions/lead-client-actions";
import API from "../../../redux/api/saved-search";
import { Breadcrumb, Empty, Form, Button, Card, Row, Col, Spin, Typography, Modal } from "antd";
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import moment from 'moment';
import { Link } from "react-router-dom";
import { humanize } from "../../../helpers/string-helper";
import SavedSearchCard from "./SavedSearchCard";
const { Text, Title } = Typography;


const SavedSearchList = ({ history }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [formPrimaryContact] = Form.useForm();

    const [savedSearch, setSavedSearch] = useState([]);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [primaryClientLoaded, setPrimaryClientLoaded] = useState(true);

    const user = UserService.getLoggedInUser()
    useEffect(() => {
        primaryClientLoaded && getPrimaryClient();
    }, [primaryClientLoaded]);


    const getPrimaryClient = async () => {
        let leadClient = await API.savedSearch({ fields: "*" });
        let TempSaveSearchData = leadClient.data;
        setSavedSearch(TempSaveSearchData);
        setPrimaryClientLoaded(false);
    }
    function onChange(checked) {
        console.log(`switch to ${checked}`);
    }

    const deleteSavedSearch = async (Id) => {
        await API.deleteSavedSearch(Id);
        setPrimaryClientLoaded(true);
    }

    const mapContent = (Item) => {
        let entry = 1;
        return (
            Object.entries(Item).map((Key, Value) => {
                let content;
                if (Key[1] !== null && Key[1] !== '' && Key[0] !== 'id' && Key[0] !== 'client' && Key[0] !== 'title' && Key[0] !== 'date_created' && Key[0] !== 'address' && Key[0] !== 'lat' && Key[0] !== 'lng' && entry <= 3) {
                    entry += 1;
                    content = <div key={Value}><Text strong>{humanize(Key[0])} :</Text> <Text >{
                        Key[0] === "date_created" ? moment(Key[1]).format('MM-DD-YYYY') :
                            typeof Key[1] !== 'object' ? Key[1] :
                                Key[1].map((item) => {
                                    return (
                                        humanize(item)
                                    )
                                }).join(', ')
                    }</Text></div>
                }
                return content
            })
        );
    }
    const mapModalContent = (Item) => {
        return (
            Object.entries(Item).map((Key, Value) => {
                let content;
                if (Key[1] !== null && Key[1] !== '') {

                    content = <div key={Value}><Text strong>{humanize(Key[0])} :</Text> <Text >{
                        Key[0] === "date_created" ? moment(Key[1]).format('MM-DD-YYYY') :
                            typeof Key[1] !== 'object' ? Key[1] :
                                Key[1].map((item) => {
                                    return (
                                        humanize(item)
                                    )
                                }).join(', ')
                    }</Text></div>
                }
                return content
            })
        );
    }
    const showDetailModal = () => {
        setIsDetailModalVisible(!isDetailModalVisible);
    }

    return (
        <Spin spinning={primaryClientLoaded} size="large">
            <div className="save-search-page">
                <Breadcrumb>
                    <Breadcrumb.Item>Client</Breadcrumb.Item>
                    <Breadcrumb.Item>{humanize(user.client[0].name)}</Breadcrumb.Item>
                    <Breadcrumb.Item>Saved Search</Breadcrumb.Item>
                </Breadcrumb>
                <Card className="card-wrap">
                    <Row gutter={24}>
                        {savedSearch.length !== 0 ?
                            savedSearch.map((item, index) => {
                                return (
                                    <Col className="gutter-row" xs={24} sm={12} md={8} lg={6} xl={6} key={index}>
                                        <SavedSearchCard data={item} deleteSavedSearch={deleteSavedSearch} />
                                        {/* <Card className="save-search-card">
                                            <div className="card-inner">
                                                <div className="card-header"><span>
                                                    <Title level={3}>{humanize(item.title)}</Title>
                                                </span>
                                                    <div className="edit-option">
                                                        <Link onClick={() => deleteSavedSearch(item.id)}>
                                                            <CloseOutlined />
                                                        </Link>
                                                    </div>
                                                </div>
                                                {item.state !== null && item.city !== null ?
                                                    <p style={{ marginTop: 20 }}>
                                                        <span>{item.city !== null ? item.city : ''}, {item.state !== null ? item.state : ''}</span>
                                                    </p>
                                                    : ''}

                                                <div className="card-content">
                                                    {mapContent(item)}
                                                </div>
                                                <div className="card-footer">
                                                   
                                                    <a
                                                        onClick={showDetailModal}
                                                        style={{ color: "#1B75BC" }}
                                                    >
                                                        <EyeOutlined />
                                                    </a>
                                                </div>
                                                <Modal footer={null} title="Details" visible={isDetailModalVisible} onOk={showDetailModal} onCancel={showDetailModal}>
                                                    <div>
                                                        {mapModalContent(item)}
                                                    </div>
                                                </Modal>
                                            </div>
                                        </Card> */}
                                    </Col>
                                );
                            })
                            : <Col xs={24} md={24} >
                                <Empty />
                            </Col>}
                        {/* {savedSearch.map((item, index) => {
                            return (
                                <Col className="gutter-row" xs={24} sm={12} md={8} lg={6} xl={6} key={index}>
                                    <Card className="save-search-card">
                                        <div className="card-inner">
                                            <div className="card-header"><span>
                                                <Title level={3}>{humanize(item.title)}</Title>
                                            </span>
                                                <div className="edit-option">
                                                    <Link onClick={() => deleteSavedSearch(item.id)}>
                                                        <CloseOutlined />
                                                    </Link>
                                                </div>
                                            </div>
                                            {item.state !== null && item.city !== null ?
                                                <p style={{ marginTop: 20 }}>
                                                    <span>{item.city !== null ? item.city : ''}, {item.state !== null ? item.state : ''}</span>
                                                </p>
                                                : ''}

                                            <div className="card-content">
                                                {mapContent(item)}
                                            </div>
                                            <div className="card-footer">
                                                <Button size="large" className="search-btn" href={`/admin/clients/community/search/${item.id}`}>
                                                    Run Search
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })} */}
                    </Row>
                </Card>
            </div>
        </Spin>

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

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchList);
