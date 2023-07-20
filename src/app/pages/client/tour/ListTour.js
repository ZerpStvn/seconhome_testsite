import React, { useEffect, useState } from "react";
import { Row, Col, Breadcrumb, Tabs, Skeleton } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  listAllTourLeadClients,
  setLeadClientListLoading,
} from "../../../redux/actions/lead-client-actions";

import MapViewTour from "./MapViewTour";
import FilterViewCommunity from "../community/FilterViewCommunity";
import CardViewTour from "./CardViewTour";

const { TabPane } = Tabs;

const ListTour = () => {
  const [switchView, setSwitchView] = useState(true);
  const [tourState, setTourState] = useState("scheduled");
  const [leadsConfig, setLeadsConfig] = useState([]);
  const [filterDropdownValue, setFilterDropdownValue] = useState("");
  const [listFilter, setListFilter] = useState({});
  const dispatch = useDispatch();
  const tourList = useSelector((state) => state.leadClient.leadClientTourList);
  const loading = useSelector(
    (state) => state.leadClient.leadClientListLoading
  );
  const timeZone = new Date().getTimezoneOffset();
  useEffect(() => {
    if (loading || switchView) {
      getAllTourList();
    }
    return () => {
      console.log("Lead ClientList Unmounting");
    };
  }, [loading]);

  function getAllTourList() {
    dispatch(
      listAllTourLeadClients({
        fields: "*,leads.*,leads.home.*,leads.home.rooms.*",
        deep: listFilter,
      })
    );
  }

  useEffect(() => {
    if (tourList.length > 0) {
      homebudget(tourList[0].leads);
    }
  }, [tourList]);


  function callback(key) {

    setTourState(key);
    setListFilter({});
    dispatch(setLeadClientListLoading(true));
    setFilterDropdownValue('');

  }

  function switchViewHandler(value) {
    setSwitchView(value);
  }

  function onListingFilterChange(filteredValue) {
    const filterValue = filteredValue
      ? {
        leads: {
          _filter: {
            home: { care_offered: { _contains: filteredValue } },
          },
        },
      }
      : {};
    setListFilter(filterValue);
    setFilterDropdownValue(filteredValue);
    dispatch(setLeadClientListLoading(true));
  }


  const getMaxRoomCost = (rooms) => {
    if (rooms.length) {
      return Math.max.apply(
        null,
        rooms.length
          ? rooms.map(function (room) {
            return room.base_rate ? room.base_rate : 0;
          })
          : [0]
      );
    } else {
      return 0;
    }
  };

  const getMinRoomCost = (rooms) => {
    if (rooms.length) {
      return Math.min.apply(
        null,
        rooms.map(function (room) {
          return room.base_rate ? room.base_rate : 0;
        })
      );
    } else {
      return 0;
    }
  };




  const homebudget = (list) => {
    list.forEach((Item, index) => {
      if (Item.home) {
        Item.max_budget = getMaxRoomCost(Item.home.rooms);
        Item.min_budget = getMinRoomCost(Item.home.rooms);
      }

    });
    setLeadsConfig(list);
  };

  const handleRateChange = (value) => {
    if (value == "low_to_high") {
      let NewHomes = leadsConfig.sort(function (a, b) {
        return a.min_budget - b.min_budget;
      });
      setLeadsConfig([...NewHomes]);
    }
    if (value == "high_to_low") {
      let NewHomes = leadsConfig.sort(function (a, b) {
        return b.max_budget - a.max_budget;
      });
      setLeadsConfig([...NewHomes]);
    }
  }

  return (
    <React.Fragment>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Tours</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Tabs defaultActiveKey="scheduled" onChange={callback}>
          <TabPane tab="SCHEDULED" key="scheduled">
            {loading ? (
              <Skeleton />
            ) : (
              <React.Fragment>


                <FilterViewCommunity
                  onSetSwitchView={switchViewHandler}
                  defaultSwitchView={switchView}
                  listFilterChange={onListingFilterChange}
                  defaultFilterListValue={filterDropdownValue}
                  handleRateChange={handleRateChange}
                />

                {switchView ? (
                  <Row gutter={16}>
                    {tourList && tourList.length > 0
                      ? tourList.map((item, index) => (
                        <React.Fragment key={index}>
                          {leadsConfig.length > 0 &&
                            leadsConfig.map((lead) => (
                              <Col xs={24} md={8} lg={8} key={lead.id}>
                                {/* {lead.home.name == "micro" ? <>

                                  {console.log(new Date(lead.scheduled_date).getTime(), 'lead')}
                                  {console.log(new Date().getTime(), 'lead after')}
                                </> : ""} */}
                                {lead.tour_status === 'scheduled' && (lead.approval == "accepted" || lead.approval == "pending") && ((new Date(lead.scheduled_date).getTime() + (-timeZone * 60000)) > new Date().getTime()) &&
                                  lead.home !== null && (
                                    <CardViewTour
                                      leadClientId={item.id}
                                      leadClientName={item.name}
                                      leadClientPhone={item.cell}
                                      // leadID={lead.id}
                                      lead={lead}
                                      homeID={lead.home.id}
                                      name={lead.home.name}
                                      address={lead.home.address_line_1}
                                      approval={lead.approval}
                                      coverImage={
                                        lead.home.image &&
                                        lead.home.image
                                      }
                                      liked={lead.is_liked}
                                      notes={lead.notes}
                                      rooms={lead.home.rooms}
                                    />
                                  )}
                              </Col>
                            ))}
                        </React.Fragment>
                      ))
                      : null}
                  </Row>
                ) : (
                  <div>
                    {tourList && tourList.length > 0 ? (
                      <React.Fragment>
                        <MapViewTour lead={leadsConfig} tourType={tourState} />
                      </React.Fragment>
                    ) : null}
                  </div>
                )}
              </React.Fragment>
            )}
          </TabPane>
          <TabPane tab="COMPLETED" key="completed">
            {loading ? (
              <Skeleton />
            ) : (
              <>
                <FilterViewCommunity
                  onSetSwitchView={switchViewHandler}
                  defaultSwitchView={switchView}
                  listFilterChange={onListingFilterChange}
                  defaultFilterListValue={filterDropdownValue}
                  handleRateChange={handleRateChange}
                />
                {switchView ? (
                  <Row gutter={16}>
                    {tourList && tourList.length > 0
                      ? tourList.map((item, index) => (
                        <React.Fragment key={index}>
                          {leadsConfig.length > 0 &&
                            leadsConfig.map((lead) => (
                              <Col xs={24} md={8} lg={8} key={lead.id}>
                                {lead.tour_status === 'scheduled' && (lead.approval == "accepted" || lead.approval == "pending") && ((new Date(lead.scheduled_date).getTime() + (-timeZone * 60000)) < new Date().getTime()) &&
                                  lead.home !== null && (
                                    <CardViewTour
                                      leadClientId={item.id}
                                      leadClientName={item.name}
                                      leadClientPhone={item.cell}
                                      // leadID={lead.id}
                                      lead={lead}
                                      homeID={lead.home.id}
                                      name={lead.home.name}
                                      address={lead.home.address_line_1}
                                      approval={lead.approval}
                                      coverImage={
                                        lead.home.image &&
                                        lead.home.image
                                      }
                                      liked={lead.is_liked}
                                      notes={lead.notes}
                                      rooms={lead.home.rooms}
                                    />
                                  )}
                              </Col>
                            ))}
                        </React.Fragment>
                      ))
                      : null}
                  </Row>
                ) : (
                  <div>
                    {tourList && tourList.length > 0 ? (
                      <React.Fragment>
                        <MapViewTour lead={leadsConfig} tourType={tourState} />
                      </React.Fragment>
                    ) : null}
                  </div>
                )}
              </>
            )}

          </TabPane>
        </Tabs>
      </div>
    </React.Fragment>
  );
};

export default ListTour;
