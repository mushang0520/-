var menuManager = {
	dtree:null,
	getMenuInfo:function (){
		$("#auth_list").html("");
		var menuListData =[];
	
	$.ajax({
		type:"post",
		url:"tAdmMenu/getAllTreeInfo",
		data:{systemId:$("#yt-index-head-sys select").val()},
		async:false,
		success:function (data){
			menuListData = data
		}
	});
	
	/*var data = '[{"countMenu":"15","createTime":null,"createTimeBy":null,"funcCode":"11","id":1556,"logoUrl":null,"menuName":"新增","menuOrder":0,"menuSeq":null,"menuType":"","menuUrl":"111","orderId":"56","parentId":63,"parentName":null,"pkId":1556,"state":1,"systemId":4,"type":"func","updateTime":null,"updateTimeBy":null},{"countMenu":"15","createTime":null,"createTimeBy":null,"funcCode":"222","id":1558,"logoUrl":null,"menuName":"111","menuOrder":0,"menuSeq":null,"menuType":"","menuUrl":"333","orderId":"58","parentId":63,"parentName":null,"pkId":1558,"state":1,"systemId":4,"type":"func","updateTime":null,"updateTimeBy":null},{"countMenu":"","createTime":null,"createTimeBy":null,"funcCode":"","id":62,"logoUrl":null,"menuName":"配置管理","menuOrder":0,"menuSeq":null,"menuType":"SYSTEM","menuUrl":"tAdmUser/lookForAll.action","orderId":"62","parentId":0,"parentName":null,"pkId":62,"state":1,"systemId":4,"type":"menu","updateTime":null,"updateTimeBy":null},{"countMenu":"","createTime":null,"createTimeBy":null,"funcCode":"","id":63,"logoUrl":null,"menuName":"用户管理","menuOrder":1,"menuSeq":null,"menuType":"SYSTEM","menuUrl":"tAdmUser/lookForAll.action","orderId":"63","parentId":62,"parentName":null,"pkId":63,"state":1,"systemId":4,"type":"menu","updateTime":null,"updateTimeBy":null},{"countMenu":"","createTime":null,"createTimeBy":null,"funcCode":"","id":65,"logoUrl":null,"menuName":"角色管理","menuOrder":3,"menuSeq":null,"menuType":"SYSTEM","menuUrl":"tAdmRole/lookForAll.action","orderId":"65","parentId":62,"parentName":null,"pkId":65,"state":1,"systemId":4,"type":"menu","updateTime":null,"updateTimeBy":null},{"countMenu":"","createTime":null,"createTimeBy":null,"funcCode":"","id":66,"logoUrl":null,"menuName":"权限管理","menuOrder":4,"menuSeq":null,"menuType":"SYSTEM","menuUrl":"tAdmMenu/lookForAll.action","orderId":"66","parentId":62,"parentName":null,"pkId":66,"state":1,"systemId":4,"type":"menu","updateTime":null,"updateTimeBy":null},{"countMenu":"","createTime":null,"createTimeBy":null,"funcCode":"","id":91,"logoUrl":null,"menuName":"组织结构","menuOrder":6,"menuSeq":null,"menuType":"SYSTEM","menuUrl":"tAdmDept/lookForAll.action","orderId":"91","parentId":62,"parentName":null,"pkId":91,"state":1,"systemId":4,"type":"menu","updateTime":null,"updateTimeBy":null},{"countMenu":"","createTime":null,"createTimeBy":null,"funcCode":"","id":70,"logoUrl":null,"menuName":"系统管理","menuOrder":7,"menuSeq":null,"menuType":"SYSTEM","menuUrl":"tAdmSystem/lookForAll.action","orderId":"70","parentId":62,"parentName":null,"pkId":70,"state":1,"systemId":4,"type":"menu","updateTime":null,"updateTimeBy":null},{"countMenu":"","createTime":null,"createTimeBy":null,"funcCode":"","id":92,"logoUrl":null,"menuName":"日志管理","menuOrder":8,"menuSeq":null,"menuType":"SYSTEM","menuUrl":"tLogSystemInfo/lookForAll.action","orderId":"92","parentId":62,"parentName":null,"pkId":92,"state":1,"systemId":4,"type":"menu","updateTime":null,"updateTimeBy":null},{"countMenu":"","createTime":null,"createTimeBy":null,"funcCode":"","id":93,"logoUrl":null,"menuName":"职位管理","menuOrder":9,"menuSeq":null,"menuType":"SYSTEM","menuUrl":"tAdmPosition/lookForAll.action","orderId":"93","parentId":62,"parentName":null,"pkId":93,"state":1,"systemId":4,"type":"menu","updateTime":null,"updateTimeBy":null}]';
	menuTempListData = eval(data);*/
	// 树:配置
	var config = {
			id: "tg1",
			width: "100%",
			renderTo: "auth_list",
			headerAlign: "center",
			dataAlign: "left",
			fitColumns:true,
			folderOpenIcon: "resources/images/icons/menu-down.png",
			folderCloseIcon: "resources/images/icons/menu-right.png",
			defaultLeafIcon: "resources/images/icons/F.png",
			hoverRowBackground: "true",
			positionTableId:"position-table-title",
			itemClick: "itemClickEvent",
			columns:[
						{headerText: "权限名称", dataField: "menuName",width: "300px",
						 
						 formatter:function(value, row, index){
								var trStr = '<span class="dept-name-span">'+value+'</span>';
								return trStr;
							}
						},
						{headerText: "权限标识", dataField: "funcCode", width: "200px"},
						{headerText: "权限类型", dataField: "type", dataAlign:"center",  width: "87px"},
						{headerText: "权限代码", dataField: "menuUrl",  width: "301px"},
						{headerText: "状态", dataField: "state",dataAlign:"center",  width: "80px",
							formatter:function(value, row, index){
								var value ="";
								if (row.state == 0) {
									value = "停用";
									return '<span style="color:#ff0000;">'+value+'</span>';
								} else {
									value = "启用";
									return '<span style="color:#4aae62;">'+value+'</span>';
								}
							}
						},
						{headerText: "排序",dataField: "menuOrder", headerAlign: "center", dataAlign: "center", width: "60px",}
					],
					data:$yt_common.getTreeData(menuListData,0)
		};
	// 创建一个组件对象
	treeGrid = new TreeGrid(config);
	treeGrid.show();
	$(".auth_list tr").setEvenTrColor();
	},
	getDeptTree:function (eleId){
		$(".dtree").remove();
		menuManager.dtree = null;
		menuManager.dtree  = new dTree(eleId,'menuManager.dtree',$yt_option.websit_path+$yt_option.fileName+'/resources/js/dTree/images/system/dept/');
		$.ajax({
			type:"post",
			url:"tAdmMenu/getAllTreeInfo",
			data:{systemId:$("#yt-index-head-sys select").val()},
			async:false,
			success:function (data){
				dataObj = data;
				menuManager.menu_info_data = data;
				menuManager.dtree.add({
					id:0,
					pid:-1,
					name:'一级菜单',
					url:'javascript:menuManager.getDeptValue(this,0,\'一级菜单\',\'\',\''+eleId+'\')'
					});
				 $.each(dataObj, function(i, v) {
				 	if(eleId=="showTreearea-f"){
				 		if(v.type == "menu"){
							menuManager.dtree.add({
								id:v.pkId,
								pid:v.parentId,
								name:v.menuName,
								url:'javascript:menuManager.getDeptValue(this,'+v.id+',\''+v.menuName+'\',\''+v.type+'\',\''+eleId+'\')'
								});
				 		}	
				 	}else{
				 		if(v.type == "menu"&&v.parentId==0){
							menuManager.dtree.add(
								{
								id:v.pkId,
								pid:v.parentId,
								name:v.menuName,
								url:'javascript:menuManager.getDeptValue(this,'+v.id+',\''+v.menuName+'\',\''+v.type+'\',\''+eleId+'\')'
								});
				 		}
				 	}
				}); 
				menuManager.dtree.init(menuManager.dtree);
				//document.getElementById(this.objId).innerHTML = obj;
				//menuManager.dtree.closeAll();
			
			}
		});
	 
	},getDeptValue:function (obj,id,name,deptType,eleId){
			$('#'+eleId).siblings("input").val(id);
			$('#'+eleId).hide();
			$('#'+eleId).siblings(".job-dept-pop-model-button,.dept-pop-model-button").text(name);
			$('#'+eleId).parent().removeClass("active");
			//清空验证信息
			$('#'+eleId).parent().next(".msg-text").text("");
			
	},formVaild:function (elem){
		var validFlag = true;
		
		var logoUrl = elem.find("input[name='logoUrl']");
		
		/*if(logoUrl.val()==""){
			logoUrl.parent().next(".msg-text").text("请上传图标");
			return false;
		}else{
			logoUrl.parent().next(".msg-text").text("");
		}
		*/
		var realname = elem.find(".realname");
		if(realname.val()==""){
			realname.next(".msg-text").text("请输入名称");
			validFlag = false;
		}else if(realname.val().length>20){
			realname.next(".msg-text").text("请不要超过20个字");
			validFlag = false;
		}else if(_reg.valiLetterEnNumCh(realname)){
			realname.next(".msg-text").text("请输入汉字、英文和数字");
			validFlag = false;
		}else{
			realname.next(".msg-text").text("");
		}
		
		
		if(elem.attr("id")=="edit-menu-info-form"){
			
		}else{
			var identifying = elem.find(".identifying");
			if(identifying.val()==""){
				identifying.next(".msg-text").text("请输入标识");
				validFlag = false;
			}else if(identifying.val().length>200){
				identifying.next(".msg-text").text("请不要超过200个字");
				validFlag = false;
			}else{
				identifying.next(".msg-text").text("");
			}
			
			
			
		}
		
		var menuUrl = elem.find(".menuUrl");
		if(menuUrl.val()==""){
			menuUrl.next(".msg-text").text("请输入代码");
			validFlag = false;
		}else if(menuUrl.val().length>200){
			menuUrl.next(".msg-text").text("请不要超过200个字");
			validFlag = false;
		}else{
			menuUrl.next(".msg-text").text("");
		}
		
		
		var deptHinput = elem.find(".dept-hinput");
		var menuOrder = elem.find(".menuOrder");
		if(elem.attr("id")=="edit-menu-info-form"){
			if(deptHinput.val()==""){
				deptHinput.parent().next(".msg-text").text("请选择上级菜单");
				validFlag = false;
			}else{
				deptHinput.parent().next(".msg-text").text("");
			}
			
			if(menuOrder.val() !="" && menuOrder.val().length>10){
				menuOrder.next(".msg-text").text("请不要超过10个字");
				validFlag = false;
			}else if(menuOrder.val() !="" && isNaN(menuOrder.val())){
				menuOrder.next(".msg-text").text("请输入数字");
				validFlag = false;
			}else{
				menuOrder.next(".msg-text").text("");
			}
						
			
		}else{
			if(deptHinput.val()==""){
				deptHinput.parent().next(".msg-text").text("请选择所属菜单");
				validFlag = false;
			}else{
				deptHinput.parent().next(".msg-text").text("");
			}
			
			
			/*
			if(menuOrder.val()==""){
				menuOrder.next(".msg-text").text("描述不能为空");
				validFlag = false;
			}else{
				menuOrder.next(".msg-text").text("");
			}*/

		}
    var menuOrder = elem.find(".menuOrder");
    console.log(menuOrder);
    if(menuOrder.val()==""){
      menuOrder.next(".msg-text").text("请输入排序");
      validFlag = false;
    }else{
      menuOrder.next(".msg-text").text("");
    }


    return validFlag;
		
	}
	
}
var tmepId=null;  // 选中的树ID
var tmepNaming=null;  // 选中的数名字
var menuType;
var  countMenu;
var treeGrid; // 树对象
$(function(){
	var windowHeight = $(window).height();
	$(".list-content").css("min-height",windowHeight-200);
	//编辑框获取焦点事件
	$("#edit-info table tr td input").focus(function(){
		$(this).next(".msg-text").text("");
	});
	// 加载列表数据:树形 必须包含:id parentId 这两个字段否则树形结构无法形成
	menuManager.getMenuInfo();
 	// 绑定单选按钮选中事件
	 $("input[name='addType']").click(function(){
		 if( $("#addType").val()!=$(this).val()){
			 //清空隐藏的logo地址
			 $(".file-url").val("");
				$("#menuLogo").val("");
				$("#funcLogo").val("");
				/*给显示图片*/
				$(".file-img1").attr("src", "");
			 
			 if($(this).val()==0){
				 $("#dataFormFun").hide();
				 $("#dataForm").show();
				 
					$("#classIdselect").val("SYSTEM");
					$("#addIdMenu").val("0");
			 }else{
				 $("#dataForm").hide();
				 $("#dataFormFun").show();
				
				 $("#addIdFunc").val("0"); 
				
					
			 }
			 $("#addType").val($(this).val());	 
		 }
	 });
 	 
 	 
 	 
 	 /**
	 *新增修改用户
	 * 
	 */
	$("button.add-button,button.update-button").click(function (){
		//系统id
		var systemId = $yt_common.getSystemId();
		/**
		 *清空旧数据 
		 */
		$(".clear-val").val("");
		$(".clear-html,.msg-text").html("");
		$(".icon-pop-model-button").html("点击选中icon图标");
		$("input[name='logoUrl']").val("");
		$("#edit-menu-info-form .dept-pop-model-button").html("请选择上级菜单");
		$("#edit-fun-info-form .dept-pop-model-button").html("请选择所属菜单");
		
		$("#edit-menu-info-form").show();
		$("#edit-fun-info-form").hide();
		$("#type-m").setRadioState(true);
		$('.menu-icon img').attr("src","./resources/images/icons/menu-icon-defoult.png");
		
		/**
		 *分新增修改绑定数据和方法 
		 * 
		 */
		if($(this).hasClass("add-button")){
			$("#edit-info .title-text").text("新增权限");
			$("#edit-info .type-radio").show();
			$("#edit-info .type-text").hide();
			//设置选中类型
			$("#type-m").setRadioState(true);
			//绑定确定事件
			$("#edit-info button.confirm").unbind().bind("click",function (){
				
				
				//通过线束的form表单判断添加菜单或按钮
				if($("#edit-menu-info-form:visible").length==1){
					
					if(menuManager.formVaild($("#edit-menu-info-form"))){
						//表单数据
						var paramData = $("#edit-menu-info-form").serialize();
						//非表单参数
						var otherParam = {
							userItCode:$yt_common.user_info.userItcode,
							systemId:systemId,
							menuType:"SYSTEM"
						};
						//拼接序列化字符串
						paramData = $.addParam(paramData,otherParam);
						//$yt_common.unSerialize(paramData);//反序列化
						$.ajax({
							type:"post",
							url:"tAdmMenu/saveBean",
							async:true,
							data:paramData,
							success:function (data){
								$yt_common.prompt(data.msg)
								if(data.success==0){
									menuManager.getMenuInfo();
									$("#edit-info").hide();
								}
							}
						});
					};
				}else{
					
					if(menuManager.formVaild($("#edit-fun-info-form"))){
						//表单数据
						var paramData = $("#edit-fun-info-form").serialize();
						
						//非表单参数
						var otherParam = {
							userItCode:$yt_common.user_info.userItcode,
							systemId:systemId
						};
						//拼接序列化字符串
						paramData = $.addParam(paramData,otherParam);
						//$yt_common.unSerialize(paramData);
						$.ajax({
							type:"post",
							url:"tAdmFunc/saveBean",
							async:true,
							data:paramData,
							success:function (data){
								$yt_common.prompt(data.msg);
								
								if(data.success==0){
									menuManager.getMenuInfo();
									$("#edit-info").hide();
								}
							}
						});
						
					}
				}
			});
		}else{
			
			$("#edit-info .title-text").text("修改权限");
			$("#edit-info .type-radio").hide();
			$("#edit-info .type-text").show();
			var rowData = treeGrid.getSelectedItem().data;
			if(rowData==null){
				$yt_common.prompt("请选择一行操作");
				return false;
			}
			
			if(rowData.type=="menu"){
				var menuSeq = "";
				$.ajax({
					type:"post",
					url:"tAdmMenu/getBeanById",
					async:false,
					data:{id:rowData.orderId},
					success:function (data){
						var logoUrl = data.logoUrl==""?"./resources/images/icons/menu-icon-defoult.png":data.logoUrl;
						$("#edit-menu-info-form input[name='logoUrl']").val(data.logoUrl);
						$("#edit-menu-info-form input[name='menuName']").val(data.menuName);
						$("#edit-menu-info-form input[name='menuUrl']").val(data.menuUrl);
						$("#edit-menu-info-form input[name='parentId']").val(data.parentId);
						$("#edit-menu-info-form input[name='menuOrder']").val(data.menuOrder);
						$("#edit-menu-info-form .dept-pop-model-button").text(data.parentName==""?"一级菜单":data.parentName);
						$('#edit-menu-info-form .menu-icon img').attr("src",logoUrl);
						menuSeq = data.menuSeq;
					},error:function (){
						$yt_common.prompt("数据请求失败,请稍后重试");
					}
				});
				
				$("#edit-info button.confirm").unbind().bind("click",function (){
					var paramData = $("#edit-menu-info-form").serialize();
					//非表单参数
					var otherParam = {
						userItCode:$yt_common.user_info.userItcode,
						systemId:systemId,
						menuType:"SYSTEM",
						menuSeq:menuSeq,
						pkId:rowData.orderId
					};
					//拼接序列化字符串
					paramData = $.addParam(paramData,otherParam);
					//$yt_common.unSerialize(paramData);//反序列化
					$.ajax({
						type:"post",
						url:"tAdmMenu/updateBean",
						async:false,
						data:paramData,
						success:function (data){
							$yt_common.prompt(data.msg);
							if(data.success==0){
								menuManager.getMenuInfo();
									$("#edit-info").hide();
							}
							
						},error:function (){
							$yt_common.prompt("数据请求失败,请稍后重试");
						}
					});
					
					
				});
				
				
			}else{
				
				$.ajax({
					type:"post",
					url:"tAdmFunc/getBeanById",
					async:false,
					data:{id:rowData.orderId},
					success:function (data){
						var logoUrl = data.logoUrl==""?"./resources/images/icons/menu-icon-defoult.png":data.logoUrl;
						$('#edit-fun-info-form .menu-icon img').attr("src",logoUrl);
						$("#edit-fun-info-form input[name='logoUrl']").val(data.logoUrl);
						$("#edit-fun-info-form input[name='funcName']").val(data.funcName);
						$("#edit-fun-info-form input[name='funcCode']").val(data.funcCode);
						$("#edit-fun-info-form input[name='funcUrl']").val(data.funcUrl);
						$("#edit-fun-info-form input[name='funcDesc']").val(data.funcDesc);
						$("#edit-fun-info-form input[name='menuId']").val(data.menuId);
						$("#edit-fun-info-form .dept-pop-model-button").text(data.menuName);
						menuSeq = data.menuSeq;
					},error:function (){
						$yt_common.prompt("数据请求失败,请稍后重试");
					}
				});
				
				
				$("#edit-info button.confirm").unbind().bind("click",function (){
					
						//表单数据
						var paramData = $("#edit-fun-info-form").serialize();
						
						//非表单参数
						var otherParam = {
							userItCode:$yt_common.user_info.userItcode,
							systemId:systemId,
							pkId:rowData.orderId,
							state:rowData.state
						};
						
						//拼接序列化字符串
						paramData = $.addParam(paramData,otherParam);
						//$yt_common.unSerialize(paramData);
						$.ajax({
							type:"post",
							url:"tAdmFunc/updateBean",
							async:true,
							data:paramData,
							success:function (data){
								$yt_common.prompt(data.msg);
								
								if(data.success==0){
									menuManager.getMenuInfo();
									$("#edit-info").hide();
								}
							}
						});
				});
				$("#edit-menu-info-form").hide();
				$("#edit-fun-info-form").show();
				$("#type-f").setRadioState(true);
		
			}
			
			
			
		}

		$("#edit-info").show();
		
	});
	
	/**
	 *删除方法 
	 * 
	 * 
	 * 
	 * 
	 */
	
	$(".delete-button").click(function (){
		var rowData = treeGrid.getSelectedItem().data;
		if(rowData==null){
			$yt_common.prompt("请选择一行操作");
			return false;
		}else{
			var url = 'tAdmMenu/deleteBeanById';
			if(rowData.type=="func"){
				url = 'tAdmFunc/deleteBeanById';
			}
			$yt_common.Alert({
				title:"删除",//标题
				text:"<div style='line-height: 70px;'>数据删除后无法恢复,请确认?<div>",//提示内容
				haveCancelIcon:false,//右上叉号是否显示默认为显示
				confirmFunction:function (){
					
					$.ajax({
						type:"post",
						url:url,
						data:{id:rowData.orderId},
						async:false,
						success:function (data){
							$yt_common.prompt(data.msg);
							if(data.success==0){
								menuManager.getMenuInfo();
							}
							
						}
					});
				}
			});
		}
		
		
		
	});
	
	/**
	 *启用按钮 
	 * 
	 * 
	 * 
	 */
	
	$(".enable-button").click(function (){
		
		var rowData = treeGrid.getSelectedItem().data;
		if(rowData==null){
			$yt_common.prompt("请选择一行操作");
			return false;
		}else{
			var url = 'tAdmMenu/onUsed';
			var paramData = {menuId:rowData.orderId,userItCode:$yt_common.user_info.userItcode};
			if(rowData.type=="func"){
				url = 'tAdmFunc/onUsed';
				paramData = {funcId:rowData.orderId,userItCode:$yt_common.user_info.userItcode};
			}
			$.ajax({
				type:"post",
				url:url,
				data:paramData,
				async:false,
				success:function (data){
					$yt_common.prompt(data.msg);
					if(data.success==0){
						rowData.state = 1;
						treeGrid.setItemData(rowData);
						$(".enable-button").hide();
						$(".disable-button").show();
						$("#auth_list tr.row_active td:eq(4)").text("启用").css("color","#4aae62");;
					}
					
				}
			});
		}
	});
	
	
	/**
	 *停用 
	 * 
	 * 
	 * 
	 */
	
	$(".disable-button").click(function (){
		
		var rowData = treeGrid.getSelectedItem().data;
		if(rowData==null){
			$yt_common.prompt("请选择一行操作");
			return false;
		}else{
			var url = 'tAdmMenu/outUsed';
			var paramData = {menuId:rowData.orderId,userItCode:$yt_common.user_info.userItcode};
			if(rowData.type=="func"){
				url = 'tAdmFunc/outUsed';
				paramData = {funcId:rowData.orderId,userItCode:$yt_common.user_info.userItcode};
			}
			$.ajax({
				type:"post",
				url:url,
				data:paramData,
				async:false,
				success:function (data){
					$yt_common.prompt(data.msg);
					if(data.success==0){
						rowData.state = 0;
						treeGrid.setItemData(rowData);
						$(".enable-button").show();
						$(".disable-button").hide();
						$("#auth_list tr.row_active td:eq(4)").text("停用").css("color","#ff0000");;
					}
					
				}
			});
		}
	});
	
	
	
	/**
	 *关闭按钮方法 
	 * 
	 * 
	 */
	$(".bottom-btn .cancel").click(function (){
		$(this).parents(".yt-pop-model").hide();
	});
	
	
	
	$(".yt-radio input[type='radio'][name='type']").change(function (){
		if($(this).val()==1){
			$("#edit-menu-info-form").hide();
			$("#edit-fun-info-form").show();
			$("#type-f").setRadioState(true);
			
			var bottom = $("#edit-info").css("bottom");
			var bottomVal = parseInt(bottom.substring(0,bottom.length-2)) -70 ;
			var bottom = $("#edit-info").css("bottom",bottomVal);
		}else{
			$("#edit-menu-info-form").show();
			$("#edit-fun-info-form").hide();
			$("#type-m").setRadioState(true);
			var bottom = $("#edit-info").css("bottom");
			var bottomVal = parseInt(bottom.substring(0,bottom.length-2)) +70 ;
			var bottom = $("#edit-info").css("bottom",bottomVal);
		}
	});
	
	
	/**
	 *选择上级菜单
	 * 
	 */
	$('#edit-menu-info-form .dept-pop-model-button').click(function (){
		
		$(this).next(".dept-pop-model").show();
		$(this).parent().addClass("active");
		menuManager.getDeptTree("showTreearea");
	});
	
	$('#edit-fun-info-form .dept-pop-model-button').click(function (){
		$(this).next(".dept-pop-model").show();
		$(this).parent().addClass("active");
		menuManager.getDeptTree("showTreearea-f");
	});
	
	$("body").delegate("#file-m,#file-f","change",function (obj){
			var me = $(this);
			var param= {yitianSSODynamicKey:$yt_common.getToken(),ajax:1};
			var url  = $yt_option.base_path + "tAscPortraitInfo/addFile?"+$.param(param);
			var id = $(this).attr("id");
			var file = $(this).val();
			var fileExt=file.replace(/.+\./,"");   //正则表达式获取后缀
			if(fileExt.toUpperCase()!="ICO"){
				$(this).parent().siblings(".msg-text").text("文件格式不正确,请重新上传");
				return false ;
			}
			if(obj.target.files[0].size/1024>50){
				$(this).parent().siblings(".msg-text").text("文件过大,请重新上传");
				return false ;
			}
			$.ajaxFileUpload({
	      		url : url,
	      			type : "post",
	      			dataType:'json',
	      			fileElementId :id,
	      			success : function(data, textStatus) {
	      				data = jQuery.parseJSON(data);
	      				if(data.success==0){
	      					var img = new Image();//构造JS的Image对象
	      					var imgSrc =$yt_option.base_path+data.msg; 
	      					img.src =imgSrc;
	      					img.onload=function(){
								var w = img.width;
								var h = img.height;
								if(w!=30||h!=30){
									$("#edit-fun-info-form:visible input[type='file'],#edit-menu-info-form:visible input[type='file']").parent().siblings(".msg-text").text("图片尺寸不正确,请重新上传");
									return false;
								}
		      					$("#edit-fun-info-form:visible input[name='logoUrl'],#edit-menu-info-form:visible input[name='logoUrl']").val($yt_option.base_path+data.msg);
		      					$("#edit-fun-info-form:visible .menu-icon img,#edit-menu-info-form:visible .menu-icon img").attr("src",$yt_option.base_path+data.msg);
		      					$("#edit-fun-info-form:visible input[type='file'],#edit-menu-info-form:visible input[type='file']").val("");
		      					$("#edit-fun-info-form:visible input[type='file'],#edit-menu-info-form:visible input[type='file']").parent().siblings(".msg-text").text("");
							}
	      				}else{
	      					$yt_common.prompt(data.msg);
	      				}
 					},  
	                error: function (data, status, e)//服务器响应失败处理函数  
	                {  
	                    console.log(data);  
	                }  
	            }); 
	})
	
	
	$(".icon-pop-model-button").click(function (){
		$(this).siblings("input[type='file']").click();
	});
 	 
 	 
});




// 点击树,获取单击的一行数据
function itemClickEvent(id, index, data){
	if(data){
		if (data.state == 0) {
			$(".enable-button").show();
			$(".disable-button").hide();
		} else {
			$(".enable-button").hide();
			$(".disable-button").show();
		}
	}
	
}