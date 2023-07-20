import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
    listAllLeadContacts,
    updateLeadContact,
} from "../../../../redux/actions/lead-contact-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { notifyUser } from "../../../../services/notification-service";
import { List, Divider, Row, Col, Button, PageHeader, Table, Tag, Space, Breadcrumb, Card, Descriptions, Form, Select, Input, Tooltip, } from "antd";
import { compose } from "redux";
import { EditOutlined } from "@ant-design/icons";
import { data } from "jquery";
import { humanize } from "../../../../helpers/string-helper";
import { loadCurrentLoggedInUser, updateUser, } from "../../../../redux/actions/user-actions";
import UploadDocuments from "../../../../components/upload-documents";
import Config from "../../../../config";
import fileAPI from "../../../../redux/api/file-api";
import { update } from "lodash";
import UserService from "../../../../services/user-service";

const PartnersLeadContact = ({ leadContactList, leadContactListLoading, currentLoggedInUser, userUpdated, }) => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [documentList, setdDocumentList] = useState([]);
    const [loading, setLoading] = useState(false);


    const user = UserService.getAdminUser();

    const [filters, setFilters] = useState({

        "user_created": {
            "_eq": user.id
        }

    });

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, leadContact) => (
                <Space size="middle">
                    <Link className="cap-letter" to={`/admin/partners/community/lead-contacts/${leadContact.key}`}>{text}</Link>
                </Space>
            ),
        },
        {
            title: "Community",
            dataIndex: "home_name",
            key: "home_name",
            render: (homes, leadContact) => (
                <>
                    {homes.map((item, index) => {
                        return item.homes_id && item.homes_id.name
                    }).join(', ')}
                </>
                // <Space size="middle">
                //     <Link to={`/admin/partners/communities/${leadContact.home_id}`}>{text}</Link>
                // </Space>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text, leadContact) => <Space size="middle">{text}</Space>,
        },

        {
            title: "Cell",
            dataIndex: "phone",
            key: "phone",
            render: (text, leadContact) => <Space size="middle">{formatNumber(text)}</Space>,
        },

        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
            render: (text) => <Space size="middle">{`${text}`}</Space>,
        },

        // {
        //     title: "Status",
        //     dataIndex: "status",
        //     key: "status",
        //     render: (text) => (
        //         <Space>
        //             <Tag color={text == "published" ? "green" : "red"}>
        //                 {humanize(text)}
        //             </Tag>
        //         </Space>
        //     ),
        // },
        {
            title: "Action",
            key: "action",
            render: (text, home) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Link to={`/admin/partners/community/lead-contacts/${home.key}`}>
                            <EditOutlined />
                        </Link>
                    </Tooltip>

                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (!currentLoggedInUser || !currentLoggedInUser.contract || !currentLoggedInUser.contract.id || userUpdated) {

            dispatch(loadCurrentLoggedInUser({ fields: "*,contract.*" }));
        }
        setdDocumentList(
            currentLoggedInUser && currentLoggedInUser.contract
                ? [
                    {
                        uid: currentLoggedInUser.contract.id,
                        id: currentLoggedInUser.contract.id,
                        status: "done",
                        url: `${Config.API}/assets/${currentLoggedInUser.contract.id}`,
                        name: currentLoggedInUser.contract.filename_download,
                    },
                ]
                : []
        );

        dispatch(listAllLeadContacts({ 'fields': ["*", "home.*,homes.homes_id.*"], filter: filters }));
        if (userUpdated) {
            setLoading(false);
        }

        return () => {
            console.log("Communities Unmounting");
        };
    }, [currentLoggedInUser, userUpdated]);

    const handleSave = async (values) => {
        setLoading(true);
        var _contract = null;
        _contract = await getFilesArray(documentList);
        values.contract = _contract;
        await dispatch(updateUser(currentLoggedInUser.id, values));

        //window.location.reload();
    };

    const handelDocumentChange = ({ fileList }) => {
        setdDocumentList(fileList);
    };

    const getFilesArray = async (fileList) => {
        if (fileList.length) {
            let file = fileList[0];
            if (file.id) {
                return file.id;
            } else {
                const response = await fileAPI.uploadFile(file);
                return response.data.id;
            }
        }
    };

    const formatNumber = (e) => {
        if (e) {
            var x = e.toString().replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    
        }
    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/admin">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/admin/partners">Partners</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/admin/partner/overview">{humanize(user.first_name)} {humanize(user.last_name)}</Link></Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="">Lead Contacts</Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Row gutter={30}>

                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        title="Lead Contacts"
                        extra={
                            <Button href={"/dashboard/admin/partners/community/lead-contacts/add"}>
                                Add Lead Contact
                            </Button>
                        }
                    >
                        <Table
                            columns={columns}
                            loading={leadContactListLoading}
                            dataSource={leadContactList.map(
                                ({
                                    first_name,
                                    last_name,
                                    phone,
                                    email,
                                    // status,
                                    id,
                                    job_title,
                                    homes

                                }) => {
                                    return {
                                        name: first_name + " " + last_name,
                                        phone,
                                        email,
                                        key: id,
                                        // status,
                                        job_title,
                                        home_name: homes && homes,
                                        // home_id: home.id
                                    };
                                }
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

function mapStateToProps(state) {
    return {
        leadContactList: state.leadContact.leadContactList,
        leadContactListLoading: state.leadContact.leadContactListLoading,
        currentLoggedInUser: state.user.currentLoggedInUser,
        userUpdated: state.user.userUpdated,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        listAllLeadContacts: () => dispatch(listAllLeadContacts()),
        updateLeadContact: () => dispatch(updateLeadContact()),
        loadCurrentLoggedInUser: () => dispatch(loadCurrentLoggedInUser()),
        updateUser: () => dispatch(updateUser()),
    };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    PartnersLeadContact
);
