Template.cardsView.helpers({
	currentCard: function() {
		return Cards.findOne(Session.get('currentCardId'));
	},

	currentStash: function(currentCard) {
		var currentStashId = currentCard ? currentCard.stashId : Session.get('currentStashId');
		return Stashes.findOne(currentStashId);
	}
});

Template.cardsView.rendered = function() {
	// Create two new editor instances, and disable them
	var editorConfig = getEditorConfig();
	window.setTimeout(function() {
		new nicEditor(editorConfig).panelInstance('question');
		new nicEditor(editorConfig).panelInstance('answer');
		nicEditors.findEditor('question').disable();
		nicEditors.findEditor('answer').disable();
		$('.nicEdit-panel').hide();
	}, 50);
};