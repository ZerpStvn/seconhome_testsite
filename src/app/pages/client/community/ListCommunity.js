import React, { useState, useEffect } from "react";
import { Breadcrumb, Tabs, Skeleton, Row, Col } from "antd";
import { connect, useDispatch } from "react-redux";
import { setLeadListLoading } from "../../../redux/actions/lead-actions";
import { listAllLeads } from "../../../redux/actions/lead-actions";
import { DisplayCard } from "../../../components/shared/displayCard";
import MapViewCommunity from "./MapViewCommunity";
import FilterViewCommunity from "./FilterViewCommunity";

const { TabPane } = Tabs;

const ListCommunity = ({ leadList, leadListLoading }) => {
  const dispatch = useDispatch();
  const [switchView, setSwitchView] = useState(true);
  const [leadsConfig, setLeadsConfig] = useState([]);
  const [approvalState, setApprovalState] = useState("accepted");
  const [filterDropdownValue, setFilterDropdownValue] = useState("");
  const [listFilter, setListFilter] = useState({
    approval: "accepted",
    home: { rooms: { availability: { _in: ["yes", "shared_male", "shared_female"] } } },
  });


  useEffect(() => {
    // dispatch(setLeadListLoading(true));
    if (leadListLoading) {
      console.log(leadListLoading, "leadListLoadingleadListLoadingleadListLoading");
      getLeadClientList();
    }
    return () => {
      console.log("Lead ClientList Unmounting");
    };
  }, [leadListLoading]);



  useEffect(() => {
    // console.log(leadList, 'leadList');
    // let newList = [];
    // newList = leadList.filter((item) => {
    //   return newList.includes(item.id)

    // });
    homebudget(leadList.filter((tag, index, array) => array.findIndex(t => t.id == tag.id) == index));
  }, [leadList]);

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
      Item.max_budget = getMaxRoomCost(Item.home.rooms);
      Item.min_budget = getMinRoomCost(Item.home.rooms);
    });
    setLeadsConfig(list);
  };



  function getLeadClientList() {
    dispatch(
      listAllLeads({
        fields: "*,home.*,client.*,home.rooms.*,home.user_created.*", filter: listFilter
      })
    );
  }

  function callback(key) {
    setApprovalState(key);
    setListFilter({ home: { rooms: { availability: { _in: ["yes", "shared_male", "shared_female"] } } }, approval: key, });
    dispatch(setLeadListLoading(true));
    setFilterDropdownValue('');
  }

  function switchViewHandler(value) {
    setSwitchView(value);
  }

  function onListingFilterChange(filteredValue) {
    const filterValue = filteredValue
      ? {
        home: { care_offered: { _contains: filteredValue } },
      }
      : {};
    setListFilter(filterValue);
    setFilterDropdownValue(filteredValue);
    dispatch(setLeadListLoading(true));
  }


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
        <Breadcrumb.Item>All Communities</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Tabs defaultActiveKey="accepted" onChange={callback}>
          <TabPane tab="ACCEPTED" key="accepted">
            {leadListLoading ? (
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
                    {leadsConfig.length > 0 &&
                      leadsConfig.map((lead) => (

                        <>
                          {console.log(lead, "lead")}
                          <Col xs={24} md={8} lg={8} key={lead.id}>
                            {lead.approval === "accepted" &&
                              lead.home !== null && (
                                <>
                                  <DisplayCard
                                    leadClientId={lead.client.id}
                                    leadClientName={lead.client.name}
                                    leadClientPhone={lead.client.cell}
                                    lead={lead}
                                    homeID={lead.home.id}
                                    home={lead.home}
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
                                </>
                              )}
                          </Col>
                        </>
                      ))}
                  </Row>
                ) : (
                  <div>
                    {leadList && leadList.length > 0 ? (
                      <React.Fragment>
                        <MapViewCommunity
                          lead={leadList}
                          approvalType={approvalState}
                        />
                      </React.Fragment>
                    ) : null}
                  </div>
                )}
              </React.Fragment>
            )}
          </TabPane>
          <TabPane tab="PENDING" key="pending">
            {leadListLoading ? (
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
                    {leadsConfig.length > 0 &&
                      leadsConfig.map((lead) => (
                        <Col xs={24} md={8} lg={8} key={lead.id}>
                          {lead.approval === "pending" &&
                            lead.home !== null && (
                              <DisplayCard
                                leadClientId={lead.client.id}
                                leadClientName={lead.client.name}
                                leadClientPhone={lead.client.cell}
                                lead={lead}
                                homeID={lead.home.id}
                                home={lead.home}
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
                  </Row>
                ) : (
                  <div>
                    {leadList && leadList.length > 0 ? (
                      <React.Fragment>
                        <MapViewCommunity
                          lead={leadList}
                          approvalType={approvalState}
                        />
                      </React.Fragment>
                    ) : null}
                  </div>
                )}
              </React.Fragment>
            )}
          </TabPane>
        </Tabs>
      </div>
    </React.Fragment>
  );
};

//

function mapStateToProps(state) {
  return {
    leadList: state.lead.leadList,
    leadListLoading: state.lead.leadListLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAllLeads: () => dispatch(listAllLeads()),
    setLeadListLoading: () => dispatch(setLeadListLoading()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCommunity);
