Notifications = new Meteor.Collection('notifications');

Notifications.allow({
	update: ownsDocument
});

createNotification = function(userId, message, path) {
	if(!message) {
		message = '';
	}

	if(!path) {
		path = '#';
	}

	var data = {
		userId: userId,
		message: message,
		path: path,
		read: false
	};
	
	Notifications.insert(data);
};