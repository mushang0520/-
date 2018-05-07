
var logManager = {
	dtree:null,
	getLogInfo:function (){
		$yt_common.pageInfo.config(1,function (pageIndex){
			var resultData = {
				total:0
			};
			var data = $.param({"pageIndexs":pageIndex,"startTime":$("#start-time").val(),"endTime":$("#end-time").val()});
			$.ajax({
				url:'tLogSystemInfo/findByPage',
		        type : 'POST',
		        async: false,
		        data:data,
				success:function (data){
					resultData = data;
					 $(".commen-table tbody").empty();
					$.each(resultData.rows, function(i,n) {
				 		var tr = $('<tr><td>'+n.operatingName+'</td><td>'+n.operatingTimes+'</td><td>'+n.loginIp+'</td><td>'+n.loginPc+'</td><td class="tl">'+n.opercontent+'</td><td><a href="javascript:void(0)" class="show-info">查看</a></td></tr>');
				 		tr.find("a").click(function (){
				 			logManager.getLogDetails(n.pkId);
				 		});
					 	$(".commen-table tbody").append(tr);
					});
					
				}
			});
			
			return resultData;
		},15);
		
	},getLogDetails:function (pkId){//查询日志详细信息
		$.ajax({
			type:"post",
			url:"tLogSystemInfo/getBeanById",
			async:false,
			data:{pkId:pkId},
			success:function(data){
				$(".log-info-details:eq(0)").text(data.operatingName);
				$(".log-info-details:eq(1)").text(data.operatingTime);
				$(".log-info-details:eq(2)").text(data.loginIp);
				$(".log-info-details:eq(3)").text(data.loginPc);
				$(".log-info-details:eq(4)").text(data.opercontent);
				$(".log-info-details:eq(5)").text(data.systemModule);
				$(".log-info-details:eq(6)").text(data.logType);
				$(".log-info-details:eq(7)").text(data.parameters);
	
			}
		});
		$(".log-list").hide();
		$(".log-info").show();
		
	}
}

$(function (){
	var windowHeight = $(window).height();
	$(".list-content").css("min-height",windowHeight-150);
	$(".log-info-content").css("min-height",windowHeight-100);
	
	/**
	 * 初始化列表数据
	 * 
	 */
	logManager.getLogInfo();
	/**
	 *查询按钮 
	 * 
	 * 
	 */
	$(".top-search .select-button").click(function (){
		logManager.getLogInfo();
	});
	/**
	 *重置按钮 
	 * 
	 * 
	 */
	$(".top-search .resize-button").click(function(){
		$(".top-search input").val("");
		logManager.getLogInfo();
	})
	
	/**
	 *返回按钮 
	 * 
	 */
	$(".back-button").click(function (){
		$(".log-info").hide();
		$(".log-list").show();
	});
})