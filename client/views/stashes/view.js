Template.stashesView.helpers({
	currentStash: function() {
		return Stashes.findOne(Session.get('currentStashId'));
	},

	ownsStash: function() {
		return Meteor.user() && ownsDocument(Meteor.user()._id, this);
	}
});

// This template has been separated because of the reactivity.
// Every time the cardsFilterRegex session variable is changed,
// this template is re-rendered. including it in the parent template
// would also re-render the parent template, including the search field,
// which would be a bad UX
Template.stashesViewCardsList.helpers({
	cards: function() {
		// The filter will be prepared
		var filter = {};

		// Initially just set the stash filter
		filter.stashId = this._id;

		// Check if any filters have been set via the session
		if(!Session.equals('cardsFilterRegex', undefined)) {
			// Define the filter query
			var query = {$regex: Session.get('cardsFilterRegex'), $options: 'i'};

			// Set the filters using the $or operator
			filter.$or = [
				{'question': query},
				{'answer': query}
			];
		}

		// Set the sorting options
		var options = {sort: {'submitted': '-1'}};

		// Finally send the query
		return Cards.find(filter, options);
	}
});

Template.stashesView.rendered = function() {
	// Since we are rendering the box items dynamically we can't
	// wrap then in rows of 4. As a workaround, add a .row-first
	// class to every 5th item
	$('.row-fluid > .span3:nth-child(4n+1)').addClass('row-first');
};

Template.stashesView.events({
	'click a.stash-delete': function(e) {
		e.preventDefault();

		if(confirm('Delete this stash?')) {
			var currentStashId = Session.get('currentStashId');
			//TODO: Security?
			var result = Stashes.remove(currentStashId, function(error) {
				if(error) {
					showAlert(error.reason);
				} else {
					// Show an alert
					showAlert('The stash has been deleted!', 'success');

					// Redirect the user to the stash overview
					Meteor.Router.to('userStashesList');
				}
			});
		}
	},

	'click a.stash-import': function(e) {
		e.preventDefault();

		if(confirm('Import this stash?')) {
			// Create a copy of the stash, and assign the copy
			// to the current user
			var stash = Stashes.findOne(Session.get('currentStashId'));
			var user = Meteor.user();

			// Copy the data manually
			var stashCopy = {
				name: stash.name,
				userId: user._id
			};

			// Insert the copy
			var stashCopyId = Stashes.insert(stashCopy);

			// Now get all the cards from the original, and copy
			// them into the newly created stash
			var cards = Cards.find({stashId: stash._id});
			cards.forEach(function(card) {
				var data = {
					question: card.question,
					answer: card.answer,
					stashId: stashCopyId,
					userId: user._id
				};

				Cards.insert(data);
			});

			// Redirect the user to the newly created stash
			stashCopy = Stashes.findOne(stashCopyId);
			Meteor.Router.to('stashesView', stashCopy);
		}
	},

	// This event listener listens to changes in the filter field.
	// If the filter is updated, the filter session variable is updated as
	// well. Thanks to Meteor's reactivity this re-renders the template
	// according to the filter value
	'keyup input.search-query, blur input.search-query': function(e) {
		var filter = $(e.target).val();
		Session.set('cardsFilterRegex', filter);
	},

	'click a.stash-cancel': function(e) {
		e.preventDefault();

		// If the currrent stash belongs to the user, redirect them to
		// "My Stashes", otherwise to "All Stashes"
		//TODO: Is there a way to call Template.stashesView.helpers.ownsStash()
		// directly instead of duplicating its functionality here?
		if(Meteor.user() && ownsDocument(Meteor.user()._id, Stashes.findOne(Session.get('currentStashId')))) {
			Meteor.Router.to('userStashesList');
		} else {
			Meteor.Router.to('allStashesList');
		}
	},
});