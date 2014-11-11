//====================================================================================================
//###.Plug-inName: jQuery-pwdstrength-1.0 (because of jQuery-1.7.1)
//====================================================================================================
//###.CreateDate: 2014-3-20
//====================================================================================================
//###.LastEditDate: 2014-3-21
//====================================================================================================
//###.Author: Yzw (YoungZHvi)
//====================================================================================================
//###.Description:
//			1)在需要使用该插件的元素上添加vpsid='x'，唯一标识，不允许重复，用来区别不同的密码框所对应的强度显示。
//			2)使用jquery获取相应元素后，调用psv([{options...}])方法进行初始化，参数可选填，有默认值
//			3)position: "bottom", 	// 取值：top,right,bottom,left，默认'bottom'
//			  excursion: 1,			// 相对偏移值，默认1，当position为'bottom'时，偏移值无效
//			  color: "#FFF",		// 字体颜色，默认'#000'
//			  dcolor: "#000",		// 底色，默认'#F0F0F0'
//			  lcolor: "#F66",		// 低强度颜色，默认'#F66'
//			  mcolor: "#FF6",		// 中强度颜色，默认'#FF6'
//			  hcolor: "#6F6"		// 高强度颜色，默认'#6F6'
//			  //注意，在IE6中，最后一个参数后面不要跟','这个符号，否则报错，其他浏览器正常
//			4)调用getSL()方法获取元素的密码强度. NULL：无强度，L：弱，M：中，H：强
//====================================================================================================
//[Begin]
var _prev = "vpsid_";	// 密码强度验证区域的唯一标识前缀
var _strength = "strength";	// 密码强度属性逻辑名
// strength values
var SV = { n: "NULL", l: "L", m: "M", h: "H" };
var _position = "right";	// 记录传递的position，为了在窗体大小改变时重新定位元素位置
var _excursion = 1;			// 记录传递的excursion，为了在窗体大小改变时重新定位元素位置
var ops = {};
// Initial
$(function(){
	window.onresize = function(){
		// 重新定位元素位置
		var vpss = $("[vpsid]");
		$("[vpsid]").each(function(i, e){
			var posis = calcPosition($(e), _position, _excursion);
			setPosition($(e), posis);
		});
	}
});
// Extends
(function($){
	$.fn.extend({
		/**
		 * 使调用者元素拥有密码强度验证
		 * @options 参数值集
		 */
		psv: function(options){
			// 设置默认值
			var settings = $.extend({
				position: "bottom",	// 密码强度验证显示位置，相对于作用元素
				color: "#000",		// 字体颜色
				dcolor: "#F0F0F0",	// 底色
				lcolor: "#F66",		// 低强度颜色
				mcolor: "#FF6",		// 中强度颜色
				hcolor: "#6F6",		// 高强度颜色
				excursion: 1	// 相对位置偏移值，推荐1
			}, options);
			// 记录position & excursion
			_position = settings.position;
			_excursion = settings.excursion;
			ops = settings;
			// 迭代元素
			$(this).each(function(i, e) {
				// 当前迭代元素
				var vpsid = $(this).attr("vpsid");
				$(this).attr(_strength, SV.n);
				var html = 
					"<div id='" + getSid($(this)) + "' class='psv_container'>" +
						"<ul>" +
							"<li class='l_strength'>弱</li>" +
							"<li class='strength_space'>&nbsp;</li>" +
							"<li class='m_strength'>中</li>" +
							"<li class='strength_space'>&nbsp;</li>" +
							"<li class='h_strength'>强</li>" +
						"</ul>" +
					"</div>";
				// 添加元素
				if($("#" + getSid($(this))).length == 0){
					$(this).parent().append(html);
				}
				// 计算位置
				var posis = calcPosition($(this), settings.position, settings.excursion);
				// 设置位置
				setPosition($(this), posis);
				var vps = $("#" + getSid($(e)));
				vps.css("background", settings.dcolor);
				vps.css("color", settings.color);
				
				$(this).focus(function(){
					vps.css("display", "block");
				}).blur(function(){
					vps.css("display", "none");
				}).keyup(function(){
					pwStrength($(this));
				}).blur(function(){
					pwStrength($(this));
				});
				
            });
		},
		/**
		 * 获取调用者元素的密码强度级别
		 * @getSL: get strength level
		 */
		getSL: function(){
			return $(this).attr(_strength);
		}
	});
})(jQuery);

/**
 * 根据作用元素获取对应的密码强度框唯一标识
 * e: elemnt
 */
function getSid(e){
	return _prev + e.attr("vpsid");
}

/**
 * 计算位置
 * e: elemnt 相对元素
 * p: position 相对位置
 * r: excursion 偏移值
 */
function calcPosition(e, p, r){
	var vps = $("#" + getSid($(e)));	// 关联当前元素的密码强度框
	var ew = e.outerWidth(true);		// 当前元素 宽度 -> (content, margin, padding, border)
	var eh = e.outerHeight(true);		// 当前元素 高度 -> (content, margin, padding, border)
	var et = e.offset().top;			// 当前元素 距离顶端距离
	var el = e.offset().left;			// 当前元素 距离左端距离
	var vw = vps.outerWidth(true);		// 关联密码强度框 宽度 -> (content, margin, padding, border)
	var vh = vps.outerHeight(true);		// 关联密码强度框 高度 -> (content, margin, padding, border)
	var top = 0, left = 0;	// 保存计算之后的top & left
	/* 根据position的值计算top & left, 如果该值为'top' 'right' 'left' 'bottom'之外，默认设置为'bottom' */
	switch(p){
		case "top":
			top = et - vh - r;
			left = el;
			vps.css("position", "absolute");
			break;
		case "right":
			top = et;
			left = el + ew + r;
			vps.css("position", "absolute");
			break;
		case "bottom":
			top = et + eh + r;
			left = el;
			vps.css("position", "static");
			break;
		case "left":
			top = et;
			left = el - vw - r;
			vps.css("position", "absolute");
			break;
		default:
			top = et + eh + r;
			left = el;
			vps.css("position", "static");
			break;
	}
	var posis = new Array(2);
	posis[0] = top;
	posis[1] = left;
	return posis;
}

/**
 * 设置位置
 * e: elemnt
 */
function setPosition(e, posis){
	var vps = $("#" + getSid($(e)));
	vps.css("top", posis[0]);
	vps.css("left", posis[1]);
}

//CharMode函数
//测试某个字符是属于哪一类.
function charMode(iN){
	if (iN >= 48 && iN <= 57){ //数字
		return 1;
	}else if (iN >= 65 && iN <= 90){ //大写字母
		return 2;
	}else if (iN >= 97 && iN <= 122){ //小写
		return 4;
	}else{
		return 8; //特殊字符
	}
}

//bitTotal函数
//计算出当前密码当中一共有多少种模式
function bitTotal(num){
	var modes = 0;
	for (i=0;i<4;i++){
		if(num & 1)
			modes++; 
		num>>>=1;
	}
	return modes;
}

//checkStrong函数
//返回密码的强度级别
function checkStrong(sPW){
	if (sPW.length < 6)
		return 0; //密码太短
	var modes = 0;
	for(var i = 0; i < sPW.length; i++){
		//测试每一个字符的类别并统计一共有多少种模式.
		modes |= charMode(sPW.charCodeAt(i));
	}
	return bitTotal(modes);
}

//pwStrength函数
//当用户放开键盘或密码输入框失去焦点时,根据不同的级别显示不同的颜色
function pwStrength(element){
	var pwd = $(element).val();
	var	Lcolor="";
	var Mcolor="";
	var Hcolor="";
	if (pwd==null || pwd==''){
		Lcolor=Mcolor=Hcolor=ops.dcolor;
		$(element).attr(_strength, SV.n);
	}
	else{
		var evel = checkStrong(pwd);
		switch(evel) {
			case 0:
				Lcolor=Mcolor=Hcolor=ops.dcolor;
				$(element).attr(_strength, SV.l);
			case 1:
				Lcolor=ops.lcolor;
				Mcolor=Hcolor=ops.dcolor;
				$(element).attr(_strength, SV.l);
				break;
			case 2:
				Lcolor=Mcolor=ops.mcolor;
				Hcolor=ops.dcolor;
				$(element).attr(_strength, SV.m);
				break;
			default:
				Lcolor=Mcolor=Hcolor=ops.hcolor;
				$(element).attr(_strength, SV.h);
		}
	}
	var vps = $("#" + getSid($(element)));	// 关联当前元素的密码强度框
	vps.find(".l_strength").css("background", Lcolor);
	vps.find(".m_strength").css("background", Mcolor);
	vps.find(".h_strength").css("background", Hcolor);
	return;
}