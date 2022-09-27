<script>

	// 서울 지역 초기 로드
	fetchArea('A02001');

	// MARKER POSITION & MARKER * INFO WINDOWS INITIALIZE
	var STORE_POSITION = [],
		markers = [],
   		infoWindows = [],
   		selectedArea1 = "",
   		selectedArea2 = ""
   		selectedZoom = 2;	// 초기값

	// naver -> daum										2019. 04. 19.  최현서
	var mapOptions = {
		scrollwheel: true,
        level: 9,
        mapTypeId: daum.maps.MapTypeId.ROADMAP,
        center: new daum.maps.LatLng(37.566895, 126.977874)
    };

    map = new daum.maps.Map(document.getElementById('map'), mapOptions);

 	// 마커 이미지의 이미지 주소입니다
    var imageSrc = "/img/front/store/location.png";

    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new daum.maps.Size(15, 15);

    // 마커 이미지를 생성합니다
    var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize);

	function settingStore() {

		for (var key in STORE_POSITION) {

			var position = {
				title: STORE_POSITION[key][2],
				latlng: new daum.maps.LatLng(STORE_POSITION[key][0], STORE_POSITION[key][1])
			};

			// 마커를 생성합니다
		    var marker = new daum.maps.Marker({
		        map: map, // 마커를 표시할 지도
		        position: position.latlng, // 마커를 표시할 위치
		        title : position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
		        image : markerImage // 마커 이미지
		    });

			/*  naver -> daum										2019. 04. 19.  최현서
			var position = new naver.maps.LatLng(STORE_POSITION[key][0], STORE_POSITION[key][1]);
		    var marker = new naver.maps.Marker({
		        map: map,
		        position: position,
		        icon: {
		            url: '/img/front/store/location.png'
		         },
		        zIndex: 100
		    });
			*/


		    var isBrand = STORE_POSITION[key][5] == "B" ? '<img src="/img/front/store/brandshop.png" alt="b"/>' : '<img src="/img/front/store/standardshop.png" alt="s"/>'

		    var infoWindow = new daum.maps.InfoWindow({
		        content:
		        	'<div class="info"><span class="info_title noto f16">'
		    	   + isBrand
		           + STORE_POSITION[key][2]
		    	   + '</span>'
		           +'<br><span class="info_infos noto f14">' + STORE_POSITION[key][3] + '</span>'
		           +'<br><span class="info_infos noto f14">' + STORE_POSITION[key][4] + '</span>'
		       	   +'</div>',
		        borderColor: "#c80a1e",
		        borderWidth: 3,
		        disableAnchor: true,
		        zIndex: 100,
		        pixelOffset : {x:0, y: -10} // 10px 정도 마커 위에 표시
		    });

		    markers.push(marker);
		    infoWindows.push(infoWindow);

		};

		/*
		naver.maps.Event.addListener(map, 'idle', function() {
			updateMarkers(map, markers);
		});

		 naver.maps.Event.addListener(map, 'zoom_changed', function() {
		    updateMarkers(map, markers);

		}); */

		daum.maps.event.addListener(map, 'click', function(){
			for (var i = 0, ii=infoWindows.length; i<ii ; i++) {
        		if (infoWindows[i].getMap()) {
  	           		infoWindows[i].close();
        		}
        	}
		});


		// Initialize markers ('A02001', '')
		initializeShopFilteringByArea();
	}


	function updateMarkers(map, markers) {

	    var mapBounds = map.getBounds();
	    var marker, position;

	    for (var i = 0; i < markers.length; i++) {

	        marker = markers[i]
	        position = marker.getPosition();

	        if (mapBounds.hasLatLng(position)) {
	            showMarker(map, marker);
	        } else {
	            hideMarker(map, marker);
	        }
	    }
	}

	function showMarker(map, marker) {

	    if (marker.getMap() != null) return;
	    marker.setMap(map);

		daum.maps.event.addListener(marker, 'click', function(e) {
	        var delta = 0,
	            zoom = map.getLevel(),
	            position = marker.getPosition();

	        // zoom을 12로 맞춰줌.
	        if (zoom < 12) {
	            delta = 12 - zoom;
	        }
	        else {
	        	delta = - (zoom - 12);
	        }

	        map.setLevel(delta);
	        map.panTo(position);
	    });
	}

	function hideMarker(map, marker) {
	    if (marker.getMap() == null) return;
	    marker.setMap(null);
	}

	// 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
	function getClickHandler(seq) {
	    return function(e) {
	        var marker = markers[seq],
	            infoWindow = infoWindows[seq];

	        if (infoWindow.getMap()) {
	            infoWindow.close();
	        } else {
	            infoWindow.open(map, marker);
	        }

	        var delta = 0,
            	zoom = map.getLevel(),
            	position = marker.getPosition();

	        // zoom이 12 미만이면 12로 맞춰줌.
	        if (zoom < 12) {
	            delta = 12 - zoom;
	        }
	        else {
	        	delta = - (zoom - 12);
	        }

	        map.setLevel(delta);
	        map.panTo(position);
	    }
	}

	// 사용자의 위치 정보를 받아와서 셋팅하기 - 성공 시,
	function onSuccessGeolocation(position) {
	    var location = new daum.maps.LatLng(position.coords.latitude,
	                                         position.coords.longitude);

	    map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
	    map.setLevel(12); // 지도의 줌 레벨을 변경합니다.

	}

	// 사용자의 위치 정보를 받아와서 셋팅하기 - 실패 시,
	function onErrorGeolocation() {
	    console.log("위치 보기를 차단하셨습니다.");
	}

	//지도의 움직임이 종료되었을 때 이벤트가 발생.


	// 사용자의 위치 정보를 받아와서 셋팅하기
	$(window).on("load", function() {

	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
	    } else {
	        var center = map.getCenter();

	        infowindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');
	        infowindow.open(map, center);
	    }
	});


	$(function(){

		$.ajax({
			url: "/store/storeInfo.do",
			cache: false,
			method: "post",
			dataType: "json"
		}).done(function(data) {
			// Fetch Store data to map
			STORE_POSITION = data;
			settingStore();

			for (var i=0, ii=markers.length; i<ii; i++) {
			    daum.maps.event.addListener(markers[i], 'click', getClickHandler(i));
			}

		}).fail(function(xhr, textStatus, error){
			console.log("ajax 에러가 발생했습니다.: "+xhr.responseText);
			console.log("textStatus: "+textStatus);
			console.log("error: "+error);
		});


	});


	// Custom Navigation
	var mapNav = $("#map .map_nav");
	var doLevel = mapNav.find("ul.do_level");
	var siLevel = mapNav.find("ul.si_level");
	var brandShop = $("#brand_shop_button"),
		standardShop = $("#standard_shop_button");

	// BRAND SHOP CLICK EVENT
	brandShop.on("click", function(){

		var storeKeys = Object.keys(STORE_POSITION);
		var storeValues = Object.keys(STORE_POSITION).map(function(e) { return STORE_POSITION[e]; });
		var selected = $(this).find('img').attr('data-selected'); // 0: unselected, 1: selected
		var standardshopSelected = standardShop.find('img').attr('data-selected'); // 0: unselected, 1: selected

		// case 1 : brandshop selected, standardshop unselected -> only brandshop
		// case 2 : brandshop unselected, standardshop selected -> only standardshop
		// case 3 : brandshop, standardshop unselected -> ALL
		// case 4 : brandshop, standardshop selected -> X 없음. 하나만 선택 되도록 함.

		if (selected == '0') {
			$(this).find('img').attr('data-selected', '1');
			$(this).find('img').attr('src', '/img/front/store/brandshop_nav_selected.png');

			// case 1, only brandshop
			for (var i = 0, ii = storeValues.length ; i < ii ; i++ ) {
				var isBrand = storeValues[i][5] == "B";
				var area1_flag = storeValues[i][6] == area1;
				var area2_flag = storeValues[i][7] == area2;
				var area_flag = area1 == '' && area2 == '' ? true :
							   (area2 == '' ? area1_flag : (area1_flag && area2_flag));

				// 선택한 지역 내 Marker Filter
				if (area_flag && isBrand) {
					showMarker(map, markers[i]);
				} else {
					hideMarker(map, markers[i]);
					if (infoWindows[i].getMap()) {
				  	    infoWindows[i].close();
				    }
				}
			}
			changeList(area1, area2, "B");
			if (standardshopSelected == '0') { /* do nothing */ }
			else {
				// case 4
				standardShop.find('img').attr('data-selected', '0');
				standardShop.find('img').attr('src', '/img/front/store/standardshop_nav_unselected.png');
			}
		} else {
			// case 3
			// Initialize Shop Filtering
			$(this).find('img').attr('data-selected', '0');
			$(this).find('img').attr('src', '/img/front/store/brandshop_nav_unselected.png');
			initializeShopFilteringByArea();
			changeList(area1, area2, "A");
		}

		for (var i = 0, ii=infoWindows.length; i<ii ; i++) {
        	if (infoWindows[i].getMap()) {
  	           infoWindows[i].close();
        	}
        }
	});

	// STANDARD SHOP CLICK EVENT
	standardShop.on("click", function(){

		var storeKeys = Object.keys(STORE_POSITION);
		var storeValues = Object.keys(STORE_POSITION).map(function(e) { return STORE_POSITION[e]; });
		var selected = $(this).find('img').attr('data-selected'); // 0: unselected, 1: selected
		var brandshopSelected = brandShop.find('img').attr('data-selected'); // 0: unselected, 1: selected

		// case 1 : brandshop selected, standardshop unselected -> only brandshop
		// case 2 : brandshop unselected, standardshop selected -> only standardshop
		// case 3 : brandshop, standardshop unselected -> ALL
		// case 4 : brandshop, standardshop selected -> X 없음. 하나만 선택 되도록 함.

		if (selected == '0') {
			$(this).find('img').attr('data-selected', '1');
			$(this).find('img').attr('src', '/img/front/store/standardshop_nav_selected.png');

			// case 2, only standardshop

			for (var i = 0, ii = storeValues.length ; i < ii ; i++ ) {
				// storeValues[i][6] : area1, storeValues[i][7] : area2
				var isStandard = storeValues[i][5] == "S";

				var area1_flag = storeValues[i][6] == area1;
				var area2_flag = storeValues[i][7] == area2;
				var area_flag = area1 == '' && area2 == '' ? true :
							   (area2 == '' ? area1_flag : (area1_flag && area2_flag));

				// 선택한 지역 내 Marker Filter
				if (area_flag && isStandard) {
					showMarker(map, markers[i]);
				} else {
					hideMarker(map, markers[i]);
					if (infoWindows[i].getMap()) {
				  	    infoWindows[i].close();
				    }
				}
			}
			changeList(area1, area2, "S");
			if (brandshopSelected == '0') { /* do nothing */ }
			else {
				// case 4
				brandShop.find('img').attr('data-selected', '0');
				brandShop.find('img').attr('src', '/img/front/store/brandshop_nav_unselected.png');
			}
		} else {
			// case 3
			// Initialize Shop Filtering
			$(this).find('img').attr('data-selected', '0');
			$(this).find('img').attr('src', '/img/front/store/standardshop_nav_unselected.png');
			initializeShopFilteringByArea();
			changeList(area1, area2, "A");
		}

        for (var i = 0, ii=infoWindows.length; i<ii ; i++) {
        	if (infoWindows[i].getMap()) {
  	           infoWindows[i].close();
        	}
        }

	});

	var cell = Number('${cell}');	// 상점 노출 단위 (default 10)
	var idx = 1;
	var area1 = 'A02001';	// default
	var area2 = ''; // si level

	// 서울, 경기, 인천 ...
	$(doLevel).find("li").each(function(idx){
		$(this).click(function(){
			$(this).addClass("selected");
			$(this).siblings().removeClass("selected");

			selectedArea1 = $(this).attr("data-cd");

			var sLat = $(this).attr("data-lat");
			var sLng = $(this).attr("data-lng");
			var sZoom = $(this).attr("data-zoom");
			var position = new daum.maps.LatLng(sLat, sLng);
			selectedZoom = sZoom;

			/*
			var delta = 0,
	            zoom = map.getLevel();

	        if (zoom < sZoom) {
	            delta = sZoom - zoom;
		        console.log(sZoom + " - " + zoom + " = " + delta);
	        }
	        else {
	        	delta = - (zoom - sZoom);
		        console.log("- (" + sZoom + " - " + zoom + ")" + " = " + delta);
	        }

	        for (var i = 0, ii=infoWindows.length; i<ii ; i++) {
	        	if (infoWindows[i].getMap()) {
	  	           infoWindows[i].close();
	        	}
	        }
 			*/

	        map.setLevel(sZoom);
	        map.panTo(position);

	        // Inner areas fetch in right navigation
	        fetchArea($(this).attr('data-cd'));

	        // Change Store List - do level
	        area1 = selectedArea1;
	        area2 = '';
	        changeList(selectedArea1, '', "A");

	        // InfoWindows Close
	        for (var i = 0, ii=infoWindows.length; i<ii ; i++) {
	        	if (infoWindows[i].getMap()) {
	  	           infoWindows[i].close();
	        	}
	        }
	    	 // marker filter
			initializeShopFilteringByArea();

		});
	});

	function initializeShopFilteringByArea() {
		var storeKeys = Object.keys(STORE_POSITION);
		var storeValues = Object.keys(STORE_POSITION).map(function(e) { return STORE_POSITION[e]; });

		for (var i = 0, ii = storeValues.length ; i < ii ; i++ ) {
			var area1_flag = storeValues[i][6] == area1;
			var area2_flag = storeValues[i][7] == area2;
			var area_flag = area1 == '' && area2 == '' ? true :
						   (area2 == '' ? area1_flag : (area1_flag && area2_flag));
			// 선택한 지역 내 Marker Filter
			if (area_flag) {
				showMarker(map, markers[i]);
			} else {
				hideMarker(map, markers[i]);
				if (infoWindows[i].getMap()) {
			  	    infoWindows[i].close();
			    }
			}
		}

		brandShop.find('img').attr('data-selected', '0');
		brandShop.find('img').attr('src', '/img/front/store/brandshop_nav_unselected.png');
		standardShop.find('img').attr('data-selected', '0');
		standardShop.find('img').attr('src', '/img/front/store/standardshop_nav_unselected.png');
	}

	// fetch areas in detail Navigation
	function fetchArea(area) {

		// si_level setting
        $.ajax({
			url: "/store/fetchArea.do",
			cache: false,
			method: "post",
			dataType: "json",
			data: {"area": area}
		}).done(function(data) {
			// Fetch Store data to map
			/* <li class="noto" data-cd="${o.code}" data-lat="${o.manage1}" data-lng="${o.manage2}" data-zoom="${o.manage3}">${o.name}</li> */


			$(siLevel).html("");
			if (typeof data.list != 'undefined') {
				if (data.list.length != 0) {
					for (var i=0, ii = data.list.length ; i<ii ; i++) {
						$(siLevel).append("<li class='noto' "
								+ "data-cd = '"
								+ data.list[i].code
								+ "' data-lat = '"
								+ data.list[i].manage1
								+ "' data-lng = '"
								+ data.list[i].manage2
								+ "' data-zoom = '"
								+ data.list[i].manage3
								+ "' >"
								+data.list[i].name+"</li>");
					}

					// 이천시, 의왕시, 양주시, 송파구, 도봉구, ...
					$(siLevel).find("li").each(function(idx){
						$(this).click(function(){
							$(this).addClass("selected");
							$(this).siblings().removeClass("selected");

							selectedArea2 = $(this).attr("data-cd");


							var ssLat = $(this).attr("data-lat");
							var ssLng = $(this).attr("data-lng");
							var ssPosition = new daum.maps.LatLng(ssLat, ssLng);

							//스토어 지도 Zoom 수정 START 20190830 ysi
							//기존 소스 주석처리
							/* var ssZoom = $(this).attr("data-zoom") - 1;
							selectedZoom = ssZoom;

							var delta = 0,
					            zoom = map.getLevel();

					        if (zoom < ssZoom) {
					            delta = ssZoom - zoom;
					        }
					        else {
					        	delta = - (zoom - ssZoom);
					        }

					        for (var i = 0, ii=infoWindows.length; i<ii ; i++) {
					        	if (infoWindows[i].getMap()) {
					  	           infoWindows[i].close();
					        	}
					        }
					        map.setLevel(delta);  */

					        //수정소스
					        var ssZoom = $(this).attr("data-zoom");
					        selectedZoom = ssZoom;

					        map.setLevel(ssZoom);
					        //스토어 지도 Zoom 수정  END 20190830

					        map.panTo(ssPosition);

					     	// Change Store List - si level
					     	area2 = selectedArea2;
					        changeList(area1, selectedArea2, "A");

					        // marker filter
					        initializeShopFilteringByArea();
						});
					});
				}
			}
			else {
				selectedArea2 = "";
			}
		}).fail(function(xhr, textStatus, error){
			console.log("ajax 에러가 발생했습니다.: "+xhr.responseText);
			console.log("textStatus: "+textStatus);
			console.log("error: "+error);
		});
	}

	function toggleHowToCome(obj) {
		var howToComeDiv = $(obj).parent().parent().next().next();
		howToComeDiv.slideToggle();
	}

	function changeList(area1, area2, type) {
		$.ajax({
			url: "/store/changeStoreList.do",
			cache: false,
			method: "post",
			dataType: "json",
			data: {
					"area1": area1,
					"area2": area2,
					"type": (type == null ? "A" : type)
				  }
		}).done(function(data) {
			// Fetch Store data to Store list
			// Change total size

			var total = Number(data.size);
			// Initialize idx
			idx = 1;

			if (data.list.length > 0) {
				var str = "";
				for (var i = 0, ii = data.list.length; i < ii ; i++) {
					str += "<div class='store_info_div'>"
						+ "		<div class='info_item'>"
						+ "			<img src='"+data.list[i].storeImg+"' alt='매장 이미지'/>"
						+ "		</div>"
						+ "		<div class='info_item item2'>"
						+ "			<div class='item_title'>";

					str	+=				data.list[i].storeType === 'B' ? "<img src='/img/front/store/brandshop.png' alt='b'/>" : "<img src='/img/front/store/standardshop.png' alt='s'/>";
					str	+= "			<span class='f18 noto b'>" + data.list[i].storeNm + "</span>"
						+"			</div>"
						+"			<p class='noto f15 address'>"
						+				data.list[i].address
						+"			</p>"
						+"	<span class='noto f15 phone'>" + data.list[i].phone + "</span><br>";


					str +="	<span class='noto f13 etc'>" + (data.list[i].parkingYn == 'Y' ? "주차가능" : "주차불가") + "</span><br>";
					str	+="	<span class='noto f13 etc'>영업시간 " + data.list[i].startTime + " ~ " + data.list[i].endTime + "</span><br>"
						+"	<span class='noto f13 etc'>" + data.list[i].openTime + "</span><br>";

					if(data.list[i].momYn == 'Y') {
						str += " <input type='button' value='자세히 보기' class='noto grayBtn' onclick='location.href=/lifestyle/view.do?lsCode=LSP190400003'/>"
						     + " <input type='button' style='left: 710px !important;' value='오시는 길' class='noto grayBtn' onclick='toggleHowToCome(this)'/>"
					} else {
						str += " <input type='button' value='오시는 길' class='noto grayBtn' onclick='toggleHowToCome(this)'/>"

					}

					str	+="	</div>"
						+"<div class='info_item item2'>"
						+"	<div class='item_title'>"
						+"		<span class='f16 noto b'>층별 안내</span>"
						+"	</div>"
						+"	<table>";

					for (var f = 0, ff = data.list[i].sfvoList.length; f<ff; f++) {
						str += "<tr>"
							+	"<th width=40px class='noto f15'>"+data.list[i].sfvoList[f].storeFloor+"</th>"
							+	"<td width=230px class='noto f15'>"+data.list[i].sfvoList[f].floorDetail+"</td>"
							+"</tr>";
					}

					var htc1 = data.list[i].howToCome1,
						htc2 = data.list[i].howToCome2;

					str += "</table></div></div>"
						+	'<div class="separator_line"></div>'
						+	'<div class="how_to_come_div">'
						+	'	<div class="htc_item">'
						+	'		<span class="noto htc_item_title f17">' + data.list[i].tp1 + '</span>'
						+	'		<p class="noto f15">' + htc1.replace(/(\n|\r\n)/g, '<br>') + '</p>'
						+	'	</div>'
						+	'	<div class="htc_item">'
						+	'		<span class="noto htc_item_title f17">' + data.list[i].tp2 + '</span>'
						+	'		<p class="noto f15">' + htc2.replace(/(\n|\r\n)/g, '<br>') + '</p>'
						+	'	</div>'
						+	'</div>';
				}
				$("#contents div#store_list_div").html(str);
				if(data.list.length == cell  && idx < total ) {
					// 데이터가 더 있다.
					$("#contents div.read_more_div").css('visibility', 'visible');
					$("#contents div.read_more_div").find(".redBtn").val("Read more "+idx+" / "+total);
					$("#contents div.read_more_div").find(".redBtn").attr('onClick', 'readMore('+ total +')');
				} else{
					$("#contents div.read_more_div").css('visibility', 'hidden');
				}
			} else {
				$("#contents div#store_list_div").html('');
				$("#contents div.read_more_div").css('visibility', 'hidden');
			}


		}).fail(function(xhr, textStatus, error){
			console.log("ajax 에러가 발생했습니다.: "+xhr.responseText);
			console.log("textStatus: "+textStatus);
			console.log("error: "+error);
		});
	}

	function readMore(total) {

		if (idx === total) {
			console.log("끝");
			$("#contents div.read_more_div").css('visibility', 'hidden');
			return false;
		} else {idx += 1; }

		$.ajax({
			url: "/store/moreStoreInfo.do",
			cache: false,
			method: "post",
			dataType: "json",
			data: {"area1": area1, "area2": area2, "idx": idx}
		}).done(function(data) {
			// Fetch Store data to Store list
			console.log(data.list);
			console.log(data.list.length);
			if (data.list.length > 0) {
				var str = "";
				for (var i = 0, ii = data.list.length; i < ii ; i++) {
					str += "<div class='store_info_div'>"
						+ "		<div class='info_item'>"
						+ "			<img src='"+data.list[i].storeImg.replace("_","S470_")+"' alt='매장 이미지'/>"
						+ "		</div>"
						+ "		<div class='info_item item2'>"
						+ "			<div class='item_title'>";

					str	+=				data.list[i].storeType === 'B' ? "<img src='/img/front/store/brandshop.png' alt='b'/>" : "<img src='/img/front/store/standardshop.png' alt='s'/>";
					str	+= "			<span class='f18 noto b'>" + data.list[i].storeNm + "</span>"
						+"			</div>"
						+"			<p class='noto f15 address'>"
						+				data.list[i].address
						+"			</p>"
						+"	<span class='noto f15 phone'>" + data.list[i].phone + "</span><br>";


					str +="	<span class='noto f13 etc'>" + (data.list[i].parkingYn == 'Y' ? "주차가능" : "주차불가") + "</span><br>";
					str	+="	<span class='noto f13 etc'>영업시간 " + data.list[i].startTime + " ~ " + data.list[i].endTime + "</span><br>"
						+"	<span class='noto f13 etc'>" + data.list[i].openTime + "</span><br>";

					if(data.list[i].momYn == 'Y') {
						str += " <input type='button' value='자세히 보기' class='noto grayBtn' onclick='location.href=/lifestyle/view.do?lsCode=LSP190400003'/>"
						     + " <input type='button' style='left: 710px !important;' value='오시는 길' class='noto grayBtn' onclick='toggleHowToCome(this)'/>"
					} else {
						str += " <input type='button' value='오시는 길' class='noto grayBtn' onclick='toggleHowToCome(this)'/>"

					}

					str +="	</div>"
						+"<div class='info_item item2'>"
						+"	<div class='item_title'>"
						+"		<span class='f16 noto b'>층별 안내</span>"
						+"	</div>"
						+"	<table>";

					for (var f = 0, ff = data.list[i].sfvoList.length; f<ff; f++) {
						str += "<tr>"
							+	"<th width=40px class='noto f15'>"+data.list[i].sfvoList[f].storeFloor+"</th>"
							+	"<td width=230px class='noto f15'>"+data.list[i].sfvoList[f].floorDetail+"</td>"
							+"</tr>";
					}

					var htc1 = data.list[i].howToCome1,
						htc2 = data.list[i].howToCome2;

					str += "</table></div></div>"
						+	'<div class="separator_line"></div>'
						+	'<div class="how_to_come_div">'
						+	'	<div class="htc_item">'
						+	'		<span class="noto htc_item_title f17">' + data.list[i].tp1 + '</span>'
						+	'		<p class="noto f15">' + htc1 + '</p>'
						+	'	</div>'
						+	'	<div class="htc_item">'
						+	'		<span class="noto htc_item_title f17">' + data.list[i].tp2 + '</span>'
						+	'		<p class="noto f15">' + htc2 + '</p>'
						+	'	</div>'
						+	'</div>';

				}

				$("#contents div#store_list_div").append(str);
				if(data.list.length == cell  && idx < total ) {
					// 데이터가 더 있다는 뜻.
					$("#contents div.read_more_div").css('visibility', 'visible');
					$("#contents div.read_more_div").find(".redBtn").val("Read more "+idx+" / "+total);
				} else{
					$("#contents div.read_more_div").css('visibility', 'hidden');
				}
			} else {
				$("#contents div#store_list_div").html('');
				$("#contents div.read_more_div").css('visibility', 'hidden');
			}
		}).fail(function(xhr, textStatus, error){
			console.log("ajax 에러가 발생했습니다.: "+xhr.responseText);
			console.log("textStatus: "+textStatus);
			console.log("error: "+error);
		});
	}

</script>