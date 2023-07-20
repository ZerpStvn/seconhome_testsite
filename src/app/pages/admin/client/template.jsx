import React, { useState } from "react";
import { connect } from "react-redux";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import API from "../../../redux/api/lead-client-api";
import { Form, Input, Select, Button, Tooltip } from "antd";
import { notifyUser } from "../../../services/notification-service";
import UploadDocuments from "../../../components/upload-documents";
import fileAPI from "../../../redux/api/file-api";


const Template = ({ history }) => {

  const [attachment, setAttachment] = useState([]);
  const [document, setDocument] = useState([]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editor = React.useRef(null);

  function focusEditor() {
    editor.current.focus();
  }
  const onEditorStateChange = (editorState) => {
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    setEditorState(editorState);
  };

  const submit = async (values) => {
    console.log(attachment);
    values.message = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    values.attachment = document;
    let response = await API.createEmailTemplate(values);
    history.push("/admin/email_template");
  };

  const copyText = (value) => {
    let copyText = value.target;
    navigator.clipboard.writeText(copyText.innerText);
    notifyUser("Copied", "success");
  }

  const handleAttachment = async ({ fileList }) => {
    let importantDocumentsIds = await getFilesArray(fileList);
    let _documents = [...importantDocumentsIds];
    setAttachment(fileList);
    setDocument(_documents[0]);
  }

  const getFilesArray = async (fileList) => {
    let fileIds = [];
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      if (file.id) {
        fileIds.push(file.id)
      } else {
        const response = await fileAPI.uploadFile(file);
        fileIds.push(response.data.id)
      }
    }
    return fileIds;
  }

  return (
    <React.Fragment>
      <div className="admin-form">
        <Form name="dynamic_rule" onFinish={submit}>
          {/* <div className="noasterisk"> */}
          <div className="">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter Name",
                },
              ]}
            >
              <Input placeholder="Johan" />
            </Form.Item>
          </div>
          <div className="">
            <Form.Item
              name="subject"
              label="Subject"
              rules={[
                {
                  required: true,
                  message: "Please enter Subject",
                },
              ]}
            >
              <Input placeholder="Subject" />
            </Form.Item>
          </div>
          <Form.Item name="message" label="Message">
            <div className="editbackground">
              <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
              />
            </div>
            {/* <div onClick={copyText}>
              <Tooltip title="Click to copy">
                <span>{`{{partnerName}}`}</span>
              </Tooltip>
            </div> */}
          </Form.Item>
          {/* <div >
            <UploadDocuments documentList={attachment} handelDocumentListChange={handleAttachment} />
          </div> */}

          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value={"publish"}>Publish</Select.Option>
              <Select.Option value={"draft"}>Draft</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Template);
