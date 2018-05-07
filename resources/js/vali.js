/*vali 1.0
 *  _reg.valiNum(obj)               验证数字
    _reg.valiNormal(obj)               验证空值
    _reg.valiNormal(obj,num)          验证长度 
    _reg.valiNumPos(obj)              验证正整数七位
    _reg.valiNumNeg(obj)              验证负整数
    _reg.valiNumFloat(obj)             验证浮点数
    _reg.valiLetterEn(obj)               验证英文字母 不限大小写
    _reg.regLetterEnNum(obj)               验证英文字母数字 不限大小写
    _reg.regLetterEnNumCh(obj)               验证英文字母数字汉字不限大小写
    _reg.valiEmail(obj)                     验证邮箱
   _reg.valiTelePhone(obj)               验证固定电话
    _reg.valiCellPhone(obj)                验证手机号
    _reg.valiIdCard(obj)                      验证身份证 非严格模式
    _reg.valiUrl(obj)                              验证URL地址
    _reg.valiArray(obj,obj2)                   两个数组对比
 */
var _reg = {
	regNum : /^[0-9]+$/,  //数字
	regNumPos : /^[1-9]\d{0,7}$/,  //正整数
	regNumNatural: /^\d{0,6}$/,  //自然数
	regNumNeg : /^-[1-9]\d{0,6}$/,  //负整数
	regNumFloat : /(^[1-9]([0-9]{0,10})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,  //浮点数
	regLetterEn : /^[A-Za-z]+$/,  //英文字母 不限大小写
	regLetterEnNum : /^[A-Za-z0-9]+$/,  //英文字母 不限大小写
	regLetterEnNumCh : /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,  //英文字母 不限大小写
	regLetterEnNumChSys : /^[A-Za-z0-9\(\)\-\u4e00-\u9fa5]+$/,  //英文字母 不限大小写
	regEmail : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,  //邮箱
	regEmailPostfix : /^@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,  //邮箱
	regTelePhone : /^\d{3}-\d{8}|\d{4}-\d{7}$/,  //固定电话
	regCellPhone : /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,  //手机号
	regIdCard : /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,  //验证身份证 非严格模式
	regUrl : /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,  //URL地址
	num : 0,  //判断值小于某值
	otherReg : /^otherReg$/,  //其他正则表达式
	filter : function(obj, obj2) {
		_reg.num = (obj2 == undefined || obj2 == null || typeof obj2 == "string") ? 20 : obj2;
		if (obj == undefined || typeof obj == "string") {
			tools.Notice("obj is undefined! From the vali.js");
			return false;
		} else if (typeof obj == "string") {
			return $.trim(obj);
		} else if (typeof obj == "object" && obj.get(0).nodeName == "INPUT") {
			return $(obj).val();
		} else if (typeof obj == "object" && obj.get(0).nodeName == "TEXTAREA") {
			return $(obj).val();
		} else if (obj.length != 0 && obj2.length != 0 && typeof obj2 == "object") {
			$.map(obj, function(index, elem) {
				if ($(elem).val().length > 0) {
					return $(elem).val();
				}
			});
			return (obj.length != obj2.length);
		}
	},
	valiNormal : function(obj, obj2) {
		if (typeof obj2 == "number") {
			return (_reg.filter(obj, obj2).length >= _reg.num) ? true : false;
		} else {
			return (_reg.filter(obj, obj2).length == 0) ? true : false;
		}
	},
	valiNum : function(obj, obj2) {
		return (_reg.regNum.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiNumPos : function(obj, obj2) {
		return (_reg.regNumPos.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiNumNatural : function(obj, obj2) {
		return (_reg.regNumNatural.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiNumNeg : function(obj, obj2) {
		return (_reg.regNumNeg.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiNumFloat : function(obj, obj2) {
		return (_reg.regNumFloat.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiLetterEn : function(obj, obj2) {
		return (_reg.regLetterEn.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiLetterEnNum : function(obj, obj2) {
		return (_reg.regLetterEnNum.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiLetterEnNumCh : function(obj, obj2) {
		return (_reg.regLetterEnNumCh.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiLetterEnNumChSys : function(obj, obj2) {
		return (_reg.regLetterEnNumChSys.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiEmail : function(obj, obj2) {
		return (_reg.regEmail.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiEmailPostfix : function(obj, obj2) {
		return (_reg.regEmailPostfix.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiTelePhone : function(obj, obj2) {
		return (_reg.regTelePhone.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiCellPhone : function(obj, obj2) {
		return (_reg.regCellPhone.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiIdCard : function(obj, obj2) {
		return (_reg.regIdCard.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiUrl : function(obj, obj2) {
		return (_reg.regUrl.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiArray : function(obj, obj2) {
		return (_reg.regNumFloat.test(_reg.filter(obj, obj2))) ? false :true;
	},
	valiOther : function(obj, obj2) {
		if(_reg.otherReg.test("otherReg")){
			tools.Notice("Please reset the otherReg before use this function!!");
		}else{
			return (_reg.otherReg.test(_reg.filter(obj, obj2))) ? false :true;
		}
	}
};
var idCardNoUtil = {
		/*省,直辖市代码表*/
		provinceAndCitys: {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
		31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",
		45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
		65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"},

		/*每位加权因子*/
		powers: ["7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"],

		/*第18位校检码*/
		parityBit: ["1","0","X","9","8","7","6","5","4","3","2"],

		/*性别*/
		genders: {male:"1",female:"2"},

		/*校验地址码*/
		checkAddressCode: function(addressCode){
		 var check = /^[1-9]\d{5}$/.test(addressCode);
		 if(!check) return false;
		 if(idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0,2))]){
		   return true;
		 }else{
		   return false;
		 }
		},
		getAddressCodeName:function(idCardNo){
		     idCardNo = idCardNo.substring(0,6);
		    return idCardNoUtil.provinceAndCitys[parseInt(idCardNo.substring(0,2))];
		    
		},
		/*校验日期码*/
		checkBirthDayCode: function(birDayCode){
		  var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
		  if(!check) return false;    
		  var yyyy = parseInt(birDayCode.substring(0,4),10);
		  var mm = parseInt(birDayCode.substring(4,6),10);
		  var dd = parseInt(birDayCode.substring(6),10);
		var xdata = new Date(yyyy,mm-1,dd);
		if(xdata > new Date()){
		  return false;//生日不能大于当前日期
		}else if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) ){
		  return true;
		}else{
		  return false;
		}
		},

		/*计算校检码*/
		getParityBit: function(idCardNo){
		var id17 = idCardNo.substring(0,17);    
		 /*加权 */
		 var power = 0;
		 for(var i=0;i<17;i++){
		   power += parseInt(id17.charAt(i),10) * parseInt(idCardNoUtil.powers[i]);
		 }              
		 /*取模*/ 
		 var mod = power % 11;
		 return idCardNoUtil.parityBit[mod];
		},

		/*验证校检码*/
		checkParityBit: function(idCardNo){
		 var parityBit = idCardNo.charAt(17).toUpperCase();
		 if(idCardNoUtil.getParityBit(idCardNo) == parityBit){
		     return true;
		 }else{
		     return false;
		 }
		},

		/*校验15位或18位的身份证号码*/
		checkIdCardNo: function(idCardNo){
		//15位和18位身份证号码的基本校验
		var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
		if(!check) return false;
		//判断长度为15位或18位  
		if(idCardNo.length==15){
		    return idCardNoUtil.check15IdCardNo(idCardNo);
		}else if(idCardNo.length==18){
		    return idCardNoUtil.check18IdCardNo(idCardNo);
		}else{
		    return false;
		}
		},

		//校验15位的身份证号码
		check15IdCardNo: function(idCardNo){
		 //15位身份证号码的基本校验
		 var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);   
		 if(!check) return false;
		 //校验地址码
		 var addressCode = idCardNo.substring(0,6);
		 check = idCardNoUtil.checkAddressCode(addressCode);
		 if(!check) return false;
		 var birDayCode = '19' + idCardNo.substring(6,12);
		 //校验日期码
		 return idCardNoUtil.checkBirthDayCode(birDayCode);
		},

		//校验18位的身份证号码
		check18IdCardNo: function(idCardNo){
		 //18位身份证号码的基本格式校验
		 var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
		 if(!check) return false;
		 //校验地址码
		 var addressCode = idCardNo.substring(0,6);
		 check = idCardNoUtil.checkAddressCode(addressCode);
		 if(!check) return false;
		 //校验日期码
		 var birDayCode = idCardNo.substring(6,14);
		 check = idCardNoUtil.checkBirthDayCode(birDayCode);
		 if(!check) return false;
		 //验证校检码   
		 return idCardNoUtil.checkParityBit(idCardNo);   
		},

		formateDateCN: function(day){
		   var yyyy =day.substring(0,4);
		   var mm = day.substring(4,6);
		   var dd = day.substring(6);
		   return yyyy + '-' + mm +'-' + dd;
		},

		//获取信息
		getIdCardInfo: function(idCardNo){
		 var idCardInfo = {
		   gender:"",   //性别
		   birthday:"", // 出生日期(yyyy-mm-dd)
		   addressName:""
		 };
		if(idCardNo.length==15){
		    var aday = '19' + idCardNo.substring(6,12);
		    idCardInfo.birthday=idCardNoUtil.formateDateCN(aday);
		    if(parseInt(idCardNo.charAt(14))%2==0){
		        idCardInfo.gender=idCardNoUtil.genders.female;
		    }else{
		        idCardInfo.gender=idCardNoUtil.genders.male;
		    } 
		    idCardInfo.addressName=idCardNoUtil.getAddressCodeName(idCardNo);
		}else if(idCardNo.length==18){
		    var aday = idCardNo.substring(6,14);
		    idCardInfo.birthday=idCardNoUtil.formateDateCN(aday);
		     if(parseInt(idCardNo.charAt(16))%2==0){
		        idCardInfo.gender=idCardNoUtil.genders.female;
		    }else{
		        idCardInfo.gender=idCardNoUtil.genders.male;
		    } 
		     idCardInfo.addressName=idCardNoUtil.getAddressCodeName(idCardNo);
		}
		return idCardInfo;
		},

		/*18位转15位*/
		getId15: function(idCardNo){
		if(idCardNo.length==15){
		   return idCardNo;
		}else if(idCardNo.length==18){
		   return idCardNo.substring(0,6) + idCardNo.substring(8,17); 
		}else{
		return null;
		}
		},

		/*15位转18位*/
		getId18: function(idCardNo){
		if(idCardNo.length==15){
		   var id17 = idCardNo.substring(0,6) + '19' + idCardNo.substring(6);
		   var parityBit = idCardNoUtil.getParityBit(id17);
		   return id17 + parityBit;
		}else if(idCardNo.length==18){
		   return idCardNo;
		}else{
		return null;
		}
		}
		};