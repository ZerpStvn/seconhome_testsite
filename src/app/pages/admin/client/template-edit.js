import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import API from "../../../redux/api/lead-client-api";
import { Form, Input, Select, Button, Spin } from "antd";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditTemplate = ({ history }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { id } = useParams();

  useEffect(() => {
    if (loading) {
      API.getEmailTemplate().then(response => {
        console.log(response);
        let Data = response.data.filter((Item, Index) => {
          return Item.id == id;
        });
        form.setFieldsValue(Data[0]);
        const blocksFromHTML = convertFromHTML(Data[0].message);
        const content = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(content));
        setLoading(false);
        console.log(Data[0]);
      });

    }
  }, []);

  // const editor = React.useRef(null);

  // function focusEditor() {
  //     editor.current.focus();
  // }
  const onEditorStateChange = (editorState) => {
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    setEditorState(editorState);
  };

  const submit = async (values) => {
    setLoading(true);
    values.message = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    var response = await API.updateEmailTemplate(id, values);
    history.push("/admin/email_template");
    console.log(response);
  };

  return (
    <React.Fragment>
      <div className="admin-form">

        <Spin size="large" spinning={loading}>
          <Form name="dynamic_rule" onFinish={submit} form={form}>
            {/* <div className="noasterisk"> */}
            <div className="">
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter First Name",
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
            </Form.Item>

            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value={"publish"}>Publish</Select.Option>
                <Select.Option value={"draft"}>Draft</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Spin>

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

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplate);
