import React, { useEffect, useState, useRef } from "react";
import { Tabs, Breadcrumb, Card, Form, Input, Skeleton, Descriptions } from "antd";

import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { compose } from "redux";
import leadClientAPI from "../../../redux/api/lead-client-api"
import { notifyUser } from "../../../services/notification-service";
import { humanize } from "../../../helpers/string-helper";



const { TabPane } = Tabs;

const ClientProfile = (props) => {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState({});
  const [activeTab, setActiveTab] = useState('contact');
  useEffect(() => {
    (async () => {

      // const leadClient = await leadClientAPI.listAllLeadClients({ fields: "*,primary_resident.*,second_resident.*" });
      const leadClient = await leadClientAPI.listAllLeadClients({ fields: "*.*.*" });
      console.log(leadClient);
      if (leadClient.data) {
        setLoading(false);
        setClient(leadClient.data[0]);
      } else {
        setLoading(false);
        notifyUser("There might be some problem please try again", "error")
      }

    })();

    return () => {
      console.log("Client Profile unmounting");
    };
  }, []);


  useEffect(() => {

    let { state } = props.history.location;

    if (state && state.from) {
      setActiveTab(state.from);
    }

  }, [props.history.location]);

  function callback(key) {
    setActiveTab(key);
  }

  function formatNumber(e) {
    if (e) {
      var x = e.toString().replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

    }
  }

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <React.Fragment>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Profile</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        {console.log(client, 'clientclientclientclient')}
        <Tabs activeKey={activeTab} onChange={callback}>
          <TabPane tab="CONTACT INFORMATION" key="contact">
            <Skeleton loading={loading}>
              <Card title="Client Details">
                <Descriptions column={1} layout="horizontal">
                  <Descriptions.Item label="Client Code">{client.client_code}</Descriptions.Item>
                  <Descriptions.Item label="Name">{humanize(client.name)}</Descriptions.Item>
                  <Descriptions.Item label="Relationship">
                    {humanize(client.relationship)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">{formatNumber(client.phone)}</Descriptions.Item>
                  <Descriptions.Item label="Cell">{formatNumber(client.cell)}</Descriptions.Item>
                  <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
                </Descriptions>
              </Card>
              {client.second_contact ?
                <Card title="2nd Contact Info">
                  <Descriptions column={1} layout="horizontal">
                    <Descriptions.Item label="Name">{client.second_contact.name}</Descriptions.Item>
                    <Descriptions.Item label="Relationship">
                      {humanize(client.second_contact.relationship)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">{formatNumber(client.second_contact.phone)}</Descriptions.Item>
                    <Descriptions.Item label="Cell">{formatNumber(client.second_contact.cell)}</Descriptions.Item>
                    <Descriptions.Item label="Email">{client.second_contact.email}</Descriptions.Item>
                  </Descriptions>
                </Card>
                : ""}


            </Skeleton>
          </TabPane>
          <TabPane tab="NOTIFICATIONS" key="notifications"></TabPane>
          <TabPane tab="DOCUMENTS" key="documents"></TabPane>
        </Tabs>
      </div>
    </React.Fragment>
  );
};
function mapStateToProps(state) {
  return {
    currentLoggedInUser: state.user.currentLoggedInUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}
export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ClientProfile
);