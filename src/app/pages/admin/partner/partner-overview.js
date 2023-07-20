

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signin } from "../../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../../services/notification-service";
import UserService from "../../../services/user-service";
import { createLeadClient } from "../../../redux/actions/lead-client-actions";
import API from "../../../redux/api/lead-client-api";
import residentAPI from "../../../redux/api/resident-api";
import UserAPI from "../../../redux/api/user-api";
import Config from "../../../config";
import { humanize } from "../../../helpers/string-helper";
import { mileageOptions, clientRelationShipOptions, leadSourceOptions, residentGenderOptions, residentPetOptions, residentLanguageOptions, residentMoveTimeFrameOptions, residentBathroomOptions, residentBedroomOptions, residentHobbiesOptions, housingTypesOptions } from "../../../constants/defaultValues";
import { Breadcrumb, Typography, Form, Input, Select, Radio, Checkbox, Button, Card, Row, Col, Spin, List, Avatar, InputNumber } from "antd";
import Icon from "@ant-design/icons";
import { PhoneOutlined, EnvironmentOutlined, CaretRightOutlined } from "@ant-design/icons";
import { EditSvg } from "../../../components/shared/svg/edit";
import { EyeSvg } from "../../../components/shared/svg/eye";
import { PenSvg } from "../../../components/shared/svg/pen";
import { text } from "dom-helpers";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import userApi from "../../../redux/api/user-api";

const { Text, Link } = Typography;

const PartnerOverview = ({ history }) => {
    const [partnerListLoading, setPartnerListLoading] = useState(true);
    const [partnerDetails, setPartnerDetails] = useState({});
    useEffect(() => {
        partnerListLoading && getPartners();
    }, [partnerListLoading]);

    const getPartners = async () => {
        const partners = await UserService.getAdminUser();
        console.log(partners);
        setPartnerDetails(partners);
        setPartnerListLoading(false);

    }

    const formatNumber = (e) => {
        if (e) {
            var x = e.toString().replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

        }
    }

    return (
        <>
            {console.log(partnerDetails, "partnerDetails")}
            <Spin spinning={partnerListLoading} size="large">
                <Row gutter={30} className="content-header">
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Breadcrumb>
                            <Breadcrumb.Item>Partner</Breadcrumb.Item>
                            <Breadcrumb.Item className="cap-letter">{humanize(partnerDetails.first_name)} {humanize(partnerDetails.last_name)}</Breadcrumb.Item>
                            <Breadcrumb.Item>Overview</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8} className="text-right">
                        <Button href={"/dashboard/admin/partner/edit"}>Edit Partner</Button>
                        <Button href={"/dashboard/admin/partners/communities/add"}>Add Community</Button>
                    </Col>
                </Row>
                <Card title="Partner Details"  >
                    <div><Text>Name :</Text> <Text strong className="cap-letter">{humanize(partnerDetails.first_name)} {humanize(partnerDetails.last_name)}</Text></div>
                    <div><Text>Email :</Text> <Text strong>{partnerDetails.email}</Text></div>
                    <div><Text>Partner Code :</Text> <Text strong>{partnerDetails.code}</Text></div>
                    <div><Text>Contract :</Text> <Text strong>{humanize(partnerDetails.contract_status)}</Text></div>
                    <div><Text>Status :</Text> <Text strong>{humanize(partnerDetails.status)}</Text></div>
                    <div><Text>Verification :</Text> <Text strong>{humanize(partnerDetails.verification)}</Text></div>
                    <div><Text>Cell :</Text> <Text strong>{formatNumber(partnerDetails.cell)}</Text></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PartnerOverview);
