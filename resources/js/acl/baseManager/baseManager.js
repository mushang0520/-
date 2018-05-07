var baseManager={
	
	getBaseInfo:function (){
			var data =  $yt_common.baseInfo;
			if(data==""){
				$yt_common.getBaseInfo();
				if($yt_common.baseInfo == ""){
					$(".confirm").unbind().bind("click",function (){
						var formData = $("#base-form").serialize();
						var otherData = {
							systemId:$yt_common.getSystemId()
						}
						formData = $.addParam(formData,otherData);
						
						$.ajax({
							type:"post",
							url:"tAdmConfiggration/saveBean",
							async:false,
							data:formData,
							success:function(data){
								if(data.success==0){
									baseManager.getBaseInfo();
									$yt_common.prompt("保存成功");
									$yt_common.getBaseInfo();
								}else{
									$yt_common.prompt(data.msg);
								}
							}
						});
					});
				}else{
					baseManager.getBaseInfo();
				}
			}else{
				$(".base-info-content input[name='logoPath']").val(data.logoPath);
				$(".base-info-content .logo-img").attr("src",$yt_option.base_path+data.logoPath);
				$(".base-info-content input[name='systemName']").val(data.systemName);
				$(".base-info-content input[name='userDefaultPass']").val(data.userDefaultPass);
				$(".base-info-content input[name='userDefaultEmail']").val(data.userDefaultEmail);
				if(data.isEnndSign=="Y"){
					$("#isEnndSign").setRadioState(true);
				}else{
					$("#enndSign").setRadioState(true);
				}
				
				$(".confirm").unbind().bind("click",function (){
					if(baseManager.formVaild()){
						
						var formData = $("#base-form").serialize();
						var otherData = {
							systemId:$yt_common.getSystemId(),
							pkId:data.pkId
						}
						formData = $.addParam(formData,otherData);
						
						$.ajax({
							type:"post",
							url:"tAdmConfiggration/updateBean",
							async:false,
							data:formData,
							success:function(data){
								
								if(data.success==0){
									$yt_common.prompt("保存成功");
									$yt_common.getBaseInfo();
									baseManager.getBaseInfo();
								}else{
									$yt_common.prompt(data.msg);
								}
							}
					});
					}
				});
			}
		
	
	},formVaild:function (){
		var result= true;
		var logoPath = $("#base-form").find("input[name='logoPath']");
		if(logoPath.val()==""){
			logoPath.next(".msg-text").text("请上传LOGO");
			result =  false;
		}else{
			logoPath.next(".msg-text").text("");
		}
		
		
		var systemName = $("#base-form").find("input[name='systemName']");
		
		if(systemName.val()==""){
			systemName.next(".msg-text").text("请填写系统名称");
			result =  false;
		}else if(systemName.val().length>50){
			systemName.next(".msg-text").text("系统名称不得超过50个字符");
			result =  false;
		}else{
			systemName.next(".msg-text").text("");
		}
		
		var userDefaultPass = $("#base-form").find("input[name='userDefaultPass']");
		
		if(userDefaultPass.val()==""){
			userDefaultPass.next(".msg-text").text("请填写人员初始密码");
			result =  false;
		}else if(userDefaultPass.val().length>16){
			userDefaultPass.next(".msg-text").text("人员初始密码不得超过16个字符");
			result =  false;
		}else{
			userDefaultPass.next(".msg-text").text("");
		}
		
		var userDefaultEmail = $("#base-form").find("input[name='userDefaultEmail']");
		
		if(userDefaultEmail.val()==""){
			userDefaultEmail.next(".msg-text").text("请填写默认邮箱");
			result =  false;
		}else if(userDefaultEmail.val().length>50){
			userDefaultEmail.next(".msg-text").text("默认邮箱不得超过50个字符");
			result =  false;
		}else if(_reg.valiEmailPostfix(userDefaultEmail)){
			userDefaultEmail.next(".msg-text").text("请正确填写邮箱格式");
			result =  false;
		}else{
			userDefaultEmail.next(".msg-text").text("");
		}
		
		
		return result;
		
	}
	
}
$(function (){
	var windowHeight = $(window).height();
	$(".list-content").css("min-height",windowHeight-150);
	$(".base-info-content").css("min-height",windowHeight-100);
	
	baseManager.getBaseInfo();
	
	
	$(".cancel").click(function (){
		baseManager.getBaseInfo();
	});
	
	
	/**
	 *上传按钮绑定事件 
	 * 
	 * 
	 */
	$(".base-upload").click(function (){
		$(".file-button").click();
	});
	
	$("body").delegate(".base-info-content .file-button","change",function (obj){
			var param= {yitianSSODynamicKey:$yt_common.getToken(),ajax:1};
			var url  = $yt_option.base_path + "tAscPortraitInfo/addFile?"+$.param(param);
			var file = $(this).val();
			var fileExt=file.replace(/.+\./,"");   //正则表达式获取后缀
			if(fileExt.toUpperCase()!="JPG"&&fileExt.toUpperCase()!="PNG"){
				$("#file").siblings(".msg-text").text("文件格式不正确,请重新上传");
				return false ;
			}
			if(obj.target.files[0].size/1024>500){
				$("#file").siblings(".msg-text").text("文件过大,不超过500Kb,请重新上传");
				return false ;
			}
			$.ajaxFileUpload({
	      		url : url,
	      			type : "post",
	      			dataType:'json',
	      			fileElementId : 'file',
	      			success : function(data, textStatus) {
	      				data = $.parseJSON(data);
      					if(data.success==0){
	      					var img = new Image();//构造JS的Image对象
	      					var imgSrc =$yt_option.base_path+data.msg; 
	      					img.src =imgSrc;
	      					img.onload=function(){
								var w = img.width;
								var h = img.height;
								// if(w / h != 150/60){
								// 	$("#file").siblings(".msg-text").text("图片比例不正确,比例为150*60");
								// 	return false;
								// }
								$yt_common.prompt("图片上传成功");
		      					$("input[name='logoPath']").val(data.msg);
		      					$(".base-info-content .logo-img").attr("src",$yt_option.base_path+data.msg);
		      					$(".file-button").val("");
		      					$("#file").val("");
							};
							
	      				}else{
	      					$yt_common.prompt(data.msg);  
	      				}
 					},  
	                error: function (data, status, e)//服务器响应失败处理函数  
	                {  
	                   $yt_common.prompt("文件上传失败");  
	                }
	            });  
	});
})