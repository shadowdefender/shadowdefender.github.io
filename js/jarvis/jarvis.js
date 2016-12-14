/**
 * jarvis组件核心
 * 
 * @author lijunlin
 */
var JARVIS_NS = window.JS_NS || "JARVIS";//JS命名空间,支持使用JS_NS重定义
/**
 * 注册命名空间
 */
var registerNS = function() {
	var ns = "";
	for (var i in arguments) {
		var arr = arguments[i].split(".");
		for(var i in arr) {
			if(ns != "") {
				ns += ".";
			}
			ns += arr[i];
			eval("if(typeof(" + ns + ")=='undefined'){" + ns + " = new Object();}");
		}
	}
	return ns != "" ? eval(ns) : null;
};
var GLOBAL_NS = registerNS(JARVIS_NS);

(function($$) {
	//JS内置函数扩展
	/**
	 * 删除字符串左右空格
	 */
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,"");
	};
	
	/**
	 * 删除字符串做左边的空格
	 */
	String.prototype.ltrim = function() {
		return this.replace(/^\s+/g,"");
	};
	
	/**
	 * 删除字符串做右边的空格
	 */
	String.prototype.rtrim = function() {
		return this.replace(/\s+$/g,"");
	};
	
	/**
	 * 判断字符串为NULL或者为空
	 */
	String.prototype.isEmpty = function() {
		return this == null || this == "undefined" || (typeof(this) == "string" && this.trim() == "");
	};
	
	/**
	 * 判断字符串不为NULL和空
	 */
	String.prototype.isNotEmpty = function() {
		return !isEmpty(this);
	};
	
	/**
	 * 判断字符串相等
	 */
	String.prototype.equals = function(str1, str2) {
		if (str1.isEmpty() && str2.isEmpty()) {
			return true;
		} else if ((str1.isEmpty() && str2.isNotEmpty()) || (str1.isNotEmpty() && str2.isEmpty())) {
			return false;
		}
		str1 = str1.trim();
		str2 = str2.trim();
		return str1 == str2;
	};
	
	/**
	 * 判断字符串是否以自定字符串结束
	 */
	String.prototype.endWith = function(s) {
		if (s == null || s == ""|| this.length==0 || s.length > this.length) {
			return false;
		} if (this.substring(this.length - s.length) == s) {
			return true;
		} else {
			return false;
		} 
		return true;
	};
	
	/**
	 * 判断字符串是否以自定字符串开始
	 */
	String.prototype.startWith = function(s) {
		if (s == null || s == "" || this.length == 0 || s.length > this.length){
			return false;
		} if (this.substr(0, s.length) == s) {
			return true;
		} else {
			return false;
		}
		return true;
	};
	
	/**
	 * 替换
	 */
	String.prototype.replaceAll = function(b, a) {
		return this.replace(new RegExp(b,"gm"),a)
	};
	
	/** 是否开启Debug模式*/
	$$.isDebugEnabled = false;
	$$.debugMessagePrefix = "JARVIS js framework : ";
	$$.NS_NAME = "JARVIS";
	
	/**
	 * 全局命名空间注册方法
	 */
	$$.register = function(path) {
		return registerNS(JARVIS_NS, path);
	};
	
	/**
	 * 获取当前时间毫秒数
	 */
	$$.getTime = function() {
		return (new Date()).getTime();
	};
	
	/**
	 * 判断字符串为NULL或者为空
	 */
	$$.isEmpty = function(str) {
		return str == null || str == "undefined" || (typeof(str) == "string" && str.trim() == "");
	};
	
	/**
	 * 判断字符串不为NULL和空
	 */
	$$.isNotEmpty = function(str) {
		return !$$.isEmpty(str);
	};
	
	/**
	 * 判断字符串相等
	 */
	$$.equals = function(str1, str2) {
		if ($$.isEmpty(str1) && $$.isEmpty(str2)) {
			return true;
		} else if (($$.isEmpty(str1) && $$.isNotEmpty(str2)) || ($$.isNotEmpty(str1) && $$.isEmpty(str2))) {
			return false;
		}
//		str1 = str1.trim();
//		str2 = str2.trim();
		return str1 == str2;
	};
	
	/**
	 * 判断字符串不相等
	 */
	$$.notEquals = function(str1, str2) {
		return !$$.equals(str1, str2);
	}
	
	/**
	 * 输出日志信息
	 */
	$$.log = function(info) {
		if ($$.isDebugEnabled == true) {
			
		}
		try {
			if (info && info.stack) {
				console.log($$.debugMessagePrefix);
				console.log(info.stack);
			} else {
				console.log($$.debugMessagePrefix + info);
			}
		} catch(e) {
			console.log(e);
		}
	};
	
	/**
	 * 函数执行
	 */
	$$.execute = function(func) {
		try {
			if (typeof(func) == "function") {
				return eval("func();");
			} else {
				return eval(func);
			}
		} catch(e) {
			$$.log(e);
		}
	};
	//构造方法列表
	var constructors = new Array();
	
	/**
	 * 新增构造方法
	 */
	$$.addConstructor = function() {
		for (var i in arguments) {
			constructors.push(arguments[i]);
		}
	};
	
	/**
	 * 初始化(执行所有构造方法)
	 */
	$$.init=function() {
		for (var i in constructors) {
			$$.execute(function(){constructors[i]()})
		}
	};
	
	/**
	 * 刷新页面
	 */
	$$.refresh = function(url) {
		window.location.replace(url);
	};
	
	/**
	 * 重定向到新的URL
	 */
	$$.sendDirect = function(url) {
		window.location.href = url;
	}
	
	/**
	 * 提示信息
	 */
	$$.alert = function(message) {
		window.alert(message);
	}
	
	/**
	 * 切换checkbox选中状态
	 */
	$$.switchCheckboxCheckedStatus = function(domId, checkboxName) {
		if ($("#" + domId).attr("checked") == "checked") {
			$("input[name=" + checkboxName + "]:checkbox").removeAttr("checked");
			$("#" + domId).removeAttr("checked");
			alert("uncheck");
		} else {
			$("input[name=" + checkboxName + "]:checkbox").attr("checked", "checked");
			$("#" + domId).attr("checked", "checked");
			alert("check");
		}
	};
	
	/**
	 * 获取所有选中checkbox的值
	 */
	$$.getCheckedCheckboxValues = function(checkboxName) {
		var selects = $("input[name=" + checkboxName + "]:checked");
		var len = selects.length;
		if (selects == null || len == 0) {
			return "";
		}
		var ids = "";
		if (len > 0) {
			ids += $(selects[0]).val();
		}
		for (var i = 1; i < len; i++) {
			ids += "," + $(selects[i]).val();
		}
		return ids;
	};
	
	/**
	 * 获取指定Input对象选中的值
	 */
	$$.getInputCheckedValues = function(inputs) {
		if (inputs == null || inputs.length == 0) {
			return "";
		}
		var len = inputs.length;
		var checkedValues = "";
		if (len > 0) {
			checkedValues += $(inputs[0]).val();
		}
		for (var i = 1; i < len; i++) {
			checkedValues += "," + $(inputs[i]).val();
		}
		return checkedValues;
	};
	
	/**
	 * 开启遮罩
	 */
	$$.mask = function(info) {
		if ($("#winModal,#loadInfo").length == 0) {
			var msg = (info != null && info.trim() != "") ? info : $$.MESSAGE.messages["mask"];
			$("body").append("<div id='winModal'></div><div id='loadInfo' style='text-align:center;'>" + msg + "</div>");
		}
	};
	
	/**
	 * 关闭遮罩
	 */
	$$.unmask = function() {
		$("#winModal,#loadInfo").remove();
	};	
	
	/**
	 * 动态加载页面
	 */
	$$.loadPage = function(url, params, target) {
		$$.mask();
		$.post(url, params, function(html) {
			$("#" + target).html(html);
			$$.unmask();
		});
	};
	
	/**
	 * 请求
	 */
	$$.doRequest = function(url, data, method, dataType, callback, options) {
		try {
			$$.mask();
			var def_options = {
					async : true,
					cache : true,
					contentType : "application/x-www-form-urlencoded; charset=utf-8",
					url : url, 
					type : method || "post",
					dataType : dataType || "json",
					data : data,
					timeout : 10000,
					success : callback,
					error : function(jqXHR, textStatus, errorThrown) {
						$$.unmask();
						$$.alert($$.MESSAGE.messages["requestError"]);
					}
				};
			
			$.ajax($.extend(def_options, options));
		} catch(e) {
			$$.log(e);
			$$.unmask();
			$$.alert($$.MESSAGE.messages["requestError"]);
		}
	};
})(GLOBAL_NS);

/**
 * 初始化入口
 */
$(document).ready(function() {
	GLOBAL_NS.isDebugEnabled = $("#isJarvisJsDebugEnabled").val();
	console.log(GLOBAL_NS.debugMessagePrefix + "isDebugEnabled = " + GLOBAL_NS.isDebugEnabled);
	GLOBAL_NS.init();
});