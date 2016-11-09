function play68_init() {
	updateShare(0);
}

function play68_submitScore(str) {
	updateShare(str);
	 Play68.shareFriend();
}

function updateShare(str) {

	var descContent = "疯狂手指";
	if(str)
	    shareTitle =  str;
	else
		shareTitle ="疯狂手指-7k7k手机小游戏"
	document.title = shareTitle;
	appid = '';
	Play68.setShareInfo(shareTitle,descContent);
	
}
function play68_goHome(){
	parent.location.href="http://h.7k7k.com/";
}