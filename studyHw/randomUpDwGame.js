const MIN = 1;
const MAX = 100;
const COUNT_LIMIT = 5;
const ANSWER = Math.floor(Math.random() * MAX) + MIN;
const re = /[0-9]/;

function getUserInput(){
    $(".setInpt").on("click", function(){
        console.log("클릭");
        let userVal = $(".usrInpt").val();
        console.log(userVal);
        
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
        
        //game logic
        if(userVal > ANSWER){
            alert("DOWN!");
        }else if(userVal < ANSWER){
            alert("UP!");
        }else{
            alert("정답입니다!");
            return
        }
    });
}




