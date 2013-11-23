/* ============================================================================
 *
 * Notes / Examples
 *
 ===========================================================================

// Setup for outputting simple notifications. Usage example:


/* ============================================================================
 *
 * Custom code
 *
 =========================================================================== */

Template.notifications.helpers({
	// Only collect the notifications for the current user that have
	// not been read yet
	notifications: function() {
		return Notifications.find({userId: Meteor.userId(), read: false});
	},

	notificationCount: function() {
		return Notifications.find({userId: Meteor.userId(), read: false}).count();
	}
});

// Mark a notification read once the user's clicked it
Template.notifications.events({
	'click a': function() {
		Notifications.update(this._id, {$set: {read: true}});
	}
});