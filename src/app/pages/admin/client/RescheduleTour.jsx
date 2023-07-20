import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { DatePicker, Tabs, Skeleton, Empty, Collapse, Form, Input, Select, Table, Checkbox, Button, Card, Row, Col, Spin, List, Avatar, Modal } from "antd";
import { updateLead } from "../../../redux/actions/lead-actions";
import moment from 'moment';


const RescheduleTour = (props) => {
    const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
    const [dateData, setDateData] = useState(props.Date);
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const toggleScheduleModal = () => {
        setScheduleModalVisible(!scheduleModalVisible);
    }
    const dateChangeHandler = (fieldData, fieldValue) => {

        setDateData(moment(fieldData));
        // const data = { scheduled_date: fieldValue, tour_status: "scheduled" };
        // props.updateLeadData(props.LeadId, data);
        // toggleScheduleModal();
    }
    const handleSave = () => {
        // console.log(dateData);
        if (dateData) {
            props.updateLeadData(props.LeadId, { scheduled_date: dateData, tour_status: "scheduled" });
            toggleScheduleModal();
        }

    }
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }
    const range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };
    const disabledDateTime = () => ({
        disabledHours: () => range(0, hour),
        disabledMinutes: () => range(0, minute),
        // disabledSeconds: () => [55, 56],
    });
    return (
        <>
            <Button shape="round" onClick={toggleScheduleModal}>{props.buttonTitle}</Button>
            <Modal
                title="Select date & time to schedule your visit"
                visible={scheduleModalVisible}
                onOk={handleSave}
                okButtonProps={{ disabled: dateData ? false : true }}
                onCancel={toggleScheduleModal}
                okText='Schedule Tour'
            >
                <DatePicker allowClear={false} showTime id='datepicker' showNow={false} format="MM-DD-YY hh:mm A" onChange={dateChangeHandler} value={dateData} />
            </Modal>
        </>
    )
}



export default RescheduleTour;