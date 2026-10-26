    const searchInput = document.getElementById("park-search");
    const searchTags = document.getElementById("search-tags");
    const parkCount = document.getElementById("park-count");
    const emptyState = document.getElementById("empty-state");
    const mapStatus = document.getElementById("map-status");
    const mapSection = document.querySelector(".map-section");
    const parkGrid = document.getElementById("park-grid");
    const parkDetails = document.getElementById("park-details");
    const parkDetailsTitle = document.getElementById("park-details-title");
    const parkDetailsLocation = document.getElementById("park-details-location");
    const parkDetailsDescription = document.getElementById("park-details-description");
    const parkDetailsAddress = document.getElementById("park-details-address");
    const parkDetailsAmenities = document.getElementById("park-details-amenities");
    const parkDetailsEvents = document.getElementById("park-details-events");
    const parkDetailsNoEvents = document.createElement("li");
    const parkDetailsWebsite = document.getElementById("park-details-website");
    const parkDetailsNoWebsite = document.getElementById("park-details-no-website");
    const activeAmenityTags = new Set();
    const realParks = [
    {
        "name": "Payne Ave Friendship Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.30212254367423,
        "lng": -121.9555451482721,
        "address": "3257 Payne Avenue",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Bike rack",
            "Game tables",
            "Parking",
            "Playground 2-5",
            "Playground 5-12",
            "Parcourse",
            "Picnic Area"
        ]
    },
    {
        "name": "Fuller Avenue Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31788587329898,
        "lng": -121.8932481425457,
        "address": "Fuller Ave. & Delmas Ave.",
        "category": "City Park / General Recreation",
        "amenities": [
            "Bocceball court",
            "Horseshoe court",
            "Game Tables"
        ]
    },
    {
        "name": "Paul Moore Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.27144998265821,
        "lng": -121.8900655557621,
        "address": "1426 Hillsdale Ave",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Pickleball",
            "Playground 2-5",
            "Playground 5-12",
            "Playground all ages",
            "Sand play area",
            "Soccer field",
            "Softball field"
        ]
    },
    {
        "name": "Vista Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.26307265109029,
        "lng": -121.8507441418585,
        "address": "475 Hyde Park Dr.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Parking",
            "Pickleball",
            "Playground 2-5",
            "Playground 5-12",
            "Sand play area",
            "Drinking Fountain",
            "Pickle Ball"
        ]
    },
    {
        "name": "Agnew Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.382,
        "lng": -121.967,
        "address": "2150 Agnew Road, Santa Clara, CA 95054",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Picnic area",
            "Playground all ages"
        ]
    },
    {
        "name": "Guadalupe River Trail - Reach A (GUA01)",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.42176255567326,
        "lng": -121.9718072865795,
        "address": "Gold St to Hwy 237",
        "category": "Trail / Greenway",
        "amenities": [
            "Drinking fountain"
        ]
    },
    {
        "name": "Ryland Dog Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34187812414856,
        "lng": -121.8981466140633,
        "address": "Ryland St. & N. San Pedro St.",
        "category": "Dog Park",
        "amenities": [
            "Dog park",
            "Drinking fountain"
        ]
    },
    {
        "name": "Joyce Ellington Branch Library",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34975586174691,
        "lng": -121.8870472822773,
        "address": "491 E. Empire St.",
        "category": "City Park / General Recreation",
        "amenities": [
            "Parking",
            "Public art",
            "Public Art Installation"
        ]
    },
    {
        "name": "Reed & Grant Sports Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.3583,
        "lng": -121.94543,
        "address": "750 Reed St., Santa Clara, CA 95050",
        "category": "Children's / Playground Park",
        "amenities": [
            "Parking",
            "Picnic area",
            "Playground all ages"
        ]
    },
    {
        "name": "Everett Alvarez Jr. Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.3334,
        "lng": -121.9566,
        "address": "2280 Rosita Ave., Santa Clara, CA 95050",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Parking",
            "Picnic area",
            "Playground all ages"
        ]
    },
    {
        "name": "Tamien Park Phase II",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.3144440328834,
        "lng": -121.8844734792153,
        "address": "1167 Lick Ave",
        "category": "Children's / Playground Park",
        "amenities": [
            "Amphitheatre",
            "Basketball court",
            "Drinking fountain",
            "Futsal",
            "Game tables",
            "Outdoor gym",
            "Parking",
            "Ping pong table"
        ]
    },
    {
        "name": "Tamien Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31454045812703,
        "lng": -121.8847837369181,
        "address": "1167 Lick Ave",
        "category": "Children's / Playground Park",
        "amenities": [
            "Amphitheatre",
            "Basketball court",
            "Drinking fountain",
            "Futsal",
            "Game tables",
            "Outdoor gym",
            "Parking",
            "Ping pong table"
        ]
    },
    {
        "name": "Rancho del Pueblo Golf Course",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34629523679136,
        "lng": -121.8534744399371,
        "address": "1649 Hermocilla Wy.",
        "category": "City Park / General Recreation",
        "amenities": [
            "Parking"
        ]
    },
    {
        "name": "Erikson Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.26263020970931,
        "lng": -121.8655700214675,
        "address": "Oyster Bay Dr. & Fell Ave.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 2-5",
            "Water play feature",
            "Picnic Area"
        ]
    },
    {
        "name": "Windmill Springs Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.30835215822161,
        "lng": -121.8244047950657,
        "address": "Umbarger Rd. & Baysmill Ct.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 5-12",
            "Soccer field",
            "Picnic Area"
        ]
    },
    {
        "name": "Steve Carli Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.34,
        "lng": -121.966,
        "address": "1045 Los Padres Blvd., Santa Clara, CA 95050",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Picnic area",
            "Playground all ages"
        ]
    },
    {
        "name": "Skate Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.359,
        "lng": -121.96955,
        "address": "2450 Cabrillo Ave., Santa Clara, CA 95051",
        "category": "City Park / General Recreation",
        "amenities": [
            "Skate park"
        ]
    },
    {
        "name": "River Glen Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.30173935035496,
        "lng": -121.8875546359325,
        "address": "1600 Parkside Ave",
        "category": "Children's / Playground Park",
        "amenities": [
            "Baseball field",
            "Basketball court",
            "Game tables",
            "Horseshoe court",
            "Parcourse",
            "Pickleball",
            "Playground 2-5",
            "Playground 5-12"
        ]
    },
    {
        "name": "Del Monte Dog Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.32043121046162,
        "lng": -121.9038106928052,
        "address": "830 Auzerais Avenue",
        "category": "City Park / General Recreation",
        "amenities": [
            "Drinking Fountain"
        ]
    },
    {
        "name": "Calabazas Branch Library",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.30241458310119,
        "lng": -122.0234811809372,
        "address": "1230 S Blaney Ave",
        "category": "City Park / General Recreation",
        "amenities": [
            "Parking"
        ]
    },
    {
        "name": "Edenvale Garden Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.26444243891828,
        "lng": -121.8208267404567,
        "address": "4985 Edenvale Ave",
        "category": "Children's / Playground Park",
        "amenities": [
            "Amphitheatre",
            "Basketball court",
            "Other notes",
            "Parking",
            "Pickleball",
            "Playground 2-5",
            "Tennis court",
            "Volleyball court"
        ]
    },
    {
        "name": "Live Oak Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.39656,
        "lng": -121.94743,
        "address": "641 Moreland Way, Santa Clara, CA 95054",
        "category": "Children's / Playground Park",
        "amenities": [
            "Parking",
            "Picnic area",
            "Playground all ages"
        ]
    },
    {
        "name": "Alviso Library & Community Center",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.42475063631844,
        "lng": -121.9691780479748,
        "address": "5050 N 1st St",
        "category": "Community / Recreation Facility",
        "amenities": [
            "Drinking fountain"
        ]
    },
    {
        "name": "John Mise Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31680419053551,
        "lng": -121.9897698566196,
        "address": "560 Park Meadow Dr",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Pickleball",
            "Playground 5-12",
            "Soccer field",
            "Softball field",
            "Drinking Fountain",
            "Parking",
            "Pickle Ball"
        ]
    },
    {
        "name": "Raleigh Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.24229665231665,
        "lng": -121.7947234412924,
        "address": "Raleigh Rd.",
        "category": "Sports / Athletic Facility",
        "amenities": [
            "Basketball court",
            "Horseshoe court",
            "Parcourse",
            "Tennis court",
            "Volleyball court",
            "Drinking Fountain",
            "Picnic Area"
        ]
    },
    {
        "name": "Meadowfair Community Center",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31673326293205,
        "lng": -121.8201948938606,
        "address": "2696 S King Rd",
        "category": "Community / Recreation Facility",
        "amenities": [
            "Parking",
            "Playground 2-5"
        ]
    },
    {
        "name": "P.A.L. Stadium Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34349582729424,
        "lng": -121.8484954035464,
        "address": "680 S 34th St.",
        "category": "Sports / Athletic Facility",
        "amenities": [
            "Football field",
            "Parking",
            "Track",
            "Baseball Field"
        ]
    },
    {
        "name": "Marijane Hamann Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.30410408375297,
        "lng": -121.9419702045937,
        "address": "2750 Westfield Ave",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Playground 2-5",
            "Soccer field",
            "Softball field",
            "Tennis court",
            "Picnic Area",
            "Playground 5-12"
        ]
    },
    {
        "name": "Bascom Community Center and Library",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.30729343184159,
        "lng": -121.9311368354861,
        "address": "1000 S. Bascom Ave.",
        "category": "Community / Recreation Facility",
        "amenities": [
            "Parking"
        ]
    },
    {
        "name": "Luna Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.36106852569549,
        "lng": -121.8898477005598,
        "address": "Berryessa Rd. & Modern Ice Dr.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Playground all ages",
            "Picnic Area"
        ]
    },
    {
        "name": "Parque de la Amistad",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34799039427106,
        "lng": -121.8451576987367,
        "address": "Vollmer Wy. & McCreery Ave.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Picnic area",
            "Playground 2-5",
            "Playground 5-12"
        ]
    },
    {
        "name": "Solari Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.28573723056417,
        "lng": -121.8330324848757,
        "address": "Cas Dr. & Los Arboles St.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Drinking fountain",
            "Playground 2-5",
            "Playground 5-12",
            "Soccer field",
            "Softball field",
            "Tennis court",
            "Parking"
        ]
    },
    {
        "name": "Winchester Orchard Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31860057105907,
        "lng": -121.9542448858645,
        "address": "San Jose park",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Bocceball court",
            "Dog park",
            "Picnic area",
            "Playground 2-5",
            "Playground 5-12"
        ]
    },
    {
        "name": "Tsugio Fujimoto Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.27829485435892,
        "lng": -121.8236272280319,
        "address": "Senter Rd and Serenade Way",
        "category": "City Park / General Recreation",
        "amenities": [
            "Picnic area",
            "Outdoor Gym"
        ]
    },
    {
        "name": "Fuller Avenue Park - Joint Use",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31802442597734,
        "lng": -121.8936362761129,
        "address": "Fuller Avenue",
        "category": "City Park / General Recreation",
        "amenities": [
            "Bocceball court",
            "Horseshoe court",
            "Game Tables"
        ]
    },
    {
        "name": "Selma Olinder Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.33495616248879,
        "lng": -121.8666255767267,
        "address": "848 E. Williams St.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Drinking fountain",
            "Other notes",
            "Parking",
            "Playground 2-5",
            "Sand play area",
            "Soccer field",
            "Tennis court"
        ]
    },
    {
        "name": "Commodore Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.37698994530702,
        "lng": -121.8624125007572,
        "address": "N. Jackson Ave. & Commodore Dr.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Outdoor gym",
            "Parking",
            "Playground 2-5",
            "Playground 5-12",
            "Picnic Area"
        ]
    },
    {
        "name": "Overfelt Gardens",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.36440498847674,
        "lng": -121.8556041112314,
        "address": "2145 McKee Rd",
        "category": "City Park / General Recreation",
        "amenities": [
            "Decorative Fountain",
            "Drinking Fountain",
            "Ornamental Gardens",
            "Parking",
            "Picnic Area",
            "Public Art Installation",
            "Waterbody"
        ]
    },
    {
        "name": "Stonegate Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.30780502849326,
        "lng": -121.8384371533686,
        "address": "Gassmann Dr.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 2-5",
            "Playground 5-12",
            "Sand play area",
            "Skate park",
            "Drinking Fountain",
            "Picnic Area"
        ]
    },
    {
        "name": "Berryessa Branch Library",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.39386242233833,
        "lng": -121.8411524906141,
        "address": "3311 Noble Ave",
        "category": "City Park / General Recreation",
        "amenities": [
            "Parking"
        ]
    },
    {
        "name": "Jesse Frey Community Garden",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.30982047613384,
        "lng": -121.8860491425182,
        "address": "W Alma Ave and Belmont Way",
        "category": "City Park / General Recreation",
        "amenities": [
            "Parking"
        ]
    },
    {
        "name": "Guadalupe Oak Grove Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.23680097318899,
        "lng": -121.8785358169774,
        "address": "Thorntree Dr. and Starwood Dr.",
        "category": "City Park / General Recreation",
        "amenities": [
            "Drinking fountain",
            "Parking",
            "Vista Point"
        ]
    },
    {
        "name": "Guadalupe Gardens - Courtyard Garden",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34299824715347,
        "lng": -121.9079639393755,
        "address": "Walnut St. & Seymour St..",
        "category": "City Park / General Recreation",
        "amenities": [
            "Ornamental Gardens"
        ]
    },
    {
        "name": "Gregory Tot Lot",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31888040693195,
        "lng": -121.9015170730811,
        "address": "Gregory St. & Helen St.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 2-5"
        ]
    },
    {
        "name": "Tully Community Ballfields",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31074141862126,
        "lng": -121.8420621123183,
        "address": "880 Tully Rd",
        "category": "Sports / Athletic Facility",
        "amenities": [
            "Dog park",
            "Parking",
            "Picnic area",
            "Baseball Field",
            "Softball Field"
        ]
    },
    {
        "name": "Alviso Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.42510748614842,
        "lng": -121.9682288280527,
        "address": "Wilson Way & Grand blvd",
        "category": "Children's / Playground Park",
        "amenities": [
            "Other notes",
            "Playground 2-5",
            "Playground 5-12",
            "Soccer field",
            "Softball field",
            "Swimming pool",
            "Drinking Fountain",
            "Other (see notes)"
        ]
    },
    {
        "name": "Mt. Pleasant Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.3562416041351,
        "lng": -121.8098708784164,
        "address": "Park Pleasant Cir. & Aramis Dr.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Playground 2-5",
            "Sand play area",
            "Picnic Area"
        ]
    },
    {
        "name": "Guadalupe Gardens - Heritage Rose Garden",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34406811651044,
        "lng": -121.9074992852793,
        "address": "W Taylor St. & Spring St.",
        "category": "City Park / General Recreation",
        "amenities": [
            "Ornamental Gardens"
        ]
    },
    {
        "name": "Peralta Adobe",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.33639728426429,
        "lng": -121.8946898059702,
        "address": "180 W St. John",
        "category": "City Park / General Recreation",
        "amenities": [
            "Amphitheatre",
            "Archaeological site",
            "Picnic area",
            "Amphitheatre / Stage"
        ]
    },
    {
        "name": "Welch Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.32575181493593,
        "lng": -121.8243905566551,
        "address": "1935 Clarice Dr",
        "category": "Children's / Playground Park",
        "amenities": [
            "Dog park",
            "Playground 2-5",
            "Playground 5-12",
            "Softball field",
            "Drinking Fountain",
            "Picnic Area"
        ]
    },
    {
        "name": "Guadalupe Yard - Asbury",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34388621648781,
        "lng": -121.9114889250005,
        "address": "Coleman Ave. & Asbury St.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Amphitheatre",
            "Dog park",
            "Gateway arbor monument",
            "Playground all ages",
            "Public art",
            "Sand play area",
            "Water play feature",
            "Amphitheatre / Stage"
        ]
    },
    {
        "name": "Almaden Community Center and Library",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.22139252576398,
        "lng": -121.8693723571925,
        "address": "6445 Camden Ave.",
        "category": "Community / Recreation Facility",
        "amenities": [
            "Drinking fountain",
            "Parking"
        ]
    },
    {
        "name": "O'Connor Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.32076589948314,
        "lng": -121.9125102460333,
        "address": "Race St. & Auzerais Ave.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Game tables",
            "Parcourse",
            "Playground 2-5",
            "Playground 5-12"
        ]
    },
    {
        "name": "Pearl Ave Branch Library",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.26795855267924,
        "lng": -121.8665289137337,
        "address": "4270 Pearl Ave.",
        "category": "City Park / General Recreation",
        "amenities": [
            "Parking"
        ]
    },
    {
        "name": "Meadow Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.38056,
        "lng": -121.97098,
        "address": "3355 Octavius Dr., Santa Clara, CA 95054",
        "category": "Children's / Playground Park",
        "amenities": [
            "Outdoor gym",
            "Picnic area",
            "Playground all ages"
        ]
    },
    {
        "name": "Thomas Barrett Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.32683,
        "lng": -121.9542,
        "address": "1885 Worthington Circle, Santa Clara, CA 95050",
        "category": "Children's / Playground Park",
        "amenities": [
            "Picnic area",
            "Playground all ages"
        ]
    },
    {
        "name": "Jacinto Siquig Northside Community Center",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34720013324235,
        "lng": -121.8914047846909,
        "address": "488 N 6th St.",
        "category": "Community / Recreation Facility",
        "amenities": [
            "Parking"
        ]
    },
    {
        "name": "Meadows Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.27164179063628,
        "lng": -121.8523247630986,
        "address": "Bluefield Dr. & Edelweiss Dr.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Playground 2-5",
            "Playground 5-12",
            "Water play feature",
            "Picnic Area"
        ]
    },
    {
        "name": "Capitol Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.35150693896588,
        "lng": -121.8327316558681,
        "address": "800 Peter Pan Ave",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Futsal",
            "Playground 2-5",
            "Playground 5-12",
            "Sand play area",
            "Soccer field",
            "Softball field",
            "Volleyball court"
        ]
    },
    {
        "name": "Coy Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.25602412646671,
        "lng": -121.8243519864175,
        "address": "Coy Dr. & Sigrid Wy.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Outdoor gym",
            "Playground 2-5",
            "Playground 5-12",
            "Picnic Area"
        ]
    },
    {
        "name": "Rincon South Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.36108550685108,
        "lng": -121.9065736987997,
        "address": "85 E Rosemary Street",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Bike rack",
            "Drinking fountain",
            "Picnic area",
            "Playground 2-5",
            "Playground 5-12"
        ]
    },
    {
        "name": "Comanche Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.24007408367903,
        "lng": -121.8354234203283,
        "address": "Shawnee Ln. & Comanche Dr.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Playground 2-5",
            "Playground 5-12",
            "Picnic Area"
        ]
    },
    {
        "name": "Central Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.34223,
        "lng": -121.9753,
        "address": "909 Kiely Blvd., Santa Clara, CA 95051",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Outdoor gym",
            "Parking",
            "Pickleball",
            "Picnic area",
            "Playground all ages",
            "Tennis court"
        ]
    },
    {
        "name": "Raymond G. Gamma Dog Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.35862,
        "lng": -121.94708,
        "address": "888 Reed St., Santa Clara, CA 95050",
        "category": "Dog Park",
        "amenities": [
            "Dog park",
            "Parking"
        ]
    },
    {
        "name": "Pfeiffer Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.22400745652725,
        "lng": -121.853766848945,
        "address": "Pfeiffer Ranch Dr. & Boulder Mountain Wy.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Playground all ages",
            "Picnic Area"
        ]
    },
    {
        "name": "Metcalf Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.23384924671917,
        "lng": -121.7612930414262,
        "address": "Forsm Rd. & Forsum Ct.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Drinking fountain",
            "Playground all ages",
            "Volleyball court",
            "Picnic Area"
        ]
    },
    {
        "name": "O'Donnell's Gardens Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.3307121435728,
        "lng": -121.8797643223164,
        "address": "517 S 6th St",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 2-5",
            "Water play feature"
        ]
    },
    {
        "name": "Brooktree Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.39522410887275,
        "lng": -121.8802344429469,
        "address": "2269 Hostetter Rd",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Picnic area",
            "Playground 2-5",
            "Playground 5-12",
            "Soccer field"
        ]
    },
    {
        "name": "Guadalupe River Park and Trail - Reach (GUA14)",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.32732115254534,
        "lng": -121.8912730507429,
        "address": "298 W San Carlos St",
        "category": "Trail / Greenway",
        "amenities": [
            "Gateway Arbor / Monument"
        ]
    },
    {
        "name": "Almaden Lake Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.23940359553386,
        "lng": -121.8722252031666,
        "address": "1661 Almaden Expy",
        "category": "Children's / Playground Park",
        "amenities": [
            "Amphitheatre",
            "Beach",
            "Boat dock",
            "Playground 5-12",
            "Vista point",
            "Volleyball court",
            "Waterbody",
            "Amphitheatre / Stage"
        ]
    },
    {
        "name": "Hacienda Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.35555535179961,
        "lng": -121.8698149994482,
        "address": "End of West Court",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Picnic area",
            "Playground 2-5"
        ]
    },
    {
        "name": "Groesbeck Hill Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.33646019595242,
        "lng": -121.7789758447568,
        "address": "2646 Klein Rd",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Pickleball",
            "Playground 2-5",
            "Public art",
            "Tee-ball",
            "Tennis court",
            "Vista point",
            "Volleyball court"
        ]
    },
    {
        "name": "Warburton Park & Aquatic Center",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.35672,
        "lng": -121.9642,
        "address": "2250 Royal Drive, Santa Clara, CA 95050",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Picnic area",
            "Playground all ages"
        ]
    },
    {
        "name": "Evergreen Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.29768718413388,
        "lng": -121.7679856117307,
        "address": "4860 San Felipe Rd",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 5-12",
            "Drinking Fountain",
            "Picnic Area"
        ]
    },
    {
        "name": "Canyon Creek Park (undeveloped)",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.29110317496587,
        "lng": -121.7686930137343,
        "address": "Larkspur Canyon Dr/Stoney Creek Pl",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Playground all ages",
            "Public art",
            "Vista point",
            "Picnic Area",
            "Public Art Installation"
        ]
    },
    {
        "name": "Guadalupe Gardens - Historic Orchard",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34320510250028,
        "lng": -121.9063027428801,
        "address": "Spring St. & Hobson St.",
        "category": "City Park / General Recreation",
        "amenities": [
            "Ornamental Gardens"
        ]
    },
    {
        "name": "Gran Paradiso Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.3900107770359,
        "lng": -121.891020147785,
        "address": "McKay Dr and Avenida Elisa",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Playground 5-12",
            "Picnic Area"
        ]
    },
    {
        "name": "Larry J. Marsalli Park",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.3548,
        "lng": -121.9446,
        "address": "1425 Lafayette St., Santa Clara, CA 95050",
        "category": "Dog Park",
        "amenities": [
            "Dog park",
            "Parking",
            "Picnic area",
            "Playground all ages"
        ]
    },
    {
        "name": "Cataldi Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.40180721141277,
        "lng": -121.870207455765,
        "address": "1765 Bethany Av",
        "category": "Children's / Playground Park",
        "amenities": [
            "Basketball court",
            "Handball court",
            "Other notes",
            "Outdoor gym",
            "Parcourse",
            "Pickleball",
            "Playground all ages",
            "Public art"
        ]
    },
    {
        "name": "Sheppard Middle School Track & Field",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.3740346154126,
        "lng": -121.8413208645474,
        "address": "480 Rough and Ready Road",
        "category": "School / Educational Facility",
        "amenities": [
            "Parking",
            "Soccer field",
            "Track"
        ]
    },
    {
        "name": "Los Gatos Creek Trail - Reach 4a (LGC04)",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.32077181786221,
        "lng": -121.9032930063509,
        "address": "Auzerais to Lonus St",
        "category": "Trail / Greenway",
        "amenities": [
            "Parcourse"
        ]
    },
    {
        "name": "Shady Oaks Open Space",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.26096660198426,
        "lng": -121.7930895634275,
        "address": "Coyote Rd. & Crossless Dr.",
        "category": "Open Space / Natural Area",
        "amenities": [
            "Basketball court",
            "Drinking fountain",
            "Parcourse",
            "Playground all ages",
            "Picnic Area"
        ]
    },
    {
        "name": "Bellevue Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31181955109258,
        "lng": -121.8729163779526,
        "address": "50 Bellevue Ave",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Playground 5-12",
            "Basketball Court",
            "Picnic Area"
        ]
    },
    {
        "name": "Parkview II Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.26859006151633,
        "lng": -121.8444876768068,
        "address": "Sposito Cir.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 2-5",
            "Playground 5-12",
            "Parcourse"
        ]
    },
    {
        "name": "Edenvale Branch Library",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.26803643620872,
        "lng": -121.8208304890617,
        "address": "101 Branham Ln. E",
        "category": "City Park / General Recreation",
        "amenities": [
            "Drinking fountain"
        ]
    },
    {
        "name": "Madden Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.3617322590105,
        "lng": -121.8446542078982,
        "address": "2348 Madden Ave",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Other notes",
            "Picnic area",
            "Playground all ages",
            "Other (see notes)"
        ]
    },
    {
        "name": "Newhall Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34637536011296,
        "lng": -121.9249989168502,
        "address": "997 Newhall St",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 5-12",
            "Picnic Area"
        ]
    },
    {
        "name": "Hummingbird Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31469909802757,
        "lng": -121.8977592606329,
        "address": "Bird Ave. & Fisk Ave.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Game tables",
            "Playground 2-5"
        ]
    },
    {
        "name": "Miner Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.24751615637701,
        "lng": -121.8187761442071,
        "address": "Lean Ave. & Copco Ln.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Playground 5-12",
            "Parcourse"
        ]
    },
    {
        "name": "Lake Cunningham Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.33561493014485,
        "lng": -121.8080452153555,
        "address": "2305 S. White Rd.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Amphitheatre",
            "BMX bike course",
            "Boat dock",
            "Ornamental gardens",
            "Playground all ages",
            "Skate park",
            "Waterbody",
            "Amphitheatre / Stage"
        ]
    },
    {
        "name": "Esther Medina Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.34820696888902,
        "lng": -121.8593535736,
        "address": "S 31st St",
        "category": "Children's / Playground Park",
        "amenities": [
            "Dog park",
            "Outdoor gym",
            "Picnic area",
            "Playground 2-5",
            "Playground all ages",
            "Drinking Fountain"
        ]
    },
    {
        "name": "Carrabelle Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.21170299030355,
        "lng": -121.8355358952485,
        "address": "Camden Ave. & Villagewood Wy.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Drinking fountain",
            "Playground all ages",
            "Water play feature",
            "Picnic Area"
        ]
    },
    {
        "name": "Parque de los Pobladores",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.3279428848269,
        "lng": -121.8845746832314,
        "address": "504 S Market St",
        "category": "City Park / General Recreation",
        "amenities": [
            "Public Art Installation"
        ]
    },
    {
        "name": "2330 Calle De Luna",
        "city": "Santa Clara",
        "region": "South Bay",
        "lat": 37.412,
        "lng": -121.96,
        "address": "2330 Calle De Luna, Santa Clara, CA 95054",
        "category": "Dog Park",
        "amenities": [
            "Dog park",
            "Playground all ages"
        ]
    },
    {
        "name": "Aborn Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.31494464236952,
        "lng": -121.797257983042,
        "address": "Pentland Way and Renfield Way",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 2-5",
            "Playground 5-12",
            "Drinking Fountain"
        ]
    },
    {
        "name": "Brenda Lopez Memorial Plaza",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.32182075233963,
        "lng": -121.8811176345897,
        "address": "Sherman St. & Edwards Ave.",
        "category": "Memorial / Cemetery",
        "amenities": [
            "Picnic Area"
        ]
    },
    {
        "name": "Chris Hotts Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.24525207991865,
        "lng": -121.8753977649136,
        "address": "Almaden Expy. & Via Monte Dr.",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 2-5",
            "Picnic Area"
        ]
    },
    {
        "name": "San Tomas Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.279470638947,
        "lng": -121.9753075657867,
        "address": "4093 Valerie Dr",
        "category": "Children's / Playground Park",
        "amenities": [
            "Playground 2-5",
            "Playground 5-12",
            "Water play feature",
            "Basketball Court",
            "Picnic Area"
        ]
    },
    {
        "name": "Alviso Park - Joint Use",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.42456919466152,
        "lng": -121.9680569270739,
        "address": "5030 North 1st Street",
        "category": "School / Educational Facility",
        "amenities": [
            "Other notes",
            "Playground 2-5",
            "Playground 5-12",
            "Soccer field",
            "Softball field",
            "Swimming pool",
            "Drinking Fountain",
            "Other (see notes)"
        ]
    },
    {
        "name": "John P. McEnery Park",
        "city": "San Jose",
        "region": "South Bay",
        "lat": 37.33104129739969,
        "lng": -121.8952399028357,
        "address": "W San Fernando St. & 87",
        "category": "Children's / Playground Park",
        "amenities": [
            "Archaeological site",
            "Playground 2-5",
            "Playground 5-12",
            "Public art",
            "Picnic Area",
            "Public Art Installation",
            "Water Play Feature"
        ]
    }
];
    function normalizeAmenityLabel(value) {
      if (value === null || value === undefined) {
        return "";
      }

      const normalized = String(value)
        .replace(/Other\s*\(see notes\)/gi, "")
        .replace(/Other notes/gi, "")
        .replace(/Playground\s+2-5/gi, "Playground ages 2-5")
        .replace(/Playground\s+5-12/gi, "Playground ages 5-12")
        .replace(/\s+/g, " ")
        .replace(/[\s,;]+$/g, "")
        .trim();

      if (!normalized) {
        return "";
      }

      const sentence = normalized.toLowerCase();
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }

    function normalizeAmenityList(amenities) {
      const normalized = [];
      const seen = new Set();

      (Array.isArray(amenities) ? amenities : []).forEach((amenity) => {
        const value = normalizeAmenityLabel(amenity);
        if (!value || /^(?:Other|Other notes)$/i.test(value)) {
          return;
        }

        const key = value.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          normalized.push(value);
        }
      });

      return normalized;
    }

    const sanitizedParks = realParks.map(function (park) {
      return Object.assign({}, park, {
        amenities: normalizeAmenityList(park.amenities),
        category: (park.category || "Community park").replace(/\s+/g, " ").trim()
      });
    });

    window.bayAreaParks = sanitizedParks;
    const parkIcons = ['🌳', '🌿', '🌼', '🏞️', '🌷', '🍃', '🌱', '🌾', '🌻', '🌲'];
    function createParkCard(park, index) {
      const title = park.name;
      const city = park.city;
      const region = park.region || "Bay Area";
      const address = park.address || `${city} park`;
      const amenities = Array.isArray(park.amenities) && park.amenities.length ? [...park.amenities] : ["Park"];
      const sportsFacilities = amenities.filter((amenity) => /(field|court|track|park|pool)/i.test(amenity));
      const isParksPage = document.body.dataset.page === "parks";
      const card = document.createElement(isParksPage ? "article" : "a");
      const cardTop = document.createElement("div");
      const icon = document.createElement("span");
      const areaTag = document.createElement("span");
      const heading = document.createElement("h2");
      const location = document.createElement("p");
      const sampleAddress = document.createElement("p");
      const description = document.createElement("p");
      const amenityList = document.createElement("div");

      card.className = "park-card";
      if (!isParksPage) {
        card.href = "#park-map";
        card.setAttribute("aria-label", `Show ${title} on the map`);
      }
      card.dataset.lat = String(park.lat);
      card.dataset.lng = String(park.lng);
      card.dataset.address = address;
      if (sportsFacilities.length > 0) {
        card.dataset.sports = sportsFacilities.join(", ");
      }
      card.dataset.search = [
        title,
        city,
        region,
        address,
        park.category || "park",
        ...amenities
      ].join(" ").toLowerCase();

      cardTop.className = "card-top";
      icon.className = "park-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = parkIcons[index % parkIcons.length];
      areaTag.className = "area-tag";
      areaTag.textContent = region;
      cardTop.append(icon, areaTag);

      heading.textContent = title;
      location.className = "location";
      location.textContent = `${city}, CA`;
      sampleAddress.className = "park-address";
      sampleAddress.textContent = `Address: ${address}`;
      description.className = "description";
      description.textContent = park.category || "Community park";
      amenityList.className = "amenities";
      amenityList.setAttribute("aria-label", "Amenities");
      amenities.forEach((amenity) => {
        const tag = document.createElement("span");
        tag.className = "amenity";
        tag.textContent = amenity;
        amenityList.append(tag);
      });

      card.append(cardTop, heading, location, sampleAddress, description, amenityList);
      return card;
    }

    if (parkGrid) {
      sanitizedParks.forEach((park, index) => {
        parkGrid.append(createParkCard(park, index));
      });
    }

    const parkCards = parkGrid ? Array.from(document.querySelectorAll(".park-card")) : [];

    function initSearchPage() {
      const queryInput = document.getElementById("park-search");
      const resultsList = document.getElementById("park-results");
      const filterResults = document.getElementById("filter-results");
      if (!queryInput || !resultsList || !filterResults) return;

      const amenitySet = new Set();
      sanitizedParks.forEach(function (park) {
        (park.amenities || []).forEach(function (amenity) {
          amenitySet.add(amenity);
        });
      });
      const amenityOptions = Array.from(amenitySet).sort(function (left, right) {
        return left.localeCompare(right);
      });

      const updateResults = () => {
        const query = queryInput.value.trim().toLowerCase();
        const matchingParks = sanitizedParks.filter((park) => {
          if (!query) return true;
          const haystack = [
            park.name,
            park.city,
            park.address,
            park.category,
            ...park.amenities
          ].join(" ").toLowerCase();
          return haystack.includes(query);
        });

        const matchingAmenities = amenityOptions.filter((amenity) => {
          if (!query) return true;
          return amenity.toLowerCase().includes(query);
        });

        resultsList.innerHTML = "";
        if (matchingParks.length === 0) {
          const emptyItem = document.createElement("li");
          emptyItem.className = "no-results";
          emptyItem.textContent = "No parks match that search yet.";
          resultsList.append(emptyItem);
        } else {
          matchingParks.slice(0, 10).forEach((park) => {
            const item = document.createElement("li");
            const title = document.createElement("strong");
            title.textContent = park.name;
            const details = document.createElement("span");
            details.textContent = `${park.city} • ${park.amenities.slice(0, 3).join(" • ") || "Park amenities"}`;
            item.append(title, details);
            resultsList.append(item);
          });
        }

        filterResults.innerHTML = "";
        if (matchingAmenities.length === 0) {
          const emptyState = document.createElement("span");
          emptyState.className = "search-tag search-tag--empty";
          emptyState.textContent = "No matching filters";
          filterResults.append(emptyState);
          return;
        }

        matchingAmenities.slice(0, 16).forEach((amenity) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "search-tag";
          button.textContent = amenity;
          button.addEventListener("click", () => {
            queryInput.value = amenity;
            updateResults();
            queryInput.focus();
          });
          filterResults.append(button);
        });
      };

      queryInput.addEventListener("input", updateResults);
      const initialQuery = new URLSearchParams(window.location.search).get("q") || "";
      if (initialQuery) {
        queryInput.value = initialQuery;
      }
      updateResults();
    }

    if (document.body.dataset.page === "search") {
      initSearchPage();
    } else if (document.body.dataset.page === "parks") {
      parkCount.textContent = `${parkCards.length} parks`;
    } else {
      const defaultLocation = { lat: 37.7749, lng: -122.4194 };

    parkDetailsNoEvents.textContent = "No upcoming events listed.";
    document.getElementById("park-details-close").addEventListener("click", () => {
      parkDetails.hidden = true;
    });

    function showParkDetails(card) {
      parkDetailsTitle.textContent = card.querySelector("h2").textContent.trim();
      parkDetailsLocation.textContent = card.querySelector(".location").textContent.trim();
      parkDetailsDescription.textContent = card.querySelector(".description").textContent.trim();
      parkDetailsAddress.textContent = card.dataset.address
        ? `Address: ${card.dataset.address}`
        : "No address listed.";

      parkDetailsAmenities.replaceChildren();
      const amenities = Array.from(card.querySelectorAll(".amenity"))
        .map((amenity) => amenity.textContent.trim())
        .filter(Boolean);
      if (amenities.length) {
        amenities.forEach((amenity) => {
          const tag = document.createElement("span");
          tag.className = "park-details-amenity";
          tag.textContent = amenity;
          parkDetailsAmenities.append(tag);
        });
      } else {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No amenities listed.";
        parkDetailsAmenities.append(emptyMessage);
      }

      parkDetailsEvents.replaceChildren();
      const events = (card.dataset.events || "")
        .split(/\r?\n|\s*\|\s*/)
        .map((event) => event.trim())
        .filter(Boolean);
      if (events.length) {
        events.forEach((event) => {
          const item = document.createElement("li");
          item.textContent = event;
          parkDetailsEvents.append(item);
        });
      } else {
        parkDetailsEvents.append(parkDetailsNoEvents.cloneNode(true));
      }

      let website;
      try {
        website = new URL(card.dataset.website);
      } catch (error) {
        website = null;
      }
      if (website && (website.protocol === "https:" || website.protocol === "http:")) {
        parkDetailsWebsite.href = website.href;
        parkDetailsWebsite.textContent = website.hostname;
        parkDetailsWebsite.hidden = false;
        parkDetailsNoWebsite.hidden = true;
      } else {
        parkDetailsWebsite.removeAttribute("href");
        parkDetailsWebsite.hidden = true;
        parkDetailsNoWebsite.hidden = false;
      }

      parkDetails.hidden = false;
    }

    function distanceKmBetween(lat1, lng1, lat2, lng2) {
      const toRadians = (degrees) => (degrees * Math.PI) / 180;
      const earthRadiusKm = 6371;
      const deltaLat = toRadians(lat2 - lat1);
      const deltaLng = toRadians(lng2 - lng1);
      const a = Math.sin(deltaLat / 2) ** 2
        + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLng / 2) ** 2;
      return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function highlightRecommendedParks(location) {
      const rankedParks = parkCards
        .map((card) => {
          const lat = Number(card.dataset.lat);
          const lng = Number(card.dataset.lng);
          const distanceKm = distanceKmBetween(location.lat, location.lng, lat, lng);
          return { card, distanceKm };
        })
        .sort((left, right) => left.distanceKm - right.distanceKm)
        .slice(0, 3);

      parkCards.forEach((card) => card.classList.remove("is-recommended"));
      document.querySelectorAll(".recommended-badge").forEach((badge) => badge.remove());

      rankedParks.forEach(({ card, distanceKm }) => {
        card.classList.add("is-recommended");
        const cardTop = card.querySelector(".card-top");
        if (cardTop && !card.querySelector(".recommended-badge")) {
          const badge = document.createElement("span");
          badge.className = "recommended-badge";
          badge.textContent = `${distanceKm < 10 ? distanceKm.toFixed(1) : distanceKm.toFixed(0)} km away`;
          cardTop.append(badge);
        }
      });

      if (parkMarkers.length && markerLayer) {
        const recommendedMarkerSet = new Set(rankedParks.map(({ card }) => card.dataset.lat + "," + card.dataset.lng));
        parkMarkers.forEach(({ card, marker, recommendationLabel }) => {
          const key = card.dataset.lat + "," + card.dataset.lng;
          const recommendedPark = rankedParks.find(({ card: recommendedCard }) => (
            recommendedCard.dataset.lat + "," + recommendedCard.dataset.lng === key
          ));
          if (recommendedMarkerSet.has(key)) {
            marker.setIcon(recommendedParkIcon);
            recommendationLabel.textContent = `Recommended · ${recommendedPark.distanceKm < 10
              ? recommendedPark.distanceKm.toFixed(1)
              : recommendedPark.distanceKm.toFixed(0)} km away`;
            recommendationLabel.hidden = false;
          } else {
            marker.setIcon(defaultParkIcon);
            recommendationLabel.hidden = true;
          }
        });
        updateParkMarkerLayers();
      }
    }

    function updateParkMarkerLayers() {
      if (!markerLayer || !recommendedMarkerLayer) return;

      markerLayer.clearLayers();
      recommendedMarkerLayer.clearLayers();
      const visibleMarkers = parkMarkers.filter(({ card }) => !card.hidden);
      markerLayer.addLayers(visibleMarkers
        .filter(({ card }) => !card.classList.contains("is-recommended"))
        .map(({ marker }) => marker));
      visibleMarkers
        .filter(({ card }) => card.classList.contains("is-recommended"))
        .forEach(({ marker }) => recommendedMarkerLayer.addLayer(marker));

      if (visibleMarkers.length > 0) {
        parkMap.fitBounds(L.latLngBounds(visibleMarkers.map(({ marker }) => marker.getLatLng())).pad(0.12));
      }
    }

    function toggleAmenityFilter(amenityLabel) {
      const normalized = amenityLabel.trim().toLowerCase();
      if (activeAmenityTags.has(normalized)) {
        activeAmenityTags.delete(normalized);
      } else {
        activeAmenityTags.add(normalized);
      }
      renderAmenityTags();
      applyParkFilters();
    }

    function attachAmenityClickHandler(tag) {
      const label = tag.textContent.trim();
      tag.setAttribute("role", "button");
      tag.setAttribute("tabindex", "0");
      tag.setAttribute("aria-pressed", String(activeAmenityTags.has(label.toLowerCase())));
      tag.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleAmenityFilter(label);
      });
      tag.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleAmenityFilter(label);
        }
      });
    }

    function renderAmenityTags() {
      const amenityLabels = new Map();
      parkCards.forEach((card) => {
        card.querySelectorAll(".amenity").forEach((tag) => {
          const label = tag.textContent.trim();
          const term = label.toLowerCase();
          if (!amenityLabels.has(term)) {
            amenityLabels.set(term, label);
          }
        });
      });

      searchTags.innerHTML = "";
      [...amenityLabels.entries()].sort(([a], [b]) => a.localeCompare(b)).forEach(([term, label]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "search-tag";
        button.textContent = label;
        button.setAttribute("aria-pressed", String(activeAmenityTags.has(term)));
        if (activeAmenityTags.has(term)) {
          button.classList.add("is-active");
        }
        button.addEventListener("click", () => {
          toggleAmenityFilter(label);
        });
        searchTags.append(button);
      });

      parkCards.forEach((card) => {
        card.querySelectorAll(".amenity").forEach((tag) => {
          const label = tag.textContent.trim();
          const term = label.toLowerCase();
          const selected = activeAmenityTags.has(term);
          tag.classList.toggle("is-selected", selected);
          tag.setAttribute("aria-pressed", String(selected));
        });
      });
    }

    function applyParkFilters() {
      const query = searchInput.value.trim().toLowerCase();
      const activeFilters = [...activeAmenityTags];
      let visibleCount = 0;

      parkCards.forEach((card) => {
        const text = card.dataset.search || "";
        const matchesQuery = !query || text.includes(query);
        const matchesAmenities = activeFilters.length === 0 || activeFilters.every((term) => text.includes(term));
        const matches = matchesQuery && matchesAmenities;
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      parkCount.textContent = `${visibleCount} ${visibleCount === 1 ? "park" : "parks"}`;
      emptyState.style.display = visibleCount === 0 ? "block" : "none";

      if (markerLayer) {
        window.clearTimeout(markerUpdateTimer);
        markerUpdateTimer = window.setTimeout(() => {
          updateParkMarkerLayers();
        }, 120);
      }
    }

    parkCount.textContent = `${parkCards.length} parks`;
    const parkMarkers = [];
    let parkMap;
    let markerLayer;
    let recommendedMarkerLayer;
    let focusRequest = 0;
    let markerUpdateTimer;
    let defaultParkIcon;
    let recommendedParkIcon;
    let userLocation;
    let userLocationMarker;

    if (!window.L || !L.markerClusterGroup) {
      mapStatus.textContent = "The interactive map could not load. Check your internet connection and refresh the page.";
      mapStatus.hidden = false;
    } else {
      parkMap = L.map("park-map", { maxZoom: 19 }).setView([37.72, -122.23], 9);
      markerLayer = L.markerClusterGroup({ chunkedLoading: true }).addTo(parkMap);
      recommendedMarkerLayer = L.layerGroup().addTo(parkMap);

      const roadmapLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          attribution: "Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community"
        }
      );
      const terrainLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        maxNativeZoom: 17,
        subdomains: "abc",
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
      });
      const baseLayers = {
        Roadmap: roadmapLayer,
        Satellite: satelliteLayer,
        Terrain: terrainLayer
      };

      roadmapLayer.addTo(parkMap);
      L.control.layers(baseLayers, null, { collapsed: true }).addTo(parkMap);

      const userLocationControl = L.control({ position: "topleft" });
      userLocationControl.onAdd = () => {
        const container = L.DomUtil.create("div", "user-location-control leaflet-bar");
        const button = L.DomUtil.create("button", "user-location-button");
        button.type = "button";
        button.setAttribute("aria-label", "Recenter map to your location");
        button.title = "Recenter map to your location";
        button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
        button.addEventListener("click", () => locateUser(true));
        container.append(button);
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        return container;
      };
      userLocationControl.addTo(parkMap);

      const userLocationIcon = L.divIcon({
        className: "user-location-icon",
        html: '<span class="user-location-dot" aria-hidden="true"></span>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      function showUserLocation(coords, shouldRecenter) {
        userLocation = { lat: coords.latitude, lng: coords.longitude };
        const position = [userLocation.lat, userLocation.lng];
        highlightRecommendedParks(userLocation);

        if (userLocationMarker) {
          userLocationMarker.setLatLng(position);
        } else {
          const popup = document.createElement("p");
          popup.className = "user-location-popup";
          popup.textContent = "Your location";
          userLocationMarker = L.marker(position, {
            icon: userLocationIcon,
            title: "Your location",
            keyboard: true,
            zIndexOffset: 1000
          }).bindPopup(popup).addTo(parkMap);
        }

        if (shouldRecenter) {
          parkMap.flyTo(position, 14, { duration: 0.8 });
        }
      }

      function locateUser(shouldRecenter) {
        if (!navigator.geolocation) {
          highlightRecommendedParks(defaultLocation);
          mapStatus.textContent = "Your browser does not support location services.";
          mapStatus.hidden = false;
          return;
        }

        if (userLocation) {
          if (shouldRecenter) {
            parkMap.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 0.8 });
          }
          return;
        }

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            showUserLocation(coords, shouldRecenter);
            if (!shouldRecenter) {
              parkMap.flyTo([coords.latitude, coords.longitude], 9, { duration: 0.8 });
            }
          },
          () => {
            highlightRecommendedParks(defaultLocation);
            mapStatus.textContent = "Your location is unavailable. Check your browser permissions and try again.";
            mapStatus.hidden = false;
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 120000 }
        );
      }

      defaultParkIcon = L.divIcon({
        className: "park-marker-icon",
        html: '<span class="park-pin" aria-hidden="true"><span class="park-pin__body"><svg viewBox="0 0 24 24"><path d="M12 2.5 7 9h2l-4 5h5v6h4v-6h5l-4-5h2L12 2.5Z" fill="white"/></svg></span></span>',
        iconSize: [38, 44],
        iconAnchor: [19, 42],
        popupAnchor: [0, -40]
      });
      recommendedParkIcon = L.divIcon({
        className: "park-marker-icon park-marker-icon--recommended",
        html: '<span class="park-pin park-pin--recommended" aria-hidden="true"><span class="park-pin__body"><svg viewBox="0 0 24 24"><path d="M12 2.5 7 9h2l-4 5h5v6h4v-6h5l-4-5h2L12 2.5Z" fill="white"/></svg></span></span>',
        iconSize: [38, 44],
        iconAnchor: [19, 42],
        popupAnchor: [0, -40]
      });

      parkCards.forEach((card) => {
        const title = card.querySelector("h2").textContent;
        const location = card.querySelector(".location").textContent;
        const address = card.dataset.address;
        const sportsFacilities = card.dataset.sports;
        const marker = L.marker([
          Number(card.dataset.lat),
          Number(card.dataset.lng)
        ], { icon: defaultParkIcon, title });
        const popup = document.createElement("div");
        const popupTitle = document.createElement("p");
        const popupLocation = document.createElement("p");
        const popupAddress = document.createElement("p");

        popupTitle.className = "map-popup-title";
        popupTitle.textContent = title;
        popupLocation.className = "map-popup-location";
        popupLocation.textContent = location;
        popupAddress.className = "map-popup-address";
        popupAddress.textContent = `Address: ${address}`;
        const recommendationLabel = document.createElement("p");
        recommendationLabel.className = "map-popup-recommended";
        recommendationLabel.hidden = true;
        popup.append(popupTitle, popupLocation, popupAddress, recommendationLabel);
        if (sportsFacilities) {
          const popupSports = document.createElement("p");
          popupSports.className = "map-popup-address";
          popupSports.textContent = `Sports facilities: ${sportsFacilities}`;
          popup.append(popupSports);
        }
        marker.bindPopup(popup);
        marker.on("click", () => showParkDetails(card));
        parkMarkers.push({ card, marker, recommendationLabel });

        card.addEventListener("click", (event) => {
          event.preventDefault();
          showParkDetails(card);
          const request = ++focusRequest;
          mapSection.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "center"
          });
          parkMap.invalidateSize({ pan: false });
          const focusMarker = () => {
            if (request !== focusRequest) return;

            const location = marker.getLatLng();
            const zoom = Math.max(parkMap.getZoom(), 15);
            const alreadyFocused = parkMap.getZoom() === zoom
              && parkMap.getCenter().distanceTo(location) < 50;

            parkMap.closePopup();
            if (alreadyFocused) {
              marker.openPopup();
              return;
            }

            const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.1 : 0.6;
            const revealPopup = () => {
              if (request !== focusRequest) return;
              if (parkMap.getZoom() < zoom || parkMap.getCenter().distanceTo(location) >= 50) return;

              parkMap.off("moveend", revealPopup);
              marker.openPopup();
            };

            parkMap.on("moveend", revealPopup);
            parkMap.flyTo(location, zoom, { duration });
            window.setTimeout(() => {
              parkMap.off("moveend", revealPopup);
              revealPopup();
            }, duration * 1000 + 150);
          };

          if (markerLayer.hasLayer(marker)) {
            markerLayer.zoomToShowLayer(marker, focusMarker);
          } else {
            focusMarker();
          }
        });
      });

      markerLayer.addLayers(parkMarkers.map(({ marker }) => marker));
      parkMap.fitBounds(markerLayer.getBounds().pad(0.12));
      window.setTimeout(() => parkMap.invalidateSize(), 0);

      locateUser(false);
    }

    searchInput.addEventListener("input", () => {
      applyParkFilters();
    });

    if (searchTags) {
      renderAmenityTags();
      document.querySelectorAll(".amenity").forEach((tag) => {
        attachAmenityClickHandler(tag);
      });
    }
    }
