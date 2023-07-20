import React, { useState } from "react";
import { listAll, setHomeListLoading, deleteHome, cloneHome, updateHome } from "../../../redux/actions/home-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../../services/notification-service";
import { List, Divider, Row, Col, Button, PageHeader, Table, Tag, Space, Breadcrumb, Tooltip, Popconfirm, Popover, Form, Input, Skeleton } from "antd";

const GetClonButtonContent = ({ id, user }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [cloneLoading, setCloneLoading] = useState(false);

    const handelSave = async (values) => {
        setCloneLoading(true)
        values.user_created = user.id;
        const response = await cloneHome(id, values);
        if (response) {
            values.user_created = user.id;
            await dispatch(updateHome(response, values));
            notifyUser("Community Clone is created", "success");
            setCloneLoading(false)
            dispatch(setHomeListLoading(true));
        }
    }

    // const handelSave = async (values) => {
    //     setCloneLoading(true);
    //     values.user_created = user.id;
    //     const response = await cloneHome(id, values);
    //     if (response) {
    //         notifyUser("Community Clone is created", "success")
    //         setCloneLoading(false)
    //         dispatch(setHomeListLoading(true));
    //     }
    // }
    return <>
        <Form form={form} layout={"horizontal"} onFinish={handelSave}>
            <Form.Item
                label="Community Name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: "Please Input Name!",
                        whitespace: true,
                    },
                ]}
            >
                <Input maxLength={255} placeholder="Name" />
            </Form.Item>
            <Form.Item>
                <Button loading={cloneLoading} type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
        </Form>

    </>
}
export default GetClonButtonContent;