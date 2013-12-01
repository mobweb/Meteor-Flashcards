Template.stashesAdd.helpers({
	currentStash: function() {
		return Stashes.findOne(Session.get('currentStashId'));
	},
});

Template.stashesAdd.events({
	'submit form': function(e, template) {
		e.preventDefault();

		// Gather the data from the form
		var name = $(e.target).find('[name=name]');
		var description = $(e.target).find('[name=description]');
		var data = {
			// Note: When modifying these attributes, always also
			// update the data object in stashes/view.js (the one
			// used for importing)
			name: name.val(),
			description: description.val()
		};

		// Call the server side submit function
		Meteor.call('stashAdd', data, function(error, stashId) {
			if(error) {
				// Display the error
				showAlert(error.reason);
			} else {
				// Empty the input field
				name.val('');

				// Create an alert
				showAlert('The stash has been created!', 'success');

				// Redirect the user to his stash overview
				var stash = Stashes.findOne(stashId);
				Meteor.Router.to('stashesView', stash);
			}
		});
	}
});