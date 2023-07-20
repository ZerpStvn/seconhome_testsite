import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Divider, Button, Modal, Input, Form, Spin, List, Avatar, Descriptions, AutoComplete, } from "antd";
import { EyeOutlined, LikeOutlined, DislikeOutlined, MessageOutlined, } from "@ant-design/icons";
import { homeCareOfferedOptions } from "../../../constants/defaultValues";
import Config from "../../../config";
import { updateLead } from "../../../redux/actions/lead-actions";
import { createLeadClientMessage } from "../../../redux/actions/lead-client-actions";
import { SendOutlined } from "@ant-design/icons";
import NotesListCard from "./NotesListCard";
import { humanize } from "../../../helpers/string-helper";
import moment from "moment";
import { useHistory } from "react-router-dom";
import avatar from '../../../assets/images/notes.png';

const { Meta } = Card;
const { TextArea } = Input;

const DisplayCard = ({ name, address, approval, coverImage, liked, lead, notes, leadClientId, leadClientName, leadClientPhone, home, homeID, rooms, }) => {

  const data = {
    leads: {
      _filter: {
        lead: {
          _and: [
            {
              status: {
                _eq: "accepted",
              },
            },
            {
              approval: {
                _eq: "accepted",
              },
            },
          ],
        },
      },
    },
  };

  const dispatch = useDispatch();
  const history = useHistory();
  const leadID = lead.id;
  const imageUrl = coverImage ? `${Config.API}/assets/${coverImage}` : null;
  const badgeBG =
    approval === "accepted"
      ? "#52c41a"
      : approval === "pending"
        ? "#ff6d00"
        : "#ff0000";
  const likeColor = liked == true ? "#008000" : "#000";
  const dislikeColor = liked == false ? "#ff0000" : "#000";

  const [noteIconColor, setNoteIconColor] = useState(
    lead && lead.notes !== null ? "#0000ff" : "#000"
  );
  const [openNote, setOpenNote] = useState(false);
  const [openConnect, setOpenConnect] = useState(false);
  const [likeButtonColor, setLikeButtonColor] = useState(likeColor);
  const [dislikeButtonColor, setDislikeButtonColor] = useState(dislikeColor);
  const [notesValue, setNotesValue] = useState(
    notes !== null ? notes.data : []
  );
  const [noteData, setNoteData] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const contactFormInitialValue = {
    first_name: leadClientName.split(" ")[0],
    last_name: leadClientName.split(" ")[1],
    phone: leadClientPhone,
    message: "Kindly contact us for more information.",
  };

  const likeHandler = async (likeValue) => {
    // if (likeValue != null) {
    if (likeValue != null && liked != likeValue) {
      setLoading(true);
      const data = { is_liked: likeValue };
      try {
        await dispatch(updateLead(leadID, data));
        if (likeValue === true) {
          setDislikeButtonColor("#000");
          setLikeButtonColor("#008000");
        } else {
          setDislikeButtonColor("#ff0000");
          setLikeButtonColor("#000");
        }
      } catch (e) {
        console.log(e);
      }
      // loadingHandle();
      setLoading(false);
    }
    else {
      setLoading(true);
      const data = { is_liked: null };
      try {
        await dispatch(updateLead(leadID, data));
        // await dispatch(updateLead(leadID, data));

      } catch (e) {
        console.log(e);
      }
      // loadingHandle();
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    console.log("Success:", { ...values, home: homeID, client: leadClientId });
    setLoading(true);
    const formData = { ...values, home: homeID, client: leadClientId };
    await dispatch(createLeadClientMessage(formData));
    setLoading(false);
    setOpenConnect(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [notesForm] = Form.useForm();

  const onNotesFinish = async (values) => {
    const newNotesData = [...notesValue, values.notes];
    const updatedNotes = { notes: { data: newNotesData } };
    setLoading(true);
    await dispatch(updateLead(leadID, updatedNotes));
    notesForm.resetFields();
    notesValue.push(values.notes);
    setLoading(false);
    setNoteIconColor("#0000ff");
    //setOpenNote(false);
  };

  const onNotesFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const getMaxRoomCost = () => {
    return Math.max.apply(
      Math,
      rooms.map(function (room) {
        return room.base_rate;
      })
    );
  };


  const getMinRoomCost = () => {
    return Math.min.apply(
      Math,
      rooms.map(function (room) {
        return room.base_rate;
      })
    );
  };

  const showDetailModal = () => {
    setIsDetailModalVisible(!isDetailModalVisible);
  };



  return (
    <React.Fragment>
      <Card
        style={{ maxWidth: "100%" }}
        cover={
          <div>
            <span
              className=" home-status"

              style={{
                position: "absolute",
                left: "10px",
                top: "10px",
                background: badgeBG,
              }}
            >
              {humanize(approval)}
            </span>
            <span
              className=" home-status home-availability"

              style={{
                position: "absolute",
                right: "10px",
                top: "10px",
                left: 'auto',
                background: 'blue',
              }}
            >
              Available
            </span>
            <img
              style={{
                width: "100%",
                height: "300px",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                objectFit: "cover",
              }}
              alt="home-image"
              src={imageUrl ? imageUrl : "https://via.placeholder.com/600X400"}
            />
          </div>
        }
        actions={[
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: 10,
            }}
          >
            <span
              role="img"
              onClick={() => setOpenNote(true)}
              aria-label="form"
              className="anticon anticon-form"
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="form"
                width="1em"
                height="1em"
                fill={noteIconColor}
                aria-hidden="true"
              >
                <path d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"></path>
                <path d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"></path>
              </svg>
            </span>

            {/* <span role="img" onClick={() => setOpenNote(true)} aria-label="comment" tabIndex="-1" className="anticon anticon-comment" >
              <svg viewBox="64 64 896 896" focusable="false" data-icon="comment" width="1em" height="1em" fill={noteIconColor} aria-hidden="true"><defs><style></style></defs><path d="M573 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40zm-280 0c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z"></path><path d="M894 345a343.92 343.92 0 00-189-130v.1c-17.1-19-36.4-36.5-58-52.1-163.7-119-393.5-82.7-513 81-96.3 133-92.2 311.9 6 439l.8 132.6c0 3.2.5 6.4 1.5 9.4a31.95 31.95 0 0040.1 20.9L309 806c33.5 11.9 68.1 18.7 102.5 20.6l-.5.4c89.1 64.9 205.9 84.4 313 49l127.1 41.4c3.2 1 6.5 1.6 9.9 1.6 17.7 0 32-14.3 32-32V753c88.1-119.6 90.4-284.9 1-408zM323 735l-12-5-99 31-1-104-8-9c-84.6-103.2-90.2-251.9-11-361 96.4-132.2 281.2-161.4 413-66 132.2 96.1 161.5 280.6 66 412-80.1 109.9-223.5 150.5-348 102zm505-17l-8 10 1 104-98-33-12 5c-56 20.8-115.7 22.5-171 7l-.2-.1A367.31 367.31 0 00729 676c76.4-105.3 88.8-237.6 44.4-350.4l.6.4c23 16.5 44.1 37.1 62 62 72.6 99.6 68.5 235.2-8 330z"></path><path d="M433 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z"></path></svg>
            </span> */}

            {/* <CommentOutlined
              key="note"
              onClick={() => setOpenNote(true)}
              style={{ fontSize: "20px", color: "#000" }}
            /> */}
          </div>,
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: 10,
            }}
          >
            {loading && !openConnect && !openNote ? (
              <Spin
                style={{
                  padding: 10,
                  backgroundColor: "#fff",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              />
            ) : (
              <React.Fragment>
                <LikeOutlined
                  key="like"
                  style={{ fontSize: "20px", color: likeButtonColor }}
                  onClick={() => likeHandler(true)}
                />
                <Divider type="vertical" />
                <DislikeOutlined
                  key="dislike"
                  style={{ fontSize: "20px", color: dislikeButtonColor }}
                  onClick={() => likeHandler(false)}
                />
              </React.Fragment>
            )}
          </div>,
        ]}
      >
        <div className="card-content community_detail">
          <Meta
            title={name}
            description={
              <div className="card-details">
                <p className="budget">
                  ${getMinRoomCost()} - ${getMaxRoomCost()} / Month
                </p>
                <div className="community_type">
                  {home.care_offered &&
                    home.care_offered.map((item, index) => {
                      // if (item == "continuing_care_retirement_community") {
                      //   return "Continuing Care Retirement Community"
                      // }
                      // else {
                      //   return humanize(item)
                      // }
                      return humanize(item)
                    }).join(', ')}
                </div>
                <p className="address-deatils">{address}</p>
              </div>
            }
          />
          <ul className="align-center" style={{ display: "flex" }}>
            <li >
              {/* <Button
                className="connect-btn"
                onClick={() => setOpenConnect(true)}
              >
                Connect
              </Button> */}

              <Button
                className="connect-btn"
                onClick={() => {
                  window.open(`/dashboard/home-detail/${home.id}`, '_blank');
                }}
              >
                Learn More
              </Button>
            </li>
            {/* <li style={{ width: "50%", textAlign: "right" }}>
              <a onClick={showDetailModal} style={{ color: "#1B75BC" }}>
                <EyeOutlined />
              </a>
            </li> */}
          </ul>
        </div>
      </Card>
      {/* <Modal
        footer={null}
        title="Community Details"
        visible={isDetailModalVisible}
        onOk={showDetailModal}
        onCancel={showDetailModal}
      >
        <div className="client-details">
          <Descriptions title="User Info" column={2}>
            {home.name && (
              <Descriptions.Item label="Name">{home.name}</Descriptions.Item>
            )}
            {lead && lead.date_created && (
              <Descriptions.Item label="Date & Time">
                {moment(lead.date_created).format("MM/DD/YY")}{" "}
                {moment(lead.date_created).format("LT")}{" "}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Address">
              {home.address_line_1} {home.address_line_2}
            </Descriptions.Item>
            {home.city && (
              <Descriptions.Item label="City">{home.city}</Descriptions.Item>
            )}
            {home.zip && (
              <Descriptions.Item label="Zip">{home.zip}</Descriptions.Item>
            )}
            {home.state && (
              <Descriptions.Item label="State">{home.state}</Descriptions.Item>
            )}
            {home.county && (
              <Descriptions.Item label="County">
                {home.county}
              </Descriptions.Item>
            )}
            {home.phone && (
              <Descriptions.Item label="Phone">{home.phone}</Descriptions.Item>
            )}
            {home.user_created && (
              <Descriptions.Item label="Partner Name">
                {home.user_created.first_name} {home.user_created.last_name}
              </Descriptions.Item>
            )}
            {home.license_number && (
              <Descriptions.Item label="License Number">
                {home.license_number}
              </Descriptions.Item>
            )}
            {home.care_offered && (
              <Descriptions.Item label="Care Offered">
                {home.care_offered
                  .map((item, index) => {
                    let Value = "";
                    homeCareOfferedOptions.forEach((Item) => {
                      if (Item.value === item) {
                        Value = Item.text;
                      }
                    });
                    return Value;
                  })
                  .join(", ")}
              </Descriptions.Item>
            )}
            {home.user_created && home.user_created.cell && (
              <Descriptions.Item label="Cell">
                {home.user_created.cell}
              </Descriptions.Item>
            )}
            {home.user_created && home.user_created.email && (
              <Descriptions.Item label="Email">
                {home.user_created.email}
              </Descriptions.Item>
            )}
            {home.community_fee && (
              <Descriptions.Item label="Community Fee">
                ${home.community_fee}
              </Descriptions.Item>
            )}
            {home.current_specials && (
              <Descriptions.Item label="Move-in Specials">
                {home.current_specials}
              </Descriptions.Item>
            )}
            {home.capacity && (
              <Descriptions.Item label="Capacity">
                {home.capacity}
              </Descriptions.Item>
            )}
            {home.year_started && (
              <Descriptions.Item label="Year Started">
                {home.year_started}
              </Descriptions.Item>
            )}
            {home.state_report && (
              <Descriptions.Item label="State Report">
                <a href={home.state_report}>{home.state_report}</a>
              </Descriptions.Item>
            )}
            {home.website && (
              <Descriptions.Item label="Website">
                <a href={home.website}>{home.website}</a>
              </Descriptions.Item>
            )}
          </Descriptions>
          {home.respite_daily_rates && (
            <Descriptions title="Respite Daily Rates" column={2}>
              {home.respite_daily_rates.shared_room && (
                <Descriptions.Item label="Shared Room">
                  ${home.respite_daily_rates.shared_room}
                </Descriptions.Item>
              )}
              {home.respite_daily_rates.private_room && (
                <Descriptions.Item label="Private Room">
                  ${home.respite_daily_rates.private_room}
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
          {home.point_system && (
            <Descriptions title="Point System" column={2}>
              {home.point_system.point && (
                <Descriptions.Item label="Point">
                  ${home.point_system.point}
                </Descriptions.Item>
              )}
              {home.point_system.total_points && (
                <Descriptions.Item label="Total Points">
                  {home.point_system.total_points}
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
          <Descriptions title="Care Levels" column={2}>
            <Descriptions.Item label="Care Costs Included">
              {home.care_costs_included ? "Yes" : "No"}
            </Descriptions.Item>
            {home.care_levels &&
              home.care_levels.map((item, index) => {
                return (
                  <Descriptions.Item key={index} label={item.key}>
                    ${item.value}
                  </Descriptions.Item>
                );
              })}
          </Descriptions>
          {home.additional_fee && (
            <Descriptions title="Additional Fee" column={2}>
              {home.additional_fee.map((item, index) => {
                return (
                  <Descriptions.Item key={index} label={item.key}>
                    ${item.value}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          )}
          {home.a_la_carte && (
            <Descriptions title="A La Carte" column={2}>
              {Object.entries(home.a_la_carte).map((item, index) => {
                return (
                  <Descriptions.Item key={index} label={humanize(item[0])}>
                    ${item[1]}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          )}
          
        </div>
      </Modal> */}
      <Modal
        title="Add Note"
        centered
        visible={openNote}
        onCancel={() => setOpenNote(false)}
        className="connect-modal"
        footer={null}
      >
        {notesValue && notesValue.length > 0 ? (
          <List
            dataSource={notesValue}
            renderItem={(note, index) => (
              <List.Item key={index}>
                <List.Item.Meta
                  style={{ display: "flex", alignItems: "center" }}
                  avatar={
                    <Avatar
                      src={avatar}
                      style={{ height: 30, width: 30 }}
                    />
                  }
                  description={<NotesListCard note={note} />}
                />
              </List.Item>
            )}
          ></List>
        ) : null}
        <Form
          name="notes"
          initialValues={{ notes: "" }}
          onFinish={onNotesFinish}
          onFinishFailed={onNotesFinishFailed}
          form={notesForm}
        >
          <Form.Item
            name="notes"
            rules={[{ required: true, message: "This field is required!" }]}
          >
            <TextArea
              rows={4}
              onChange={(e) => setNoteData(e.target.value)}
              placeholder="Add notes here..!"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Connect"
        centered
        visible={openConnect}
        onCancel={() => setOpenConnect(false)}
        className="connect-modal"
        footer={null}
      >
        <Form
          name="connect"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={contactFormInitialValue}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[
              { required: true, whitespace: true, message: "Please input your first name!" },
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[
              { required: true, whitespace: true, message: "Please input your last name!" },
            ]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                pattern: /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/g,
                message: 'Please input valid number!',
                // max: 14
              },
            ]}
          >
            <Input placeholder="Phone" />
          </Form.Item>
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please input your message!" }]}
          >
            <TextArea rows={4} placeholder="Message" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default DisplayCard;
