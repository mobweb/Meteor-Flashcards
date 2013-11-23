Template.cardsEdit.helpers({
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

Template.cardsEdit.rendered = function() {
	// Create two new editor instances
	var editorConfig = getEditorConfig();
	window.setTimeout(function() {
		new nicEditor(editorConfig).panelInstance('question');
		new nicEditor(editorConfig).panelInstance('answer');
	}, 50);
};

Template.cardsEdit.events({
	'click .delete-card': function(e) {
		e.preventDefault();

		if(confirm('Delete this card?')) {
			var currentCardId = Session.get('currentCardId');
			var card = Cards.findOne(currentCardId);
			var stashId = card.stashId;
			//TODO: Security?
			var result = Cards.remove(currentCardId, function(error) {
				if(error) {
					showAlert(error.reason);
				} else {
					// Update the stash's card count
					Stashes.update(stashId, {$inc: {cardsCount: -1}});

					// Display a notification and redirect the user to the stash
					// overview
					showAlert('The card has been deleted!', 'success');
					Meteor.Router.to('stashesView', Session.get('currentStashId'));
				}
			});
		}
	},

	'click .save': function(e) {
		e.preventDefault();

		// Get the current stash from the card
		var card = Cards.findOne(Session.get('currentCardId'));
		var stash = Stashes.findOne(card.stashId);

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

		// Get the existing card's data and submit it all to the server
		// side edit function
		data.cardId = card._id;

		// Call the server side submit function
		Meteor.call('cardEdit', data, function(error, cardId) {
			if(error) {
				// Display the error
				showAlert(error.reason);
			} else {
				// Empty the input field
				//question.val('');
				//answer.val('');
				nicEditors.findEditor('question').setContent('');
				nicEditors.findEditor('answer').setContent('');

				// Create an alert
				showAlert('The card has been updated!', 'success');

				// Redirect the user back to the stash overview
				var stash = Stashes.findOne(card.stashId);
				Meteor.Router.to('stashesView', stash);
			}
		});
	}
});