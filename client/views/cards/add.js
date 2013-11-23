Template.cardsAdd.helpers({
	currentCard: function() {
		return Cards.findOne(Session.get('currentCardId'));
	},

	currentStash: function(currentCard) {
		var currentStashId = currentCard ? currentCard.stashId : Session.get('currentStashId');
		return Stashes.findOne(currentStashId);
	},

	currentStashName: function(currentCard) {
		var currentStashId = currentCard ? currentCard.stashId : Session.get('currentStashId');
		var currentStash = Stashes.findOne(currentStashId);
		if(currentStash) {
			return currentStash.name;
		}
	}
});

Template.cardsAdd.rendered = function() {
	// Create two new editor instances
	var editorConfig = getEditorConfig();
	window.setTimeout(function() {
		new nicEditor(editorConfig).panelInstance('question');
		new nicEditor(editorConfig).panelInstance('answer');
	}, 50);
};

Template.cardsAdd.events({
	'click .save': function(e) {
		e.preventDefault();

		// Get the current stash from the session
		var stash = Stashes.findOne(Session.get('currentStashId'));

		// Gather the data from the form
		var question = nicEditors.findEditor('question').getContent();
		var answer = nicEditors.findEditor('answer').getContent();

		// Filter some stuff from the question & answer manually
		question = question.replace(/&nbsp;/g, ' ');
		answer = answer.replace(/&nbsp;/g, ' ');

		var data = {
			stashId: stash._id,
			question: question,
			answer: answer,
		};

		// Submit the card on the server
		Meteor.call('cardAdd', data, function(error, cardId) {
			if(error) {
				// Display the error
				showAlert(error.reason);
			} else {
				// Empty the input field
				nicEditors.findEditor('question').setContent('');
				nicEditors.findEditor('answer').setContent('');

				// Show an alert
				showAlert('The card has been created!', 'success');
			}
		});
	}
});