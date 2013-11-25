/*
 *
 * This file is a "manager" for the template. Here we can define
 * functions/helpers, listen for events and so on
 *
 */
Template.stashesListItem.helpers({

	trim: function(length, string) {
		if(string.length > length) {
			string = string.substr(0, length) + '...';
		}

		return string;
	}
});