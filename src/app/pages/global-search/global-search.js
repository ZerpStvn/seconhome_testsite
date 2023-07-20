import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import MapViewCommunity from "../admin/client/search-map";
import homeApi from "../../redux/api/home-api";
import leadApi from "../../redux/api/lead-api";
import SearchCard from "./search-card";
import { Dropdown, Segmented, Menu, Popover, Pagination, Empty, Form, Input, Select, Radio, Checkbox, Button, Card, Row, Col, Spin, List, Avatar, Modal, Tooltip, Popconfirm, Switch, Divider, AutoComplete, } from "antd";
import Icon, { UnorderedListOutlined, GlobalOutlined, DownCircleOutlined, HomeOutlined, CaretDownOutlined, UserOutlined, } from "@ant-design/icons";
import { maxBy, values } from "ramda";
import { humanize } from "../../helpers/string-helper";
import leadClientAPI from "../../redux/api/lead-client-api";
import userService from "../../services/user-service";
import API from "../../redux/api/saved-search";
import { notifyUser } from "../../services/notification-service";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Geocode from "react-geocode";
import Config from "../../config";
import { useParams } from "react-router";
import { mileageOptions } from "../../constants/defaultValues";
import SendMessage from "../admin/client/send-message";
import MapView from "./map-view";
// import config from "../../config";
const { confirm } = Modal;

Geocode.setApiKey(Config.googleMapsAPIkey);

const { Option } = Select;


const GlobalSearch = ({ history, location, currentLoggedInUser }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = userService.getAdminUser();
  const [switchView, setSwitchView] = useState(true);
  let searchData = sessionStorage.searchFormData
    ? JSON.parse(sessionStorage.searchFormData)
    : {};
  // let searchData = sessionStorage.searchFormData
  //   ? JSON.parse('{"address":"California, USA","housing_type":["assisted_living"]}')
  //   : { address: 'California, USA', housing_type: ['assisted_living'] };

  const [searchConfig, setSearchConfig] = useState(searchData);
  const [geoResponseData, setGeoResponseData] = useState({});
  const [client, setClient] = useState({});

  const [pageLoading, setPageLoading] = useState(true);
  const [sortOptionValue, setSortOptionValue] = useState("Sort By");
  const [homes, setHomes] = useState([]);
  const [confirmSavedSearch, setConfirmSavedSearch] = useState(false);
  const [saveSearchTitleVisible, setSaveSearchTitleVisible] = useState(false);
  const [saveSearchTitle, setSaveSearchTitle] = useState("");
  const [popOverVisible, setPopOverVisible] = useState({
    communityVisible: false,
    priceVisible: false,
    availabilityVisible: false,
    moreFiltersVisible: false,
  });
  const [paginationValue, setPaginationValue] = useState({
    currentPage: 1,
    totalPages: 0
  });
  const [filterLoading, setFilterLoading] = useState(false);
  const [filtersValues, setFiltersValues] = useState({});

  const { Search } = Input;
  const [visible, setVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    getClient()
  }, []);

  useEffect(() => {
    // Manhattan Beach, CA 90266, USA
    if (pageLoading && isClient) {
      searchConfig.address ? getAddressComponets(searchConfig.address).then((Data) => {
        setGeoResponseData(Data);
        onHomeSearch({ ...searchConfig, ...Data, search_by: "zip" });
        setSearchConfig((Values) => {
          return {
            ...Values,
            ...Data
          }
        });
      }) : onHomeSearch(searchConfig);


      // // console.log(response, "address");
      // setGeoResponseData(response);
      // // let tatata = { ...searchConfig, ...response }
      // onHomeSearch(searchConfig);
      // setSearchConfig((Values) => {
      //   return {
      //     ...Values,
      //     ...response
      //   }
      // });
      // console.log({ ...searchConfig, ...response }, 'searchConfigsearchConfigsearchConfig');


      // onHomeSearch(searchConfig)

    }
  }, [pageLoading, isClient]);


  const getClient = async () => {
    var user = await userService.getLoggedInUser();
    // console.log(user);
    if (user && user.client.length) {
      var clientData = await leadClientAPI.getLeadClientById(
        user.client[0],
        { fields: ["*", "leads.*"] }
      );
      if (clientData.data) {
        setClient(clientData.data);
        setIsClient(true);
      }
    }
    else {
      setIsClient(true);
    }
  };

  const getAddressComponets = async (address) => {
    let response = await Geocode.fromAddress(address);
    let addressComponents = {};
    if (response.results.length) {
      let location = response.results[0].geometry.location;
      addressComponents.lat = location.lat;
      addressComponents.lng = location.lng;

      let acCity = response.results[0].address_components.find(
        (r) => r.types.indexOf("locality") > -1
      );
      if (acCity && acCity.long_name) {
        addressComponents.city = acCity.long_name;
      }
      let acCounty = response.results[0].address_components.find(
        (r) => r.types.indexOf("administrative_area_level_2") > -1
      );
      if (acCounty && acCounty.long_name) {
        addressComponents.county = acCounty.long_name;
      }
      let acState = response.results[0].address_components.find(
        (r) => r.types.indexOf("administrative_area_level_1") > -1
      );
      if (acState && acState.long_name) {
        addressComponents.state = acState.long_name;
      }
      let acZip = response.results[0].address_components.find(
        (r) => r.types.indexOf("postal_code") > -1
      );
      if (acZip && acZip.long_name) {
        addressComponents.zip = acZip.long_name;
      }
    }
    return addressComponents;
  };

  const onApplySearch = () => {
    let tempPopOverVisible = popOverVisible;
    Object.keys(tempPopOverVisible).forEach((key) => {
      tempPopOverVisible[key] = false;
    });
    setPageLoading(true);
    setPopOverVisible((Values) => {
      return {
        ...Values,
        tempPopOverVisible,
      };
    });
  };

  const getHomeList = async (filters) => {
    if (confirmSavedSearch) {
      filters.search_saved = true;
      filters.search_saved_title = saveSearchTitle;
    }
    console.log(client, "client");

    const obj = {
      ...filters,
      fields: ["*", "rooms.*", "photos.*", "user_created.*"],
    }
    if (!!client.id) {
      obj.client = client.id
    }

    const homesList = await homeApi.search({
      ...obj,
      limit: -1
    });
    setFiltersValues({ ...obj })
    if (homesList.data) {
      setPaginationValue((values) => {
        return {
          ...values,
          totalPages: homesList.meta && homesList.meta.filter_count
        }
      });
      homebudget(homesList.data);
      // setHomes(homesList.data);
      setSaveSearchTitleVisible(false);
      setPageLoading(false);
    }
  };

  const paginationChange = async (e) => {
    setFilterLoading(true);
    filtersValues.page = e
    let homesList = await homeApi.search({
      ...filtersValues,
    });

    if (homesList.data) {
      setPaginationValue((values) => {
        return {
          ...values,
          totalPages: homesList.meta && homesList.meta.filter_count,
          currentPage: e
        }
      });
      homebudget(homesList.data);
      setFilterLoading(false);
    }

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
      Item.max_budget = getMaxRoomCost(Item.rooms);
      Item.min_budget = getMinRoomCost(Item.rooms);
    });
    setHomes(list);
  };

  const onHomeSearch = async (value) => {
    if (value) {
      await getHomeList(value);
    }
  };

  // useEffect(() => {
  //     if (confirmSavedSearch) {
  //         // form.submit();
  //         setVisible(false);
  //     }
  // }, [confirmSavedSearch]);

  const sortAZ = () => {
    let NewHomes = homes.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    setHomes([...NewHomes]);
  };
  const sortZA = () => {
    let NewHomes = homes.sort(function (a, b) {
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    setHomes([...NewHomes]);
  };
  const sortLowest = () => {
    let NewHomes = homes.sort(function (a, b) {
      return a.min_budget - b.min_budget;
    });
    setHomes([...NewHomes]);
  };
  const sortAHighest = () => {
    let NewHomes = homes.sort(function (a, b) {
      return b.max_budget - a.max_budget;
    });
    setHomes([...NewHomes]);
  };
  const switchHandler = (e) => {
    setSwitchView(e.target.value);
  };
  const SortOption = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setSortOptionValue("Lowest Rate");
          sortLowest();
        }}
        key="lowest_rate"
      >
        Lowest Rate
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setSortOptionValue("Highest Rate");
          sortAHighest();
        }}
        key="highest_rate"
      >
        Highest Rate
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setSortOptionValue("Name: A to Z");
          sortAZ();
        }}
        key="a_to_z"
      >
        Name: A to Z
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setSortOptionValue(" Name: Z to A");
          sortZA();
        }}
        key="z_to_a"
      >
        Name: Z to A
      </Menu.Item>
    </Menu>
  );

  const priceContent = (
    <>
      <Row>
        <Col span={24}>
          <Form
            className="pricetableset"
            layout="inline"
            onFinish={() => {
              onApplySearch();
            }}
          >

            <Form.Item name="min_budget" >
              {console.log()}
              <AutoComplete
                value={searchConfig.min_budget && searchConfig.min_budget}
                popupClassName="certain-category-search-dropdown"
                // defaultValue={searchConfig.min_budget && searchConfig.min_budget}
                dropdownMatchSelectWidth={500}
                options={[{
                  value: 0,
                  label: "Any Price",
                }, {
                  value: 1500,
                  label: "$1,500",
                }, {
                  value: 2500,
                  label: "$2,500",
                }, {
                  value: 3500,
                  label: "$3,500",
                }, {
                  value: 4500,
                  label: "$4,500",
                }, {
                  value: 5500,
                  label: "$5,500",
                }]}
                onChange={(e) => {
                  setSearchConfig((value) => {
                    return {
                      ...value,
                      min_budget: parseInt(e),
                    };
                  });
                }}
              >
                <Input size="large" placeholder="No Min" />
              </AutoComplete>
              {/* <Select
                showSearch
                value={searchConfig.min_budget && searchConfig.min_budget}
                dropdownStyle={{ minWidth: "100px" }}
                onChange={(e) => {
                  setSearchConfig((value) => {
                    return {
                      ...value,
                      min_budget: parseInt(e),
                    };
                  });
                }}
              >
                <Option value="" disabled={true}>
                  No Min
                </Option>
                <Option value="0">Any Price</Option>
                <Option value="1500">$1,500</Option>
                <Option value="2500">$2,500</Option>
                <Option value="3500">$3,500</Option>
                <Option value="4500">$4,500</Option>
                <Option value="5500">$5,500</Option>
              </Select> */}
            </Form.Item>
            <Form.Item name="max_budget">
              {console.log()}
              <AutoComplete
                popupClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={500}
                value={searchConfig.max_budget && searchConfig.max_budget}

                options={[{
                  value: 5500,
                  label: "$5,500",
                }, {
                  value: 6500,
                  label: "$6,500",
                }, {
                  value: 7500,
                  label: "$7,500",
                }, {
                  value: 8500,
                  label: "$8,500",
                }, {
                  value: 10000,
                  label: "$10,000",
                }, {
                  value: 9999999,
                  label: "Any Price",
                }]}
                onChange={(e) => {
                  setSearchConfig((value) => {
                    return {
                      ...value,
                      max_budget: parseInt(e),
                    };
                  });
                }}
              >
                <Input size="large" placeholder="No Max" />
              </AutoComplete>
              {/* <Select
                value={searchConfig.max_budget && searchConfig.max_budget}
                dropdownStyle={{ minWidth: "100px" }}
                onChange={(e) => {
                  setSearchConfig((value) => {
                    return {
                      ...value,
                      max_budget: parseInt(e),
                    };
                  });
                }}
              >
                <Option value="" disabled={true}>
                  No Max
                </Option>
                <Option value="5500">$5,500</Option>
                <Option value="6500">$6,500</Option>
                <Option value="7500">$7,500</Option>
                <Option value="8500">$8,500</Option>
                <Option value="10000">$10,000</Option>
                <Option value="9999999">Any Price</Option>
              </Select> */}
            </Form.Item>
            <Button onClick={() => {
              setSearchConfig((values) => {
                return {
                  ...values,
                  "min_budget": "",
                  "max_budget": "",
                }
              });
            }}>Reset</Button>
            <Button type="primary" htmlType="submit">
              Done
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
  const moreFiltersContent = () => (
    <Form
      name="basic"
      onFinish={() => {
        onApplySearch();
      }}
      autoComplete="off"
    >
      <div className="filter-container">
        <div className="filter-options">
          <Form.Item name="budget_type" label="Budget Type">

            <Radio.Group
              value={searchConfig.budget_type && searchConfig.budget_type[0]}
              onChange={(e) => {
                setSearchConfig((value) => {
                  return {
                    ...value,
                    budget_type: [e.target.value],
                  };
                });
              }}
            >
              <Radio value="alw">ALW</Radio>
              <Radio value="ssi">SSI</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </div>
      <div className="filter-container">
        <div className="filter-options">
          <Form.Item name="room_type" label="Room Type">

            <Radio.Group
              value={searchConfig.room_type && searchConfig.room_type[0]}
              onChange={(e) => {
                setSearchConfig((value) => {
                  return {
                    ...value,
                    room_type: [e.target.value],
                  };
                });
              }}
            >
              <Radio value="private_room">Private</Radio>
              <Radio value="shared_2_people_male">Shared - 2 People (Male)</Radio>
              <Radio value="shared_2_people_female">Shared - 2 People (Female)</Radio>
              <Radio value="shared_3_people_male">Shared - 3 People (Male)</Radio>
              <Radio value="shared_3_people_female">Shared - 3 People (Female)</Radio>
              <Radio value="1_bedroom">1 Bedroom</Radio>
              <Radio value="2_bedroom">2 Bedroom</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </div>

      <div className="filter-container">
        <div className="filter-options">
          <Form.Item name="room_amenities" label="Room Amenities">

            <Checkbox.Group
              value={searchConfig.room_amenities && searchConfig.room_amenities}
              options={[
                {
                  label: "Private Bath",
                  value: "private_bath",
                },
                {
                  label: "Kitchenette",
                  value: "kitchenette",
                },
                {
                  label: "Furnished ",
                  value: "fully_furnished",
                },
                {
                  label: "Non Ambulatory",
                  value: "non_ambulatory",
                },
                {
                  label: "TV Installed",
                  value: "tv_installed",
                },
                {
                  label: "Patio ",
                  value: "patio",
                },
                {
                  label: "Balcony",
                  value: "balcony",
                },
                {
                  label: "Washer & Dryer",
                  value: "washer_and_dryer",
                },
              ]}
              onChange={(e) => {
                setSearchConfig((value) => {
                  return {
                    ...value,
                    room_amenities: e,
                  };
                });
              }}
            />
          </Form.Item>
        </div>
      </div>
      <div className="filter-container">
        <div className="filter-options">
          <Form.Item name="community_amenities" label="Community Amenities">

            <Checkbox.Group
              value={searchConfig.community_amenities && searchConfig.community_amenities}
              onChange={(e) => {
                setSearchConfig((value) => {
                  return {
                    ...value,
                    community_amenities: e,
                  };
                });
              }}
              options={[
                {
                  label: "Smoking Allowed",
                  value: "smoking_allowed",
                },
                {
                  label: "Younger Than 60",
                  value: "younger_than_60",
                },
                {
                  label: "Pool ",
                  value: "pool",
                },
                {
                  label: "Gym",
                  value: "fitness_gym",
                },
              ]}
            />
          </Form.Item>
        </div>
      </div>
      <Button onClick={() => {
        delete searchConfig["budget_type"];
        delete searchConfig["room_type"];
        delete searchConfig["room_amenities"];
        delete searchConfig["community_amenities"];
        setSearchConfig((values) => {
          return {
            ...values,
            ...searchConfig
          }
        });
      }} htmlType="reset">Reset</Button>
      <Button type="primary" className="margin-top" htmlType="submit">
        Done
      </Button>
    </Form>
  );

  const availabilityContent = (
    <div className="Community-popup">
      <Radio.Group
        name="availability"
        value={searchConfig.availability}
        onChange={(e) => {
          setSearchConfig((value) => {
            return {
              ...value,
              availability: e.target.value,
            };
          });
        }}
      >
        <Radio value="24_hours">Last 24 Hours</Radio>
        <Radio value="3_days">Last 3 Days</Radio>
        <Radio value="7_days">Last 7 Days</Radio>
        <Radio value="14_days">Last 14 Days</Radio>
        <Radio value="near_future">Near Future</Radio>
      </Radio.Group>
      <Button onClick={() => {
        setSearchConfig((values) => {
          return {
            ...values,
            "availability": ""
          }
        });
      }}>Reset</Button>
      <Button type="primary" onClick={onApplySearch}>
        Done
      </Button>
    </div>
  );

  const communityContent = (
    <div className="Community-popup">
      <Radio.Group
        name="housing_type"
        value={searchConfig.housing_type && searchConfig.housing_type[0]}
        onChange={(e) => {
          setSearchConfig((value) => {
            return {
              ...value,
              housing_type: [e.target.value],
            };
          });
        }}
      >
        <Radio value="assisted_living">Assisted Living</Radio>
        <Radio value="memory_care">Memory Care</Radio>
        <Radio value="board_and_care_home">Board and Care Home</Radio>
        <Radio value="independent_living">Independent Living</Radio>
        <Radio value="continuing_care_retirement_community">Continuing Care Retirement Community</Radio>
        <Radio value="active_adult_community">
          Active Adult Community (55+)
        </Radio>
        <Radio value="skilled_nursing_facility">Skilled Nursing Facility</Radio>
      </Radio.Group>
      <Button onClick={() => {
        setSearchConfig((values) => {
          return {
            ...values,
            housing_type: []
          }
        });
      }}>Reset</Button>
      <Button type="primary" onClick={onApplySearch}>
        Done
      </Button>
    </div>
  );

  const saveSearchTitleVisibleHandle = () => {
    setSaveSearchTitle("");
    setSaveSearchTitleVisible(!saveSearchTitleVisible);
  };

  const saveSearchTitleContent = (
    <>
      <Input
        className="margin-bottom"
        placeholder="Title"
        value={saveSearchTitle}
        onChange={(e) => {
          setSaveSearchTitle(e.target.value);
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          setConfirmSavedSearch(true);
          onApplySearch();
        }}
      >
        Save
      </Button>
      <Button onClick={saveSearchTitleVisibleHandle}>Cancel</Button>
    </>
  );

  const onSelectAddress = async (address) => {

    setSearchConfig({
      ...searchConfig,
      address: address.label,
    });
    let response = await getAddressComponets(address.label);
    if (response) {
      onApplySearch()
    }

  };
  const getHousingType = () => {
    console.log(searchConfig.housing_type, "searchConfig.housing_typesearchConfig.housing_typesearchConfig.housing_type")
    if (!searchConfig || !searchConfig.housing_type) return "C.C.R.C."
    if (!searchConfig.housing_type.length) return "C.C.R.C."
    if (searchConfig.housing_type[0] == "continuing_care_retirement_community") return "C.C.R.C."
    return humanize(searchConfig.housing_type[0])
  }


  return (
    <Spin size="large" spinning={pageLoading}>
      <div className="admin-search" style={{ margin: "0" }}>
        <div id="admin-filter-topbar" className="searchsetting">
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
              {/* <GooglePlacesAutocomplete
                selectProps={{
                  placeholder: "Search zip, address, community name",
                  onChange: onSelectAddress,
                }}
                apiKey={"AIzaSyA6eaMRrfLzlYUe-H1sL6D9tkVXjS6O7BQ"}
                autocompletionRequest={{
                  componentRestrictions: { country: ["us"] },
                }}
              /> */}
              <Search
                type="number"
                placeholder="Search zip"
                allowClear
                size="large"
                // defaultValue={searchConfig.address}
                value={searchConfig.address}
                // name="address"
                className="propertysearch"
                onChange={(e) => {
                  setSearchConfig({
                    ...searchConfig,
                    address: e.target.value,
                  });
                }}
                onSearch={onApplySearch}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={14} xl={14}>
              <Popover
                content={communityContent}
                visible={popOverVisible.communityVisible}
                onVisibleChange={() => {
                  setPopOverVisible((values) => {
                    return {
                      ...values,
                      communityVisible: !popOverVisible.communityVisible,
                    };
                  });
                }}
                title="Community"
                trigger="click"
              >
                <Button>Community Type <CaretDownOutlined /></Button>
              </Popover>

              <Popover
                content={priceContent}
                visible={popOverVisible.priceVisible}
                onVisibleChange={() => {
                  setPopOverVisible((values) => {
                    return {
                      ...values,
                      priceVisible: !popOverVisible.priceVisible,
                    };
                  });
                }}
                title="Price"
                trigger="click"
              >
                <Button>Price <CaretDownOutlined /></Button>
              </Popover>

              <Popover
                title="Availability"
                visible={popOverVisible.availabilityVisible}
                onVisibleChange={() => {
                  setPopOverVisible((values) => {
                    return {
                      ...values,
                      availabilityVisible: !popOverVisible.availabilityVisible,
                    };
                  });
                }}
                content={availabilityContent}
                trigger={currentLoggedInUser ? "click" : ""}
              >
                <Tooltip title={!currentLoggedInUser ? "Please login to view option" : ""}>
                  <Button disabled={currentLoggedInUser ? false : true}>
                    Availability <CaretDownOutlined />
                  </Button>
                </Tooltip>

              </Popover>

              <Popover
                content={moreFiltersContent}
                visible={popOverVisible.moreFiltersVisibleVisible}
                onVisibleChange={() => {
                  setPopOverVisible((values) => {
                    return {
                      ...values,
                      moreFiltersVisibleVisible: !popOverVisible.moreFiltersVisibleVisible,
                    };
                  });
                }}
                trigger={currentLoggedInUser ? "click" : ""}
              >
                <Tooltip title={!currentLoggedInUser ? "Please login to view option" : ""}>
                  <Button disabled={currentLoggedInUser ? false : true}>
                    More Filters <CaretDownOutlined />
                  </Button>
                </Tooltip>

              </Popover>
              {/* {console.log(currentLoggedInUser.role, 'sAS')} */}
              {/* <Button className="save-btn" onClick={() => {
                                setConfirmSavedSearch(true);
                                onApplySearch();
                            }}>Save Search</Button> */}

              {currentLoggedInUser && currentLoggedInUser.role == Config.userId.client ? (
                <Popover
                  content={saveSearchTitleContent}
                  visible={saveSearchTitleVisible}
                  onVisibleChange={saveSearchTitleVisibleHandle}
                  title="Save search title"
                  trigger="click"
                >
                  <Button className="save-btn">Save Search</Button>
                </Popover>
              ) : (
                <>
                  <Tooltip title={"Please login as client to save search"}>
                    {/* <Button disabled={currentLoggedInUser ? false : true}>
                  More Filters <CaretDownOutlined />
                </Button> */}
                    <Button className="save-btn span-btn-class" disabled={true}>Save Search</Button>
                  </Tooltip>
                </>

              )}
              {/* <Button
                className="save-btn"
                onClick={() => {
                  setSearchConfig({});
                  setPageLoading(true);
                }}
              >
                Reset Filter
              </Button> */}
            </Col>
            <Col
              className="leftsection"
              xs={24}
              sm={24}
              md={24}
              lg={4}
              xl={4}
              style={{ textAlign: "right" }}
            >
              <Segmented
                size="small"
                onChange={(e) => switchHandler(e)}
                className="view-type-switch"
                options={[
                  {
                    label: "Map",
                    value: true,
                    icon: <GlobalOutlined />,
                  },
                  {
                    label: "List",
                    value: false,
                    icon: <UnorderedListOutlined />,
                  },
                ]}
                defaultChecked={switchView}
              />
              {/* <Switch
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
                                defaultChecked={switchView}
                            /> */}
            </Col>
          </Row>
        </div>
        <Row gutter={16} id="property-homes-list" className="property_list">
          <Col
            xs={24}
            sm={24}
            md={!switchView ? 24 : 12}
            className="search-filter-container"
          ><div className="search-filter-title">
              {searchConfig.address}{" "}
              <span className="cap-letter">{searchConfig.housing_type && searchConfig.housing_type.length > 0 && searchConfig.housing_type[0] == "continuing_care_retirement_community" ? "C.C.R.C." : searchConfig.housing_type && searchConfig.housing_type.length > 0 ? humanize(searchConfig.housing_type[0]):""}</span>
            </div>

            {/* <Divider></Divider> */}
            <div className="totl-record">
              <HomeOutlined />
              {homes.length === 0
                ? "No Record found"
                : homes.length === 1
                  ? "Only one record found"
                  : `Records: ${homes.length}/${paginationValue.totalPages}`}
            </div>
            <Dropdown className="sortbylist" overlay={SortOption}>
              <Button>
                {sortOptionValue} <DownCircleOutlined />
              </Button>
            </Dropdown>
            <hr className="line-design"></hr>
            <Row gutter={24} style={{ marginTop: '15px' }}>

              {filterLoading ? <Spin size="large" /> : homes.length != 0 ? (
                <>
                  {homes.map((home, index) => {
                    var leadData = false;
                    if (client && client.leads) {
                      client.leads.map((lead) => {
                        if (home.id == lead.home) {
                          leadData = lead;
                        }
                      });
                    }
                    return (
                      <Col
                        className=""
                        xs={24}
                        sm={24}
                        md={switchView ? 24 : 8}
                        lg={switchView ? 12 : 6}
                        key={index}
                      >
                        <SearchCard home={home} history={history} currentLoggedInUser={currentLoggedInUser} lead={leadData} />
                      </Col>
                    );

                  })}
                  {/* <Col
                    className=""
                    xs={24}
                    sm={24}
                  >
                    <Pagination
                      total={paginationValue.totalPages}
                      defaultPageSize={15}
                      onChange={paginationChange}
                      current={paginationValue.currentPage}
                    // defaultCurrent={paginationValue.currentPage}
                    />
                  </Col> */}

                </>
              ) : (
                <Col xs={24} md={24}>
                  <Card bordered={false}>
                    <Empty />
                  </Card>
                </Col>
              )}
            </Row>
          </Col>
          <Col
            xs={switchView ? 24 : 24}
            sm={switchView ? 24 : 24}
            md={switchView ? 12 : 0}
            className="map-container"
          >
            <MapView homes={homes} />
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

function mapStateToProps(state) {
  return {
    currentLoggedInUser: state.user.currentLoggedInUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearch);
