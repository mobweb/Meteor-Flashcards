/*
 *
 * This file is a "manager" for the template. Here we can define
 * functions/helpers, listen for events and so on
 *
 */
Template.stashesList.helpers({
	userStashesOnly: function() {
		return Session.equals('stashesUserOnly', true);
	}
});

// This template has been separated because of the reactivity.
// Every time the stashesFilterRegex session variable is changed,
// this template is re-rendered. including it in the parent template
// would also re-render the parent template, including the search field,
// which would be a bad UX
Template.stashesListList.helpers({
	//TODO: In "All Stashes", only display stashes with more than 0 cards,
	// also display the # of cards on each stash
	stashes: function() {
		// The filter will be prepared
		var filter = {};

		// First check if we need to show all stashes or just
		// the ones for the current user
		var user = Meteor.user() || {};
		if(Session.equals('stashesUserOnly', true)) {
			// Filter: Only the current user's stashes
			filter.userId = user._id;
		} else {
			// Filter: All but the current user's stashes
			// with at least one card
			filter.userId = { $ne: user._id };
			filter.cardsCount = { $gt: 0 };
		}

		// Check if any filters have been set via the session
		if(!Session.equals('stashesFilterRegex', undefined)) {
			// Define the filter query
			var query = {$regex: Session.get('stashesFilterRegex'), $options: 'i'};

			// Set the filters using the $or operator
			filter.$or = [
				{'name': query},
				{'description': query}
			];
		}

		// Also prepare the options
		var sort = {submitted: -1}; // Submitted DESC
		if(!Session.equals('stashesSort', undefined)) {
			var stashesSort = Session.get('stashesSort');
			if(stashesSort === 'submittedASC') {
				sort = {submitted: 1};
			} else if(stashesSort === 'nameDESC') {
				sort = {name: -1};
			} else if(stashesSort === 'nameASC') {
				sort = {name: 1};
			}
		}

		var options = {
			sort: sort
		};

		// Finally query the collection for the stashes
		return Stashes.find(filter, options);
	}
});

Template.stashesList.rendered = function() {
	// Since we are rendering the box items dynamically we can't
	// wrap then in rows of 4. As a workaround, add a .row-first
	// class to every 5th item
	$('.row-fluid > .span3:nth-child(4n+1)').addClass('row-first');
};

Template.stashesList.events({
	// This event listener listens to changes in the filter field.
	// If the filter is updated, the filter session variable is updated as
	// well. Thanks to Meteor's reactivity this re-renders the template
	// according to the filter value
	'keyup input.search-query, blur input.search-query': function(e) {
		var filter = $(e.target).val();
		Session.set('stashesFilterRegex', filter);
	},

	'change select.sort': function(e) {
		var sort = $(e.target).val();
		Session.set('stashesSort', sort);
	}
});