CREATE INDEX airbnblat
ON airbnb_address(latitude);
CREATE INDEX airbnblon
ON airbnb_address(longitude);

CREATE INDEX yelplat
ON yelp_data(latitude);
CREATE INDEX yelplon
ON yelp_data(longitude);
