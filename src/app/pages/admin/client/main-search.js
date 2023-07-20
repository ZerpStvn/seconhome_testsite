import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signin } from "../../../redux/actions/auth-actions";
import { useDispatch } from "react-redux";
import MapViewCommunity from "./search-map";
import homeApi from "../../../redux/api/home-api";
import leadApi from "../../../redux/api/lead-api";
import DisplayCard from "./DisplayCard";
import {
  Pagination,
  Dropdown,
  Menu,
  InputNumber,
  Empty,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  Button,
  Card,
  Row,
  Col,
  Spin,
  List,
  Avatar,
  Modal,
  Tooltip,
  Popconfirm,
  Switch,
} from "antd";
import Icon, { PhoneOutlined } from "@ant-design/icons";
import {
  FilterFilled,
  InfoCircleOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { maxBy } from "ramda";
import { humanize } from "../../../helpers/string-helper";
import leadClientAPI from "../../../redux/api/lead-client-api";
import userService from "../../../services/user-service";
import API from "../../../redux/api/saved-search";
import { notifyUser } from "../../../services/notification-service";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Geocode from "react-geocode";
import Config from "../../../config";
import { useParams } from "react-router";
import {
  devicesAcceptedOptions,
  mileageOptions,
  specialServicesOptions,
  dietOptions,
} from "../../../constants/defaultValues";
import SendMessage from "./send-message";
const { confirm } = Modal;

Geocode.setApiKey(Config.googleMapsAPIkey);

const { Option } = Select;

const DashboardSearch = ({ history }) => {
  const { id } = useParams();
  const user = userService.getAdminUser();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [sendLeadsLoading, setSendLeadsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [homes, setHomes] = useState([]);
  const [selectedHomes, setSelectedHomes] = useState([]);
  const [client, setClient] = useState(user.client);
  const [filters, setFilters] = useState({});
  const [pendingHomes, setPendingHomes] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [clientAddress, setClientAddress] = useState(null);
  const [mapExpand, setMapExpand] = useState(false);
  const [confirmSavedSearch, setConfirmSavedSearch] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [searchConfirm, setSearchConfirm] = useState("yes");
  const [savedSearchTitle, setSavedSearchTitle] = useState("");
  const [filterLocation, setFilterLocation] = useState(null);
  const [includePhone, setIncludePhone] = useState(false);
  const [homeLoading, setHomeLoading] = useState(true);
  const [searchBy, setSearchBy] = useState("zip");
  const [statusCheckbox, setStatusCheckbox] = useState([]);
  const [resetFilter, setResetFilter] = useState(false);
  const [mainSearchValue, setMainSearchValue] = useState("");
  const [paginationValue, setPaginationValue] = useState({
    currentPage: 1,
    totalPages: 0,
  });
  const [filtersValues, setFiltersValues] = useState({});
  const [medicalAmenities, setMedicalAmenities] = useState([]);
  const [combativeBehavior, setCombativeBehavior] = useState(false);

  const updateMedia = () => {
    var num =
      window.innerWidth > 1199
        ? 3
        : window.innerWidth < 1199 && window.innerWidth > 767
        ? 2
        : 1;
    // setnNumOfTestimonials(num);
  };

  const { Search } = Input;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pageLoading) {
      getClient();
      getPendingHomes();
      window.addEventListener("resize", updateMedia);
    }

    return () => window.removeEventListener("resize", updateMedia);
  }, [pageLoading]);

  const onChange = (checkedValues, value) => {
    setStatusCheckbox(checkedValues);
  };

  const getHomeList = async (filters) => {
    if (confirmSavedSearch) {
      filters.search_saved = true;
      filters.search_saved_title = savedSearchTitle;
    }
    const homesList = await homeApi.search({
      ...filters,
      fields: ["*", "rooms.*", "user_created.*"],
      client: client.id,
      // limit: 15
      limit: -1,
    });
    setFiltersValues({
      ...filters,
      fields: ["*", "rooms.*", "user_created.*"],
      client: client.id,
      limit: -1,
      // limit: 15
    });
    if (homesList.data) {
      setPaginationValue((values) => {
        return {
          ...values,
          totalPages: homesList.meta && homesList.meta.filter_count,
          currentPage: 1,
        };
      });
      homebudget(homesList.data);

      setSearchLoading(false);
      // setHomes(homesList.data);
      // setHomeLoading(false);
    }
  };

  const getPendingHomes = () => {
    setSelectedHomes([]);
  };

  const onSelectHome = (checkedValues) => {
    setSelectedHomes(checkedValues);
  };

  const getMaxRoomCost = (rooms) => {
    if (rooms.length) {
      return Math.max.apply(
        null,
        rooms.length
          ? rooms.map(function(room) {
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
        rooms.map(function(room) {
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
    setHomeLoading(true);
  };

  const selectAllHomes = () => {
    const allPendingHomes = [];
    homes.map((home) => {
      if (client.leads) {
        // var found = false;

        // for (var i = 0; i < client.leads.length; i++) {
        //   if (client.leads[i].home == home.id) {
        //     found = true;
        //     break;
        //   }
        // }
        // if (!found) {
        allPendingHomes.push(home.id);
        // }
      }
    });
    setSelectedHomes(allPendingHomes);
    setPendingHomes(allPendingHomes);
  };
  const unselctAllHomes = () => {
    setSelectedHomes([]);
  };

  const getClient = async () => {
    var homesList = {};
    let clientAddressComponents;
    let formFields;
    var user = await userService.getAdminUser();
    if (user.client.length) {
      var clientData = await leadClientAPI.getLeadClientById(
        user.client[0].id,
        { fields: ["*", "leads.*", "primary_resident.*"] }
      );
      if (clientData.data) {
        setClient(clientData.data);
        setClientAddress(clientData.data.address);
        if (clientData.data.address) {
          clientAddressComponents = await getAddressComponets(
            clientData.data.address
          );
          // form.setFieldsValue({ ...clientAddressComponents });
        }
        formFields = {
          ...clientAddressComponents,
          radius: clientData.data.mileage,
          search_text: clientData.data.address,
          budget_type: clientData.data.budget_type,
          min_budget: clientData.data.min_budget,
          max_budget: clientData.data.max_budget,
          housing_type: clientData.data.housing_type,
          search_by: "zip",
        };

        form.setFieldsValue({ ...formFields });

        // form.setFieldsValue({
        //   address: clientData.data.address,
        //   radius: clientData.data.mileage,
        //   lat: clientData.data.lat,
        //   lng: clientData.data.lng,
        // });
      }

      if (id !== undefined) {
        let FilteredSearchData = await API.savedSearch({
          fields: "*",
          filter: { id: { _eq: id } },
        });

        let FilteredData = FilteredSearchData.data[0];
        delete FilteredData["date_created"];
        delete FilteredData["client"];
        delete FilteredData["id"];
        delete FilteredData["title"];

        // let FilteredSearch = FilteredSearchData.data.filter((Item, Index) => {
        //     return Item.id == id
        // });
        form.setFieldsValue({ ...FilteredData });
        homesList = await homeApi.search({
          ...FilteredData,
          fields: ["*", "rooms.*", "user_created.*"],
          client: clientData.data.id,
          limit: -1,
        });
        setFiltersValues({
          ...FilteredData,
          fields: ["*", "rooms.*", "user_created.*"],
          client: clientData.data.id,
          limit: -1,
        });
      } else {
        // console.log(clientAddressComponents, 'clientAddressComponents');
        // homesList = await homeApi.listAll({
        //   fields: ["*", "rooms.*", "user_created.*"],
        //   filter: {
        //     status: { _eq: "published" },
        //     rooms: { status: { _eq: "published" } },
        //     verification: { _eq: "approved" },
        //   },
        // });

        homesList = await homeApi.search({
          ...formFields,
          fields: ["*", "rooms.*", "user_created.*"],
          client: clientData.data.id,
          limit: -1,
        });
        setFiltersValues({
          ...formFields,
          fields: ["*", "rooms.*", "user_created.*"],
          client: clientData.data.id,
          limit: -1,
        });
      }
      if (homesList.data) {
        setPaginationValue((values) => {
          return {
            ...values,
            totalPages: homesList.meta && homesList.meta.filter_count,
          };
        });
        homebudget(homesList.data);
        // setHomes(homesList.data);
        setHomeLoading(false);
        if (clientData.data) {
          const allPendingHomes = [];
          homesList.data.map((home) => {
            if (clientData.data.leads) {
              var found = false;

              for (var i = 0; i < clientData.data.leads.length; i++) {
                if (clientData.data.leads[i].home == home.id) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                allPendingHomes.push(home.id);
              }
            }
          });
          setPendingHomes(allPendingHomes);
          setPageLoading(false);
        }
      }
    } else {
      history.push("/");
    }
  };

  const sendLeads = async (include_client_phone) => {
    setSendLeadsLoading(true);
    var newLeadData = {
      client: client.id,
      budget: client.max_budget,
      include_phone: include_client_phone,
    };
    const newLeadsData = [];
    selectedHomes.map(async (id) => {
      if (client.leads) {
        var found = false;

        for (var i = 0; i < client.leads.length; i++) {
          if (client.leads[i].home == id) {
            found = true;
            break;
          }
        }
        if (!found) {
          newLeadsData.push({ ...newLeadData, home: id });
        }
      }
    });

    // selectedHomes.map(async (id) => {
    //   newLeadsData.push({ ...newLeadData, home: id });
    // });

    if (newLeadsData) {
      var response = await leadApi.createLead(newLeadsData);
      if (response.data) {
        notifyUser("Leads have been sent", "success");
        setPageLoading(true);
        setSendLeadsLoading(false);
      }
    }
  };

  const sendLead = async (include_client_phone, homeId) => {
    setSendLeadsLoading(true);
    var newLeadData = {
      client: client.id,
      budget: client.max_budget,
      include_phone: include_client_phone,
      home: homeId,
    };

    if (newLeadData) {
      var response = await leadApi.createLead(newLeadData);
      if (response.data) {
        notifyUser("Leads have been sent", "success");
        setPageLoading(true);
        setSendLeadsLoading(false);
      }
    }
  };

  const onPopConfirm = async () => {
    await sendLeads(true);
  };

  const onPopConfirmCancel = async () => {
    await sendLeads(false);
  };

  const onHomeSearch = async (value) => {
    setSearchLoading(true);
    if (value) {
      await getHomeList({ search_text: value });
    } else {
      await getHomeList({});
    }
    // setSearchLoading(false);
  };

  const onSubmit = async (values) => {
    await getHomeList(values);
  };

  const onSelectAddress = async (address) => {
    setClientAddress(address.label);
    form.setFieldsValue({ address: address.label });
    let response = await getAddressComponets(address.label);
    if (response) {
      form.setFieldsValue({ ...response });
    }
  };

  const getAddressComponets = async (address) => {
    let response = await Geocode.fromAddress(address);
    let addressComponents = {};
    if (response.results.length) {
      let location = response.results[0].geometry.location;
      addressComponents.lat = location.lat;
      addressComponents.lng = location.lng;
      // addressComponents.address = response.formatted_address
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

  const expandMap = () => {
    setMapExpand(!mapExpand);
  };

  useEffect(() => {
    if (confirmSavedSearch) {
      form.submit();
      setVisible(false);
    }
  }, [confirmSavedSearch]);

  const savedSearchHandle = (Value) => {
    setSearchConfirm(Value);
  };

  const savedSearchTitleHandle = (Value) => {
    setSavedSearchTitle(Value.target.value);
  };

  const confirmModalSubmit = () => {
    setSearchLoading(true);
    if (searchConfirm === "no") {
      form.submit();
      setVisible(false);
    } else {
      setConfirmSavedSearch(true);
    }
    setConfirmModalVisible(false);
  };

  const showConfirm = () => {
    setConfirmModalVisible(true);
    // confirm({
    //     title: 'Do you Want to Save this search?',
    //     onOk() {
    //         setConfirmSavedSearch(true);
    //     },
    //     onCancel() {
    //         form.submit();
    //         setVisible(false)
    //     },
    // });
  };

  const sortAZ = () => {
    let NewHomes = homes.sort(function(a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    setHomes(NewHomes);
    setHomeLoading(true);
  };
  const sortZA = () => {
    let NewHomes = homes.sort(function(a, b) {
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    setHomes(NewHomes);
    setHomeLoading(true);
  };
  const sortLowest = () => {
    let NewHomes = homes.sort(function(a, b) {
      return a.min_budget - b.min_budget;
    });
    setHomes(NewHomes);
    setHomeLoading(true);
  };
  const sortAHighest = () => {
    let NewHomes = homes.sort(function(a, b) {
      return b.max_budget - a.max_budget;
    });
    setHomes(NewHomes);
    setHomeLoading(true);
  };

  const SortOption = (
    <Menu>
      <Menu.Item onClick={sortLowest} key="lowest_rate">
        Lowest Rate
      </Menu.Item>
      <Menu.Item onClick={sortAHighest} key="highest_rate">
        Highest Rate
      </Menu.Item>
      <Menu.Item onClick={sortAZ} key="a_to_z">
        Name: A to Z
      </Menu.Item>
      <Menu.Item onClick={sortZA} key="z_to_a">
        Name: Z to A
      </Menu.Item>
    </Menu>
  );

  const RadioChange = (Radio) => {
    if (Radio === "availability") {
      form.setFieldsValue({
        availability: "",
      });
    }
    if (Radio === "size") {
      form.setFieldsValue({
        size: "",
      });
    }
  };

  const onSearchByChange = (value) => {
    setSearchBy(value);
    // if (value == "radius") {
    //   setSearchBy(value)
    //   setAddressVisible("none");
    //   setRadiusVisible("");
    // } else {
    //   setAddressVisible("");
    //   setRadiusVisible("none");
    // }
  };

  const paginationChange = async (e) => {
    setSearchLoading(true);
    filtersValues.page = e;

    let homesList = await homeApi.search({
      ...filtersValues,
    });

    if (homesList.data) {
      setPaginationValue((values) => {
        return {
          ...values,
          totalPages: homesList.meta && homesList.meta.filter_count,
          currentPage: e,
        };
      });
      homebudget(homesList.data);
      setSelectedHomes([]);
      setSearchLoading(false);
    }
  };

  const filterModalHandle = () => {
    let amedicalAmentiesOption = [];
    devicesAcceptedOptions.map((item) => {
      amedicalAmentiesOption.push({
        label: item.text,
        value: item.value,
      });
    });
    specialServicesOptions.map((item) => {
      if (!dietOptions.includes(item.value)) {
        amedicalAmentiesOption.push({
          label: item.text,
          value: item.value,
        });
      }
    });
    setMedicalAmenities(amedicalAmentiesOption);
    setMainSearchValue("");
    setConfirmSavedSearch(false);
    setVisible(true);
  };

  const combativeBehaviorHandle = (e) => {
    setCombativeBehavior(e.target.checked);
    if (e.target.checked) {
      form.setFieldsValue({ combative_behaviors: "physical" });
    } else {
      form.setFieldsValue({ combative_behaviors: "" });
    }
  };

  return (
    <>
      <div className="admin-search search_detl">
        {pageLoading ? (
          <Spin size="large" />
        ) : (
          <>
            <Row gutter={0}>
              <Col
                xs={24}
                sm={24}
                md={mapExpand ? 0 : 12}
                className="search-filter-container"
              >
                <Search
                  type="number"
                  placeholder="Search Zip"
                  allowClear
                  size="large"
                  value={mainSearchValue}
                  onChange={(e) => {
                    setMainSearchValue(e.target.value);
                  }}
                  className="main_search"
                  onSearch={onHomeSearch}
                  loading={searchLoading}
                />
                {/* Filter buttons */}
                <div className="filter-buttons">
                  {/* <Button disabled={pendingHomes.length == selectedHomes.length} onClick={selectAllHomes} >Select All</Button> */}
                  <Button
                    onClick={
                      pendingHomes.length == selectedHomes.length
                        ? unselctAllHomes
                        : selectAllHomes
                    }
                  >
                    {pendingHomes.length == selectedHomes.length
                      ? "Unselect All"
                      : "Select All"}
                  </Button>
                  {/* <Button onClick={unselctAllHomes} >Unselect All</Button> */}

                  <Button
                    loading={sendLeadsLoading}
                    disabled={!selectedHomes.length}
                  >
                    <Popconfirm
                      placement="rightTop"
                      title="Include Client Phone?"
                      onConfirm={onPopConfirm}
                      onCancel={onPopConfirmCancel}
                      okText="Yes"
                      cancelText="No"
                      icon={<PhoneOutlined />}
                    >
                      Send Lead
                    </Popconfirm>
                  </Button>

                  <Button icon={<FilterFilled />} onClick={filterModalHandle}>
                    Filters
                  </Button>
                  {/* <Button>Sort By</Button> */}
                  <Dropdown overlay={SortOption}>
                    <Button>Sort By</Button>
                  </Dropdown>
                  <SendMessage
                    selectedHomes={selectedHomes}
                    unSelctHomes={unselctAllHomes}
                    client={client}
                  />
                </div>
                <div className="totl-record">
                  {homes.length === 0
                    ? "No Record found"
                    : homes.length === 1
                    ? "Only one record found"
                    : `Records: ${homes.length}`}
                  {/* : `Records: ${homes.length}/${paginationValue.totalPages}`} */}
                </div>

                {/* Filter Modal Start */}
                <Modal
                  title={
                    <>
                      All Filters{" "}
                      <a
                        onClick={() => {
                          onSearchByChange("zip");
                          form.resetFields();
                          setCombativeBehavior(false);
                          setStatusCheckbox([]);
                        }}
                        style={{ marginLeft: 10 }}
                      >
                        Reset
                      </a>
                    </>
                  }
                  centered
                  visible={visible}
                  // visible={true}
                  onOk={() => {
                    showConfirm();
                    // form.submit();
                    // setVisible(false)
                  }}
                  okText="Run Search"
                  onCancel={() => setVisible(false)}
                  width={1000}
                  className="filter-popup"
                >
                  <Form
                    name="basic"
                    onFinish={onSubmit}
                    autoComplete="off"
                    form={form}
                  >
                    <div className="filter-container">
                      <div className="filter-options">
                        <Form.Item name="status" label="Status">
                          <Checkbox.Group
                            options={[
                              {
                                label: "Exclude Denied",
                                value: "exclude_denied",
                                disabled: statusCheckbox.includes("denied")
                                  ? true
                                  : false,
                              },
                              {
                                label: "Exclude Pending",
                                value: "exclude_pending",
                                disabled: statusCheckbox.includes("pending")
                                  ? true
                                  : false,
                              },
                              { label: "Accepted", value: "accepted" },
                              { label: "Toured", value: "toured" },
                              {
                                label: "Scheduled Tour",
                                value: "scheduled_tour",
                              },
                              {
                                label: "Haven't send lead to yet",
                                value: "not_sent",
                              },
                              {
                                label: "Denied",
                                value: "denied",
                                disabled: statusCheckbox.includes(
                                  "exclude_denied"
                                )
                                  ? true
                                  : false,
                              },
                              {
                                label: "Pending",
                                value: "pending",
                                disabled: statusCheckbox.includes(
                                  "exclude_pending"
                                )
                                  ? true
                                  : false,
                              },
                            ]}
                            defaultValue={["exclude-denied"]}
                            onChange={onChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="filter-container">
                      {/* <p className="filter-name">Location</p> */}
                      {/* <Search
                                        placeholder="Search zip, address, community name"
                                        allowClear
                                        size="large"
                                        className="filter_search"
                                        name="address"
                                    /> */}
                      {/* <Form.Item>
                        <GooglePlacesAutocomplete
                          selectProps={{
                            placeholder: "Enter Address, Zip or City to look up",
                            onChange: onSelectAddress,
                          }}
                          apiKey={Config.googleMapsAPIkey}
                          autocompletionRequest={{
                            componentRestrictions: { country: ["us"] },
                          }}
                        />
                      </Form.Item> */}

                      <Form.Item
                        name="search_by"
                        label="Search By"
                        style={{ display: "none" }}
                      >
                        <Select
                          onChange={onSearchByChange}
                          defaultValue={"zip"}
                        >
                          <Select.Option key="text" value="text">
                            Text
                          </Select.Option>
                          <Select.Option key="radius" value="radius">
                            Radius
                          </Select.Option>
                          <Select.Option key="city" value="city">
                            City
                          </Select.Option>
                          <Select.Option key="zip" value="zip">
                            Zip
                          </Select.Option>
                          <Select.Option key="county" value="county">
                            County
                          </Select.Option>
                          <Select.Option key="state" value="state">
                            State
                          </Select.Option>
                        </Select>
                      </Form.Item>
                      <div
                        style={{
                          display: searchBy == "text" ? "block" : "none",
                        }}
                      >
                        <Row gutter={16}>
                          <Col xs={24} md={24}>
                            <Form.Item>
                              <GooglePlacesAutocomplete
                                selectProps={{
                                  placeholder:
                                    "Enter Address, Zip or City to look up",
                                  onChange: onSelectAddress,
                                }}
                                apiKey={Config.googleMapsAPIkey}
                                autocompletionRequest={{
                                  componentRestrictions: { country: ["us"] },
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24}>
                            <Form.Item name="address">
                              <Input placeholder="Address" disabled={true} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                      <div
                        style={{
                          display:
                            searchBy !== "radius" &&
                            searchBy !== "text" &&
                            searchBy !== "zip"
                              ? "block"
                              : "none",
                        }}
                      >
                        <Row gutter={16}>
                          <Col xs={24} md={24}>
                            <Form.Item>
                              <GooglePlacesAutocomplete
                                selectProps={{
                                  placeholder:
                                    "Enter Address, Zip or City to look up",
                                  onChange: onSelectAddress,
                                }}
                                apiKey={Config.googleMapsAPIkey}
                                autocompletionRequest={{
                                  componentRestrictions: { country: ["us"] },
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24}>
                            <Form.Item name="address">
                              <Input placeholder="Address" disabled={true} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item name="city">
                              <Input placeholder="City" disabled={true} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item name="state">
                              <Input placeholder="State" disabled={true} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item name="county">
                              <Input placeholder="County" disabled={true} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                      <div
                        style={{
                          display: searchBy == "zip" ? "block" : "none",
                        }}
                      >
                        <Row gutter={16}>
                          <Col xs={24} md={24}>
                            <Form.Item
                              name="zip"
                              rules={[
                                {
                                  pattern: "^[0-9]*$",
                                  min: 5,
                                  message: "Please enter valid zip",
                                },
                              ]}
                            >
                              <Input
                                type="number"
                                placeholder="Zip"
                                maxLength={6}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                      <div
                        style={{
                          display: searchBy == "radius" ? "block" : "none",
                        }}
                      >
                        <Row gutter={16}>
                          <Col xs={24} md={24}>
                            <Form.Item>
                              <GooglePlacesAutocomplete
                                selectProps={{
                                  placeholder:
                                    "Enter Address, Zip or City to look up",
                                  onChange: onSelectAddress,
                                }}
                                apiKey={Config.googleMapsAPIkey}
                                autocompletionRequest={{
                                  componentRestrictions: { country: ["us"] },
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item name="radius">
                              <Select>
                                {mileageOptions.map(({ text, value }) => (
                                  <Select.Option key={value} value={value}>
                                    {text}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item name="lat">
                              <Input placeholder="Lattitude" disabled={true} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item name="lng">
                              <Input placeholder="Longitude" disabled={true} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </div>
                    <div className="filter-container">
                      <p className="filter-name">Budget</p>
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item label="Min" name="min_budget">
                            <InputNumber placeholder="----" min={0} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item label="Max" name="max_budget">
                            <InputNumber placeholder="----" min={0} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                    <div className="filter-container">
                      {/* <p className="filter-name">Budget Type</p> */}
                      <div className="filter-options">
                        <Form.Item name="budget_type" label="Budget Type">
                          {/* <Radio.Group >
                                                <Radio value={"alw"}>ALW</Radio>
                                                <Radio value={"ssi"}>SSI</Radio>
                                            </Radio.Group> */}
                          <Checkbox.Group
                            options={[
                              { label: "ALW", value: "alw" },
                              { label: "SSI", value: "ssi" },
                            ]}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="filter-container">
                      {/* <p className="filter-name">Availability</p> */}
                      <div className="filter-options">
                        <Form.Item
                          name="availability"
                          label={
                            <>
                              Availability
                              <a
                                onClick={() => RadioChange("availability")}
                                style={{ marginLeft: 20 }}
                              >
                                Reset
                              </a>
                            </>
                          }
                        >
                          <Radio.Group>
                            <Radio value="24_hours">Last 24 Hours</Radio>
                            <Radio value="3_days">Last 3 Days</Radio>
                            <Radio value="7_days">Last 7 Days</Radio>
                            <Radio value="14_days">Last 14 Days</Radio>
                            <Radio value="near_future">Near Future</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="filter-container">
                      {/* <p className="filter-name">Housing Type</p> */}
                      <div className="filter-options">
                        <Form.Item name="housing_type" label="Housing Type">
                          <Checkbox.Group
                            options={[
                              {
                                label: (
                                  <>
                                    Assisted Living{" "}
                                    <Tooltip title="For seniors who need some help with daily activities and want a supportive community that’s active, social, and engaging.">
                                      <InfoCircleOutlined />
                                    </Tooltip>
                                  </>
                                ),
                                value: "assisted_living",
                              },
                              {
                                label: (
                                  <>
                                    Memory Care{" "}
                                    <Tooltip title="A supervised and secured community designed to support engagement and quality of life for residents living with dementia.">
                                      <InfoCircleOutlined />
                                    </Tooltip>
                                  </>
                                ),
                                value: "memory_care",
                              },
                              {
                                label: (
                                  <>
                                    Board and Care Home{" "}
                                    <Tooltip title="Homes in residential neighborhoods that are equipped and staffed to provide daily care for a small number of residents.">
                                      <InfoCircleOutlined />
                                    </Tooltip>
                                  </>
                                ),
                                value: "board_and_care_home",
                              },
                              {
                                label: (
                                  <>
                                    Independent Living{" "}
                                    <Tooltip title="For active older adults who want to downsize to a home in a retirement community but don’t need help to live independently.">
                                      <InfoCircleOutlined />
                                    </Tooltip>
                                  </>
                                ),
                                value: "independent_living",
                              },
                              {
                                label: (
                                  <>
                                    Continuing Care Retirement Community{" "}
                                    <Tooltip title="For residents who want to age in place as their care needs change—from Independent Living to nursing care. Requires a buy-in fee.">
                                      <InfoCircleOutlined />
                                    </Tooltip>
                                  </>
                                ),
                                value: "continuing_care_retirement_community",
                              },
                              {
                                label: (
                                  <>
                                    Active Adult Community (55+){" "}
                                    <Tooltip title="Communities of houses and apartments for residents 55 and older who live independently, enjoying an active, social lifestyle.">
                                      <InfoCircleOutlined />
                                    </Tooltip>
                                  </>
                                ),
                                value: "active_adult_community",
                              },
                              {
                                label: (
                                  <>
                                    Skilled Nursing Facility{" "}
                                    <Tooltip title="For seniors with more serious medical needs who require skilled care following a hospitalization, illness, or surgery.">
                                      <InfoCircleOutlined />
                                    </Tooltip>
                                  </>
                                ),
                                value: "skilled_nursing_facility",
                              },
                              {
                                label: (
                                  <>
                                    Room & Board Home{" "}
                                    <Tooltip title="For seniors with more serious medical needs who require skilled care following a hospitalization, illness, or surgery.">
                                      <InfoCircleOutlined />
                                    </Tooltip>
                                  </>
                                ),
                                value: "room_and_board_home",
                              },
                            ]}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="filter-container">
                      <div className="filter-options">
                        <Form.Item name="room_type" label="Room Type">
                          <Checkbox.Group
                            options={[
                              { label: "Private", value: "private_room" },
                              {
                                label: "Shared - 2 People (Male)",
                                value: "shared_2_people_male",
                              },
                              {
                                label: "Shared - 2 People (Female)",
                                value: "shared_2_people_female",
                              },
                              {
                                label: "Shared - 3 People (Male)",
                                value: "shared_3_people_male",
                              },
                              {
                                label: "Shared - 3 People (Female)",
                                value: "shared_3_people_female",
                              },
                              { label: "1 Bedroom", value: "1_bedroom" },
                              { label: "2 Bedroom", value: "2_bedroom" },
                            ]}
                          />
                          {/* <Radio.Group >
                                                <Radio value={"private_room"}>Private</Radio>
                                                <Radio value={"shared_2_people"}>Shared - 2 People</Radio>
                                                <Radio value={"shared_3_people"}>Shared - 3 People</Radio>
                                                <Radio value={"1_bedroom"}>1 Bedroom</Radio>
                                                <Radio value={"2_bedroom"}>2 Bedroom</Radio>
                                            </Radio.Group> */}
                        </Form.Item>
                      </div>
                    </div>
                    <div className="filter-container">
                      <div className="filter-options">
                        <Form.Item
                          name="size"
                          label={
                            <>
                              Size
                              <a
                                onClick={() => RadioChange("size")}
                                style={{ marginLeft: 20 }}
                              >
                                Reset
                              </a>
                            </>
                          }
                        >
                          <Radio.Group onChange={() => console.log(0)}>
                            <Radio value="small">
                              Small{" "}
                              <Tooltip title="“Up to 20 residents. A home-like environment with shared common areas and family-style dining, equipped and staffed to support daily care.”">
                                <InfoCircleOutlined />
                              </Tooltip>
                            </Radio>
                            <Radio value="medium">
                              Medium{" "}
                              <Tooltip title="“Between 20-50 residents. A boutique-like environment with communal areas and dining, services, activities, and amenities.”">
                                <InfoCircleOutlined />
                              </Tooltip>
                            </Radio>
                            <Radio value="large">
                              Large{" "}
                              <Tooltip title="“50+ residents. A hotel-like environment with a dining room, concierge services, and wide range of activities and amenities.”">
                                <InfoCircleOutlined />
                              </Tooltip>
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="filter-container">
                      <div className="filter-options">
                        <Form.Item name="rating" label="Rating">
                          <Checkbox.Group
                            options={[
                              { label: "A", value: "a" },
                              { label: "B", value: "b" },
                              { label: "C", value: "c" },
                              { label: "D", value: "d" },
                            ]}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="filter-container">
                      {/* <p className="filter-name">Room Amenities</p> */}
                      <div className="filter-options">
                        <Form.Item name="room_amenities" label="Room Amenities">
                          <Checkbox.Group
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
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="filter-container">
                      <div className="filter-options">
                        <Form.Item
                          name="community_amenities"
                          label="Community Amenities"
                        >
                          <Checkbox.Group
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
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item name="culture" label="Culture">
                            <Select placeholder="----" allowClear>
                              <Option value="african_american">
                                African American
                              </Option>
                              <Option value="korean">Korean </Option>
                              <Option value="japanese">Japanese </Option>
                              <Option value="vietnamese">Vietnamese </Option>
                              <Option value="chinese">Chinese </Option>
                              <Option value="christian/catholic">
                                Christian/Catholic{" "}
                              </Option>
                              <Option value="jewish">Jewish </Option>
                              <Option value="armenian">Armenian </Option>
                              <Option value="lgbtq">LGBTQ </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item name="diet" label="Diet Accomodation">
                            <Select placeholder="----" allowClear>
                              <Option value="vegetarian">Vegetarian</Option>
                              <Option value="special_diets">
                                Special Diets
                              </Option>
                              <Option value="kosher">Kosher</Option>
                              <Option value="gluten_free">Gluten-Free</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item name="pets_allowed" label="Pets Allowed">
                            <Select placeholder="----" allowClear>
                              <Option value="dogs">Dogs </Option>
                              <Option value="cats">Cats </Option>
                              <Option value="dogs_cats">Dog/Cat</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="gender_accepted"
                            label="Gender Accepted"
                          >
                            <Select placeholder="----" allowClear>
                              <Option value="only_male">Only Males</Option>
                              <Option value="only_female">Only Females</Option>
                              <Option value="male_female">Male/Females</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                    <div className="filter-container">
                      <div className="filter-options">
                        <Form.Item
                          name="medical_amenities"
                          label="Medical Amenities"
                        >
                          {/* {devicesAcceptedOptions.map((item, index) => {
                            console.log(item, index, 'devicesAcceptedOptions Item');
                            return {
                              label: item.text,
                              value: item.value,
                            }
                          })} */}

                          <Checkbox.Group options={medicalAmenities} />
                          {/* <Checkbox.Group
                            options={[
                              {
                                label: "Injections Allowed",
                                value: "injections",
                              },
                              {
                                label: "Hospice Allowed",
                                value: "hospice",
                              },
                              {
                                label: "Nurse On Staff",
                                value: "nurse_on_staff",
                              },
                              {
                                label: "Wheelchair Allowed",
                                value: "wheelchair",
                              },
                              {
                                label: "Hoyer",
                                value: "hoyer",
                              },
                              {
                                label: "GTube Allowed",
                                value: "gtube",
                              },
                              {
                                label: "Transferring Allowed",
                                value: "transferring_allowed",
                              },
                              {
                                label: "Awake Night Staff",
                                value: "awake_night_staff",
                              },
                            ]}
                          /> */}
                        </Form.Item>
                      </div>
                      <Row gutter={16}>
                        <Col xs={24} md={24}>
                          <Form.Item name="" label="">
                            <Checkbox
                              onChange={combativeBehaviorHandle}
                              checked={combativeBehavior}
                            >
                              Combative Behavior
                            </Checkbox>
                            {/* <Checkbox onChange={(e) => console.log(e.target.checked, "event")} >Checkbox</Checkbox> */}
                          </Form.Item>
                        </Col>
                        {combativeBehavior ? (
                          <Col xs={24} md={24}>
                            <Form.Item name="combative_behaviors" label="">
                              <Select allowClear>
                                <Option value="physical">Physical </Option>
                                <Option value="verbal">Verbal</Option>
                                <Option value="physical_verbal">
                                  Physical/Verbal
                                </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        ) : (
                          ""
                        )}
                      </Row>
                    </div>
                  </Form>
                </Modal>
                {/* Filter Modal End */}

                <Modal
                  title="Do you want to save this search?"
                  visible={confirmModalVisible}
                  onOk={confirmModalSubmit}
                  onCancel={() => setConfirmModalVisible(false)}
                  className="confirm-search-popup"
                >
                  <Form.Item>
                    <Select
                      defaultValue={searchConfirm}
                      onChange={savedSearchHandle}
                    >
                      <Option value="yes">Yes</Option>
                      <Option value="no">No</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Saved Search Title">
                    <Input
                      disabled={searchConfirm === "no" ? true : false}
                      value={savedSearchTitle}
                      onChange={savedSearchTitleHandle}
                    />
                  </Form.Item>
                </Modal>
                <Checkbox.Group
                  value={selectedHomes}
                  onChange={onSelectHome}
                  className="checkbox-search-blocks"
                >
                  <Row gutter={24}>
                    {searchLoading ? (
                      <Spin size="large" />
                    ) : homes.length != 0 ? (
                      <>
                        {homes.map((home, index) => {
                          // if (home.rooms.length) {
                          var leadData = false;
                          if (client && client.leads) {
                            client.leads.map((lead) => {
                              if (home.id == lead.home) {
                                leadData = lead;
                              }
                            });
                          }
                          return (
                            client && (
                              <Col xs={24} md={12} key={index}>
                                <DisplayCard
                                  client={client}
                                  lead={leadData}
                                  home={home}
                                  homeLoading={homeLoading}
                                  setHomeLoading={setHomeLoading}
                                  pageLoad={setPageLoading}
                                  homeID={home.id}
                                  name={home.name}
                                  address={home.address_line_1}
                                  rooms={home.rooms}
                                />
                              </Col>
                            )
                          );
                          // }
                        })}
                      </>
                    ) : (
                      <Col xs={24} md={24}>
                        <Card bordered={false}>
                          <Empty />
                        </Card>
                      </Col>
                    )}
                  </Row>
                </Checkbox.Group>
                {/* <Pagination defaultCurrent={1} total={50} /> */}
                {/* <Pagination
                  total={paginationValue.totalPages}
                  defaultPageSize={15}
                  onChange={paginationChange}
                  current={paginationValue.currentPage}
                // defaultCurrent={paginationValue.currentPage}
                /> */}
              </Col>
              <Col
                xs={24}
                sm={24}
                md={mapExpand ? 24 : 12}
                className="map-container"
              >
                <div className="map_expand_icon" onClick={expandMap}>
                  <LeftOutlined />
                </div>
                <MapViewCommunity
                  mapExpand={mapExpand}
                  homes={homes}
                  client={client}
                  sendLead={sendLead}
                />
              </Col>
            </Row>
          </>
        )}
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    signin: (email, password) => dispatch(signin(email, password)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSearch);
