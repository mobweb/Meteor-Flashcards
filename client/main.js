/* ============================================================================
 *
 * Notes / Examples
 *
 ===========================================================================

Meteor.subscribe('publicationName', 10);

// Or to subscribe to a subscription that supports pagination:
subscriptionHandle = Meteor.subscribeWithPagination('publicationName', 10);

// We can use the autorun function to automatically update specific
// subscriptions once their "data source" changes:
Deps.autorun(function(){
	Meteor.subscribe('exampleEntitySingle', Session.get('currentEntityId'));
	Meteor.subscribe('entityComments', Session.get('currentEntityId'));
});

/* ============================================================================
 *
 * Custom code
 *
 =========================================================================== */

// Various subscriptions
Meteor.subscribe('userCards');
Meteor.subscribe('stashes');
Meteor.subscribe('usernames');

// Get all stash cards when the user browses to a specific stash
Deps.autorun(function(){
	Meteor.subscribe('stashCards', Session.get('currentStashId'));
});