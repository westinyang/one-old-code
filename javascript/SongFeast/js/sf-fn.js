// JavaScript Document
var GEN_SPEED = 500;
var SONG_PANAL_MAX_HEIGHT = 480;
var SONG_PANAL_MIN_HEIGHT = 72;
var SHRINK_MAX_HEIGHT = SONG_PANAL_MIN_HEIGHT;
var SHRINK_MIN_HEIGHT = SHRINK_MAX_HEIGHT - 30;
var songPanalIsOpen = false;
var tmpListIsOpen = false;

function initSongPanal(){
	setTimeout(showSongPanal, 1000);
	$("#sp_shrink").click(function(){
		if(songPanalIsOpen){ hideSongPanal(); }else{ showSongPanal(); }
	});
	$("#song_tmp_list_title").click(function(){
		var songPannalWidth = $("#song_panal").height();
		if(tmpListIsOpen){ hideTmpList(); }else{ showTmpList(); }
	});
	var SongRowColorRecode;
	$("#song_tmp_list_tab tr").mouseover(function(){
		SongRowColorRecode = $(this).css("color");
		$(this).css("color", "#FFF");
		$(this).css("backgroundColor", "#000");
	}).mouseout(function(){
		$(this).css("color", SongRowColorRecode);
		$(this).css("backgroundColor", "#1B1B1B");
	});
}

function showSongPanal(){
	$("#song_panal").animate({marginLeft: "0px"}, GEN_SPEED, function(){
		$("#sp_shrink").html("<");
		$("#sp_shrink").attr("title", "折叠播放器");
		$("#sp_shrink").css("backgroundColor", "#3B3B3B");
		songPanalIsOpen = true;
	});
}

function hideSongPanal(){
	if(tmpListIsOpen){
		hideTmpList();
	}
	var ml = "-" + ($("#song_panal").width() - $("#sp_shrink").width()) + "px";
	$("#song_panal").animate({marginLeft: ml}, GEN_SPEED, function(){
		$("#sp_shrink").html(">");
		$("#sp_shrink").attr("title", "显示播放器");
		$("#sp_shrink").css("backgroundColor", "#9AE40A");
		songPanalIsOpen = false;
	});
}

function showTmpList(){
	$("#song_panal").animate({height: SONG_PANAL_MAX_HEIGHT + "px"}, GEN_SPEED, function(){});
	$("#song_tmp_list_panal").animate({height: (SONG_PANAL_MAX_HEIGHT - SONG_PANAL_MIN_HEIGHT) + "px"}, GEN_SPEED, function(){});
	$("#sp_shrink").animate({height: SHRINK_MIN_HEIGHT + "px"}, GEN_SPEED);
	$("#sp_shrink").css("line-height", SHRINK_MIN_HEIGHT + 2 + "px");
	tmpListIsOpen = true;
}

function hideTmpList(){
	$("#song_panal").animate({height: SONG_PANAL_MIN_HEIGHT + "px"}, GEN_SPEED, function(){});
	$("#song_tmp_list_panal").animate({height: "0px"}, GEN_SPEED, function(){});
	$("#sp_shrink").animate({height: SHRINK_MAX_HEIGHT + "px"}, GEN_SPEED);
	$("#sp_shrink").css("line-height", SHRINK_MAX_HEIGHT + 2 + "px");
	tmpListIsOpen = false;
}