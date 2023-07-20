import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { notifyUser } from "../../../../services/notification-service";
import { List, Divider, Row, Col, Button, Tabs, Form, Input, Card, Image, Select } from "antd";
import { compose } from "redux";
import { identity } from "ramda";
import Config from "../../../../config";
import { homeDocumentsCategories } from "../../../../constants/defaultValues";
import { useForm } from "../../../../constants/use-form";
import UploadDocuments from "../../../../components/upload-documents";
import camelCase from "camel-case";
import fileAPI from "../../../../redux/api/file-api";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Meta } = Card;



const EditCommunityDocuments = ({ editHome, documentList, handleSave }) => {
  const [form] = Form.useForm();
  const [importantDocuments, setImportantDocuments] = useState([]);
  const [marketingMaterials, setMarketingMaterials] = useState([]);
  const [licenseCertificate, setLicenseCertificate] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let _importantDocuments = []
    let _marketingMaterials = []
    let _licenseCertificate = []

    documentList.map((document) => {
      switch (document.category) {
        case "Important Documents":
          _importantDocuments.push(document)
          break;
        case "Marketing Materials":
          _marketingMaterials.push(document)
          break;
        case "License Certificate":
          _licenseCertificate.push(document)
          break;
        default:
          break;
      }
    })
    setImportantDocuments(_importantDocuments);
    setMarketingMaterials(_marketingMaterials);
    setLicenseCertificate(_licenseCertificate);

    return () => {
      console.log("Edit Communities Profile Unmounting");
    };
  }, [documentList]);



  const handelDocumentChange = ({ fileList }, category) => {
    switch (category) {
      case "Important Documents":
        setImportantDocuments(fileList)
        break;
      case "Marketing Materials":
        setMarketingMaterials(fileList)
        break;
      case "License Certificate":
        setLicenseCertificate(fileList)
        break;
      default:
        break;
    }
  }


  const handleDocumentsSave = async (values) => {
    setLoading(true);
    let _documents = [];
    let licenseCertificateIds = [];
    let marketingMaterialsIds = [];
    let importantDocumentsIds = [];

    importantDocumentsIds = await getFilesArray(importantDocuments, "Important Documents");
    marketingMaterialsIds = await getFilesArray(marketingMaterials, "Marketing Materials");
    licenseCertificateIds = await getFilesArray(licenseCertificate, "License Certificate");

    _documents = [...importantDocumentsIds, ...marketingMaterialsIds, ...licenseCertificateIds]
    handleSave(editHome.id, { documents: _documents });
  }


  const getFilesArray = async (fileList, category) => {
    let fileIds = [];
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      if (file.id) {
        fileIds.push(file.id)
      } else {
        const response = await fileAPI.uploadFile(file);
        fileIds.push({ directus_files_id: response.data.id, category })
      }
    }
    return fileIds;
  }


  return (
    <>

      <Row gutter={30}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card
            hoverable
            //cover={<img  src={`${Config.API}/assets/${editHome.image}`} />}
            className="home-main-title"
          >
            <Meta className="cap-letter" title={editHome.name} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Form
            form={form}
            layout={"horizontal"}
            onFinish={(values) => handleDocumentsSave(values)}
          >
            <Card title="Important Documents">
              <UploadDocuments multiple documentList={importantDocuments} handelDocumentListChange={handelDocumentChange} category="Important Documents" />
            </Card>
            <Card title="Marketing Materials">
              <UploadDocuments multiple documentList={marketingMaterials} handelDocumentListChange={handelDocumentChange} category="Marketing Materials" />
            </Card>
            <Card title="License Certificate">
              <UploadDocuments multiple documentList={licenseCertificate} handelDocumentListChange={handelDocumentChange} category="License Certificate" />
            </Card>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>



    </>
  );
};

function mapStateToProps(state) {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(EditCommunityDocuments);
