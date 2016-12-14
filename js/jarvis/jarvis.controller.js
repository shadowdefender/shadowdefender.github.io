/**
 * JARVIS.CONTROLLER组件
 * @author cdlijunlin
 */
JARVIS.registerNamespace("JARVIS.CONTROLLER");
(function() {
	
	//dataTable对象
	JARVIS.CONTROLLER.datatableIdentifer;
	JARVIS.CONTROLLER.checkboxIdentifer;
	JARVIS.CONTROLLER.checkboxItemIdentifer;
	
	//表单Form名称
	JARVIS.CONTROLLER.editFormName;
	
	//按钮条执行方法
	JARVIS.CONTROLLER.addMethod;
	JARVIS.CONTROLLER.editMethod;
	JARVIS.CONTROLLER.viewMethod;
	JARVIS.CONTROLLER.searchMethod;
	JARVIS.CONTROLLER.enableMethod;
	JARVIS.CONTROLLER.disableMethod;
	JARVIS.CONTROLLER.delMethod;
	JARVIS.CONTROLLER.physicsDelMethod;
	
	//校验需要编辑的记录
	JARVIS.CONTROLLER.validateSave;
	
	//组件初始化
	JARVIS.CONTROLLER.init = function() {
		//初始化dataTable对象
		JARVIS.CONTROLLER.checkboxIdentifer = JARVIS.objectIdentifer + "_chk";
		JARVIS.CONTROLLER.checkboxItemIdentifer = JARVIS.objectIdentifer + "_chk_item";
		JARVIS.CONTROLLER.datatableIdentifer = JARVIS.objectIdentifer + "_table";
		JARVIS.CONTROLLER.editFormName = "form[name=" + JARVIS.objectIdentifer + "EditForm]";
		
		//绑定按钮条事件
		JARVIS.CONTROLLER.addMethod = "JARVIS.CONTROLLER.defaultAddMethod();";
		JARVIS.CONTROLLER.editMethod = "JARVIS.CONTROLLER.defaultEditMethod();";
		JARVIS.CONTROLLER.viewMethod = "JARVIS.CONTROLLER.defaultViewMethod();";
		JARVIS.CONTROLLER.searchMethod = "JARVIS.CONTROLLER.defaultSearchMethod();";
		JARVIS.CONTROLLER.enableMethod = "JARVIS.CONTROLLER.defaultEnableMethod();";
		JARVIS.CONTROLLER.disableMethod = "JARVIS.CONTROLLER.defaultDisableMethod();";
		JARVIS.CONTROLLER.delMethod = "JARVIS.CONTROLLER.defaultDelMethod();";
		JARVIS.CONTROLLER.physicsDelMethod = "JARVIS.CONTROLLER.defaultPhysicsDelMethod();";
	};
	
	//全选/反选
	JARVIS.CONTROLLER.checkAll = function() {
		JARVIS.checkAll('#' + JARVIS.CONTROLLER.checkboxIdentifer, JARVIS.CONTROLLER.checkboxItemIdentifer);
	};
	
	//首页
	JARVIS.CONTROLLER.index = function() {
		JARVIS.replace(JARVIS.CONTROLLER.URL.index);
	};

	//新增
	JARVIS.CONTROLLER.add = function() {
		eval(JARVIS.CONTROLLER.addMethod);
	};
	JARVIS.CONTROLLER.defaultAddMethod = function() {
		JARVIS.loadPageToMainFrame(JARVIS.CONTROLLER.URL.add, {});
	};
	
	//修改
	JARVIS.CONTROLLER.edit = function() {
		eval(JARVIS.CONTROLLER.editMethod);
	};
	//ajax方式提交
	JARVIS.CONTROLLER.defaultEditMethod = function() {
		var idsStr = JARVIS.getCheckedValues(JARVIS.CONTROLLER.checkboxItemIdentifer);
		if (idsStr != "") {
			var ids = idsStr.split(",");
			if (ids.length > 1) {
				window.alert("只能操作一条数据");
			} else {
				JARVIS.loadPageToMainFrame(JARVIS.CONTROLLER.URL.edit + ids[0], {});
			}
		} else {
			window.alert("请选择要操作的数据");
		}
	};

	//保存
	JARVIS.CONTROLLER.save = function() {
		var isValidSaveMethod = JARVIS.isValidText(JARVIS.CONTROLLER.validateSave);
		if (!isValidSaveMethod || (isValidSaveMethod && eval(JARVIS.CONTROLLER.validateSave))) {
			JARVIS.FORM.postAjax($(JARVIS.CONTROLLER.editFormName), function(response) {
				alert(response[JARVIS.RESPONSE_MESSAGE_KEY]);
				if (response[JARVIS.RESPONSE_STATUS_KEY]) {
					window.location.href = JARVIS.CONTROLLER.URL.index;
				}
			});
		}
	};
	
	//详细
	JARVIS.CONTROLLER.view = function() {
		eval(JARVIS.CONTROLLER.viewMethod);
	};
	JARVIS.CONTROLLER.defaultViewMethod = function() {
		var idsStr = JARVIS.getCheckedValues(JARVIS.CONTROLLER.checkboxItemIdentifer);
		if (idsStr != "") {
			var ids = idsStr.split(",");
			if (ids.length > 1) {
				window.alert("只能操作一条数据");
			} else {
				JARVIS.loadPageToMainFrame(JARVIS.CONTROLLER.URL.view + ids[0], {});
			}
		} else {
			window.alert("请选择要操作的数据");
		}
	};
	
	//检索
	JARVIS.CONTROLLER.search = function() {
		eval(JARVIS.CONTROLLER.searchMethod);
	};
	JARVIS.CONTROLLER.defaultSearchMethod = function() {
		JARVIS.TABLE.resetTable(JARVIS.TABLE.dataTableObject, true);
	};
	
	//启用
	JARVIS.CONTROLLER.enable = function() {
		eval(JARVIS.CONTROLLER.enableMethod);
	};
	JARVIS.CONTROLLER.defaultEnableMethod = function() {
		JARVIS.CONTROLLER.modifyStatus(JARVIS.STATUS_ENABLED);
	};
	
	//停用
	JARVIS.CONTROLLER.disable = function() {
		eval(JARVIS.CONTROLLER.disableMethod);
	};
	JARVIS.CONTROLLER.defaultDisableMethod = function() {
		JARVIS.CONTROLLER.modifyStatus(JARVIS.STATUS_DISABLED);
	};
	
	//删除
	JARVIS.CONTROLLER.del = function() {
		eval(JARVIS.CONTROLLER.delMethod);
	};
	JARVIS.CONTROLLER.defaultDelMethod = function() {
		JARVIS.CONTROLLER.modifyStatus(JARVIS.STATUS_DELETED);
	};
	
	//更新状态
	JARVIS.CONTROLLER.modifyStatus = function(status) {
		var ids = JARVIS.getCheckedValues(JARVIS.CONTROLLER.checkboxItemIdentifer);
		if (ids != "") {
			if (confirm("确认要执行此操作吗?")) {
				JARVIS.reqAjax(JARVIS.CONTROLLER.URL.modifyStatus, {keys : ids, status : status}, true, function(response) {
					alert(response[JARVIS.RESPONSE_MESSAGE_KEY]);
					if (response[JARVIS.RESPONSE_STATUS_KEY]) {
						JARVIS.CONTROLLER.search();
					}
				});
			}
		} else {
			window.alert("请选择要操作的数据");
		}
	};
	
	//物理删除
	JARVIS.CONTROLLER.physicsDel = function() {
		eval(JARVIS.CONTROLLER.physicsDelMethod);
	};
	JARVIS.CONTROLLER.defaultPhysicsDelMethod = function() {
		var ids = JARVIS.getCheckedValues(JARVIS.CONTROLLER.checkboxItemIdentifer);
		if (ids != "") {
			if (confirm("确认要执行此操作吗?")) {
				JARVIS.reqAjax(JARVIS.CONTROLLER.URL.del, {keys : ids, status : status}, true, function(response) {
					alert(response[JARVIS.RESPONSE_MESSAGE_KEY]);
					if (response[JARVIS.RESPONSE_STATUS_KEY]) {
						JARVIS.CONTROLLER.search();
					}
				});
			}
		} else {
			window.alert("请选择要操作的数据");
		}
	};
})();

/**
 * JARVIS.CONTROLLER.URL 组件
 * @author cdlijunlin
 */
JARVIS.registerNamespace("JARVIS.CONTROLLER.URL");
(function(){
	
	/** 首页URL*/
	JARVIS.CONTROLLER.URL.index;
	/** 分页查询URL*/
	JARVIS.CONTROLLER.URL.selectPage;
	/** 添加URL*/
	JARVIS.CONTROLLER.URL.add;
	/** 编辑URL*/
	JARVIS.CONTROLLER.URL.edit;
	/** 保存URL*/
	JARVIS.CONTROLLER.URL.save;
	/** 更新状态URL*/
	JARVIS.CONTROLLER.URL.modifyStatus;
	/** 删除URL*/
	JARVIS.CONTROLLER.URL.del;
	/** 详细URL*/
	JARVIS.CONTROLLER.URL.view;
	/** 检索URL*/
	JARVIS.CONTROLLER.URL.search;
	
	/**
	 * 组件初始化
	 */
	JARVIS.CONTROLLER.URL.init = function() {
		JARVIS.CONTROLLER.URL.index = JARVIS.CONTROLLER.URL.generateFullUrl("/");
		JARVIS.CONTROLLER.URL.selectPage = JARVIS.CONTROLLER.URL.generateFullUrl("/selectPage");
		JARVIS.CONTROLLER.URL.add = JARVIS.CONTROLLER.URL.generateFullUrl("/add");
		JARVIS.CONTROLLER.URL.edit = JARVIS.CONTROLLER.URL.generateFullUrl("/edit-");
		JARVIS.CONTROLLER.URL.save = JARVIS.CONTROLLER.URL.generateFullUrl("/save");
		JARVIS.CONTROLLER.URL.modifyStatus = JARVIS.CONTROLLER.URL.generateFullUrl("/modifyStatus");
		JARVIS.CONTROLLER.URL.del = JARVIS.CONTROLLER.URL.generateFullUrl("/delete");
		JARVIS.CONTROLLER.URL.view = JARVIS.CONTROLLER.URL.generateFullUrl("/view-");
		JARVIS.CONTROLLER.URL.search = JARVIS.CONTROLLER.URL.generateFullUrl("/search");
	};
	
	/**
	 * 生成全路径URL
	 */
	JARVIS.CONTROLLER.URL.generateFullUrl = function(methodUrl) {
		return JARVIS.contextPath + JARVIS.currentUrl + methodUrl;
	};
})();