/**
 * JARVIS.MVC.URL 组件
 * 
 * @author lijunlin
 */
(function($$, NS) {
	var $$_NS = $$.register(NS);
	
	/**
	 * 首页URL 
	 */
	$$_NS.index;
	/**
	 * 分页查询URL
	 */
	$$_NS.selectPage;
	/**
	 * 分页查询JSON URL
	 */
	$$_NS.selectJSONPage;
	/**
	 * 添加URL
	 */
	$$_NS.add;
	/**
	 * 编辑URL
	 */
	$$_NS.edit;
	/**
	 * 保存URL
	 */
	$$_NS.save;
	/**
	 * 更新状态URL
	 */
	$$_NS.modifyStatus;
	/**
	 * 删除URL
	 */
	$$_NS.del;
	/**
	 * 详细URL
	 */
	$$_NS.view;
	/**
	 * 检索URL
	 */
	$$_NS.search;
	/**
	 * 是否存在URL
	 */
	$$_NS.isExists;
	
	/**
	 * 初始化
	 */
	$$.addConstructor(function() {
		$$_NS.index = $$_NS.generateFullUrl("/");
		$$_NS.selectPage = $$_NS.generateFullUrl("/selectPage");
		$$_NS.selectJSONPage = $$_NS.generateFullUrl("/selectJSONPage.json");
		$$_NS.add = $$_NS.generateFullUrl("/add");
		$$_NS.edit = $$_NS.generateFullUrl("/edit-");
		$$_NS.save = $$_NS.generateFullUrl("/save.json");
		$$_NS.modifyStatus = $$_NS.generateFullUrl("/modifyStatus.json");
		$$_NS.del = $$_NS.generateFullUrl("/delete");
		$$_NS.view = $$_NS.generateFullUrl("/view-");
		$$_NS.search = $$_NS.generateFullUrl("/search");
		$$_NS.isExists = $$_NS.generateFullUrl("/isExists");
	});
	
	/**    
	 * 生成全路径URL
	 */
	$$_NS.generateFullUrl = function(methodUrl) {
		var url = $$.MVC.context["contextPath"] + $$.MVC.context["currentUrl"] + methodUrl;
		$$.log(" generate url ->" + url);
		return url;
	};
})(GLOBAL_NS, "MVC.URL");