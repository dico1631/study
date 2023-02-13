function _slideActn(){
	var slidelist = $('.slideImgLst');
	var slide= slidelist.find('.sldImgBx');
	var prntsSldlst = slide.parent('.slideImgLst');
	var slideBox = prntsSldlst.parent('.slideImgBx');
	var prntsBox = slideBox.parent('.slideCntntsBox');
	var sldLngth = slide.length;
	slidelist.find('.sldImgBx:last').addClass('lst');
	var sldWdth= slideBox.width();
	var sldlstWdth= prntsSldlst.width();
	if(!prntsBox.hasClass('_lstinfrst')){//마지막장 첫장 무한롤링으로 보여지는경우가 아닐떄
		prntsSldlst.find('.imgbfr').remove();
		prntsSldlst.find('.imgaftr').remove();
	}
	if(prntsBox.hasClass('_inSbimgLst')){
	     var thmTg = '<li class="inSbimg">';
		    thmTg += '<span class="imgInfCptn"></span>';
		    thmTg += '<span class="img _szEvnt _sqr _whSz">';
		    thmTg += '<img src="" class="imgFile">';
		    thmTg += '</span>';
		    thmTg += '</li>';
		var thmLst = prntsBox.find('.sld_inSbimgLst');
		var thm = thmLst.find('.inSbimg');
		for (var i = 1; i <= sldLngth; i++) {
			thmLst.append(thmTg);
		}
		thmLst.find('.inSbimg:first').addClass('on');
		slide.each(function() {
			var sldIdx = $(this).index()-1;
			var thmIdx = sldIdx;
			var imgInfCptn = slidelist.find('.sldImgBx:eq('+sldIdx+')').find('.imgFile').attr('data-clrCode');
			var sldsrc = slidelist.find('.sldImgBx:eq('+sldIdx+')').find('.imgFile').attr('src');
			thmLst.find('.inSbimg:eq('+thmIdx+')').find('.imgFile').attr('src',sldsrc);
			thmLst.find('.inSbimg:eq('+thmIdx+')').find('.imgInfCptn').text(imgInfCptn);
		});
		var thmOn = thmLst.find('.inSbimg.on');
		var thmInf = thmOn.find('.imgInfCptn').text();
		if(prntsBox.find('.imgInfCptnVwTxt').length == 1){
			prntsBox.find('.imgInfCptnVwTxt').text(thmInf);
		}
		if(thm.length > 7){
			var wlng = thm.length;
			var w = 100/wlng - 8;
			thmLst.addClass('_ovrLng');
			thm.css('width','calc(100%/'+wlng+' - 8px)');
		}
	}
	if(sldLngth <= 1){
		prntsSldlst.addClass('_1');
		prntsBox.addClass('_nonSld');
	}else if(sldLngth > 1 && sldLngth != 5){
		if(slideBox.hasClass('_fullSz')){
			prntsSldlst.css('width','calc(100%*'+sldLngth+')');
			slide.css('width','calc(100%/'+sldLngth+')');
		}else{
			prntsSldlst.css('width','calc(60%*'+sldLngth+')');
 		     slide.css('width','calc(100%/'+sldLngth+')');
		}
	}
	chckWHsize();
	///여기까지 슬라이드 처음 화면 로드시 갯수등에 따라 조정되는 구성
	$(document).on('click', '.sldImgBx', function(){//이미지 클릭하여 슬라이드롤링(무한)
		var bx = $(this).parents('.slideCntntsBox');
		var thmLst = bx.find('.sld_inSbimgLst');
		var sldlst = $(this).parent('.slideImgLst');
		var wBx = sldlst.parent('.slideImgBx');
		var rght = sldlst.css('margin-left').replace('px','');
		var sldW = $(this).width();
		var lng = sldlst.find('.sldImgBx').length-1;
		var mvRslt = rght - sldW;
		var maxa = sldlst.outerWidth();
		var max = Math.abs(rght)+sldW;
		var maxb = Math.abs(sldW*lng);
		if(bx.hasClass('_inTchActn')){
			if(bx.hasClass('_useBtn')){
				//버튼으로 이동하기때문에 이미지자체클릭액션 없음
			}else{
				var maxb = Math.abs(sldW*lng)-sldW;
				if(Math.abs(rght) >= maxb){
					sldlst.css('transition', '0s');
					sldlst.css('margin-left','0px');
				}else{
				    sldlst.removeAttr('transition');
				    sldlst.css('margin-left',mvRslt+'px');
				}
				sldlst.find('.sldImgBx').each(function() {
					var sldIdx = $(this).index();
					var thmIdx = sldIdx;
					thmLst.find('.inSbimg').removeClass('on');
					thmLst.find('.inSbimg:eq('+thmIdx+')').addClass('on');
				});
			}
		}
	});
     $(document).on('click', '.ovrsldBtn', function(){
		//슬라이드 버튼이 부모자를 벗어나서, 보일수가 없는 구조일경우 트리거로 액션을 대신하여
		//구조 변경없이, 이벤트 변경없이 처리함
          var ovrsldBtn = $(this).parent('.slideCntntsBox');
          var prv = ovrsldBtn.find(".sldBtn._prv");
          var nxt = ovrsldBtn.find(".sldBtn._nxt");
          if($(this).hasClass('_prv')){
             prv.trigger("click");
          }else if($(this).hasClass('_nxt')){
             nxt.trigger("click");
          }
	});
	$(document).on('click', '.sldBtn', function(){//슬라이드 버튼으로 슬라이드롤링
	     var sldImgBx = $(this).parent('.slideImgBx');
		var bx = sldImgBx.parents('.slideCntntsBox');
          var ovrBtnp = bx.find('.ovrsldBtn._prv');
          var ovrBtnn = bx.find('.ovrsldBtn._nxt');
		var sldlst = sldImgBx.find('.slideImgLst');
		var sldW = sldlst.find('.sldImgBx').outerWidth();
		var rght = sldlst.css('margin-left').replace('px','');
		var mvRslt = rght - sldW;
		var mvRsltb = Math.abs(rght) - sldW;
		var sld = sldlst.find('.sldImgBx');
		var sldOn = sldlst.find('.sldImgBx.on');
		var sldL = sldlst.find('.sldImgBx.lst');
		var sldF = sldlst.find('.sldImgBx.frst');
		var sldLon = sldlst.find('.sldImgBx.lst.on');
		var sldFon = sldlst.find('.sldImgBx.frst.on');
		if($(this).hasClass('_prv')){
			if(bx.hasClass('_sldRllng')){
				if(sldOn.hasClass('frst')){//무한 롤링일때
					var lstw = sldlst.outerWidth()-sldW;
					sldlst.css('margin-left','-'+lstw+'px');
					sld.removeClass('on');
					sldL.addClass('on');
			    }else{
				     sldOn.prev('.sldImgBx').addClass('on').next('.sldImgBx.on').removeClass('on');
					sldlst.css('margin-left','-'+mvRsltb+'px');
			    }
			}else{
 				sldOn.prev('.sldImgBx').addClass('on').next('.sldImgBx.on').removeClass('on');
                    sldlst.css('margin-left','-'+mvRsltb+'px');
				if(sldOn.prev().hasClass('frst')){
					sldlst.removeAttr('transition');
	 				sldImgBx.find('._nxt').removeClass('dsble');
	                    ovrBtnn.removeClass('dsble');
	     		     sldlst.css('margin-left','0px');
	     			$(this).addClass('dsble');
	                    ovrBtnp.addClass('dsble');
				}
			}
		}else if($(this).hasClass('_nxt')){
		     sldlst.removeAttr('transition');
			if(bx.hasClass('_sldRllng')){//무한 롤링일때
				if(sldOn.hasClass('lst')){
					sldlst.css('margin-left','0px');
					sld.removeClass('on');
					sldF.addClass('on');
				}else{
					sldlst.css('margin-left',mvRslt+'px');
					sldOn.next('.sldImgBx').addClass('on').prev('.sldImgBx.on').removeClass('on');
				}

			}else{
				if(sldOn.next().hasClass('lst')){
					sldImgBx.find('._prv').removeClass('dsble');
 				    ovrBtnp.removeClass('dsble');
				    $(this).addClass('dsble');
				    ovrBtnn.addClass('dsble');
				}
				sldlst.css('margin-left',mvRslt+'px');
				sldOn.next('.sldImgBx').addClass('on').prev('.sldImgBx.on').removeClass('on');

			}
		}
		var thmLst = bx.find('.sld_inSbimgLst');
		sldlst.find('.sldImgBx.on').each(function() {
			var sldIdx = $(this).index();
			var thmIdx = sldIdx-1;
			thmLst.find('.inSbimg').removeClass('on');
			thmLst.find('.inSbimg:eq('+thmIdx+')').addClass('on');
		});
	});
	$(document).on('click', '.inSbimg', function(){
	     var thmLst = $(this).parent('.sld_inSbimgLst');
		var thm= thmLst.find('.inSbimg');
		var thmon= thmLst.find('.inSbimg.on');
          var bx = thmLst.parents('.slideCntntsBox');
		thm.removeClass('on');
		$(this).addClass('on');
		var sldlst = bx.find('.slideImgLst');
		var sldW = sldlst.find('.sldImgBx').outerWidth();
		var rght = sldlst.css('margin-left').replace('px','');
		//var mvRslt = rght - sldW;
		//var mvRsltb = Math.abs(rght) - sldW;
		var sld = sldlst.find('.sldImgBx');
		var sldOn = sldlst.find('.sldImgBx.on');
		var thmIdx = $(this).index();
		var sldIdx = thmIdx;
		sld.removeClass('on');
		sldlst.find('.sldImgBx:eq('+sldIdx+')').addClass('on');
		var lng = $(this).prevAll('.inSbimg').length;
		if($(this).prevAll('.inSbimg').length > 0){
		     var mv = sldW*lng;
			sldlst.css('margin-left','-'+mv+'px');
		}else{
			sldlst.css('margin-left','0px');
		}
		if(bx.find('.imgInfCptnVwTxt').length == 1){
		   var thmInf = thmLst.find('.inSbimg.on').find('.imgInfCptn').text();
	        bx.find('.imgInfCptnVwTxt').text(thmInf);
		}
	});

}