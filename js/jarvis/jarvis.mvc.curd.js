/**
 * JARVIS.MVC.CURD 组件
 * 
 * @author lijunlin
 */
(function($$, NS) {
	var $$_NS = $$.register(NS);
	
	/**
	 * 表单Form名称
	 */
	$$_NS.editFormName;
	
	/**
	 * 按钮条执行方法
	 */
	$$_NS.addMethod;
	$$_NS.editMethod;
	$$_NS.viewMethod;
	$$_NS.searchMethod;
	$$_NS.enableMethod;
	$$_NS.disableMethod;
	$$_NS.delMethod;
	$$_NS.physicsDelMethod;
	
	/**
	 * 校验需要编辑的记录
	 */
	$$_NS.validateSave;
	
	/**
	 * 初始化
	 */
	$$.addConstructor(function() {
		$$_NS.editFormName = "form[name='" + $$.MVC.context["objectIdentifer"] + "EditForm']";
		$$.log("editFormName = " + $$_NS.editFormName);
		
		//绑定按钮条事件
		var methodPrefix = $$.NS_NAME + "." + NS;
		$$_NS.addMethod = methodPrefix + ".defaultAddMethod();";
		$$_NS.editMethod = methodPrefix + ".defaultEditMethod();";
		$$_NS.viewMethod = methodPrefix + ".defaultViewMethod();";
		$$_NS.searchMethod = methodPrefix + ".defaultSearchMethod();";
		$$_NS.enableMethod = methodPrefix + ".defaultEnableMethod();";
		$$_NS.disableMethod = methodPrefix + ".defaultDisableMethod();";
		$$_NS.delMethod = methodPrefix + ".defaultDelMethod();";
		$$_NS.physicsDelMethod = methodPrefix + ".defaultPhysicsDelMethod();";
	});
	
	/**
	 * 全选/反选
	 */
	$$_NS.switchCheckboxCheckedStatus = function() {
		$$.switchCheckboxCheckedStatus($$.TABLE.checkboxIdentifer, $$.TABLE.checkboxItemIdentifer);
	};
	
	/**
	 * 首页
	 */
	$$_NS.index = function() {
		$$.MVC.refresh($$.MVC.URL.index);
	};

	/**
	 * 新增
	 */
	$$_NS.add = function() {
		$$.execute($$_NS.addMethod);
	};
	$$_NS.defaultAddMethod = function() {
		$$.MVC.loadPageToMainFrame($$.MVC.URL.add, {});
	};
	
	/**
	 * 修改
	 */
	$$_NS.edit = function(key) {
		$$.execute($$_NS.editMethod);
	};
	$$_NS.defaultEditMethod = function() {
		var idsStr = $$.getCheckedCheckboxValues($$.TABLE.checkboxItemIdentifer);
		if (idsStr != "") {
			var ids = idsStr.split(",");
			if (ids.length > 1) {
				$$.alert($$.MESSAGE.messages["choiceOnly"]);
			} else {
				$$.MVC.loadPageToMainFrame($$.MVC.URL.edit + ids[0], {});
			}
		} else {
			$$.alert($$.MESSAGE.messages["choice"]);
		}
	};

	/**
	 * 保存
	 */
	$$_NS.save = function() {
		var isValidSaveMethod = $$.isNotEmpty($$_NS.validateSave);
		if (!isValidSaveMethod || (isValidSaveMethod && $$.execute($$_NS.validateSave))) {
			$$.FORM.submit($($$_NS.editFormName), function(response) {
				if (response[$$.MVC.response["status"]]) {
					$$.alert($$.MESSAGE.messages["requestSuccess"]);
					$$.sendDirect($$.MVC.URL.index);
				}
			});
		}
	};
	
	/**
	 * 详细
	 */
	$$_NS.view = function() {
		$$.execute($$_NS.viewMethod);
	};
	$$_NS.defaultViewMethod = function() {
		var idsStr = $$.getCheckedCheckboxValues($$.TABLE.checkboxItemIdentifer);
		if (idsStr != "") {
			var ids = idsStr.split(",");
			if (ids.length > 1) {
				$$.alert($$.MESSAGE.messages["choiceOnly"]);
			} else {
				$$.MVC.loadPageToMainFrame($$.MVC.URL.view + ids[0], {});
			}
		} else {
			$$.alert($$.MESSAGE.messages["choice"]);
		}
	};
	
	/**
	 * 检索
	 */
	$$_NS.search = function() {
		$$.execute($$_NS.searchMethod);
	};
	$$_NS.defaultSearchMethod = function() {
		$$.TABLE.resetTable($$.TABLE.dataTableObject, true);
	};
	
	/**
	 * 启用
	 */
	$$_NS.enable = function() {
		$$.execute($$_NS.enableMethod);
	};
	$$_NS.defaultEnableMethod = function() {
		$$_NS.modifyStatus($$.MVC.status["enabled"]);
	};
	
	/**
	 * 停用
	 */
	$$_NS.disable = function() {
		$$.execute($$_NS.disableMethod);
	};
	$$_NS.defaultDisableMethod = function() {
		$$_NS.modifyStatus($$.MVC.status["disabled"]);
	};
	
	/**
	 * 删除
	 */
	$$_NS.del = function() {
		$$.execute($$_NS.delMethod);
	};
	$$_NS.defaultDelMethod = function() {
		$$_NS.modifyStatus($$.MVC.status["deleted"]);
	};
	
	/**
	 * 更新状态
	 */
	$$_NS.modifyStatus = function(status) {
		var ids = $$.getCheckedCheckboxValues($$.TABLE.checkboxItemIdentifer);
		if (ids != "") {
			if (confirm($$.MESSAGE.messages["confirm"])) {
				var params = {"ids" : ids, "status" : status};
				$$.MVC.doRequest($$.MVC.URL.modifyStatus, params, function(response) {
					$$.alert(response[$$.MVC.response["message"]]);
					if (response[$$.MVC.response["status"]]) {
						$$_NS.search();
					}
				});
			}
		} else {
			$$.alert($$.MESSAGE.messages["choice"]);
		}
	};
	
	/**
	 * 物理删除
	 */
	$$_NS.physicsDel = function(keys) {
		$$.execute($$_NS.physicsDelMethod(keys));
	};
	$$_NS.physicsDel = function() {
		$$.execute($$_NS.physicsDel($$.getCheckedCheckboxValues($$.TABLE.checkboxItemIdentifer)));
	};
	$$_NS.defaultPhysicsDelMethod = function(ids) {
		if (ids != "") {
			if (confirm(confirm($$.MESSAGE.messages["confirm"]))) {
				$$.MVC.doRequest($$.MVC.URL.del, {ids : ids, status : status}, true, function(response) {
					$$.alert(response[$$.MVC.response["message"]]);
					if (response[$$.MVC.response["status"]]) {
						$$_NS.search();
					}
				});
			}
		} else {
			$$.alert($$.MESSAGE.messages["choice"]);
		}
	};
})(GLOBAL_NS, "MVC.CURD");