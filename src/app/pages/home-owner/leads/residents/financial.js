
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { listAllResidents } from "../../../../redux/actions/resident-actions";
import { useDispatch } from "react-redux";
import { Tag, Skeleton, Card, Descriptions } from "antd";
import { compose } from "redux";
import { humanize } from "../../../../helpers/string-helper";
import { getNumberWithOrdinal } from "../../../../helpers/number-helper";




const Financial = ({ leadId, editLead, editLeadLoading }) => {

  const dispatch = useDispatch();
  var residentList = [];
  if (editLead) {
    if (editLead.client) {
      if (editLead.client.primary_resident) {
        residentList.push(editLead.client.primary_resident)
      }
      if (editLead.client.second_resident) {
        residentList.push(editLead.client.second_resident)
      }
    }
  }

  const residentDetails = residentList && residentList.map((resiedent, index) => (
    <Card title={`${index > 0 ? getNumberWithOrdinal(index + 1) : ""} Resident Financial Details`}>
      <Descriptions column={1} layout="horizontal">
        <Descriptions.Item label="Medi-Cal">{humanize(resiedent.medi_cal)}</Descriptions.Item>
        <Descriptions.Item label="Medicare">{humanize(resiedent.medicare)}</Descriptions.Item>
        <Descriptions.Item label="Veteran">{humanize(resiedent.veteran)}</Descriptions.Item>
        <Descriptions.Item label="LTC Insurance">{humanize(resiedent.ltc_insurance)}</Descriptions.Item>
        <Descriptions.Item label="Budget Notes">{humanize(resiedent.budget_notes)}</Descriptions.Item>

      </Descriptions>

    </Card>
  ))

  return (
    <>
      <Skeleton loading={editLeadLoading}>
        {residentDetails}
      </Skeleton>


    </>

  );
};

function mapStateToProps(state) {
  return {
    editLead: state.lead.editLead,
    editLeadLoading: state.lead.residentListLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAllResidents: () => dispatch(listAllResidents())
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(Financial);
