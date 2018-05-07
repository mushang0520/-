$(function() {
	//获取窗口高度
	var windowH = $(window).height();
	$('.login-bg-img').jqthumb({
		width: '100%',
		height: windowH
	});
});

$(document).ready(function() {
	//创建输入框回车事件
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if(ev.keyCode == 13) {
			checkFormq();
		}
	}
})


//提示信息内容
function createMsg(msg) {
	var str_html = '<font color=\"red\">' + msg + '</font>';
	return str_html;
}

//清除输入的空格
function trim(s) {
	var m = s.match(/^\s*(\S+(\s+\S+)*)\s*$/);
	return(m == null) ? "" : m[1];
}

//提交表单信息
function checkFormq() {
	var userLoginName = $("#userLoginName").val(); 
	var userLoginPass = $("#password").val();
	if(userLoginName == "" & trim(userLoginName)==""){
		Alert("","用户名不能为空！","");
		$("#userLoginName").attr("value",''); 
		$("#userLoginName").focus();
		return;
	}else if(userLoginPass=="" & trim(userLoginPass)==""){
		Alert("","密码不能为空！","");
		$("#realpwd").attr("value",''); 
		$("#password").attr("value",''); 
		$("#password").focus();
		return;
	}else{
		$.ajax({
			url : $yt_option.base_path + "index/verifyLogin",
			type : 'post',
			async : true,
			data : {
			         "userItcode":$("#userLoginName").val(),
			         "userPassword":$("#password").val()
			     },
			success : function(data) {
				var obj =eval("["+data+"]")[0];
				if(obj.success==0){
					var myurl="index.html"+"?"+"userId="+obj.obj.userId+"&itcode="+obj.obj.itcode+"&systemId="+obj.obj.systemId +"&token="+obj.obj.token;
					window.location.assign(myurl);
					//window.location.href="index.html";
				}else{
					alert(obj.msg);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert(textStatus);
			}
		});
	}
}

/**
 * 重置输入框
 */
function clickReset(){
	$("#userLoginName").val('');
	$("#password").val('');
//	document.forms[0].reset();
	$('.msg-div').text('');
}

//监听页面大小 动态改变背景
$(window).resize(function() {
	var windowH = $(window).height();
	$('.login-bg-img').jqthumb({
		width: '100%',
		height: windowH
	});
});