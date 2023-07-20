
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { listAllResidents } from "../../../../redux/actions/resident-actions";
import { getLeadById } from "../../../../redux/actions/lead-actions";
import { useDispatch } from "react-redux";
import { Tag, Skeleton, Card, Descriptions } from "antd";
import { compose } from "redux";
import { humanize } from "../../../../helpers/string-helper";
import { getNumberWithOrdinal } from "../../../../helpers/number-helper";
import { residentBathroomOptions, residentBedroomOptions } from "../../../../constants/defaultValues";

const ListResidents = ({ editLead, editLeadLoading }) => {

  const dispatch = useDispatch();
  // useEffect(() => {
  //     dispatch(listAllResidents({filter:{lead:{_eq:leadId}}}))

  //   return () => {
  //     console.log("Resident List Unmounting");
  //   };
  // }, []);

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
    <Card title={`${index > 0 ? getNumberWithOrdinal(index + 1) : ""} Resident Details`}>
      <Descriptions column={1} layout="horizontal">
        <Descriptions.Item label="Name">{humanize(resiedent.name)}</Descriptions.Item>
        <Descriptions.Item label="Gender">{humanize(resiedent.gender)}</Descriptions.Item>
        <Descriptions.Item label="Age">{resiedent.age}</Descriptions.Item>
        <Descriptions.Item label="Weight">{!(!!resiedent.weight) ? "0 lbs" : `${resiedent.weight} lbs`}</Descriptions.Item>
        <Descriptions.Item label="Height">{resiedent.height}</Descriptions.Item>
        <Descriptions.Item label="Pet">{humanize(resiedent.pet)}</Descriptions.Item>
        <Descriptions.Item label="Hobbies">
          {resiedent.hobbies && resiedent.hobbies.map((hobby) => hobby !== "custom" ? <Tag>{humanize(hobby)}</Tag> : '')}
          {resiedent.hobbies && resiedent.hobbies.includes('custom') && resiedent.custom_hobbie_answer ?
            <Tag>{humanize(resiedent.custom_hobbie_answer)}</Tag> : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Languages">{resiedent.languages && resiedent.languages.map((language) => <Tag>{humanize(language)}</Tag>)}</Descriptions.Item>
        {/* <Descriptions.Item label="Bedroom">{humanize(resiedent.bedroom)}</Descriptions.Item> */}
        <Descriptions.Item label="Bedroom">{resiedent.bedroom && JSON.parse(resiedent.bedroom).map((item, index) => {
          let Value;
          residentBedroomOptions.forEach(Item => {
            if (Item.value === item) {
              Value = Item.text;
            }
          });
          return humanize(Value)
        }).join(", ")}</Descriptions.Item>
        <Descriptions.Item label="Bathroom">
          {resiedent.bathroom && JSON.parse(resiedent.bathroom).map((item, index) => {
            let Value;
            residentBathroomOptions.forEach(Item => {
              if (Item.value === item) {
                Value = Item.text;
              }
            });
            return humanize(Value)
          }).join(", ")}</Descriptions.Item>
        {/* <Descriptions.Item label="Move Time Frame">{humanize(resiedent.move_time_frame)}</Descriptions.Item> */}

      </Descriptions>

    </Card>
  ))

  return (
    <>
      <Skeleton loading={editLead, editLeadLoading}>
        {residentDetails}
      </Skeleton>


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

}

export default compose(connect(mapStateToProps, mapDispatchToProps))(ListResidents);
