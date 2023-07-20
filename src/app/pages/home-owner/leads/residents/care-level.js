
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { listAllResidents } from "../../../../redux/actions/resident-actions";
import { useDispatch } from "react-redux";
import { Tag, Skeleton, Card, Descriptions } from "antd";
import { compose } from "redux";
import { humanize } from "../../../../helpers/string-helper";
import { getNumberWithOrdinal } from "../../../../helpers/number-helper";
import { residentNightSupervision } from "../../../../constants/defaultValues";




const CareLevel = ({ editLead, editLeadLoading }) => {

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
    <Card title={`${index > 0 ? getNumberWithOrdinal(index + 1) : ""} Resident Care Level Details`}>
      <Descriptions column={1} layout="horizontal">
        <Descriptions.Item label="Bathing">{humanize(resiedent.bathing)}</Descriptions.Item>
        <Descriptions.Item label="Feeding">{humanize(resiedent.feeding)}</Descriptions.Item>
        <Descriptions.Item label="Medication">{humanize(resiedent.medication)}</Descriptions.Item>
        <Descriptions.Item label="Grooming">{humanize(resiedent.grooming)}</Descriptions.Item>
        <Descriptions.Item label="Transferring">{humanize(resiedent.transferring)}</Descriptions.Item>
        <Descriptions.Item label="Dressing">{humanize(resiedent.dressing)}</Descriptions.Item>
        <Descriptions.Item label="Walking Assistance">{humanize(resiedent.walking_assistance)}</Descriptions.Item>
        {/* <Descriptions.Item label="Night Supervision">{humanize(resiedent.night_supervision)}</Descriptions.Item> */}
        <Descriptions.Item label="Night Supervision">
          {residentNightSupervision.map((item) => {
            if (item.value == resiedent.night_supervision) {
              return item.text
            }
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Incontinent">{humanize(resiedent.incontinent)}</Descriptions.Item>
        <Descriptions.Item label="Toileting">{humanize(resiedent.toileting)}</Descriptions.Item>
        <Descriptions.Item label="Transportation">{humanize(resiedent.transportation)}</Descriptions.Item>
        <Descriptions.Item label="Level of Care Notes">{humanize(resiedent.level_of_care_notes)}</Descriptions.Item>
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(CareLevel);
