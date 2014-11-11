/**
 * ####################################################################################################
 * ### ---PluginName: jquery-freeze-beta-0.9.1.js													###
 * ####################################################################################################
 * ### FirstEditDate: 2014年09月07日 18:23:06															###
 * ### -LastEditDate: 2014年11月11日 15:08:07															###
 * ### -------Author: Yzw																			###
 * ### --Description: ...																			###
 * ####################################################################################################
 */ 
var _FREEZE_ARRAY = new Array();
var _SCROLL_SELF_WIDTH = 17;
var _F_MSG; $(function(){ _F_MSG = new FMsg(); });

(function($){
	$.fn.extend({
		freeze: function(options){
			var setting = $.extend({
				row: 1,
				col: 1,
				onOff: "on"
			}, options);
			// 构建冻结对象
			var freeze = new Freeze($(this), setting);
			// 添加到全局变量 _FREEZE_ARRAY
			_FREEZE_ARRAY[_FREEZE_ARRAY.length] = freeze;
			// 初始化
			freeze.init();
			// 页面滚动条事件
			$(document).scroll(function(){
				//_FREEZE_ARRAY.each(function(i, e){
					freeze.scrolling();
				//});
			});
			/*
			document.documentElement.onscroll = function(){
				_FREEZE_ARRAY.each(function(i, e){
					$(e).scrolling();
				});
			}
			*/
			// 浏览器窗体变化时调整冻结层位置及大小
			$(window).resize(function(){
				//_FREEZE_ARRAY.each(function(i, e){
					freeze.resetting();
				//});
			});
		}
	});
})(jQuery);

/**
 * 定义冻结对象
 */
var Freeze = function(invoker, setting){
	var freeze = new Object();
	freeze.invoker = invoker; // 调用者
	freeze.setting = setting; // 参数设置
	/* 检查元素 */
	freeze.checkUp = function(){
		var ac = 0;	// 不符合规则的元素的计数
		invoker.each(function(i, e) {
			var len = $(e).children("table").length;
			if(len != 1){ ac++; }
		});
		if(setting.onOff != "on" || (setting.row < 1 && setting.col < 1)){
			return false;
		}
		if(ac > 0){	
			_F_MSG.show("1000");
			return false;
		}
		return true;
	}
	/* 初始化 */
	freeze.init = function(){
		if(!this.checkUp()){ return; }
		invoker.each(function(i, e) {
			// 防止重复被初始化而生成多次冻结层
			$(e).find("#freezeTop,#freezeTL,#freezeLeft").remove();
			// 定义冻结层
			var freezeTop, freezeLeft, freezeTL;
			/* ========== 获取元素位置 ========== */
			// 当前元素位置
			var currOffsetTop = $(e).offset().top;
			var currOffsetLeft = $(e).offset().left;
			// 冻结行宽度
			var freezeRowWidth = haveVSB($(e)) ? $(e).outerWidth() - _SCROLL_SELF_WIDTH + 0.1 : $(e).outerWidth() + 0.1;
			// 冻结行高度
			var freezeRowHeight = 1;
			$(e).children("table").find("tr:lt(" + setting.row + ")").each(function(i, e) {
				freezeRowHeight += $(e).outerHeight();
			});
			// 冻结列宽度
			var freezeColumnWidth = 1;
			var freezeColnumWidthArr = new Array();
			$(e).children("table").find("tr:first td:lt(" + setting.col + ")").each(function(i, e) {
			   freezeColumnWidth += $(e).outerWidth();
			   freezeColnumWidthArr[i] = $(e).outerWidth();
			});
			/* ========== 复制冻结层 ========== */
			// 上
			var freezeTop = $(e).clone(true);
			var dataRows = $(e).clone(true).find("table tr");
			freezeTop.find("table tr:gt(" + (setting.row - 1) + ")").remove();
			freezeTop.width(freezeRowWidth);
			freezeTop.height(freezeRowHeight);
			freezeTop.css("overflow", "hidden");
			freezeTop.css("position", "absolute");
			freezeTop.css("z-index", "1000");
			freezeTop.css("top", currOffsetTop);
			freezeTop.css("left", currOffsetLeft);
			freezeTop.attr("id", "freezeTop");
			freezeTop.attr("isFreeze", "isFreeze");
			// 左
			freezeLeft = freezeTop.clone(true);
			freezeLeft.width(freezeColumnWidth);
			freezeLeft.find("table:first").width(freezeColumnWidth);
			freezeLeft.height($(e).height() - _SCROLL_SELF_WIDTH);
			freezeLeft.find("table tr").remove();
			dataRows.each(function(i2, e2) {
				$(e2).find("td:gt(" + (setting.col - 1) + ")").remove();
				$(e2).each(function(i3, e3) {
					$(e3).width(freezeColnumWidthArr[i3]);
				});
				freezeLeft.find("table").append($(e2));
			});
			freezeLeft.css("overflow", "hidden");
			freezeLeft.css("position", "absolute");
			freezeLeft.css("z-index", "2000");
			freezeLeft.css("top", currOffsetTop);
			freezeLeft.css("left", currOffsetLeft);
			freezeLeft.attr("id", "freezeLeft");
			freezeLeft.attr("isFreeze", "isFreeze");
			// 左上
			freezeTL = freezeLeft.clone(true);
			var firstColumn = freezeTL.find("table tr td:eq(0)");
			freezeTL.find("table tr:gt(" + (setting.row - 1) + ")").remove();
			freezeTL.width(freezeColumnWidth);
			freezeTL.find("table:first").width(freezeColumnWidth);
			freezeTL.css("position", "absolute");
			freezeTL.css("z-index", "3000");
			freezeTL.css("top", currOffsetTop);
			freezeTL.css("left", currOffsetLeft);
			freezeTL.attr("id", "freezeTL");
			freezeTL.attr("isFreeze", "isFreeze");
			// 添加冻结层
			if(setting.row > 0){
				$(e).append(freezeTop);
			}
			if(setting.col > 0){
				$(e).append(freezeLeft);
			}
			if(setting.row > 0 && setting.col > 0){
				$(e).append(freezeTL);
			}
			// 绑定滚动事件
			$(e).scroll(function(){
				freezeTop.scrollLeft($(e).scrollLeft());
				freezeLeft.scrollTop($(e).scrollTop());
			});
		});
	}
	/* 滚动条滚动改变元素位置 */
	freeze.scrolling = function(){
		invoker.each(function(i, e){
			if($(document).scrollTop() >= $(e).offset().top &&
			   $(document).scrollTop() <= ($(e).offset().top + $(e).height())){
				$(e).find("#freezeTop,#freezeTL").css("left", $(e).offset().left - $(document).scrollLeft());
				$(e).find("#freezeTop,#freezeTL").css("position", "fixed");
				$(e).find("#freezeTop,#freezeTL").css("top", 0);
			}else{
				$(e).find("#freezeTop,#freezeTL").css("position", "absolute");
				$(e).find("#freezeTop,#freezeTL").css("top", $(e).offset().top);
				$(e).find("#freezeTop,#freezeTL").css("left", $(e).offset().left);
			}
		});
	}
	/* 重新调整元素位置及大小 */
	freeze.resetting = function(){
		invoker.each(function(i, e){
			var freezeTop = $(e).find("#freezeTop");
			var freezeTL = $(e).find("#freezeTL");
			var freezeLeft = $(e).find("#freezeLeft");
			/* ========== 获取元素位置 ========== */
			// 当前元素位置
			var currOffsetTop = $(e).offset().top;
			var currOffsetLeft = $(e).offset().left;
			// 冻结行宽度
			var freezeRowWidth = haveVSB($(e)) ? $(e).outerWidth() - _SCROLL_SELF_WIDTH + 0.1 : $(e).outerWidth() + 0.1;
			// 冻结行高度
			var freezeRowHeight = 1;
			$(e).children("table").find("tr:lt(" + setting.row + ")").each(function(i, e) {
				freezeRowHeight += $(e).outerHeight();
			});
			// 冻结列宽度
			var freezeColumnWidth = 1;
			var freezeColnumWidthArr = new Array();
			$(e).children("table").find("tr:first td:lt(" + setting.col + ")").each(function(i, e) {
			   freezeColumnWidth += $(e).outerWidth();
			   freezeColnumWidthArr[i] = $(e).outerWidth();
			});
			/* ========== 调整冻结层 ========== */
			// 上
			freezeTop.width(freezeRowWidth);
			freezeTop.height(freezeRowHeight);
			freezeTop.css("top", currOffsetTop);
			freezeTop.css("left", currOffsetLeft);
			// 左
			freezeLeft.width(freezeColumnWidth);
			freezeLeft.find("table:first").width(freezeColumnWidth);
			freezeLeft.height($(e).height() - _SCROLL_SELF_WIDTH);
			freezeLeft.css("top", currOffsetTop);
			freezeLeft.css("left", currOffsetLeft);
			// 左上
			freezeTL.width(freezeColumnWidth);
			freezeTL.find("table:first").width(freezeColumnWidth);
			freezeTL.css("top", currOffsetTop);
			freezeTL.css("left", currOffsetLeft);
		});
		this.scrolling();
	}
	return freeze;
}

/**
 * 提示信息对象
 */
var FMsg = function(){
	var obj = new Object();
	obj.msgs = new Array();
	obj.msgs["1000"] = "调用元素中有不符合规则的元素，请检查！";
	obj.msgs["1001"] = "";
	obj.msgs["1002"] = "";
	// ...
	obj.show = function(key) {
		alert("FMsg-" + key + ": " + obj.msgs[key]);
	};
	return obj;
}

/**
 * 判断一个元素是否出现竖向滚动条
 * @fullName: haveVerticalScrollBar
 */
function haveVSB(e) {
	var scrollTopVal = $(e).scrollTop();
	$(e).scrollTop(scrollTopVal + 1);
	var result = $(e).scrollTop() > 0 ? true : false;
	$(e).scrollTop(scrollTopVal);
	return result;
}