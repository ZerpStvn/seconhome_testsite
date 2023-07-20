import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Input, Card, Skeleton, Breadcrumb, PageHeader } from "antd";
import { compose } from "redux";
import {
  getLeadContactById,
  updateLeadContact,
} from "../../../redux/actions/lead-contact-actions";
import LeadContactForm from "./lead-contact-form";
import { humanize } from "../../../helpers/string-helper";

const EditLeadContact = ({
  editLeadContact,
  editLeadContactLoading,
  history,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!editLeadContact) {
      dispatch(getLeadContactById(id, { 'fields': ["*", "home.*,homes.*"], }));
    }

    return () => {
      console.log("Edit LeadContact Unmounting");
    };
  }, [editLeadContactLoading]);

  const handleSave = async (values) => {
    console.log(values);
    let newHome = [];
    values.homes.forEach(element => {
      newHome.push({ homes_id: element })
    });
    values.homes = newHome
    dispatch(updateLeadContact(id, values)).then(() => {
      history.push("/owner/profile");
    });

  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/owner">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/owner/Profile">Profile</Link>
        </Breadcrumb.Item>

        {editLeadContact && (
          <Breadcrumb.Item>
            <Link
              to={`/owner/lead-contacts/${id}`}
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
