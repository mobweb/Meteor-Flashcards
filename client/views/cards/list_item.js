Template.cardsListItem.helpers({
	stripHtmlAndCut: function(content) {
		// Remove any HTML tags
		content = content.replace('</div>', ' ');
		content = content.replace(/(<([^>]+)>)/ig, '');

		// Truncate the string if it's longer than 150 chars
		if(content.length > 150) {
			content = content.substr(0, 150) + '...';
		}

		return content;
	},

	ownsStash: function(stash) {
		return Meteor.userId() === stash.userId;
	}
});