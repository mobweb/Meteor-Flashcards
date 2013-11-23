/* ============================================================================
 *
 * Notes / Examples
 *
 ===========================================================================
 
// In this file we can define some default subscriptions that every
// client can be subscribed to (using the Meteor.subscribe() fn in
// the client code)
Meteor.publish('examples', function() {
	return Examples.find({}, {sort: {submitted: -1});
});

// The limit argument is passed when creating the subscription in
// main.js and this feature is added by the "paginated-subscription"
// package
Meteor.publish('pagedExamples', function(limit) {
	return Examples.find({}, {sort: {votes: -1, submitted: -1}, limit: limit});
});

// This is an example for a publication that publishes just a single
// element
Meteor.publish('singleExample', function(id) {
	return id && Examples.find(id);
});


/* ============================================================================
 *
 * Custom code
 *
 =========================================================================== */

// Publish the notifications for the current user
Meteor.publish('notifications', function() {
	return Notifications.find({userId: this.userId});
});

// Publish all stashes by default
Meteor.publish('stashes', function() {
	return Stashes.find({}, {sort: {submitted: -1}});
});

// Publish all of the user's cards by default
Meteor.publish('userCards', function() {
	return Cards.find({userId: this.userId}, {sort: {submitted: -1}});
});

// And publish external cards only when requested as part
// of the parent stash
Meteor.publish('stashCards', function(stashId) {
	return Cards.find({stashId: stashId}, {sort: {submitted: -1}});
});

// Publish all the usernames
Meteor.publish('usernames', function () {
	return Meteor.users.find({}, {fields: {'username': 1}});
});