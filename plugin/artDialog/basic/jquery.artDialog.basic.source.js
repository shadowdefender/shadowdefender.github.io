/*
 * artDialog basic
 * Date: 2011-07-14 11:52
 * http://code.google.com/p/artdialog/
 * (c) 2009-2010 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */
 
;(function ($, window, undefined) {

var _oldApi, _tmplEngine,
	_count = 0,
	_$window = $(window),
	_$document = $(document),
	_elem = document.documentElement,
	_isIE6 = !-[1,] && !('minWidth' in _elem.style),
	_isMobile = 'ontouchend' in _elem && !('onmousemove' in _elem)
		|| /(iPhone|iPad|iPod)/i.test(navigator.userAgent),
	_isFixed = !_isIE6 && !_isMobile,
	_expando = $.expando;

var artDialog = function (config, yesFn, noFn) {
	config = config || {};
	var follow, followApi, i,
		buttons = [],
		defaults = artDialog.defaults,
		repeat = artDialog.list[config.id];
	
	// 配置数据校验
	if (repeat) return repeat;
	if (typeof config === 'string' || config.nodeType === 1) config = {content: config, fixed: _isFixed};
	if (!$.isArray(config.button)) config.button = config.button ? [config.button] : [];
	if (!config.id) config.id = _expando + (_count ++);
	if (!_isFixed) config.fixed =  false;
	
	// 合并默认配置
	for (i in defaults) {
		if (config[i] === undefined) config[i] = defaults[i];		
	};
	
	// 吸附元素
	follow = config.follow || this;
	if (typeof follow === 'string') follow = $(follow)[0];
	if (follow.nodeType === 1) {
		followApi = artDialog.list[follow[_expando + 'follow']];
		if (followApi) {
			return followApi.follow(follow).zIndex().focus();
		} else {
			config.follow = follow;
			follow[_expando + 'follow'] = config.id;
		};
	};
	
	// 内置按钮合并到数组
	yesFn = yesFn || config.yesFn;
	noFn = noFn || config.noFn;
	yesFn && config.button.push({
		name: config.yesText,
		callback: yesFn,
		focus: true
	});
	noFn && config.button.push({
		name: config.noText,
		callback: noFn
	});
	
	// zIndex全局配置
	artDialog.defaults.zIndex = config.zIndex;
	
	return artDialog.list[config.id] = _oldApi ?
		_oldApi._init(config, true) : new artDialog.fn._init(config);
};

artDialog.fn = artDialog.prototype = {

	version: 'basic 1.0.0',
	
	_init: function (config, isReset) {
		var that = this;
		
		that.config = config;
		that._isClose = false;
		that._listeners = {};
		that._minWidth = config.minWidth;
		that._minHeight = config.minHeight;
		
		if (!isReset) {
			that._wrap = document.createElement('div');
			that.DOM = {
				wrap: $(that._wrap)
			};
			that._outerTmpl();
		};
		
		that._wrap.style.cssText = 'position:' + (config.fixed ? 'fixed' : 'absolute') + ';left:0;top:0';
		that._wrap.className = config.skin;
		that._innerTmpl();
		
		if (isReset) {
			_oldApi = null;
		} else {
			that._eventProxy();
		};
		
		that.size(config.width, config.height);
		config.follow ? that.follow(config.follow) : that.position();
		config.focus && that.focus();
		config.lock && that.lock();
		that.zIndex(config.zIndex).time(config.time);
		config.initFn && config.initFn.call(that, window);
		
		return that;
	},
	
	/**
	 * 设置内容
	 * @param	{String, HTMLElement, Object}	内容 (可选)
	 * @return	this, HTMLElement				如果无参数则返回内容容器DOM对象
	 */
	content: function (msg) {
		var prev, next, parent, display,
			that = this,
			content = that.DOM.content,
			elem = content[0];
		
		that._elemBack = $.noop;
		
		if (!msg && msg !== 0) {
			return elem;
		} else if (typeof msg === 'string') {
			content.html(msg);
		} else if (msg.nodeType === 1) {
		
			// 让传入的元素在对话框关闭后可以返回到原来的地方
			display = msg.style.display;
			prev = msg.previousSibling;
			next = msg.nextSibling;
			parent = msg.parentNode;
			that._elemBack = function () {
				if (prev && prev.parentNode) {
					prev.parentNode.insertBefore(msg, prev.nextSibling);
				} else if (next && prev.parentNode) {
					next.parentNode.insertBefore(msg, next);
				} else if (parent) {
					parent.appendChild(msg);
				};
				msg.style.display = display;
			};
			
			elem.innerHTML = '';
			elem.appendChild(msg);
			msg.style.display = 'block';
			
		};
		
		that.position();
		
		return that;
	},
	
	/**
	 * 设置标题
	 * @param	{String}			标题内容
	 * @return	this, HTMLElement	如果无参数则返回内容器DOM对象
	 */
	title: function (text) {
		var DOM = this.DOM,
			titleWrap = DOM.titleWrap[0],
			title = DOM.title[0];
		if (text === undefined) {
			return title;
		} else {
			title.innerHTML = text;
		};
		titleWrap.style.display = 'block';
		return this;
	},
	

	/* 位置居中 */
	position: function () {
		var that = this,
			wrap = that.DOM.wrap[0],
			fixed = that.config.fixed,
			dl = fixed ? 0 : _$document.scrollLeft(),
			dt = fixed ? 0 : _$document.scrollTop(),
			ww = _$window.width(),
			wh = _$window.height(),
			ow = wrap.offsetWidth,
			oh = wrap.offsetHeight,
			style = wrap.style;
			
		// 水平居中
		var left = (ww - ow) / 2 + dl;
		
		// 黄金比例垂直居中
		var top = Math.max(Math.min((oh < 4 * wh / 7
		? wh * 0.382 - oh / 2
		: (wh - oh) / 2) + dt, wh - oh + dt), dt);

		style.left = left + 'px';
		style.top = top + 'px';
		return that;
	},
	
	/**
	 *	尺寸
	 *	@param	{Number, String}	宽度
	 *	@param	{Number, String}	高度
	 */
	size: function (width, height) {
		var style = this.DOM.main[0].style;
		
		if (typeof width === 'number') width = width + 'px';
		if (typeof height === 'number') height = height + 'px';
			
		style.width = width;
		style.height = height;
		
		return this;
	},
	
	/** 跟随元素 */
	follow: function (elem) {
	
		if (typeof elem === 'string' || elem && elem.nodeType === 1) {
			elem = $(elem);
		};
		if (!elem || !elem[0] || elem.css('display') === 'none') {
			return this.position();
		};
		
		var that = this,
			fixed = that.config.fixed,
			winWidth = _$window.width(),
			winHeight = _$window.height(),
			docLeft =  _$document.scrollLeft(),
			docTop = _$document.scrollTop(),
			offset = elem.offset(),
			width = elem[0].offsetWidth,
			height = elem[0].offsetHeight,
			left = fixed ? offset.left - docLeft : offset.left,
			top = fixed ? offset.top - docTop : offset.top,
			wrap = that.DOM.wrap[0],
			style = wrap.style,
			wrapWidth = wrap.offsetWidth,
			wrapHeight = wrap.offsetHeight,
			setLeft = left - (wrapWidth - width) / 2,
			setTop = top + height,
			dl = fixed ? 0 : docLeft,
			dt = fixed ? 0 : docTop;
			
		if (setLeft + wrapWidth > winWidth) {
			setLeft = left - wrapWidth + width;
		};
		if (setLeft < dl) {
			setLeft = left;
		};
		if (setTop + wrapHeight > winHeight + dt) {
			setTop = top - wrapHeight;
		};
		
		style.left = setLeft + 'px';
		style.top = setTop + 'px';
		
		that.config.follow = elem;
		return that;
	},
	
	/**
	 * 自定义按钮
	 * @example
				 button({
					name: 'login',
					callback: function () {},
					disabled: false,
					focus: true
				}, .., ..)
	 */
	button: function (/* @augments */) {
		var that = this,
			ags = arguments,
			elem = that.DOM.buttons[0],
			list = $.isArray(ags[0]) ? ags[0] : [].slice.call(ags);
		
		if (!list.length) {
			elem.style.display = 'none';
			return that;
		};
		
		$.each(list, function (i, val) {
			var name = val.name,
				listeners = that._listeners,
				strongButton = 'aui_strongButton',
				isNewButton = !listeners[name],
				button = !isNewButton ?
					listeners[name].elem :
					document.createElement('button');
					
			if (!listeners[name]) listeners[name] = {};
			if (val.callback) listeners[name].callback = val.callback;
			if (val.className) button.className = val.className;
			if (val.focus) {
				that._focus && that._focus.removeClass(strongButton);
				that._focus = $(button).addClass(strongButton);
				that.focus();
			};
			
			button[_expando + 'callback'] = name;
			button.disabled = !!val.disabled;

			if (isNewButton) {
				button.innerHTML = name;
				listeners[name].elem = button;
				elem.appendChild(button);
			};
		});
		
		elem.style.display = 'block';
		
		return that;
	},
	
	/** 关闭对话框 */
	close: function () {
		var that = this,
			DOM = that.DOM,
			wrap = DOM.wrap,
			list = artDialog.list,
			fn = that.config.closeFn;
		
		if (that._isClose) return that;
		that.time();
		if (typeof fn === 'function' && fn.call(that) === false) {
			return that;
		};
		
		that.unlock();
		
		that._elemBack();
		that._timer = that._focus = null;
		wrap[0].style.cssText = 'display:none';
		wrap[0].className = '';
		DOM.center[0].innerHTML = '';
		
		if (artDialog.focus === that) artDialog.focus = null;
		delete list[that.config.id];
		that._isClose = true;
		
		if (!_oldApi) {
			_oldApi = that;
		} else {
			that._uneventProxy();
			wrap.remove();
		};
		
		return that;
	},
	
	/**
	 * 定时关闭
	 * @param	{Number}	单位为秒, 无参数则停止计时器
	 */
	time: function (second) {
		var that = this,
			cancel = that.config.noText,
			timer = that._timer;
			
		timer && clearTimeout(timer);
		
		if (second) {
			that._timer = setTimeout(function(){
				that._trigger(cancel);
			}, 1000 * second);
		};
		
		return that;
	},
	
	/** 给按钮附加焦点 */
	focus: function () {
		var elemFocus, content,
			that = this,
			config = that.config,
			DOM = that.DOM;
			
		elemFocus = that._focus && that._focus[0] || DOM.close[0];
		
		try {
			elemFocus && elemFocus.focus();
		} catch (e) {};
		
		return that;
	},
	
	/** 置顶z-index */
	zIndex: function () {
		var that = this,
			wrap = that.DOM.wrap,
			index = artDialog.defaults.zIndex ++,
			focusElem = artDialog.focus;
			
		wrap.css('zIndex', index);
		that._lockMask && that._lockMask.css('zIndex', index - 1);
		
		// 设置最高层的样式
		if (focusElem) focusElem.DOM.wrap.removeClass('aui_focus');
		artDialog.focus = that;
		wrap.addClass('aui_focus');
		
		return that;
	},
	
	/** 设置屏锁 */
	lock: function () {
		if (this._lock) return this;
		
		var that = this,
			index = artDialog.defaults.zIndex += 2,
			wrap = that.DOM.wrap,
			config = that.config,
			opacity = 'filter:alpha(opacity=' + (config.opacity * 100) + ');opacity:' + config.opacity,
			docWidth = _$window.width(),
			docHeight = _$document.height(),
			lockMaskWrap = that._lockMaskWrap || $(document.body.appendChild(document.createElement('div'))),
			lockMask = that._lockMask || $(lockMaskWrap[0].appendChild(document.createElement('div'))),
			sizeCss = !_isFixed ? 'position:absolute;width:' + docWidth + 'px;height:' + docHeight
				+ 'px' : 'position:fixed;width:100%;height:100%';
		
		wrap.css('zIndex', index);
		
		lockMaskWrap[0].style.cssText = sizeCss + ';z-index:'
		+ (index - 1) + ';top:0;left:0;overflow:hidden;';
		
		lockMask[0].style.cssText = 'height:100%;background:'
		+ config.background + ';' + opacity;
			
		lockMask[0].ondblclick = function () {that.close()};
		
		that._lockMaskWrap = lockMaskWrap;
		that._lockMask = lockMask;
		
		that._lock = true;
		return that;
	},
	
	/** 解开屏锁 */
	unlock: function () {
		var that = this;
		
		if (!that._lock) return;
		that._lockMask[0].ondblclick = null;
		that._lockMaskWrap[0].style.display = 'none';
		that._lock = false;
		if (_oldApi) {
			that._lockMaskWrap.remove();
			that._lockMaskWrap = that._lockMask = null;
		};

		return that;
	},
	
	// 插入修饰结构 （只运行一次）
	_outerTmpl: function () {
		var that = this,
			wrap = that._wrap;
			
		wrap.innerHTML = _tmplEngine('outer', that.config);
		document.body.appendChild(wrap);
		
		that._getDOM(wrap);
	},
	
	// 插入内容区域 （可能运行多次）
	_innerTmpl: function () {
		var that = this,
			config = that.config,
			DOM = that.DOM,
			center = DOM.center[0];
		
		center.innerHTML = _tmplEngine('inner', config);
		that._getDOM(center);
		
		that.button(config.button).content(config.content);
	},
	
	// 获取元素
	_getDOM: function (parent) {
		var i = 0,
			DOM = this.DOM,
			els = parent.getElementsByTagName('*'),
			elsLen = els.length;
			
		for (; i < elsLen; i ++) {
			DOM[els[i].className.split('aui_')[1]] = $(els[i]);
		};
	},
	
	// 按钮事件触发
	_trigger: function (id) {
		var that = this,
			fn = that._listeners[id] && that._listeners[id].callback;
		return typeof fn !== 'function' || fn.call(that) !== false ?
			that.close() : that;
	},
	
	// 事件代理
	_eventProxy: function () {
		var winResize, resizeTimer,
			that = this,
			DOM = that.DOM,
			winSize = _$window.width() * _$window.height();
			
		that._click = function (event) {
			var target = event.target, callbackID;
			
			if (target.disabled) return false; // IE BUG
			
			if (target === DOM.close[0]) {
				that._trigger(that.config.noText);
				return false;
			} else {
				callbackID = target[_expando + 'callback'];
				callbackID && that._trigger(callbackID);
			};
		};
		
		that._mousedown = function () {
			that.zIndex();
		};
		
		winResize = function () {
			var newSize,
				oldSize = winSize,
				elem = that.config.follow;
			
			if ('all' in document) {
				// IE6~7 window.onresize bug
				newSize = _$window.width() * _$window.height();
				winSize = newSize;
				if (oldSize === newSize) return;
			};
			
			
			if (elem) {
				that.follow(elem);
			} else {
				that.position();
			};
		};
		
		that._winResize = function () {
			resizeTimer && clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				winResize();
			}, 40);
		};
		
		// 监听点击
		DOM.wrap.bind('click', that._click).bind('mousedown', that._mousedown);
		
		// 窗口调节事件
		_$window.bind('resize', that._winResize);
	},
	
	// 卸载事件代理
	_uneventProxy: function () {
		var that = this,
			DOM = that.DOM;
		
		DOM.wrap.unbind('click', that._click).unbind('mousedown', that._mousedown);
		_$window.unbind('resize', that._winResize);
	}
	
};

artDialog.fn._init.prototype = artDialog.fn;
$.fn.dialog = $.fn.artDialog = function () {
	var config = arguments;
	this[this.live ? 'live' : 'bind']('click', function (event) {
		artDialog.apply(this, config);
		event.preventDefault();
	});
	return this;
};



/** 最顶层的对话框API */
artDialog.focus = null;



/** 对话框列表 */
artDialog.list = {};



// 微型模板引擎 - JavaScript Micro-Templating
// @see http://ejohn.org/blog/javascript-micro-templating/
_tmplEngine = (function(){
	var cache = {};
	return function tmpl(str, data){
		var fn = !/\W/.test(str) ?
		  cache[str] = cache[str] ||
			tmpl(artDialog.templates[str]) :
		  new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
			"with(obj){p.push('" +
			str
			  .replace(/[\r\t\n]/g, " ")
			  .split("<%").join("\t")
			  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
			  .replace(/\t=(.*?)%>/g, "',$1,'")
			  .split("\t").join("');")
			  .split("%>").join("p.push('")
			  .split("\r").join("\\'")
		  + "');}return p.join('');");
		return data ? fn(data) : fn;
	};
})();



// 全局快捷键
_$document.bind('keydown', function (event) {
	var target = event.target,
		nodeName = target.nodeName,
		rinput = /^INPUT|TEXTAREA$/,
		api = artDialog.focus,
		keyCode = event.keyCode;

	if (!api || !api.config.esc || rinput.test(nodeName)) return;
		
	keyCode === 27 && api._trigger(api.config.noText);
});



/** 模板 */
artDialog.templates = {

	// Template: UI Framework
	outer: [
	'<div class="aui_outer">',
		'<table class="aui_border">',
			'<tbody>',
				'<tr>',
					'<td class="aui_nw"></td>',
					'<td class="aui_n"></td>',
					'<td class="aui_ne"></td>',
				'</tr>',
				'<tr>',
					'<td class="aui_w"></td>',
					'<td class="aui_center"></td>',
					'<td class="aui_e"></td>',
				'</tr>',
				'<tr>',
					'<td class="aui_sw"></td>',
					'<td class="aui_s"></td>',
					'<td class="aui_se"></td>',
				'</tr>',
			'</tbody>',
		'</table>',
	'</div>'].join(''),
	
	// Template: Content Framework
	inner: [
	'<table class="aui_inner">',
		'<tbody>',
			'<tr>',
				'<td class="aui_header">',
					'<div class="aui_titleWrap" <% if (title === false) { %>style="display:none"<% } %>>',
						'<div class="aui_title">',
							'<%=title%>',
						'</div>',
						'<a class="aui_close" href="javascript:/*artDialog*/;"><%=closeText%></a>',
					'</div>',
				'</td>',
			'</tr>',
			'<tr>',
				'<td class="aui_main">',
					'<div class="aui_content" style="padding:<%=padding%>"></div>',
				'</td>',
			'</tr>',
			'<tr>',
				'<td class="aui_footer">',
					'<div class="aui_buttons" style="display:none"></div>',
				'</td>',
			'</tr>',
		'</tbody>',
	'</table>'].join('')

};



/**
 * 默认配置
 * @namespace
 */
artDialog.defaults = {

	content: '<div class="aui_loading"><span>loading..</span></div>',
	title: '\u6d88\u606f',		// 标题. 默认'消息'
	button: null,				// 自定义按钮
	yesFn: null,				// 确定按钮回调函数
	noFn: null,					// 取消按钮回调函数
	yesText: '\u786E\u5B9A',	// 确定按钮文本. 默认'确定'
	noText: '\u53D6\u6D88',		// 取消按钮文本. 默认'取消'
	closeText: '\xd7',			// 关闭按钮文本. 默认'×'
	width: 'auto',				// 内容宽度
	height: 'auto',				// 内容高度
	padding: '20px 25px',		// 内容与边界填充距离
	skin: '',					// 皮肤名(多皮肤共存预留接口)
	initFn: null,				// 对话框初始化后执行的函数
	closeFn: null,				// 对话框关闭执行的函数
	time: null,					// 自动关闭时间
	esc: true,					// 是否支持Esc键关闭
	focus: true,				// 是否支持对话框按钮聚焦
	follow: null,				// 跟随某元素
	lock: false,				// 是否锁屏
	background: '#000',			// 遮罩颜色
	opacity: .7,				// 遮罩透明度
	fixed: false,				// 是否静止定位
	zIndex: 1987				// 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
	
};

window.artDialog = $.dialog = $.artDialog = artDialog;
}((window.jQuery && (window.art = jQuery)) || window.art, this));



