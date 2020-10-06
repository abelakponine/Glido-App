
function showRegistration(){
    $('#header-layer').fadeIn(80);
    $('#signup').addClass('display-flex').show(80);
}
function hideRegistration(){
    $('#signup').removeClass('display-flex').hide(80);
    $('#header-layer').fadeOut(80);
}
function showMenu(){
    $('#header-layer').fadeIn(80);
    $('#menu').addClass('display-flex').show(80);
}
function hideOverlay(){
    $('.overlay-item').removeClass('display-flex').hide(80);
    $('#overlayer').fadeOut(80);
}
function hideLayers(){
    $('#menu,#contacts').removeClass('display-flex').hide(80);
    $('#header-layer,#overlayer,#new-post,#new-comment').fadeOut(80);
}
function showCallOptions(id){
    $('#contacts .innerDarkLayer').fadeIn(80);
    $('#contacts .callOptions').show(80);
}
function hideCallOptions(){
    $('#contacts .callOptions').hide(80);
    $('#contacts .innerDarkLayer').fadeOut(80);
}
function showContactDeleteOption(id){
    $('#contacts .innerDarkLayer').fadeIn(80);
    $('#contacts .deleteOption').show(80);
}
function hideContactDeleteOption(){
    $('#contacts .deleteOption').hide(80);
    $('#contacts .innerDarkLayer').fadeOut(80);
}
function showAddNewContact(){
    $('#new-contact').show(80);
}
function hideAddNewContact(){
    $('#new-contact').hide(80);
}
function createNewPost(){
    $('#header-layer').fadeIn(80);
    $('#new-post').show(80);
}
function doSignup(elem, event){
    event.preventDefault();
    $(elem).find('.fa-spinner').removeClass('display-hide');
    
    $.ajax({
        method: "post",
        url: "/signup",
        data: {
            firstname: elem.firstname.value,
            lastname: elem.lastname.value,
            dob: elem.dob.value,
            gender: elem.gender.value,
            email: elem.email.value,
            telephone: elem.telephone.value,
            location: elem.location.value,
            username: elem.username.value,
            password: elem.password.value
        },
        success: (data)=>{
            if (data.code == "ER_DUP_ENTRY"){
                alert("User account already exist.");
                $(elem).find('.fa-spinner').addClass('display-hide');
            }
            else if (data == true) {
                console.log("Account created successfully.");
                location.href = "/app";
            }
        }
    });
}
function doLogin(elem, event){
    event.preventDefault();
    $(elem).find('.fa-spinner').removeClass('display-hide');
    
    $.ajax({
        method: "post",
        url: "/login",
        data: {
            username: elem.username.value,
            password: elem.password.value
        },
        success: (data)=>{
            if (data.status == true){
                if (data.result.length < 1){
                    alert("User account does not exist.");
                    $(elem).find('.fa-spinner').addClass('display-hide');
                }
                else if (data.result.length > 0) {
                    console.log("Account verified successfully.");
                    console.log(data.result);
                    location.href = "/app";
                }
            }
            else {
                alert("User account does not exist.");
            }
        }
    });
}
function doCreatePost(elem){
    let author = $("#new-post").find('#author').data('author');
    let media = $('#post-media')[0].files[0] || "";
    let tags = $("#new-post").find('#tags').val();
    let mention = $("#new-post").find('#mention').val();
    let content = $("#new-post").find('#content').val();
    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    $(elem).find('i').toggleClass('fa-feather fas fa fa-spinner fa-spin');

    formData.append("author", author);
    formData.append("content", content);
    formData.append("media", media);
    formData.append("tags", tags);
    formData.append("mention", mention);

    xhr.onreadystatechange = (e)=>{
        if (e.target.readyState == 4){
            if (e.target.response == "true"){
                $(elem).find('i').toggleClass('fa-feather fas fa fa-spinner fa-spin');
                toast("post shared!");
                $('#preview-media').html('').hide(80);
                $('#post-media').val('');
                $('#content').val('');
                $('#tags').val('');
                $('#mention').val('');
                
                setTimeout(()=>{
                    hideLayers();
                }, 2000);

                // load fresh feeds
                $('.centercol').load('/app/feeds/'+$('.centercol').data('id'));
            }
            else {
                console.log(e.target.response);
            }
        }
    };
    xhr.open('POST','/uploader');
    xhr.send(formData);
}
function doPreviewMedia(elem){
    if ($(elem).val() !== ""){
    
        let imgExt = ['image/jpeg','image/webp','image/png','image/gif'];
        let vidExt = ['video/mp4'];
        let fileExt = elem.files[0].type;
        let url = window.URL || window.webkitURL;
        let previewLink = url.createObjectURL(elem.files[0]);

        if (imgExt.includes(fileExt)){
            let view = document.createElement('img');
            view.src = previewLink;
            $(view).css({'width':'auto','height':'100%','border-radius':'6px',
                'display':'block','position':'absolute','top':'50%','left':'50%','transform':'translate(-50%,-50%)'});
            $('#preview-media').html(view).show(80);
        }
        else if (vidExt.includes(fileExt)){
            console.log(true);
        }
        else {
            console.log(false);
        }
    }
    else {
        $('#preview-media').html('').hide(80);
    }
}
function toast(msg, millisecs=2000){
    $('#toast').html(msg);
    $('#toast').fadeIn(80).css({'transform':'translate(-50%,60px)','transition-duration': '0.6s'});
    setTimeout(()=>{
        $('#toast').css({'transform':'translate(-50%,-100%)','transition-duration': (millisecs/1000)+'s'}).fadeOut(80);
    }, millisecs);
}
function doLike(elem, event){
    event.preventDefault();
    event.stopImmediatePropagation();
    $(elem).find('.vHeart').fadeIn(10).animate({'top':'60%'}, 100)
        .animate({'top':'48%'}, 100).animate({'top':'55%'}, 100).animate({'top':'50%'}, 100).promise().done(e=>{
            $(e).css({'transform':'translate(-50%, -50%) scale(4)','transition-duration':'1s'});
            $(e).fadeOut(300).promise().done(e=>{
                $(e).css({'transform':'translate(-50%, -50%)','transition-duration':'0s'});
            });
        });
    
    return false;
}
function showComments(elem, commenter){
    this.postid = $(elem).parent().data('postid');
    this.commenter = commenter;
    $('#header-layer').fadeIn(80);
    $('#new-comment').show(80);
    $('.comment-box').load(`/app/post/${postid}`);
    $('#comment-input').focus();
}
function sendComment(){
    let formData = new FormData();
    let xhr = new XMLHttpRequest();
    formData.append('postid', this.postid);
    formData.append('commenter', this.commenter);
    formData.append('content', $('#comment-input').val());
    formData.append('media', '');
    
    xhr.onreadystatechange = (e)=>{
        if (e.target.readyState == 4){
            if (e.target.response == "true"){
                
            }
            else {
                console.log(e.target.response);
            }
        }
    };
    xhr.open('POST','/save-comment');
    xhr.send(formData);
    $('#comment-input').val('').focus();
}