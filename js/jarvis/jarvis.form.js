/**
 * JARVIS.MVC.FORM 组件
 * 
 * @author lijunlin
 */
(function($$, NS) {
	var $$_NS = $$.register(NS);
	
	/**
	 * ajax方式提交表单
	 */
	$$_NS.submit = function(formObj, callback) {
		$(formObj).validate({
	        submitHandler : function(form) {
	        	var url = $(form).attr("action");
				var data = $(form).serialize();
	        	var opts = {
	    				type : $(form).attr("method"),
	    				dataType : "json"
	    			};
	    		$$.MVC.doRequest(url, data, callback, opts);
	        }    
	    });
		$(formObj).submit();
	};
})(GLOBAL_NS, "FORM");