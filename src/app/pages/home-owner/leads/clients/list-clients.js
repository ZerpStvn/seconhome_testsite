import React, { useEffect } from "react";
import { connect } from "react-redux";
import { listAllLeadClients } from "../../../../redux/actions/lead-client-actions";
import { getLeadById } from "../../../../redux/actions/lead-actions";
import { useDispatch } from "react-redux";

import { Skeleton, Card, Descriptions } from "antd";
import { compose } from "redux";
import { humanize } from "../../../../helpers/string-helper";
import { getNumberWithOrdinal } from "../../../../helpers/number-helper";

const ListClients = ({ leadId, editLead, editLeadLoading }) => {
  const dispatch = useDispatch();
  // useEffect(() => {

  // }, []);

  var leadClientList = [];

  if (editLead) {

    if (editLead.client) {
      leadClientList.push(editLead.client);
      if (editLead.client.second_contact) {
        leadClientList.push(editLead.client.second_contact)
      }
      if (editLead.client.third_contact) {
        leadClientList.push(editLead.client.third_contact)
      }


    }


  }

  function formatNumber(e){
    if(e){
    var x = e.toString().replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    
    }
  }
  const clientDetails =
    leadClientList &&
    leadClientList.map((client, index) => (
      <Card
        title={`${index > 0 ? getNumberWithOrdinal(index + 1) : ""
          } Client Details`}
      >
        <Descriptions column={1} layout="horizontal">
          <Descriptions.Item label="Name">{client.name}</Descriptions.Item>
          <Descriptions.Item label="Relationship">
            {client.relationship ? humanize(client.relationship) : ''}
          </Descriptions.Item>
          <Descriptions.Item label="Phone"><a href={`tell:${client.phone}`}>{formatNumber(client.phone)}</a></Descriptions.Item>
          <Descriptions.Item label="Cell"><a href={`tell:${client.cell}`}>{formatNumber(client.cell)}</a></Descriptions.Item>
          <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
        </Descriptions>
      </Card>
    ));

  return (
    <>
      <Skeleton loading={editLeadLoading}>{clientDetails}</Skeleton>
    </>
  );
};

function mapStateToProps(state) {
  return {
    editLead: state.lead.editLead,
    editLeadLoading: state.lead.editLeadLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAllLeadClients: () => dispatch(listAllLeadClients()),
    getLeadById: () => dispatch(getLeadById()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ListClients
);
