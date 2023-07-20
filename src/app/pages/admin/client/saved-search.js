

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
import SavedSearchCard from "./saved-search-card";
const { Text, Title } = Typography;


const SavedSearch = ({ history }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [formPrimaryContact] = Form.useForm();

    const [savedSearch, setSavedSearch] = useState([]);
    const [primaryClientLoaded, setPrimaryClientLoaded] = useState(true);

    const user = UserService.getAdminUser()
    useEffect(() => {
        primaryClientLoaded && getPrimaryClient();
    }, [primaryClientLoaded]);


    const getPrimaryClient = async () => {
        let leadClient = await API.savedSearch({ fields: "*", filter: { client: { _eq: user.client[0].id } } });
        let TempSaveSearchData = leadClient.data.filter((Item, Index) => {
            return Item.client === user.client[0].id
        });
        setSavedSearch(TempSaveSearchData);
        setPrimaryClientLoaded(false);
    }

    const deleteSavedSearch = async (Id) => {
        await API.deleteSavedSearch(Id);
        setPrimaryClientLoaded(true);
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
                                                    <Button size="large" className="search-btn" href={`/admin/clients/community/search/${item.id}`}>
                                                        Run Search
                                                    </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearch);
