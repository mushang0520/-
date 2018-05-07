	/* 
    *函数功能：从href获得参数 
    *sHref:   http://www.artfh.com/arg.htm?arg1=d&arg2=re 
    *sArgName:arg1, arg2 
    *return:    the value of arg. d, re 
    */ 
    function GetArgsFromHref(sHref, sArgName) 
    { 
          var args    = sHref.split("?"); 
          var retval = ""; 
        
          if(args[0] == sHref) /*CuPlayer.com参数为空*/ 
          { 
               return retval; /*CuPlayer.com无需做任何处理*/ 
          }  
          var str = args[1]; 
          args = str.split("&"); 
          for(var i = 0; i < args.length; i ++) 
          { 
              str = args[i]; 
              var arg = str.split("="); 
              if(arg.length <= 1) continue; 
              if(arg[0] == sArgName) retval = arg[1]; 
          } 
          return retval; 
    } 
 
 	var loc = location.href;
 	var key = "userId";
 	$yt_common.user_id = GetArgsFromHref(loc,key);
 	key = "systemId";
 	$yt_common.system_id = GetArgsFromHref(loc,key);
 	key = "token";
 	$yt_common.token = GetArgsFromHref(loc,key);
 	key = "itcode";
 	$yt_common.itcode = GetArgsFromHref(loc,key);
  $yt_common.user_info= {
    pkId:$yt_common.user_id,
    token:$yt_common.token,
    itcode:$yt_common.itcode,
    userItcode:$yt_common.itcode
	}
  $.ajax({
		url:$yt_option.base_path + 'index/getSystems',
        type : 'POST',
        data:{userId:$yt_common.user_id},
		success:function (data){
			// var se = $("#system-list");
			// se.empty();
			// $.each(data, function(i,n) {
			// 	var sysInfo = '<option value="'+n.systemId+'" selected>'+n.systemName+'</optnio>';
       //  debugger
			// 	se.append(sysInfo);
			// });
			// $("#system-list option:first").prop("selected", 'selected');
      $("#yt-index-head-sys .nice-select").empty().prepend('<ul class="list"></ul>');
      var se = $("#yt-index-head-sys .list");
      se.empty();
      $.each(data, function(i,n) {
      	var sysInfo = '<li data-value="'+n.systemId+'" class="option selected focus">'+n.systemName+'</li>';
      	se.append(sysInfo);
      });
      $("#yt-index-head-sys .nice-select").prepend('<span class="current">'+data[0].systemName+'</span>');
			se.change(function (){
				$yt_common.init();
				//$("#yt-index-main-nav").html(data);
			});
			
		},
		error: function(textStatus) {
			//错误方法增强处理  
			alert(textStatus);
		}
	});

 	
 	$(".logout-button").click(function(e){
 	    $.ajax({
 	            url: $yt_option.base_path + "index/loginOut",
 	            type: 'post',
 	            async: false,
 	            success: function(data) {
 	                window.location.href = $yt_option.base_path;
 	            }
 	        });
 	})