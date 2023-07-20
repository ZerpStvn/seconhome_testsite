import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Input, Card, Skeleton, Breadcrumb, PageHeader } from "antd";
import { compose } from "redux";
import { createLeadContact, updateLeadContact } from "../../../../redux/actions/lead-contact-actions";
import LeadContactForm from "./lead-contact-form";
import UserService from "../../../../services/user-service";
import { notifyUser } from "../../../../services/notification-service";
import leadContactApi from "../../../../redux/api/lead-contact-api";
import { humanize } from "../../../../helpers/string-helper";

const AddLeadContact = ({ history }) => {
  const dispatch = useDispatch();
  const user = UserService.getAdminUser();
  const [buttonLoading, setButtonLoading] = useState(false);
  useEffect(() => {
    return () => {
      console.log("Edit LeadContact Unmounting");
    };
  }, []);

  // const handleSave = async (values) => {
  //   dispatch(createLeadContact(values));
  //   notifyUser("Details have been saved", "success");
  //   history.push("/admin/partners/community/lead-contacts");
  // };

  const handleSave = async (values) => {
    setButtonLoading(true);
    values.user_created = user.id
    let newHome = [];
    values.homes.forEach(element => {
      newHome.push({ homes_id: element })
    });
    values.homes = newHome
    await leadContactApi.createLeadContact(values).then(async (createLeadData) => {
      console.log(createLeadData.data);
      createLeadData.data.user_created = user.id
      dispatch(updateLeadContact(createLeadData.data.id, createLeadData.data)).then((Data) => {
        // console.log(Data);
        notifyUser('Lead Contact Added', 'success');
        history.push("/admin/partners/community/lead-contacts");
      });

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
          <Link to="/admin">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/partners">Partners</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/admin/partner/overview">{humanize(user.first_name)} {humanize(user.last_name)}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/partners/community/lead-contacts">Lead Contacts</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>
          <Link to={`/admin/partners/community/lead-contacts/add`}>{`Add Lead Contact`}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <PageHeader className="site-page-header" title="Add Lead Contact" />

      <Row gutter={30}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <LeadContactForm initialValues={{ status: "published" }} handleSave={handleSave} buttonLoading={buttonLoading} />
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
