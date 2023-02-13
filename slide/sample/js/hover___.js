let pos = {x:0,y:0};
let thisLI,redSpan;

slider.addEventListener('mousemove',(e)=>{
    if(e.target.tagName == 'LI'){
        thisLI = e.target
        redSpan = thisLI.getElementsByClassName('redSpan')[0];
        on_redSpan(e,thisLI,redSpan);
        return;
    }else{}
});

function on_redSpan(e,li,rs){
    pos.x = e.clientX - li.getBoundingClientRect().left;
    pos.y = e.clientY - li.getBoundingClientRect().top;
    rs.classList.add('on');
    rs.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(10)`;
    console.log(pos.x, pos.y);
}