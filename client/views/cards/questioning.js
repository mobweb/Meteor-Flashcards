Template.cardsQuestioning.helpers({
	currentCard: function() {
		// Wait while the collections are still initializing...
		if(!Stashes.find().fetch().length || !Cards.find().fetch().length) {
			return;
		}

		var stash = Stashes.findOne(Session.get('currentStashId'));
		var cards = Cards.find({stashId: stash._id});
		var currentCard = Cards.findOne({stashId: stash._id}, {sort: {attemptsSorted: 1, submitted: 1}});

		if(Session.get('currentQuestioningMode') === 'random') {
			// All cards are sorted into ten equally sized boxes according
			// to their correct answer rate. So a card that has been answered
			// wrongly often will probably be in box 1 and one that has been
			// answered correctly mostly will be put somewhere in the higher 
			// boxes.
			// First, select a box randomly but the lower boxes have a higher
			// chance of being selected
			//TODO: Better algorithm?
			//TODO: Why is this executed twice when entering questioning mode?
			var box = 10;
			var rand = Math.round(Math.random(0,100)*100);
			if(rand < 19) {			box = 1; }
			else if(rand < 36) {	box = 2; }
			else if(rand < 51) {	box = 3; }
			else if(rand < 64) {	box = 4; }
			else if(rand < 75) {	box = 5; }
			else if(rand < 84) {	box = 6; }
			else if(rand < 91) {	box = 7; }
			else if(rand < 96) {	box = 8; }
			else if(rand < 100) {	box = 9; }

			// Find out which card was last attempted
			var lastCardId = '';
			if(cards.fetch().length > 1) {
				var lastCard = Cards.findOne({stashId: stash._id}, {sort: {'lastAttempt': -1}});
				lastCardId = lastCard._id;
			}

			// Get all the cards sorted by their % of correct attempts,
			// but exclude the most recent card
			cards = Cards.find({
					stashId: stash._id,
					_id: { $ne: lastCardId }
				}, {
					sort: { 'attemptsCorrectPercent': 1 }
				}).fetch();

			// Now figure out which cards belong to the selected "box"
			var cardsCount = cards.length;
			var boxSize = cardsCount/10;
			var indexFrom = boxSize*box;
			var indexTo = indexFrom+boxSize;

			// Select a random card from that "box"
			var cardIndex = Math.floor(Math.random()*(indexTo-indexFrom+1)+indexFrom)-1;

			// Make sure the card index isn't negative or bigger than
			// the number of cards
			cardIndex = cardIndex < 0 ? 0 : cardIndex;
			cardIndex = cardIndex === cardsCount ? cardsCount-1 : cardIndex;

			// Finally select the chosen card
			currentCard = cards[cardIndex];
		}

		// Save the current card in the session and return it
		Session.set('currentCardId', currentCard._id);
		return currentCard;
	},

	stashName: function(currentCard) {
		var stashId = currentCard.stashId;
		return Stashes.findOne(stashId).name;
	}
});

Template.cardsQuestioning.events({
	'click .btn-show-answer': function(e) {
		e.preventDefault();
		$('.questioning').addClass('is-answer');
	},

	'click .answer-correct, click .answer-wrong': function(e) {
		e.preventDefault();

		// Find out if the "Correct" or "Wrong" button was clicked
		var modificator = (e.srcElement.className.indexOf('success') === -1) ? 0 : 1;

		// Calculate the new stats for the card
		var card = Cards.findOne(Session.get('currentCardId'));
		var attempts = card.attempts+1;
		var attemptsCorrect = card.attemptsCorrect+modificator;
		var attemptsCorrectPercent = 100*attemptsCorrect/attempts;
		var lastAttempt = new Date().getTime();

		// And the stats for the specific questioning modes
		var attemptsSorted = card.attemptsSorted;
		if(Session.get('currentQuestioningMode') === 'sorted') {
			attemptsSorted++;
		}

		// Update the card
		Cards.update(
			card._id,
			{
				$set: {
					attempts: attempts,
					attemptsSorted: attemptsSorted,
					attemptsCorrect: attemptsCorrect,
					attemptsCorrectPercent: attemptsCorrectPercent,
					lastAttempt: lastAttempt
				}
			}
		);

		// Redirect the user to another question, depending on the current
		// questioning mode
		var stash = Stashes.findOne(Session.get('currentStashId'));
		if(Session.get('currentQuestioningMode') === 'sorted') {
			Meteor.Router.to('cardsQuestioningSorted', stash);
		} else {
			Meteor.Router.to('cardsQuestioning', stash);
		}
	},

	'mouseover .answer-correct, mouseover .answer-wrong': function(e) {
		var color = '#ffcccc';
		if($(e.target).hasClass('answer-correct')) {
			color = '#b3ffb3';
		}

		$('.content-answer').css('background-color', color);
	},

	'mouseout .answer-correct, mouseout .answer-wrong': function(e) {
		$('.content-answer').css('background-color', 'transparent');
	},

	'click .delete-card': function(e) {
		e.preventDefault();

		if(confirm('Delete this card?')) {
			var currentCardId = Session.get('currentCardId');
			//TODO: Security?
			var result = Cards.remove(currentCardId, function(error) {
				if(error) {
					showAlert(error.reason);
				} else {
					showAlert('The card has been deleted!', 'success');
					Meteor.Router.to('stashesView', Session.get('currentStashId'));
				}
			});
		}
	},
});