import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Input, Card, Skeleton, Breadcrumb, PageHeader } from "antd";
import { compose } from "redux";
import { createLeadContact } from "../../../redux/actions/lead-contact-actions";
import LeadContactForm from "./lead-contact-form";
import leadContactApi from "../../../redux/api/lead-contact-api";
import { notifyUser } from "../../../services/notification-service";

const AddLeadContact = ({ history }) => {
  const dispatch = useDispatch();
  const [buttonLoading, setButtonLoading] = useState(false);
  useEffect(() => {
    return () => {
      console.log("Edit LeadContact Unmounting");
    };
  }, []);

  const handleSave = async (values) => {
    setButtonLoading(true);
    let newHome = [];
    values.homes.forEach(element => {
      newHome.push({ homes_id: element })
    });
    values.homes = newHome
    await leadContactApi.createLeadContact(values).then((data) => {
      console.log(data);
      notifyUser('Lead Contact Added', 'success');
      history.push("/owner/profile");
    },
      (error) => {
        console.log(error.response);
        notifyUser(JSON.parse(error.response.data).errors[0].message, 'error')
        setButtonLoading(false);
      })

    // history.push("/owner/profile");
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

        <Breadcrumb.Item>
          <Link to={`/owner/lead-contacts/add`}>{`Add Lead Contact`}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <PageHeader className="site-page-header" title="Add Lead Contact" />

      <Row gutter={30}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <LeadContactForm initialValues={{}} handleSave={handleSave} buttonLoading={buttonLoading} />
        </Col>
      </Row>
    </>
  );
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    createLeadContact: () => dispatch(createLeadContact()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  AddLeadContact
);
