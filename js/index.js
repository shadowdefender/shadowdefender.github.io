/**
 * index.js
 * @author lijunlin<walkerljl@qq.com>
 */
Namespace.register("JARVIS.INDEX");
(function(){
	
	/**
	 * 初始化函数
	 */
	JARVIS.INDEX.init = function() {
		var bro = $.browser;
	    var binfo = '';
	    if (bro.msie) {
	    	binfo = "Microsoft Internet Explorer " + bro.version;
	    }
	    if (bro.mozilla) {
	    	binfo = "Mozilla Firefox " + bro.version;
	    }
	    if (bro.safari) {
	    	binfo = "Apple Safari " + bro.version;
	    }
	    if (bro.opera) {
	    	binfo = "Opera " + bro.version;
	    }
	    if (binfo == "Microsoft Internet Explorer 6.0" || binfo == "Microsoft Internet Explorer 7.0" ) {
	    	alert("浏览器版本过低 将不能登录，请升级浏览器至IE8后在登陆系统，或者使用最新的谷歌、火狐浏览器。");
	    	$("#btnSub").hide(1000);
	    	$("#userName").hide(1000);
	    	$("#userPwd").hide(1000);
	    	$(".promotion").html("浏览器版本过低，请使用IE8以上版本！");
	    	return;
	    }
	};
	
	/**
	 * 登录
	 */
	JARVIS.INDEX.login = function() {
		var userId = $('#userId').val();
		var password = $('#password').val();
		if (JARVIS.stringIsEmpty(userId) || userId.length > 50) {
			alert('请输入长度不超过50个字符的用户Id');
			$('#userId').focus();
			return;
		} else if (JARVIS.stringIsEmpty(password) || password.length > 50) {
			alert('请输入长度不超过50个字符的用户密码');
			$('#password').focus();
			return;
		}
		JARVIS.mask();
		$("#password").val($.md5(password));
		$("#login_form").submit();
	};
	
	/**
	 * 回车登录
	 */
	JARVIS.INDEX.keyLogin = function(event) {
		//消除浏览器差异  
		var event = arguments.callee.caller.arguments[0] || window.event;
		if (event.keyCode == 13) {  
			JARVIS.INDEX.login();
		} 
	};
})();