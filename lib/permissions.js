/* ============================================================================
 *
 * Notes / Examples
 *
 ===========================================================================

/* ============================================================================
 *
 * Custom code
 *
 =========================================================================== */

// Checks if a specific document was created by a specific user
ownsDocument = function(userId, doc) {
	return doc && doc.userId === userId;
};