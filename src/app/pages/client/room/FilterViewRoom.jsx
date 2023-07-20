import React from "react";
import { Row, Col, Select, Switch } from "antd";
import { UnorderedListOutlined, GlobalOutlined } from "@ant-design/icons";
import { homeCareOfferedOptions } from "../../../constants/defaultValues";

const { Option } = Select;

const FilterViewRoom = ({
  onSetSwitchView,
  defaultSwitchView,
  listFilterChange,
  defaultFilterListValue,
  handleAvailabilityChange, availabilityValue,
  handleRateChange,
  disableSwitch
}) => {
  function handleListingChange(value) {
    listFilterChange(value);
  }

  // function handleRateChange(value) {
  //   console.log(`${value}`);
  // }

  function switchHandler(e) {
    onSetSwitchView(e);
  }
  return (
    <Row gutter={0}
      style={{
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <Col xs={24} sm={24} md={16}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}
            style={{ marginBottom: 16 }}
          >
            <Select
              defaultValue={defaultFilterListValue}
              style={{ width: '100%' }}
              onChange={handleListingChange}
              size="large"
            >
              <Option value="">All Communities</Option>
              {homeCareOfferedOptions &&
                homeCareOfferedOptions.length > 0 &&
                homeCareOfferedOptions.map((item, index) => (
                  <Option value={item.value} key={index}>
                    {item.text}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12}
            style={{ marginBottom: 16 }}
          >
            <Select
              defaultValue=""
              style={{ width: '100%' }}
              onChange={handleRateChange}
              size="large"
            >
              <Option value="">Select Rates</Option>
              <Option value="low_to_high">Lowest Rates</Option>
              <Option value="high_to_low">Highest Rates</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12}
            style={{ marginBottom: 16 }}
          >
            <Select
              defaultValue={availabilityValue}
              style={{ width: '100%' }}
              onChange={handleAvailabilityChange}
              size="large"
            >
              <Option value="">Select Availability</Option>
              <Option value="24_hours">Last 24 Hours</Option>
              <Option value="3_days">Last 3 Days</Option>
              <Option value="7_days">Last 7 Days</Option>
              <Option value="14_days">Last 14 Days</Option>
              <Option value="near_future">Near Future</Option>
            </Select>
          </Col>
        </Row>
      </Col>
      <Col xs={24} sm={24} md={8}
        className="text-right"
        style={{ marginBottom: 16 }}
      >
        <Switch
          disabled={disableSwitch}
          onChange={(e) => switchHandler(e)}
          className="view-type-switch"
          checkedChildren={
            <React.Fragment>
              <UnorderedListOutlined />
              List
            </React.Fragment>
          }
          unCheckedChildren={
            <React.Fragment>
              <GlobalOutlined />
              Map
            </React.Fragment>
          }
          defaultChecked={defaultSwitchView}
        />
      </Col>
    </Row>
  );
};

export default FilterViewRoom;
