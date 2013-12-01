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

// Note: The "rendered" callback gets called every time the client
// fetches any data that goes into this view, which means it might
// be called multiple times when the view is loaded
// Note: The nicEditor implementation in this view is buggy. If the
// rendered callback gets called multiple times (if the view is refreshed),
// it won't work! But we can ignore this as it's an edge case
Template.cardsAdd.rendered = function() {
	// Create the nicEditor instances for the input fields.
	// This has to happen every time the page is rendered since the
	// fields are destroyed and recreated with every page reload
	var editorConfig = getEditorConfig();

	// Save the editor instances in the global scope so they can be removed
	// and recreated later
	questionNicEditorInstance = new nicEditor(editorConfig).panelInstance('question');
	answerNicEditorInstance = new nicEditor(editorConfig).panelInstance('answer');
};

Template.cardsAdd.events({
	'click .save': function(e) {
		e.preventDefault();

		// Get the current stash from the session
		var stash = Stashes.findOne(Session.get('currentStashId'));

		// Gather the data from the form
		var question = nicEditors.findEditor('question').getContent();
		var answer = nicEditors.findEditor('answer').getContent();

		// Destroy the nicEditor instances for both fields since these
		// fields will be destroyed and the page will be re-rendered
		// using two new fields. If we don't destroy these instances,
		// nicEditor will be confused and unable to create the panels
		// for the new fields
		questionNicEditorInstance.removeInstance('question');
		answerNicEditorInstance.removeInstance('answer');

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