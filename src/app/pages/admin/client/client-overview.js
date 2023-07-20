

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import UserService from "../../../services/user-service";
import API from "../../../redux/api/lead-client-api";
import { humanize } from "../../../helpers/string-helper";
import { Breadcrumb, Typography, Space, Button, Card, Row, Col, Spin, Descriptions } from "antd";
import { residentMoveTimeFrameOptions } from "../../../constants/defaultValues";


const { Text, Link } = Typography;

const ClientOverview = ({ history }) => {
    const [primaryClientLoaded, setPrimaryClientLoaded] = useState(false);

    const [clientDetails, setClientDetails] = useState({});

    const user = UserService.getAdminUser();

    const formatNumber = (e) => {
        if (e) {
            var x = e.toString().replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

        }
    }


    useEffect(() => {
        !primaryClientLoaded && getPrimaryClient();
    }, [primaryClientLoaded]);

    const getPrimaryClient = async () => {
        let leadClient = await API.listAllLeadClients({ fields: "*,second_contact.*,third_contact.*,primary_resident.*,second_resident.*", filter: { user: { _eq: user.id } }, limit: 1 });
        setClientDetails(leadClient.data[0]);
        console.log(leadClient.data[0]);
        setPrimaryClientLoaded(true);
    }


    return (
        <>
            <Spin spinning={!primaryClientLoaded} size="large">
                <Row className="admin-countbox">
                    <Col xs={12} sm={12} lg={12}>
                        <Breadcrumb>
                            <Breadcrumb.Item>Client</Breadcrumb.Item>
                            <Breadcrumb.Item className="cap-letter">{humanize(clientDetails.name)}</Breadcrumb.Item>
                            <Breadcrumb.Item>Overview</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col xs={12} sm={12} lg={12}>
                        {/* <Space className="btn-group-right">
                            <Button href={'/admin/clients/change-password'}>Change Password</Button>
                        </Space> */}
                        <Space className="btn-group-right">
                            <Button href={'/dashboard/admin/clients/assessment'}>Go to assessment</Button>
                        </Space>
                    </Col>
                </Row>
                <Card title="Client Details" className="client-details"  >
                    <div className="client-list"><Text>Client Name :</Text> <Text className="cap-letter" strong>{humanize(clientDetails.name)}</Text></div>
                    <div className="client-list"><Text>Client Code :</Text> <Text strong>{humanize(clientDetails.client_code)}</Text></div>
                    <div className="client-list"><Text>Resident Name :</Text> <Text strong>{clientDetails.primary_resident && humanize(clientDetails.primary_resident.name)}</Text></div>
                    <div className="client-list"><Text>Relationship :</Text> <Text strong>{humanize(clientDetails.relationship)}</Text></div>
                    <div className="client-list"><Text>Phone :</Text> <Text strong>{formatNumber(clientDetails.phone)}</Text></div>
                    <div className="client-list"><Text>Cell :</Text> <Text strong>{formatNumber(clientDetails.cell)} </Text></div>
                    <div className="client-list"><Text>Email :</Text> <Text strong>{clientDetails.email}</Text></div>
                    <div className="client-list"><Text>Housing Type :</Text> <Text strong>{clientDetails.housing_type && clientDetails.housing_type.map((Item) => {
                        return humanize(Item)
                    }).join(', ')}</Text></div>
                    <div className="client-list"><Text>Location :</Text> <Text strong>{humanize(clientDetails.address)}</Text></div>
                    <div className="client-list"><Text>Status :</Text> <Text strong>{humanize(clientDetails.status)}</Text></div>
                    {/* <div className="client-list"><Text>Move Time Frame :</Text> <Text strong>{clientDetails.primary_resident && clientDetails.primary_resident.move_time_frame}</Text></div> */}
                    <div className="client-list"><Text>Move Time Frame :</Text> <Text strong>{clientDetails.primary_resident && (
                        residentMoveTimeFrameOptions.map((data, index) => {
                            if (data.value == clientDetails.primary_resident.move_time_frame) {
                                return data.text
                            }
                        })
                    )}</Text></div>
                    <div className="client-list"><Text>Lead Source :</Text> <Text className="cap-letter" strong>{humanize(clientDetails.lead_source)}</Text></div>
                    <div className="client-list"><Text>Referral Name :</Text> <Text className="cap-letter" strong>{humanize(clientDetails.referral_name)}</Text></div>
                    <div className="client-list"><Text>Physician's Report Primary Resident :</Text> <Text strong>{clientDetails.primary_resident && humanize(clientDetails.primary_resident.physicians_report)}</Text></div>
                    <div className="client-list"><Text>Physician's Report Secondary Resident :</Text> <Text strong>{clientDetails.second_resident && humanize(clientDetails.second_resident.physicians_report)}</Text></div>
                    {/* {residentMoveTimeFrameOptions} */}
                </Card>
            </Spin>

        </>

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

export default connect(mapStateToProps, mapDispatchToProps)(ClientOverview);
