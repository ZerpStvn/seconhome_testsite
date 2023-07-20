import React from "react";
import Icon from "@ant-design/icons";
import { HomeSvg } from "../../shared/svg/icons";
import { DashboardSvg } from "../../shared/svg/dashboard";
import { PatientSvg } from "../../shared/svg/patient";
import userService from "../../../services/user-service";
import { CommentOutlined, UserOutlined, SolutionOutlined, CheckSquareOutlined, FormOutlined, CalculatorOutlined, PaperClipOutlined, TeamOutlined, HomeOutlined } from "@ant-design/icons";
const HomeIcon = (props) => <Icon component={HomeSvg} {...props} />;
const DashboardIcon = (props) => <Icon component={DashboardSvg} {...props} />;
const PatientIcon = (props) => <Icon component={PatientSvg} {...props} />;


const adminClientOptions = [

  {
    key: "/admin/client/overview",
    label: "Overview",
    leftIcon: <UserOutlined />
  },
  {
    key: "/admin/clients/assessment",
    label: "Assessment",
    leftIcon: <SolutionOutlined />
  },
  {
    key: "/admin/clients/community/search",
    label: "Communities",
    leftIcon: <HomeOutlined />,
    activeMenuKey: "admin_communities",
    children: [
      {
        key: "/admin/clients/community/search",
        label: "Search",
      },
      {
        key: "/admin/clients/community/saved-search",
        label: "Saved Search",
      },
      {
        key: "/admin/clients/community/favorites",
        label: "Favorites / Dislikes",
      },
      {
        key: "/admin/clients/community/available-rooms",
        label: "Available Rooms",
      },
      {
        key: "/admin/clients/community/tours",
        label: "Tours",
      }
    ]
  },

  // {
  //   key: "/admin/clients/inbox",
  //   label: "Inbox",
  //   leftIcon: <CommentOutlined />
  // },
  // {
  //   key: "/admin/clients/notes",
  //   label: "Notes",
  //   leftIcon: <FormOutlined />
  // },
  // {
  //   key: "/admin/clients/tasks",
  //   label: "Tasks",
  //   leftIcon: <CheckSquareOutlined />
  // },

  // {
  //   key: "/admin/clients/invoices",
  //   label: "Invoices",
  //   leftIcon: <CalculatorOutlined />
  // },
];

const adminPartnerOptions = [

  {
    key: "/admin/partner/overview",
    label: "Overview",
    leftIcon: <UserOutlined />
  },
  {
    key: "/admin/partners/communities",
    label: "Communities",
    leftIcon: <HomeOutlined />,
    activeMenuKey: "partner_communities",
    children: [
      {
        key: "/admin/partners/communities",
        label: "All Communities",
      },
      {
        key: "/admin/partners/community/availability",
        label: "Availability",
      },
      // {
      //   key: "/admin/partners/community/rates",
      //   label: "Rates",
      // },
      {
        key: "/admin/partners/community/lead-contacts",
        label: "Lead Contacts",
      },
      {
        key: "/admin/partners/community/tours",
        label: "Tours",
      },
    ]
  },
  // {
  //   key: "/admin/partners/inbox",
  //   label: "Inbox",
  //   leftIcon: <CommentOutlined />
  // },

  {
    key: "/admin/partners/client-contacts",
    label: "Client Contacts",
    leftIcon: <TeamOutlined />
  },
  // {
  //   key: "/admin/partners/notes",
  //   label: "Notes",
  //   leftIcon: <FormOutlined />
  // },
  // {
  //   key: "/admin/partners/tasks",
  //   label: "Tasks",
  //   leftIcon: <CheckSquareOutlined />
  // },
  // {
  //   key: "/admin/partners/attachments",
  //   label: "Attachments",
  //   leftIcon: <PaperClipOutlined />
  // },
  // {
  //   key: "/admin/partners/invoices",
  //   label: "Invoices",
  //   leftIcon: <CalculatorOutlined />
  // },
];

export default {
  adminClientOptions,
  adminPartnerOptions
};
