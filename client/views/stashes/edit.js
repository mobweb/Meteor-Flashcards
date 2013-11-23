Template.stashesEdit.helpers({
	currentStash: function() {
		return Stashes.findOne(Session.get('currentStashId'));
	},

	isEdit: function() {
		return Session.get('currentStashId') !== '';
	}
});

Template.stashesEdit.events({
	'submit form': function(e, template) {
		e.preventDefault();

		// Gather the data from the form
		var name = $(e.target).find('[name=name]');
		var description = $(e.target).find('[name=description]');
		var data = {
			name: name.val(),
			description: description.val()
		};

		// Get the ID of the stash that is being edited
		data.stashId = Session.get('currentStashId');

		// And call the server side edit function
		Meteor.call('stashEdit', data, function(error, stashId) {
			if(error) {
				// Display the error
				showAlert(error.reason);
			} else {
				// Empty the input field
				name.val('');

				// Create an alert
				showAlert('The stash has been edited!', 'success');

				// Redirect the user directly to the stash's page
				var stash = Stashes.findOne(data.stashId);
				Meteor.Router.to('stashesView', stash);
			}
		});
	}
});