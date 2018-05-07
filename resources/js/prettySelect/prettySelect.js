(function($) {
	$.fn.prettySelect = function(options) { //v1.1.0
			var settings = {
				realNameClass: '', //realName 类名
				nameClass: '', //name 类名
				name: '', //显示的值得name
				realName: '', //隐藏域name
				width: 150, //下拉框宽度
				searchable: false, //是否开启搜索  true || false
				nameVal: '', //name赋值  
				realNameVal: '', //realName赋值
				liEvent: function() {}, //下拉选择列表绑定事件
				fixed: '', //是否显示额外【全部】选项   '' || '全部'
				param: '', //url || json
				initValue: false, //初始赋值 true || false
				el: '', //元素绑定
				holder: ["请选择", "请选择或输入..."] //默认显示的提示
			};
			var reg = /^\[.*\]$/;

			/*===============可修改部分================*/
			var _json = '[ { "ID": "n0Data", "NAME": "没有数据" }]';
			/*===============可修改部分================*/

			var opts = $.extend(settings, options);
			var dom = {};
			var _select_main = ' <div class="wahl-wrap" ><div class="wahl-div"><span class="wahl-span">&#160;</span>' + '<input type="hidden" class="wahl-value' + ' ' + opts.realNameClass + '" name="' + opts.realName + '"><input name="' + opts.name + '" class="wahl-p' + ' ' + opts.nameClass + '" style="border:none;outline:none;"/>' + '<ul class="wahl-ul hide-now" style="display:none;"></ul></div>';
			$(this).empty();
			$(this).append(_select_main);
			dom.wahl = $(this).find('.wahl-div');
			dom.wp = $(this).find('.wahl-p');
			dom.wul = $(this).find('.wahl-ul');
			dom.wspan = $(this).find('.wahl-span');

			/*====================辅助方法====================*/
			var wahl = {
				create: function(dom, obj) { /*创建下拉列表*/
					if (obj.param == null || obj.param.length == 0) {
						obj.param = JSON.parse(_json);
					} else if (typeof obj.param == "string") {
						obj.param = JSON.parse(obj.param);
					}
					if (obj.fixed.length != 0) {
						var extra = '<li class="wahl-key-' + '-' + '">' + obj.fixed + '</li>';
						dom.wul.append(extra);
						dom.wp.val(obj.fixed);
						dom.wul.find('input.wahl-value').val('');
					}
					/*====================可修改部分=====================*/
					$.each(obj.param, function(i, v) {
						var li = '<li class="wahl-key-' + v.ID + '-">' + v.NAME + '</li>';
						obj.initValue && i == 0 && (typeof v.ID == 'number' || v.ID.indexOf('n0Data') == -1) && dom.wp.val(v.NAME) && dom.wahl.find('wahl-value').val(v.ID);
						dom.wul.append(li);
						if (obj.el.length != 0 && obj.initValue && i == 0 && v.ID.indexOf('n0Data') == -1 && v.ID.length != 0) {
							var el = $(obj.el);
							el.length == 1 && el[0].nodeName == 'INPUT' && (el[0].type == 'radio' || el[0].type == 'checkbox') && el.removeAttr('checked') && el.val() == v.ID && el.attr('checked', true);
							el.length == 1 && ((el[0].nodeName == 'INPUT' && el[0].type == 'text' || el[0].type == 'hidden') || el[0].nodeName == 'TEXTAREA') && el.val(v.ID);
							el.length == 1 && (el[0].nodeName != 'INPUT' && el[0].nodeName != 'TEXTAREA') && el.html(v.NAME);
						}
					});
					/*====================可修改部分=====================*/
					dom.wul.find('li').click(obj.liEvent);
					dom.wul.hide();
				},
				setWidth: function(dom, obj) { /*设置宽度*/
					dom.wahl.css('width', obj.width + "px");
					dom.wul.css('width', obj.width + "px");
					dom.wp.css('width', (obj.width - 30) + "px");
					dom.wul.css('left', '-1px');
				},
				init: function(dom, obj) { /*初始化下拉列表*/
					wahl.create(dom, obj);
					wahl.setWidth(dom, obj);
					dom.wp.attr('readonly', true);
					dom.wp.bind('click', function() {
						wahl.position(dom, obj);
					});
					if (obj.nameVal.length != 0) {
						wahl.update(dom, obj);
					}
					wahl.voluation(dom, obj);
				},
				position: function(dom, obj) { /*下拉列表切换状态*/
					var _top = dom.wahl.position().top + dom.wahl.height() + 1;
					var _left = dom.wahl.position().left;
					if (dom.wul.css('display') == 'none') {
						dom.wul.css('zIndex', '4');
						dom.wul.removeClass('hide-now');
						$('.show-now').hide();
						dom.wul.addClass('show-now');
						dom.wul.css({
							left: _left,
							top: _top,
							position: 'absolute'
						});
						dom.wul.show();
						dom.wspan.css('backgroundPosition', '0px 2px');
					} else {
						dom.wul.removeClass('show-now');
						dom.wul.css('zIndex', '1');
						dom.wul.addClass('hide-now');
						dom.wspan.css('backgroundPosition', '-10px 2px');
						dom.wul.css('top', 0);
						dom.wul.hide();
					}
				},
				voluation: function(dom, obj) { //点击赋值
					dom.wul.find('li').each(function(i, v) {
						var id = $(this).attr('class').split('-')[2];
						var val = $(this).text();
						this.prototype = {
							myValue: $(this).attr('class').indexOf('n0Data') != -1 ? "" : id
						};
						$(v).bind('click', function() {
							if ($(this).attr('class').indexOf('n0Data') == -1) {
								id = $(this).attr('class').split('-')[2];
								val = $(this).text();
								dom.wp.val($(this).text());
								dom.wahl.find('input.wahl-value').val(id);
								$(this).siblings().removeClass('selected');
								$(this).addClass('selected');
								dom.wul.hide();
							}
							if (id.length == 0) {
								val = "";
							}
							dom.wul.hide();
							dom.wspan.css('backgroundPosition', '-10px 2px');
							if (obj.el.length != 0) {
								var el = $(obj.el);
								el.length == 1 && el[0].nodeName == 'INPUT' && (el[0].type == 'radio' || el[0].type == 'checkbox') && el.removeAttr('checked') && el.val() == id && el.attr('checked', true);
								el.length == 1 && ((el[0].nodeName == 'INPUT' && el[0].type == 'text' || el[0].type == 'hidden') || el[0].nodeName == 'TEXTAREA') && el.val(id);
								el.length == 1 && (el[0].nodeName != 'INPUT' && el[0].nodeName != 'TEXTAREA') && el.html(val);
							}
						});
					});
				},
				update: function(dom, obj) { //修改赋值
					if (obj.realNameVal.length != 0 && obj.nameVal.length != 0) {
						dom.wahl.find('input.wahl-value').val(obj.realNameVal);
						dom.wp.val(obj.nameVal);
					} else {
						dom.wul.find('li').each(function(i, v) {
							var id = $(this).attr('class').split('-')[2];
							if (id == obj.nameVal) {
								dom.wp.val($(this).text());
								dom.wahl.find('input.wahl-value').val(id);
								$(this).addClass('selected');
							}
						});
					}
				},
				initSearch: function(dom, obj) {
					dom.wul.empty();
					obj = wahl.ajax(obj);
					wahl.create(dom, obj);
					wahl.setWidth(dom, obj);
					wahl.position(dom, obj);
					wahl.voluation(dom, obj);
					$('ul.hide-now').hide();
					dom.wspan.css('backgroundPosition', '-10px 2px');
				},
				search: function(dom, obj) { //实时搜索
					wahl.setWidth(dom, obj);
					dom.wp.bind('keyup', function() {
						obj.keyWord = $(this).val();
						wahl.initSearch(dom, obj);
					}).bind('click', function() {
						obj.keyWord = $(this).val();
						wahl.initSearch(dom, obj);
					});
					dom.wspan.bind('click', function() {
						obj.keyWord = $(this).val();
						wahl.initSearch(dom, obj);
					});
					if (obj.nameVal.length != 0) {
						wahl.update(dom, obj);
					}
				},
				ajax: function(obj) {
					/*===============可修改部分================*/
					var data = {};
					!obj.searchable && (data = {});
					obj.searchable && (data = {
						param: obj.keyWord
					});
					$.ajax({
						type: 'POST',
						url: obj.url,
						cache: false,
						async: false,
						data: data,
						dataType: 'json',
						success: function(data) {
							obj.param = data;
						},
						error: function() {
							obj.param = JSON.parse(_json);
						}
					});
					return obj;
					/*===============可修改部分================*/
				}
			};

			/*===================主要通过这个方法实现下拉类型的判断==================*/
			if (opts.param.length == 0) {
				wahl.init(dom, opts);
				dom.wp.attr('placeholder', opts.holder[0]);
			} else if (opts.searchable == false && !reg.test(opts.param)) { //url 不搜索
				opts.url = opts.param;
				wahl.init(dom, wahl.ajax(opts));
				dom.wp.attr('placeholder', opts.holder[0]);
			} else if (opts.searchable == false && reg.test(opts.param)) { //json 不搜索
				wahl.init(dom, opts);
				dom.wp.attr('placeholder', opts.holder[0]);
			} else if (opts.searchable == true) { //搜索
				opts.url = opts.param;
				wahl.search(dom, opts);
				dom.wp.attr('placeholder', opts.holder[1]);
			};
		}
		/*===================主要通过这个方法实现下拉类型的判断==================*/
	})(jQuery);

$(function() {
	document.body.onclick = function(event) {
		var e = event || window.event;
		var target = e.target || e.srcElement;
		var parentDoc = $(target).next(".show-now").length;
		var tc = target.className;
		if (tc.indexOf('show-now') == -1 && parentDoc <= 0 && tc.indexOf('hide-now') == -1 && tc.indexOf('wahl-span') == -1) {
			$(".show-now").hide();
			$(".show-now").parents('.wahl-wrap').find('.wahl-span').css('backgroundPosition', '-10px 2px');
		}
	};
});