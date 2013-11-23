/* ============================================================================
 *
 * Notes / Examples
 *
 ===========================================================================

// This file is used to insert "fixtures" into the server that are created
// every time the server is reset
if(Examples.find().count() === 0) {
	Examples.insert({
		title: 'Why I love Meteor',
		author: 'John Resig',
		url: 'http://jquery.com/why-i-love-meteor',
		commentsCount: 0,
		upvoters: [], votes: 0
	});
}

/* ============================================================================
 *
 * Custom code
 *
 =========================================================================== */
