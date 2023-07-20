import React from "react";
import Icon from "@ant-design/icons";
import { HomeSvg } from "../../shared/svg/icons";
import { DashboardSvg } from "../../shared/svg/dashboard";
import { PatientSvg } from "../../shared/svg/patient";
import { UserOutlined, CarOutlined, HomeOutlined, MessageOutlined, FileAddOutlined, ReadOutlined } from "@ant-design/icons";
const HomeIcon = (props) => <Icon component={HomeSvg} {...props} />;
const DashboardIcon = (props) => <Icon component={DashboardSvg} {...props} />;
const PatientIcon = (props) => <Icon component={PatientSvg} {...props} />;

const dashBoardOptions = [

  {
    key: "/owner/communities",
    label: "Communities",
    leftIcon: <HomeOutlined />,
  },
  {
    key: "/owner/availability",
    label: "Availability",
    leftIcon: <PatientIcon />,
  },
  {
    key: "/owner/leads",
    label: "Leads",
    leftIcon: <FileAddOutlined />,
  },
  {
    key: "/owner/tour",
    label: "Tours",
    leftIcon: <CarOutlined />,
  },
  // {
  //   key: "/owner/messages",
  //   label: "Inbox",
  //   leftIcon: <MessageOutlined />,
  // },
  {
    key: "/owner/profile",
    label: "Profile",
    leftIcon: <UserOutlined />,
  },
  // {
  //   key: "/owner/invoices",
  //   label: "Invoices",
  //   leftIcon: <ReadOutlined />,
  // },
];

export default {
  dashBoardOptions,
};
