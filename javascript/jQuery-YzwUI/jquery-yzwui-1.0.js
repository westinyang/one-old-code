/**
 * ----------------------------------------------------------------------------------------------------
 * jQuery YzwUI Version 1.0
 * ----------------------------------------------------------------------------------------------------
 * @LastEditDate 2014-01-11
 * @...
 * @...
 * @...
 * ----------------------------------------------------------------------------------------------------
 */
(function($){
	/* !... $.msg start */
	var singlton_scherm;
	$.msg = {
		alert : msg_alert,
		prompt : msg_prompt,
		confirm : msg_confirm,
		ext : msg_ext
		// @... some properties
	};
	function msg_alert(options){
		var settings = $.extend({
			title: "提示信息",
			content: "",
			titleAlign: "left",
			contentAlign: "left",
			buttonAlign: "right",
			globalAlign: "none"
			// @... some options
		}, options);
		var html = 
			$("<div class='msg msg_alert'>" + 
				"<div id='msg_title_wrap' class='title_wrap'>" + settings.title + "</div>" + 
				"<div id='msg_content_warp' class='content_warp'>" + settings.content + "</div>" +
				"<div id='msg_control_warp' class='control_warp'>" + 
					"<button id='msg_alert_btn_ok'>确&nbsp;定</button>&emsp;" +
				"</div>" +
			"</div>");
		$("body").append(html);	// #... appended
		$(html).animate({opacity: 1}, "slow", function(){
			
		});
		if("none" == settings.globalAlign){
			$("#msg_title_wrap").css("textAlign", settings.titleAlign);
			$("#msg_content_warp").css("textAlign", settings.contentAlign);
			$("#msg_control_warp").css("textAlign", settings.buttonAlign);
		}else{
			$(html).css("textAlign", settings.globalAlign);
		}
		create_scherm();
		$("#msg_title_wrap").mouseover(function(){
			$(this).css("cursor", "move");
		}).mousedown(function(){
			// @... Implementing move an element for mousedown
			// var top = $("<div style='width:100%; height:100%; background-color:#F6F6F6; position:absolute; top:0px; left:0px'></div>");
			// $(this).append(top);
			// @... some code
			
		}).mouseup(function(){
			// @... Implementing move an element for mouseup
			// @... some code
			
		});
		$("#msg_alert_btn_ok").click(function(){
			html.remove();
			destory_scherm();
			return true;
		});
	}
	function msg_prompt(){
		// @... some code
		
	}
	function msg_confirm(){
		// @... some code
		
	}
	function msg_ext(){
		// @... some code
		
	}
	/* !... $.msg end */
	
	/* !... $.fn.hint() start */
	$.fn.extend({
		hint: function(options){
			var settings = $.extend({
				color: "#666",
				fontStyle: "italic",
				// @... some options
			}, options);
			$(this).each(function(index, element) {
				// recoding old css
				var oldColor = $(this).css("color");
				var oldFontStyle = $(this).css("fontStyle");
				// setting new css
				$(this).css("color", settings.color);
				$(this).css("fontStyle", settings.fontStyle);
				var isModify = false;
                $(this).val($(this).attr("hint"));
				$(this).focus(function(){
					// resetting css
					$(this).css("color", oldColor);
					$(this).css("fontStyle", oldFontStyle);
					if(!isModify){
						$(this).val("");
					}
				}).blur(function(){
					if("" == $(this).val()){
						$(this).val($(this).attr("hint"));
						// setting new css
						$(this).css("color", settings.color);
						$(this).css("fontStyle", settings.fontStyle);
						isModify = false;
					}else{
						isModify = true;
					}
				});
            });
		}
	});
	/* !... $.fn.hint() start */
	
	// ------------------------------------------------------------------------------------------------
	
	// Create a scherm.
	function create_scherm(){
		singlton_scherm = $("<div id='singlton_scherm'></div>");
		$("body").append(singlton_scherm);
	}
	// Destory current scherm.
	function destory_scherm(){
		singlton_scherm.remove();
	}
	
	
	
})(jQuery);