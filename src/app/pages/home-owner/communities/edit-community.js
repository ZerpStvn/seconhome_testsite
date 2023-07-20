import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getById, updateHome } from "../../../redux/actions/home-actions";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { notifyUser } from "../../../services/notification-service";
import { List, Divider, Row, Col, Button, PageHeader, Breadcrumb, Tabs, Skeleton } from "antd";
import { compose } from "redux";
import { identity } from "ramda";
import EditCommunityProfile from "./edit-community-profile";
import EditCommunityPricing from "./edit-community-pricing";
import EditCommunityServicesAmenities from "./edit-community-services-amenities";
import ListRooms from "./rooms/list-rooms";
import ListStaff from "./staff/list-staff";
import Config from "../../../config";
import EditCommunityPhotos from "./edit-community-photos";
import EditCommunityDocuments from "./edit-community-documents";
import { humanize } from "../../../helpers/string-helper";
const { TabPane } = Tabs;

const EditCommunity = ({ editHome, editHomeLoading, history, homeMessage, homeUpdated }) => {
  const { id, activeKey } = useParams();
  const [photoList, setPhotoList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [loading, setLoading] = useState(editHomeLoading);
  const [buttonLoading, setButtonLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSaveProfile = async (id, values) => {
    setButtonLoading(true)
    const response = await dispatch(updateHome(id, values))
    console.log(response);
    notifyUser("Details have been saved", "success")
    setButtonLoading(false)
    history.push(`/owner/communities/${id}/rooms`);
  };
  const handleSavePrice = async (id, values) => {
    setButtonLoading(true)
    const response = await dispatch(updateHome(id, values))
    // console.log(response);

    history.push(`/owner/communities/${id}/services-amenities`);
    notifyUser("Details have been saved", "success")
    setButtonLoading(false)
  }

  const handleSaveServices = async (id, values) => {
    setButtonLoading(true)
    const response = await dispatch(updateHome(id, values))
    // console.log(response);
    history.push(`/owner/communities/${id}/photos`);
    notifyUser("Details have been saved", "success");
    setButtonLoading(false)

  };

  const handleSaveFiles = async (id, values) => {
    setButtonLoading(true)
    const response = await dispatch(updateHome(id, values))

    history.push(`/owner/communities/${id}/staff`);
    notifyUser("Details have been saved", "success");
    setButtonLoading(false)
  };
  const handleSaveDocuments = async (id, values) => {
    setButtonLoading(true)
    const response = await dispatch(updateHome(id, values))
    // console.log(response);
    history.push("/owner/communities");
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

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/owner">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/owner/communities">Communities</Link>
        </Breadcrumb.Item>
        {editHome && (
          <Breadcrumb.Item>
            <Link to={`/owner/communities/${id}`}>{`${humanize(editHome.name)}`}</Link>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      <PageHeader className="site-page-header" title={editHome && `${humanize(editHome.name)}`} />
      <Tabs defaultActiveKey={activeKey ? activeKey : "profile"} >
        <TabPane tab="Profile" key="profile">
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
          {editHome && <EditCommunityServicesAmenities editHome={editHome} handleSave={handleSaveServices} />}
        </TabPane>
        <TabPane tab="Media" key="photos">
          {editHome && <EditCommunityPhotos photoList={photoList} editHome={editHome} handleSave={handleSaveFiles} />}
        </TabPane>
        <TabPane tab="Staff" key="staff">
          <ListStaff homeId={id} />
        </TabPane>
        <TabPane tab="Documents" key="Documents">
          {editHome && <EditCommunityDocuments documentList={documentList} editHome={editHome} handleSave={handleSaveDocuments} />}
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
