import React from "react";
import { Col, Row } from 'antd';

const Footer = () => {
    return (
        <>
            <footer>
                <div className="container">
                    <Row align="middle">
                        <Col xs={24} md={12}>
                            <div className="copyright-text">Copyright © 2013 - 2022 Second Home | Senior Living &#38; Caregiver Referrals</div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div className="social-list">
                                <ul>
                                    <li>
                                        <a href="https://www.facebook.com/secondhomeseniors/" target="_blank"><i className="fab fa-facebook-square"></i></a>
                                    </li>
                                    <li>
                                        <a href="https://www.yelp.com/biz/second-home-free-senior-living-referrals-torrance-2" target="_blank"><i className="fab fa-yelp"></i></a>
                                    </li>
                                    <li>
                                        <a href="https://www.instagram.com/secondhome.care/" target="_blank"><i className="fab fa-instagram"></i></a>
                                    </li>
                                    {/* <li>
                                        <a href="#" target="_blank"><i className="fab fa-youtube"></i></a>
                                    </li>
                                    <li>
                                        <a href="#" target="_blank"><i className="fab fa-linkedin"></i></a>
                                    </li> */}
                                    {/* <li>
                                        <a href="#" target="_blank"><i className="fab fa-twitter"></i></a>
                                    </li> */}
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </div>
            </footer>
        </>
    );
}
export default Footer;