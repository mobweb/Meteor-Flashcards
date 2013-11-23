Handlebars.registerHelper('roundEven', function (float) {
	return Math.round(float);
});

Handlebars.registerHelper('authorUserName', function (object) {
	if(object.userId) {
		var user = Meteor.users.findOne(object.userId);
		return user ? user.username : '???';
	}
});

getEditorConfig = function() {
	//TODO: Activate the <center> button by default? Or should everything be centered
	// by default? And disable the positioning buttons?
	return {
		buttonList: [
			'bold',
			'italic',
			'underline',
			'ol',
			'ul',
			'hr',
			'fontSize',
			'indent',
			'outdent',
			'upload',
			'forecolor',
			'bgcolor',
			'removeformat'
		]
	};
};