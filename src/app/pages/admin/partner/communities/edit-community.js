import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getById, updateHome } from "../../../../redux/actions/home-actions";
import { useDispatch } from "react-redux";
import { Link, useParams, Redirect } from "react-router-dom";
import { notifyUser } from "../../../../services/notification-service";
import { List, Divider, Row, Col, Button, PageHeader, Breadcrumb, Tabs, Skeleton } from "antd";
import { compose } from "redux";
import { identity } from "ramda";
import EditCommunityProfile from "./edit-community-profile";
import EditCommunityPricing from "./edit-community-pricing";
import EditCommunityServicesAmenities from "./edit-community-services-amenities";
import ListRooms from "./rooms/list-rooms";
import ListStaff from "./staff/list-staff";
import Config from "../../../../config";
import EditCommunityPhotos from "./edit-community-photos";
import EditCommunityDocuments from "./edit-community-documents";
import UserService from "../../../../services/user-service";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { humanize } from "../../../../helpers/string-helper";

const { TabPane } = Tabs;

const EditCommunity = ({ editHome, editHomeLoading, history, homeMessage, homeUpdated }) => {
  const user = UserService.getAdminUser();
  const { id, activeKey } = useParams();
  const [photoList, setPhotoList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [loading, setLoading] = useState(editHomeLoading);
  const [buttonLoading, setButtonLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSaveProfile = async (id, values) => {
    setButtonLoading(true)
    const response = await dispatch(updateHome(id, values))
    // console.log(response);
    notifyUser("Details have been saved", "success")
    setButtonLoading(false)
    history.push("/admin/partners/communities/" + id + "/rooms");
  };

  const handleSavePrice = async (id, values) => {
    setButtonLoading(true)
    const response = await dispatch(updateHome(id, values))
    // console.log(response);

    history.push("/admin/partners/communities/" + id + "/services-amenities");
    notifyUser("Details have been saved", "success")
    setButtonLoading(false)
  }

  const handleSaveServices = async (id, values) => {
    setButtonLoading(true)
    const response = await dispatch(updateHome(id, values))
    // console.log(response);
    history.push("/admin/partners/communities/" + id + "/photos");
    notifyUser("Details have been saved", "success");
    setButtonLoading(false)

  };

  const handleSaveFiles = async (id, values) => {
    setButtonLoading(true)
    const response = await dispatch(updateHome(id, values))

    history.push("/admin/partners/communities/" + id + "/staff");
    notifyUser("Details have been saved", "success");
    setButtonLoading(false)
  };
  const handleSaveDocuments = async (id, values) => {
    setButtonLoading(true)
    const response = await dispatch(updateHome(id, values))
    // console.log(response);
    history.push("/admin/partners/communities");
    notifyUser("Details have been saved", "success");
    setButtonLoading(false)

  };



  useEffect(() => {
    if (!editHome) {
      dispatch(getById(id, { fields: "*,photos.*,photos.directus_files_id.*,documents.*,documents.directus_files_id.*" }));
    }
    let _photoList = [];
    let _docuentList = [];
    editHome && editHome.photos.map(({ id, directus_files_id, category }) => {
      _photoList.push({
        uid: directus_files_id.id,
        id: id,
        status: 'done',
        url: `${Config.API}/assets/${directus_files_id.id}`,
        name: directus_files_id.filename_download,
        category: category
      })
    })
    setPhotoList(_photoList);
    editHome && editHome.documents.map(({ id, directus_files_id, category }) => {
      _docuentList.push({
        uid: directus_files_id.id,
        id: id,
        status: 'done',
        url: `${Config.API}/assets/${directus_files_id.id}`,
        name: directus_files_id.filename_download,
        category: category
      })
    })
    setLoading(editHomeLoading)
    setDocumentList(_docuentList);
    return () => {
      console.log("Edit Communities Unmounting");
    };

  }, [editHomeLoading]);

  const handleTabClick = (key) => {
    history.push("/admin/partners/communities/" + id + "/" + key);
  }

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/partners">Partners</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/admin/partner/overview">{humanize(user.first_name)} {humanize(user.last_name)}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/partners/communities">Communities</Link>
        </Breadcrumb.Item>
        {editHome && (
          <Breadcrumb.Item>
            <Link className="cap-letter" to={`/admin/partners/communities/${id}`}>{`${humanize(editHome.name)}`}</Link>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      <PageHeader className="site-page-header cap-letter" title={editHome && `${editHome.name}`} />
      <Tabs activeKey={activeKey ? activeKey : "profile"} onChange={handleTabClick}>
        <TabPane tab="Profile" key="profile">
          {console.log(loading, 'loading')}
          <Skeleton loading={loading}>
            {editHome && <EditCommunityProfile editHome={editHome} handleSave={handleSaveProfile} loading={buttonLoading} />}
          </Skeleton>

        </TabPane>
        <TabPane tab="Rooms" key="rooms">
          <ListRooms homeId={id} />
        </TabPane>

        <TabPane tab="Pricing" key="pricing">
          <Skeleton loading={loading}>
            {editHome && <EditCommunityPricing editHome={editHome} handleSave={handleSavePrice} loading={buttonLoading} />}
          </Skeleton>
        </TabPane>
        <TabPane tab="Services & Amenities" key="services-amenities">
          {editHome && <EditCommunityServicesAmenities editHome={editHome} handleSave={handleSaveServices} loading={buttonLoading} />}
        </TabPane>
        <TabPane tab="Media" key="photos">
          {editHome && <EditCommunityPhotos photoList={photoList} editHome={editHome} handleSave={handleSaveFiles} loading={buttonLoading} />}
        </TabPane>
        <TabPane tab="Staff" key="staff">
          <ListStaff homeId={id} />
        </TabPane>
        <TabPane tab="Documents" key="Documents">
          {editHome && <EditCommunityDocuments documentList={documentList} editHome={editHome} handleSave={handleSaveDocuments} loading={buttonLoading} />}
        </TabPane>

      </Tabs>
    </>
  );
};

function mapStateToProps(state) {
  return {
    editHome: state.home.editHome,
    editHomeLoading: state.home.editHomeLoading,
    homeMessage: state.home.homeMessage,
    homeUpdated: state.home.homeUpdated
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getById: () => dispatch(getById()),
    updateHome: () => dispatch(updateHome()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(EditCommunity);
