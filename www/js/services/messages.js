'use strict';

app.factory('Messages', function(FURL, $firebaseArray){

	var userMessageRef = new Firebase(FURL + '/messages');

	return {
		historyMessages: function(uid1, uid2){
			var path = uid1 < uid2  ? uid1 + '/' + uid2 : uid2 + '/' + uid1;
			return $firebaseArray(userMessageRef.child(path));
		}
	}

})