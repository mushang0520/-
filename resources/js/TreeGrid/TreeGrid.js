/**
 * @author 姚智荣
 * @version 2.0
 * @data 2017-02-10
 */
TreeGrid = function(_config){
	_config = _config || {};
	
	var s = "";
	var rownum = 0;
	var __root;
	
	var __selectedData = null;
	var __selectedId = null;
	var __selectedIndex = null;

	var folderOpenIcon = (_config.folderOpenIcon || TreeGrid.FOLDER_OPEN_ICON);
	var folderCloseIcon = (_config.folderCloseIcon || TreeGrid.FOLDER_CLOSE_ICON);
	var defaultLeafIcon = (_config.defaultLeafIcon || TreeGrid.DEFAULT_LEAF_ICON);
	var positionTableId = positionTableId;
	formatter = function (value, row, index){
		_config.formatter(value, row, index);
		return value;
	};
	//显示表头行
	drowHeader = function(){
		var renderWidth = jQuery("#"+_config.renderTo).width();
		s += "<tr class='header' height='" + (_config.headerHeight || "30") + "'>";
		var cols = _config.columns;
		if(_config.positionTableId){
			var consWidth = 0;
			for(i=0;i<cols.length;i++){
				var col = cols[i];
				consWidth += parseInt(col.width.replace("px","").replace("PX",""));
				cols[i].width = parseInt(col.width.replace("px","").replace("PX",""));
			}
			for(i=0;i<cols.length;i++){
				var col = cols[i];
				s += "<td align='center'><div style='width:" + (Math.floor((col.width/consWidth)*renderWidth)+"px" || "") + "'>" + (col.headerText || "") + "</div></td>";
			}
		}else{
			for(i=0;i<cols.length;i++){
				var col = cols[i];
				s += "<td align='center' width:'"+col.width+"'>" + (col.headerText || "") + "</td>";
			}
		}
		s += "</tr>";
	}
	
	//递归显示数据行
	drowData = function(){
		var rows = _config.data;
		var cols = _config.columns;
		drowRowData(rows, cols, 1, "");
	}
	
	//局部变量i、j必须要用 var 来声明，否则，后续的数据无法正常显示
	drowRowData = function(_rows, _cols, _level, _pid){
		var folderColumnIndex = (_config.folderColumnIndex || 0);

		for(var i=0;i<_rows.length;i++){
			var id = _pid + "_" + i; //行id
			var row = _rows[i];
			
			s += "<tr id='TR" + id + "' pid='" + ((_pid=="")?"":("TR"+_pid)) + "' open='Y' data=\"" + TreeGrid.json2str(row) + "\" rowIndex='" + rownum++ + "'>";
			for(var j=0;j<_cols.length;j++){
				var col = _cols[j];
				s += "<td id='img'";
				var alignValue = (col.dataAlign || _config.dataAlign || "left");
				//层次缩进
				if(j==folderColumnIndex){
					s += " style='padding-left:" + (parseInt((_config.indentation || "20"))*(_level-1)+20) + "px;text-align: "+alignValue+";'>";
				}else{
					s += " style='text-align: "+alignValue+";'>";
				}

				//节点图标
				if(j==folderColumnIndex){
					if(row.children){
						var ms = "<span style='cursor:pointer;'><div onclick='expAll(\"TR"+id+"\")' folder='Y' trid='TR" + id + "' class='image_hand' style='width:auto;background:url("+folderOpenIcon+") no-repeat 0 49%;padding-right:5px;'>";
						//有下级数据
						s += ms;
					}else{
						var ms = '<div style="background:url('+defaultLeafIcon+') no-repeat 0 49%;padding-right:5px;" class="image_nohand">';
						if(row.type == "menu"){
							ms = '<div  style="background:url('+folderOpenIcon+') no-repeat 0 49%;padding-right:5px;" class="image_nohand">';
						}
						s += ms;
					}
				}
				
				
				
				//单元格内容
				if(col.handler){
					s += (eval(col.handler + ".call(new Object(), row, col)") || "") + "</span></div></td>";
				}else{
					var colValue = row[col.dataField];
					if(_config.columns[j].formatter!=null){
						colValue = _config.columns[j].formatter(colValue, row, i,parseInt((_config.indentation || "20"))*(_level-1));
					}
					s += (colValue || "") + "</span></div></td>";
				}
			}
			s += "</tr>";

			//递归显示下级数据
			if(row.children){
				drowRowData(row.children, _cols, _level+1, id);
			}
		}
	}
	
	//主函数
	this.show = function(){
		this.id = _config.id || ("TreeGrid" + TreeGrid.COUNT++);

		s += "<table id='" + this.id + "' cellspacing=0 cellpadding=0 width='" + (_config.width || "100%") + "' class='TreeGrid'>";
		drowHeader();
		if(_config.positionTableId){
			positionTableId
			var titleTable= $(s + "</table>").attr("id",_config.positionTableId+"1");;
			$("#"+_config.positionTableId).replaceWith(titleTable);
		}
		
		drowData();
		s += "</table>";
	
		__root = jQuery("#"+_config.renderTo);
		__root.append(s);
		
		//初始化动作
		init();
	}

	init = function(){
		//以新背景色标识鼠标所指行
		if((_config.hoverRowBackground || "false") == "true"){
			__root.find("tr").hover(
				function(){
					if(jQuery(this).attr("class") && jQuery(this).attr("class") == "header") return;
					jQuery(this).addClass("row_hover");
				},
				function(){
					jQuery(this).removeClass("row_hover");
				}
			);
		}
		//将单击事件绑定到tr标签
		__root.find("tr").bind("click", function(){
			__root.find("tr").removeClass("row_active");
			jQuery(this).addClass("row_active");
			//获取当前行的数据
			__selectedData = this.data || this.getAttribute("data");
			__selectedId = this.id || this.getAttribute("id");
			__selectedIndex = this.rownum || this.getAttribute("rowIndex");

			//行记录单击后触发的事件
			if(_config.itemClick){
				eval(_config.itemClick + "(__selectedId, __selectedIndex, TreeGrid.str2json(__selectedData))");
			}
		});

		//展开、关闭下级节点
		/*__root.find("div[folder='Y']").bind("click", function(){
			var trid = this.trid || this.getAttribute("trid");
			var isOpen = __root.find("#" + trid).attr("open");
			isOpen = (isOpen == "Y") ? "N" : "Y";
			__root.find("#" + trid).attr("open", isOpen);
			showHiddenNode(trid, isOpen);
		});*/
	}

	//显示或隐藏子节点数据
	showHiddenNode = function(_trid, _open){
		if(_open == "N"){ //隐藏子节点
			__root.find("#"+_trid).find("div[folder='Y']").css({"background":'url('+folderCloseIcon+') no-repeat 0 49%',"padding-right":"5px"});
			__root.find("#"+_trid).find("div[folder='Y']").attr("value","1");
			__root.find("tr[id^=" + _trid + "_]").css("display", "none");
		}else{ //显示子节点
			
			__root.find("#"+_trid).find("div[folder='Y']").css({"background":'url('+folderOpenIcon+') no-repeat 0 49%',"padding-right":"5px"});
			__root.find("#"+_trid).find("div[folder='Y']").attr("value","");
			showSubs(_trid);
		}
	}

	//递归检查下一级节点是否需要显示
	showSubs = function(_trid){
		var isOpen = __root.find("#" + _trid).attr("open");
		var imgVla = __root.find("#"+_trid).find("div[folder='Y']").attr("value");
		if(isOpen == "open" && imgVla !=1){
			var trs = __root.find("tr[pid=" + _trid + "]");
			trs.css("display", "");
			
			for(var i=0;i<trs.length;i++){
				showSubs(trs[i].id);
			}
		}
	}

	//展开或收起所有节点
	this.expandAll = function(isOpen){
		var trs = __root.find("tr[pid='']");
		for(var i=0;i<trs.length;i++){
			var trid = trs[i].id || trs[i].getAttribute("id");
			showHiddenNode(trid, isOpen);
		}
	}
	
	this.showOrHidden = function(trid){
		var imgVla = __root.find("#"+trid).find("div[folder='Y']").attr("value");
		if(imgVla == 1){
			showHiddenNode(trid, "Y");
		}else{
			showHiddenNode(trid, "N");
		}
		
	}
	
	//取得当前选中的行记录
	this.getSelectedItem = function(){
		return new TreeGridItem(__root, __selectedId, __selectedIndex, TreeGrid.str2json(__selectedData));
	}
	this.setItemData = function (data){
		__root.find(".row_active").attr("data",TreeGrid.json2str(data));
	}
	
	

};

//公共静态变量
TreeGrid.FOLDER_OPEN_ICON = "resources/js/TreeGrid/images/folderOpen.gif";
TreeGrid.FOLDER_CLOSE_ICON = "resources/js/TreeGrid/images/folderClose.gif";
TreeGrid.DEFAULT_LEAF_ICON = "resources/js/TreeGrid/images/defaultLeaf.gif";
TreeGrid.COUNT = 1;

//将json对象转换成字符串
TreeGrid.json2str = function(obj){
	var arr = [];

	var fmt = function(s){
		if(typeof s == 'object' && s != null){
			if(s.length){
				var _substr = "";
				for(var x=0;x<s.length;x++){
					if(x>0) _substr += ", ";
					_substr += TreeGrid.json2str(s[x]);
				}
				return "[" + _substr + "]";
			}else{
				return TreeGrid.json2str(s);
			}
		}
		return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
	}

	for(var i in obj){
		if(typeof obj[i] != 'object'){ //暂时不包括子数据
			arr.push(i + ":" + fmt(obj[i]));
		}
	}

	return '{' + arr.join(', ') + '}';
}

TreeGrid.str2json = function(s){
	var json = null;
	json = eval("(" + s + ")");
	
	return json;
}

//数据行对象
function TreeGridItem (_root, _rowId, _rowIndex, _rowData){
	var __root = _root;
	
	this.id = _rowId;
	this.index = _rowIndex;
	this.data = _rowData;
	
	this.getParent = function(){
		var pid = jQuery("#" + this.id).attr("pid");
		if(pid!=""){
			var rowIndex = jQuery("#" + pid).attr("rowIndex");
			var data = jQuery("#" + pid).attr("data");
			return new TreeGridItem(_root, pid, rowIndex, TreeGrid.str2json(data));
		}
		return null;
	}
	
	this.getChildren = function(){
		var arr = [];
		var trs = jQuery(__root).find("tr[pid='" + this.id + "']");
		for(var i=0;i<trs.length;i++){
			var tr = trs[i];
			arr.push(new TreeGridItem(__root, tr.id, tr.rowIndex, TreeGrid.str2json(tr.data)));
		}
		return arr;
	}
};

// 单击树:关闭子节点
function expAll(trId){
	  treeGrid.showOrHidden(trId);
};
// 单击树:展开子节点
function expandAll(isOpen){
		treeGrid.expandAll(isOpen);
}
