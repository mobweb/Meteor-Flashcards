/* ============================================================================
 *
 * Notes / Examples
 *
 ===========================================================================

Meteor.Router.add({
	// Simply render a template at a specific path:
	'/some-path': 'myTemplate',

	// Handle along arguments and act upon them
	'/post/:_id': {
		to: 'myPostTemplate',
		// Do something with the ID
		and: function(id) {
			Session.set('currentPostId', id);
		}
	}
});

/* ============================================================================
 *
 * Custom code
 *
 =========================================================================== */

// Set up the router
Meteor.Router.add({
	'/': {
		'as': 'allStashesList',
		'to': 'stashesList',
		'and': function() {
			Session.set('stashesUserOnly', false);
			Session.set('stashesSort', '');
			Session.set('stashesFilterRegex', '');
		}
	},
	'/stashes/': {
		'as': 'userStashesList',
		'to': 'stashesList',
		'and': function() {
			Session.set('stashesUserOnly', true);
			Session.set('stashesSort', '');
			Session.set('stashesFilterRegex', '');
		}
	},
	'/stashes/add': {
		as: 'stashesAdd',
		to: 'stashesAdd',
		and: function() {
			Session.set('currentStashId', '');
		}
	},
	'/stashes/:_id/edit': {
		as: 'stashesEdit',
		to: 'stashesEdit',
		and: function(id) {
			Session.set('currentStashId', id);
		}
	},
	'/stashes/:_id/view': {
		to: 'stashesView',
		and: function(id) {
			Session.set('cardsFilterRegex', '');
			Session.set('currentStashId', id);
		}
	},
	'/stashes/:_id/add': {
		as: 'cardsAdd',
		to: 'cardsAdd',
		and: function(stashId) {
			Session.set('currentStashId', stashId);
			Session.set('currentCardId', '');
		}
	},

	'/stashes/:_id/questioning': {
		as: 'cardsQuestioning',
		to: 'cardsQuestioning',
		and: function(id) {
			Session.set('currentQuestioningMode', 'random');
			Session.set('currentStashId', id);
		}
	},

	'/stashes/:_id/questioning/sorted': {
		as: 'cardsQuestioningSorted',
		to: 'cardsQuestioning',
		and: function(id) {
			Session.set('currentQuestioningMode', 'sorted');
			Session.set('currentStashId', id);
		}
	},

	'/cards/:_id/view': {
		to: 'cardsView',
		and: function(id) { Session.set('currentCardId', id); }
	},
	'/cards/:_id/edit': {
		to: 'cardsEdit',
		and: function(id) { Session.set('currentCardId', id); }
	},
	'/cards/:_id/add': {
		to: 'cardsAdd',
		and: function(id) { Session.set('currentCardId', id); }
	},
});

// Define and apply filters
Meteor.Router.filters({
	// Restrict access to certain pages to logged-in users
	'requireLogin': function(page) {
		if(Meteor.user()) {
			return page;
		} else {
			return 'accessDenied';
		}
	},

	// This filter is a bit of a hack since it doesn't really filter
	// anything. It only assures that the clearAlerts function is
	// run everytime a new page is loaded
	'clearAlerts': function(page) {
		clearAlerts();
		return page;
	}
});

// Apply the login filter to certain pages
Meteor.Router.filter('requireLogin', {only: 'postSubmit'});

// Run this filter on every page load. It wipes out the previously
// viewed alerts
Meteor.Router.filter('clearAlerts');