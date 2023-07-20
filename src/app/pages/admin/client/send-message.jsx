import React, { useState, useEffect } from "react";
import { Dropdown, Menu, InputNumber, Empty, Form, Input, Select, Radio, Checkbox, Button, Card, Row, Col, Spin, List, Avatar, Modal, Tooltip, Popconfirm, Switch, } from "antd";
import leadClientAPI from "../../../redux/api/lead-client-api";
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
const { Option } = Select;


const sendMessage = (props) => {
    const [sendMessageModal, setSendMessageModal] = useState(false);
    const [messageDataConfig, setMessageDataConfig] = useState([]);
    const [messageData, setMessageData] = useState(false);
    const [messagePreview, setMessagePreview] = useState({});
    const [EditMessageVisible, setEditMessageVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const client = props.client;
    const [editorState, setEditorState] = useState(
        EditorState.createEmpty()
    );
    const sendMessageHandle = async () => {
        setLoading(true)
        let data = {
            message: messagePreview.message,
            home_ids: props.selectedHomes
        }
        let response = await leadClientAPI.sendMessage(data, client.id);
        console.log(response);
        setSendMessageModal(false);
        props.unSelctHomes()

    };

    const sendMessageModalHandle = async () => {
        if (!messageData) {
            let response = await leadClientAPI.getEmailTemplate();
            setMessageDataConfig(response.data);
            console.log(response.data);
            setMessageData(true);
        }
        setSendMessageModal(!sendMessageModal);
        setLoading(false)
    };

    const onEditorStateChange = (editorState) => {
        console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        setEditorState(editorState);
        setMessagePreview((Val) => {
            return {
                ...Val,
                "message": draftToHtml(convertToRaw(editorState.getCurrentContent()))
            }
        });
    }

    const messageNameHandle = (Value, Inhd) => {
        console.log(Value, Inhd);
        let Data = messageDataConfig.filter((Item, Index) => {
            return Item.id == Value;
        });
        const blocksFromHTML = convertFromHTML(Data[0].message);
        const content = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(content));
        setMessagePreview(Data[0]);
    };


    const EditMessageVisibleHandle = () => {
        setEditMessageVisible(!EditMessageVisible);
    }

    return (
        <>
            <Button onClick={sendMessageModalHandle} disabled={!props.selectedHomes.length}>Send Message</Button>
            <Modal
                title="Send Message"
                visible={sendMessageModal}
                onOk={sendMessageHandle}
                okButtonProps={{ loading: loading }}
                onCancel={sendMessageModalHandle}
            >
                <Form layout="vertical">
                    <Form.Item label="Message Name" name="messageName">
                        <Select onChange={messageNameHandle}>
                            {messageDataConfig.map((Item, Index) => {
                                if (Item.status == "publish") {
                                    return <Option value={Item.id}>{Item.name}</Option>;
                                }
                            })}
                        </Select>
                    </Form.Item>
                    {messagePreview.message !== undefined ? (
                        <>
                            <Form.Item label="Message Preview" name="messageName">
                                <div
                                    className="messagebkground"
                                    dangerouslySetInnerHTML={{
                                        __html: messagePreview.message,
                                    }}
                                ></div>
                            </Form.Item>
                            <div style={{ textAlign: "right" }}>
                                <Button
                                    type="text"
                                    onClick={EditMessageVisibleHandle}
                                >
                                    Edit
                                </Button>
                            </div>
                            <div className="" style={{ display: EditMessageVisible ? "block" : "none" }}>
                                <Form.Item
                                    name="message"
                                    label="Message"
                                >
                                    <div className="editbackground">
                                        <Editor
                                            editorState={editorState}
                                            wrapperClassName="demo-wrapper"
                                            editorClassName="demo-editor"
                                            onEditorStateChange={onEditorStateChange}
                                        />
                                    </div>
                                </Form.Item>
                            </div>

                        </>
                    ) : (
                        " "
                    )}
                </Form>

            </Modal>
        </>
    )
}
export default sendMessage;