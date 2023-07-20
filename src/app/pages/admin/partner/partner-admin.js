import { Space, Input, Button, Card, Row, Col, Spin, List, Avatar, Popconfirm, message } from "antd";
import Icon from "@ant-design/icons";
import { EyeSvg } from "../../../components/shared/svg/eye";
import { DeleteOutlined } from '@ant-design/icons';
import { PenSvg } from "../../../components/shared/svg/pen";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signin } from "../../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../../services/notification-service";
import { humanize } from "../../../helpers/string-helper";
import userApi from "../../../redux/api/user-api";
import homeApi from "../../../redux/api/home-api";
import userService from "../../../services/user-service";

const EyeIcon = (props) => <Icon component={EyeSvg} {...props} />;
const PenIcon = (props) => <Icon component={PenSvg} {...props} />;

const Dashboard = ({ history }) => {
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [numOfTestimonials, setnNumOfTestimonials] = useState(3);
    const [filteredPartnerList, setFilteredPartnerList] = useState([]);
    const [partnerList, setPartnerList] = useState([]);
    const [partnerListLoading, setPartnerListLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPropertyCount, setTotalPropertyCount] = useState(0);

    const updateMedia = () => {
        var num = window.innerWidth > 1199 ? 3 : (window.innerWidth < 1199 && window.innerWidth > 767) ? 2 : 1
        setnNumOfTestimonials(num);
    };
    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        partnerListLoading && getPartners();
        return () => window.removeEventListener("resize", updateMedia);
    }, [partnerListLoading]);

    const getPartners = async () => {
        const partners = await userApi.loadAllUsers({ meta: 'filter_count', limit: -1, filter: { role: { _eq: "8091cbf7-fafb-4255-b1be-42a2e1a6d436" } } })
        console.log(partners, "partnerspartnerspartnerspartners");
        if (partners.data) {
            const homeData = await homeApi.listAll({ meta: 'filter_count', limit: 1, filter: { status: { _eq: 'published' } } });

            setPartnerList(partners.data);
            setFilteredPartnerList(partners.data);
            setPartnerListLoading(false);
            setTotalCount(partners.meta.filter_count)
            if (homeData.meta) {
                setTotalPropertyCount(homeData.meta.filter_count)
            }
        }
    }

    const setAdminUser = async (partner) => {
        if (partner) {
            await userService.setAdminUser(partner);
            history.push(`/admin/partner/overview`);
        }
    }
    const editPartnerUser = async (partner) => {
        if (partner) {
            await userService.setAdminUser(partner);
            history.push(`/admin/partner/edit`);
        }
    }

    const deletePartner = async (Id) => {
        await userApi.deleteUser(Id)
        setPartnerListLoading(true);
    }
    const searchPartner = (e) => {
        let filteredPartnertList = partnerList.filter(item => {
            if (item.first_name.toLowerCase().includes(e.target.value.toLowerCase())) {
                return item
            }
            if (item.last_name.toLowerCase().includes(e.target.value.toLowerCase())) {
                return item
            }
            if (item.email.toLowerCase().includes(e.target.value.toLowerCase())) {
                return item
            }

        });
        setFilteredPartnerList(filteredPartnertList);
    }


    return (
        <div className="admin-dashboard">
            {/* <Space className="btn-group-right">
                <Button href={'/admin/partner/add'}>Add Partner</Button>
            </Space> */}
            <Spin spinning={partnerListLoading} size="large">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="admin-countbox">
                    <Col xs={24} sm={24} lg={24}>
                        <Space className="btn-group-right">
                            <Button href={'/dashboard/admin/partner/add'}>Add Partner</Button>
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <div className="countbox">
                            <span className="count">{totalCount}</span>
                            <p>Total Partners</p>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <div className="countbox green-countbox">
                            <span className="count">{totalPropertyCount}</span>
                            <p>Listed Property</p>
                        </div>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="dashboard-listings">
                    <Col span={24}>
                        <Card title="Total Partners" extra={
                            <Input placeholder="Search by name or email" onChange={searchPartner} />
                        }>
                            <List
                                itemLayout="horizontal"
                                dataSource={filteredPartnerList}
                                pagination={{
                                    onChange: page => {
                                        console.log(page);
                                    },
                                    pageSize: 6,
                                }}
                                renderItem={item => (

                                    <List.Item
                                        actions={[<a className="list-edit" onClick={() => editPartnerUser(item)} key="list-edit"><PenIcon /></a>, <a className="list-view" key="list-view" onClick={() => setAdminUser(item)}><EyeIcon /></a>, <a className="list-view" key="list-view" ><Popconfirm onConfirm={() => deletePartner(item.id)} title="Are you sure you want to delete the partner?"> <DeleteOutlined /></Popconfirm></a>]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={<a onClick={() => setAdminUser(item)}>{`${humanize(item.first_name)} ${humanize(item.last_name)}`}</a>}

                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        signin: (email, password) => dispatch(signin(email, password)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
