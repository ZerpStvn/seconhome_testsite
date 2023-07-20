import React, { useState, useEffect } from "react";
import { Row, Col, Breadcrumb, Tabs, Skeleton, Empty } from "antd";
import { connect, useDispatch } from "react-redux";
import { listAllLikedLeadClients, setLeadClientListLoading, } from "../../../redux/actions/lead-client-actions";
import { listAll } from "../../../redux/actions/home-actions";
import DisplayCard from "./DisplayCard";
import FilterViewFavorite from "./FilterViewFavorite";
import MapViewCommunity from "../community/MapViewCommunity";
import CardViewRoom from "../room/CardViewRoom";
import HomeDisplayCard from "./HomeDisplayCard";
import userService from "../../../services/user-service";

const { TabPane } = Tabs;

const ListFavorite = ({ homeList, leadClientLikedList, leadClientListLoading, currentLoggedInUser }) => {
  const currentUser = userService.getLoggedInUser();
  const dispatch = useDispatch();
  const [switchView, setSwitchView] = useState(true);
  const [leadsConfig, setLeadsConfig] = useState([]);
  const [tabValue, setTabValue] = useState(true);
  const [filterDropdownValue, setFilterDropdownValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [homeListConfig, setHomeListConfig] = useState([]);
  const [homeFilter, setHomeFilter] = useState({
    is_liked: { _eq: true },
    user_updated: { _eq: currentUser.id }
  });
  const [listFilter, setListFilter] = useState({
    leads: { _filter: { is_liked: { _eq: true }, _or: [{ approval: { _eq: "accepted" } }, { approval: { _eq: "pending" } }] } },
  });
  useEffect(() => {
    dispatch({
      type: 'RESET'
    })
  }, []);

  useEffect(() => {
    // dispatch(setLeadClientListLoading(true));
    (async () => {
      if (loading) {
        await getLeadClientLikedList();
        await getAllHomes();
        setLoading(false)
      }
    })()
    return () => {
      console.log("Lead ClientList Unmounting");
    };
  }, [loading]);



  const getAllHomes = async () => {
    return await new Promise(async (resolve) => {
      await dispatch(listAll({
        fields: "*,rooms.*",
        filter: homeFilter
      }))
      resolve();
    });
  }

  const getLeadClientLikedList = async () => {
    return await new Promise(async (resolve) => {
      await dispatch(
        listAllLikedLeadClients({
          fields: "*,leads.*,leads.home.*,leads.home.rooms.*",
          deep: listFilter,
        })
      );
      resolve();
    });
  }

  useEffect(() => {
    if (leadClientLikedList.length > 0) {
      homeLeadbudget(leadClientLikedList[0].leads);
    }
  }, [leadClientLikedList]);

  useEffect(() => {
    if (homeList.length > 0) {
      homebudget(homeList);
    }
  }, [homeList]);

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

  const loadingTrue = () => {
    setLoading(true);
  }

  const homeLeadbudget = (list) => {
    list.forEach((Item, index) => {
      if (Item.home) {
        Item.max_budget = getMaxRoomCost(Item.home.rooms);
        Item.min_budget = getMinRoomCost(Item.home.rooms);
      }

    });
    setLeadsConfig(list);
  };

  const homebudget = (list) => {
    list.forEach((Item, index) => {
      Item.max_budget = getMaxRoomCost(Item.rooms);
      Item.min_budget = getMinRoomCost(Item.rooms);
    });
    setHomeListConfig(list);
  };

  function callback(key) {
    setFilterDropdownValue("");
    switch (key) {
      case "communities":
        setListFilter({
          leads: { _filter: { is_liked: { _eq: true }, _or: [{ approval: { _eq: "accepted" } }, { approval: { _eq: "pending" } }] } },
        });
        setHomeFilter({
          is_liked: { _eq: true },
          user_updated: { _eq: currentUser.id }
        })
        setTabValue(true);
        break;
      case "rooms":
        setListFilter({
          leads: { _filter: { is_liked: { _eq: true }, _or: [{ approval: { _eq: "accepted" } }, { approval: { _eq: "pending" } }] } },
        });
        setTabValue(true);
        break;
      case "disliked":
        setListFilter({
          leads: { _filter: { is_liked: { _eq: false }, _or: [{ approval: { _eq: "accepted" } }, { approval: { _eq: "pending" } }] } },
        });
        setHomeFilter({
          is_liked: { _eq: false },
          user_updated: { _eq: currentUser.id }
        })
        setTabValue(false);
        break;

      default:
        break;
    }
    // dispatch(setLeadClientListLoading(true));
    setLoading(true);
  }

  function switchViewHandler(value) {
    setSwitchView(value);
  }

  function onListingFilterChange(filteredValue) {
    const filterValue = filteredValue
      ? {
        leads: {
          _filter: {
            _and: [
              { is_liked: { _eq: tabValue }, },
              { home: { care_offered: { _contains: filteredValue } } },
            ],
          },
        },
      }
      : { leads: { _filter: { is_liked: { _eq: tabValue } } } };

    let filterHomeValue = filteredValue ?
      {
        is_liked: { _eq: tabValue },
        user_updated: { _eq: currentUser.id },
        care_offered: { _contains: filteredValue }
      } :
      {
        is_liked: { _eq: true },
        user_updated: { _eq: currentUser.id }
      }

    setHomeFilter(filterHomeValue);
    setListFilter(filterValue);
    setFilterDropdownValue(filteredValue);
    // dispatch(setLeadClientListLoading(true));
    setLoading(true);
  }

  function roomsCollection() {
    let rooms = [];
    if (leadClientLikedList.length > 0) {
      leadClientLikedList[0].leads.map(function (lead) {
        if (lead && lead.home !== null) {
          lead.home.rooms.forEach((room) => {
            if (room.status == "published") {
              console.log(room, "room");
              let data = {
                ...room,
                status: room.status,
                community: room.community,
                homeName: lead.home.name,
                homeAddress: lead.home.address_line_1,
                leadId: lead.id,
                leadApproval: lead.approval,
                leadClientId: leadClientLikedList[0].id,
                leadClientName: leadClientLikedList[0].name,
                leadClientPhone: leadClientLikedList[0].cell,
                leadClientRooms: lead.home.rooms,
                liked: lead.is_liked,
                notes: lead.notes,
                lead: lead
              };
              rooms.push(data);
            }

          });
        }
      });
    }
    return rooms;
  }

  const roomsData = roomsCollection();

  const handleRateChange = (value) => {
    if (value == "low_to_high") {
      let NewLeadHomes = leadsConfig.sort(function (a, b) {
        return a.min_budget - b.min_budget;
      });
      setLeadsConfig([...NewLeadHomes]);
      let NewHomes = homeListConfig.sort(function (a, b) {
        return a.min_budget - b.min_budget;
      });
      setHomeListConfig([...NewHomes]);
    }
    if (value == "high_to_low") {
      let NewLeadHomes = leadsConfig.sort(function (a, b) {
        return b.max_budget - a.max_budget;
      });
      setLeadsConfig([...NewLeadHomes]);
      let NewHomes = homeListConfig.sort(function (a, b) {
        return b.max_budget - a.max_budget;
      });
      setHomeListConfig([...NewHomes]);
    }
  }

  return (
    <React.Fragment>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>My Favorites</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Tabs defaultActiveKey="communities" onChange={callback}>
          <TabPane tab="COMMUNITIES" key="communities">
            {loading ? (
              <Skeleton />
            ) : (
              <React.Fragment>
                <FilterViewFavorite
                  onSetSwitchView={switchViewHandler}
                  defaultSwitchView={switchView}
                  listFilterChange={onListingFilterChange}
                  defaultFilterListValue={filterDropdownValue}
                  handleRateChange={handleRateChange}
                />
                {switchView ? (
                  <Row gutter={16}>
                    {homeListConfig.length == 0 && leadsConfig.length == 0 ? <Empty /> : ""}

                    {leadClientLikedList && leadClientLikedList.length > 0
                      ? leadClientLikedList.map((item, index) => (
                        <React.Fragment key={index}>
                          {leadsConfig.length > 0 ?
                            leadsConfig.map((lead) => (
                              <>
                                {lead && lead.home !== null && (
                                  <Col xs={24} md={8} lg={8} key={lead.id}>
                                    <DisplayCard
                                      leadClientId={item.id}
                                      leadClientName={item.name}
                                      leadClientPhone={item.cell}
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
                                      loadingTrue={loadingTrue}
                                    />
                                  </Col>
                                )}
                              </>
                              // )) : <Empty />}
                            )) : ""}
                        </React.Fragment>
                      ))
                      // : <Empty />}
                      : <Empty />}
                    {homeListConfig.length > 0 ? (
                      homeListConfig.map((home, index) => {
                        return (
                          <Col xs={24} md={8} lg={8} key={index}>
                            <HomeDisplayCard
                              homeID={home.id}
                              home={home}
                              name={home.name}
                              address={home.address_line_1}
                              coverImage={
                                home.image &&
                                home.image
                              }
                              liked={home.is_liked}
                              rooms={home.rooms}
                            />
                          </Col>
                        )


                      })
                    ) : ""}

                  </Row>
                ) : (
                  <div>
                    {leadClientLikedList && leadClientLikedList.length > 0 ? (
                      <React.Fragment>
                        <MapViewCommunity lead={leadsConfig} />
                      </React.Fragment>
                    ) : <Empty />}
                  </div>
                )}
              </React.Fragment>
            )}
          </TabPane>

          <TabPane tab="ROOMS" key="rooms">
            <Skeleton loading={loading}>
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                }}
              > */}
              <Row gutter={16}>
                {roomsData && roomsData.length > 0 ? (
                  <React.Fragment>
                    {roomsData.map((roomItem, index) => (

                      <React.Fragment key={index}>

                        {roomItem.home !== null ? (
                          <Col xs={24} md={8} lg={8} key={roomItem.id}>
                            {/* {roomItem.status} */}
                            <CardViewRoom
                              roomName={roomItem.name}
                              lead={roomItem.lead}
                              roomPrice={roomItem.base_rate}
                              // name={roomItem.homeName}
                              name={roomItem.type}
                              address={roomItem.homeAddress}
                              approval={roomItem.leadApproval}
                              coverImage={roomItem.profile}
                              leadID={roomItem.leadId}
                              notes={roomItem.notes}
                              leadClientId={roomItem.leadClientId}
                              leadClientName={roomItem.leadClientName}
                              leadClientPhone={roomItem.leadClientPhone}
                              homeID={roomItem.home}
                              room={roomItem}
                              rooms={roomItem.leadClientRooms}
                              roomId={roomItem.id}
                              liked={roomItem.liked}
                            />
                          </Col>

                        ) : null}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ) : <Empty />}
              </Row>

              {/* </div> */}
            </Skeleton>

          </TabPane>
          <TabPane tab="DISLIKED" key="disliked">

            {loading ? (
              <Skeleton />
            ) : (
              <React.Fragment>
                <FilterViewFavorite
                  onSetSwitchView={switchViewHandler}
                  defaultSwitchView={switchView}
                  listFilterChange={onListingFilterChange}
                  defaultFilterListValue={filterDropdownValue}
                  handleRateChange={handleRateChange}
                />
                {switchView ? (
                  <Row gutter={16}>
                    {homeListConfig.length == 0 && leadsConfig.length == 0 ? <Empty /> : ""}

                    {leadClientLikedList && leadClientLikedList.length > 0
                      ? leadClientLikedList.map((item, index) => (
                        <React.Fragment key={index}>

                          {leadsConfig.length > 0 ?
                            leadsConfig.map((lead) => (
                              <>
                                {lead && lead.home !== null && (
                                  <Col xs={24} md={8} lg={8} key={lead.id}>
                                    <DisplayCard
                                      leadClientId={item.id}
                                      leadClientName={item.name}
                                      leadClientPhone={item.cell}
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
                                      loadingTrue={loadingTrue}
                                    />
                                  </Col>
                                )}
                              </>

                            )) : <Empty />}
                        </React.Fragment>
                      ))
                      : <Empty />}
                    {homeListConfig.length > 0 ? (
                      homeListConfig.map((home, index) => {
                        return (
                          <Col xs={24} md={8} lg={8} key={index}>
                            <HomeDisplayCard
                              homeID={home.id}
                              home={home}
                              name={home.name}
                              address={home.address_line_1}
                              coverImage={
                                home.image &&
                                home.image
                              }
                              liked={home.is_liked}
                              rooms={home.rooms}
                            />
                          </Col>
                        )


                      })
                    ) : ""}
                  </Row>
                ) : (
                  <div>
                    {leadClientLikedList && leadClientLikedList.length > 0 ? (
                      <React.Fragment>
                        <MapViewCommunity lead={leadsConfig} />
                      </React.Fragment>
                    ) : <Empty />}
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

function mapStateToProps(state) {
  return {
    homeList: state.home.homeList,
    leadClientLikedList: state.leadClient.leadClientLikedList,
    leadClientListLoading: state.leadClient.leadClientListLoading,
    currentLoggedInUser: state.user.currentLoggedInUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listAllLeadClients: () => dispatch(listAllLikedLeadClients()),
    listAll: () => dispatch(listAll()),
    setLeadClientListLoading: () => dispatch(setLeadClientListLoading()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListFavorite);
