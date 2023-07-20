import { Result, Button } from "antd";
import React from "react";

const BackendServerError = () => {
  return (
    <>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary">Back Home</Button>}
      />
    </>
  );
};

export default BackendServerError;
