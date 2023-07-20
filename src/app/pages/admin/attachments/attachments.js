

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signin } from "../../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import { notifyUser } from "../../../services/notification-service";

import {  Upload, message, Button, Breadcrumb } from "antd";
import Icon from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";

const Attachment = ({ history }) => {
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [numOfTestimonials, setnNumOfTestimonials] = useState(3);

    const updateMedia = () => {
        var num = window.innerWidth > 1199 ? 3 : (window.innerWidth < 1199 && window.innerWidth > 767) ? 2 : 1
        setnNumOfTestimonials(num);
    };

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    const { Dragger } = Upload;

    const props = {
        name: 'file',
        multiple: true,
        // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        // onChange(info) {
        //   const { status } = info.file;
        //   if (status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        //   }
        //   if (status === 'done') {
        //     message.success(`${info.file.name} file uploaded successfully.`);
        //   } else if (status === 'error') {
        //     message.error(`${info.file.name} file upload failed.`);
        //   }
        // },
        // onDrop(e) {
        //   console.log('Dropped files', e.dataTransfer.files);
        // },
      };


    return (
        <div className="admin-attachments">
            <Breadcrumb>
                <Breadcrumb.Item>Client</Breadcrumb.Item>
                <Breadcrumb.Item>Attachments</Breadcrumb.Item>
            </Breadcrumb>
            <label>Upload New Attachments</label>
            {/* Upload Attachment */}
            <Dragger {...props}
            listType="picture-card"
            // fileList={fileList}
            >
                <p className="ant-upload-text">Drag &amp; Drop Files To Upload</p>
                <p className="ant-upload-text-divide">or</p>
                <p className="ant-upload-hint">
                    <Button><PlusOutlined /> Upload Directly</Button>
                </p>
            </Dragger>
        </div>
    );
};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        signin: (email, password) => dispatch(signin(email, password)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Attachment);
