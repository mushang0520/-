var deptManager = {
	dtree : null,
	deptId : '',
	selTreeData : '',
	getdeptInfo : function() {
		$("#auth_list").html("");
		var deptListData = [];

		$.ajax({
			type : "post",
			url : "tAdmDept/getDeptByParamAll",
			data : {
				systemId : $yt_common.system_id
			},
			async : false,
			success : function(data) {
				deptListData = data
			}
		});

		// 树:配置
		var config = {
			id : "tg1",
			width : "100%",
			renderTo : "auth_list",
			headerAlign : "center",
			dataAlign : "left",
			folderOpenIcon : "resources/images/icons/folderopen.gif",
			folderCloseIcon : "resources/images/icons/folder.gif",
			defaultLeafIcon : "resources/images/icons/icon-dept.png",
			hoverRowBackground : "true",
			folderColumnIndex : "0",
			positionTableId : "position-table-title",
			itemClick : "itemClickEvent",
			columns : [
					{
						headerText : "医院名称",
						dataField : "forShort",
						width : "287px",
						formatter : function(value, row, index, num) {
							var trStr = '<span class="dept-name-span">' + value
									+ '</span>';
							// 判断是否是管理员1.是2.否
							if (row.isSetAdmin == "1") {
								trStr += '<div class="adming-icon-show"></div>';
							}
							return trStr;
						}
					},
					{
						headerText : "医院全称",
						dataField : "deptNameing",
						width : "263px"
					},
					{
						headerText : "描述",
						dataField : "deptRemarks",
						width : "263px"
					},
					{
						headerText : "医院编号",
						dataField : "deptNum",
						dataAlign : "center",
						width : "77px"
					},
					{
						headerText : "排序号",
						dataField : "deptOrder",
						dataAlign : "center",
						width : "56px"
					},
					{
						headerText : "状态",
						dataField : "state",
						dataAlign : "center",
						width : "70px",
						formatter : function(value, row, index) {
							var value = "";
							if (row.state == 0) {
								value = "停用";
								return '<span style="color:#ff0000;">' + value
										+ '</span>';
							} else {
								value = "启用";
								return '<span style="color:#4aae62;">' + value
										+ '</span>';
							}
						}
					} ],
			data : $yt_common.getTreeData(deptListData, 0)
		};
		// 创建一个组件对象
		treeGrid = new TreeGrid(config);
		treeGrid.show();
		$(".auth_list tr").setEvenTrColor();
	},
	getDeptTree : function(eleId) {
		$
				.ajax({
					type : "post",
					url : "tAdmDept/getDeptByParam",
					data : {
						systemId : $("#yt-index-head-sys select").val()
					},
					async : false,
					success : function(data) {
						var urlFlag = "";
						dataObj = data;
						// 要显示的字段
						var fileds = "id,forShort,deptType,isThisAdmin";
						// 获取已转为符合treegrid的json的对象
						var nodes = ConvertToTreeGridJsonDeptSel(dataObj,
								"pkId", "parentId", fileds);
						var testData = eval('(' + JSON.stringify(nodes) + ')');
						if (testData != "" && testData != null
								&& testData.length > 0) {
							$("#sel-dept-tree").show();
							$("#parent-tree")
									.tree(
											{
												data : testData,
												animate : true,
												onClick : function(node) {

													// 收起下拉
													$("#sel-dept-tree").hide();
													// 删除点击框选中样式
													$(
															"#edit-info .dept-manager.manager-button")
															.removeClass(
																	"active");

													// 获取选中的数据
													var oldSelVal = $(
															"#edit-info .form-conten input.dept-hinput")
															.val();
													// 判断是否有权限2没有
													if (node.attributes.isThisAdmin == "2") {
														$("#" + node.domId)
																.removeClass(
																		"tree-node-selected");
													} else {
														// 赋值ID
														$(
																"#edit-info .form-conten input.dept-hinput")
																.val(node.id);
														// 赋值内容
														$(
																"#edit-info .form-conten div.dept-pop-model-button")
																.text(node.text);
													}
													// 清空
													$(
															"#edit-info .dept-manager.manager-button")
															.next(".msg-text")
															.text("");

												},
												onBeforeExpand : function(node) {// 节点展开前触发事件
													// 判断是否是禁用的关闭图标
													if (node.iconCls == "tree-folder-close-disable") {
														$("#" + node.domId)
																.find(
																		"span.tree-icon")
																.removeClass(
																		"tree-folder-close-disable");
														$("#" + node.domId)
																.find(
																		"span.tree-icon")
																.addClass(
																		"tree-folder-disable-open");
													}
												},
												onBeforeCollapse : function(
														node) {// 当节点关闭前
													// 判断是否是禁用的打开图标
													if (node.iconCls == "tree-folder-close-disable") {
														$("#" + node.domId)
																.find(
																		"span.tree-icon")
																.removeClass(
																		"tree-folder-disable-open");
														$("#" + node.domId)
																.find(
																		"span.tree-icon")
																.addClass(
																		"tree-folder-close-disable");
													}
												}
											});
							// 获取选中的数据
							var oldSelVal = $(
									"#edit-info .form-conten input.dept-hinput")
									.val();
							var editFlag = $("#edit-info .model-title").attr(
									"editflag");

							// 获取根节点
							var rootNode = $('#parent-tree').tree('getRoot');
							if (rootNode.attributes.isThisAdmin == "2") {
								$("#" + rootNode.domId).find("span.tree-title")
										.css({
											"color" : "#999",
											"cursor" : "default"
										});
							} else {
								$("#" + rootNode.domId).find("span.tree-title")
										.css({
											"color" : "#333",
											"cursor" : "pointer"
										});
							}
							// 获取子节点
							var childNode = $('#parent-tree').tree(
									'getChildren', rootNode.target);
							$
									.each(
											childNode,
											function(i, n) {
												// 判断是否有权限2没有
												if (n.attributes.isThisAdmin == "2") {
													$("#" + n.domId)
															.find(
																	"span.tree-title")
															.css(
																	{
																		"color" : "#999",
																		"cursor" : "default"
																	});
												} else {
													$("#" + n.domId)
															.find(
																	"span.tree-title")
															.css(
																	{
																		"color" : "#333",
																		"cursor" : "pointer"
																	});
												}
												if (n.children) {
													$("#" + n.domId)
															.find(
																	"span.tree-icon")
															.removeClass(
																	"tree-folder-child");
												}
												// 判断如果是部门,给小小字体
												if (n.attributes.deptType == "2") {
													$("#" + n.domId)
															.find(
																	"span.tree-title")
															.css(
																	{
																		"font-size" : "12px"
																	});
												}
												// 新增操作时
												if (oldSelVal != "") {
													if (oldSelVal == n.id) {
														var parentNode = "";
														parentNode = $(
																'#parent-tree')
																.tree(
																		'getParent',
																		n.target);
														// 选中
														$("#" + n.domId)
																.addClass(
																		"tree-node-selected");
														// 展开父节点
														$("#parent-tree")
																.tree(
																		'expand',
																		parentNode.target);
													}
												}
												var editFlag = $(
														"#edit-info .model-title")
														.attr("editflag");
												// 修改操作时,移除到当前节点和他的子节点
												if (deptManager.deptId != ""
														&& editFlag == "2") {
													if (deptManager.deptId == n.id) {
														var parentNode = $(
																'#parent-tree')
																.tree(
																		'getParent',
																		n.target);
														// 展开父节点
														$("#parent-tree")
																.tree(
																		'expand',
																		parentNode.target);
														// 移除当前节点和子节点
														$("#parent-tree").tree(
																'remove',
																n.target);
													}
												}
											});
						}
					}
				});

	},
	getDeptValue : function(obj, id, name, eleId) {
		$('#' + eleId).siblings("input").val(id);
		$('#' + eleId).hide();
		$('#' + eleId).parent().removeClass("active");
		$('#' + eleId).siblings(".dept-pop-model-button").text(name);
	},
	formVaild : function(elem, deptId) {
		var result = true;
		var realname = elem.find("input[name='forShort']");
		if (realname.val() == "") {
			realname.next(".msg-text").text("请输入医院名称");
			result = false;
		} else if (realname.val().length > 30) {
			realname.next(".msg-text").text("请不要超过30个字");
			result = false;
		} else {
			realname.next(".msg-text").text("");
		}

		var deptNameing = elem.find("input[name='deptNameing']");
		if (deptNameing.val() == "") {
			deptNameing.next(".msg-text").text("请输入医院全称");
			result = false;
		} else if (deptNameing.val().length > 100) {
			deptNameing.next(".msg-text").text("请不要超过100个字");
			result = false;
		} else {
			deptNameing.next(".msg-text").text("");
		}

		var parentId = elem.find("input[name='parentId']");
		if (parentId.val() == "") {
			parentId.parent().next(".msg-text").text("请选择所属上级");
			result = false;
		} else {
			parentId.parent().next(".msg-text").text("");
		}

		var deptNum = elem.find("input[name='deptNum']");
		if (deptNum.val() == "") {
			deptNum.next(".msg-text").text("请输入医院编号");
			result = false;
		} else if (deptNum.val().length > 10) {
			deptNum.next(".msg-text").text("请不要超过10个字");
			result = false;
		} else if (_reg.valiNum(deptNum)) {
			deptNum.next(".msg-text").text("请输入数字");
			result = false;
		} else {
			$.ajax({
				type : "post",
				url : "tAdmDept/getDeptNumIsHave",
				async : false,
				data : {
					pkId : deptId,
					deptNum : deptNum.val()
				},
				success : function(data) {
					if (data.deptNumIsHave == 0) {
						deptNum.next(".msg-text").text("");
					} else {
						deptNum.next(".msg-text").text("编号已存在，请重新输入");
						result = false;
					}
				}
			});
		}
		// v1.0.2新增字段排序号
		var deptOrder = elem.find("input[name='deptOrder']");
		if (deptOrder.val() != "" && deptOrder.val().length > 10) {
			deptOrder.next(".msg-text").text("请不要超过10个字");
			result = false;
		} else if (deptOrder.val() != "" && _reg.valiNum(deptOrder)) {
			deptOrder.next(".msg-text").text("请输入数字");
			result = false;
		} else {
			deptOrder.parent().next(".msg-text").text("");
		}

		var deptRemarks = elem.find("textarea[name='deptRemarks']");
		if (deptRemarks.val() != "" && deptRemarks.val().length > 50) {
			deptRemarks.parent().next(".msg-text").text("请不要超过50个字");
			deptRemarks = false;
		} else {
			deptRemarks.parent().next(".msg-text").text("");
		}
		return result;

	},
	/**
	 * 
	 * 关联职位相关操作事件
	 * 
	 */
	relationPositionEvent : function() {
		/**
		 * 点击关联职位按钮
		 */

		$("button.relation-posi-button").off().on("click", function() {
			var rowData = treeGrid.getSelectedItem().data;
			if (rowData == null) {
				$yt_common.prompt("请选择一行操作");
				return false;
			} else {
				// 调用查询职位信息方法
				deptManager.getPositionByDept(rowData.pkId);
				// 显示关联部门的弹出框
				$(".rela-position-model").show();
			}
		});
		/**
		 * 点击关联部门弹出框中的搜索按钮
		 */
		$(".rela-position-model .model-search-btn").off().on(
				"click",
				function() {
					var rowData = treeGrid.getSelectedItem().data;
					// 获取职位名称
					var positionName = $(
							".rela-position-model .rela-dept-search").val();
					// 调用查询职位信息方法
					deptManager.getPositionByDept(rowData.pkId, positionName);
				});
		/**
		 * 联部门弹出框中的搜索框回车事件
		 */
		$(".rela-position-model .rela-dept-search").on(
				"keyup",
				function(event) {
					var rowData = treeGrid.getSelectedItem().data;
					// 获取职位名称
					var positionName = $(
							".rela-position-model .rela-dept-search").val();
					// 调用查询职位信息方法
					deptManager.getPositionByDept(rowData.pkId, positionName);
				});
		/**
		 * 点击关联部门弹出框中的确定按钮
		 */
		$(".rela-position-model .confirm")
				.off()
				.on(
						"click",
						function() {
							var rowData = treeGrid.getSelectedItem().data;
							// 获取已选的职位信息
							var positionCodes = "";
							if ($(".rela-position-model .role-right-list ul li").length > 0) {
								$
										.each(
												$(".rela-position-model .role-right-list ul li"),
												function(i, n) {
													positionCodes += $(n).find(
															".posiId").val()
															+ ",";
												});
							}
							$
									.ajax({
										type : "post",
										url : "tAdmDept/updatePositionByDept",
										async : true,
										data : {
											deptId : rowData.pkId,
											positionCodes : positionCodes
										},
										success : function(data) {
											$yt_common.prompt(data.msg);
											if (data.success == 0) {
												// 操作成功关闭弹出框
												$(
														".rela-position-model,#pop-modle-alert")
														.hide();
											}
										}
									});
						});
		// 点击取消按钮
		$("#rela-position button.cancel").click(function() {
			$(".rela-position-model .rela-dept-search").val("");
		});
	},
	/**
	 * 获取关联职位信息
	 * 
	 * @param {Object}
	 *            deptId 组织ID
	 */
	getPositionByDept : function(deptId, positionName) {
		// 职位名称
		positionName = positionName == undefined ? "" : positionName;
		$
				.ajax({
					type : "post",
					url : "tAdmDept/getPositionByDept",
					data : {
						deptId : deptId,
						selectData : positionName
					},
					async : false,
					success : function(data) {
						if (data.success == 0) {
							$(
									".rela-position-model .role-left-list ul,.rela-position-model .role-right-list ul")
									.empty();
							var liStr = "";
							$
									.each(
											data.obj,
											function(i, n) {
												liStr = '<li><input type="hidden" class="posiId" value="'
														+ n.positionCode
														+ '">'
														+ n.positionName
														+ '</li>';
												// 判断是否选中1.已选,2未选
												if (n.isSelect == "2") {
													$(
															".rela-position-model .role-left-list ul")
															.append(liStr);
												} else {
													$(
															".rela-position-model .role-right-list ul")
															.append(liStr);
												}
											});
							/*
							 * 选中数据的操作事件
							 */
							$(".role-left-list ul li,.role-right-list ul li")
									.on("click", function() {
										$(this).toggleClass("active");
									});
							$(".set-role-button .d-right")
									.on(
											"click",
											function() {
												$(".role-right-list ul")
														.append(
																$(".role-left-list ul li"));

												$(".role-right-list ul li span")
														.unbind()
														.bind(
																"click",
																function() {
																	var posiId = $(
																			this)
																			.siblings(
																					".posiId")
																			.val();
																	var dataObj = $(
																			this)
																			.find(
																					"input");
																});
											});
							$(".set-role-button .d-left").on(
									"click",
									function() {
										$(".role-right-list ul li span")
												.remove();
										$(".role-left-list ul").append(
												$(".role-right-list ul li"));

									})
							$(".set-role-button .right")
									.on(
											"click",
											function() {
												$(".role-right-list ul")
														.append(
																$(".role-left-list ul li.active"));
											})

							$(".set-role-button .left")
									.on(
											"click",
											function() {
												$(
														".role-right-list ul li.active span")
														.remove();
												$(".role-left-list ul")
														.append(
																$(".role-right-list ul li.active"));
											})

							$(".role-right-list ul li span").unbind().bind(
									"click",
									function() {
										var posiId = $(this)
												.siblings(".posiId").val();
										var dataObj = $(this).find("input");
									});
						}

					}
				});
	},
	/*
	 * 
	 * 
	 * 设置管理员操作方法
	 * 
	 * 
	 */
	setAdminEvent : function() {
		var addUserIds = "";
		var deleteUserIds = "";
		/**
		 * 设置管理员
		 */
		$("button.set-admin-button").off().on("click", function() {
			var rowData = treeGrid.getSelectedItem().data;
			if (rowData == null) {
				$yt_common.prompt("请选择一行操作");
				return false;
			} else {
				// 显示设置管理员弹出框
				$("#set-admin-model").show();
				// 清空
				$("#set-admin-model .right-user-data ul").empty();
				// 调用根据组织查询人员的方法
				//deptManager.getUserInfoByDeptIdByName(rowData.pkId);
			}
		});
		/**
		 * 模糊查询查询用户信息
		 */
		$("#set-admin-model .model-search-btn").off().on("click", function() {
			var rowData = treeGrid.getSelectedItem().data;
			// 获取输入框内容
			var userName = $("#set-admin-model .set-admin-inpu").val();
			// 调用根据组织查询人员的方法
			//deptManager.getUserInfoByDeptIdByName(rowData.pkId, userName);
		});
		/**
		 * 输入框键盘输入事件
		 */
		$("#set-admin-model .set-admin-inpu").off().on("keyup", function() {
			var rowData = treeGrid.getSelectedItem().data;
			// 调用根据组织查询人员的方法
			//deptManager.getUserInfoByDeptIdByName(rowData.pkId, $(this).val());
		});
		/**
		 * 将选中的值赋值给右侧框
		 */
		$("#set-admin-model .set-role-button .right")
				.off()
				.on(
						"click",
						function() {
							// 获取左侧树形选中的数据
							var nodes = $('#user-tree').tree('getChecked');
							var liStr = "";
							var rightData = $("#set-admin-model .right-user-data ul li .hid-user-Id");
							var righDataStr = ",";
							$.each(rightData, function(i, d) {
								righDataStr += $(d).val() + ",";
							});
							if (nodes.length > 0) {
								for ( var i = 0; i < nodes.length; i++) {
									if (righDataStr.indexOf("," + nodes[i].id
											+ ",") == -1
											&& nodes[i].attributes.deptType == "3") {
										liStr = '<li><input type="hidden" class="hid-user-Id" value="'
												+ nodes[i].id
												+ '"/>'
												+ nodes[i].text + '</li>';
										$(
												"#set-admin-model .right-user-data ul")
												.append(liStr);
									}
								}
								/*
								 * 选中数据的操作事件
								 */
								$("#set-admin-model .right-user-data ul li")
										.on("click", function() {
											$(this).toggleClass("active");
										});
							}
						});
		/**
		 * 删除右侧选中的数据
		 */
		$("#set-admin-model .set-role-button .left")
				.off()
				.on(
						"click",
						function() {
							var selDatas = [];
							$(
									"#set-admin-model .right-user-data ul li.active .hid-user-Id")
									.each(function(i, n) {
										// deleteUserIds
										// +=$(n).val().substring(1)+",";
										selDatas.push($(n).val());
									});
							// 调用左侧树形选中的方法
							deptManager.canelCheckedNode(selDatas);
							$("#set-admin-model .right-user-data ul li.active")
									.remove();
						});
		/**
		 * 删除右侧所有数据
		 */
		$("#set-admin-model .set-role-button .d-left").off().on(
				"click",
				function() {
					var selDatas = [];
					$("#set-admin-model .right-user-data ul li .hid-user-Id")
							.each(
									function(i, n) {
										if ($(n).val() != "P"
												+ $yt_common.user_info.pkId) {
											// deleteUserIds
											// +=$(n).val().substring(1)+",";
											selDatas.push($(n).val(), "all");
										}
									});
					// 调用左侧树形选中的方法
					deptManager.canelCheckedNode(selDatas);
					// 移除所有右侧数据不包括,当前登录人
					$("#set-admin-model .right-user-data ul li:not(.user-dis)")
							.remove();
				});
		/**
		 * 点击确定按钮执行保存操作
		 */
		$("#set-admin-model .confirm")
				.off()
				.on(
						"click",
						function() {
							var rowData = treeGrid.getSelectedItem().data;
							// 获取选中的人员数据
							var userIds = "";
							deleteUserIds = ",";
							$.each(deptManager.selTreeData, function(i, v) {
								deleteUserIds += v.id.substring(1) + ",";
							});

							var rightData = $("#set-admin-model .right-user-data ul li .hid-user-Id");
							var righDataStr = ",";
							addUserIds = "";
							$
									.each(
											rightData,
											function(i, d) {
												if (deleteUserIds.indexOf(","
														+ $(d).val().substring(
																1) + ",") == -1) {
													addUserIds += $(d).val()
															.substring(1)
															+ ",";
												} else {
													deleteUserIds = deleteUserIds
															.replace(
																	","
																			+ $(
																					d)
																					.val()
																					.substring(
																							1)
																			+ ",",
																	",");
												}
											});

							$.ajax({
								type : "post",
								url : "tAdmDept/updateDeptToAdminUser",
								async : true,
								data : {
									deptId : rowData.pkId,
									addUserIds : addUserIds,
									deleteUserIds : deleteUserIds
								},
								success : function(data) {
									$yt_common.prompt(data.msg);
									if (data.success == 0) {
										// 调用列表方法
										deptManager.getdeptInfo();
										// 清空搜索框
										$("#set-admin-model .set-admin-inpu").val("");
										// 隐藏弹出框
										$("#set-admin-model,#pop-modle-alert").hide();
									}
								}
							});
						});
		/**
		 * 单击取消按钮
		 */
		$("#set-admin-model .cancel").on("click", function() {
			$("#set-admin-model .set-admin-inpu").val("");
		});
	},
	/**
	 * 取消选中的节点
	 * 
	 * @param {Object}
	 *            selDatas 右侧数据
	 * @param {Object}
	 *            flag 标识是全部还是单个
	 */
	canelCheckedNode : function(selDatas, flag) {
		// 获取根节点
		var rootNode = $('#user-tree').tree('getRoot');
		// 获取子节点
		var childNode = $('#user-tree').tree('getChildren', rootNode.target);
		// 获取父节点
		var parentNode = "";
		// 父级的父级
		var parentsNode = "";
		$.each(childNode, function(i, n) {
			$.each(selDatas, function(i, s) {
				if (n.id == selDatas[i]) {
					// 去除选中状态和样式
					$("#user-tree").tree("uncheck", n.target);
					$("#" + n.domId).find("span.tree-title").css("color",
							"#333");
					if (flag != undefined && flag == "all") {
						// 获取父节点
						parentNode = $("#user-tree")
								.tree('getParent', n.target);
						// 父级的父级
						parentsNode = $("#user-tree").tree('getParent',
								parentNode.target);
						// 关闭父级节点
						$("#user-tree").tree('collapse', parentNode.target);
						$("#user-tree").tree('collapse', parentsNode.target);
					}
				}
			});
		});
	}
}
/*
 * 将一般的JSON格式转为EasyUI TreeGrid树控件的JSON格式 @param rows:json数据对象 @param
 * idFieldName:表id的字段名 @param pidFieldName:表父级id的字段名 @param
 * fileds:要显示的字段,多个字段用逗号分隔
 */
function ConvertToTreeGridJson(rows, idFieldName, pidFieldName, fileds) {
	function exists(rows, ParentId) {
		for ( var i = 0; i < rows.length; i++) {
			if (rows[i][idFieldName] == ParentId)
				return true;
		}
		return false;
	}
	var nodes = [];
	// get the top level nodes
	for ( var i = 0; i < rows.length; i++) {
		var row = rows[i];
		if (!exists(rows, row[pidFieldName])) {
			var data = {
				id : row[idFieldName],
				text : '',
				"iconCls" : '',
				"attributes" : {
					"deptType" : '',
					"isThisAdmin" : ""
				}
			}
			var arrFiled = fileds.split(",");
			for ( var j = 0; j < arrFiled.length; j++) {
				if (arrFiled[j] != idFieldName)
					data.text = row[arrFiled[1]];
				data.attributes.deptType = row[arrFiled[2]];
				data.attributes.isThisAdmin = row[arrFiled[3]];

				// 判断是否是管理员
				if (row[arrFiled[3]] == "2") {
					data.iconCls = 'tree-root-disable';
				} else {
					data.iconCls = 'tree-root-def';
				}

			}
			if (data != null) {
				nodes.push(data);
			}

		}
	}
	console.info("根目录nodes：" + JSON.stringify(nodes));
	/**
	 * 子级数据获取
	 */
	var toDo = [];
	var treeChildObj = {
		id : '',
		text : '',
		checked : ''
	}
	var treeChildStr = "id,text,checked";
	treeChildStr = treeChildStr.split(",");
	for ( var i = 0; i < nodes.length; i++) {
		toDo.push(nodes[i]);
	}
	while (toDo.length) {
		var node = toDo.shift(); // the parent node
		// get the children nodes
		for ( var i = 0; i < rows.length; i++) {
			var row = rows[i];
			if (row[pidFieldName] == node.id) {
				var child = {
					id : row[idFieldName],
					text : '',
					checked : '',
					"state" : '',
					"attributes" : {
						"deptType" : '',
					}
				};
				var arrFiled = fileds.split(",");
				for ( var j = 0; j < arrFiled.length; j++) {
					if (arrFiled[j] != idFieldName) {
						child.text = row[arrFiled[1]];
						child.checked = (row[arrFiled[2]] == "1" ? true : false);
						child.attributes.deptType = row[arrFiled[3]];
						if (row[arrFiled[3]] == "1") {
							child.state = "closed";
						}
					}
				}
				if (node.children) {
					node.children.push(child);
				} else {
					node.children = [ child ];
				}
				toDo.push(child);
			}
		}
	}
	return nodes;
};

var tmepId = null; // 选中的树ID
var tmepNaming = null; // 选中的数名字
var deptType;
var countdept;
var treeGrid; // 树对象
$(function() {
	var windowHeight = $(window).height();
	$(".list-content").css("min-height", windowHeight - 200);
	// 加载列表数据:树形 必须包含:id parentId 这两个字段否则树形结构无法形成
	deptManager.getdeptInfo();
	// 调用关联职位相关操作事件方法
	deptManager.relationPositionEvent();

	// 调用设置管理员操作方法
	deptManager.setAdminEvent();

	// 编辑框获取焦点,清空提示信息
	$("#edit-info table.form-conten tr td input").focus(function() {
		$(this).next(".msg-text").text("");
	});

	// 绑定单选按钮选中事件
	$("input[name='addType']").click(function() {
		if ($("#addType").val() != $(this).val()) {
			// 清空隐藏的logo地址
			$(".file-url").val("");
			$("#deptLogo").val("");
			$("#funcLogo").val("");
			/* 给显示图片 */
			$(".file-img1").attr("src", "");

			if ($(this).val() == 0) {
				$("#dataFormFun").hide();
				$("#dataForm").show();

				$("#classIdselect").val("SYSTEM");
				$("#addIddept").val("0");
			} else {
				$("#dataForm").hide();
				$("#dataFormFun").show();

				$("#addIdFunc").val("0");

			}
			$("#addType").val($(this).val());
		}
	});

	/**
	 * 新增修改用户
	 * 
	 */
	$("button.add-button,button.update-button")
			.click(
					function() {

						// 系统id
						var systemId = $yt_common.getSystemId();
						/**
						 * 清空旧数据
						 */
						$(".clear-val").val("");
						$(".clear-html,.msg-text").html("");
						$("#edit-dept-info-form .dept-pop-model-button").html(
								"请选择上级目录");
						$("#type-m").setRadioState(true);

						/**
						 * 分新增修改绑定数据和方法
						 * 
						 */
						if ($(this).hasClass("add-button")) {
							$("#edit-info .title-text").text("新增医院");
							$(".model-title").attr("editFlag", 1);
							// 设置选中类型
							$("#type-m").setRadioState(true);
							// 绑定确定事件
							$("#edit-info button.confirm")
									.unbind()
									.bind(
											"click",
											function() {
												// 通过线束的form表单判断添加菜单或按钮
												// 表单数据
												var paramData = $(
														"#edit-dept-info-form")
														.serialize();
												// 非表单参数
												var otherParam = {
													createTimeBy : $yt_common.user_info.userItcode,
												};
												// 拼接序列化字符串
												paramData = $.addParam(
														paramData, otherParam);
												if (deptManager
														.formVaild(
																$("#edit-dept-info-form"),
																0)) {
													$
															.ajax({
																type : "post",
																url : "tAdmDept/saveBean",
																async : true,
																data : paramData,
																success : function(
																		data) {
																	$yt_common
																			.prompt(data.msg)
																	if (data.success == 0) {
																		deptManager
																				.getdeptInfo();
																		$(
																				"#edit-info")
																				.hide();
																	}
																}
															});
												}
												// $yt_common.unSerialize(paramData);//反序列化
											});
						} else {
							$("#edit-info .title-text").text("修改医院");
							$(".model-title").attr("editFlag", 2);
							var rowData = treeGrid.getSelectedItem().data;
							if (rowData == null) {
								$yt_common.prompt("请选择一行操作");
								return false;
							}

							$
									.ajax({
										type : "post",
										url : "tAdmDept/getBeanById",
										async : false,
										data : {
											pkId : rowData.pkId
										},
										success : function(data) {
											deptManager.deptId = data.pkId;
											$(
													"#edit-dept-info-form input[name='forShort']")
													.val(data.forShort);
											$(
													"#edit-dept-info-form input[name='deptNameing']")
													.val(data.deptNameing);
											$(
													"#edit-dept-info-form textarea[name='deptRemarks']")
													.val(data.deptRemarks);
											$(
													"#edit-dept-info-form input[name='deptNum']")
													.val(data.deptNum);
											$(
													"#edit-dept-info-form input[name='parentId']")
													.val(data.parentId);
											$(
													"#edit-dept-info-form .dept-pop-model-button")
													.text(data.parentName);
											$(
													"#edit-dept-info-form input[name='deptOrder']")
													.val(data.deptOrder);
											$(
													"#edit-dept-info-form input[name='deptType'][value="
															+ data.deptType
															+ "]")
													.setRadioState(true);
										},
										error : function() {
											$yt_common.prompt("数据请求失败,请稍后重试");
										}
									});
							$("#edit-info button.confirm")
									.unbind()
									.bind(
											"click",
											function() {
												// 通过线束的form表单判断添加菜单或按钮
												// 表单数据
												var paramData = $(
														"#edit-dept-info-form")
														.serialize();
												// 非表单参数
												var otherParam = {
													createTimeBy : $yt_common.user_info.userItcode,
													pkId : rowData.pkId
												};
												// 拼接序列化字符串
												paramData = $.addParam(
														paramData, otherParam);
												if (deptManager
														.formVaild(
																$("#edit-dept-info-form"),
																rowData.pkId)) {
													$
															.ajax({
																type : "post",
																url : "tAdmDept/updateBean",
																async : true,
																data : paramData,
																success : function(
																		data) {
																	$yt_common
																			.prompt(data.msg)
																	if (data.success == 0) {
																		deptManager
																				.getdeptInfo();
																		$(
																				"#edit-info")
																				.hide();
																	}
																}
															});
												}
												// $yt_common.unSerialize(paramData);//反序列化

											});

						}

						$("#edit-info").show();

					});

	/**
	 * 删除方法
	 * 
	 * 
	 * 
	 * 
	 */

	$(".delete-button").click(function() {
		var rowData = treeGrid.getSelectedItem().data;
		if (rowData == null) {
			$yt_common.prompt("请选择一行操作");
			return false;
		} else {
			var url = 'tAdmDept/deleteBeanById';
			$yt_common.Alert({
				title : "删除",// 标题
				text : "<div style='line-height: 70px;'>数据删除后无法恢复,请确认?<div>",// 提示内容
				haveCancelIcon : false,// 右上叉号是否显示默认为显示
				confirmFunction : function() {

					$.ajax({
						type : "post",
						url : url,
						data : {
							id : rowData.pkId
						},
						async : false,
						success : function(data) {
							$yt_common.prompt(data.msg);
							if (data.success == 0) {
								deptManager.getdeptInfo();
							}

						}
					});
				}
			});
		}
	});

	/**
	 * 启用按钮
	 * 
	 * 
	 * 
	 */

	$(".enable-button").click(
			function() {

				var rowData = treeGrid.getSelectedItem().data;
				if (rowData == null) {
					$yt_common.prompt("请选择一行操作");
					return false;
				} else {
					var url = 'tAdmDept/onUsed';

					$.ajax({
						type : "post",
						url : url,
						data : {
							deptId : rowData.pkId
						},
						async : false,
						success : function(data) {
							$yt_common.prompt(data.msg);
							if (data.success == 0) {
								rowData.state = 1;
								treeGrid.setItemData(rowData);
								$(".enable-button").hide();
								$(".disable-button").show();
								$("#auth_list tr.row_active td:last")
										.text("启用").css("color", "#4aae62");
							}
						}
					});
				}
			});

	/**
	 * 停用
	 * 
	 * 
	 * 
	 */

	$(".disable-button").click(
			function() {

				var rowData = treeGrid.getSelectedItem().data;
				if (rowData == null) {
					$yt_common.prompt("请选择一行操作");
					return false;
				} else {
					var url = 'tAdmDept/outUsed';

					$.ajax({
						type : "post",
						url : url,
						data : {
							deptId : rowData.pkId
						},
						async : false,
						success : function(data) {
							$yt_common.prompt(data.msg);
							if (data.success == 0) {
								// deptManager.getdeptInfo();
								rowData.state = 0;
								treeGrid.setItemData(rowData);
								$(".enable-button").show();
								$(".disable-button").hide();
								$("#auth_list tr.row_active td:last")
										.text("停用").css("color", "#ff0000");
							}

						}
					});
				}
			});

	/**
	 * 关闭按钮方法
	 * 
	 * 
	 */
	$(".bottom-btn .cancel").click(function() {
		$(this).parents(".yt-pop-model").hide();
	});

	/**
	 * 选择上级菜单
	 * 
	 */
	$('#edit-dept-info-form .dept-pop-model-button').click(function(event) {
		$(this).next().show();
		$(this).parent().addClass("active");
		deptManager.getDeptTree();
		event.stopPropagation();
	});
	$(document).click(function() {
		$("#sel-dept-tree").hide();
	});

	$("#file-m,#file-f").change(
			function() {
				var me = $(this);
				var param = {
					yitianSSODynamicKey : $yt_common.getToken()
				};
				var id = $(this).attr("id");
				console.log(id);
				var url = $yt_option.base_path + "tAscPortraitInfo/addFile?"
						+ $.param(param);
				$.ajaxFileUpload({
					url : url,
					type : "post",
					fileElementId : id,
					success : function(data, textStatus) {
						$yt_common.prompt(data.msg)
						if (data.success == 0) {
							me.siblings("input[name='logoUrl']").val();
							me.siblings("div").text();
						}
					},
					error : function(data, status, e)// 服务器响应失败处理函数
					{
						console.log(data);
					}
				});
			})

	/**
	 * 上传附件
	 * 
	 * 
	 */
	$("#file").unbind().bind(
			"change",
			function(e) {
				var file = $("#file").val();
				var strFileName = file.replace(
						/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1"); // 正则表达式获取文件名，不带后缀
				if (strFileName == "") {
					$("#file").val("");
					$("#import-pop-file-button").text("点击上传文件");
				} else {
					var FileExt = file.replace(/.+\./, ""); // 正则表达式获取后缀
					var showName = strFileName;
					// 先检索是否存在后缀名
					if (strFileName.indexOf(FileExt) == -1) {
						showName = strFileName + "." + FileExt;
					}
					$(this).next("div").text(showName);
					$(this).attr("title", showName);
				}
			});
	$("#import-pop-file-button").click(function() {
		$(this).siblings("input[type='file']").click();
	});

	/**
	 * 导入按钮
	 * 
	 */
	$(".import-button")
			.click(
					function() {
						$("#import-pop,#q-alert-bg").show();
						$("#import-pop .import-cancel-button").click(
								function() {
									$("#import-pop,#q-alert-bg").hide();
								});
						/**
						 * 下载
						 * 
						 * 
						 * 
						 */
						$("#import-pop .download-button")
								.unbind()
								.bind(
										"click",
										function() {
											var downloadUrl = $yt_option.base_path
													+ "tAdmDept/download?yitianSSODynamicKey="
													+ $yt_common.getToken();
											$yt_common
													.ajax_download_file(downloadUrl);
										});
						/**
						 * 
						 * 
						 * 导入
						 * 
						 * 
						 */
						$("#import-pop .import-confirm-button")
								.click(
										function() {
											var param = {
												yitianSSODynamicKey : $yt_common
														.getToken(),
												createTimeBy : $yt_common.user_info.pkId
											};
											var url = $yt_option.base_path
													+ "tAdmDept/upload?"
													+ $.param(param);
											//判断是否选择文件
											if ($("input.file-button").val() == "") {
												$yt_common.prompt("请选择文件");
												return false;
											}
											$
													.ajaxFileUpload({
														url : url,
														type : "post",
														dataType : 'json',
														fileElementId : 'file',
														success : function(
																data,
																textStatus) {
															var msg = jQuery
																	.parseJSON(data).obj;
															//导入详情信息
															if (msg != null
																	&& msg != "") {
																//总数量
																$(
																		"#import-detail .into-num")
																		.text(
																				msg.all);
																//新增数量
																$(
																		"#import-detail .add-info-num")
																		.text(
																				msg.add);
																//修改数量
																$(
																		"#import-detail .update-info-num")
																		.text(
																				msg.update);
																//失败数量
																$(
																		"#import-detail .erro-info-num")
																		.text(
																				msg.errCount);
																$(
																		"#import-detail .import-info-list tbody")
																		.empty();
																var trStr = "";
																if (msg.errCount > 0) {
																	if (msg.errData != ""
																			&& msg.errData.length > 0) {
																		$
																				.each(
																						msg.errData,
																						function(
																								i,
																								n) {
																							trStr = '<tr>'
																									+ '<td align="center">'
																									+ (i + 1)
																									+ '</td>'
																									+ '<td class="pad"><div style="width:120px;">'
																									+ n.forShort
																									+ '</div></td>'
																									+ '<td align="center"><div style="width:53px;">'
																									+ n.deptNum
																									+ '</div></td>'
																									+ '<td class="pad"><div style="width:207px;">'
																									+ n.deptNameing
																									+ '</div></td>'
																									+ '<td align="center"><div style="width:32px;">'
																									+ n.deptTypeData
																									+ '</div></td>'
																									+ '<td align="center"><div style="width:53px;">'
																									+ n.parentName
																									+ '</div></td>'
																									+ '<td class="pad">'
																									+ n.errMsg
																									+ '</td>'
																									+ '</tr>';
																							$(
																									"#import-detail .import-info-list tbody")
																									.append(
																											trStr);
																						});
																	}
																}
															}
															//显示关联部门的弹出框
															$(
																	".import-detail-model")
																	.show();
															if (jQuery
																	.parseJSON(data).success == 0) {
																deptManager
																		.getdeptInfo();
																$(
																		"#import-pop,#q-alert-bg")
																		.hide();
																$("#file").val(
																		"");
																$(
																		"#import-pop-file-button")
																		.text(
																				"点击上传文件");
															} else {
																$(
																		"#import-pop,#q-alert-bg")
																		.hide();
																//显示失败模块
																$(
																		"#import-detail .error-data,#import-detail .import-info-list,.hid-thead")
																		.show();
																if ($("#import-detail .import-info-list .erro-data-tab")[0].clientHeight > $("#import-detail .import-info-list")[0].offsetHeight) {
																	$(
																			"#import-detail .hid-thead table")
																			.css(
																					"margin",
																					"0");
																} else {
																	$(
																			"#import-detail .hid-thead table")
																			.css(
																					"margin",
																					"0px auto");
																}
															}
															getDivPosition($(".import-detail-model .model-midd-cont"));
														},
														error : function(data,
																status, e)//服务器响应失败处理函数  
														{
															$yt_common
																	.prompt("文件上传失败");
														}
													});

										});
						//点击关闭按钮
						$(".import-detail-model button.close-btn")
								.click(
										function() {
											$(
													".import-detail-model,#q-alert-bg")
													.hide();
											$("#file").attr("title", "");
											$("#import-pop-file-button").text(
													"点击上传文件");
										});
					});
});
/**
 * 
 * 动态算取div的位置top值left值
 * @param {Object} obj
 */
function getDivPosition(obj) {
	var scrollTop = "";
	var scrollLeft = "";
	var q_alert_top = "";
	var q_alert_left = ($(window).width() - $(obj).width()) / 2;
	q_alert_top = ($(window).height() - $(obj).height() + 100) / 2 - 80;
	if (q_alert_left > 0) {
		$(obj).parent().css("left", q_alert_left + "px");
	} else {
		$(obj).parent().css("left", "0");
	}
	if (q_alert_top > 0) {
		$(obj).parent().css("top", q_alert_top + "px");
	} else {
		$(obj).parent().css("top", "0px");
	}

}
// 点击树,获取单击的一行数据
function itemClickEvent(id, index, data) {
	if (data) {
		//判断是否有权限,1.是2.否,
		if (data.isThisAdmin == "2") {
			//设置按钮禁用
			$(".top-button button.fl:not(.add-button)").hide();
		} else {
			$(".top-button button.fl:not(.add-button)").show();
			//判断状态
			if (data.state == "1") {
				//隐藏启用按钮
				$("button.enable-button").hide();
				$("button.disable-button").show();
			} else {
				//隐藏禁用按钮
				$("button.disable-button").hide();
				//显示启用按钮
				$("button.enable-button").show();
			}
		}
		//判断选中的是公司还是部门1.公司2.部门
		if (data.deptType == "1" && data.isThisAdmin == "1") {

			$("button.relation-posi-button").show();
		} else {

			$("button.relation-posi-button").hide();
		}
	}

}

/*将一般的JSON格式转为EasyUI TreeGrid树控件的JSON格式
 * @param rows:json数据对象
 * @param idFieldName:表id的字段名
 * @param pidFieldName:表父级id的字段名
 * @param fileds:要显示的字段,多个字段用逗号分隔
 */
function ConvertToTreeGridJsonDeptSel(rows, idFieldName, pidFieldName, fileds) {
	function exists(rows, ParentId) {
		for ( var i = 0; i < rows.length; i++) {
			if (rows[i][idFieldName] == ParentId)
				return true;
		}
		return false;
	}
	var nodes = [];
	// get the top level nodes
	for ( var i = 0; i < rows.length; i++) {
		var row = rows[i];
		if (!exists(rows, row[pidFieldName])) {
			var data = {
				id : row[idFieldName],
				text : '',
				"iconCls" : '',
				"attributes" : {
					"deptType" : '',
					"isThisAdmin" : ""
				}
			}
			var arrFiled = fileds.split(",");
			for ( var j = 0; j < arrFiled.length; j++) {
				if (arrFiled[j] != idFieldName)
					data.text = row[arrFiled[1]];
				data.attributes.deptType = row[arrFiled[2]];
				data.attributes.isThisAdmin = row[arrFiled[3]];

				//判断是否是管理员
				if (row[arrFiled[3]] == "2") {
					data.iconCls = 'tree-root-disable';
				} else {
					data.iconCls = 'tree-root-def';
				}

			}
			if (data != null) {
				nodes.push(data);
			}

		}
	}
	console.info("根目录nodes：" + JSON.stringify(nodes));
	/**
	 * 子级数据获取
	 */
	var toDo = [];
	var treeChildObj = {
		id : '',
		text : ''
	}
	var treeChildStr = "id,text";
	treeChildStr = treeChildStr.split(",");
	for ( var i = 0; i < nodes.length; i++) {
		toDo.push(nodes[i]);
	}
	while (toDo.length) {
		var node = toDo.shift(); // the parent node
		// get the children nodes
		for ( var i = 0; i < rows.length; i++) {
			var row = rows[i];
			if (row[pidFieldName] == node.id) {
				var child = {
					id : row[idFieldName],
					text : '',
					"state" : '',
					"iconCls" : '',
					"attributes" : {
						"deptType" : '',
						"isThisAdmin" : ""
					}
				};
				var arrFiled = fileds.split(",");
				for ( var j = 0; j < arrFiled.length; j++) {
					if (arrFiled[j] != idFieldName) {
						child.text = row[arrFiled[1]];
						child.attributes.deptType = row[arrFiled[2]];
						child.attributes.isThisAdmin = row[arrFiled[3]];

						if (row[arrFiled[2]] == "1") {
							child.state = "closed";
							if (row[arrFiled[3]] == "2") {
								child.iconCls = "tree-folder-close-disable";
							}
						} else {
							//判断是否是管理员
							if (row[arrFiled[3]] == "1") {
								child.iconCls = 'tree-folder-child';
							} else {
								child.iconCls = 'tree-folder-disable';
							}
						}
					}
				}
				if (node.children) {
					node.children.push(child);
				} else {
					node.children = [ child ];
				}
				toDo.push(child);
			}
		}
	}
	return nodes;
};