/* ============================================================================
 *
 * Notes / Examples
 *
 ===========================================================================

/* ============================================================================
 *
 * Custom code
 *
 =========================================================================== */

// Create a new collection without a name, so the collection will
// be client only
Alerts = new Meteor.Collection(null);

// Creating a new alert
showAlert = function(message, type) {
	if(!type) {
		type = 'error';
	}

	Alerts.insert({message: message, type: type, seen: false});
};

// Wiping out all the viewed alerts
clearAlerts = function() {
	Alerts.remove({seen: true});
};