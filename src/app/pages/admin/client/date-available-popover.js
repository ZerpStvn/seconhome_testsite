import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Select, DatePicker, Button, Modal, Form, } from "antd";
import moment from "moment";
import { roomAvailabilityOptions, roomAvailabilityOptionsAdmin } from "../../../constants/defaultValues";
import { notifyUser } from "../../../services/notification-service";

const dateFormat = "MMM DD, YYYY";
const DateAvailablePopOver = ({ data, updateAvailableRoom }) => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [availableForm] = Form.useForm();
    availableForm.setFieldsValue({
        availability: data.availability,
        date_available: data.date_available && moment(data.date_available, "YYYY-MM-DD")
    })
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        availableForm.submit();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const finish = (values) => {
        updateAvailableRoom(data, values)
        handleCancel();
    }

    return (
        <>
            <Button type="primary" onClick={showModal}
                style={{ backgroundColor: `${!!data.availability ? (data.availability == "no" ? "#f44456" : "#73c053") : "#f44456"}` }}>
                {!!data.availability ? roomAvailabilityOptions.map(({ value, text }) => value == data.availability && text) : "No"}

                {/* {data.availability ? data.availability : "No"} */}
            </Button>
            <Modal title="Availability" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ loading: loading }}>
                <Form onFinish={finish} form={availableForm}>
                    <Form.Item label="Availability" name="availability" rules={[
                        { required: true, message: "Please select availability" }
                    ]} >
                        <Select >
                            {data.type == "shared_2_people" || data.type == "shared_3_people" ?
                                <>
                                    <Select.Option value="no">No</Select.Option>
                                    <Select.Option value="shared_male">Only Male</Select.Option>
                                    <Select.Option value="shared_female">Only Female</Select.Option>
                                </> : <>
                                    <Select.Option value="yes">Yes</Select.Option>
                                    <Select.Option value="no">No</Select.Option>
                                </>}
                        </Select>
                    </Form.Item>
                    <Form.Item name="date_available" label="Date Available" rules={[
                        { required: true, message: "Please input date" }
                    ]} >
                        <DatePicker
                            format={dateFormat}
                            defaultValue={data.date_available && moment(data.date_available, "YYYY-MM-DD")}
                        // onChange={(date, dateString) => {
                        //     console.log(date.format("YYYY-MM-DD"), dateString, 'date, dateString');
                        // }
                        //     // handelDateAvailableChange(date, dateString, room.key)
                        // }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default DateAvailablePopOver;
