import React, { useState } from "react";
import { Breadcrumb, List, Avatar } from "antd";
import UserService from "../../../services/user-service";
import { humanize } from "../../../helpers/string-helper";

const data = [
    {
        title: "Ant Design Title 1",
    },
    {
        title: "Ant Design Title 2",
    },
    {
        title: "Ant Design Title 3",
    },
    {
        title: "Ant Design Title 4",
    },
];

const PartnerInbox = () => {
    const [partnerDetails, setPartnerDetails] = useState(UserService.getAdminUser());
    return (
        <React.Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>Partner</Breadcrumb.Item>
                <Breadcrumb.Item>{humanize(partnerDetails.first_name)} {humanize(partnerDetails.last_name)}</Breadcrumb.Item>
                <Breadcrumb.Item>Inbox</Breadcrumb.Item>
            </Breadcrumb>
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                }
                                title={<a href="https://ant.design">{item.title}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />
            </div>
        </React.Fragment>
    );
};

export default PartnerInbox;
