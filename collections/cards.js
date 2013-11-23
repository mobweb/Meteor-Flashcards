Cards = new Meteor.Collection('cards');

Meteor.methods({
	cardAdd: function(data) {
		// Get the current user
		var user = Meteor.user();
		if(!user) {
			throw new Meteor.Error(401, 'Not logged in');
		}

		// Check if all the required data has been passed
		if(!data.question || !data.answer || !data.stashId) {
			throw new Meteor.Error(402, 'Not all required fields specified');
		}

		// When a new card is created in a stash, set the attemptsSorted value
		// of this new card to the *lowest* value from another card in this
		// stash. This is needed for the sorting of the cards
		var lowestAttemptsCard = Cards.findOne({stashId: data.stashId}, {sort: {attemptsSorted: 1}});
		var lowestAttemptsCardAttempts = lowestAttemptsCard ? lowestAttemptsCard.attemptsSorted : 0;

		card = _.extend(_.pick(data, 'question', 'answer', 'stashId'), {
			userId: user._id,
			submitted: new Date().getTime(),
			attempts: lowestAttemptsCardAttempts,
			attemptsSorted: lowestAttemptsCardAttempts,
			attemptsCorrect: lowestAttemptsCardAttempts,
			attemptsCorrectPercent: 0,
			lastAttempt: 0
		});

		// Update the stash's card count
		Stashes.update(data.stashId, {$inc: {cardsCount: 1}});

		// Create the card
		card._id = Cards.insert(card);

		return card._id;
	},

	cardEdit: function(data) {
		var user = Meteor.user();

		if(!user) {
			throw new Meteor.Error(401, 'Not logged in');
		}

		if( !data.cardId || !data.question || !data.answer) {
			throw new Meteor.Error(402, 'Not all required fields specified');
		}

		// Update the card
		Cards.update(data.cardId, {
			$set: {
				question: data.question,
				answer: data.answer
			}
		});
	},
});