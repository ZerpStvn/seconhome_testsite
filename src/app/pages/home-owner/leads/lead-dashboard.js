
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getLeadById } from "../../../redux/actions/lead-actions";
import { List, Divider, Row, Col, Button, PageHeader, Table, Tag, Space, Breadcrumb, Tabs, Skeleton, Descriptions, Card } from "antd";
import { compose } from "redux";
import ListClients from "./clients/list-clients";
import { humanize } from "../../../helpers/string-helper";
import ListResidents from "./residents/list-residents";
import Financial from "./residents/financial";
import Equipment from "./residents/equipment";
import CareLevel from "./residents/care-level";
import Medical from "./residents/medical";
import Avatar from "antd/lib/avatar/avatar";
import NotesListCard from "../../../components/shared/displayCard/NotesListCard";
import { residentMoveTimeFrameOptions } from '../../../constants/defaultValues';

const { TabPane } = Tabs;
const LeadDashboard = ({ editLead, editLeadLoading }) => {

  const { leadId, activeKey } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLeadById(leadId, { fields: "*,client.*,client.primary_resident.*,client.second_resident.*,client.second_contact.*,client.third_contact.*" }))
    return () => {
      console.log("Leads Dashboard Unmounting");
    };
  }, []);


  const getTimeFrameValue = (editLead) => {
    let timeFrameValue = ""
    if (editLead.client) {
      if (editLead.client.primary_resident) {
        residentMoveTimeFrameOptions.forEach(Item => {
          if (Item.value == editLead.client.primary_resident.move_time_frame) {
            timeFrameValue = Item.text
          }
        })
      }
      // else if (editLead.client.second_resident) {
      //   residentMoveTimeFrameOptions.forEach(Item => {
      //     if (Item.value == editLead.client.second_resident.move_time_frame) {
      //       timeFrameValue = Item.text
      //     }
      //   })
      // }
      else {
        timeFrameValue = ""
      }
    }
    return timeFrameValue
  }

  function formatNumber(e){
    if(e){
    var x = e.toString().replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    
    }
  }

  const getBudgetNotesValue = (editLead) => {
    let budgetNotesValue = ""
    if (editLead.client) {
      console.log(editLead);
      if (editLead.client.primary_resident) {
        budgetNotesValue = editLead.client.primary_resident.budget_notes
      }
      // else if (editLead.client.second_resident) {
      //   budgetNotesValue = editLead.client.second_resident.budget_notes
      // }
      else {
        budgetNotesValue = ""
      }
    }
    return budgetNotesValue
  }

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/owner">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/owner/leads">Leads</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>
          <Link to={`/owner/leads/${leadId}`}>Client</Link>
        </Breadcrumb.Item>

      </Breadcrumb>
      <PageHeader className="site-page-header" title={editLead && editLead.client ? (humanize(editLead.client.name)) : ""} />
      <Row gutter={30}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card title="Overview">
            <Skeleton loading={editLeadLoading}>
              {editLead && (
                <>
                  <Descriptions column={1}>
                    {/* <Descriptions.Item label="Status">{humanize(editLead.status)}</Descriptions.Item> */}
                    <Descriptions.Item label="First Resident Name">{editLead.client.primary_resident ? humanize(editLead.client.primary_resident.name) : ""}</Descriptions.Item>
                    <Descriptions.Item label="Second Resident Name">{editLead.client.second_resident ? humanize(editLead.client.second_resident.name) : ""}</Descriptions.Item>
                    <Descriptions.Item label="Cell">{editLead.client ? (<a href={`tell:${editLead.client.cell}`}>{formatNumber(editLead.client.cell)}</a>) : ""}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{editLead.client ? (<a href={`tell:${editLead.client.phone}`}>{formatNumber(editLead.client.phone)}</a>) : ""}</Descriptions.Item>
                    <Descriptions.Item label="Email">{editLead.client ? (editLead.client.email) : ""}</Descriptions.Item>
                    <Descriptions.Item label="Budget Notes">{getBudgetNotesValue(editLead)}</Descriptions.Item>
                    <Descriptions.Item label="Move Time Frame">{getTimeFrameValue(editLead)}</Descriptions.Item>
                  </Descriptions>
                  {editLead.notes && editLead.notes.data &&
                    <List
                      header={<div >Notes : </div>}
                      dataSource={editLead.notes.data}
                      bordered
                      renderItem={(note, index) => (
                        <List.Item>
                          {note}

                        </List.Item>
                      )}

                    >

                    </List>
                  }
                </>
              )}

            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={16} xl={16}>
          <Tabs defaultActiveKey={activeKey ? activeKey : "client"} >
            <TabPane tab="Client" key="client">
              {editLead && <ListClients leadId={leadId} />}
            </TabPane>
            <TabPane tab="Resident" key="resident">
              {editLead && <ListResidents leadId={leadId} editLead={editLead} />}
            </TabPane>

            <TabPane tab="Financial" key="financial">
              {editLead && <Financial leadId={leadId} editLead={editLead} />}
            </TabPane>
            <TabPane tab="Care Level" key="care-level">
              {editLead && <CareLevel leadId={leadId} editLead={editLead} />}
            </TabPane>
            <TabPane tab="Medical" key="medical">
              {editLead && <Medical leadId={leadId} editLead={editLead} />}
            </TabPane>
            <TabPane tab="Equipment" key="equipment">
              {editLead && <Equipment leadId={leadId} editLead={editLead} />}
            </TabPane>
            {/* <TabPane tab="Documents" key="documents">
            </TabPane> */}

          </Tabs>

        </Col>

      </Row>

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
    getLeadById: () => dispatch(getLeadById())
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(LeadDashboard);
