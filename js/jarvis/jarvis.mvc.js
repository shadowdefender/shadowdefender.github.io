/**
 * JARVIS.MVC组件
 * 
 * @author lijunlin
 */
(function($$, NS) {
	var $$_NS = $$.register(NS);
	
	//基础变量定义
	/**
	 * 响应对象
	 */
	$$_NS.context = {
			appName : "",
			contextPath: "",
			objectIdentifer : "",
			currentUrl : "",
			ssoLoginAddress : "",
			mainContent : "main-content"
	};
	
	/**
	 * 响应对象
	 */
	$$_NS.response = {
			status : "status", //状态码
			message: "msg", //消息
			body : "body" //响应主体(响应数据)
	};
	
	/**
	 * 状态
	 */
	$$_NS.status = {
			enabled : "1",//已启用
			disabled: "2",//已停用
			deleted : "3"//已删除
	};

	/**
	 * 重新加载页面(默认加载到主框架)
	 */
	$$_NS.loadPageToMainFrame = function(url, params) {
		$$.loadPage(url, params, $$_NS.context["mainContent"]);
	};
	
	/**
	 * 请求
	 */
	$$_NS.doRequest = function(url, data, callback, options) {
		var def_options = $.extend({}, options);
		$$.doRequest(url, data, "post", "json", 
				function(response) {
					$$.unmask();
					if (!response[$$_NS.response["status"]]) {
						$$.alert(response[$$_NS.response["message"]]);
					}
					if (response[$$_NS.response["body"]] == "notLogin") {
						$$.sendDirect($$_NS.context["ssoLoginAddress"]);
					} else {
						if (typeof(callback) == "function") {
							callback(response);
						} else {
							$$.alert(response[$$_NS.response["message"]]);
						}
					}
				},
				def_options
		);
	};
	
	/**
	 * 初始化
	 */
	$$.addConstructor(function() {
		$$_NS.context["appName"] = $("#appName").val();
		$$_NS.context["contextPath"] = $("#contextPath").val();
		$$_NS.context["objectIdentifer"] = $("#objectIdentifer").val();
		$$_NS.context["currentUrl"] = $("#currentUrl").val();
		$$_NS.context["ssoLoginAddress"] = $("#ssoLoginAddress").val();
		
		/**log*/
		$$.log("appName = " + $$_NS.context["appName"]);
		$$.log("contextPath = " + $$_NS.context["contextPath"]);
		$$.log("objectIdentifer = " + $$_NS.context["objectIdentifer"]);
		$$.log("currentUrl = " + $$_NS.context["currentUrl"]);
		$$.log("ssoLoginAddress = " + $$_NS.context["ssoLoginAddress"]);
	});
})(GLOBAL_NS, "MVC");