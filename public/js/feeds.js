if ('Worker' in window){
    $('.centercol').load('/app/feeds/'+$('.centercol').data('id'));
    var worker = new Worker('/js/feeds-worker.js');
    worker.onmessage = (event)=>{
        console.log(event);
    };
    worker.postMessage("Hello Worker");
}