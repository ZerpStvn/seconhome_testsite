import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { Space, Popover, Skeleton, Empty, Collapse, Form, Input, Select, Table, Checkbox, Button, Card, Row, Col, Spin, List, Avatar, Modal } from "antd";
import { updateLead } from "../../../redux/actions/lead-actions";
import { EditOutlined } from '@ant-design/icons';

const PriceChange = (props) => {
    const text = props.Price;
    const roomKey = props.Key;
    const [priceValue, setPriceValue] = useState(props.Price);

    const changePrice = (field) => {
        console.log(field.target.value);
        setPriceValue(field.target.value);
    }

    const updatePrice = (roomKey, priceValue) => {
        console.log(roomKey, priceValue);
        props.UpdateRoomPrice(roomKey, priceValue)
    }

    return (
        <>
            <Space size="middle">{`$${text}`}</Space>
            <Popover content={
                <>
                    <Input placeholder="Basic usage" id={roomKey} defaultValue={priceValue} onChange={changePrice} type="number" />
                    <Button type="primary" size='small' onClick={() => updatePrice(roomKey, priceValue)}>Update</Button>
                </>
            } title="Update price" trigger="click">

                <EditOutlined />
            </Popover>
        </>
    )
}



export default PriceChange;