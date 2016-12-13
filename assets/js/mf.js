// smooth scrolling
$('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 500);
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
//navbar add class inverse on 100 from top
