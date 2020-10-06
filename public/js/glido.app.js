$(document).ready(()=>{
    $('.container').css('height', ($(window).outerHeight()-$('header').outerHeight())+'px');
});
window.onresize = ()=>{
    $('.container').css('height', ($(window).outerHeight()-$('header').outerHeight())+'px');
};

$('.menu-item').on('click', function(){
    $('#overlayer').fadeIn(80);
    $('#'+$(this).data('name')).addClass('display-flex').show(80);
});
