
var positionManager = {
	dtree:null,
	getpositionInfo:function (){
		$yt_common.pageInfo.config(1,function (pageIndex){
			var resultData = {
				total:0
			};
			var data = $.param({"pageIndexs":pageIndex,"positionNameing":$(".top-search .search-name").val()});
			$.ajax({
				url:'tAdmPosition/findByPage',
		        type : 'POST',
		        async: false,
		        data:data,
				success:function (data){
					resultData = data;
					 $(".commen-table tbody").empty();
					$.each(resultData.rows, function(i,n) {
						var stateHtml = '<span class="enable">启用</span>';
						if(n.state==0){
							stateHtml = '<span class="disabled">停用</span>';	
						}
				 		var tr = '<tr><td class="tl"><input  class="positionId" type="hidden" value="'+n.pkId+'"/>'+n.positionNameing+'</td><td class="tl">'+n.positionRemarks+'</td><td>'+n.positionCode+'</td><td>'+stateHtml+'</td></tr>';
					 	$(".commen-table tbody").append(tr);
					});
					
				}
			});
			
			return resultData;
		});
		
	},formVaild:function (elem,positionId){
		var result = true;
		if(elem.find("input[name='positionNameing']").val()==""){
			elem.find("input[name='positionNameing']").next(".msg-text").text("请输入职位名称");
			result = false;
		}else if($("input[name='positionNameing']").val().length>20){
			elem.find("input[name='positionNameing']").next(".msg-text").text("请不要超过20个字");
			result = false;
		}else if(_reg.valiLetterEnNumCh(elem.find("input[name='positionNameing']"))){
			elem.find("input[name='positionNameing']").next(".msg-text").text("请输入汉字、字母或数字");
			result = false;
		}else{
			elem.find("input[name='positionNameing']").next(".msg-text").text("");
		}
		
		
		if(elem.find("input[name='positionRemarks']").val() !="" && $("input[name='positionRemarks']").val().length>100){
			elem.find("input[name='positionRemarks']").next(".msg-text").text("请不要超过100个字");
			result = false;
		}else{
			elem.find("input[name='positionRemarks']").next(".msg-text").text("");
		}
		
		
		
		
		
		return result;
	},vaildPositionCode:function (elem,positionId){
		var result = true;
		if(elem.find("input[name='positionCode']").val()==""){
			elem.find("input[name='positionCode']").next(".msg-text").text("请输入职位CODE");
			result = false;
		}else if($("input[name='positionCode']").val().length>30){
			elem.find("input[name='positionCode']").next(".msg-text").text("请不要超过30个字");
			result = false;
		}else if(_reg.valiLetterEnNum(elem.find("input[name='positionCode']"))){
			elem.find("input[name='positionCode']").next(".msg-text").text("请输入字母或数字");
			result = false;
		}else{
			$.ajax({
				type:"post",
				url:"tAdmPosition/isHavePosiCode",
				async:false,
				data:{posiCode:elem.find("input[name='positionCode']").val(),pkId:positionId},
				success:function(data){
					if(data.posiCodeCount>0){
						elem.find("input[name='positionCode']").next(".msg-text").text("code已存在，请重新输入");
						result = false;
					}else{
						elem.find("input[name='positionCode']").next(".msg-text").text("");
					}
					
				},error:function(data){
					$yt_common.prompt("网络故障,请稍后重试")
				}
			});
			
			
		}
		return result;
	},addpositionInfo:function (){
			var formData = $("#edit-position-info-form").serialize();//表单元素
			var otherFormData = {
				createTimeBy:$yt_common.user_info.userItCode
			}
			formData = $.addParam(formData,otherFormData);
			$.ajax({
			 	cache: false,
			 	type: "POST",								
			 	url:"tAdmPosition/saveBean",
				async : false,
				data:formData,
				success : function(data) {
					if(data.success==0){
						$yt_common.prompt(data.msg);
						positionManager.getpositionInfo();
						$("#edit-position-info").hide();
					}
				}
			}); 
			
	},
	updatepositionInfo:function(){
		var pkId  = $(".commen-table tr.active .positionId").val();
		var formData = $("#edit-position-info-form").serialize();//表单元素
		var otherFormData = {
			pkId:pkId,
			createTimeBy:$yt_common.user_info.userItCode
		}
		formData = $.addParam(formData,otherFormData);
		$.ajax({
		 	cache: false,
		 	type: "POST",								
		 	url:"tAdmPosition/updateBean",
			async : false,
			data:formData,
			success : function(data) {
				if(data.success==0){
					$yt_common.prompt(data.msg);
					positionManager.getpositionInfo();
					$("#edit-position-info").hide();
				}
			}
		}); 
	}
}
	
	

$(function (){
	var windowHeight = $(window).height();
	$(".list-content").css("min-height",windowHeight-200);
	//编辑框获取焦点,清空提示信息
	$("#edit-position-info table.form-conten tr td input").off().on("focus",function(){
		$(this).next(".msg-text").html("");
	});
	/**
	 * 初始化列表数据
	 * 
	 */
	positionManager.getpositionInfo();
	/**
	 *查询按钮 
	 * 
	 * 
	 */
	$(".top-search .select-button").click(function (){
		positionManager.getpositionInfo();
	});
	/**
	 *重置按钮 
	 * 
	 * 
	 */
	$(".top-search .resize-button").click(function(){
		$(".top-search .search-name").val("");
		positionManager.getpositionInfo();
	})
	
	/**
	 *新增修改用户
	 * 
	 */
	$("button.add-position-button,button.update-position-button").click(function (){
		/**
		 *清空旧数据 
		 */
		$(".clear-val").val("");
		$(".clear-html,.msg-text").html("");
		/**
		 *分新增修改绑定数据和方法 
		 * 
		 */
		if($(this).hasClass("add-position-button")){
			$("#edit-position-info .model-title .title-text").text("新增职位");
			/*$("#edit-position-info-form input[name='positionCode']").unbind().bind("blur",function (){
				positionManager.vaildPositionCode($("#edit-position-info-form"),0);
			});*/
					
			
			$(".bottom-btn .confirm").unbind().bind("click",function (){
				positionManager.formVaild($("#edit-position-info-form"),0);
				positionManager.vaildPositionCode($("#edit-position-info-form"),0);
				var vaildValue = positionManager.formVaild($("#edit-position-info-form"),0)&&positionManager.vaildPositionCode($("#edit-position-info-form"),0);
				if(vaildValue){
					positionManager.addpositionInfo();
				}
			});
		}else{
			$("#edit-position-info .model-title .title-text").text("修改职位");
			var activeTrs = $(".commen-table tr.active");
			if(activeTrs.length==0){
				$yt_common.prompt("请选择一条信息进行操作");
				return false;
			}else{
				/**
				 *获取用户信息 
				 */
				var positionNameing = $(".commen-table tr.active td:eq(0)").text();
				var positionRemarks = $(".commen-table tr.active td:eq(1)").text();
				var positionCode = $(".commen-table tr.active td:eq(2)").text();
				
				$("#edit-position-info-form input[name='positionNameing']").val(positionNameing);
				$("#edit-position-info-form input[name='positionRemarks']").val(positionRemarks);
				$("#edit-position-info-form input[name='positionCode']").val(positionCode);
				
				/*$("#edit-position-info-form input[name='positionCode']").unbind().bind("blur",function (){
					positionManager.vaildPositionCode($("#edit-position-info-form"),activeTrs.find(".positionId").val());
				});*/
				
				
				$(".bottom-btn .confirm").unbind().bind("click",function (){
					positionManager.formVaild($("#edit-position-info-form"),activeTrs.find(".positionId").val());
					positionManager.vaildPositionCode($("#edit-position-info-form"),activeTrs.find(".positionId").val());
					var vaildValue = positionManager.formVaild($("#edit-position-info-form"),activeTrs.find(".positionId").val())&&positionManager.vaildPositionCode($("#edit-position-info-form"),activeTrs.find(".positionId").val());
					if(vaildValue){
						positionManager.updatepositionInfo()
					}
				});		
			}
				
		}
		
		
		$("#edit-position-info").show();
	});

	
	/**
	 *删除按钮 
	 *
	 *
	 */
	$(".delete-position-button").click(function (){
		var activeTrs = $(".commen-table tr.active");
		if(activeTrs.length==0){
			$yt_common.prompt("请选择一条信息进行操作");
		}else{
			$yt_common.Alert({
				title:"删除",//标题
				text:"<div style='line-height: 70px;'>数据删除后无法恢复,请确认?<div>",//提示内容
				haveCancelIcon:false,//右上叉号是否显示默认为显示
				confirmFunction:function (){
					$.ajax({
						type:"post",
						url:"tAdmPosition/deleteBeanById",
						data:{id:$(".commen-table tr.active .positionId").val()},
						async:false,
						success:function (data){
							if(data.success==0){
								positionManager.getpositionInfo();
							}
							$yt_common.prompt(data.msg);
						}
					});
				}
			});
		}
	});


	
	$(".bottom-btn .cancel").click(function (){
		$(this).parents(".yt-pop-model,#q-alert-bg").hide();
	})
	
	/**
	 * 停用方法
	 * 
	 * 
	 * */
	$(".disable-button").click(function(){
		var activeTrs = $(".commen-table tr.active");
		if(activeTrs.length==0){
			$yt_common.prompt("请选择一条信息进行操作");
		}else{
			$.ajax({
				type:"post",
				url:"tAdmPosition/outUsed",
				async:true,
				data:{posiId:$(".commen-table tr.active .positionId").val()},
				success:function(data){
					if(data.success==0){
						$(".disable-button").hide();
						$(".enable-button").show();
						$(".commen-table tr.active .enable,.commen-table tr.active .disabled").removeClass("enable").addClass("disabled").text("停用");
					}
					$yt_common.prompt(data.msg);
				}
			});
			
		}
	
	});
	/**
	 *启用方法 
	 * 
	 */
	$(".enable-button").click(function(){
		
		var activeTrs = $(".commen-table tr.active");
		if(activeTrs.length==0){
			$yt_common.prompt("请选择一条信息进行操作");
		}else{
			$.ajax({
				type:"post",
				url:"tAdmPosition/onUsed",
				async:true,
				data:{posiId:$(".commen-table tr.active .positionId").val()},
				success:function(data){
					if(data.success==0){
						$(".disable-button").show();
						$(".enable-button").hide();
						$(".commen-table tr.active .enable,.commen-table tr.active .disabled").addClass("enable").removeClass("disabled").text("启用");
					}
					$yt_common.prompt(data.msg);
				}
			});
			
		}
	
	});
	
	/**
	 * 上传附件
	 * 
	 * 
	 * */
	$("#file").unbind().bind("change",function (e){
		var file = $("#file").val();
		var strFileName=file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1");  //正则表达式获取文件名，不带后缀
		if(strFileName ==""){
			$("#file").val("");
			$("#import-pop-file-button").text("点击上传文件");
		}else{
			var FileExt=file.replace(/.+\./,"");   //正则表达式获取后缀
			var showName=strFileName;
			//先检索是否存在后缀名
			if(strFileName.indexOf(FileExt) == -1){
				 showName = strFileName+"."+FileExt;
			}
			$(this).next("div").text(showName);
			$(this).attr("title",showName);
		}
	});
	
	$("#import-pop-file-button").click(function (){
		$(this).siblings("input[type='file']").click();
	});
	
	/**
	 * 导入按钮
	 * 
	 */
	$(".import-button").click(function (){
		$("#import-pop,#q-alert-bg").show();
		$("#import-pop .import-cancel-button").click(function (){
			$("#import-pop,#q-alert-bg").hide();
		});
		/**
		 * 下载
		 * 
		 * 
		 * 
		 */
		$("#import-pop .download-button").unbind().bind("click",function (){
			var downloadUrl = $yt_option.base_path+"tAdmPosition/download?yitianSSODynamicKey="+$yt_common.getToken();
			$yt_common.ajax_download_file(downloadUrl);
		});
		/**
		 *导入 
		 * 
		 * 
		 */
		$("#import-pop .import-confirm-button").click(function(){
			var param= {yitianSSODynamicKey:$yt_common.getToken(),createTimeBy:$yt_common.user_info.userItCode};
			var url  = $yt_option.base_path + "tAdmPosition/upload?"+$.param(param);
			//判断是否选择文件
			if($("input.file-button").val()==""){
				$yt_common.prompt("请选择文件");  
				return false;
			}
			$.ajaxFileUpload({
	      		url : url,
	      			type : "post",
	      			dataType:'json',
	      			fileElementId : 'file',
	      			success : function(data, textStatus) {
	      				var msg = jQuery.parseJSON(data).obj;
	      				//导入详情信息
	      				if(msg!=null && msg!=""){
	      					//总数量
							$("#import-detail .into-num").text(msg.all);
							//新增数量
							$("#import-detail .add-info-num").text(msg.add);
							//修改数量
							$("#import-detail .update-info-num").text(msg.update);
							//失败数量
							$("#import-detail .erro-info-num").text(msg.errCount);
							$("#import-detail .import-info-list tbody").empty();
							var trStr ="";
							if(msg.errCount>0){
								if(msg.errData !="" && msg.errData.length>0){
									$.each(msg.errData, function(i,n) {
										trStr='<tr>'
										     +'<td align="center"><div style="width:34px">'+(i+1)+'</div></td>'
										     +'<td class="pad"><div style="width:215px">'+n.positionNameing+'</div></td>'
										     +'<td class="pad"><div style="width:212px">'+n.positionRemarks+'</div></td>'
										     +'<td align="center"><div style="width:31px">'+n.positionCode+'</div></td>'
										     +'<td class="pad"><div style="width:265px">'+n.errMsg+'</div></td>'
										     +'</tr>';
										$("#import-detail .import-info-list tbody").append(trStr);
									});
								}
							}
	      				}
						//显示导入详情弹出框
						$("#import-detail").show();
						
	      				if(jQuery.parseJSON(data).success ==0){
	      					positionManager.getpositionInfo();
							$("#import-pop,#q-alert-bg").hide();
							$("#file").val("");
							$("#import-pop-file-button").text("点击上传文件");
	      				}else{
	      					$("#import-pop,#q-alert-bg").hide();
	      					//显示失败模块
							$("#import-detail .error-data,#import-detail .import-info-list,.hid-thead").show();
	      				}
	      				getDivPosition($(".import-detail-model .model-midd-cont"));
	      				
 					},  
	                error: function (data, status, e)//服务器响应失败处理函数  
	                {  
	                   $yt_common.prompt("文件上传失败");  
	                }
	            });  
			
		});
		//点击关闭按钮
		$(".import-detail-model button.close-btn").click(function(){
			$(".import-detail-model,#q-alert-bg").hide();
			$("#file").attr("title","");
			$("#import-pop-file-button").text("点击上传文件");
		});
		
	});
})
/**
 * 
 * 动态算取div的位置top值left值
 * @param {Object} obj
 */
function getDivPosition(obj){
		var scrollTop = "";
		var scrollLeft = "";
		var q_alert_top="";
		var q_alert_left = ($(window).width()-$(obj).width())/2;
		q_alert_top = ($(window).height()-$(obj).height()+100)/2-80;
		if(q_alert_left>0){
			$(obj).parent().css("left",q_alert_left+"px");
		}else{
			$(obj).parent().css("left","0");
		}
		if(q_alert_top>0){
			$(obj).parent().css("top",q_alert_top+"px");
		}else{
			$(obj).parent().css("top","0px");
		}
		
	}