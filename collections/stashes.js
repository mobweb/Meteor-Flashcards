Stashes = new Meteor.Collection('stashes');

Meteor.methods({
	stashAdd: function(data) {
		var user = Meteor.user();

		if(!user) {
			throw new Meteor.Error(401, 'Please log in to create a new stash!');
		}

		if(!data.name) {
			throw new Meteor.Error(402, 'Please enter a stash name!');
		}

		stash = _.extend(_.pick(data, 'name', 'description'), {
			userId: user._id,
			submitted: new Date().getTime(),
			cardsCount: 0
		});

		// Create the stash
		stash._id = Stashes.insert(stash);

		return stash._id;
	},

	stashEdit: function(data) {
		var user = Meteor.user();

		if(!user) {
			throw new Meteor.Error(401, 'Not logged in');
		}

		if(!data.stashId) {
			throw new Meteor.Error(402, 'Not all required fields specified');
		}

		if(!data.name) {
			throw new Meteor.Error(402, 'Not all required fields specified');
		}

		// Update the stash
		Stashes.update(
			data.stashId, {
				$set: {
					name: data.name,
					description: data.description,
					cardsCount: 0,
				}
			}
		);
	},

});