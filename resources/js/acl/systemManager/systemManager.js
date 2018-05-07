

var systemManager = {
	dtree:null,
	getsystemInfo:function (){
		$yt_common.pageInfo.config(1,function (pageIndex){
			var resultData = {
				total:0
			};
			$.ajax({
				url:'tAdmSystem/findByPage',
		        type : 'POST',
		        async: false,
		        data:{"pageIndexs":pageIndex,systemName:"",systemId:$yt_common.getSystemId(),userId:$yt_common.user_id},
				success:function (data){
					resultData = data;
					 $(".commen-table tbody").empty();
					$.each(resultData.rows, function(i,n) {
						var stateHtml = '<span class="enable">启用</span>';
						if(n.disabled==0){
							stateHtml = '<span class="disabled">停用</span>';	
						}
						
				 		var tr = '<tr><td><input  class="systemId" type="hidden" value="'+n.pkId+'"/><input  class="systemIndex" type="hidden" value="'+n.systemIndex+'"/>'+n.systemCode+'</td><td class="tl">'+n.systemName+'</td><td class="tl">'+n.systemLogin+'</td></tr>';
					 	$(".commen-table tbody").append(tr);
					});
				}
			});
			return resultData;
		});
		
	},
	/**
	 * 显示菜单树形
	 * @param {Object} userId
	 * @param {Object} obj
	 */
	getMenuTree:function (userId,obj){
		$("#set-admin-model").hide();
		$("#set-menu").show();
		var systemId  = $(".commen-table tr.active .systemId").val();
		systemManager.dtree = null;
		systemManager.dtree  = new dTree("dtree",'systemManager.dtree',$yt_option.websit_path+$yt_option.fileName+'/resources/js/dTree/images/system/dept/');
		systemManager.dtree.config.check = true;
		systemManager.dtree.icon.root='resources/images/icons/icon-base.png';
		systemManager.dtree.icon.node='';
		$.ajax({
		 	cache: false,
		 	type: "POST",								
		 	url:"tAdmSystem/getSetRoleList",
			async : false,
			data:{userId:userId.substring(1),systemId:systemId,userIdLogin:$yt_common.user_id,nowSystemId:$yt_common.getSystemId()},
			success : function(data) {
				 dataObj = data;
				 systemManager.dtree.add({
				 	id:"MM1",
				 	pid:-1,
				 	name:'menus',
				 	isDisable:1
				 });
				 $.each(dataObj.menuList, function(i, v) {
           if(v.display) {
             v.type = "menu";
             systemManager.dtree.add({
               id: v.id,
               pid: v.pId,
               name: v.name,
               checked: v.checked,
               nodeData: v,
               isDisable: 1
             });
           }
				}); 
				
				$.each(dataObj.funcList, function(i, v) {
					v.type="func"
					systemManager.dtree.add({
						id:v.id,
						pid:v.pId,
						name:v.name,
						checked:v.checked,
						nodeData:v,
						isDisable:1
					});
				});
				systemManager.dtree.init(systemManager.dtree);
			}
		}); 
	 	
	 	//菜单树形弹框中点击确定按钮
	 	$("#set-menu .confirm").unbind().bind("click",function (){
	 		var systemId  = $(".commen-table tr.active .systemId").val();
	 		var saveArr = [];
	 		var selectNodes = systemManager.dtree.getCheckedNodes();
	 		$.each(selectNodes, function(i,n) {
	 			if(n.id!="MM1"){
	 				if(n.nodeData.type=="menu"){
	 					saveArr.push(JSON.stringify({systemId:systemId,userId:userId.substring(1),menuId:n.nodeData.realId,createTimeBy:$yt_common.itcode}));
	 				}else{
	 					saveArr.push(JSON.stringify({systemId:systemId,userId:userId.substring(1),menuId:n.nodeData.realPId,funId:n.nodeData.realId,createTimeBy:$yt_common.itcode}));
	 				}
	 			}
	 		});
	 		obj.val(JSON.stringify(saveArr));	;
			$("#set-menu").hide();
	 		$("#set-admin-model").show();
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
	getGroupList:function (obj){
		var ulElement = obj.siblings(".group-pop-model,.job-group-pop-model").find("ul");
		var posiName = obj.siblings(".group-pop-model,.job-group-pop-model").find(".group-search").val();
		$.ajax({
		 	cache: false,
		 	type: "POST",								
		 	url:"tAdmDept/getsystemPosition",
		 	data:{posiName:encodeURI(posiName)},
			async : false,
			success : function(data) {
				ulElement.empty();
				$.each(data, function(i,n) {
					var groupEle = $('<li>'+n.posiName+'</li>');
					ulElement.append(groupEle);
					groupEle.click(function (){
						obj.siblings("input").val(n.posiCode);
						obj.text(n.posiName);
						obj.siblings(".group-pop-model,.job-group-pop-model").hide();
					});
				});
				
			}
		});
		
		
	},formVaildSystemName:function (){
		var result = false;
		if($(".system-real-name").val()==""){
			$(".system-real-name").next(".msg-text").text("请输入系统名称");
		}else if($(".system-real-name").val().length>20){
			$(".system-real-name").next(".msg-text").text("请不要超过20个字");
		}else if(_reg.valiLetterEnNumChSys($(".system-real-name"))){
			$(".system-real-name").next(".msg-text").text("请输入汉字、字母和数字以及小括号");
		}else{
			$(".system-real-name").next(".msg-text").text("");
			result = true;
		}
		return result;
	},
	formVaildSystemUrl:function (obj){
		// var result = false;
		// if(obj.val()==""){
		// 	obj.next(".msg-text").text("请输入地址");
		// }else if(obj.val().length>200){
		// 	obj.next(".msg-text").text("请不要超过200个字");
		// }else if(_reg.valiUrl(obj)){
		// 	obj.next(".msg-text").text("请输入正确的网址格式");
		// }else{
		// 	obj.next(".msg-text").text("");
		// 	result = true;
		// }
		// return result;
		return true
	},
	addSystemInfo:function (){
			var formData = $("#edit-system-info-form").serialize();//表单元素
			
			var otherFormData = {
				userItCode:$yt_common.user_id
			}
			
			formData = $.addParam(formData,otherFormData);
			$.ajax({
			 	cache: false,
			 	type: "POST",								
			 	url:"tAdmSystem/saveBean",
				async : false,
				data:formData,
				success : function(data) {
					if(data.success==0){
						$yt_common.prompt(data.msg);
						systemManager.getsystemInfo();
						$("#edit-system-info").hide();
					}
				}
			}); 
			
	},
	updatesystemInfo:function(){
		var pkId  = $(".commen-table tr.active .systemId").val();
		var formData = $("#edit-system-info-form").serialize();//表单元素
		var otherFormData = {
			userItCode:$yt_common.user_id,
			pkId:pkId
		}
    console.log(formData)
		formData = $.addParam(formData,otherFormData);
		$.ajax({
		 	cache: false,
		 	type: "POST",								
		 	url:"tAdmSystem/updateBean",
			async : false,
			data:formData,
			success : function(data) {
				if(data.success==0){
					$yt_common.prompt(data.msg);
					systemManager.getsystemInfo();
					$("#edit-system-info").hide();
				}
			}
		}); 
	},getUserBySystem:function (type){
		var me = systemManager;
		var activeTrs = $(".commen-table tr.active");
		var ids = activeTrs.find(".systemId").val();
		//查询角色
			$.ajax({
			 	cache: false,
			 	type: "POST",								
			 	url:"tAdmSystem/getAdminUserAllBySystemId",
				async : false,
				data:{"systemId":ids,"userName":$(".role-left-list .input-search input").val()},
				success : function(data) {
					$(".role-left-list ul").empty();
					if(type==0){
						$(".role-right-list ul").empty();	
					}
					$.each(data, function(i,n) {
						var roleElem = $('<li><input type="hidden" class="userId" value="'+n.id+'"/>'+n.name+'</li>')
						if(type==0){
							if(n.state==0){
								$(".role-left-list ul").append(roleElem);
							}
						}else{
							if($(".role-right-list input[value='"+n.id+"']").length==0){
									$(".role-left-list ul").append(roleElem);
							}
						}
					});
				}
			}); 
			if(type==0){
				$.ajax({
				 	cache: false,
				 	type: "POST",								
				 	url:"tAdmSystem/getMenusAndFuncsBySystemId",
					async : false,
					data:{systemId:ids},
					success : function(data) {
						$.each(data, function(i,n) {
							var roles = [];
							$.each(n.menusAndFuncs, function(k,m) {
								if(m.types==1){
									//{"systemId":5,"userId":1,"menuId":12,"createTimeBy":admin}
									roles.push(JSON.stringify({systemId:ids,userId:n.userId,menuId:m.id,createTimeBy:""}));
								}else{
									//{"systemId":5,"userId":1,"menuId":12,"funId":13,"createTimeBy":admin}
									roles.push(JSON.stringify({systemId:ids,userId:n.userId,menuId:m.pId,funId:m.id,createTimeBy:""}));
								}
							});
							var roleElem = $('<li><input type="hidden" class="userId" value="'+n.userId+'"/>'+n.realName+'<span class="fr" title="分配权限"><input type="hidden" value=""><img src="./resources/images/icons/icon-setting.png"/></span></li>');
							roleElem.find("span input").val(JSON.stringify(roles));
							$(".role-right-list ul").append(roleElem);
						});
						
					}
				});
			}
			
			
			/**
			 *绑定方法 
			 * 
			 * 
			 */
			
			$(".role-left-list ul li,.role-right-list ul li").on("click",function (){
				$(this).toggleClass("active");
				
			});
			
			
		
			
			$(".set-role-button .d-right").on("click",function(){
				$(".role-left-list ul li").append('<span class="fr" title="分配权限"><input type="hidden" value=""><img src="./resources/images/icons/icon-setting.png"/></span>');
				$(".role-right-list ul").append($(".role-left-list ul li"));
				
				$(".role-right-list ul li span").unbind().bind("click",function (){
					var userId = $(this).siblings(".userId").val();
					var dataObj = $(this).find("input");
					me.getMenuTree(userId,dataObj);
				});
				
				
			})
			$(".set-role-button .d-left").on("click",function(){
				$(".role-right-list ul li span").remove();
				$(".role-left-list ul").append($(".role-right-list ul li"));
				
			})
			$(".set-role-button .right").on("click",function(){
				$(".role-left-list ul li.active").append('<span class="fr" title="分配权限"><input type="hidden" value=""><img src="./resources/images/icons/icon-setting.png"/></span>');
				$(".role-right-list ul").append($(".role-left-list ul li.active"));
				
				$(".role-right-list ul li span").unbind().bind("click",function (){
					var userId = $(this).siblings(".userId").val();
					var dataObj = $(this).find("input");
					me.getMenuTree(userId,dataObj);
				});
				
			})
			
			$(".set-role-button .left").on("click",function(){
				$(".role-right-list ul li.active span").remove();
				$(".role-left-list ul").append($(".role-right-list ul li.active"));
			})
					
			$(".role-right-list ul li span").unbind().bind("click",function (){
				var userId = $(this).siblings(".userId").val();
				var dataObj = $(this).find("input");
				me.getMenuTree(userId,dataObj);
			});
			
	},
		/*
		 * 
		 * 
		 * 指派管理员操作方法
		 * 
		 * 
		 */
		setAdminEvent:function(){
			/**
		 	 * 设置管理员
		 	 */
			var that = this
		 	$("button.set-user-button").off().on("click",function(){
		 		var systemId = $(".commen-table tr.active .systemId").val();
				if(systemId==null ||systemId=="" ){
					$yt_common.prompt("请选择一行操作");
					return false;
				}else{
					//显示设置管理员弹出框
					$("#set-admin-model").show();
					//根据系统ID查询管理员信息
					systemManager.getUserInfoBySystemId(systemId);
					
					//调用根据组织查询人员的方法
					systemManager.getUserInfoByDeptIdByName(systemId);
				}
		 	});
		 	
		 	/**
		 	 * 模糊查询查询用户信息
		 	 */
		    $("#set-admin-model .model-search-btn").off().on("click",function(){
		    	var systemId = $(".commen-table tr.active .systemId").val();
		    	//获取输入框内容
		    	var userName = $("#set-admin-model .set-admin-inpu").val();
		    	//调用根据组织查询人员的方法
				systemManager.getUserInfoByDeptIdByName(systemId,userName);
		    });
		    /**
		 	 * 输入框键盘输入事件
		 	 */
		    $("#set-admin-model .set-admin-inpu").off().on("keyup",function(){
		    	var systemId = $(".commen-table tr.active .systemId").val();
		    	//调用根据组织查询人员的方法
				systemManager.getUserInfoByDeptIdByName(systemId,$(this).val());
		    });
		    /**
		     * 将选中的值赋值给右侧框
		     */
		    $("#set-admin-model .set-role-button .right").off().on("click",function(){
		    	//获取左侧树形选中的数据
		    	var nodes = $('#user-tree').tree('getChecked');
				var liStr = "";
				/*$("#set-admin-model .right-user-data ul").empty();*/
				var rightSelData = $("#set-admin-model .right-user-data ul li .hid-user-Id");
				var userids = ",";
				$.each(rightSelData, function(i,n) {
					userids+=$(n).val()+",";
				});
				var flag=true;
				if(nodes.length>0){
					for(var i=0; i<nodes.length; i++){
						let id = nodes[i].id
						if(userids.indexOf((","+id+",")) == -1 && nodes[i].attributes.deptType == "3"){

              // 调取查询权限接口

              (function getSetRoleList(userId){
                var systemId = $(".commen-table tr.active .systemId").val();

                $.ajax({
                  cache: false,
                  type: "POST",
                  url: "tAdmSystem/getSetRoleList",
                  async: false,
                  data: {
                    userId: userId.substring(1),
                    systemId: systemId,
                    userIdLogin: $yt_common.user_id,
                    nowSystemId: $yt_common.getSystemId()
                  },
                  success: function (data) {
                    var saveArr = [];
                    data.menuList.map((n) => {
                      if(n.id!="MM1"){
												saveArr.push(JSON.stringify({systemId:systemId,userId:userId.substring(1),menuId:n.realId,createTimeBy:$yt_common.itcode}));
                      }
										})
                    data.funcList.map((n) => {
											saveArr.push(JSON.stringify({systemId:systemId,userId:userId.substring(1),menuId:n.realPId,funId:n.realId,createTimeBy:$yt_common.itcode}));
										})
                    liStr='<li>' + '<input type="hidden" class="hid-user-Id" value="'+id+'"/>' +nodes[i].text+ '<span class="set-menu"><input class="hid-menu-data" type="hidden" value=\''+JSON.stringify(saveArr)+'\' /><img src="./resources/images/icons/icon-setting.png"/></span></li>';
                    $("#set-admin-model .right-user-data ul").append(liStr);
                  }
                });
              })(id)
                console.log('bbb',liStr)
						}
					}
					/*
					 * 选中数据的操作事件
					 */
					$("#set-admin-model .right-user-data ul li").on("click",function (){
						$(this).toggleClass("active");
					});
					/**
				 	 * 
				 	 * 点击设置图标,展开菜单树形
				 	 * 
				 	 */
				 	$("#set-admin-model .right-user-data ul li span.set-menu").off().on("click",function(){
				 		var userId = $(this).parent().find(".hid-user-Id").val();
				 		if(!$(this).parent().hasClass("user-dis")){
				 			//调用查看树形接口
				 			systemManager.getMenuTree(userId,$(this).find(".hid-menu-data"));
				 		}
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
		    	systemManager.canelCheckedNode(selDatas);
		    	$("#set-admin-model .right-user-data ul li.active").remove();
		    });
		    /**
		     * 删除右侧所有数据
		     */
		    $("#set-admin-model .set-role-button .d-left").off().on("click",function(){
		    	var selDatas=[];
		    	$("#set-admin-model .right-user-data ul li .hid-user-Id").each(function(i,n){
		    		if($(n).val()!="P"+$yt_common.user_id){
		    			selDatas.push($(n).val(),"all");
		    		}
		    	});
		    	//调用左侧树形选中的方法
		    	systemManager.canelCheckedNode(selDatas);
		    	$("#set-admin-model .right-user-data ul li:not(.user-dis)").remove();
		    });
		    /**
		     * 点击确定按钮执行保存操作
		     */
		    $("#set-admin-model .confirm").off().on("click",function(){
		    	var systemId = $(".commen-table tr.active .systemId").val();
		    	var selectUser = $(".right-user-data ul li span input.hid-menu-data");
				var saveData =[];
				var inputVal = '';
				$.each(selectUser, function(i,n) {
					inputVal = $(n).val();
					if(inputVal!=""){
						$.each($.parseJSON(inputVal), function(i,n) {
							saveData.push(n);
						});
					}
				});
		    	$.ajax({
					type:"post",
					url:"tAdmSystem/addAdminUser",
					async:true,
					data:{
						systemId:systemId,
						bean:"["+saveData+"]"
					},
					success:function (data){
						$yt_common.prompt(data.msg);
						if(data.success==0){
							//清空搜索框
							$("#set-admin-model .set-admin-inpu").val("");
							//隐藏弹出框
							$("#set-admin-model,#pop-modle-alert").hide();
							if(systemId==$yt_common.getSystemId()){
								setTimeout(function(){
									window.location.reload();
								},1000);
							}
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
		 * 根据系统ID查询人员信息
		 */
		getUserInfoBySystemId:function(systemId){
			$.ajax({
				 	cache: false,
				 	type: "POST",								
				 	url:"tAdmSystem/getMenusAndFuncsBySystemId",
					async : false,
					data:{systemId:systemId},
					success : function(data) {
						$("#set-admin-model .right-user-data ul").empty();
						$.each(data, function(i,n) {
							var roles = [];
							$.each(n.menusAndFuncs, function(k,m) {
								if(m.types==1){
									//{"systemId":5,"userId":1,"menuId":12,"createTimeBy":admin}
									roles.push(JSON.stringify({systemId:systemId,userId:n.userId.substring(1),menuId:m.id,createTimeBy:""}));
								}else{
									//{"systemId":5,"userId":1,"menuId":12,"funId":13,"createTimeBy":admin}
									roles.push(JSON.stringify({systemId:systemId,userId:n.userId.substring(1),menuId:m.pId,funId:m.id,createTimeBy:""}));
								}
							});
							
							/**
			    			 * 拼接选中的数据给右侧div
			    			 */
			    			var liStr="";
			    			if(n.userId =="P"+$yt_common.user_id){
			    				liStr=$('<li  class="user-dis" style="cursor: default;color: #999;"><input type="hidden" class="hid-user-Id" value="'+n.userId+'"/>'+n.realName+'<span class="set-menu"><input type="hidden" class="hid-menu-data"/><img src="./resources/images/icons/icon-setting.png"/></span></li>');
			    			}else{
			    				liStr=$('<li><input type="hidden" class="hid-user-Id" value="'+n.userId+'"/>'+n.realName+'<span class="set-menu"><input type="hidden" class="hid-menu-data"/><img src="./resources/images/icons/icon-setting.png"/></span></li>');
			    			}
							liStr.find(".hid-menu-data").val(JSON.stringify(roles));
							$("#set-admin-model .right-user-data ul").append(liStr);
						});
						
					}
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
		 * 设置管理员,初始获取信息
		 * @param {Object} deptId  组织ID
		 * @param {Object} selectData 模糊查询名字
		 */
		getUserInfoByDeptIdByName:function(systemId,userName){
			userName = (userName==undefined?"":userName);
			 $.ajax({
				type:"post",
				url:"tAdmSystem/getAdminUserAllBySystemId",
				async:true,
				data:{
					systemId:systemId,
					userName:userName
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
							onlyLeafCheck:true,
							onClick:function(node){
								if(node.checkState!=undefined){
									if(node.checkState == "checked"){
										$("#user-tree").tree("uncheck",$("#"+node.domId));
										$("#"+node.domId).find("span.tree-title").css("color","#333");
									}else{
										//不是部门不能选
										if(node.attributes.deptType != "2"){
										  $("#user-tree").tree("check",$("#"+node.domId));
										  $("#"+node.domId).find("span.tree-title").css("color","#418dcc");
										}else{
											$("#"+node.domId).css("cursor","default");
										}
									}
								}
							},
							onCheck:function(node,checked){
								if(checked){
									$("#"+node.domId).find("span.tree-title").css("color","#418dcc");
								}else{
									$("#"+node.domId).find("span.tree-title").css("color","#333");
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
				    	/**
			    		 * 判断右侧是否有数据
			    		 */
			    		if($(".right-user-data ul li").length>0){
			    			$(".right-user-data ul li .hid-user-Id").each(function(i,v){
			    				$.each(childNode, function(i,n) {
			    					if(v.id == n.id && n.attributes.deptType == 3){
			    						$("#user-tree").tree("check",$("#"+n.domId));
			    					}
			    				});
			    			});
			    		}
				    	//右侧存放数据
						//$("#set-admin-model .right-user-data ul").empty();
						//遍历所有的子节点
				    	$.each(childNode, function(i,n) {
				    		//判断节点是部门
				    		if(n.attributes.deptType == "2" && n.children ==undefined){
				    			//先删除之前添加的复选框
				    			$("#"+n.domId).find(".tree-checkbox").remove();
				    			//再给添加图标
				    			$("#"+n.domId).find(".tree-icon").addClass("tree-folder-child");
				    			//调用禁用方法
				    			$("#user-tree").tree('disableCheck',n.target);
				    		}
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
				    			//展开父节点
				    			$("#user-tree").tree('expand',parentNode.target);
				    			//展开父级的父级
				    			$("#user-tree").tree('expand',parentsNode.target);
				    			//加选中样式
								$("#"+n.domId).find("span.tree-title").css("color","#418dcc");
				    			/**
				    			 * 拼接选中的数据给右侧div
				    			 */
				    			/*liStr='<li><input type="hidden" class="hid-user-Id" value="'+n.id+'"/>'+n.text+'<span class="set-menu"><input type="hidden" class="hid-menu-data"/><img src="./resources/images/icons/icon-setting.png"/></span></li>';
								$("#set-admin-model .right-user-data ul").append(liStr);*/
				    		}
				    	});
				    	/*
						 * 右侧选中数据的操作事件
						 */
						$("#set-admin-model .right-user-data ul li").on("click",function (){
							if(!$(this).hasClass("user-dis")){
								$(this).toggleClass("active");
							}
						});
						/**
					 	 * 
					 	 * 点击设置图标,展开菜单树形
					 	 * 
					 	 */
					 	$("#set-admin-model .right-user-data ul li span.set-menu").off().on("click",function(){
					 		var userId = $(this).parent().find(".hid-user-Id").val();
					 		if(!$(this).parent().hasClass("user-dis")){
					 			//调用查看树形接口
					 			systemManager.getMenuTree(userId,$(this).find(".hid-menu-data"));
					 		}
					 	});
					}
				}
			});
		}
}
	
	

$(function (){
	var windowHeight = $(window).height();
	$(".list-content").css("min-height",windowHeight-200);
	//文本框获取焦点事件
	$("#edit-system-info table tr td input").focus(function(){
		$(this).next(".msg-text").text("");
	});
	/**
	 * 初始化列表数据
	 * 
	 */
	systemManager.getsystemInfo();
    /**
     * 
     * 调用角色操作事件方法
     * 
     */
	systemManager.setAdminEvent();
	
	/**
	 *新增修改用户
	 * 
	 */
	$("button.add-system-button,button.update-system-button").click(function (){
		/**
		 *清空旧数据 
		 */
		$(".clear-val").val("");
		$(".clear-html,.msg-text").html("");
		
		/**
		 *分新增修改绑定数据和方法 
		 * 
		 */
		if($(this).hasClass("add-system-button")){
			$("#edit-system-info .model-title .title-text").text("新增系统信息");
			$(".system-code").addClass("hide");
			$(".bottom-btn .confirm").unbind().bind("click",function (){
        $(".bottom-btn .confirm").attr('disabled',"true");
				systemManager.formVaildSystemName();
				// systemManager.formVaildSystemUrl($("#edit-system-info input[name='systemIndex']"));
				// systemManager.formVaildSystemUrl($("#edit-system-info input[name='systemLogin']"));
				// var vaildValue = systemManager.formVaildSystemName()&&systemManager.formVaildSystemUrl($("#edit-system-info input[name='systemIndex']"))&&systemManager.formVaildSystemUrl($("#edit-system-info input[name='systemLogin']"));
				var vaildValue = systemManager.formVaildSystemName();
				if(vaildValue){
					systemManager.addSystemInfo();
				}
        $(".bottom-btn .confirm").removeAttr("disabled")
			});
		}else{
			$(".system-code").removeClass("hide");
			$("#edit-system-info .model-title .title-text").text("修改系统信息");
			var activeTrs = $(".commen-table tr.active");
			if(activeTrs.length==0){
				$yt_common.prompt("请选择一条信息进行操作");
				return false;
			}else{
				/**
				 * 赋值修改信息 
				 */
				var pkId = activeTrs.find(".pkId").val();
				var systemCode=  activeTrs.find("td").eq(0).text();
				$(".system-code").find("td").eq(1).find("div").text(systemCode);
				var systemName = activeTrs.find("td").eq(1).text();
				$("#edit-system-info input[name='systemName']").val(systemName);
				var systemIndex = activeTrs.find(".systemIndex").val();
				$("#edit-system-info input[name='systemIndex']").val(systemIndex);
				var systemLogin = activeTrs.find("td").eq(2).text();
				$("#edit-system-info input[name='systemLogin']").val(systemLogin);
				
				
				$(".bottom-btn .confirm").unbind().bind("click",function (){
					systemManager.formVaildSystemName();
					systemManager.formVaildSystemUrl($("#edit-system-info input[name='systemIndex']"));
					systemManager.formVaildSystemUrl($("#edit-system-info input[name='systemLogin']"));
					var vaildValue = systemManager.formVaildSystemName()&&systemManager.formVaildSystemUrl($("#edit-system-info input[name='systemIndex']"))&&systemManager.formVaildSystemUrl($("#edit-system-info input[name='systemLogin']"));
					if(vaildValue){
						systemManager.updatesystemInfo()
					}
				});		
			}
				
		}
		/**
		 *绑定方法 
		 * 
		 * 
		 */
		$("#edit-system-info").show();
	});
	
	
	/**
	 *删除按钮 
	 *
	 *
	 */
	$(".delete-system-button").click(function (){
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
						url:"tAdmSystem/deleteBeanById",
						data:{id:$(".commen-table tr.active .systemId").val()},
						async:false,
						success:function (data){
							if(data.success==0){
								systemManager.getsystemInfo();
							}
							$yt_common.prompt(data.msg);
						}
					});
				}
			});
		}
	});
	
	
	
	/**
	 *重置编码按钮 
	 *
	 *
	 */
	$(".reset-code").click(function (){
		var activeTrs = $(".commen-table tr.active");
		if(activeTrs.length==0){
			$yt_common.prompt("请选择一条信息进行操作");
		}else{
			$.ajax({
				type:"post",
				url:"tAdmSystem/updateSystemToken",
				data:{id:$(".commen-table tr.active .systemId").val()},
				async:false,
				success:function (data){
					if(data.success==0){
						systemManager.getsystemInfo();
					}
					$yt_common.prompt(data.msg);
				}
			});
		}
	});
	
	
	$(".bottom-btn .cancel").bind("click",function (){
		$(this).parents(".yt-pop-model").hide();
	})
	/**
	 * 树形菜单弹框中点击取消按钮
	 */
	$("#set-menu .cancel").unbind().bind("click",function (){
		$("#set-menu").hide();
		$("#set-admin-model").show();
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
    var treeObj={
    	 id:'',
    	 text:'',
    	 checked:''
    }
    // get the top level nodes
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!exists(rows, row[pidFieldName])) {
            var data = {
                id: row[idFieldName]
            }
            var arrFiled = fileds.split(",");
            for (var j = 0; j < arrFiled.length; j++)
            {
                if (arrFiled[j] != idFieldName)
                    data[arrFiled[j]] = row[arrFiled[j]];
            }
            if(data!=null){
               nodes.push(data);	
            }
            
        }
    }
    //整理新的根节点字段
    $.each(nodes, function(i,n) {
    	treeObj.id=n.id;
    	treeObj.text=n.name;
    	treeObj.checked=(n.isSelect=="1"?true:false);
    	//先清空
    	nodes.splice(0,nodes.length);
    	nodes.push(treeObj);
    });
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
