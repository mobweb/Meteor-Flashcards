/*
 *
 * This file is a "manager" for the template. Here we can define
 * functions/helpers, listen for events and so on
 *
 */
Template.stashesListItem.helpers({
	cardsCount: function() {
		return Cards.find({stashId: this._id}).fetch().length;
	},

	author: function() {
		console.log(this);
		return;
	}
});