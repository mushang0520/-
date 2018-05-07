

var roleManager = {
	dtree:null,
	getroleInfo:function (){
		$yt_common.pageInfo.config(1,function (pageIndex){
			var resultData = {
				total:0
			};
			$.ajax({
				url:'tAdmRole/findByPage',
		        type : 'POST',
		        async: false,
		        data:{"pageIndexs":pageIndex,"roleNameOrRoleDecal":$(".top-search .search-name").val(),systemId:$yt_common.getSystemId()},
				success:function (data){
					resultData = data;
					 $(".commen-table tbody").empty();
					$.each(resultData.rows, function(i,n) {
						var stateHtml = '<span class="enable">启用</span>';
						if(n.state==0){
							stateHtml = '<span class="disabled">停用</span>';	
						}
						
				 		var tr = '<tr><td class="tl"><input  class="roleId" type="hidden" value="'+n.pkId+'"/>'+n.roleName+'</td><td class="tl">'+n.roleDesc+'</td><td>'+stateHtml+'</td>';
					 	$(".commen-table tbody").append(tr);
					});
				}
			});
			return resultData;
		});
		
	},
	getDeptValue:function (obj,id,name,deptType,eleId){
		if(deptType==2){
			$('#'+eleId).siblings("input").val(id);
			$('#'+eleId).hide();
			$('#'+eleId).siblings(".job-dept-pop-model-button,.dept-pop-model-button").text(name);
		}else{
		}
	},
	formVaildroleItcode:function (pkId){
		var result = false;
		if($(".role-itcode").val()==""){
			$(".role-itcode").next(".msg-text").text("请输入角色名称");
		}else if($(".role-itcode").val().length>20){
			$(".role-itcode").next(".msg-text").text("请不要超过20个字");
		}else if(_reg.valiLetterEnNumCh($(".role-itcode"))){
			$(".role-itcode").next(".msg-text").text("请输入正确的格式");
		}else{
			 $.ajax({
			 	cache: false,
			 	type: "POST",								
			 	url:"tAdmRole/checkRoleName",
				async : false,
				data:{roleName:$(".role-itcode").val(),pkId:pkId},
				success : function(data) {
					if(data.roleName!=null){
						$(".role-itcode").next(".msg-text").text("该角色名称已存在")
					}else{
						$(".role-itcode").next(".msg-text").text("");
						result = true;
						
					}
				}
			}); 
			
		}
		return result;
	},
	addroleInfo:function (){
			var formData = $("#edit-role-info-form").serialize();//表单元素
			
			
			var otherFormData = {
				systemId:$yt_common.getSystemId(),
				userItCode:$yt_common.user_info.userItcode
			}
			formData = $.addParam(formData,otherFormData);
			//$yt_common.unSerialize(paramData);//反序列化
			$.ajax({
			 	cache: false,
			 	type: "POST",								
			 	url:"tAdmRole/saveBean",
				async : false,
				data:formData,
				success : function(data) {
					$yt_common.prompt(data.msg);
					if(data.success==0){
						
						roleManager.getroleInfo();
						$("#edit-role-info").hide();
					}
				}
			});
			
	},
	updateroleInfo:function(){
		var pkId  = $(".commen-table tr.active .roleId").val();
		var formData = $("#edit-role-info-form").serialize();//表单元素
		
		var otherFormData = {
			systemId:$yt_common.getSystemId(),
			userItCode:$yt_common.user_info.userItcode,
			pkId:pkId
		}
		
		formData = $.addParam(formData,otherFormData);
		$.ajax({
		 	cache: false,
		 	type: "POST",								
		 	url:"tAdmRole/updateBean",
			async : false,
			data:formData,
			success : function(data) {
				$yt_common.prompt(data.msg);
				if(data.success==0){
					roleManager.getroleInfo();
					$("#edit-role-info").hide();
				}
			}
		}); 
	},
	getUserByRole:function (type){
		var activeTrs = $(".commen-table tr.active");
		var ids = activeTrs.find(".roleId").val();
		//查询角色
			$.ajax({
			 	cache: false,
			 	type: "POST",								
			 	url:"tAdmRole/getUserByRole",
				async : true,
				data:{roleId:ids,userRealName:$(".role-left-list .input-search input").val()},
				success : function(data) {
					$(".role-left-list ul").empty();
					if(type==0){
						$(".role-right-list ul").empty();	
					}
					$.each(data, function(i,n) {
						var roleElem = $('<li><input type="hidden" value="'+n.id+'"/>'+n.realName+'</li>')
						if(type==0){
							if(n.state==0){
								$(".role-left-list ul").append(roleElem);
							}else{
								$(".role-right-list ul").append(roleElem);
							}
						}else{
							if($(".role-right-list input[value='"+n.id+"']").length==0){
									$(".role-left-list ul").append(roleElem);
							}
						}
					});
					/**
					 *绑定方法 
					 * 
					 * 
					 */
					
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
			}); 
			
	},
	getMenuTree:function (){
		roleManager.dtree = null;
		roleManager.dtree  = new dTree('dtree','roleManager.dtree',$yt_option.websit_path+$yt_option.fileName+'/resources/js/dTree/images/system/dept/');
		roleManager.dtree.config.check = true;
		roleManager.dtree.icon.root='resources/images/icons/icon-base.png';
		roleManager.dtree.icon.node='';
		var roleId =  $(".commen-table tr.active .roleId").val();
		$.ajax({
		 	cache: false,
		 	type: "POST",								
		 	url:"tAdmRole/getSetRoleList",
			async : false,
			data:{systemId:$yt_common.getSystemId(),roleId:roleId},
			success : function(data) {
				 dataObj = data;
				 roleManager.dtree.add({
				 	id:"MM1",
				 	pid:-1,
				 	name:'menus',
				 	isDisable:1
				 });
				 // 处理menuList
				var menuList = dataObj.menuList

				 $.each(menuList, function(i, v) {
					roleManager.dtree.add({
						id:v.id,
						pid:v.pId,
						name:v.name,
						checked:v.checked,
						isDisable:1
					});
				}); 
				
				$.each(dataObj.funcList, function(i, v) {
					roleManager.dtree.add({
						id:v.id,
						pid:v.pId,
						name:v.name,
						checked:v.checked,
						isDisable:1
					});
				});
				roleManager.dtree.init(roleManager.dtree);
			}
		}); 
		
	},/*
		 * 
		 * 
		 * 指派人员操作方法
		 * 
		 * 
		 */
		setAdminEvent:function(){
			/**
		 	 * 设置管理员
		 	 */
		 	$("button.set-user-button").off().on("click",function(){
		 		var activeTrs = $(".commen-table tr.active");
				var roleId = activeTrs.find(".roleId").val();
				if(activeTrs.length==0){
					$yt_common.prompt("请选择一行信息进行操作");
					return false;
				}else{
					//显示设置管理员弹出框
					$("#set-admin-model").show();
					//右侧存放数据
					$("#set-admin-model .right-user-data ul").empty();
					//调用根据组织查询人员的方法
					roleManager.getUserInfoByRoleIdByName(roleId);
				}
		 	});
		 	/**
		 	 * 模糊查询查询用户信息
		 	 */
		    $("#set-admin-model .model-search-btn").off().on("click",function(){
		    	var activeTrs = $(".commen-table tr.active");
				var roleId = activeTrs.find(".roleId").val();
		    	//获取输入框内容
		    	var userName = $("#set-admin-model .set-admin-inpu").val();
		    	//调用根据组织查询人员的方法
				roleManager.getUserInfoByRoleIdByName(roleId,userName);
		    });
		    /**
		 	 * 输入框键盘输入事件
		 	 */
		    $("#set-admin-model .set-admin-inpu").off().on("keyup",function(){
		    	var activeTrs = $(".commen-table tr.active");
				var roleId = activeTrs.find(".roleId").val();
		    	//调用根据组织查询人员的方法
				roleManager.getUserInfoByRoleIdByName(roleId,$(this).val());
		    });
		    /**
		     * 选中所有数据
		     */
		    $("#set-admin-model .set-role-button .d-right").off().on("click",function(){
		    	//获取根节点
		    	var rootNode = $('#user-tree').tree('getRoot');
		    	//获取子节点
		    	var childNode = $('#user-tree').tree('getChildren',rootNode.target);
		        var liStr = "";
				//$("#set-admin-model .right-user-data ul").empty();
				//设置树形复选全部勾选
		    	$('#user-tree').tree('check',rootNode.target);
		    	//展开所有节点
		    	$("#user-tree").tree('expandAll',rootNode.target);
		    	var rightData = $("#set-admin-model .right-user-data ul li .hid-user-Id");
		    	var righDataStr =",";
				$.each(rightData, function(i,d) {
					righDataStr+= $(d).val()+",";
				}); 
		    	$.each(childNode, function(i,n) {
		    		//判断是人员,获取数据
		    		if(n.attributes.deptType == "3" && righDataStr.indexOf(","+n.id+",") == -1){
		    			liStr='<li><input type="hidden" class="hid-user-Id" value="'+n.id+'"/>'+n.text+'</li>';
						$("#set-admin-model .right-user-data ul").append(liStr);
						$("#"+n.domId).find(".tree-title").css("color","#418dcc");	
		    		}
		    	});
		    	/*
				 * 右侧选中数据的操作事件
				 */
				$("#set-admin-model .right-user-data ul li").on("click",function (){
					$(this).toggleClass("active");
				});
		    });
		    /**
		     * 将选中的值赋值给右侧框
		     */
		    $("#set-admin-model .set-role-button .right").off().on("click",function(){
		    	//获取左侧树形选中的数据
		    	var nodes = $('#user-tree').tree('getChecked');
				var liStr = "";
				//$("#set-admin-model .right-user-data ul").empty();
				var rightData = $("#set-admin-model .right-user-data ul li .hid-user-Id");
				var righDataStr =",";
				$.each(rightData, function(i,d) {
					righDataStr+= $(d).val()+",";
				}); 
				if(nodes.length>0){
					for(var i=0; i<nodes.length; i++){
						//判断不是部门,获取数据
						if(nodes[i].attributes.deptType == "3" && righDataStr.indexOf(","+nodes[i].id+",") == -1){
							liStr='<li><input type="hidden" class="hid-user-Id" value="'+nodes[i].id+'"/>'+nodes[i].text+'</li>';
							$("#set-admin-model .right-user-data ul").append(liStr);
						}
					}
					/*
					 * 选中数据的操作事件
					 */
					$("#set-admin-model .right-user-data ul li").on("click",function (){
						$(this).toggleClass("active");
					});
				}
		    });
		    /**
		     * 删除右侧选中的数据
		     */
		    $("#set-admin-model .set-role-button .left").off().on("click",function(){
		    	var selDatas=[];
		    	$("#set-admin-model .right-user-data ul li.active .hid-user-Id").each(function(i,n){
		    		selDatas.push($(n).val());
		    	});
		    	//调用左侧树形选中的方法
		    	roleManager.canelCheckedNode(selDatas);
		    	$("#set-admin-model .right-user-data ul li.active").remove();
		    });
		    /**
		     * 删除右侧所有数据
		     */
		    $("#set-admin-model .set-role-button .d-left").off().on("click",function(){
		    	//获取根节点
		    	var rootNode = $('#user-tree').tree('getRoot');
		    	//获取子节点
		    	var childNode = $('#user-tree').tree('getChildren',rootNode.target);
		        var liStr = "";
				$("#set-admin-model .right-user-data ul").empty();
				//设置树形复选全部勾选
		    	$('#user-tree').tree('uncheck',rootNode.target);
		    	$("#user-tree .tree-title").css("color","#333");
		    	$("#set-admin-model .right-user-data ul li").remove();
		    });
		    /**
		     * 点击确定按钮执行保存操作
		     */
		    $("#set-admin-model .confirm").off().on("click",function(){
		    	var activeTrs = $(".commen-table tr.active");
				var roleId = activeTrs.find(".roleId").val();
		    	//获取选中的人员数据
		    	var userIds ="";
		    	$("#set-admin-model .right-user-data ul li input.hid-user-Id").each(function(i,n){
		    		userIds +=$(n).val().substring(1)+",";
		    	});
		    	$.ajax({
					type:"post",
					url:"tAdmRole/assignUser",
					async:true,
					data:{
						roleId:roleId,
						users:userIds
					},
					success:function (data){
						$yt_common.prompt(data.msg);
						if(data.success==0){
							//清空搜索框
							$("#set-admin-model .set-admin-inpu").val("");
							//隐藏弹出框
							$("#set-admin-model,#pop-modle-alert").hide();
						}
					}
				});
		    });
		    /**
		     * 单击取消按钮
		     */
		    $("#set-admin-model .cancel").on("click",function(){
		    	$("#set-admin-model .set-admin-inpu").val("");
		    });
		},
		/**
		 * 取消选中的节点
		 * @param {Object} selDatas 右侧数据
		 * @param {Object} flag     标识是全部还是单个
		 */
		canelCheckedNode:function(selDatas,flag){
			//获取根节点
	    	var rootNode = $('#user-tree').tree('getRoot');
	    	//获取子节点
	    	var childNode = $('#user-tree').tree('getChildren',rootNode.target);
	    	//获取父节点
	    	var parentNode ="";
	    	//父级的父级
	    	var parentsNode ="";
	    	$.each(childNode, function(i,n) {
	    		$.each(selDatas, function(i,s) {
	    			if(n.id == selDatas[i]){
	    				//去除选中状态和样式
						$("#user-tree").tree("uncheck",n.target);
						$("#"+n.domId).find("span.tree-title").css("color","#333");
						if(flag!=undefined && flag =="all"){
							//获取父节点
			    			parentNode = $("#user-tree").tree('getParent',n.target);
			    			//父级的父级
			    			parentsNode = $("#user-tree").tree('getParent',parentNode.target);
			    			//关闭父级节点
							$("#user-tree").tree('collapse',parentNode.target);
							$("#user-tree").tree('collapse',parentsNode.target);
						}
	    			}
	    		});
	    	});
		},
		/**
		 * 设置管人员,获取人员信息
		 * @param {Object} roleId  角色ID
		 * @param {Object} selectData 模糊查询名字
		 */
		getUserInfoByRoleIdByName:function(roleId,selectData){
			selectData= selectData==undefined?"":selectData;
			 $.ajax({
				type:"post",
				url:"tAdmRole/getUserByRole",
				async:true,
				data:{
					roleId:roleId,
					userRealName:selectData
				},
				success:function (data){
					if(data.success==0){
						//要显示的字段
			            var fileds = "id,name,isSelect,deptType";
			            //获取已转为符合treegrid的json的对象
			            var nodes = ConvertToTreeGridJson(data.obj, "id", "parentId", fileds);
			            var testData = eval('(' + JSON.stringify(nodes) + ')');
						$("#user-tree").tree({
							data:testData,
							animate:true,
							checkbox:true,
							onClick:function(node){
								if(node.checkState!=undefined){
									if(node.checkState == "checked"){
										$("#user-tree").tree("uncheck",$("#"+node.domId));
										$("#"+node.domId).find("span.tree-title").css("color","#333");
									}else{
										$("#user-tree").tree("check",$("#"+node.domId));
										$("#"+node.domId).find("span.tree-title").css("color","#418dcc");
									}
								}
							},
							onCheck:function(node,checked){
								if(checked){
									$("#"+node.domId).find("span.tree-title").css("color","#418dcc");
									$("#"+node.domId).next().find("li span.tree-title").css("color","#418dcc");
								}else{
									$("#"+node.domId).find("span.tree-title").css("color","#333");
									$("#"+node.domId).next().find("li span.tree-title").css("color","#333");
								}
							}
						});
						$("#user-tree .tree-node:eq(0)").css("padding-left","10px");
						/**
						 * 设置把部门节点的复选框去掉
						 */
						//获取根节点
				    	var rootNode = $('#user-tree').tree('getRoot');
				    	//获取子节点
				    	var childNode = $('#user-tree').tree('getChildren',rootNode.target);
				    	var liStr = "";
						//遍历所有的子节点
				    	$.each(childNode, function(i,n) {
				    		//判断节点是人员
				    		if(n.attributes.deptType == "3" && n.children ==undefined){
				    			//判断查询框不等于空
				    			if($("#set-admin-model .set-admin-inpu").val()!=""){
				    				//获取父节点
					    			var parentNode = $("#user-tree").tree('getParent',n.target);
					    			//父级的父级
					    			var parentsNode = $("#user-tree").tree('getParent',parentNode.target);
					    			//展开父节点
					    			$("#user-tree").tree('expand',parentNode.target);
					    			//展开父级的父级
					    			$("#user-tree").tree('expand',parentsNode.target);
				    			}
				    		}
				    		
				    		//展开所有选中的
				    		if(n.checkState !=undefined && n.checkState =="checked"){
				    			//获取父节点
				    			var parentNode = $("#user-tree").tree('getParent',n.target);
				    			//父级的父级
				    			var parentsNode = $("#user-tree").tree('getParent',parentNode.target);
				    			//加选中样式
								$("#"+n.domId).find("span.tree-title").css("color","#418dcc");
								if(n.attributes.deptType == "3"){
									//展开父节点
					    			$("#user-tree").tree('expand',parentNode.target);
					    			//展开父级的父级
					    			$("#user-tree").tree('expand',parentsNode.target);
					    			var rightData = $("#set-admin-model .right-user-data ul li .hid-user-Id");
									var righDataStr =",";
									$.each(rightData, function(i,d) {
										righDataStr+= $(d).val()+",";
									}); 
									if(righDataStr.indexOf(","+n.id+",") == -1){
										/**
						    			 * 拼接选中的数据给右侧div
						    			 */
						    			liStr='<li><input type="hidden" class="hid-user-Id" value="'+n.id+'"/>'+n.text+'</li>';
										$("#set-admin-model .right-user-data ul").append(liStr);
									}
								}
				    		}
				    	});
				    	/*
						 * 右侧选中数据的操作事件
						 */
						$("#set-admin-model .right-user-data ul li").on("click",function (){
							$(this).toggleClass("active");
						});
					}
				}
			});
		}
}
	
	

$(function (){
	var windowHeight = $(window).height();
	$(".list-content").css("min-height",windowHeight-200);
	$("#edit-role-info table tr td input").focus(function(){
		$(this).next(".msg-text").text("");
	});
	/**
	 * 初始化列表数据
	 * 
	 */
	roleManager.getroleInfo();
	
	/**
	 * 调用查询指派人员操作方法
	 */
	roleManager.setAdminEvent()
	/**
	 *查询按钮 
	 * 
	 * 
	 */
	$(".top-search .select-button").click(function (){
		roleManager.getroleInfo();
	});
	/**
	 *重置按钮 
	 * 
	 * 
	 */
	$(".top-search .resize-button").click(function(){
		$(".top-search .search-name").val("");
		roleManager.getroleInfo();
	})
	
	/**
	 *新增修改用户
	 * 
	 */
	$("button.add-role-button,button.update-role-button").click(function (){
		/**
		 *清空旧数据 
		 */
		$(".clear-val").val("");
		$(".clear-html,.msg-text").html("");
		/**
		 *分新增修改绑定数据和方法 
		 * 
		 */
		var activeTrs = $(".commen-table tr.active");
		var roleId = activeTrs.find(".roleId").val();
		if($(this).hasClass("add-role-button")){
			$("#edit-role-info .model-title .title-text").text("新增角色");
			$(".bottom-btn .confirm").unbind().bind("click",function (){
				var vaildValue = roleManager.formVaildroleItcode(0);
				if(vaildValue){
					roleManager.addroleInfo();
				}
			});
			/*$(".role-itcode").unbind().bind("blur",function (){
				roleManager.formVaildroleItcode(0);
			});*/
		}else{
			$("#edit-role-info .model-title .title-text").text("修改角色");
			
			if(activeTrs.length==0){
				$yt_common.prompt("请选择一条信息进行操作");
				return false;
			}else{
				/**
				 *获取用户信息 
				 */
				var roleDesc = activeTrs.find("td").eq(1).text();
				var roleName = activeTrs.find("td").eq(0).text();
				
				$("#edit-role-info-form textarea[name='roleDesc']").val(roleDesc);
				$("#edit-role-info-form input[name='roleName']").val(roleName);
				
				$(".bottom-btn .confirm").unbind().bind("click",function (){
					var vaildValue = roleManager.formVaildroleItcode(roleId);
					if(vaildValue){
						roleManager.updateroleInfo()
					}
				});	
				$(".role-itcode").unbind().bind("blur",function (){
					roleManager.formVaildroleItcode(roleId);
				});
			}
				
		}
		/**
		 *绑定方法 
		 * 
		 * 
		 */
		$("#edit-role-info").show();
	});
	
	
	/**
	 *删除按钮 
	 *
	 *
	 */
	$(".delete-role-button").click(function (){
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
						url:"tAdmRole/deleteBeanById",
						data:{id:$(".commen-table tr.active .roleId").val()},
						async:false,
						success:function (data){
							if(data.success==0){
								roleManager.getroleInfo();
							}
							$yt_common.prompt(data.msg);
						}
					});
				}
			});
		}
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
				url:"tAdmRole/onUsed",
				async:true,
				data:{roleId:$(".commen-table tr.active .roleId").val(),state:0},
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
					url:"tAdmRole/onUsed",
				async:true,
				data:{roleId:$(".commen-table tr.active .roleId").val(),state:1},
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
	 *分配权限 
	 * 
	 * 
	 * 
	 */
	
	$("button.set-menu").click(function (){
		var activeTrs = $(".commen-table tr.active");
		if(activeTrs.length==0){
			$yt_common.prompt("请选择一条信息进行操作");
		}else{
			$("#set-menu").show();
			roleManager.getMenuTree();
			$("#set-menu .confirm").unbind().bind("click",function (){
				var idsArr = roleManager.dtree.getCheckedNodes();
				var idsStr = '';
				$.each(idsArr,function (i,n){
					if(i==0){
						idsStr = n.id;
					}else{
						idsStr =idsStr+","+ n.id;
					}
				})
				$.ajax({
					type:"post",
					url:"tAdmRole/addRoleAndMenu",
					async:false,
					data:{roleId:activeTrs.find(".roleId").val(),menuFuncIds:idsStr},
					success:function (data){
						if(data.success==0){
							$("#set-menu").hide();
						}
						$yt_common.prompt(data.msg);
					}
				});
			});
		}
		
		
	});
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
    	text:'',
    	checked:''
    }
    var treeChildStr = "id,text,checked";
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
                    checked:'',
                    "state":'',
                    "attributes":{
						"deptType":'',
					}
                };
                var arrFiled = fileds.split(",");
                for (var j = 0; j < arrFiled.length; j++) {
                    if (arrFiled[j] != idFieldName) {
                        child.text= row[arrFiled[1]];
                        child.checked= (row[arrFiled[2]]=="1"?true:false);
                        child.attributes.deptType=row[arrFiled[3]];
                        if(row[arrFiled[3]] == "1"){
                        	child.state="closed";
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
