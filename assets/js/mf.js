//for login
var scope = 'email profile https://www.googleapis.com/auth/calendar.readonly',
    redirect_uri = 'https://mackintoshsecurity-c93e5.firebaseapp.com/dashboard',
    response_type = 'token',
    client_id = '19749026565-sel10tirv0a9t0hnl6cumr54b07perib.apps.googleusercontent.com'

$('#login').attr('href', 'https://accounts.google.com/o/oauth2/v2/auth?scope=' + scope +
    '&redirect_uri=' + redirect_uri + '&response_type=token&client_id=' + client_id);

//fade in landing
$('#first_words h1').fadeIn(800);
$('#first_words h3').delay(400).fadeIn(500);
$('#first_words a').delay(800).fadeIn(500);

// smooth scrolling
$('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }
});

//#contact_form submission
$('#contact_form').submit(function() {
    event.preventDefault();
    if ($('#contact_form_insecure').val()) {
        return false;
    } else {
        var message = {
            sender: $('#contact_form_full_name').val(),
            email: $('#contact_form_email').val(),
            phone: $('#contact_form_phone').val(),
            company: $('#contact_form_company').val(),
            body: $('#contact_form_message').val()
        };
        $.ajax({
            url: "https://formspree.io/luis@mackintoshsecurity.com",
            method: "POST",
            data: {
                message: "From: " + message.sender +
                    " with " + message.company +
                    "\nCall: " + message.phone +
                    "\nReply to: " + message.email +
                    "\n" + message.body
            },
            dataType: "json"
        });
        $('#contact .container').append('<div id="contact_form_response" class="lead text-center no-display">Thanks! We\'ll be in touch!</div>');
        $('#contact_form_response').fadeIn(500).delay(2000).fadeOut(500);
        console.log('I am message', message);
    }
});
//navbar remove class no-background-border on 100 from top
var scroll_pos = 0;
$(document).scroll(function() {
    scroll_pos = $(this).scrollTop();
    if (scroll_pos > 100) {
        $('nav').removeClass('no-background');
        $('nav li a').removeClass('white-font');
        $('#first_words').fadeOut(200);
        $('#company').fadeIn(300);
    } else {
        $('nav').addClass('no-background');
        $('nav li a').addClass('white-font');
        $('#first_words').fadeIn(500);
        $('#company').fadeOut(300);
    }
});
