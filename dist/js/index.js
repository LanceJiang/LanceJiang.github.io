$(function(){
	"use strict";
	$('.times').click(function(){
		$('#myModal').attr("aria-hidden","true").removeClass('modal fade').addClass("modal fade in").css("display","none");
		$(".modal-backdrop").removeClass("fade in").css("display","none");
		$('body').removeClass('modal-open').css("padding-right","0");
	});
})