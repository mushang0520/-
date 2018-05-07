
function Node(id, pid, name, url, title, target, icon, iconOpen, open,checked,nodeData,isDisable) {
	this.id = id;
	this.pid = pid;
	this.name = name;
	this.url = url;
	this.title = title;
	this.target = target;
	this.icon = icon;
	this.iconOpen = iconOpen;
	this._io = open || false;
	this._is = false;
	this._ls = false;
	this._hc = false;
	this._ai = 0;
	this._p;
	this.checked = checked || false;
	this.nodeData = nodeData;
	this.isDisable=isDisable;
};
// Tree object
function dTree(objId,objName,iconPath) {
	this.config = {
		target					: null,
		folderLinks			: true,
		useSelection		: true,
		useCookies			: true,
		useLines				: true,
		useIcons				: true,
		useStatusText		: false,
		closeSameLevel	: false,
		inOrder					: false,
		check:false		//added by wallimn 2009-02-05, to control whether checkbox is showed
	};
	//modified by wallimn 2009-02-05, in order to make client can modify path of icons;
	if(!iconPath)iconPath="img/";//set the default value, be compatible with dtree
	this.icon = {
			root		: iconPath+'base.gif',
			disableRoot : iconPath+'base-dis.gif',//禁用的根节点
			folder		: iconPath+'folder.gif',
			folderOpen	: iconPath+'folderopen.gif',
			node		: iconPath+'page.gif',
			disaNode    : iconPath+'disable-dian.gif',
			empty		: iconPath+'empty.gif',
			line		: iconPath+'line.gif',
			join		: iconPath+'join.gif',
			joinBottom	: iconPath+'joinbottom.gif',
			plus		: iconPath+'plus.gif',
			plusBottom	: iconPath+'plusbottom.gif',
			minus		: iconPath+'minus.gif',
			minusBottom	: iconPath+'minusbottom.gif',
			nlPlus		: iconPath+'nolines_plus.gif',
			nlPlus		: iconPath+'nolines_plus.gif',
			nlMinus		: iconPath+'nolines_minus.gif',
			disableIconOpen  : iconPath+'disable-open.png',//禁用图标打开
			disableIconClose : iconPath+'disable-close.png',//禁用图标关闭
		};
	//added by wallimn, to cache checkbox object and improve speed of set checked status
	this.cbCollection = new Object();
	this.obj = objName;
	this.aNodes = [];
	this.aIndent = [];
	this.checkednodes=[];
	this.root = new Node(-1);
	this.objId = objId;
	this.selectedNode = null;
	this.selectedFound = false;
	this.completed = false;
};

// Adds a new node to the node array
dTree.prototype.add = function(option) {
	this.aNodes[this.aNodes.length] = new Node(option.id,option.pid, option.name, option.url, option.title, option.target, option.icon, option.iconOpen, option.open,option.checked,option.nodeData,option.isDisable);
	if(option.checked){
		this.checkednodes[this.checkednodes.length] = new Node(option.id,option.pid, option.name, option.url, option.title, option.target, option.icon, option.iconOpen, option.open,option.checked,option.nodeData,option.isDisable);
	}
};

// Open/close all nodes
dTree.prototype.openAll = function() {
	this.oAll(true);
};
dTree.prototype.closeAll = function() {
	this.oAll(false);
};

// Outputs the tree to the page
dTree.prototype.toString = function() {
	var str = '<div class="dtree">\n';
	if (document.getElementById) {
		if (this.config.useCookies) this.selectedNode = this.getSelected();
		str += this.addNode(this.root);
	} else str += 'Browser not supported.';
	str += '</div>';
	if (!this.selectedFound) this.selectedNode = null;
	this.completed = true;
	return str;
};

// Creates the tree structure
dTree.prototype.addNode = function(pNode) {
	var str = '';
	var n=0;
	if (this.config.inOrder) n = pNode._ai;
	for (n; n<this.aNodes.length; n++) {
		if (this.aNodes[n].pid == pNode.id) {
			var cn = this.aNodes[n];
			cn._p = pNode;
			cn._ai = n;
			this.setCS(cn);
			if (!cn.target && this.config.target) cn.target = this.config.target;
			if (cn._hc && !cn._io && this.config.useCookies) cn._io = this.isOpen(cn.id);
			if (!this.config.folderLinks && cn._hc) cn.url = null;
			if (this.config.useSelection && cn.id == this.selectedNode && !this.selectedFound) {
					cn._is = true;
					this.selectedNode = n;
					this.selectedFound = true;
			}
			str += this.node(cn, n);
			if (cn._ls) break;
		}
	}
	return str;
};
//get checkbox object by id(input by client)
//added by wallimn,
dTree.prototype.co=function(id){
	if (this.cbCollection[id])return this.cbCollection[id];
	for(var n=0; n<this.aNodes.length; n++){
		if(this.aNodes[n].id==id){
			this.cbCollection[id]=document.getElementById("c"+this.obj+n);
			break;
		}
	}
	return this.cbCollection[id];
};
//获取复选框选择的值的集合
dTree.prototype.getCheckedNodes=function(){
	var res = new Array();
	var cko;//checkobject
	for(var n=0; n<this.aNodes.length; n++){
		//alert("c"+this.obj+n+(document.getElementById("c"+this.obj+n).checked));
		//cache the object to improve speed when you have very,very many nodes and call this function many times in one page
		//i.e. with ajax technology
		//document.getElementById("c"+this.obj+n).checked
		
			cko = this.co(this.aNodes[n].id);
		if(cko !=null){
			if(cko.checked==true){
				res[res.length]=this.aNodes[n];
			}
		}
		
	}
	return res;
}
//复选框取消选中改变腹肌菜单选择状态的方法

//复选框  改变选择状态方法
dTree.prototype.cc=function(nodeId){
	var cs = document.getElementById("c"+this.obj+nodeId).checked;
	var n,node = this.aNodes[nodeId];
	var len =this.aNodes.length;
	for (n=0; n<len; n++) {
		//alert(this.aNodes[n].pid+"--"+this.aNodes[n].id);
		if (this.aNodes[n].pid == node.id) {
			//if (this.aNodes[n]._io) this.nodeStatus(false, n, this.aNodes[n]._ls);
			//this.aNodes[n]._io = false;
			document.getElementById("c"+this.obj+n).checked=cs;
			var classVal = document.getElementById("lc"+this.obj+n).getAttribute("class");
			if(cs){
				//添加的话
				document.getElementById("lc"+this.obj+n).setAttribute("class","check-label yt-checkbox check");
			}else{

				//删除的话
				document.getElementById("lc"+this.obj+n).setAttribute("class","check-label yt-checkbox");
			}
			this.cc(n);		
		}
	}

	if(cs==false)return;
	var pid=node.pid;
	var bSearch;
	do{
		bSearch=false;
		for(n=0;n<len;n++){
			if(this.aNodes[n].id==pid){
				document.getElementById("c"+this.obj+n).checked=true;
				var classVal = document.getElementById("lc"+this.obj+n).getAttribute("class");
				//添加的话
				document.getElementById("lc"+this.obj+n).setAttribute("class","check-label yt-checkbox check");
				pid=this.aNodes[n].pid;
				bSearch= true;				
				break;
			}
		}
	}while(bSearch==true)
}
dTree.prototype.changeParentMenu=function (nodeId) {
  this.cc(nodeId)
  var bSearch1;
  var cs = document.getElementById("c"+this.obj+nodeId).checked;
  var n,node = this.aNodes[nodeId];
  var len =this.aNodes.length;
  var pid=node.pid;
  do{
    bSearch1=false;
		if (!cs){
			let flag1 = false
			for (n=0; n<len; n++) {
				//alert(this.aNodes[n].pid+"--"+this.aNodes[n].id);
				if (this.aNodes[n].pid == node.pid) {
					//if (this.aNodes[n]._io) this.nodeStatus(false, n, this.aNodes[n]._ls);
					//this.aNodes[n]._io = false;
					if(document.getElementById("c"+this.obj+n).checked){
						flag1 = true
						break
					}

				}
			}
			if (!flag1) {
					for(n=0;n<len;n++){
						if(this.aNodes[n].id==pid){
							document.getElementById("c"+this.obj+n).checked=false;
							var classVal = document.getElementById("lc"+this.obj+n).getAttribute("class");
							//添加的话
							document.getElementById("lc"+this.obj+n).setAttribute("class","check-label yt-checkbox");
              node=this.aNodes[n];
							pid=node.pid;
              bSearch1= true;
							break;
						}
					}
					console.log('1111')
			}
		}
  }while(bSearch1)
}


//复选框  改变选择状态方法
dTree.prototype.setcc=function(nodeId){
	document.getElementById("c"+this.obj+nodeId).checked = true;
	document.getElementById("lc"+this.obj+nodeId).setAttribute("class","check-label yt-checkbox check");
	var cs = true;
	var n,node = this.aNodes[nodeId];
	var len =this.aNodes.length;
	for (n=0; n<len; n++) {
		//alert(this.aNodes[n].pid+"--"+this.aNodes[n].id);
		if (this.aNodes[n].pid == node.id) {
			document.getElementById("c"+this.obj+n).checked=cs;
			document.getElementById("lc"+this.obj+n).setAttribute("class","check-label yt-checkbox check");
			this.setcc(n);		
		}
	}

}




// Creates the node icon, url and text
dTree.prototype.node = function(node, nodeId) {
	var str = '<div class="dTreeNode nodeId'+node.id+' ' + ((this.config.useSelection) ? ((node._is ? 'nodeSel' : 'node')) : 'node') + '">' + this.indent(node, nodeId);
	if(this.config.check==true){
		str+= '<label class="check-label yt-checkbox" id="lc'+  this.obj + nodeId + '"><input type="checkbox" class="cx" id="c'+  this.obj + nodeId + '" onclick="javascript:'+this.obj+'.changeParentMenu('+nodeId+')"/></label>';
	}
	if (this.config.useIcons) {
		if (!node.icon) node.icon = (this.root.id == node.pid) ? this.icon.root : ((node._hc) ? (node.isDisable =="2"?this.icon.disableIconClose:this.icon.folder) : (node.isDisable =="2"?this.icon.disaNode:this.icon.node));
		if (!node.iconOpen) node.iconOpen = (node._hc) ?  (node.isDisable =="2"?this.icon.disableIconOpen:this.icon.folderOpen) : (node.isDisable =="2"?this.icon.disaNode:this.icon.node);
		if (this.root.id == node.pid) {
			node.icon = (node.isDisable =="2"?this.icon.disableRoot:this.icon.root);
			node.iconOpen = (node.isDisable =="2"?this.icon.disableRoot:this.icon.root);
		}
		
		if(((node._io)?node.iconOpen : node.icon)!=""){
			if (this.root.id == node.pid) {
				str += '<img id="i' + this.obj + nodeId + '" src="' + ((node._io)?node.iconOpen : node.icon) + '" alt="" style="margin-bottom: 3px;"/>';
			}else{
				str += '<img id="i' + this.obj + nodeId + '" src="' + ((node._io)?node.iconOpen : node.icon) + '" alt="" />';
			}
			
		}
	}
	
	if (node.url) {
		str += '<a id="s' + this.obj + nodeId + '"  href="' + node.url + '"';
		if (node.title) str += ' title="' + node.title + '"';
		if (node.target) str += ' target="' + node.target + '"';
		if (this.config.useStatusText) str += ' onmouseover="window.status=\'' + node.name + '\';return true;" onmouseout="window.status=\'\';return true;" ';
		if (this.config.useSelection && ((node._hc && this.config.folderLinks) || !node._hc))	str += ' onclick="javascript: ' + this.obj + '.s(' + nodeId + ');"';
		str += '>';
	}
	else if ((!this.config.folderLinks || !node.url) && node._hc && node.pid != this.root.id)
		str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');" class="node">';
	str += node.name;
	if (node.url || ((!this.config.folderLinks || !node.url) && node._hc)) str += '</a>';
	str += '</div>';
	if (node._hc) {
		str += '<div id="d' + this.obj + nodeId + '" class="clip" style="display:' + ((this.root.id == node.pid || node._io) ? 'block' : 'none') + ';">';
		str += this.addNode(node);
		str += '</div>';
	}
	this.aIndent.pop();
	//alert(str);
	return str;
};

// Adds the empty and line icons
dTree.prototype.indent = function(node, nodeId) {
	var str = '';
	if (this.root.id != node.pid) {
		for (var n=0; n<this.aIndent.length; n++)
			str += '<img style="margin-right: 0px;" src="' + ( (this.aIndent[n] == 1 && this.config.useLines) ? this.icon.line : this.icon.empty ) + '" alt="" />';
		(node._ls) ? this.aIndent.push(0) : this.aIndent.push(1);
		if (node._hc) {
			str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');"><img id="j' + this.obj + nodeId + '" src="';
			if (!this.config.useLines) str += (node._io) ? this.icon.nlMinus : this.icon.nlPlus;
			else str += ( (node._io) ? ((node._ls && this.config.useLines) ? this.icon.minusBottom : this.icon.minus) : ((node._ls && this.config.useLines) ? this.icon.plusBottom : this.icon.plus ) );
			str += '" alt="" /></a>';
		} else str += '<img  style="margin-right: 0px;" src="' + ( (this.config.useLines) ? ((node._ls) ? this.icon.joinBottom : this.icon.join ) : this.icon.empty) + '" alt="" />';
	}
	return str;
};

// Checks if a node has any children and if it is the last sibling
dTree.prototype.setCS = function(node) {
	var lastId;
	for (var n=0; n<this.aNodes.length; n++) {
		if (this.aNodes[n].pid == node.id) node._hc = true;
		if (this.aNodes[n].pid == node.pid) lastId = this.aNodes[n].id;
	}
	if (lastId==node.id) node._ls = true;
};

// Returns the selected node
dTree.prototype.getSelected = function() {
	var sn = this.getCookie('cs' + this.obj);
	return (sn) ? sn : null;
};

// Highlights the selected node
dTree.prototype.s = function(id) {
	if (!this.config.useSelection) return;
	var cn = this.aNodes[id];
	if (cn._hc && !this.config.folderLinks) return;
	if (this.selectedNode != id) {
		if (this.selectedNode || this.selectedNode==0) {
			eOld = document.getElementById("s" + this.obj + id);
			eOld.className = "node";
		}
		eNew = document.getElementById("s" + this.obj + id);
		eNew.className = "nodeSel";
		this.selectedNode = id;
		if (this.config.useCookies) this.setCookie('cs' + this.obj, cn.id);
	}
};

// Toggle Open or close
dTree.prototype.o = function(id) {
	var cn = this.aNodes[id];
	this.nodeStatus(!cn._io, id, cn._ls);
	cn._io = !cn._io;
	if (this.config.closeSameLevel) this.closeLevel(cn);
	if (this.config.useCookies) this.updateCookie();
};

// Open or close all nodes
dTree.prototype.oAll = function(status) {
	for (var n=0; n<this.aNodes.length; n++) {
		if (this.aNodes[n]._hc && this.aNodes[n].pid != this.root.id) {
			this.nodeStatus(status, n, this.aNodes[n]._ls)
			this.aNodes[n]._io = status;
		}
	}
	if (this.config.useCookies) this.updateCookie();
};

// Opens the tree to a specific node
dTree.prototype.openTo = function(nId, bSelect, bFirst) {
	var mId = nId;
	if(nId!="" && nId!=undefined){
		if (!bFirst) {
		for (var n=0; n<this.aNodes.length; n++) {
			if (this.aNodes[n].id == nId) {
				nId=n;
				break;
			}
		}
		}
		$(".nodeId"+mId).addClass("nodeSel");
		var cn=this.aNodes[nId];
		if (cn.pid==this.root.id || !cn._p) return;
		cn._io = true;
		cn._is = bSelect;
		//var nodeLabel = document.getElementById("d" + nId);
		//$("#sdeptManager.dtree"+nId).parent();
	
		if (this.completed && cn._hc) this.nodeStatus(true, cn._ai, cn._ls);
		if (this.completed && bSelect) this.s(cn._ai);
		else if (bSelect) this._sn=cn._ai;
		this.openTo(cn._p._ai, false, true);
	}
	
};

// Closes all nodes on the same level as certain node
dTree.prototype.closeLevel = function(node) {
	for (var n=0; n<this.aNodes.length; n++) {
		if (this.aNodes[n].pid == node.pid && this.aNodes[n].id != node.id && this.aNodes[n]._hc) {
			this.nodeStatus(false, n, this.aNodes[n]._ls);
			this.aNodes[n]._io = false;
			this.closeAllChildren(this.aNodes[n]);
		}
	}
}

// Closes all children of a node
dTree.prototype.closeAllChildren = function(node) {
	for (var n=0; n<this.aNodes.length; n++) {
		if (this.aNodes[n].pid == node.id && this.aNodes[n]._hc) {
			if (this.aNodes[n]._io) this.nodeStatus(false, n, this.aNodes[n]._ls);
			this.aNodes[n]._io = false;
			this.closeAllChildren(this.aNodes[n]);		
		}
	}
}

// Change the status of a node(open or closed)
dTree.prototype.nodeStatus = function(status, id, bottom) {
	eDiv	= document.getElementById('d' + this.obj + id);
	eJoin	= document.getElementById('j' + this.obj + id);
	if (this.config.useIcons) {
		eIcon	= document.getElementById('i' + this.obj + id);
		eIcon.src = (status) ? this.aNodes[id].iconOpen : this.aNodes[id].icon;
	}
	eJoin.src = (this.config.useLines)?
	((status)?((bottom)?this.icon.minusBottom:this.icon.minus):((bottom)?this.icon.plusBottom:this.icon.plus)):
	((status)?this.icon.nlMinus:this.icon.nlPlus);
	eDiv.style.display = (status) ? 'block': 'none';
};
// [Cookie] Clears a cookie
dTree.prototype.clearCookie = function() {
	var now = new Date();
	var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
	this.setCookie('co'+this.obj, 'cookieValue', yesterday);
	this.setCookie('cs'+this.obj, 'cookieValue', yesterday);
};

// [Cookie] Sets value in a cookie
dTree.prototype.setCookie = function(cookieName, cookieValue, expires, path, domain, secure) 

{
	document.cookie =
		escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
};

// [Cookie] Gets a value from a cookie
dTree.prototype.getCookie = function(cookieName) {
	var cookieValue = '';
	var posName = document.cookie.indexOf(escape(cookieName) + '=');
	if (posName != -1) {
		var posValue = posName + (escape(cookieName) + '=').length;
		var endPos = document.cookie.indexOf(';', posValue);
		if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));
		else cookieValue = unescape(document.cookie.substring(posValue));
	}
	return (cookieValue);
};

// [Cookie] Returns ids of open nodes as a string
dTree.prototype.updateCookie = function() {
	var str = '';
	for (var n=0; n<this.aNodes.length; n++) {
		if (this.aNodes[n]._io && this.aNodes[n].pid != this.root.id) {
			if (str) str += '.';
			str += this.aNodes[n].id;
		}
	}
	this.setCookie('co' + this.obj, str);
};

// [Cookie] Checks if a node id is in a cookie
dTree.prototype.isOpen = function(id) {
	var aOpen = this.getCookie('co' + this.obj).split('.');
	for (var n=0; n<aOpen.length; n++)
		if (aOpen[n] == id) return true;
	return false;
};


// If Push and pop is not implemented by the browser
if (!Array.prototype.push) {
	Array.prototype.push = function array_push() {
		for(var i=0;i<arguments.length;i++)
			this[this.length]=arguments[i];
		return this.length;
	}
};
if (!Array.prototype.pop) {
	Array.prototype.pop = function array_pop() {
		lastElement = this[this.length-1];
		this.length = Math.max(this.length-1,0);
		return lastElement;
	}
};

dTree.prototype.init=function (obj){
	document.getElementById(this.objId).innerHTML = obj;
	this.oAll(false);
	
	for(var k = 0; k <this.checkednodes.length;k++){
		var nodeId = this.checkednodes[k].id;
		var len =this.aNodes.length;
		for (n=0; n<len; n++) {
			if (nodeId == this.aNodes[n].id) {
				document.getElementById("c"+this.obj+n).checked = true;
				document.getElementById("lc"+this.obj+n).setAttribute("class","check-label yt-checkbox check");
				//this.cc(n);
				
			}
		}
	}
	if(this.checkednodes.length>0){
		document.getElementById("c"+this.obj+"0").checked = true;
		document.getElementById("lc"+this.obj+"0").setAttribute("class","check-label yt-checkbox check");
	}
}
	