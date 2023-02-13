const MIN = 1;
const MAX = 100;
const COUNT_LIMIT = 5;
let answer = Math.floor(Math.random() * MAX) + MIN;
let count = 0;

function gameReset(){
    answer = Math.floor(Math.random() * MAX) + MIN;
    count = 0;
    $('.txtInptBx').val('');
    $('.nwBx .usrNum').text('');
    $('.nwBx .rslt').text('');
    $('.fnlBx .answr').text('');
    $('.fnlBx .cnt').text('');
    $('.hstryBx').children('dl').remove();
    $('.cntLmt').text(`${COUNT_LIMIT}회`);
    $('.fnlBx').removeClass('on');
}

// constructor function(history list)
function HistoryList(num, result){
    this.num = num;
    this.result = result;
    this.template = 
        `<dl class="dfFlxBx _jstfySpcBtwn">
            <dt class="dfBx usrNum">${this.num}</dt>
            <dd class="dfBx rslt">${this.result}</dd>
        </dl>`;
}

// set level
function setLevel(){
    gameReset();
    let lvl = $('input[name="lvl"]:checked').val();
    switch(lvl){
        case "easy":
            $(".easyLv").addClass("on");
            $(".hrdLv").removeClass("on");
            break;
        case "hard":
            $(".hrdLv").addClass("on");
            $(".easyLv").removeClass("on");
            break;
    }
}

function enterkey() {
	if (window.event.keyCode == 13) {
    	$('.setInpt').trigger('click');
    }
}

function getUserInput(){
    $(".setInpt").on("click keyup", function(e){
        let userVal = $(".usrInpt").val();
        $('.txtInptBx').val('');

        //validation
        if(userVal == ""){
            alert("값을 입력해주세요.");
            return;
        }else if(isNaN(userVal)){
            alert("숫자만 입력해주세요.");
            return;
        }else if(userVal < MIN || userVal > MAX){
            alert("멍청이ㅋㅋ 무슨 숫자를 입력하는거야?");
            return;
        }
        
        // history list
        if(count > 0){
            let hstryLst = new HistoryList($('.nwBx .usrNum').text(), $('.nwBx .rslt').text());
            $('.hstryBx .ttl').after(hstryLst.template);
        }
        count++;
        let lvl = $('input[name="lvl"]:checked').val();
        if(lvl == "hard"){
            if((COUNT_LIMIT - count) <= 0){
                alert("실패!!");
                $('.fnlBx').addClass('on');
                $('.fnlBx .answr').text(ANSWER);
                $('.fnlBx .fail').addClass('off');
                $('.hstryBx').addClass('on');
            }
        }
        //game logic
        $('.cntLmt').text(`${COUNT_LIMIT - count}회`);
        $('.nwBx .usrNum').text(userVal);
        if(userVal > ANSWER){
            $('.nwBx .rslt').text("DOWN");
        }else if(userVal < ANSWER){
            $('.nwBx .rslt').text("UP");
        }else{
            $('.fnlBx').addClass('on');
            $('.fnlBx .answr').text(ANSWER);
            $('.fnlBx .cnt').text(`${count}회`);
            $('.hstryBx').addClass('on');
            alert("정답입니다!");
        }
    });
}