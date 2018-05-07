$(function() {
	$yt_common.init();
});

(function($) {
	$.fn.niceSelect = function(method) {
    
    // Methods
    if (typeof method == 'string') {      
      if (method == 'update') {
        this.each(function() {
          var $select = $(this);
          var $dropdown = $(this).next('.nice-select');
          var open = $dropdown.hasClass('open');
          
          if ($dropdown.length) {
            $dropdown.remove();
            create_nice_select($select);
            
            if (open) {
              $select.next().trigger('click');
            }
          }
        });
      } else if (method == 'destroy') {
        this.each(function() {
          var $select = $(this);
          var $dropdown = $(this).next('.nice-select');
          
          if ($dropdown.length) {
            $dropdown.remove();
            $select.css('display', '');
          }
        });
        if ($('.nice-select').length == 0) {
          $(document).off('.nice_select');
        }
      } else {
        console.log('Method "' + method + '" does not exist.')
      }
      return this;
    }
      
    // Hide native select
    this.hide();
    
    // Create custom markup
    this.each(function() {
      var $select = $(this);
      
      if (!$select.next().hasClass('nice-select')) {
        create_nice_select($select);
      }else{
    	  $select.next().remove();
    	  create_nice_select($select);
      }
    });
    
    function create_nice_select($select) {
      $select.after($('<div></div>')
        .addClass('nice-select')
        .addClass($select.attr('class') || '')
        .addClass($select.attr('disabled') ? 'disabled' : '')
        .attr('tabindex', $select.attr('disabled') ? null : '0')
        .html('<span class="current"></span><ul class="list"></ul>')
      );
        
      var $dropdown = $select.next();
      var $options = $select.find('option');
      var $selected = $select.find('option:selected');
      
      $dropdown.find('.current').html($selected.data('display')||$selected.text());
      
      $options.each(function(i) {
        var $option = $(this);
        var display = $option.data('display');

        $dropdown.find('ul').append($('<li></li>')
          .attr('data-value', $option.val())
          .attr('data-display', (display || null))
          .addClass('option' +
            ($option.is(':selected') ? ' selected' : '') +
            ($option.is(':disabled') ? ' disabled' : ''))
          .html($option.text())
        );
      });
    }
    
    /* Event listeners */
    
    // Unbind existing events in case that the plugin has been initialized before
    $(document).off('.nice_select');
    
    // Open/close
    $(document).on('click.nice_select', '.nice-select', function(event) {
      var $dropdown = $(this);
      
      $('.nice-select').not($dropdown).removeClass('open');
      $dropdown.toggleClass('open');
      
      if ($dropdown.hasClass('open')) {
        $dropdown.find('.option');  
        $dropdown.find('.focus').removeClass('focus');
        $dropdown.find('.selected').addClass('focus');
      } else {
        $dropdown.focus();
      }
    });
    
    // Close when clicking outside
    $(document).on('click.nice_select', function(event) {
      if ($(event.target).closest('.nice-select').length === 0) {
        $('.nice-select').removeClass('open').find('.option');  
      }
    });
    
    // Option click
    $(document).on('click.nice_select', '.nice-select .option:not(.disabled)', function(event) {
      var $option = $(this);
      var $dropdown = $option.closest('.nice-select');
      
      $dropdown.find('.selected').removeClass('selected');
      $option.addClass('selected');
      
      var text = $option.data('display') || $option.text();
      $dropdown.find('.current').text(text);
      
      $dropdown.prev('select').val($option.data('value')).trigger('change');
    });

    // Keyboard events
    $(document).on('keydown.nice_select', '.nice-select', function(event) {    
      var $dropdown = $(this);
      var $focused_option = $($dropdown.find('.focus') || $dropdown.find('.list .option.selected'));
      
      // Space or Enter
      if (event.keyCode == 32 || event.keyCode == 13) {
        if ($dropdown.hasClass('open')) {
          $focused_option.trigger('click');
        } else {
          $dropdown.trigger('click');
        }
        return false;
      // Down
      } else if (event.keyCode == 40) {
        if (!$dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        } else {
          var $next = $focused_option.nextAll('.option:not(.disabled)').first();
          if ($next.length > 0) {
            $dropdown.find('.focus').removeClass('focus');
            $next.addClass('focus');
          }
        }
        return false;
      // Up
      } else if (event.keyCode == 38) {
        if (!$dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        } else {
          var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
          if ($prev.length > 0) {
            $dropdown.find('.focus').removeClass('focus');
            $prev.addClass('focus');
          }
        }
        return false;
      // Esc
      } else if (event.keyCode == 27) {
        if ($dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        }
      // Tab
      } else if (event.keyCode == 9) {
        if ($dropdown.hasClass('open')) {
          return false;
        }
      }
    });

    // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
    var style = document.createElement('a').style;
    style.cssText = 'pointer-events:auto';
    if (style.pointerEvents !== 'auto') {
      $('html').addClass('no-csspointerevents');
    }
    
    return this;

  };
		//首先备份下jquery的ajax方法  
	    var _ajax=$.ajax;  
	    //重写jquery的ajax方法  
	    $.addParam=function(oldP,addp){
   			return oldP +"&"+$.param(addp);
  		};
	    $.ajax=function(opt){
	    		var timestamp=new Date().getTime();
	    	  //备份opt中error和success方法  
		        var fn = {  
		            error:function(XMLHttpRequest, textStatus, errorThrown){ $yt_common.prompt("请求失败,请稍后重试");},
		            success:function(data, textStatus){},
		            complete:function (XHR, TS){}
		        }  
		        if(opt.error){  
		            fn.error=opt.error;  
		        }
		        if(opt.success){  
		            fn.success=opt.success;  
		        }
		        if(opt.url.indexOf("http://")!=0){
		        	opt.url =$yt_option.base_path+opt.url	
		        }
		        
		    	var yitianSSODynamicKey = $yt_common.getToken();
			
		    	var ytParams = {
		    		yitianSSODynamicKey : yitianSSODynamicKey,
		    		ajax:1
		    	}
		    	var   gettype=Object.prototype.toString
		    	
		    	var contentType ="application/x-www-form-urlencoded; charset=utf-8";
		    	if($yt_option.is_origin){
					if(window.XDomainRequest){
						contentType = "text/plain";
						jQuery.support.cors=true;
						opt.type = "get";
					} //for IE8,IE9
		    	}
		    	
				opt.contentType = contentType;
		    	if(opt.data){
		        	if(opt.data!=undefined&&gettype.call(opt.data)=="[object Object]"){
			    	opt.data.yitianSSODynamicKey = ytParams.yitianSSODynamicKey;
			    	opt.data.ajax = ytParams.ajax;
		    	}else if(opt.data!=undefined){
		    		var paramStr = jQuery.param(ytParams);
		    		opt.data += "&"+paramStr;
		    	}
		        
		        }else{
		        	opt.data = ytParams;
		        }
    	
		        //扩展增强处理  
		        var _opt = $.extend(opt,{  
		            error:function(XMLHttpRequest, textStatus, errorThrown){  
		                //错误方法增强处理  
		                fn.error(XMLHttpRequest, textStatus, errorThrown);  
		            },  
		            success:function(data, textStatus){
		            	var   gettype=Object.prototype.toString
		                //成功回调方法增强处理
									if(data.toString().substr(0,15) == '<!DOCTYPE html>'){
                    window.location.reload()
										return false
									}
		                try {
		                	if(jQuery.parseJSON(data).success==1){
		                		$yt_common.login_state = false;
		                		location.href =jQuery.parseJSON(data).data.ssoVerifyAddress;
		                	}else{
		                		$yt_common.login_state = true;
		                		data = jQuery.parseJSON(data);
		                	}
		                	
						} catch (e) {
						}
		                fn.success(data, textStatus);  
		            },  
		            beforeSend:function(XHR){  
		                //提交前回调方法  
		                $('body').append("<div class='ytAjaxMessageInfo' style='top: 0;left: 0;right: 0;bottom: 0;background-color: black;position: fixed;color: black;filter: alpha(opacity=0);-moz-opacity: 0;-khtml-opacity: 0;opacity: 0;z-index: 100000;'></div>");
		            },  
		            complete:function(XHR, TS){  
		                $(".ytAjaxMessageInfo").remove();
		               	fn.complete(XHR, TS);
		            }  
		        });  
		        return _ajax(_opt);  
	    }; 
})(jQuery);


var $yt_common={	
	common_width:0,
	left_width:0,
	baseInfo:"",
	html_width:0,
	
	user_id: 0, //登录用户的Id
	system_id: 0, //当前系统的Id
	token: '',//token验证用
	itcode:'',//用户ITCODE
	
	setMainWidth : function (){
		if($(window).width()<this.common_width){
		this.html_width = this.common_width;
		}else{
			this.html_width = $(window).width();
		}
		var left = (this.html_width-1200)/2;
		if(left<0){
			left=0;
		}
		var main_left = this.left_width + left;
		var main_width = this.html_width - main_left;
		$(".left-nav").css("left",left);
		$(".main-nav").css({width:main_width,left:main_left,"min-width":main_width});
		$(".head-nav").css({"min-width":this.common_width});
	},
	init:function (){
	//添加透明灰色背景
		$("body").append('<div id="q-alert-bg"></div><div id="lo-alert-bg" style="background:none"></div><div id="pop-modle-alert"></div>'+
		'<div id="q-alert"><div>'+
			'<div id="q-alert-title">'+
				'<div id="q-alert-left-title"></div>'+
			'</div>'+
			'<div id="q-alert-centen">'+
			'</div>'+
			'<div>'+
				'<table style="" cellspacing="" cellpadding="">'+
					'<tr id="q-alert-button">'+
					'</tr>'+
				'</table>'+
			'</div>'+
		'</div><div class="q-alert-x"><img src="resources/images/icons/x.png"/></div></div>'+
		'<div id="lo-alert" style=""></div>');
		var q_alert_left = ($(window).width()-$("#q-alert").width())/2;
		var q_alert_top = ($(window).height()-$("#q-alert").height())/2-100;
		if(q_alert_left>0){
			$("#q-alert").css("left",q_alert_left+"px");
		}else{
			$("#q-alert").css("left","0");
		}
		if(q_alert_top>0){
			$("#q-alert").css("top",q_alert_top+"px");
		}else{
			$("#q-alert").css("top","0px");
		}
		
		 q_alert_left = ($(window).width()-$("#lo-alert").width())/2;
		 q_alert_top = ($(window).height()-$("#lo-alert").height())/2-100;
		if(q_alert_left>0){
			$("#lo-alert").css("left",q_alert_left+"px");
		}else{
			$("#lo-alert").css("left","0");
		}
		if(q_alert_top>0){
			$("#lo-alert").css("top",q_alert_top+"px");
		}else{
			$("#lo-alert").css("top","0px");
		}
		
		$yt_common.getBaseInfo();
		
		/*
		 * 单选框和复选框初始化方法
		 */
		$yt_check_radio.init();
		/*
		 * 
		 * 左侧菜单初始化方法
		 * 
		 */
		$left_menu.init();
		
		/*$(".logout-button").click(function (){
			$yt_common.clearCookie("yitianSSODynamicKey");
			$.ajax({
				type:"post",
				url:$yt_option.base_path + 'index/loginOut',
				async:true,
				data:{dynamicKey:$yt_common.getToken()},
				success:function (data){
					$yt_common.prompt(data.msg);
					if(data.success==0){
						setTimeout(function (){
							window.location.reload();
						},500);
					}
					
				},error:function (data){
					$.$yt_common.prompt("网络问题 ,请稍后重试");
				}
			});			
		});*/
		
		
		/**
		 * 
		 * 头部导航横向混动
		 * */
		
		
		$(window).scroll(function (){
			$("#yt-index-head-nav").css("left",$(window).scrollLeft()*-1);
			$(".top-button-list").css("top",$(window).scrollTop()+ 80);
			$("#left-menu-cnt").css("top",$(window).scrollTop()+ 90);
		});
		
		
		/**
		 * 点击显示以外区域   隐藏显示(多用于弹出信息)
		 * 规则为: 点击除带有show_hide_div类(触发显示按钮或链接)和带有hide_div类(隐藏区域)及子节点外     带有(hide_div)类的节点隐藏
		 *
		 *
		 *
		 *
		 */
		
		
		document.body.onclick = function(event) {
			var e = event || window.event;
			var target = e.target || e.srcElement;
			var parentDoc = $(target).parents(".show_hide_div,.hide_div").length;
			var tc = target.className;
		
		    if(tc.indexOf('hide_div') ==-1&&tc.indexOf('show_hide_div') ==-1&&parentDoc<=0){
		        $(".hide_div").hide();
		        $(".select-button").removeClass("active")
		    }else{
		    	$(".hide_div").not($(target).parents(".hide_div")).not($(target).next(".hide_div")).hide();
		    }
		     
			
		};
		
		
		if(typeof bgObj != "undefined"){
			$(bgObj).click(function(){
				$(".hide_div").hide();
			});
		}
		$('select:not(.ignore)').niceSelect();
		
		
		$("body").delegate(".textarea textarea","focus",function (){
			$(this).parent().addClass("active");
		})
		$("body").delegate(".textarea textarea","blur",function (){
			$(this).parent().removeClass("active");
		})
		
	}
	,
	clearCookie :function (name) {    
	    $yt_common.setCookie(name, "", 1000);    
	},
	setCookie: function(key, value, t) { //存cookie
		var oDate = new Date();
		oDate.setDate(oDate.getDate() + t);
		document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + oDate.toGMTString()+";path=/";
	},getToken:function (){
		var cookies = document.cookie.split(";");
		var yitianSSODynamicKey = "";
		if (cookies.length > 0) {
			for(var i = 0 ;i<cookies.length;i++){
				var cookie = cookies[i].split("=");
				
				if ($.trim(cookie[0]) == "yitianSSODynamicKey")
					yitianSSODynamicKey = unescape(cookie[1]);	
			}
		}
		// 如果cookie中没有，取Referer中的
		if(yitianSSODynamicKey == '' || !yitianSSODynamicKey){
      cookies = window.location.href.split("&");
      if (cookies.length > 0) {
        for(var i = 0 ;i<cookies.length;i++){
          var cookie = cookies[i].split("=");

          if ($.trim(cookie[0]) == "token")
            yitianSSODynamicKey = unescape(cookie[1]);
        }
      }
		}
		return yitianSSODynamicKey;
	},
	Alert:function (option){
		var title = option.title;
		var text = option.text;
		var leftName = option.leftName?option.leftName:"确定"
		var rightName =  option.rightName?option.rightName:"取消"
		var confirmFunction = option.confirmFunction;
		var cancelFunction  = option.cancelFunction;
		var haveCancelIcon = option.haveCancelIcon==undefined?true:option.haveCancelIcon;
		var me = this;
		if(rightName=="" || rightName==null){
			rightName="取消"
		}
		if(confirmFunction){
			
			var leftButton = $('<td align="right"><button class="alert-left-button radius5">'+leftName+'</button></td>');
			var rightButton = $('<td align="left"><button class="alert-right-button  radius5">'+rightName+'</button></td>');
			$("#q-alert-button").empty().append(leftButton);
			$("#q-alert-button").append(rightButton);
			leftButton.click(function (){
				confirmFunction();
				me.hideAlert();
			});
			rightButton.click(function (){
				me.hideAlert();
				if(cancelFunction){
					
					cancelFunction();
				}
			})
		}else{
			var action = $('<td><button class="alert-one-button">'+leftName+'</button></td>');
			action.click(function(){
				me.hideAlert();
			})
			$("#q-alert-button").empty().append(action);
		}
		
		if(haveCancelIcon){
			$(".q-alert-x").show();
			$(".q-alert-x").bind("click",function (){
				me.hideAlert();
			})
		}else{
			$(".q-alert-x").hide();	
		}
		
		$("#q-alert-left-title").html(title);
		$("#q-alert-centen").html(text);
		$("#q-alert").show();
		$("#q-alert-bg").show();
	},
	hideAlert:function (){
		$("#q-alert").hide();
		$("#q-alert-bg").hide();
	},
	prompt :function(centen,animationTime,showTime){
		$("#lo-alert").html(centen);
		$("#lo-alert").fadeIn(animationTime?animationTime:0);
		$("#lo-alert-bg").fadeIn(animationTime?animationTime:0);
		setTimeout(function (){
			$("#lo-alert").fadeOut(animationTime?animationTime:0);
			$("#lo-alert-bg").fadeOut(animationTime?animationTime:0);	
		},showTime?showTime:1000)
	},
	pageInfo:{
		pageSize:5,
		pageNum:15,
		total:0,
		init:function (pageIndex,confirmFunction){
			var me = this;
		/*	var pageIndex = option.pageIndex;
			var total = option.total;
			var confirmFunction = option.confirmFunction;*/
			var total = this.total;
			var pageNum = this.pageNum;
			/**
			 *上一页
			 * 
			 * 
			 */
			$(".opinion-page .last-page.pointer").unbind().bind("click",function(){
				var pageIndex = $(".opinion-page .num-text.active").text();
				pageIndex = parseInt(pageIndex)-1;
				me.setPage(pageIndex,confirmFunction);
				confirmFunction(pageIndex);
				$(".commen-table tbody tr").setEvenTrColor();
				me.bindTrClick();
			});
			/**
			 *下一页 
			 * 
			 */
			$(".opinion-page .next-page.pointer").unbind().bind("click",function(){
				var pageIndex = $(".opinion-page .num-text.active").text();
				pageIndex = parseInt(pageIndex)+1;
				me.setPage(pageIndex,confirmFunction);
				confirmFunction(pageIndex);
				$(".commen-table tbody tr").setEvenTrColor();
				me.bindTrClick();
			});
			/**
			 *页号 
			 * 
			 * 
			 */
			$(".opinion-page .num-text").unbind().bind("click",function (){
				var pageIndex = $(this).text();
				me.setPage(pageIndex,confirmFunction);
				confirmFunction(pageIndex);
				$(".commen-table tbody tr").setEvenTrColor();
				me.bindTrClick();
			});
			/**
			 * 
			 * 首页
			 * 
			 * 
			 */
			$(".opinion-page .frist-page.pointer").unbind().bind("click",function (){
				me.setPage(1,confirmFunction);
				confirmFunction(1);
				$(".commen-table tbody tr").setEvenTrColor();
				me.bindTrClick();
			});
			
			/**
			 * 
			 * 尾页
			 * 
			 * 
			 * */
			$(".opinion-page .end-page.pointer").unbind().bind("click",function (){
				var pageCount =  Math.ceil(total/pageNum);
				me.setPage(pageCount,confirmFunction);
				confirmFunction(pageCount);
				$(".commen-table tbody tr").setEvenTrColor();
				me.bindTrClick();
			})
			me.bindTrClick();
			
		},
		bindTrClick:function (){
			$(".commen-table tbody tr").unbind().bind("click",function (){
				if($(this).find("span.enable").length>0){
					$(".enable-button").hide();
					$(".disable-button").show();
				}else{
					$(".enable-button").show();
					$(".disable-button").hide();
				}
				$(".commen-table tbody tr.active").removeClass("active")
				$(this).addClass("active");
			});
		},
		config:function (pageIndex,confirmFunction,pageNum){
			if(pageIndex)
			pageIndex = 1;
			
			this.total =  confirmFunction(pageIndex).total;
			if(pageNum){
				this.pageNum = pageNum;
			}
			
			$(".commen-table tbody tr").setEvenTrColor();
			this.setPage(pageIndex,confirmFunction);
			
		},
		setPage:function (pageIndex,confirmFunction){
			/**
        	 * 
        	 *分页方法 
        	 */
        	pageIndex = parseInt(pageIndex);
        	var total = this.total;
        	var pageSize = this.pageSize;
       		var pageNum = this.pageNum;
        	var pageCount =  Math.ceil(total/pageNum);
        	
        	$(".opinion-page table tr").empty();
        	//;
        	/*var total = 111;
          	var pageCount =12;*/
        	var countHtml = '<td><div class="data-count">总计：'+total+'条信息</div></td>';
        	$(".opinion-page table tr").append(countHtml);
        	
        	var lastButton = '<td><div class="last-page">上一页</div></td>';
        	var lastButtonActive = '<td><div class="last-page pointer">上一页</div></td>';
        	var nextButton = '<td><div class="next-page">下一页</div></td>';
        	var nextButtonActive = '<td><div class="next-page pointer">下一页</div></td>';
        	var firstButton = '<td><div class="frist-page">首页</div></td>';
        	var firstButtonAction = '<td><div class="frist-page pointer">首页</div></td>';
        	var endButton = '<td><div class="end-page">尾页</div></td>';
        	var endButtonAction = '<td><div class="end-page pointer">尾页</div></td>';
        	if(pageCount<=pageSize+1){
        		/**
        		 *  1 2 3 4 5
        		 */
        		if(pageIndex>1){
        			$(".opinion-page table tr").append(firstButtonAction);
        			$(".opinion-page table tr").append(lastButtonActive);
        		}else{
        			$(".opinion-page table tr").append(firstButton);
        			$(".opinion-page table tr").append(lastButton);
        		}
            	
        		for ( var int = 1; int <=pageCount; int++) {
        			var pageHtml = '<td><div class="num-text pointer">'+int+'</div></td>';
        			if(int==pageIndex){
        				var pageHtml = '<td><div class="num-text active">'+int+'</div></td>';
        			}
        			$(".opinion-page table tr").append(pageHtml);
				}
            	
        		
        		if(pageIndex<pageCount){
        			$(".opinion-page table tr").append(nextButtonActive);
        			$(".opinion-page table tr").append(endButtonAction);
        		}else{
        			$(".opinion-page table tr").append(nextButton);
        			$(".opinion-page table tr").append(endButton);
        		}
        	}else if(pageCount>pageSize+1 && pageIndex<=pageSize-1){
        		
        		/**
        		 * 1 2 3 4 5 ··· 12
        		 */
        		if(pageIndex>1){
        			$(".opinion-page table tr").append(firstButtonAction);
        			$(".opinion-page table tr").append(lastButtonActive);
        		}else{
        			$(".opinion-page table tr").append(firstButton);
        			$(".opinion-page table tr").append(lastButton);
        		}
            	
        		for ( var int = 1; int <=pageSize; int++) {
        			var pageHtml = '<td><div class="num-text pointer">'+int+'</div></td>';
        			if(int==pageIndex){
        				var pageHtml = '<td><div class="num-text active">'+int+'</div></td>';
        			}
        			$(".opinion-page table tr").append(pageHtml);
				}
        		var pageHtml = '<td><div class="">···</div></td>';
        		$(".opinion-page table tr").append(pageHtml);
        		var pageHtml = '<td><div class="num-text pointer">'+pageCount+'</div></td>';
        		$(".opinion-page table tr").append(pageHtml);
        		
            	$(".opinion-page table tr").append(nextButtonActive);
            	$(".opinion-page table tr").append(endButtonAction);
        	}else if(pageCount>pageSize+1 && pageIndex>=pageCount-3){
        		
        		/**
        		 *  1··· 4 5 6 7 8
        		 */
        		
        		$(".opinion-page table tr").append(firstButtonAction);
        		$(".opinion-page table tr").append(lastButtonActive);
        		
        		var pageHtml = '<td><div class="num-text pointer">'+1+'</div></td>';
        		$(".opinion-page table tr").append(pageHtml);
        		var pageHtml = '<td><div class="">···</div></td>';
        		$(".opinion-page table tr").append(pageHtml);
        		
        		for ( var int = pageCount-4; int <=pageCount; int++) {
        			var pageHtml = '<td><div class="num-text pointer">'+int+'</div></td>';
        			if(int==pageIndex){
        				var pageHtml = '<td><div class="num-text active">'+int+'</div></td>';
        			}
        			$(".opinion-page table tr").append(pageHtml);
				}
        		
            	
        		if(pageIndex<pageCount){
        			$(".opinion-page table tr").append(nextButtonActive);
        			$(".opinion-page table tr").append(endButtonAction);
        		}else{
        			$(".opinion-page table tr").append(nextButton);
        			$(".opinion-page table tr").append(endButton);
        		}
        		
        	}else{
        		
        		/**
        		 *1··· 4 5 6 7 8 ···12 
        		 */
        		
        		$(".opinion-page table tr").append(firstButtonAction);
        		$(".opinion-page table tr").append(lastButtonActive);
        		
        		var pageHtml = '<td><div class="num-text">'+1+'</div></td>';
        		$(".opinion-page table tr").append(pageHtml);
        		var pageHtml = '<td><div class="">···</div></td>';
        		$(".opinion-page table tr").append(pageHtml);
        		
        		for ( var int = pageIndex-2; int <=pageIndex+2; int++) {
        			var pageHtml = '<td><div class="num-text pointer">'+int+'</div></td>';
        			if(int==pageIndex){
        				var pageHtml = '<td><div class="num-text active">'+int+'</div></td>';
        			}
        			$(".opinion-page table tr").append(pageHtml);
				}
        		var pageHtml = '<td><div class="">···</div></td>';
        		$(".opinion-page table tr").append(pageHtml);
        		var pageHtml = '<td><div class="num-text pointer">'+pageCount+'</div></td>';
        		$(".opinion-page table tr").append(pageHtml);

        		$(".opinion-page table tr").append(nextButtonActive);
        		$(".opinion-page table tr").append(endButtonAction);
        	}
        	this.init(pageIndex,confirmFunction);
		}
	},ajax_download_file:function (url) {
			
		if (typeof($yt_common.ajax_download_file.iframe) == "undefined") {
			var iframe = document.createElement("iframe");
			$yt_common.ajax_download_file.iframe = iframe;
			document.body.appendChild($yt_common.ajax_download_file.iframe);
		}
		// alert(download_file.iframe);
		$yt_common.ajax_download_file.iframe.src = url;
		$yt_common.ajax_download_file.iframe.style.display = "none";
	},getTreeData :function (data,parentId){
		var me = this;
	    var result = [] , temp;
	    for(var i in data){
	        if(data[i].parentId==parentId){
	            result.push(data[i]);
	            temp = me.getTreeData(data,data[i].id);           
	            if(temp.length>0){
	                data[i].children=temp;
	            }           
	        }       
	    }
	    return result;
	},unSerialize:function (param) { 
		var reulst = {};
		if(param!=""&&param!=undefined){
			var strs = param.split("&"); 
			for(var i = 0; i < strs.length; i ++) {
				reulst[strs[i].split("=")[0]]=strs[i].split("=")[1]; 
			} 
		}
		return reulst;
	},
	getSystemId:function (){
		var systemId = $yt_common.system_id;
		if($("#yt-index-head-sys select").val() != null && $("#yt-index-head-sys select").val() != ""){
			systemId = $("#yt-index-head-sys select").val();
		}
		return systemId;
	},getBaseInfo:function (){
		$.ajax({
				type:"post",
				url:$yt_option.base_path + "tAdmConfiggration/getConfigBySystemId",
				async:false,
				data:{systemId:$yt_common.getSystemId()},
				success:function(data){
					if(data!=""){
						$yt_common.baseInfo = data;
						$("#yt-index-head-nav .head-top-nav .logo").attr("src",$yt_option.base_path+data.logoPath);
						$("#yt-index-head-nav .head-top-nav .system-name").text(data.systemName);
					}else{
						$yt_common.baseInfo = data;
						//$("#yt-index-head-nav .head-top-nav .logo").removeAttr("src");
						$("#yt-index-head-nav .head-top-nav .system-name").text("");
						$yt_common.prompt("请配置基础信息");
					}
				}
			});
	}
}



var  $yt_check_radio={	
	init:function (){
		
		$("body").delegate(".yt-checkbox input[type='checkbox']","change",function (){
			if($(this)[0].checked){
				$(this).parent().addClass("check");
			}else{
				$(this).parent().removeClass("check");
			}
		})
		$("body").delegate(".yt-radio input[type='radio']","change",function (){
			var docName = $(this).attr("name");
			if($(this).parents("form").length==0){
		   		$(this).parents("body").find(".yt-radio input[type='radio'][name='"+docName+"']").not("form input[type='radio']").parent().removeClass("check");	
	   		}else{
	   			$(this).parents("form").find(".yt-radio input[type='radio'][name='"+docName+"']").parent().removeClass("check");
	   		}
			$(this).parent().addClass("check");
		})
		$(".yt-checkbox.check").find("input[type='checkbox']").prop("checked",true);
		$(".yt-radio.check").find("input[type='radio']").prop("checked",true);
	}
}

var  $left_menu={
	init:function (){
		var me = this;
		var systemId = $yt_common.system_id;
		if($("#yt-index-head-sys select").val() != null && $("#yt-index-head-sys select").val() != ""){
			systemId = $("#yt-index-head-sys select").val();
		}
		$.ajax({
			url: $yt_option.base_path + 'index/getChildMenus',
	        type : 'POST',
	        data:{"userId":$yt_common.user_id,"parentMenuId":0,"systemId":systemId},
			success:function (dataStr){
				var obj =eval(dataStr);
				$("#menu-list").empty();
				$.each(obj,function (i,n){
					var className = ""
					var stateClass="";
					if(i==0){
						className = "menu-check";
						stateClass = "check";
					}
					var one_menu = $('<li class="one-menu '+className+'" menuId = "'+n.pkId+'"><div class="'+stateClass+'">'+n.menuName+'</div><ul></ul></li>');
			
					$("#menu-list").append(one_menu);	
					if(i==0){
						$.ajax({
						url: $yt_option.base_path + 'index/getChildMenus',
				        type : 'POST',
				        data:{"userId":$yt_common.user_id,"parentMenuId":n.pkId,"systemId":systemId},
						success:function (dataStr){
							var data =eval(dataStr);
							one_menu.find("ul").empty();
							$.each(data, function(j,m) {
								var two_menu = $('<li class="two-menu"><div>'+m.menuName+'</div></li>');
								one_menu.find("ul").append(two_menu);
								two_menu.click(function (){
									$("#left-menu-cnt .two-menu").removeClass("check");
									$(this).addClass("check");
									me.switchTab(m.pkId,m.menuUrl);
								});
								if(j == 0){
									me.switchTab(m.pkId,m.menuUrl);
								}
							});	
							one_menu.find("ul").show();
						}
					});
					}
				})
				$("#left-menu-cnt .one-menu div").on("click",function (){
					if($(this).hasClass("check")){
						$(this).removeClass("check");
						$(this).next("ul").hide();
						$(this).parent().removeClass("menu-check");
						$(this).parent().addClass("menu-uncheck");
					}else{
						var one_menu = $(this).parent();
						var parentMenuId = one_menu.attr("menuId");
						$.ajax({
							url: $yt_option.base_path + 'index/getChildMenus',
					        type : 'POST',
					        data:{"userId":$yt_common.user_id,"parentMenuId":parentMenuId,"systemId":systemId},
							success:function (dataStr){
								var data =eval(dataStr);
								one_menu.find("ul").empty();
								$.each(data, function(j,m) {
									var two_menu = $('<li class="two-menu"><div>'+m.menuName+'</div></li>');
									one_menu.find("ul").append(two_menu);
									two_menu.click(function (){
										$("#left-menu-cnt .two-menu").removeClass("check");
										$(this).addClass("check");
										me.switchTab(m.pkId,m.menuUrl);
									});
								});	
								one_menu.find("ul").show();
							}
						});
						$(this).siblings().removeClass("check");
						$(this).addClass("check");
						$(this).parent().addClass("menu-check");
						$(this).parent().removeClass("menu-uncheck");
					}
					
				});
				
			}
		});
		
		
	},
	switchTab:function (menuId,url){
		if(url.indexOf("http://")!=0){
			url = $yt_option.websit_path+url;
		}
		$("#yt-index-main-nav").html("");
		$.ajax({
			type:"get",
			url:url,
			async:false,
			success:function (data){
				$("#yt-index-main-nav").html(data);
				$(window).scrollTop(0);
			}
		});
		/*var systemId = $("#yt-index-head-sys select").val();
		$.ajax({
			type:"post",
			url:$yt_option.base_path + 'index/getFuncListByMenuId',
			async:false,
			data:{"menuId":menuId,"userId":$yt_common.user_id,systemId:systemId},
			success:function (data){
				var resultData = ",";
				$.each(data,function (i,n){
					
					resultData+=n.funcCode+',';
				});
				$("[acl-code]").each(function (i,n){
					var acl_code = ","+$(n).attr("acl-code")+",";
					if(resultData.indexOf(acl_code)==-1){
						$(n).remove();
					}
				})
				if($(".top-button button").length==0){
					var pt =  $(".list-content").css("padding-top");
					if(pt){
						pt = pt.replace("px","").replace("PX","")
						var cpt = parseInt(pt)-56;
						$(".list-content").css("padding-top",cpt+"px")
					}
				}
				
				
			}
		});*/

	}
}
/*jquery拓展方法*/
$.fn.extend({
    setCheckBoxState:function(c){ 
		$(this)[0].checked = c;
		if(c){
			$(this).parent().addClass("check");	
		}else{
			$(this).parent().removeClass("check");
		}
		
   },
   setRadioState:function(c){
   		$(this)[0].checked = c;
   		var docName = $(this).attr("name");
	
   		if($(this).parents("form").length==0){
	   		$(this).parents("body").find(".yt-radio input[type='radio'][name='"+docName+"']").not("form input[type='radio']").parent().removeClass("check");	
   		}else{
   			$(this).parents("form").find(".yt-radio input[type='radio'][name='"+docName+"']").parent().removeClass("check");
   		}
   		if(c){
			$(this).parent().addClass("check");
		}
   },show:function (){
   		$(this).css("display","block");
   		if($(this).hasClass("yt-pop-model")){
   			var h = $(this).children("div").height();
   			var w = $(window).height();
   			var r = (w-h)/2;
   			$(this).css({"top":r,"bottom":r});
   			$("#pop-modle-alert").css("display","block");
   		}
   },hide:function (){
	   	$(this).css("display","none");
	   	if($(this).hasClass("yt-pop-model")){
	   		$("#pop-modle-alert").css("display","none");	
	   	}
	   	
	   	
   },
   setEvenTrColor:function (){
   		$(this).each(function (i,n){
			if(i%2==1){
				$(n).addClass("even")
			}
   		})
   }
   
})


