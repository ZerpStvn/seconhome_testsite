import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Input, Card, Skeleton, Breadcrumb, PageHeader } from "antd";
import { compose } from "redux";
import {
  getLeadContactById,
  updateLeadContact,
} from "../../../../redux/actions/lead-contact-actions";
import LeadContactForm from "./lead-contact-form";
import UserService from "../../../../services/user-service";
import { notifyUser } from "../../../../services/notification-service";
import { humanize } from "../../../../helpers/string-helper";

const EditLeadContact = ({
  editLeadContact,
  editLeadContactLoading,
  history,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = UserService.getAdminUser();
  useEffect(() => {
    if (!editLeadContact) {
      dispatch(getLeadContactById(id, { 'fields': ["*", "home.*,homes.*"], }));
    }

    return () => {
      console.log("Edit LeadContact Unmounting");
    };
  }, [editLeadContactLoading]);

  const handleSave = async (values) => {
    let newHome = [];
    values.homes.forEach(element => {
      newHome.push({ homes_id: element })
    });
    values.homes = newHome
    dispatch(updateLeadContact(id, values)).then(() => {
      notifyUser("Details have been saved", "success");
      history.push("/admin/partners/community/lead-contacts");
    });
    // dispatch(updateLeadContact(id, values));

  };

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
          <Link to="/admin/partners/community/lead-contacts">Lead Contacts</Link>
        </Breadcrumb.Item>

        {editLeadContact && (
          <Breadcrumb.Item>
            <Link
              to={`/admin/partners/community/lead-contacts/${id}`}
            >{`${humanize(editLeadContact.first_name)}`}</Link>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      <PageHeader
        className="site-page-header"
        title={editLeadContact && `${humanize(editLeadContact.first_name)}`}
      />
      <Skeleton loading={editLeadContactLoading}>
        {editLeadContact && (
          <Row gutter={30}>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              {editLeadContact && (
                <LeadContactForm
                  initialValues={editLeadContact}
                  handleSave={handleSave}
                />
              )}
            </Col>
          </Row>
        )}
      </Skeleton>
    </>
  );
};

function mapStateToProps(state) {
  return {
    editLeadContact: state.leadContact.editLeadContact,
    editLeadContactLoading: state.leadContact.editLeadContactLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getLeadContactById: () => dispatch(getLeadContactById()),
    updateLeadContact: () => dispatch(updateLeadContact()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  EditLeadContact
);
