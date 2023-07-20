import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Button, Form, Card } from "antd";
import { compose } from "redux";
import Config from "../../../../config";
import UploadPhotos from "../../../../components/upload-photos";
import fileAPI from "../../../../redux/api/file-api";
import UploadPhotosCamera from "../../../../components/upload-camera";

const isMobileDevice = () => {
  const mobileDeviceRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileDeviceRegex.test(navigator.userAgent);
};

const { Meta } = Card;

const EditCommunityPhotos = ({ editHome, photoList, handleSave }) => {
  const [form] = Form.useForm();
  const [commonAreasPhotos, setCommonAreasPhotos] = useState([]);
  const [kitchenPhotos, setKitchenPhotos] = useState([]);
  const [insideFacilityPhotos, setInsideFacilityPhotos] = useState([]);
  const [outsideFacilityPhotos, setOutsideFacilityPhotos] = useState([]);
  const [activitiesPhotos, setActivitiesPhotos] = useState([]);
  const [mealExamplesPhotos, setMealExamplesPhotos] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    let _commonAreasPhotos = [];
    let _kitchenPhotos = [];
    let _insideFacilityPhotos = [];
    let _outsideFacilityPhotos = [];
    let _activitiesPhotos = [];
    let _mealExamplesPhotos = [];
    photoList.map((photo) => {
      switch (photo.category) {
        case "Common Areas":
          _commonAreasPhotos.push(photo);
          break;
        case "Kitchen":
          _kitchenPhotos.push(photo);
          break;
        case "Inside Facility":
          _insideFacilityPhotos.push(photo);
          break;
        case "Outside Facility":
          _outsideFacilityPhotos.push(photo);
          break;
        case "Activities":
          _activitiesPhotos.push(photo);
          break;
        case "Meal Examples":
          _mealExamplesPhotos.push(photo);
          break;

        default:
          break;
      }
      return photo;
    });
    let _proFilePhoto = editHome.image
      ? [
          {
            uid: editHome.image,
            id: editHome.image,
            status: "done",
            url: `${Config.API}/assets/${editHome.image}`,
          },
        ]
      : [];
    setCommonAreasPhotos(_commonAreasPhotos);
    setKitchenPhotos(_kitchenPhotos);
    setInsideFacilityPhotos(_insideFacilityPhotos);
    setOutsideFacilityPhotos(_outsideFacilityPhotos);
    setActivitiesPhotos(_activitiesPhotos);
    setMealExamplesPhotos(_mealExamplesPhotos);
    setProfilePhoto(_proFilePhoto);

    return () => {
      console.log("Edit Communities Profile Unmounting");
    };
  }, [photoList]);

  const handelPhotoChange = ({ fileList }, category) => {
    console.log("fileList", fileList);
    switch (category) {
      case "Common Areas":
        setCommonAreasPhotos(fileList);
        break;
      case "Kitchen":
        setKitchenPhotos(fileList);
        break;
      case "Inside Facility":
        setInsideFacilityPhotos(fileList);
        break;
      case "Outside Facility":
        setOutsideFacilityPhotos(fileList);
        break;
      case "Activities":
        setActivitiesPhotos(fileList);
        break;
      case "Meal Examples":
        setMealExamplesPhotos(fileList);
        break;
      case "Profile":
        setProfilePhoto(fileList);
        break;

      default:
        break;
    }
  };

  const handlePhotosSave = async (values) => {
    setLoading(true);
    let _photos = [];
    let commonAreaPhotoIds = [];
    let kitchenPhotoIds = [];
    let insideFacilityPhotoIds = [];
    let outsideFacilityPhotoIds = [];
    let activitiesPhotoIds = [];
    let mealExamplesPhotoIds = [];
    let profilePhotoId = [];
    commonAreaPhotoIds = await getFilesArray(commonAreasPhotos, "Common Areas");
    kitchenPhotoIds = await getFilesArray(kitchenPhotos, "Kitchen");
    insideFacilityPhotoIds = await getFilesArray(
      insideFacilityPhotos,
      "Inside Facility"
    );
    outsideFacilityPhotoIds = await getFilesArray(
      outsideFacilityPhotos,
      "Outside Facility"
    );
    activitiesPhotoIds = await getFilesArray(activitiesPhotos, "Activities");
    mealExamplesPhotoIds = await getFilesArray(
      mealExamplesPhotos,
      "Meal Examples"
    );
    profilePhotoId = await getProfilePhotoId(profilePhoto);
    _photos = [
      ...commonAreaPhotoIds,
      ...kitchenPhotoIds,
      ...insideFacilityPhotoIds,
      ...outsideFacilityPhotoIds,
      ...activitiesPhotoIds,
      ...mealExamplesPhotoIds,
    ];
    handleSave(editHome.id, { photos: _photos, image: profilePhotoId });
  };

  const getFilesArray = async (fileList, category) => {
    let fileIds = [];
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      if (file.id) {
        fileIds.push(file.id);
      } else {
        const response = await fileAPI.uploadFile(file);
        fileIds.push({ directus_files_id: response.data.id, category });
      }
    }
    return fileIds;
  };

  const getProfilePhotoId = async (fileList) => {
    if (fileList.length) {
      let file = fileList[0];
      if (file.id) {
        return file.id;
      } else {
        const response = await fileAPI.uploadFile(file);
        return response.data.id;
      }
    } else {
      return null;
    }
  };

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
            onFinish={(values) => handlePhotosSave(values)}
          >
            <Card title="Front Of Community">
              <UploadPhotos
                photoList={profilePhoto}
                handelPhotoListChange={handelPhotoChange}
                category="Profile"
              />
            </Card>
            <Card title="Common Areas">
              <UploadPhotos
                multiple
                photoList={commonAreasPhotos}
                handelPhotoListChange={handelPhotoChange}
                category="Common Areas"
              />
              {isMobile ? (
                <UploadPhotosCamera
                  multiple
                  photoList={commonAreasPhotos}
                  handelPhotoListChange={(files) =>
                    handelPhotoChange({ fileList: files }, "Common Areas")
                  }
                  category="Common Areas"
                />
              ) : (
                <></>
              )}
            </Card>
            <Card title="Kitchen">
              <UploadPhotos
                multiple
                photoList={kitchenPhotos}
                handelPhotoListChange={handelPhotoChange}
                category="Kitchen"
              />
            </Card>
            <Card title="Inside Community">
              <UploadPhotos
                multiple
                photoList={insideFacilityPhotos}
                handelPhotoListChange={handelPhotoChange}
                category="Inside Facility"
              />
            </Card>
            <Card title="Outside Community">
              <UploadPhotos
                multiple
                photoList={outsideFacilityPhotos}
                handelPhotoListChange={handelPhotoChange}
                category="Outside Facility"
              />
            </Card>
            <Card multiple title="Activities">
              <UploadPhotos
                multiple
                photoList={activitiesPhotos}
                handelPhotoListChange={handelPhotoChange}
                category={"Activities"}
              />
            </Card>
            <Card title="Meal Examples">
              <UploadPhotos
                multiple
                photoList={mealExamplesPhotos}
                handelPhotoListChange={handelPhotoChange}
                category={"Meal Examples"}
              />
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
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  EditCommunityPhotos
);
