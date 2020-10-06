var i = 0;
var slide = $('.slide-item');
var time = 5000;

setInterval(()=>{
    playSlide(i);
    i++;
    if (i >= (slide.length-1)){
        i = -1;
    }
}, time);

function playSlide(index){
    slide.eq(index).css('left', '0px');
    var oldSlide = slide.eq(index);
    new Promise((res,rej)=>{
        let outerWidth = slide.eq(index).outerWidth();
        oldSlide.css('left','-'+outerWidth+'px');
        index++;
        slide.eq(index).addClass('active');
        slide.eq(index).css('left','0px');
        $('.slide-indicator').removeClass('active');
        $('.slide-indicator').eq(index).addClass('active');
        res(true);
    }).then((e)=>{
        $('.slide-item').not('.slide-item.active').css('left','100%');
        oldSlide.removeClass('active');
    });
}