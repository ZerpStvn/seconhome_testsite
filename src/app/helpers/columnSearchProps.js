import React ,{ useRef } from "react";
import {Input, Button, Space, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { humanize } from "./string-helper";




export const  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
        //   ref={searchInput}
          placeholder={`Search ${humanize(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
         

          <Button
            type="primary"
            onClick={confirm}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
         
          <Button type="default" onClick={clearFilters} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <Tooltip title="Search"><SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} /></Tooltip>,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });
