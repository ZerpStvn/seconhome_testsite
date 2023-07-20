
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { listAllResidents } from "../../../../redux/actions/resident-actions";
import { useDispatch } from "react-redux";
import { Tag, Skeleton, Card, Descriptions } from "antd";
import { compose } from "redux";
import { humanize } from "../../../../helpers/string-helper";
import { getNumberWithOrdinal } from "../../../../helpers/number-helper";




const Equipment = ({ editLead, editLeadLoading }) => {

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

  const residentDetails = residentList && residentList.map((resident, index) => (
    <Card title={`${index > 0 ? getNumberWithOrdinal(index + 1) : ""} Resident Equipment Details`}>
      <Descriptions column={1} layout="horizontal">
        <Descriptions.Item label="Cane">{humanize(resident.cane)}</Descriptions.Item>
        <Descriptions.Item label="Walker">{humanize(resident.walker)}</Descriptions.Item>
        <Descriptions.Item label="Wheelchair">{humanize(resident.wheelchair)}</Descriptions.Item>
        <Descriptions.Item label="Scooter">{humanize(resident.scooter)}</Descriptions.Item>
        <Descriptions.Item label="Oxygen">{humanize(resident.oxygen)}</Descriptions.Item>
        <Descriptions.Item label="Catheter">{humanize(resident.catheter)}</Descriptions.Item>
        <Descriptions.Item label="Feeding Tube">{humanize(resident.feeding_tube)}</Descriptions.Item>
        <Descriptions.Item label="Colostomy">{humanize(resident.colostomy)}</Descriptions.Item>
        <Descriptions.Item label="Ostomy">{humanize(resident.ostomy)}</Descriptions.Item>
        <Descriptions.Item label="Commode">{humanize(resident.commode)}</Descriptions.Item>
        <Descriptions.Item label="IV">{humanize(resident.iv)}</Descriptions.Item>
        <Descriptions.Item label="Prosthesis">{resident.prosthesis == "leg_arm" ? "Leg/Arm" : humanize(resident.prosthesis)}</Descriptions.Item>
        <Descriptions.Item label="Trachea">{humanize(resident.trachea)}</Descriptions.Item>
        <Descriptions.Item label="Equipment Notes">{humanize(resident.equipment_notes)}</Descriptions.Item>

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

export default compose(connect(mapStateToProps, mapDispatchToProps))(Equipment);
