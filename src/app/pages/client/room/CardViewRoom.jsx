import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Divider, Button, Modal, Input, Form, Spin, Image, List, Avatar } from "antd";
import {
  CommentOutlined,
  LikeOutlined,
  DislikeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Config from "../../../config";
import { updateLead } from "../../../redux/actions/lead-actions";
import { createLeadClientMessage, updateLeadClient } from "../../../redux/actions/lead-client-actions";
import { SendOutlined } from "@ant-design/icons";
import { humanize } from "../../../helpers/string-helper";
import NotesListCard from "../../../components/shared/displayCard/NotesListCard";
import avatar from '../../../assets/images/notes.png';
import { useEffect } from "react";

const { Meta } = Card;
const { TextArea } = Input;

const CardViewRoom = ({ lead, roomName, roomPrice, homeName, name, address, approval, coverImage, liked, leadID, notes, leadClientId, leadClientName, leadClientPhone, homeID, rooms, room, roomId }) => {

  const dispatch = useDispatch();
  const imageUrl = coverImage ? `${Config.API}/assets/${coverImage}` : null;
  const badgeBG = approval === "accepted" ? "#52c41a" : approval === "pending" ? "#ff6d00" : "#ff0000";
  const likeColor = liked == true ? "#008000" : "#000";

  const dislikeColor = liked == false ? "#ff0000" : "#000";
  const [noteIconColor, setNoteIconColor] = useState(!!notes ? "#0000ff" : "#000000");
  const [openNote, setOpenNote] = useState(false);
  const [openConnect, setOpenConnect] = useState(false);
  const [likeButtonColor, setLikeButtonColor] = useState(likeColor);
  const [dislikeButtonColor, setDislikeButtonColor] = useState(dislikeColor);
  // const [notesValue, setNotesValue] = useState(notes);
  const [notesValue, setNotesValue] = useState(
    !!notes ? notes.data : []
  );
  const [noteData, setNoteData] = useState("");
  const [loading, setLoading] = useState(false);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  useEffect(() => {
    setLikeButtonColor(likeColor);
    setDislikeButtonColor(dislikeColor);
  }, [likeColor, dislikeColor]);
  const contactFormInitialValue = {
    first_name: leadClientName.split(" ")[0],
    last_name: leadClientName.split(" ")[1],
    phone: leadClientPhone,
    // message: "Kindly contact us for more information.",
  };

  const likeHandler = async (likeValue) => {
    if (likeValue != null && liked != likeValue) {
      setLoading(true);
      const data = {
        "leads": {
          "update": [{ "id": leadID, "is_liked": likeValue }],
        }
      }
      try {
        await dispatch(updateLeadClient(leadClientId, data));
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
      setLoading(false);
    }
    else {

      setLoading(true);
      // const data = { is_liked: likeValue };
      const data = {
        "leads": {
          "update": [{ "id": leadID, "is_liked": null }],
        }
      }
      try {
        await dispatch(updateLeadClient(leadClientId, data));
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



  return (
    <React.Fragment>
      <Card
        // style={{ width: 400, marginRight: 10 }}
        cover={
          <div>
            <span
              className=" home-status"
              style={{
                position: "absolute",
                left: "10px",
                top: "10px",
              }}
            >
              {humanize(approval)}
            </span>
            {/* <img
              style={{
                width: "100%",
                height: "200px",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              alt="home-image"
              src={imageUrl ? imageUrl : "https://via.placeholder.com/600X400"}
            /> */}
            <Image
              src={imageUrl ? imageUrl : "https://via.placeholder.com/600X400"}
            />
          </div>
        }
        actions={[
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <span role="img" onClick={() => setOpenNote(true)} aria-label="form" className="anticon anticon-form"><svg viewBox="64 64 896 896" focusable="false" data-icon="form" width="1em" height="1em" fill={noteIconColor} aria-hidden="true"><path d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"></path><path d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"></path></svg></span>

          </div>,
          // <div
          //   style={{
          //     display: "flex",
          //     justifyContent: "flex-end",
          //     marginRight: 10,
          //   }}
          // >
          //   {loading && !openConnect && !openNote ? (
          //     <Spin
          //       style={{
          //         padding: 10,
          //         backgroundColor: "#fff",
          //         display: "flex",
          //         justifyContent: "flex-end",
          //       }}
          //     />
          //   ) : (
          //     <React.Fragment>
          //       <LikeOutlined
          //         key="like"
          //         style={{ fontSize: "20px", color: likeButtonColor }}
          //         onClick={() => likeHandler(true)}
          //       />
          //       <Divider type="vertical" />
          //       <DislikeOutlined
          //         key="dislike"
          //         style={{ fontSize: "20px", color: dislikeButtonColor }}
          //         onClick={() => likeHandler(false)}
          //       />
          //     </React.Fragment>
          //   )}
          // </div>,
        ]}
      >
        {/* <div style={{ display: "flex", justifyContent: "space-between" }}> */}
        <div className="card-content community_detail">
          <Meta
            title={homeName}
            description={
              <div className="card-details">

                {room && room.availability == "shared_male" ? "Shared Room - Male Only" : ""}
                {room && room.availability == "shared_female" ? "Shared Room - Female Only" : ""}
                {humanize(name)}
                <p className="budget">
                  {formatter.format(room && room.base_rate)} / Month
                  {/* {room && room.base_rate} / Month */}
                </p>
                <p className="address-deatils">{lead.home.city}</p>
              </div>

            }
          />
          <Button
            className="connect-btn"
            onClick={() => setOpenConnect(true)}
          >
            Message
          </Button>

        </div>
      </Card>
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
        title="Message Community"
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
          {/* <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input placeholder="Phone" />
          </Form.Item> */}
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please input your message!" }]}
          >
            <TextArea rows={4} placeholder="Write your message to the community here" />
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

export default CardViewRoom;
