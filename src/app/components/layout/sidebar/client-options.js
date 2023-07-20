import React from "react";
import Icon, {
  ApartmentOutlined,
  CarOutlined,
  HeartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { HomeSvg } from "../../shared/svg/icons";
import { DashboardSvg } from "../../shared/svg/dashboard";
import { PatientSvg } from "../../shared/svg/patient";
import {
  UserOutlined,
  DeliveredProcedureOutlined,
  HomeOutlined,
  MessageOutlined,
  FileAddOutlined,
  ReadOutlined,
} from "@ant-design/icons";
const HomeIcon = (props) => <Icon component={HomeSvg} {...props} />;
const DashboardIcon = (props) => <Icon component={DashboardSvg} {...props} />;
const PatientIcon = (props) => <Icon component={PatientSvg} {...props} />;

const clientOptions = [
  {
    key: "/all-communities",
    label: "All Communities",
    leftIcon: <HomeOutlined />,
  },
  {
    key: "/favorites",
    label: "Favorites",
    leftIcon: <HeartOutlined />,
  },

  {
    key: "/saved-searches",
    label: "Saved Searches",
    leftIcon: <SearchOutlined />,
  },
  {
    key: "/available-rooms",
    label: "Available Rooms",
    leftIcon: <ApartmentOutlined />,
  },
  {
    key: "/tours",
    label: "Tours",
    leftIcon: <CarOutlined />,
  },
  // {
  //   key: "/inbox",
  //   label: "Inbox",
  //   leftIcon: <MessageOutlined />,
  // },
  {
    key: "/profile",
    label: "Profile",
    leftIcon: <UserOutlined />,
  },
];

export default {
  clientOptions,
};
