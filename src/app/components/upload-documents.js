import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadDocuments = ({
  documentList,
  handelDocumentListChange,
  category,
  multiple,
}) => {
  var showUpload = true;
  if (!multiple) {
    if (documentList.length > 0) {
      showUpload = false;
    }
  }
  const beforeUpload = (file) => {
    return false;
  };

  const uploadButton = <Button icon={<UploadOutlined />}>Upload</Button>;

  // Function to handle multiple file selection
  const handleFileSelection = (fileList) => {
    const filesArray = Array.from(fileList);
    handelDocumentListChange(filesArray, category);
  };

  return (
    <>
      <Upload
        listType="text"
        fileList={documentList}
        onPreview={() => false}
        name="images"
        onChange={({ fileList }) => handleFileSelection(fileList)}
        beforeUpload={beforeUpload}
        multiple // Allow multiple file selection
      >
        {showUpload && uploadButton}
      </Upload>
    </>
  );
};

export default UploadDocuments;
