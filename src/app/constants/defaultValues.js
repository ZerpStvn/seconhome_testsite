import { getNumberWithOrdinal } from "../helpers/number-helper";

export const careOfferdValues = {
  assisted_living: "Assisted Living",
  board_and_care_home: "Board & Care Home",
};
export const roomCareTypes = {
  assisted_living: "Assisted Living",
  board_and_care_home: "Board & Care Home",
};
export const licenseStatusValues = {
  license_pending: "License Pending",
  licensed: "Licensed",
  on_probation: "On Probation",
};

export const roomTypes = {
  private_room: "Private Room",
  studio: "Studio",
  deluxe_studio: "Deluxe Studio",
};

export const roomTypesOptions = [
  { text: "Private Room", value: "private_room" },
  { text: "Shared - 2 People", value: "shared_2_people" },
  { text: "Shared - 3 People", value: "shared_3_people" },
  { text: "1 Bedroom", value: "1_bedroom" },
  { text: "2 Bedroom", value: "2_bedroom" },
];
export const roomCareTypesOptions = [
  {
    text: "Assisted Living",
    value: "assisted_living",
  },
  {
    text: "Memory Care",
    value: "memory_care",
  },
  {
    text: "Board & Care",
    value: "board_and_care",
  },
  {
    text: "Independent Living",
    value: "independent_living",
  },
  {
    text: "Skilled Nursing",
    value: "skilled_nursing",
  },
  {
    text: "Room & Board",
    value: "room_and_board",
  },
];

export const bathroomTypes = {
  no_bath: "No Bath",
  jack_and_jill: "Jack & Jill",
  one_bath: "One Bath",
  one_and_a_half_bath: "One and a Half Bath",
  two_bath: "Two Bath",
};

export const financialTypes = {
  private_pay: "Private Pay",
  ssi: "SSI",
  alw: "ALW",
};
export const staffCredentials = [
  {
    text: "MD",
    value: "md",
  },
  {
    text: "RN",
    value: "rn",
  },
  {
    text: "LVN",
    value: "lvn",
  },
  {
    text: "CNA",
    value: "cna",
  },
];
export const staffTitles = [
  {
    text: "Manager",
    value: "manager",
  },
  {
    text: "Caregiver",
    value: "caregiver",
  },
  {
    text: "Chef",
    value: "chef",
  },
  {
    text: "Front Desk",
    value: "front_desk",
  },
  {
    text: "Activity Director",
    value: "activity_director",
  },
  {
    text: "Sales Director",
    value: "sales_director",
  },
  {
    text: "Executive Director",
    value: "executive_director",
  },
  {
    text: "Business Director",
    value: "business_director",
  },
];
// export const staffLanguages = [{ text: "English", value: "english" }, { text: "Spanish", value: "spanish" }, { text: "Tagalog", value: "tagalog" }, { text: "Russian", value: "russian" }, { text: "Farsi", value: "farsi" }, { text: "Hebrew", value: "hebrew" }, { text: "Korean", value: "korean" }, { text: "Japanese", value: "japanese" }, { text: "Chinese", value: "chinese" }, { text: "German", value: "german" }, { text: "French", value: "french" }, { text: "Italian", value: "italian" }];
export const staffLanguages = [{ text: "English", value: "english" }, { text: "Spanish", value: "spanish" }, { text: "Tagalog", value: "tagalog" }, { text: "Farsi", value: "farsi" }, { text: "Hebrew", value: "hebrew" }, { text: "Chinese", value: "chinese" }, { text: "German", value: "german" }, { text: "French", value: "french" }, { text: "Italian", value: "italian" }];


export const homePhotosCategories = [
  "Common Areas",
  "Kitchen",
  "Outside Facility",
  "Inside Facility",
  "Activities",
  "Meal Examples",
];

export const roomAvailabilityOptions = [
  {
    text: "Yes",
    value: "yes",
  },
  {
    text: "No",
    value: "no",
  },
  {
    text: "Only Male",
    value: "shared_male",
  },
  {
    text: "Only Female",
    value: "shared_female",
  },
];
export const roomAvailabilityOptionsAdmin = [
  {
    text: "Yes",
    value: "yes",
  },
  {
    text: "No",
    value: "no",
  }
];

export const leadApprovalOptions = [
  {
    text: "Accepted",
    value: "accepted",
  },
  {
    text: "Pending",
    value: "pending",
  },

  {
    text: "Denied - Can't Provide Care",
    value: "denied_cant_provide",
  },
  {
    text: "Denied - In Our System",
    value: "denied_in_our_system",
  },
  {
    text: "Denied - Other",
    value: "denied_other",
  },
];

export const statusOptions = [
  {
    text: "Published",
    value: "published",
  },
  {
    text: "Draft",
    value: "draft",
  },
];

export const licenseStatusOptions = [
  {
    text: "License Pending",
    value: "license_pending",
  },
  {
    text: "Licensed",
    value: "licensed",
  },
  {
    text: "On Probation",
    value: "on_probation",
  },
];

export const floorLevelOptions = [...Array(21).keys()].map((value) => {
  if (value > 0) {
    return { text: getNumberWithOrdinal(value) + " Floor", value };
  } else {
    return { text: "Ground Floor", value };
  }
});

export const leadStatusOptions = [
  {
    text: "Client Denied",
    value: "client_denied",
  },
  {
    text: "On Hold",
    value: "on_hold",
  },
  {
    text: "Reviewing Options",
    value: "reviewing_options",
  },
  {
    text: "Touring",
    value: "touring",
  },
  {
    text: "In Escrow",
    value: "in_escrow",
  },
  {
    text: "Move In",
    value: "move_in",
  },
];
export const invoiceStatusOptions = [
  {
    text: "Published",
    value: "published",
  },
  {
    text: "Draft",
    value: "draft",
  },
  {
    text: "Archived",
    value: "archived",
  },
  {
    text: "Pending",
    value: "pending",
  },
  {
    text: "Completed",
    value: "completed",
  },
];
export const homeVerificationOptions = [
  {
    text: "Pending",
    value: "pending",
  },
  {
    text: "Approved",
    value: "approved",
  },
  {
    text: "Declined",
    value: "declined",
  },
];
export const homeGendersAcceptedOptions = [
  {
    text: "Male/Female",
    value: "male_female",
  },
  {
    text: "Only Male",
    value: "only_male",
  },
  {
    text: "Only Female",
    value: "only_female",
  },
];

export const homeCareServicesOptions = [
  { text: "Bathing Assistance", value: "bathing_assistance" },
  { text: "Dressing Assistance", value: "dressing_assistance" },
  { text: "Transfer Assistance", value: "transfer_assistance" },
  { text: "Medication Management", value: "medication_management" },
  { text: "Feeding Assistance", value: "feeding_assistance" },
  { text: "Walking Assistance", value: "walking_assistance" },
  { text: "Incontinence Care", value: "incontinence_care" },
  { text: "Toileting Assistance", value: "toileting_assistance" },
  { text: "Awake Night Staff", value: "awake_night_staff" },
  { text: "Respite Care", value: "respite_care" },
  { text: "Wander Guard", value: "wander_guard" },
  { text: "Grooming Assistance", value: "grooming_assistance" },
  { text: "Not Applicable", value: "not_applicable" }
];

export const devicesAcceptedOptions = [
  { text: "Hoyer Lift", value: "hoyer_lift" },
  { text: "G-Tube", value: "g_tube" },
  { text: "Walker", value: "walker" },
  { text: "Wheelchair", value: "wheelchair" },
  { text: "Cane", value: "cane" },
  { text: "Oxygen", value: "oxygen" },
  { text: "Electric Scooter", value: "electric_scooter" },
  { text: "Catheter", value: "catheter" },
  { text: "Colostomy", value: "colostomy" },
  { text: "Ostomy", value: "ostomy" },
  { text: "Commode", value: "commode" },
  { text: "IV", value: "iv" },
  { text: "Prosthesis", value: "prosthesis" },
  { text: "Trachea", value: "trachea" },
  { text: "Not Applicable", value: "not_applicable" }
];

export const waiversOptions = [
  { text: "Hospice", value: "hospice" },
  { text: "Non Ambulatory", value: "non_ambulatory" },
  { text: "Dementia", value: "dementia" },
  { text: "ALW", value: "alw" },
  { text: "SSI", value: "ssi" },
  { text: "Not Applicable", value: "not_applicable" }
];

export const specialServicesOptions = [
  { text: "Physical Therapy", value: "physical_therapy" },
  { text: "Speech Therapy", value: "speech_therapy" },
  { text: "Occupational Therapy", value: "occupational_therapy" },
  { text: "Insulin Injections", value: "insulin_injections" },
  { text: "Blood Glucose Testing", value: "blood_glucose_testing" },
  { text: "Kosher", value: "kosher" },
  { text: "Vegetarian", value: "vegetarian" },
  { text: "Gluten Free", value: "gluten_free" },
  { text: "Special Diets", value: "special_diets" },
  { text: "Combative Behaviors", value: "combative_behaviors" },
  { text: "Not Applicable", value: "not_applicable" }
];

export const medicalStaffOptions = [
  { text: "Medical Doctor", value: "Medical Doctor" },
  { text: "RN", value: "RN" },
  { text: "LVN", value: "LVN" },
  { text: "CNA", value: "CNA" },
  { text: "Not Applicable", value: "no" },
];

export const homeActivitiesOptions = [
  { text: "Gardening", value: "gardening" },
  { text: "Woodwork", value: "woodwork" },
  { text: "Brain Games ", value: "brain_games" },
  { text: "Day Excursions", value: "day_excursions" },
  { text: "Book Clubs", value: "book_clubs" },
  { text: "Cooking", value: "cooking" },
  { text: "Arts & Crafts", value: "arts_and_crafts" },
  { text: "Happy Hour", value: "happy_hour" },
  { text: "Yoga", value: "yoga" },
  { text: "Tai Chi", value: "tai_chi" },
  { text: "Live Music", value: "live_music" },
  { text: "Not Applicable", value: "not_applicable" }
];

export const communityAmenitiesOptions = [
  { text: "Computer Center", value: "computer_center" },
  { text: "Fitness Gym", value: "fitness_gym" },
  { text: "Pool", value: "pool" },
  { text: "Mini Golf", value: "mini_golf" },
  { text: "Cats Allowed", value: "cats_allowed" },
  { text: "Dogs Allowed", value: "dogs_allowed" },
  { text: "Smoking Allowed", value: "smoking_allowed" },
  { text: "Beauty Salon", value: "beauty_salon" },
  { text: "Library", value: "library" },
  { text: "Activities Room", value: "activities_room" },
  { text: "Movie Room", value: "movie_room" },
  { text: "Resident Parking", value: "resident_parking" },
  { text: "Garden", value: "garden" },
  { text: "Bistro", value: "bistro" },
  { text: "Worship Area", value: "worship_area" },
  { text: "Private Dining Room", value: "private_dining_room" },
  { text: "Laundry Room", value: "laundry_room" },
  { text: "Not Applicable", value: "not_applicable" }
];

export const cultureOptions = [
  { text: "African American", value: "african_american" },
  { text: "Korean", value: "korean" },
  { text: "Japanese", value: "japanese" },
  { text: "Vietnamese", value: "vietnamese" },
  { text: "Chinese", value: "chinese" },
  { text: "Christian/Catholic", value: "christian/catholic" },
  { text: "Jewish", value: "jewish" },
  { text: "Armenian", value: "armenian" },
  { text: "LGBTQ", value: "lgbtq" },
  { text: "None", value: "none" },
];

export const homeCareOfferedOptions = [
  { text: "Assisted Living", value: "assisted_living" },
  { text: "Board & Care Home", value: "board_and_care_home" },
  { text: "Continuing Care Retirement Community", value: "continuing_care_retirement_community" },
  { text: "Memory Care", value: "memory_care" },
  { text: "Independent Living", value: "independent_living" },
  { text: "Skilled Nursing Facility", value: "skilled_nursing_facility" },
  { text: "Room & Board Home", value: "room_and_board_home" },
  { text: "Active Adult Community (55+)", value: "active_adult_community" },
];

export const homeLicenseStatusOptions = [
  { text: "Licensed", value: "licensed" },
  { text: "Pending", value: "pending" },
  { text: "On Probation", value: "on_probation" },
  { text: "Closed", value: "closed" },
  { text: "Unlicensed", value: "unlicensed" },
];

export const homeLicenseVerificationOptions = [
  { text: "Pending", value: "pending" },
  { text: "Approved", value: "approved" },
  { text: "Declined", value: "declined" },
];

export const homeStatusOptions = [
  { text: "Published", value: "published" },
  { text: "Draft", value: "draft" },
];

export const roomAmenitiesOptions = [
  { text: "Patio", value: "patio" },
  { text: "Balcony", value: "balcony" },
  { text: "Kitchenette", value: "kitchenette" },
  { text: "Washer & Dryer", value: "washer_and_dryer" },
  { text: "TV Installed", value: "tv_installed" },
  { text: "Hardwood Floors", value: "hardwood_floors" },
  { text: "Carpet", value: "carpet" },
  { text: "Walk-in Shower", value: "walk-in_shower" },
  { text: "Shower Chair", value: "shower_chair" },
  { text: "Emergency Pull Cord", value: "emergency_pull_cord" },
  { text: "Wall Divider", value: "wall_divider" },
  { text: "Air Conditioning", value: "air_conditioning" },
  { text: "Wi-Fi", value: "wifi" },
  { text: "Fully Furnished", value: "fully_furnished" },
  { text: "Telephone", value: "telephone" },
  { text: "Cable", value: "cable" },
  { text: "Streaming Service", value: "streaming_service" },
];


export const bathroomTypesOptions = [
  { value: "no_bath", text: "No Bath", },
  { value: "jack_and_jill", text: "Jack & Jill", },
  { value: "one_bath", text: "One Bath", },
  { value: "one_and_a_half_bath", text: "One and a Half Bath", },
  { value: "two_bath", text: "Two Bath", },
];

export const mileageOptions = [
  /*{
    "text": "Art",
    "value": "art"
  },
  {
    "text": "Reading",
    "value": "reading"
  },
  {
    "text": "Cards",
    "value": "cards"
  },
  {
    "text": "Gardning",
    "value": "gardning"
  },
  {
    "text": "Politics",
    "value": "politics"
  },
  {
    "text": "TV/Movies",
    "value": "tv_movies"
  }*/
  {
    "text": "1 Mile",
    "value": '1'
  },
  {
    "text": "5 Mile",
    "value": '5'
  },
  {
    "text": "10 Mile",
    "value": '10'
  },
  {
    "text": "15 Mile",
    "value": '15'
  },
  {
    "text": "20 Mile",
    "value": '20'
  },
  {
    "text": "25 Mile",
    "value": '25'
  }
];

export const clientRelationShipOptions = [
  {
    "text": "Son",
    "value": "son"
  },
  {
    "text": "Daughter",
    "value": "daughter"
  },
  {
    "text": "Husband",
    "value": "husband"
  },
  {
    "text": "Wife",
    "value": "wife"
  },
  {
    "text": "Mother",
    "value": "mother"
  },
  {
    "text": "Father",
    "value": "father"
  },
  {
    "text": "Brother",
    "value": "brother"
  },
  {
    "text": "Sister",
    "value": "sister"
  },
  {
    "text": "Grandson",
    "value": "grand_son"
  },
  {
    "text": "Granddaughter",
    "value": "grand_daughter"
  },
  {
    "text": "Nephew",
    "value": "nephew"
  },
  {
    "text": "Niece",
    "value": "niece"
  },
  {
    "text": "Cousin",
    "value": "cousin"
  },
  {
    "text": "Friend",
    "value": "friend"
  },
  {
    "text": "Care Manager",
    "value": "care_manager"
  },
  {
    "text": "Fiduciary",
    "value": "fiduciary"
  }
];

export const leadSourceOptions = [
  // { "text": "Webform", "value": "webform" },
  // { "text": "Facebook", "value": "facebook" },
  { "text": "Yelp", "value": "yelp" },
  { "text": "Internet", "value": "internet" },
  // { "text": "Google Ad", "value": "google_ad" },
  { "text": "Discharge Referral", "value": "discharge_referral" },
  { "text": "Referral", "value": "referral" },
  { "text": "Board & Care Referral", "value": "board_and_care_referral" },
  { "text": "Friend", "value": "friend" },
  { "text": "Resource Handbook", "value": "resource_handbook" },
  { "text": "Past Client", "value": "past_client" },
  { "text": "Doesn't Remember", "value": "does_not_remember" },
  { "text": "NextDoor", "value": "next_door" }
];

export const residentGenderOptions = [
  { text: "Male", value: "male" }, { text: "Female", value: "female" }
]

export const residentPetOptions = [
  {
    "text": "Cat",
    "value": "cat"
  },
  {
    "text": "Small Dog",
    "value": "small_dog"
  }
];
export const residentHobbiesOptions = [
  {
    "text": "Art",
    "value": "art"
  },
  {
    "text": "Dance",
    "value": "dance"
  },
  {
    "text": "Exercise",
    "value": "exercise"
  },
  {
    "text": "Gardening",
    "value": "gardening"
  },
  {
    "text": "Movies",
    "value": "movies"
  },
  {
    "text": "Music",
    "value": "music"
  },
  {
    "text": "Reading",
    "value": "reading"
  },
  {
    "text": "Television",
    "value": "tv"
  },
];


// export const residentBedroomOptions = [{ "text": "Private Room", "value": "private_room" }, { "text": "Shared Room", "value": "shared_room" }, { "text": "Studio", "value": "studio" }];
export const residentBedroomOptions = [
  { "text": 'Private', "value": 'private_room' },
  { "text": 'Shared - 2 People', "value": 'shared_2_people' },
  { "text": 'Shared - 3 People', "value": 'shared_3_people' },
  { "text": '1 Bedroom', "value": '1_bedroom' },
  { "text": '2 Bedroom', "value": '2_bedroom' },
];

export const residentNightSupervision = [
  { "text": 'No', "value": 'no' },
  { "text": 'Awake (1-2 times)', "value": 'awake_1_2_times' },
  { "text": 'Awake (3-4 times)', "value": 'awake_3_4_times' },
  { "text": 'Awake (x>4 times)', "value": 'awake_x_4_times' },
  { "text": 'Family Unsure', "value": 'family_unsure' },
];

export const residentDialysis = [
  { "text": 'No', "value": 'no' },
  { "text": '1/Week', "value": '1_week' },
  { "text": '2/Week', "value": '2_week' },
  { "text": '3/Week', "value": '3_week' },
  { "text": 'Family Unsure', "value": 'family_unsure' },
];

export const residentBathroomOptions = [{ "text": "Private Bath", "value": "private_bath" }, { "text": "Shared Bath", "value": "shared_bath" }, { "text": "Private/Shared", "value": "both" }];

// export const residentMoveTimeFrameOptions = [{ "text": "Hot", "value": "hot" }, { "text": "Warm", "value": "warm" }, { "text": "Researching Option", "value": "researching_option" }];

export const residentMoveTimeFrameOptions = [{ "text": "Hot (Within 30 days)", "value": "hot" }, { "text": "Warm (30-90 days)", "value": "warm" }, { "text": "Cold (x>90 days,Researching)", "value": "cold" }];

// export const residentLanguageOptions = [{ "text": "English", "value": "english" }, { "text": "Spanish", "value": "spanish" }, { "text": "Tagalog", "value": "tagalog" }, { "text": "Russian", "value": "russian" }, { "text": "Farsi", "value": "farsi" }, { "text": "Hebrew", "value": "hebrew" }, { "text": "Korean", "value": "korean" }, { "text": "Japanese", "value": "japanese" }, { "text": "Chinese", "value": "chinese" }, { "text": "German", "value": "german" }, { "text": "French", "value": "french" }, { "text": "Italian", "value": "italian" }];
export const residentLanguageOptions = [
  { "text": "Chinese", "value": "chinese" },
  { "text": "German", "value": "german" },
  { "text": "French", "value": "french" },
  { "text": "Italian", "value": "italian" },
  { "text": "Spanish", "value": "spanish" },
  { "text": "Russian", "value": "russian" },
  { "text": "Farsi", "value": "farsi" },
  { "text": "Hebrew", "value": "hebrew" }
];

export const housingTypesOptions = [
  {
    text: "Assisted Living",
    value: "assisted_living",
    info: "For seniors who need some help with daily activities and want a supportive community that’s active, social, and engaging."
  },
  {
    text: "Memory Care",
    value: "memory_care",
    info: "Homes in residential neighborhoods that are equipped and staffed to provide daily care for a small number of residents.",
  },
  {
    text: "Board & Care",
    value: "board_and_care",
    info: "Homes in residential neighborhoods that are equipped and staffed to provide daily care for a small number of residents.",
  },
  {
    text: "Independent Living",
    value: "independent_living",
    info: "For active older adults who want to downsize to a home in a retirement community but don’t need help to live independently.",
  },
  {
    text: "Skilled Nursing",
    value: "skilled_nursing",
    info: "For seniors with more serious medical needs who require skilled care following a hospitalization, illness, or surgery.",
  },
  {
    text: "Room & Board",
    value: "room_and_board",
    info: "",
  },
  {
    text: "Continuing Care Retirement Community",
    // value: "c.c.r.c.",
    value: "continuing_care_retirement_community",
    info: "",
  },
  {
    text: "In Home Care",
    value: "in_home_care",
    info: "",
  },
  {
    text: "Active Adult Community (55+)",
    value: "active_adult_community",
    info: "Communities of houses and apartments for residents 55 and older who live independently, enjoying an active, social lifestyle.",
  },
];

export const partnerContractStatusOptions = [
  {
    "text": "Signed",
    "value": "signed"
  },
  {
    "text": "Pending",
    "value": "pending"
  }, {
    "text": "Case by Case",
    "value": "case_by_case"
  }
];

export const partnerVerificationOptions = [

  {
    "text": "Pending",
    "value": "pending"
  },
  {
    "text": "Approved",
    "value": "approved"
  }

];
export const partnerStatusOptions = [

  {
    "text": "Active",
    "value": "active"
  },
  {
    "text": "Draft",
    "value": "draft"
  }
];

export const dietOptions = ["vegetarian", "special_diets", "kosher", "gluten_free", "not_applicable", "combative_behaviors"];
