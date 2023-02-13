let answer = Math.floor(Math.random() * 100) + 1;
let inputNum = -1;
let idx = 0

while(inputNum != answer){
    inputNum = prompt("재도전! 1~100 사이의 숫자를 입력해주세요.(exit을 입력하시면 나가실 수 있습니다.)");
    idx++;
    if(inputNum == "exit" || inputNum == answer){
        alert(`정답입니다! 입력하신 숫자는 ${answer}입니다! 도전횟수: ${idx}번`);
        break;
    }else if(inputNum > answer){console.log("다운")}
    else{console.log("업")}
}
