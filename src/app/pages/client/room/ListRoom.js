import React, { useState, useEffect } from "react";
import { Breadcrumb, Tabs, Skeleton, Empty, Row, Col } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllAvailableRoomLeadClientsList,
  listAllAvailableRoomLeadClients,
  setLeadClientListLoading,
} from "../../../redux/actions/lead-client-actions";
import { roomTypesOptions } from "../../../constants/defaultValues";
import CardViewRoom from "./CardViewRoom";
import FilterViewRoom from "./FilterViewRoom";
import MapViewRoom from "./MapViewRoom";
import leadClientApi from "../../../redux/api/lead-client-api";

const { TabPane } = Tabs;

const ListRoom = () => {
  const dispatch = useDispatch();
  const roomList = useSelector(
    (state) => state.leadClient.leadClientAvailableRoomList
  );
  const loading = useSelector(
    (state) => state.leadClient.leadClientListLoading
  );
  const [switchView, setSwitchView] = useState(true);
  const [filterDropdownValue, setFilterDropdownValue] = useState("");
  const [availabilityValue, setAvailabilityValue] = useState("");
  const [roomType, setRoomType] = useState('private_room');
  const [leadsConfig, setLeadsConfig] = useState([]);
  const [filterValue, setFilterValue] = useState({
    room_type: "private_room",
    housing_type: "",
    availability: ""
  });
  const [listFilter, setListFilter] = useState({
    leads: {
      home: {
        rooms: {
          _filter: {
            availability: { _neq: "no" },
            type: { _eq: roomType },
            status: { _eq: "published" }
          }
        }
      }
    },
  });
  useEffect(() => {
    dispatch({
      type: 'RESET'
    })
  }, []);


  useEffect(() => {
    if (loading) {
      getAllAvailableRoomList();
    }
    return () => {
      console.log("Lead ClientList Unmounting");
    };
  }, [loading]);

  useEffect(() => {
    if (roomList.length) {
      homebudget(roomList[0].leads);
    }

  }, [roomList]);

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
      if (Item.home !== null) {
        Item.max_budget = getMaxRoomCost(Item.home.rooms);
        Item.min_budget = getMinRoomCost(Item.home.rooms);
      }
    });
    setLeadsConfig(list);
  };

  const getAllAvailableRoomList = async () => {

    // let data = await leadClientApi.getRoomListing({ ...ss, fields: ["*", "leads.*", "leads.home.*", "leads.home.rooms.*"], })
    dispatch(
      getAllAvailableRoomLeadClientsList({ ...filterValue, fields: ["*", "leads.*", "leads.home.*", "leads.home.rooms.*"], })
    );
  }

  function roomsCollection() {
    let rooms = [];
    if (roomList.length > 0) {
      leadsConfig.map(function (lead) {
        if (lead.home !== null && lead.approval === "accepted") {
          lead.home.rooms.forEach((room) => {
            if (room.status !== "draft" && room.availability !== null && room.type == roomType) {
              if (room.availability != "no") {
                let data = {
                  ...room,
                  homeName: lead.home.name,
                  lead: lead,
                  homeAddress: lead.home.address_line_1,
                  leadId: lead.id,
                  leadApproval: lead.approval,
                  leadClientId: roomList[0].id,
                  leadClientName: roomList[0].name,
                  leadClientPhone: roomList[0].cell,
                  leadClientRooms: lead.home.rooms,
                  liked: lead.is_liked,
                };
                rooms.push(data);
              }

            }
          });
        }
      });
    }
    return rooms;
  }

  const roomsData = roomsCollection();

  function callback(key) {
    // setListFilter({
    //   leads: {
    //     home: {
    //       rooms: {
    //         _filter: {
    //           availability: { _neq: "no" },
    //           type: { _eq: key },
    //           status: { _eq: "published" }
    //         }
    //       }
    //     }
    //   },
    // }
    // )
    setFilterValue((values) => {
      return {
        ...values,
        room_type: key
      }
    });
    setRoomType(key);
    setFilterDropdownValue('');
    dispatch(setLeadClientListLoading(true));
  }



  function onListingFilterChange(filteredValue) {
    // setListFilter({
    //   leads: {
    //     home: {
    //       _filter: {
    //         care_offered: { _contains: filteredValue },
    //       },
    //       // care_offered: { _contains: filteredValue },
    //       rooms: {
    //         _filter: {
    //           availability: { _neq: "no" },
    //           type: { _eq: roomType },
    //           status: { _eq: "published" }
    //         }
    //       }
    //     }
    //   },
    // }
    // )
    setFilterValue((values) => {
      return {
        ...values,
        housing_type: filteredValue
      }
    });
    setFilterDropdownValue(filteredValue);
    dispatch(setLeadClientListLoading(true));
    // const filterValue = filteredValue
    //   ? {
    //     home: { care_offered: { _contains: filteredValue } },
    //   }
    //   : {};
    // setListFilter(filterValue);
    // setFilterDropdownValue(filteredValue);
    // dispatch(setLeadListLoading(true));
  }

  const switchViewHandler = (value) => {
    setSwitchView(value);
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

  const handleAvailabilityChange = async (value) => {
    setFilterValue((values) => {
      return {
        ...values,
        availability: value
      }
    });
    setAvailabilityValue(value);
    dispatch(setLeadClientListLoading(true));

  }


  return (
    <React.Fragment>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Available Rooms</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        {roomTypesOptions && roomTypesOptions.length > 0 ? (
          <React.Fragment>
            <Tabs
              defaultActiveKey={roomTypesOptions[0].value}
              onChange={callback}
            >
              {roomTypesOptions.map((item) => (
                <TabPane tab={item.text} key={item.value}>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    <div
                    // style={{
                    //   display: "flex",
                    //   justifyContent: "flex-start",
                    //   flexWrap: "wrap",
                    // }}
                    >
                      <React.Fragment>
                        <FilterViewRoom onSetSwitchView={switchViewHandler}
                          defaultSwitchView={switchView}
                          availabilityValue={availabilityValue}
                          handleAvailabilityChange={handleAvailabilityChange}
                          listFilterChange={onListingFilterChange}
                          defaultFilterListValue={filterDropdownValue}
                          handleRateChange={handleRateChange} />
                        {switchView ?
                          <>
                            <Row gutter={16}>
                              {roomsData && roomsData.length > 0 ? (
                                <React.Fragment>
                                  {roomsData.map((roomItem, index) => (
                                    <React.Fragment key={index}>
                                      {roomItem.home !== null ? (
                                        <Col xs={24} md={8} lg={6} key={roomItem.id}>
                                          <CardViewRoom
                                            homeName={roomItem.homeName}
                                            room={roomItem}
                                            lead={roomItem.lead}
                                            address={roomItem.homeAddress}
                                            approval={roomItem.leadApproval}
                                            coverImage={roomItem.profile}
                                            leadID={roomItem.leadId}
                                            leadClientId={roomItem.leadClientId}
                                            leadClientName={roomItem.leadClientName}
                                            leadClientPhone={roomItem.leadClientPhone}
                                            homeID={roomItem.home}
                                            rooms={roomItem.leadClientRooms}
                                            rommId={roomItem.id}
                                            liked={roomItem.liked}
                                          />
                                        </Col>

                                      ) : null}
                                    </React.Fragment>
                                  ))}
                                </React.Fragment>
                              ) : <Empty />}
                            </Row>
                          </> :
                          <div>
                            {leadsConfig && leadsConfig.length > 0 ? (
                              <React.Fragment>
                                <MapViewRoom
                                  lead={leadsConfig}
                                // approvalType={approvalState}
                                />
                              </React.Fragment>
                            ) : null}
                          </div>}

                      </React.Fragment>

                    </div>
                  )}
                </TabPane>
              ))}
              ;
            </Tabs>
          </React.Fragment>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default ListRoom;
