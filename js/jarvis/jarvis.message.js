/**
 * jarvis.message
 * 
 * @author lijunlin
 * @param $$
 * @param NS
 */
(function($$, NS) {
	var $$_NS = $$.register(NS);
	
	$$_NS.messages = {
			"mask" : "系统正在为您处理数据,请稍候...",
			"requestSuccess" : "操作成功",
			"requestError" : "操作失败",
			"confirm" : "确认要如此操作吗",
			"choice" : "请选择要操作的数据",
			"choiceOnly" : "只能操作一条数据",
			"isExists" : "数据已存在"
	};
	
	$$_NS.datatable = {
			"sLengthMenu" : "每页显示 _MENU_ 条记录",
			"sLengthMenu" : "每页显示 _MENU_ 条记录",
			"sZeroRecords" : "抱歉， 没有找到要查询的数据！",
			"sInfo" : "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
			"sInfoEmpty" : "没有数据",
			"sInfoFiltered" : "(从 _MAX_ 条数据中检索)",
			"oPaginate" : {"sSearch": "搜索:"}
	}
})(GLOBAL_NS, "MESSAGE");