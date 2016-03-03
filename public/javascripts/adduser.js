$(document).ready(function(){
    $('#inputUserName').change(function(){
        console.log('hello?');
        if($('#inputUserName').val() != '' && $('#inputPassword').val() != '' && $('#inputPassword').val() == $('#repeatPassword').val()){
            $('#submit').prop('disabled',false);
        }
        else {
            $('#submit').prop('disabled',true);
        }
    });

    $('#inputPassword').change(function(){
        if($('#inputUserName').val() != '' && $('#inputPassword').val() != '' && $('#inputPassword').val() == $('#repeatPassword').val()) {
            $('#submit').prop('disabled',false);
        }
        else {
            $('#submit').prop('disabled',true);
        }
    });

    $('#repeatPassword').change(function(){
        if($('#inputUserName').val() != '' && $('#inputPassword').val() != '' && $('#inputPassword').val() == $('#repeatPassword').val()) {
            $('#submit').prop('disabled',false);
        }
        else {
            //add functionality for other indications that password & repeat password boxes do not match
            $('#submit').prop('disabled',true);
        }
    });
});