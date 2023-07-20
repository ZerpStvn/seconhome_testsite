import React, { useEffect,useState } from "react";
import { connect } from "react-redux";
import { listAllInvoices,updateInvoice,setInvoiceListLoading } from "../../../redux/actions/invoice-actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { notifyUser } from "../../../services/notification-service";
import { Row, Col,Table, Tag, Space,Breadcrumb } from "antd";
import { compose } from "redux";
import {humanize} from "../../../helpers/string-helper";
import { getColumnSearchProps } from "../../../helpers/columnSearchProps";
import { invoiceStatusOptions } from "../../../constants/defaultValues";


  

const ListInvoice = ({ invoiceList,invoiceListLoading,invoiceMessage,invoiceUpdated,invoiceListMeta }) => {

  const [pagination,setPagination] = useState({
    pageSize: 5,
    current:1,
  });
  const [sort,setSort] = useState([]);
  const  [filters,setFilters] = useState({});

  const dispatch = useDispatch();
  
  useEffect(() => {
    invoiceListLoading && dispatch(listAllInvoices({fields:['*',"lead.clients.*","lead.residents.*"],filter:filters,sort,page:pagination.current,limit:pagination.pageSize,meta:"*"}));
    invoiceListMeta && setPagination({...pagination,total:invoiceListMeta.filter_count});
    if(invoiceUpdated){
        notifyUser(invoiceMessage, "success");
    }
    return () => {
      console.log("Communities Unmounting");
    };
  }, [invoiceUpdated,invoiceMessage,invoiceListLoading]);

  const handelTableChange = ({current},tableFilters,sorter)=>{
    console.log(tableFilters);
    if(sorter && sorter.field){
      if(sorter.order == "ascend"){
        setSort(sorter.field);
      }else{
        setSort("-"+sorter.field);
      }
    }

    let _filters = {};


    Object.entries(tableFilters).forEach(([key, value]) => {
        let orFilter = [];
        if(value){
          switch (key) {
            case "number":
              _filters.number = {_in:value}
              break;
  
            case "amount":
              orFilter = [];
              value.map((data)=>{orFilter.push({amount:{_eq:data}}) })
              _filters._or = orFilter;
              break;
            
            case "client_name":
              orFilter = [];
              value.map((data)=>{orFilter.push({lead:{clients:{name:{_contains:data}}}}) })
              _filters._or = orFilter;
              break;
            case "resident_name":
              orFilter = [];
              value.map((data)=>{orFilter.push({lead:{residents:{name:{_contains:data}}}}) })
              _filters._or = orFilter;
              break;
            case "status":
              _filters.status = {_in:value};
              break;
          
            default:
              break;
          }
        }else{

        }
        
    });
    setFilters({..._filters});
    setPagination({...pagination,current});
    dispatch(setInvoiceListLoading(true));
  }

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'number',
      key: 'number',
      //sorter:true,
      sortDirections: ['ascend','descend','ascend'],
      //...getColumnSearchProps('number'),
      render: (text,invoice) => (
        <Space size="middle">
         <Link to={`/owner/invoices/${invoice.key}`}>{text}</Link> 
          
        </Space>
      )
    },
    {
      title: 'Client Name',
      dataIndex: 'client_name',
      key: 'client_name',
      //...getColumnSearchProps('client_name'),
      render: (text,invoice) => (
        <Space size="middle">
         {text}
          
        </Space>
      )
    },

    {
      title: 'Resident Name',
      dataIndex: 'resident_name',
      key: 'resident_name',
      //...getColumnSearchProps('resident_name'),
      render: (text,invoice) => (
        <Space size="middle">
           {text} 
          
        </Space>
      )
    },
    

    {
        title: 'Amount',
        dataIndex: 'amount',
        //sorter:true,
        sortDirections: ['ascend','descend','ascend'],
        //...getColumnSearchProps('amount'),
        key: 'amount',
        render: (text) => (
            <Space size="middle">
                {`$${text}`}
            </Space>
          )

    },
    
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      //sorter:true,
      sortDirections: ['ascend','descend','ascend'],
      key: 'due_date',
      render: (text) => (
          <Space size="middle">
              {`${text}`}
          </Space>
        )

  },
  
    
    
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      //filters:invoiceStatusOptions,
      //sorter:true,
      sortDirections: ['ascend','descend','ascend'],
      render: (text) => (
        <Space >
              <Tag color={text == "completed" || text == "published"?"green":"red"}>{humanize( text)}</Tag>
        </Space>
      )
    },
   
    
  ];
  

  return (
    <>
    <Breadcrumb>
            <Breadcrumb.Item>
            <Link to="/owner">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
            <Link to="/owner/invoices">Invoices</Link>
            </Breadcrumb.Item>
        </Breadcrumb>
      <Row gutter={30}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table 
            columns={columns} 
            loading={invoiceListLoading} 
            dataSource={invoiceList.map(({lead,amount,number,status,id,due_date}) =>{
              return {client_name:lead && lead.clients[0]?lead.clients[0].name:"",resident_name:lead &&lead.residents[0]?lead.residents[0].name:"",amount,number,key:id,status,due_date};
            })}
            pagination={pagination}
            onChange={handelTableChange}
          />
        </Col>
        </Row>
    </>
  );
};

function mapStateToProps(state) {
  return {
    invoiceList: state.invoice.invoiceList,
    invoiceListLoading: state.invoice.invoiceListLoading,
    invoiceListMeta: state.invoice.invoiceListMeta,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAllInvoices: () => dispatch(listAllInvoices()),
    updateInvoice: () => dispatch(updateInvoice()),
    setInvoiceListLoading: () => dispatch(setInvoiceListLoading()),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(ListInvoice);
