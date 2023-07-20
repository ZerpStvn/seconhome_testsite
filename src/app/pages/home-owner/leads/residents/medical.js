
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { listAllResidents } from "../../../../redux/actions/resident-actions";
import { useDispatch } from "react-redux";
import { Tag, Skeleton, Card, Descriptions } from "antd";
import { compose } from "redux";
import { } from "../../../../helpers/string-helper";
import { getNumberWithOrdinal } from "../../../../helpers/number-helper";
import { humanize } from "../../../../helpers/string-helper";
import { residentDialysis } from "../../../../constants/defaultValues";




const Medical = ({ editLead, editLeadLoading }) => {
  console.log(editLead, 'editLead');

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
    <Card title={`${index > 0 ? getNumberWithOrdinal(index + 1) : ""} Resident Medical Details`}>
      <Descriptions column={1} layout="horizontal">
        <Descriptions.Item label="Cognition">{humanize(resiedent.cognition)}</Descriptions.Item>
        <Descriptions.Item label="Wanders">{resiedent.wanders == "during_day_night" ? "During Day/Night" : (humanize(resiedent.wanders))}</Descriptions.Item>
        <Descriptions.Item label="Confused">{humanize(resiedent.confused)}</Descriptions.Item>
        <Descriptions.Item label="Sundowning">{humanize(resiedent.sundowning)}</Descriptions.Item>
        <Descriptions.Item label="Dysphagia">{humanize(resiedent.dysphagia)}</Descriptions.Item>
        <Descriptions.Item label="Hospice">{(humanize(resiedent.hospice))}</Descriptions.Item>
        <Descriptions.Item label="Behavior">{resiedent.behavior == "physical_verbal" ? "Physical/Verbal" : humanize(resiedent.behavior)}</Descriptions.Item>
        <Descriptions.Item label="Insulin">{(humanize(resiedent.insulin))}</Descriptions.Item>
        <Descriptions.Item label="Glucose Testing">{(humanize(resiedent.glucose_testing))}</Descriptions.Item>
        <Descriptions.Item label="Hearing">{(humanize(resiedent.hearing))}</Descriptions.Item>
        <Descriptions.Item label="Sight">{(humanize(resiedent.sight))}</Descriptions.Item>
        <Descriptions.Item label="Speech">{resiedent.speech == "non_verbal" ? "Non-Verbal" : (humanize(resiedent.speech))}</Descriptions.Item>
        <Descriptions.Item label="Dialysis">
          {residentDialysis.map((item) => {
            if (item.value == resiedent.dialysis) {
              return item.text
            }
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Recent Stroke">{(humanize(resiedent.recent_stroke))}</Descriptions.Item>
        <Descriptions.Item label="Allergies">{resiedent.allergies == "food_medication" ? "Food/Medication" : humanize(resiedent.allergies)}</Descriptions.Item>
        <Descriptions.Item label="Multiple Sclerosis">{(humanize(resiedent.multiple_sclerosis))}</Descriptions.Item>
        <Descriptions.Item label="Mental Illness">{(humanize(resiedent.mental_illness))}</Descriptions.Item>
        <Descriptions.Item label="Suicidal">{(humanize(resiedent.suicidal))}</Descriptions.Item>
        <Descriptions.Item label="Bedridden">{(humanize(resiedent.bedridden))}</Descriptions.Item>
        <Descriptions.Item label="Wounds">{(humanize(resiedent.wounds))}</Descriptions.Item>
        <Descriptions.Item label="Parkinson's">{(humanize(resiedent.parkinsons))}</Descriptions.Item>
        <Descriptions.Item label="HIV">{(humanize(resiedent.hiv))}</Descriptions.Item>
        <Descriptions.Item label="Medication List">{(humanize(resiedent.medication_list))}</Descriptions.Item>
        <Descriptions.Item label="Medical Notes">{(humanize(resiedent.medical_notes))}</Descriptions.Item>

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

export default compose(connect(mapStateToProps, mapDispatchToProps))(Medical);
