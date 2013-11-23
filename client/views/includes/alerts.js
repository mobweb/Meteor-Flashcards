// Simply return all the alerts in the client side collection
Template.alerts.helpers({
	alerts: function() {
		return Alerts.find();
	}
});

// Every time an alert is rendered, mark it as seen via
// the defer function, which delays execution by 1ms, to make
// sure the alert is only marked as seen AFTER an optional
// redirect has happened
Template.alert.rendered = function() {
	// this referes to the object currently being rendered
	var alert = this.data;
	Meteor.defer(function() {
		Alerts.update(alert._id, {$set: {seen: true}});
	});
};