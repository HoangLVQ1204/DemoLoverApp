'use strict';

app.controller('MatchCtrl', function(Match, Auth, profile, $scope, Like, Messages, $ionicModal, $ionicScrollDelegate, $firebaseArray, $timeout){

	var matc = this;
	
	matc.currentUser = profile;
	matc.message = '';

	var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    
	function init(){
	
		matc.list = [];

		Match.allMatchesByUser(matc.currentUser.$id).$loaded().then(function(data){
			for(var i=0; i < data.length; i++){
				var item = data[i];

				Auth.getProfile(item.$id).$loaded().then(function(profile){
					matc.list.push(profile);
				});
			}
		});		
	};

	$scope.$on('$ionicView.enter',function(e){
		init();
	});

	matc.unmatch = function(matchUid){
		Like.removeLike(matc.currentUser.$id,matchUid);
		Match.removeMatch(matc.currentUser.$id,matchUid);

		init();
	};

	$ionicModal.fromTemplateUrl('templates/message.html',{
		scope: $scope
	})
	.then(function(modal){
		$scope.modal = modal;
	})

	matc.openMessageModal = function(matchUid){
		Auth.getProfile(matchUid).$loaded()
		.then(function(profile){
			matc.currentMatchUser = profile;
			Messages.historyMessages(matchUid, matc.currentUser.$id).$loaded()
			.then(function(data){
				matc.messages = data;
				$scope.modal.show();
				$timeout(function() {
		          viewScroll.scrollBottom();
		        }, 0);

			})
		})
	};

	matc.closeMessageModal = function(){
		$scope.modal.hide();
	};

	matc.sendMessage = function(){

		if(matc.message.length > 0 ){
				
				matc.messages.$add({
					uid: matc.currentUser.$id,
					body: matc.message,
					timestamp: Firebase.ServerValue.TIMESTAMP
					
				}).then(function(){
					matc.message = '';
					$timeout(function() {
			          viewScroll.scrollBottom();
			        }, 0);
				})			
		}
	}

})