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
	// Before showing a new alert, remove any existing old ones
	clearAlerts();

	// Default alert type
	if(!type) {
		type = 'error';
	}

	// Finally insert the alert into the Alerts collection
	Alerts.insert({message: message, type: type, seen: false});

	// Make the alert "pulse" quickly so the user can see it
	// (This also comes handy if the same alert is displayed twice
	// in a row, e.g. when creating a new card)
	window.setTimeout(function() {
		$('.alert').fadeOut(200).fadeIn(200);
	}, 100);
};

// Wiping out all the viewed alerts
clearAlerts = function() {
	Alerts.remove({seen: true});
};