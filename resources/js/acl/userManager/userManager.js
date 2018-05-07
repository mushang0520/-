
var userManager = {
	dtree:null,
	defualtEmail:"",
	leftTreeData:'',
	/**
	 * 
	 * 初始获取列表数据
	 * @param {Object} deptId 组织ID
	 * @param {Object} deptType  类型
	 */
	getUserInfo:function (deptId,deptType){
		$yt_common.pageInfo.config(1,function (pageIndex){
			//隐藏设置用户名按钮
			$(".top-button button.set-user-name").hide();
			var resultData = {
				total:0
			};
			//获取节点
			if(userManager.leftTreeData!=""){
				if(deptId == '' || deptType ==''){
					var rootNode = $('#dept-tree').tree('getRoot');
					if(rootNode !="" && rootNode!=null){
						//获取子节点
						deptId =rootNode.id;
						deptType =rootNode.attributes.deptType;
					}
				}
			}
			var data = $.param(
				{"pageIndexs":pageIndex,
				"userNameOrRealName":$(".top-search .search-name").val(),
				"deptType":deptType,
				"deptId":deptId
				});
			$.ajax({
				url:'tAdmUser/findByPage',
		        type : 'POST',
		        async: false,
		        data:data,
				success:function (data){
					resultData = data;
					 $(".commen-table tbody").empty();
					 //判断是否有数据
					 if(resultData.rows.length>0){
					 	$.each(resultData.rows, function(i,n) {
							var stateHtml = '<span class="enable">启用</span>';
							if(n.disabled==0){
								stateHtml = '<span class="disabled">停用</span>';	
							}
					 		var tr = '<tr><td><input  class="userId" type="hidden" value="'+n.pkId+'"/><span class="user-code">'+n.userItcode+'</span></td><td style="width: 50px;">'+n.userName+'</td><td class="tl">'+n.compNaming+'</td><td class="tl">'+n.deptNaming+'</td><td class="tl">'+n.posiNaming+'</td><td class="tl">'+n.userEmail+'</td><td>'+stateHtml+'</td></tr>';
						 	$(".commen-table tbody").append(tr);
						});
						//分页显示
					 	$(".user-info-list .page-info.opinion-page").show();
					 }else{
					 	//分页隐藏
					 	$(".user-info-list .page-info.opinion-page").hide();
					 	var noStr = '<tr style="background:#fff !important;"><td align="center" colspan="7" style="padding:40px;">'
							+'<div style="margin-bottom:25px;"><img src="./resources/images/icons/no-data.png"/></div>'
							+'<div style="color:#999;font-size:20px;">暂时没有数据~</div>'
							+'</td></tr>';
					 	$(".commen-table tbody").append(noStr);
					 }	
					 //调用表格点击事件方法
					userManager.tableTrClickEvent();
				}
			});
			return resultData;
		});
		
	},
	/**
	 * 
	 * 
	 * 获取新组织树形
	 * 
	 */
	getNewDeptTree:function(){
		$.ajax({
			type:"post",
			url:"tAdmDept/getDeptByParam",
			data:{systemId:$yt_common.system_id},
			async:false,
			success:function (data){
				var urlFlag="";
				dataObj = data;
				userManager.leftTreeData=data;
			    //要显示的字段
			    var fileds = "id,forShort,deptType,isThisAdmin";
			    if(dataObj!="" && dataObj.length>0){
				    //获取已转为符合treegrid的json的对象
				    var nodes = ConvertToTreeGridJson(dataObj, "pkId", "parentId", fileds);
				    var testData = eval('(' + JSON.stringify(nodes) + ')');
				    if(testData!="" && testData!=null && testData.length>0){
				    	 $("#dept-tree").tree({
				    	data:testData,
				    	animate:true,
				    	onClick:function(node){
					    		//判断是否有权限2没有
					    		/*if(node.attributes.isThisAdmin == "2"){
					    			$("#"+node.domId).removeClass("tree-node-selected");
					    		}else{*/
					    			//调用查询列表方法
									userManager.getUserInfo(node.id,node.attributes.deptType);
									//调用表格点击事件方法
									userManager.tableTrClickEvent();
									//隐藏设置用户名按钮
									$(".top-button button.set-user-name").hide();
					    		/*}*/
					    	},
					    onBeforeExpand:function(node){//节点展开前触发事件
					    	//判断是否是禁用的关闭图标
					    	if(node.iconCls == "tree-folder-close-disable"){
					    		$("#"+node.domId).find("span.tree-icon").removeClass("tree-folder-close-disable");
					    		$("#"+node.domId).find("span.tree-icon").addClass("tree-folder-disable-open");
					    	}
					    },
					    onBeforeCollapse:function(node){//当节点关闭前
					    	//判断是否是禁用的打开图标
					    	if(node.iconCls == "tree-folder-close-disable"){
					    		$("#"+node.domId).find("span.tree-icon").removeClass("tree-folder-disable-open");
					    		$("#"+node.domId).find("span.tree-icon").addClass("tree-folder-close-disable");
					    	}
					    }
					    });
					    //获取根节点
				    	var rootNode = $('#dept-tree').tree('getRoot');
				    	//判断是否有权限
				    	/*if(rootNode.attributes.isThisAdmin == "2"){
				    		$("#"+rootNode.domId).find("span.tree-title").css({"color":"#999","cursor":"default"});
				    	}else{
				    		$("#"+rootNode.domId).find("span.tree-title").css({"color":"#333","cursor":"pointer"});
				    	}*/
				    	//获取子节点
				    	var childNode = $('#dept-tree').tree('getChildren',rootNode.target);
				    	$.each(childNode,function(i,n){
				    		//判断是否有权限2没有
				    		/*if(n.attributes.isThisAdmin == "2"){
				    			$("#"+n.domId).find("span.tree-title").css({"color":"#999","cursor":"default"});
				    		}else{
				    			$("#"+n.domId).find("span.tree-title").css({"color":"#333","cursor":"pointer"});
				    		}*/
				    		if(n.children){
				    		    $("#"+n.domId).find("span.tree-icon").removeClass("tree-folder-child");
				    		}
				    	});
				      }
			    }else{
			    		var noStr = '<tr style="background:#fff !important;"><td align="center" colspan="7" style="padding:40px;">'
							+'<div style="margin-bottom:25px;"><img src="./resources/images/icons/no-data.png"/></div>'
							+'<div style="color:#999;font-size:20px;">暂时没有数据~</div>'
							+'</td></tr>';
					 	$(".commen-table tbody").append(noStr);
			    }
			}
		});
	},
	/**
	 * 新增弹出框中的树形下拉列表
	 * @param {Object} eleId
	 */
	getDeptTree:function (eleId){
		$("#edit-user-info .dtree").remove();
		userManager.dtree = null;
		userManager.dtree  = new dTree(eleId,'userManager.dtree',$yt_option.websit_path+'/website/resources/js/dTree/images/system/dept/');
		if($yt_common.dept_info_data==null){
			 $.ajax({
		 	cache: false,
		 	type: "POST",								
		 	url:"tAdmDept/getDeptByParam",
			async : false,
			success : function(data) {
				 dataObj = data;
				 $yt_common.dept_info_data = data;
				$.each(dataObj, function(i, v) {
				 	var pId ="";
				 	if(v.parentId == 0){
				 		pId="-1";
				 	}else{
				 		pId=v.parentId;
				 	}
				 	if(v.isThisAdmin == "1"){
				 		urlFlag='javascript:userManager.getDeptValue(this,'+v.compId+','+v.id+',\''+v.forShort+'\','+v.deptType+',\''+eleId+'\')';
				 	}else{
				 		urlFlag=""
				 	}
				 	var name =v.forShort;
					userManager.dtree.add({
						id:v.pkId,
						pid:pId,
						name:'<span class="'+(v.isThisAdmin == "2"?'tree-disable-font':'')+'"style="'+(v.deptType==2?"font-size:12px;":'')+'">'+name+'</span>',
						isDisable:v.isThisAdmin,
						url:urlFlag
						});
				}); 
				userManager.dtree.init(userManager.dtree);
			    userManager.dtree.openTo($(".dept-hinput").val(),true,false);
			}
		}); 
		}else{
			dataObj =  $yt_common.dept_info_data;
			$.each(dataObj, function(i, v) {
				 	var pId ="";
				 	if(v.parentId == 0){
				 		pId="-1";
				 	}else{
				 		pId=v.parentId;
				 	}
				 	
				 	if(v.isThisAdmin == "1"){
				 		urlFlag='javascript:userManager.getDeptValue(this,'+v.compId+','+v.id+',\''+v.forShort+'\','+v.deptType+',\''+eleId+'\')';
				 	}else{
				 		urlFlag=""
				 	}
				 	var name =v.forShort;
					userManager.dtree.add({
						id:v.pkId,
						pid:pId,
						name:'<span class="'+(v.isThisAdmin == "2"?'tree-disable-font':'')+'"style="'+(v.deptType==2?"font-size:12px;":'')+'">'+name+'</span>',
						isDisable:v.isThisAdmin,
						url:urlFlag
						});
				}); 
				userManager.dtree.init(userManager.dtree);
			    userManager.dtree.openTo($(".dept-hinput").val(),true,false);
		}
	 
	},
	/**
	 * 下拉树形点击方法
	 * @param {Object} obj
	 * @param {Object} id
	 * @param {Object} name
	 * @param {Object} deptType
	 * @param {Object} eleId
	 */
	getDeptValue:function (obj,compId,id,name,deptType,eleId){
		if(deptType==2){
			$('#'+eleId).siblings("input").val(id);
			//赋值公司ID
			$('#'+eleId).siblings("input").attr("compId",compId);
			$('#'+eleId).hide();
			$('#'+eleId).parent().removeClass("active")
			$('#'+eleId).siblings(".job-dept-pop-model-button,.dept-pop-model-button").text(name);
			$('#'+eleId).parent().next(".msg-text").text("");
		}/*else{
			$('#'+eleId).siblings("input").val(id);
			//赋值公司ID
			$('#'+eleId).siblings("input").attr("compId",compId);
			$('#'+eleId).hide();
			$('#'+eleId).parent().removeClass("active")
			$('#'+eleId).siblings(".job-dept-pop-model-button,.dept-pop-model-button").text(name);
			$('#'+eleId).parent().next(".msg-text").text("");
		}*/
		/**
		 * 调用查询职位信息方法
		 */
		var thisObj = $('#'+eleId).siblings(".job-dept-pop-model-button,.dept-pop-model-button").parent().parent().parent();
		userManager.getGroupList(thisObj.next().find(".group-pop-model-button"));
		$('#'+eleId).parent().next(".msg-text").text("");
	},
	/**
	 * 获取职位信息
	 * @param {Object} obj
	 */
	getGroupList:function (obj){
		//获取选中的组织ID
		var deptId = $(obj).parent().parent().parent().prev().find("input[type='hidden']").attr("compId");
		var ulElement = $(obj).siblings(".group-pop-model,.job-group-pop-model").find("ul");
		var posiName = $(obj).siblings(".group-pop-model,.job-group-pop-model").find(".group-search").val();
		$.ajax({
		 	cache: false,
		 	type: "POST",								
		 	url:"tAdmDept/getUserPosition",
		 	data:{deptId:deptId,posiName:posiName},
			async : false,
			success : function(data) {
				ulElement.empty();
				$.each(data, function(i,n) {
					var groupEle = $('<li>'+n.posiName+'</li>');
					ulElement.append(groupEle);
					groupEle.click(function (){
						$(obj).siblings("input").val(n.posiCode);
						$(obj).text(n.posiName);
						$(obj).siblings(".group-pop-model,.job-group-pop-model").hide();
						$(obj).parent().removeClass("active");
						groupEle.parents(".group-manager.select-button").next(".msg-text").text("");
					});
				});
				
			}
		});
		
		
	},
	formVaildUserItcode:function (){
		var result = false;
		if($(".user-itcode").val()==""){
			$(".user-itcode").next(".msg-text").text("请输入用户名");
		}else if($(".user-itcode").val().length>20){
			$(".user-itcode").next(".msg-text").text("请不要超过20个字");
		}else if(_reg.valiLetterEnNum($(".user-itcode"))){
			$(".user-itcode").next(".msg-text").text("请输入正确的格式");
		}else{
			 $.ajax({
			 	cache: false,
			 	type: "POST",								
			 	url:"tAdmUser/isHaveItcote",
				async : false,
				data:{itcode:$(".user-itcode").val()},
				success : function(data) {
					if(data>0){
						$(".user-itcode").next(".msg-text").text("该用户名已存在")
					}else{
						$(".user-itcode").next(".msg-text").text("");
						$(".user-email").text($(".user-itcode").val()+userManager.defualtEmail);
						result = true;
						
					}
				}
			}); 
			
		}
		return result;
	},
	formVaidUserName:function (){
		var result = false;
		if($(".user-real-name").val()==""){
			$(".user-real-name").next(".msg-text").text("请输入姓名");
		}else if(_reg.valiLetterEnNumCh($(".user-real-name"))){
			$(".user-real-name").next(".msg-text").text("请输入正确的格式");
		}else if($(".user-real-name").val().length>30){
			$(".user-real-name").next(".msg-text").text("请不要超过30个字");
		}else{
			$(".user-real-name").next(".msg-text").text("");
			result = true;
		}
		return result;
		
	},
	formVaidPhone:function (){
		var result = false;
		if($(".user-phone").val()==""){
			$(".user-phone").next(".msg-text").text("请输入手机号");
		}else if(_reg.valiCellPhone($(".user-phone"))){
			$(".user-phone").next(".msg-text").text("请输入正确的手机号格式");
		}else{
			$(".user-phone").next(".msg-text").text("");
			result = true;
		}
		return result;
	},
	formVaidDept:function (){
		var result = false;
		if($(".dept-hinput").val()==""){
			$(".dept-hinput").parent().next(".msg-text").text("请选择部门");
		}else{
			$(".dept-hinput").parent().next(".msg-text").text("");
			result = true;
		}
		return result;
	},
	formVaidGroup:function (){
		var result = false;
		if($(".group-hinput:eq(0)").val()==""){
			$(".group-hinput:eq(0)").parent().next(".msg-text").text("请选择职位");
		}else{
			$(".group-hinput:eq(0)").parent().next(".msg-text").text("");
			result = true;
		}
		return result;
		
	},
	vaidJobInfo:function (){
		var result = true;
		if($(".job-list-dept").length>0){
			if($(".job-list-dept:last .job-dept-hinput").val()==""){
				$(".job-list-dept:last .msg-text").text("请选择兼职部门");
					result = false;
			}else{
				$(".job-list-dept:last .msg-text").text("");
			
			}
			if($(".job-list-group:last .job-group-hinput").val()==""){
				$(".job-list-group:last .msg-text").text("请选择兼职职位");
				result = false;
			}else{
				$(".job-list-group:last .msg-text").text("");
			}
		}
		return result;
	},
	addUserInfo:function (){
			var formData = $("#edit-user-info-form").serialize();//表单元素
			var userEmail = $(".user-email").text();//邮箱
			var addIdDept = $(".dept-hinput").val();//部门
			var addIdPosi = $(".group-hinput").val();//职务
			var mainPosiList = '{"deptId":"' + addIdDept + '","posiCode":"'+addIdPosi+'"}';
			
			var otherPosiList = this.getJobInfo();

			// var otherFormData = {
			// 	userEmail:userEmail,
			// 	mainPosiList:mainPosiList,
			// 	createTimeBy:$yt_common.user_info.pkId,
			// 	updateTimeBy:$yt_common.user_info.pkId,
			// 	otherPosiList:otherPosiList,
			// 	systemId:$yt_common.getSystemId()
			// }
			var otherFormData = {
				userEmail:userEmail,
				mainPosiList:mainPosiList,
        createTimeBy:$yt_common.user_info.pkId,
        updateTimeBy:$yt_common.user_info.pkId,
				otherPosiList:otherPosiList,
				systemId:$yt_common.getSystemId()
			}

			formData = formData + "&"+$.param(otherFormData);
			$.ajax({
			 	cache: false,
			 	type: "POST",								
			 	url:"tAdmUser/saveBean",
				async : false,
				data:formData,
				success : function(data) {
					if(data.success==0){
						$yt_common.prompt(data.msg);
						$("#edit-user-info").hide();
						setTimeout(function(){
							var deptId="";
							var deptType="";
							//获取左侧树形选中的数据
							var  treeSelNode = $("#dept-tree").tree('getSelected');
							//判断是否有选中,有传选中的,没有传根节点
							if(treeSelNode !=null && treeSelNode !=""){
								deptId=treeSelNode.id;
								deptType=treeSelNode.attributes.deptType;
							}else{
								var rootNode = $('#dept-tree').tree('getRoot');
								if(rootNode !="" && rootNode!=null){
									//获取子节点
									deptId =rootNode.id;
									deptType =rootNode.attributes.deptType;
								}
							}
							userManager.getUserInfo(deptId,deptType);
						},10);
					}
				}
			}); 
			
	},
	getJobInfo:function (){
		/**
			 *获取兼职信息 
			 * 
			 **/
			//['{' + '"deptId":"' + addOtherIdDept + '",'+'"posiCode":"'+addOtherIdPosi+'"' + '}'];
			var jobDetpEles = $(".job-list-dept");
			var jobGroupEles = $(".job-list-group");
			var jobDatas= [];
			$.each(jobDetpEles, function(i,n) {
				var deptId =  $(n).find("input[name='deptId']").val();
				var posiCode = $(jobGroupEles[i]).find("input[name='posiCode']").val();
				var jobData = {
					deptId:deptId,
					posiCode:posiCode
				}
				jobDatas.push(jobData);
			});
			
			var otherPosiList = JSON.stringify(jobDatas);
			return otherPosiList;
	},
	/**
	 * 
	 * 修改用户方法
	 * 
	 */
	updateUserInfo:function(){
		var pkId  = $(".commen-table tr.active .userId").val();
		var formData = $("#edit-user-info-form").serialize();//表单元素
		var userEmail = $(".user-email").text();//邮箱
		var addIdDept = $(".dept-hinput").val();//部门
		var addIdPosi = $(".group-hinput").val();//职务
		var mainPosiList = '{"deptId":"' + addIdDept + '","posiCode":"'+addIdPosi+'"}';
		var otherPosiList = this.getJobInfo();
		var otherFormData = {
			userEmail:userEmail,
			mainPosiList:mainPosiList,
			pkId:pkId,
			createTimeBy:$yt_common.user_info.pkId,
			updateTimeBy:$yt_common.user_info.pkId,
			otherPosiList:otherPosiList
		}
		formData = formData + "&"+$.param(otherFormData);
		$.ajax({
		 	cache: false,
		 	type: "POST",								
		 	url:"tAdmUser/updateBean",
			async : false,
			data:formData,
			success : function(data) {
		 		console.log({data})
				if(data.success==0){
					$yt_common.prompt(data.msg);
					$("#edit-user-info").hide();
					setTimeout(function(){
						var deptId="";
						var deptType="";
						//获取左侧树形选中的数据
						var  treeSelNode = $("#dept-tree").tree('getSelected');
						//判断是否有选中,有传选中的,没有传根节点
						if(treeSelNode != null && treeSelNode !=""){
							deptId=treeSelNode.id;
							deptType=treeSelNode.attributes.deptType;
						}else{
							var rootNode = $('#dept-tree').tree('getRoot');
							if(rootNode !="" && rootNode!=null){
								//获取子节点
								deptId =rootNode.id;
								deptType =rootNode.attributes.deptType;
							}
						}
						//调用刷新列表的方法
            userManager.getUserInfo(deptId, deptType);
					},10);
				}
			}
		}); 
	},addJobEle:function (job){
		var deptId = "";
		var deptName = "点击选择部门";
		var posiCode = "";
		var posiName = '点击选择职位';
		if(job){
			deptId = job.deptId;
			deptName = job.deptName;
			posiCode = job.posiCode;
			posiName = job.posiName;
		}
		
		var modelLenth = $(".job-list-dept").length;
		var modelId = "showTreearea"+modelLenth;
		
		
		var jobEle = $('<tr class="job-list-dept">'+
					'<td><div class="form-label">部门：</div></td>'+
					'<td>'+
						'<div class="input-button job-dept-manager select-button" style="position: relative;">'+
							'<input type="hidden" class="job-dept-hinput" value="'+deptId+'" name="deptId" />'+
							'<div class="job-dept-pop-model-button show_hide_div">'+deptName+'</div>'+
							'<div class="job-dept-pop-model hide_div" id="'+modelId+'" >'+
							'</div><span class="job-dept-pop-modul-remove">删除</span>'+
						'</div><div class="msg-text" ></div>'+
					'</td>'+
				'</tr><tr class="job-list-group">'+
					'<td><div class="form-label">职位：</div></td>'+
					'<td>'+
						'<div class="input-button group-manager select-button">'+
							'<input type="hidden" class="job-group-hinput" value="'+posiCode+'" name="posiCode" />'+
							'<div class="job-group-pop-model-button show_hide_div">'+posiName+'</div>'+
							'<div class="job-group-pop-model hide_div" >'+
								'<input type="text" class="group-search" value="" />'+
								'<ul>'+
								'</ul>'+
							'</div>'+
						'</div><div class="msg-text" ></div>'+
					'</td>'+
				'</tr>');
		$(".job-list-bottom").before(jobEle);
		jobEle.find(".job-dept-pop-model-button").click(function (){
			$("#"+modelId).show();
			$("#"+modelId).parent().addClass("active");
			userManager.getDeptTree(modelId);
		});
		jobEle.find(".group-search").keyup(function (){
			userManager.getGroupList(jobEle.find(".job-group-pop-model-button"));
		});
		jobEle.find(".job-group-pop-model-button").click(function (){
			if($("input.job-dept-hinput").val()==""){
				$yt_common.prompt("请先选择部门");
				return false ;
			}
			userManager.getGroupList(jobEle.find(".job-group-pop-model-button"));
			$(this).siblings(".job-group-pop-model").show();
			$(this).parent().addClass("active");
			
		});
	
		
		jobEle.find(".job-dept-pop-modul-remove").click(function (){
			jobEle.remove();
			var h = $("#edit-user-info").children("div").height();
			var w = $(window).height();
			var hh = w-90;
			if((h-68)>w){
				h = w-50;
				$("#edit-user-info>div>div").not(".model-title").css("height",hh);
			}
			var r = (w-h)/2;
			$("#edit-user-info").css({"top":r,"bottom":r});
		})
		
		
		var h = $("#edit-user-info").children("div").height();
		var w = $(window).height();
		var hh = w-90;
		if((h-68)>w){
			h = w-50;
			$("#edit-user-info>div>div").not(".model-title").css("height",hh);
		}
		var r = (w-h)/2;
		$("#edit-user-info").css({"top":r,"bottom":r});
	},getBaseInfo:function (){
		if($yt_common.baseInfo==""){
			$yt_common.prompt("还没有邮箱后缀,请配置基础信息");
			return false ;
		}
		userManager.defualtEmail = $yt_common.baseInfo.userDefaultEmail;
	}
	,
	/**
	 * 表格行点击事件
	 */
	tableTrClickEvent:function(){
		/**
		 * 表格行点击事件
		 */
		$(".list-content table.commen-table tbody tr td").click(function(){
			/**
			 * 判断选中行用户code是否有值
			 */
			if($(this).parent().find("td:eq(0) .user-code").text() == ""){
				//没有显示设置用户名按钮
				$(".top-button button.set-user-name").show();
			}else{
				$(".top-button button.set-user-name").hide();
			}
		});
	}
}
	
	

$(function (){
	var windowHeight = $(window).height();
	$(".list-content").css("min-height",windowHeight-200);
	/**
	 * 编辑框中输入框获取焦点事件
	 */
	$("#edit-user-info table tr td input").focus(function(){
		$(this).next(".msg-text").text("");
	});
	
	//调用主页左侧树形显示
	userManager.getNewDeptTree();
	var deptId="";
	var deptType="";
	 //获取根节点
	if(userManager.leftTreeData !="" && userManager.leftTreeData!=null){
		var rootNode = $('#dept-tree').tree('getRoot');
		if(rootNode !="" && rootNode!=null){
			//获取子节点
			deptId =rootNode.id;
			deptType =rootNode.attributes.deptType;
		}
	}
	/**
	 * 初始化列表数据
	 * 
	 */
	userManager.getUserInfo(deptId,deptType);
	userManager.getBaseInfo();
	//调用表格点击事件方法
	userManager.tableTrClickEvent();
	
	/**
	 * 
	 * 点击设置用户名按钮
	 * 
	 */
	$(".top-button button.set-user-name").off().on("click",function(){
		var activeTrs = $(".commen-table tr.active");
		//显示弹出框 
		$("#set-username-model").show();
		//获取用户真实姓名
		$("#set-username-model .user-name-span").text(activeTrs.find("td:eq(1)").text());
		/**
		 * 点击确定按钮,执行保存用户名操作
		 */
		$("#set-username-model button.confirm").off().on("click",function(){
			var result = false;
			var userName = $("input.set-user-name-inpu").val();
			if(userName!="" && userName.length>30){
				$("input.set-user-name-inpu").next(".msg-text").text("请不要超过30个字");
			}else if(_reg.valiLetterEnNumCh($("input.set-user-name-inpu"))){
			   $("input.set-user-name-inpu").next(".msg-text").text("请输入正确格式");
			}else{
				$("input.set-user-name-inpu").next(".msg-text").text("");
				result = true;
			}
			if(result){
				//执行ajax
				$.ajax({
				 	cache: false,
				 	type: "POST",								
				 	url:"tAdmUser/updateUserNameByUserId",
					async : false,
					data:{id:activeTrs.find(".userId").val(),userName:userName},
					success : function(data) {
						if(data.success==0){
							$yt_common.prompt(data.msg);
							$("#set-username-model").hide();
							setTimeout(function(){
								var deptId="";
								var deptType="";
								//获取左侧树形选中的数据
								var  treeSelNode = $("#dept-tree").tree('getSelected');
								//判断是否有选中,有传选中的,没有传根节点
								if(treeSelNode!=null){
									deptId=treeSelNode.id;
									deptType=treeSelNode.attributes.deptType;
								}else{
									var rootNode = $('#dept-tree').tree('getRoot');
									if(rootNode !="" && rootNode!=null){
										//获取子节点
										deptId =rootNode.id;
										deptType =rootNode.attributes.deptType;
									}
								}
								//调用刷新列表方法
								userManager.getUserInfo(deptId,deptType);
							},10);
						}else{
							$yt_common.prompt(data.msg);
						}
					}
				}); 
			}
		});
		/**
		 * 点击取消事件
		 */
		$("#set-username-model button.cancel").off().on("click",function(){
			$("input.set-user-name-inpu").val("");
			$("#set-username-model,#pop-modle-alert").hide();
		});
	});
	/**
	 *查询按钮 
	 * 
	 * 
	 */
	$(".top-search .select-button").click(function (){
		var deptId="";
		var deptType="";
		//获取左侧树形选中的数据
		var  treeSelNode = $("#dept-tree").tree('getSelected');
		//判断是否有选中,有传选中的,没有传根节点
		if(treeSelNode != null){
			deptId=treeSelNode.id;
			deptType=treeSelNode.attributes.deptType;
		}
		userManager.getUserInfo(deptId,deptType);
	});
	/**
	 *重置按钮 
	 * 
	 * 
	 */
	$(".top-search .resize-button").click(function(){
		$(".top-search .search-name").val("");
		//获取左侧树形选中的数据
		var  treeSelNode = $("#dept-tree").tree('getSelected');
		//判断是否有选中,有传选中的,没有传根节点
		if(treeSelNode != null){
			deptId=treeSelNode.id;
			deptType=treeSelNode.attributes.deptType;
		}
		userManager.getUserInfo(deptId,deptType);
	})
	
	/**
	 *新增修改用户
	 * 
	 */
	$("button.add-user-button,button.update-user-button").click(function (){
		/**
		 *清空旧数据 
		 */
		$(".clear-val").val("");
		$(".clear-html,.msg-text").html("");
		
		$(".dept-pop-model-button").html("点击选择部门");
		$(".group-pop-model-button").html("点击选择职位");
		$(".job-list-dept,.job-list-group").remove();
		/**
		 *分新增修改绑定数据和方法 
		 * 
		 */
		if($(this).hasClass("add-user-button")){
			$("#edit-user-info .model-title .title-text").text("新增人员信息");
			$("#edit-user-info .bottom-btn .confirm").unbind().bind("click",function (){
				userManager.formVaildUserItcode();
				userManager.formVaidUserName();
				userManager.formVaidPhone();
				userManager.formVaidDept();
				userManager.formVaidGroup();
				userManager.vaidJobInfo();
				var vaildValue = userManager.formVaildUserItcode()&&userManager.formVaidUserName()&&userManager.formVaidPhone()&&userManager.formVaidDept()&&userManager.formVaidGroup()&&userManager.vaidJobInfo();
				if(vaildValue){
					userManager.addUserInfo();
				}
			});
			$(".user-itcode").replaceWith('<input type="text" class="input user-itcode clear-val" name="userItcode" />');
			$(".user-itcode").focus(function(){
				$(this).next(".msg-text").text("");
			});
		}else{
			$("#edit-user-info .model-title .title-text").text("修改人员信息");
			var activeTrs = $(".commen-table tr.active");
			if(activeTrs.length==0){
				$yt_common.prompt("请选择一条信息进行操作");
				return false;
			}else{
				/**
				 *获取用户信息 
				 */
				$.ajax({
				 	cache: false,
				 	type: "POST",								
				 	url:"tAdmUser/getBeanById",
					async : false,
					data:{id:activeTrs.find(".userId").val()},
					success : function(data) {
						$(".user-itcode").replaceWith('<div class="user-itcode clear-html" style="line-height: 36px;height: 36px;">'+data.userItcode+'</div>');
						$("#edit-user-info-form input[name='userName']").val(data.userName);
						$("#edit-user-info-form input[name='userPhone']").val(data.userPhone);
						$("#edit-user-info-form .user-email").text(data.userEmail);
					}
				}); 
				$.ajax({
				 	cache: false,
				 	type: "POST",								
				 	url:"tAdmUser/getUserDeptAndPosi",
					async : false,
					data:{userId:activeTrs.find(".userId").val()},
					success : function(data) {
						$.each(data, function(i,n) {
							if(n.types == 'MAIN_JOB'){
								$("#edit-user-info-form .dept-pop-model-button").text(n.deptName);
								$("#edit-user-info-form .dept-hinput").val(n.deptId);
								$("#edit-user-info-form .group-pop-model-button").text(n.posiName);
								$("#edit-user-info-form .group-hinput").val(n.posiCode);
							}else if(n.types = "PART_TIME"){
								userManager.addJobEle(n);
							}
						});
					}
				}); 
				
				
				
				$("#edit-user-info .bottom-btn .confirm").unbind().bind("click",function (){
					userManager.formVaidUserName();
					userManager.formVaidPhone();
					userManager.formVaidDept();
					userManager.formVaidGroup();
					userManager.vaidJobInfo();
					var vaildValue = userManager.formVaidUserName()&&userManager.formVaidPhone()&&userManager.formVaidDept()&&userManager.formVaidGroup()&&userManager.vaidJobInfo();
					if(vaildValue){
						userManager.updateUserInfo();
					}
				});		
			}
				
		}
		/**
		 *绑定方法 
		 * 
		 * 
		 */
		/*$(".user-itcode").blur(function (){
			userManager.formVaildUserItcode();
		});
		$(".user-real-name").blur(function (){
			userManager.formVaidUserName();
		});
		$(".user-phone").blur(function (){
			userManager.formVaidPhone();
		});*/
		$("#edit-user-info").show();
	});
	/**
	 *分配角色 
	 * 
	 * 
	 */
	
	$(".set-user-button").click(function (){
		
		var activeTrs = $(".commen-table tr.active");
		var ids = activeTrs.find(".userId").val();
		if(activeTrs.length==0){
			$yt_common.prompt("请选择一条信息进行操作");
		}else{
			$("#set-user-role").show();
			//查询角色
			$.ajax({
			 	cache: false,
			 	type: "POST",								
			 	url:"tAdmUser/getRoleByUser",
				async : false,
				data:{userId:ids,systemId:$("#yt-index-head-sys select").val()},
				success : function(data) {
					$(".role-left-list ul").empty();
					$(".role-right-list ul").empty();	
					$.each(data, function(i,n) {
						var roleElem = $('<li><input type="hidden" value="'+n.id+'"/>'+n.name+'</li>')
						if(n.state==0){
							$(".role-left-list ul").append(roleElem);
						}else{
							$(".role-right-list ul").append(roleElem);
						}
					});
				}
			}); 
			$(".role-left-list ul li,.role-right-list ul li").on("click",function (){
				$(this).toggleClass("active");
				
			});
		
			
			
			$(".set-role-button .d-right").on("click",function(){
				$(".role-right-list ul").append($(".role-left-list ul li"));
				/*$(".role-right-list ul li").on("dblclick",function (){
					$(this).addClass("active");
					$(".role-left-list ul").append($(this));
				});*/
				
			})
			$(".set-role-button .d-left").on("click",function(){
				$(".role-left-list ul").append($(".role-right-list ul li"));
			})

			$(".set-role-button .right").on("click",function(){
				$(".role-right-list ul").append($(".role-left-list ul li.active"));



			})
			
			$(".set-role-button .left").on("click",function(){
				$(".role-left-list ul").append($(".role-right-list ul li.active"));
			})
			
		}
		
		$(".set-user-role .confirm").click(function (){
			var selectRole = $(".role-right-list ul li");
			var roleOrGroups = "";
			$.each(selectRole, function(i,n) {
				if(i>0){
					roleOrGroups = roleOrGroups+","+$(n).find("input").val();
				}else{
					roleOrGroups = $(n).find("input").val();
				}
			});
			$.ajax({
			 	cache: false,
			 	type: "POST",								
			 	url:"tAdmUser/addRoleByUser",
				async : false,
				data:{ids:ids,roleOrGroups:roleOrGroups,systemId:$("#yt-index-head-sys select").val()},
				success : function(data) {
					if(data.success==0){
						$yt_common.prompt(data.msg);
						$("#set-user-role").hide();
					}
					
				}
			});
		});
	});
	
	/**
	 *删除按钮 
	 *
	 *
	 */
	$(".delete-user-button").click(function (){
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
						url:"tAdmUser/deleteBeanById",
						data:{id:$(".commen-table tr.active .userId").val()},
						async:false,
						success:function (data){
							if(data.success==0){
								var deptId="";
								var deptType="";
								//获取左侧树形选中的数据
								var  treeSelNode = $("#dept-tree").tree('getSelected');
								//判断是否有选中,有传选中的,没有传根节点
								if(treeSelNode != null ){
									deptId=treeSelNode.id;
									deptType=treeSelNode.attributes.deptType;
								}else{
									var rootNode = $('#dept-tree').tree('getRoot');
									if(rootNode !="" && rootNode!=null){
										//获取子节点
										deptId =rootNode.id;
										deptType =rootNode.attributes.deptType;
									}
								}
								userManager.getUserInfo(deptId,deptType);
							}
							$yt_common.prompt(data.msg);
						}
					});
				}
			});
		}
	});
	/**
	 *修改密码 
	 * 
	 */
	$(".update-pwd-button").click(function (){
		var activeTrs = $(".commen-table tr.active");
		if(activeTrs.length==0){
			$yt_common.prompt("请选择一条信息进行操作");
		}else{
			$("#resite-pwd,#q-alert-bg").show();
			$("#resite-pwd .alert-right-button").click(function (){
				$("#resite-pwd,#q-alert-bg").hide();
			});
			$("#resite-pwd .alert-left-button").click(function (){
				$.ajax({
					type:"post",
					url:"tAdmUser/updatePassword",
					async:true,
					data:{pkId:activeTrs.find(".userId").val(),systemId:$("#yt-index-head-sys select").val()},
					success:function(data){
						if(data.success==0){
							$("#resite-pwd").hide();
							$("#resite-pwd,#q-alert-bg").hide();
						}
						$yt_common.prompt(data.msg);
					}
				});
			});
			
		}
	});
	/**
	 *选择部门 
	 * 
	 */
	$('.dept-pop-model-button').click(function (){
		$(this).next(".dept-pop-model").show();
		$(this).parent().addClass("active");
		userManager.getDeptTree("showTreearea");
	});
	/**
	 *选择职务 
	 * 
	 */
	$(".group-pop-model-button").click(function (){
		if($("input.dept-hinput").val()==""){
			$yt_common.prompt("请先选择部门");
			return false ;
		}
		$(this).next(".group-pop-model").show();
		$(this).parent().addClass("active");
		userManager.getGroupList($(".group-pop-model-button"));
	})
	$(".group-search").keyup(function (){
		userManager.getGroupList($(".group-pop-model-button"));
	});
	
	$(".bottom-btn .cancel").click(function (){
		$(this).parents(".yt-pop-model").hide();
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
				url:"tAdmUser/outUsed",
				async:true,
				data:{userId:$(".commen-table tr.active .userId").val()},
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
				url:"tAdmUser/onUsed",
				async:true,
				data:{userId:$(".commen-table tr.active .userId").val()},
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
	$("body").delegate("#file","change",function (e){
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
			var downloadUrl = $yt_option.base_path+"tAdmUser/download?yitianSSODynamicKey="+$yt_common.getToken();
			$yt_common.ajax_download_file(downloadUrl);
		});
		/**
		 *导入 
		 * 
		 * 
		 */
		$("#import-pop .import-confirm-button").unbind().bind("click",function(){
			var param= {yitianSSODynamicKey:$yt_common.getToken(),systemId:$("#yt-index-head-sys select").val(),createTimeBy:$yt_common.user_info.pkId};
			
			var url  = $yt_option.base_path + "tAdmUser/upload?"+$.param(param);
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
										     +'<td align="center"><div style="width:116px;">'+n.userItcode+'</div></td>'
										     +'<td align="center"><div  style="width:116px;">'+n.userName+'</div></td>'
										     +'<td class="pad"><div style="width:131px">'+n.compNaming+'</div></td>'
										     +'<td class="pad"><div style="width:106px">'+n.deptName+'</div></td>'
										     +'<td class="pad"><div style="width:106px">'+n.posiName+'</div></td>'
										     +'<td class="pad"><div style="width:160px">'+n.errMsg+'</div></td>'
										     +'</tr>';
										$("#import-detail .import-info-list tbody").append(trStr);
									});
								}
							}
	      				}
						//显示导入详情弹出框
						$("#import-detail").show();
	      				if(jQuery.parseJSON(data).success==0){
	      					var deptId="";
							var deptType="";
							//获取左侧树形选中的数据
							var  treeSelNode = $("#dept-tree").tree('getSelected');
							//判断是否有选中,有传选中的,没有传根节点
							if(treeSelNode !=null && treeSelNode !=""){
								deptId=treeSelNode.id;
								deptType=treeSelNode.attributes.deptType;
							}
							//调用刷新列表方法
	      					userManager.getUserInfo(deptId,deptType);
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
			//点击关闭按钮
			$(".import-detail-model button.close-btn").click(function(){
				$(".import-detail-model,#q-alert-bg").hide();
				$("#file").attr("title","");
				$("#import-pop-file-button").text("点击上传文件");
			});
		})
		
	});
	
	$(".add-job").click(function (){
		if(userManager.vaidJobInfo()){
			userManager.addJobEle();
		}
		
	})

})
/*将一般的JSON格式转为EasyUI TreeGrid树控件的JSON格式
* @param rows:json数据对象
* @param idFieldName:表id的字段名
* @param pidFieldName:表父级id的字段名
* @param fileds:要显示的字段,多个字段用逗号分隔
*/
function ConvertToTreeGridJson(rows, idFieldName, pidFieldName, fileds) {
    function exists(rows, ParentId) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i][idFieldName] == ParentId)
                return true;
        }
        return false;
    }
    var nodes = [];
    // get the top level nodes
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!exists(rows, row[pidFieldName])) {
            var data = {
                id: row[idFieldName],
                text:'',
                "iconCls":'',
                "attributes":{
					"deptType":'',
					"isThisAdmin":""
				}
            }
            var arrFiled = fileds.split(",");
            for (var j = 0; j < arrFiled.length; j++)
            {
                if (arrFiled[j] != idFieldName)
                    data.text=row[arrFiled[1]];
                    data.attributes.deptType = row[arrFiled[2]];
                    data.attributes.isThisAdmin=row[arrFiled[3]];
                	data.iconCls='tree-root-def';
            }
            if(data!=null){
               nodes.push(data);	
            }
            
        }
    }
    console.info("根目录nodes："+JSON.stringify(nodes));
    /**
     * 子级数据获取
     */
    var toDo = [];
    var treeChildObj={
    	id:'',
    	text:''
    }
    var treeChildStr = "id,text";
    treeChildStr = treeChildStr.split(",");
    for (var i = 0; i < nodes.length; i++) {
        toDo.push(nodes[i]);
    }
    while (toDo.length) {
        var node = toDo.shift(); // the parent node
        // get the children nodes
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row[pidFieldName] == node.id) {
                var child = {
                    id: row[idFieldName],
                    text:'',
                    "state":'',
                    "iconCls":'',
                    "attributes":{
						"deptType":'',
						"isThisAdmin":""
					}
                };
                var arrFiled = fileds.split(",");
                for (var j = 0; j < arrFiled.length; j++) {
                    if (arrFiled[j] != idFieldName) {
                        child.text= row[arrFiled[1]];
                         child.attributes.deptType = row[arrFiled[2]];
                         child.attributes.isThisAdmin=row[arrFiled[3]];
                         
                        if(row[arrFiled[2]] == "1"){
                        	child.state="closed";
                        	/*if(row[arrFiled[3]] == "2"){
                        		child.iconCls="tree-folder-close-disable";
                        	}*/
                        }else{
                        	child.iconCls='tree-folder-child';
                        	//判断是否是管理员
                        	/*if(row[arrFiled[3]] == "1"){
                        		child.iconCls='tree-folder-child';
                        	}else{
                        		child.iconCls='tree-folder-disable';
                        	}*/
                        }
                    }
                }
                if (node.children) {
                    node.children.push(child);
                } else {
                    node.children = [child];
                }
                toDo.push(child);
            }
        }
    }
    return nodes;
};

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

$(window).scroll(function() {
	if($("body").find(".user-hid-theard").length>0){
		$(".user-hid-theard").css("top", $(window).scrollTop()+ 195);
	}
});
