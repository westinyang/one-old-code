/**
 * ####################################################################################################
 * ### --PluginName: jquery-freeze-alpha.js															###
 * ####################################################################################################
 * ### LastEditDate: 2014年9月7日18:23:06															###
 * ### ------Author: Yzw																			###
 * ### -Description: ...																			###
 * ####################################################################################################
 */
var _INVOKER;
var scrollSelfWidth = 17;

(function($){
	 $.fn.extend({
		freeze: function(options){
			var settings = $.extend({
				row: 1,
				col: 1,
				onOff: "on"
			}, options);
			/* 检查元素 */
			var anomalyCount = 0;
			$(this).each(function(i, e) {
				var len = $(e).children("table").length;
				if(len != 1){
					anomalyCount++;
				}
			});
			if(settings.onOff == "off"){
				return;
			}
			if(anomalyCount > 0){
				// @error
				alert("ERROR-1000：调用元素中有不符合规则的元素，请检查。");
				return;
			}
			if(settings.row < 1 && settings.col < 1){
				return;
			}
			
			/* 应用 */
			var _INVOKER = $(this);
			$(this).each(function(i, e) {
				// 定义冻结层
				var freezeTop, freezeLeft, freezeTL;
				// 当前元素位置
				var currOffsetTop = $(e).offset().top;
				var currOffsetLeft = $(e).offset().left;
				var freezeRowWidth = 
						haveVerticalScrollBar($(e)) ? $(e).outerWidth() - scrollSelfWidth + 0.1 : $(e).outerWidth() + 0.1;
				var freezeRowHeight = 1;
				$(e).children("table").find("tr:lt(" + settings.row + ")").each(function(i, e) {
                    freezeRowHeight += $(e).outerHeight();
                });
				var freezeColumnWidth = 1;
				var freezeColnumWidthArr = new Array();
				$(e).children("table").find("tr:first td:lt(" + settings.col + ")").each(function(i, e) {
                   freezeColumnWidth += $(e).outerWidth();
				   freezeColnumWidthArr[i] = $(e).outerWidth();
                });

				/* 复制冻结层 */
				// 上
				var freezeTop = $(e).clone(true);
				var dataRows = $(e).clone(true).find("table tr");
				freezeTop.find("table tr:gt(" + (settings.row - 1) + ")").remove();
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
				freezeLeft.height($(e).height() - scrollSelfWidth);
				freezeLeft.find("table tr").remove();
				dataRows.each(function(i2, e2) {
					$(e2).find("td:gt(" + (settings.col - 1) + ")").remove();
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
				freezeLeft.attr("isFreeze", "forever");
				freezeLeft.attr("id", "freezeLeft");
				// 左上
				freezeTL = freezeLeft.clone(true);
				var firstColumn = freezeTL.find("table tr td:eq(0)");
				freezeTL.find("table tr:gt(" + (settings.row - 1) + ")").remove();
				freezeTL.width(freezeColumnWidth);
				freezeTL.find("table:first").width(freezeColumnWidth);
				freezeTL.css("position", "absolute");
				freezeTL.css("z-index", "3000");
				freezeTL.css("top", currOffsetTop);
				freezeTL.css("left", currOffsetLeft);
				freezeTL.attr("id", "freezeTL");
				freezeTL.attr("isFreeze", "isFreeze");
				// 添加冻结层
				$(e).append(freezeTop);
				$(e).append(freezeLeft);
				$(e).append(freezeTL);
				// 绑定滚动事件
				$(e).scroll(function(){
					freezeTop.scrollLeft($(e).scrollLeft());
					freezeLeft.scrollTop($(e).scrollTop());
					// @console
					// $("#testDiv").find("#c" + (i + 4)).html("#.Table" + (i+1) + ": sTop:" + $(e).scrollTop() + "px | sLeft:" + $(e).scrollLeft() + "px");
				});
            });
			
			// 页面滚动条事件
			document.documentElement.onscroll = function(){
				_INVOKER.each(function(i, e){
					// @console
					// $("#testDiv").find("#c1").html("#.DocScrollTop: " + $(document).scrollTop() + "px");
					if($(document).scrollTop() != 0){
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
					}
					/*
					// A test
					// ====================================================================================================
					if($(document).scrollLeft() != 0){
						if($(document).scrollLeft() >= $(e).offset().left &&
						   $(document).scrollLeft() <= ($(e).offset().left + $(e).width())){
							//
							$(e).find("#freezeLeft,#freezeTL").css("position", "fixed");
							$(e).find("#freezeLeft,#freezeTL").css("top", $(e).offset().top);
							$(e).find("#freezeLeft,#freezeTL").css("left", 0);
							$(e).find("#freezeLeft,#freezeTL").css("top", $(e).offset().top - $(document).scrollTop());
						}else{
							$(e).find("#freezeLeft,#freezeTL").css("position", "absolute");
							$(e).find("#freezeLeft,#freezeTL").css("top", $(e).offset().top);
							$(e).find("#freezeLeft,#freezeTL").css("left", $(e).offset().left);
						}
					}
					*/
                });
			}
			$(document).scroll(function(){
				_INVOKER.each(function(i, e){
					// @console
					// $("#testDiv").find("#c1").html("#.DocumentScrollTop: " + $(document).scrollTop());
					if($(document).scrollTop() != 0){
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
					}
                });
			});
			
			// 浏览器窗体变化时调整冻结层位置及大小
			$(window).resize(function(){
				_INVOKER.each(function(i, e){
					var freezeTop = $(e).find("#freezeTop");
					var freezeTL = $(e).find("#freezeTL");
					var freezeLeft = $(e).find("#freezeLeft");
					
					// The positioning layer
					var currOffsetTop = $(e).offset().top;
					var currOffsetLeft = $(e).offset().left;
					var freezeRowWidth = 
							haveVerticalScrollBar($(e)) ? $(e).outerWidth() - scrollSelfWidth + 0.1 : $(e).outerWidth() + 0.1;
					var freezeRowHeight = 1;
					$(e).children("table").find("tr:lt(" + settings.row + ")").each(function(i, e) {
						freezeRowHeight += $(e).outerHeight();
					});
					var freezeColumnWidth = 1;
					var freezeColnumWidthArr = new Array();
					$(e).children("table").find("tr:first td:lt(" + settings.col + ")").each(function(i, e) {
					   freezeColumnWidth += $(e).outerWidth();
					   freezeColnumWidthArr[i] = $(e).outerWidth();
					});
					
					freezeTop.width(freezeRowWidth);
					freezeTop.height(freezeRowHeight);
					freezeTop.css("top", currOffsetTop);
					freezeTop.css("left", currOffsetLeft);
					
					freezeTL.width(freezeColumnWidth);
					freezeTL.find("table:first").width(freezeColumnWidth);
					freezeTL.css("top", currOffsetTop);
					freezeTL.css("left", currOffsetLeft);
					
					freezeLeft.width(freezeColumnWidth);
					freezeLeft.find("table:first").width(freezeColumnWidth);
					freezeLeft.height($(e).height() - scrollSelfWidth);
					freezeLeft.css("top", currOffsetTop);
					freezeLeft.css("left", currOffsetLeft);
					
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
				// @console
				// $("#testDiv").find("#c2").html("#.DocWindowSize: " + $(document.body).width() + "px | " + $(document).height() + "px");
				// @console
				// $("#testDiv").find("#c3").html("#.BroWindowSize: " + $(window).width() + "px | " + $(window).height() + "px");
			});

		}
	});
})(jQuery);

/**
 * 判断一个元素是否出现竖向滚动条
 */
function haveVerticalScrollBar(e) {
	var scrollTopVal = $(e).scrollTop();
	$(e).scrollTop(scrollTopVal + 1);
	var result = $(e).scrollTop() > 0 ? true : false;
	$(e).scrollTop(scrollTopVal);
	return result;
}