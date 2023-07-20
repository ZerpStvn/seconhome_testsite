import Login from "../pages/login/login";
import ForgotPassword from "../pages/login/forgot-password";
import ResetPassword from "../pages/login/reset-password";
import Homepage from "../pages/home-page/home-page";
import HomeDetails from "../pages/global-search/home-details";
import HomeDetail from "../pages/home-detail/home-detail";
import PageNotFoundError from "../pages/error/404";
import UnauthorizedError from "../pages/error/403";
import BackendServerError from "../pages/error/500";
import Dashboard from "../pages/home-owner/dashboard/dashboard";
import ListCommunities from "../pages/home-owner/communities/list-communities";
import EditCommunity from "../pages/home-owner/communities/edit-community";
import EditRoom from "../pages/home-owner/communities/rooms/edit-rooms";
import AddRoom from "../pages/home-owner/communities/rooms/add-room";
import EditStaff from "../pages/home-owner/communities/staff/edit-staff";
import ListRoomsAvailability from "../pages/home-owner/availability/list-rooms-availability";
import PartnerListTour from "../pages/home-owner/tour/partner-tour";
import AddStaff from "../pages/home-owner/communities/staff/add-staff";
import ListLeads from "../pages/home-owner/leads/list-leads";
import LeadDashboard from "../pages/home-owner/leads/lead-dashboard";
import ListInvoices from "../pages/home-owner/invoices/list-invoices";
import ListLeadContacts from "../pages/home-owner/profile/list-lead-contacts";
import AddLeadContact from "../pages/home-owner/profile/add-lead-contact";
import EditLeadContact from "../pages/home-owner/profile/edit-lead-contact";
import AddCommunity from "../pages/home-owner/communities/add-community";
import ListCommunity from "../pages/client/community/ListCommunity";
import ListFavorite from "../pages/client/favorite/ListFavorite";
import AvailableRooms from "../pages/admin/client/availableRooms";
import Tours from "../pages/admin/client/tours";
import AdminListFavorite from "../pages/admin/client/listFavorite";
import SavedSearchList from "../pages/client/search/SavedSearchList";
import ListTour from "../pages/client/tour/ListTour";
import ListRoom from "../pages/client/room/ListRoom";
import ClientProfile from "../pages/client/profile/ClientProfile";
import ListInbox from "../pages/client/inbox/ListInbox";
import AdminClients from "../pages/admin/client/client-admin";
import AddTemplate from "../pages/admin/client/template";
import EditTemplate from "../pages/admin/client/template-edit";
import TemplateList from "../pages/admin/client/template-list";
import AddAdminClients from "../pages/admin/client/add-client-admin";
import EditAdminClient from "../pages/admin/client/edit-client-admin";
import PasswordAdminClient from "../pages/admin/client/password-client-admin";
import ClientOverview from "../pages/admin/client/client-overview";
import AdminPartners from "../pages/admin/partner/partner-admin";
import PartnerOverview from "../pages/admin/partner/partner-overview";
import AddPartner from "../pages/admin/partner/add-partner";
import EditPartner from "../pages/admin/partner/edit-partner";
import Attachments from "../pages/admin/attachments/attachments";
import MainSearch from "../pages/admin/client/mainSearch";
import SavedSearch from "../pages/admin/client/saved-search";
import PartnerListCommunities from "../pages/admin/partner/communities/list-communities";
import PartnerAddCommunity from "../pages/admin/partner/communities/add-community";
import PartnerEditCommunity from "../pages/admin/partner/communities/edit-community";
import PartnerAddRoom from "../pages/admin/partner/communities/rooms/add-room";
import PartnerEditRoom from "../pages/admin/partner/communities/rooms/edit-rooms";
import PartnerAddStaff from "../pages/admin/partner/communities/staff/add-staff";
import PartnerEditStaff from "../pages/admin/partner/communities/staff/edit-staff";
import PartnerTourList from "../pages/admin/partner/partner-tour";
import PartnersInbox from "../pages/admin/partner/partner-inbox";
import PartnersAvailability from "../pages/admin/partner/partner-availability";
import PartnersLeadContact from "../pages/admin/partner/lead-contacts/partner-lead-contact";
import PartnersAddLeadContact from "../pages/admin/partner/lead-contacts/add-lead-contact";
import PartnersEditLeadContact from "../pages/admin/partner/lead-contacts/edit-lead-contact";
import PartnersClientContact from "../pages/admin/partner/partner-client-contact";
import GlobalSearch from "../pages/global-search/global-search";
// import config from "../config";
export default {
  routes: [
    {
      path: "/login",
      component: Login,
      exact: true,
      showHeader: false,
      showSider: false,
    },
    {
      path: "/forgot-password",
      component: ForgotPassword,
      exact: true,
      showHeader: false,
      showSider: false,
    },
    {
      path: "/reset-password",
      component: ResetPassword,
      exact: true,
      showHeader: false,
      showSider: false,
    },
    {
      path: "/",
      component: Homepage,
      // component: () => {
      //   // window.location.href = "https://secondhome.test6.redblink.net/";
      //   window.location.href = `${config.MainUrl}`;
      // },
      exact: true,
      showHeader: true,
      showSider: false,
    },
    {
      path: "/home-details",
      component: HomeDetails,
      exact: true,
      showHeader: true,
      showSider: false,
    },
    {
      path: "/home-detail/:id",
      component: HomeDetail,
      exact: true,
      showHeader: true,
      showSider: false,
    },
    {
      path: "/search",
      component: GlobalSearch,
      exact: true,
      showHeader: true,
      showSider: false,
    },
  ],
  privateRoutes: [
    {
      path: "/all-communities",
      component: ListCommunity,
      exact: true,
      roles: ["client"],
      showSider: true,
    },
    {
      path: "/favorites",
      component: ListFavorite,
      exact: true,
      roles: ["client"],
      showSider: true,
    },
    {
      path: "/saved-searches",
      component: SavedSearchList,
      exact: true,
      roles: ["client"],
      showSider: true,
    },
    {
      path: "/available-rooms",
      component: ListRoom,
      exact: true,
      roles: ["client"],
      showSider: true,
    },
    {
      path: "/tours",
      component: ListTour,
      exact: true,
      roles: ["client"],
      showSider: true,
    },
    {
      path: "/inbox",
      component: ListInbox,
      exact: true,
      roles: ["client"],
      showSider: true,
    },
    {
      path: "/profile",
      component: ClientProfile,
      exact: true,
      roles: ["client"],
      showSider: true,
    },
    {
      path: "/owner",
      component: ListCommunities,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/communities",
      component: ListCommunities,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/communities/add",
      component: AddCommunity,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/communities/:id",
      component: EditCommunity,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/communities/:id/:activeKey",
      component: EditCommunity,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/communities/:id/rooms/add",
      component: AddRoom,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/communities/:id/rooms/:roomId",
      component: EditRoom,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },

    {
      path: "/owner/communities/:id/staff/add",
      component: AddStaff,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/communities/:id/staff/:staffId",
      component: EditStaff,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/availability",
      component: ListRoomsAvailability,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/tour",
      component: PartnerListTour,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/leads",
      component: ListLeads,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/leads/:leadId",
      component: LeadDashboard,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/leads/:leadId/:activeKey",
      component: LeadDashboard,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/invoices",
      component: ListInvoices,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/profile",
      component: ListLeadContacts,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/lead-contacts/add",
      component: AddLeadContact,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/owner/lead-contacts/:id",
      component: EditLeadContact,
      exact: true,
      roles: ["admin", "home-owner"],
    },
    {
      path: "/admin",
      component: AdminClients,
      exact: true,
      roles: ["admin"],
    },
    {
      path: "/admin/email_template",
      component: TemplateList,
      exact: true,
      roles: ["admin"],
    },
    {
      path: "/admin/email_template/add",
      component: AddTemplate,
      exact: true,
      roles: ["admin"],
    },
    {
      path: "/admin/email_template/:id",
      component: EditTemplate,
      exact: true,
      roles: ["admin"],
    },
    {
      path: "/admin/clients",
      component: AdminClients,
      exact: true,
      roles: ["admin"],
      showSider: false,
    },
    {
      path: "/admin/clients/add",
      component: AddAdminClients,
      exact: true,
      roles: ["admin"],
      showSider: false,
    },
    {
      path: "/admin/clients/assessment",
      component: EditAdminClient,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/clients/change-password",
      component: PasswordAdminClient,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/clients/community/search",
      component: MainSearch,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/clients/community/search/:id",
      component: MainSearch,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/clients/community/saved-search",
      component: SavedSearch,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/client/overview",
      component: ClientOverview,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/clients/community/favorites",
      component: AdminListFavorite,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/clients/community/available-rooms",
      component: AvailableRooms,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/clients/community/tours",
      component: Tours,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/partners",
      component: AdminPartners,
      exact: true,
      roles: ["admin"],
      showSider: false,
    },
    {
      path: "/admin/partner/add",
      component: AddPartner,
      exact: true,
      roles: ["admin"],
      showSider: false,
    },
    {
      path: "/admin/partner/edit",
      component: EditPartner,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/partner/overview",
      component: PartnerOverview,
      exact: true,
      roles: ["admin"],
      showSider: true,
    },
    {
      path: "/admin/partners/communities",
      component: PartnerListCommunities,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },

    {
      path: "/admin/partners/communities/add",
      component: PartnerAddCommunity,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/communities/:id",
      component: PartnerEditCommunity,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/communities/:id/:activeKey",
      component: PartnerEditCommunity,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/communities/:id/rooms/add",
      component: PartnerAddRoom,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/communities/:id/rooms/:roomId",
      component: PartnerEditRoom,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },

    {
      path: "/admin/partners/communities/:id/staff/add",
      component: PartnerAddStaff,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/communities/:id/staff/:staffId",
      component: PartnerEditStaff,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/community/tours",
      component: PartnerTourList,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/community/availability",
      component: PartnersAvailability,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/community/lead-contacts",
      component: PartnersLeadContact,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/community/lead-contacts/add",
      component: PartnersAddLeadContact,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/community/lead-contacts/:id",
      component: PartnersEditLeadContact,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/client-contacts",
      component: PartnersClientContact,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/partners/inbox",
      component: PartnersInbox,
      exact: true,
      roles: ["admin", "home-owner"],
      showSider: true,
    },
    {
      path: "/admin/attachments",
      component: Attachments,
      exact: true,
      roles: ["admin"],
    },

    {
      path: "*",
      component: PageNotFoundError,
      exact: true,
    },
    {
      path: "/notfound",
      component: PageNotFoundError,
      exact: true,
    },
    {
      path: "/unauthorized",
      component: UnauthorizedError,
      exact: true,
    },
    {
      path: "/server-error",
      component: BackendServerError,
      exact: true,
    },
  ],
  redirects: [
    {
      from: "unauthorized",
      to: "403",
      status: 301,
    },
    {
      from: "*",
      to: "404",
      status: 301,
    },
  ],
};
