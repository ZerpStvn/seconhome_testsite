import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import { CameraOutlined } from "@ant-design/icons";

const isMobileDevice = () => {
  const mobileDeviceRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileDeviceRegex.test(navigator.userAgent);
};

// const getBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// };

const UploadPhotosCamera = ({
  photoList,
  handelPhotoListChange,
  category,
  multiple,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage] = useState("");
  const [previewTitle] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  var showUpload = true;
  if (!multiple) {
    if (photoList.length > 0) {
      showUpload = false;
    }
  }

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const handleCameraCapture = () => {
    if (isMobile && inputRef.current) {
      inputRef.current.click();
    } else if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const imageFile = dataURLtoFile(imageSrc, "capturedImage.png");

      const updatedPhotoList = [...photoList, imageFile];
      handelPhotoListChange(updatedPhotoList, category);

      setPreviewVisible(false);
    }
  };

  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedPhotoList = [...photoList, file];
      handelPhotoListChange(updatedPhotoList, category);
    }
  };

  const webcamRef = useRef(null);

  const uploadButton = (
    <div onClick={handleCameraCapture}>
      <CameraOutlined />
      <div style={{ marginTop: 8 }}>Camera</div>
      {isMobile && (
        <input
          type="file"
          accept="image/*"
          capture="camera"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleChange}
        />
      )}
    </div>
  );

  return (
    <>
      <div onClick={handleCameraCapture}>{uploadButton}</div>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadPhotosCamera;
