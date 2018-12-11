var mongoose = require('mongoose');
var connect = require('./connect');

mongoose.connect(connect);

module.exports = {
	restaurant: mongoose.model('restaurantinfo', {
		name: {
			type: String,
			required: true
		},
		rating : {
			type: String,
			required: true
		},
		price : {
			type: String,
			required: true
		},
		pnumber: {
			type: String,
			required: true
		}
	}),
	trip: mongoose.model('tripinfo', {
		airbnb: {
			type: String,
			required: true
		},
		restaurants: [],
		comments: {
			type: String,
			required: false
		}
	}),
	user: mongoose.model('userinfo', {
		username: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		savedtrips: []
	})
};