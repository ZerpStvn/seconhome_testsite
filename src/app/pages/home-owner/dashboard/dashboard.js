import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {signOut} from "../../../redux/actions/auth-actions"

import { List, Row, Col, Button, Spin } from "antd";
import { compose } from "redux";

signOut();
const Dashboard = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
   
  });

  

  return (
    <>
     Dashboard
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(Dashboard);
