import React, { useState } from "react";
import { Button, Tag, Select, Form, Input, Popover } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { leadApprovalOptions } from "../../../constants/defaultValues";
import { humanize } from "../../../helpers/string-helper";
const { TextArea } = Input;

const PartnerClientApproval = ({ value, lead, handelApprovalChange }) => {
    const [form] = Form.useForm();
    const [approval, setApproval] = useState(value);
    const [deniedRreason, setDeniedReason] = useState(lead.denied_reason);
    const handelSubmit = (values) => {
        if (!values.denied_reason) {
            values.denied_reason = null;
        }
        handelApprovalChange(values, lead.key)
    }
    const overlay = (
        <Form key={lead.key} form={form} layout={"vertical"} initialValues={lead} onFinish={handelSubmit} >
            <Form.Item label="Approval" name="approval">
                <Select style={{ width: "180px" }} onChange={setApproval}>
                    {leadApprovalOptions.map((option) => {
                        return (<Select.Option value={option.value}>{option.text}</Select.Option>)
                    })}
                </Select>
            </Form.Item>
            {(approval == "denied_other") &&
                <Form.Item label="Reason" name="denied_reason">
                    <TextArea onChange={(e) => { setDeniedReason(e.target.value) }} />
                </Form.Item>
            }

            <Form.Item>
                <Button type="primary" htmlType="submit"> Save </Button>
            </Form.Item>

        </Form>
    );
    return (
        <Popover placement="bottomLeft" content={overlay} trigger="click">
            <Tag>
                <a onClick={e => e.preventDefault()}>
                    {humanize(value)} <DownOutlined />
                </a>

            </Tag>
        </Popover>
    )
}
export default PartnerClientApproval;