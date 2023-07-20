

import React, { useState } from "react";
import { Button, Card, Typography, Modal } from "antd";
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import moment from 'moment';
import { Link, useHistory } from "react-router-dom";
import { humanize } from "../../../helpers/string-helper";
const { Text, Title } = Typography;


const SavedSearchCard = ({ data, deleteSavedSearch }) => {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const history = useHistory();
  const mapContent = (Item) => {
    let entry = 1;
    return (
      Object.entries(Item).map((Key, Value) => {
        let content;
        if (Key[1] !== null && Key[1] !== '' && Key[0] !== 'id' && Key[0] !== 'client' && Key[0] !== 'title' && Key[0] !== 'date_created' && Key[0] !== 'address' && Key[0] !== 'lat' && Key[0] !== 'lng' && entry <= 3) {
          entry += 1;
          content = <div key={Value}><Text strong>{humanize(Key[0])} :</Text> <Text >{
            Key[0] === "date_created" ? moment(Key[1]).format('MM-DD-YYYY') :
              typeof Key[1] !== 'object' ? Key[1] :
                Key[1].map((item) => {
                  return (
                    humanize(item)
                  )
                }).join(', ')
          }</Text></div>
        }
        return content
      })
    );
  }
  const mapModalContent = (Item) => {
    return (
      Object.entries(Item).map((Key, Value) => {
        let content;
        if (Key[1] !== null && Key[1] !== '') {

          content = <div key={Value}><Text strong>{humanize(Key[0])} :</Text> <Text >{
            Key[0] === "date_created" ? moment(Key[1]).format('MM-DD-YYYY') :
              typeof Key[1] !== 'object' ? Key[1] :
                Key[1].map((item) => {
                  return (
                    humanize(item)
                  )
                }).join(', ')
          }</Text></div>
        }
        return content
      })
    );
  }
  const showDetailModal = () => {
    setIsDetailModalVisible(!isDetailModalVisible);
  }

  return (
    <Card className="save-search-card">
      <div className="card-inner">
        <div className="card-header"><span>
          <Title level={3}>{humanize(data.title)}</Title>
        </span>
          <div className="edit-option">
            <Link onClick={() => deleteSavedSearch(data.id)}>
              <CloseOutlined />
            </Link>
          </div>
        </div>
        {data.state !== null && data.city !== null ?
          <p style={{ marginTop: 20 }}>
            <span>{data.city !== null ? data.city : ''}, {data.state !== null ? data.state : ''}</span>
          </p>
          : ''}

        <div className="card-content">
          {mapContent(data)}
        </div>
        <div className="card-footer">
          <Button size="large" className="search-btn" onClick={() => {
            console.log("datata", data);
            sessionStorage.setItem("searchFormData", JSON.stringify(data));
            history.push("/search");
          }}>
            Run Search
          </Button>
          <a
            onClick={showDetailModal}
            style={{ color: "#1B75BC" }}
          >
            <EyeOutlined />
          </a>
        </div>
        <Modal footer={null} title="Details" visible={isDetailModalVisible} onOk={showDetailModal} onCancel={showDetailModal}>
          <div>
            {mapModalContent(data)}
          </div>
        </Modal>
      </div>
    </Card>
  );
};

export default SavedSearchCard;
