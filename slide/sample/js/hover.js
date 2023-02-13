let pos = {x:0,y:0};
let redSpan;

for(let li of s_li){
    const liDiv = li.getElementsByTagName('DIV')[0];
    liDiv.addEventListener('mouseenter',on_redSpan);
    li.addEventListener('mouseleave',off_redSpan);
}

function on_redSpan(e){
    e = e || window.event;
    pos.x = e.offsetX;
    pos.y = e.offsetY;
    redSpan = this.nextElementSibling;
    redSpan.style.transform = `
        translate(${pos.x}px, ${pos.y}px) scale(100)
    `;
}

function off_redSpan(e){
    e = e || window.event;
    pos.x = e.offsetX;
    pos.y = e.offsetY;
    redSpan.style.transform = `
        translate(${pos.x}px, ${pos.y}px) scale(.1)
    `;
}