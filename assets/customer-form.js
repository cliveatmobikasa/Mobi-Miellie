// By Renika
$(document).ready(function() {
    setTimeout(function() {
        if ($(".payment_methods svg.payment-icon:last-child").attr("aria-labelledby") == null) {
            $(".payment_methods svg.payment-icon:last-child").remove();
            $(".payment_methods").append('<svg height="24" viewBox="0 0 38 24" width="38" xmlns="http://www.w3.org/2000/svg" class="payment-icon"><title>Afterpay</title><path d="m35 0h-32c-1.7 0-3 1.3-3 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3v-18c0-1.7-1.4-3-3-3z" fill="#b2fce4"></path><path d="m27.4 6.8-2.7-1.6-2.7-1.6c-1.8-1-4.1.3-4.1 2.4v.4c0 .2.1.4.3.5l1.3.7c.4.2.8-.1.8-.5v-.8c0-.4.4-.7.8-.5l2.5 1.4 2.4 1.5c.4.2.4.7 0 .9l-2.5 1.4-2.5 1.6c-.4.2-.8-.1-.8-.5v-.4c0-2.1-2.3-3.4-4.1-2.4l-2.7 1.6-2.7 1.6c-1.8 1-1.8 3.7 0 4.7l2.7 1.6 2.7 1.6c1.8 1 4.1-.3 4.1-2.4v-.4c0-.2-.1-.4-.3-.5l-1.3-.7c-.4-.2-.8.1-.8.5v.8c0 .4-.4.7-.8.5l-2.5-1.4-2.5-1.5c-.4-.2-.4-.7 0-.9l2.5-1.4 2.5-1.4c.4-.2.8.1.8.5v.4c0 2.1 2.3 3.4 4.1 2.4l2.7-1.6 2.7-1.6c1.9-1.2 1.9-3.8.1-4.9z"></path></svg>');
        }
    }, 5000);
});

var $fname;
var $lname;
var email;
var password;
var errorClass = 'field--error-plus-dynamic';
var errorMessageSelector = '.field__message--error-plus-dynamic';


// 
var validateAlphabets_ = function(nameField) {

    var errorMessage = "Please enter a valid name using letters, spaces, and hyphens only, the character length must be atleast 3";


    var data = nameField.val();
    if (data == " ") {
        nameField.parent('div').removeClass(errorClass);
        nameField.parent('div').find(errorMessageSelector).remove();
        nameField.parent('div').addClass(errorClass);
        nameField.parent('div').append("<p role='alert' class='field__message field__message--error-plus-dynamic'>please fill out this field</p>");
    } else {
        var letters = /^(?![ -]+$)([a-zA-Z -]{3,})+$/;
        nameField.parent('div').removeClass(errorClass);
        nameField.parent('div').find(errorMessageSelector).remove();
        if (!data.match(letters)) {
            if (!nameField.parent('div').hasClass(errorClass)) {
                nameField.parent('div').addClass(errorClass);
                nameField.parent('div').append("<p role='alert' class='field__message field__message--error-plus-dynamic'>" + errorMessage + "</p>");
            }
            return false;
        } else {

            nameField.parent('div').removeClass(errorClass);
            nameField.parent('div').find(errorMessageSelector).remove();
            return true;
        }
    }
}
// 

var validateAlphabets = function(nameField) {

    var errorMessage = "Please enter a valid name using letters, spaces, and hyphens only";


    var data = nameField.val();
    if (data == "") {
        nameField.parent('div').removeClass(errorClass);
        nameField.parent('div').find(errorMessageSelector).remove();
        nameField.parent('div').addClass(errorClass);
        nameField.parent('div').append("<p role='alert' class='field__message field__message--error-plus-dynamic'>please fill out this field</p>");
    } else {
        var letters = /^(?![ -]+$)([a-zA-Z -]{3,})+$/;
        nameField.parent('div').removeClass(errorClass);
        nameField.parent('div').find(errorMessageSelector).remove();
        if (!data.match(letters)) {
            if (!nameField.parent('div').hasClass(errorClass)) {
                nameField.parent('div').addClass(errorClass);
                nameField.parent('div').append("<p role='alert' class='field__message field__message--error-plus-dynamic'>" + errorMessage + "</p>");
            }
            return false;
        } else {

            nameField.parent('div').removeClass(errorClass);
            nameField.parent('div').find(errorMessageSelector).remove();
            return true;
        }
    }
}

var validateEmail = function(email) {

    var errorMessage = "Please enter valid email";


    var data = email.val();
    if (data == "") {
        email.parent('div').removeClass(errorClass);
        email.parent('div').find(errorMessageSelector).remove();
        email.parent('div').addClass(errorClass);
        email.parent('div').append("<p role='alert' class='field__message field__message--error-plus-dynamic'>Please fill out this field</p>");
    } else {
        var letters = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        email.parent('div').removeClass(errorClass);
        email.parent('div').find(errorMessageSelector).remove();
        if (!data.match(letters)) {
            if (!email.parent('div').hasClass(errorClass)) {
                email.parent('div').addClass(errorClass);
                email.parent('div').append("<p role='alert' class='field__message field__message--error-plus-dynamic'>" + errorMessage + "</p>");
            }
            return false;
        } else {

            email.parent('div').removeClass(errorClass);
            email.parent('div').find(errorMessageSelector).remove();
            return true;
        }
    }
}

var validatePassword = function(password, alertError) {
    const $parent = password.closest('.form--input');
    const $errorElem = $parent.closest('form').find('[data-pswd-error-alert]');
    var data = password.val().trim();
    const status = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,24}$/.test(data);
    if (data == "") {
        password.parent('div').removeClass(errorClass);
        password.parent('div').find(errorMessageSelector).remove();
        password.parent('div').addClass(errorClass);
        password.parent('div').append("<p role='alert' class='field__message field__message--error-plus-dynamic'>Please fill out this field</p>");
        return false;
    }
    else if(!status) {
        password.parent('div').removeClass(errorClass);
        password.parent('div').find(errorMessageSelector).remove();
        $parent.removeClass(errorClass);
        $errorElem.removeAttr('role').removeClass('active');
        $parent.addClass(errorClass);
        if(alertError) {
            $errorElem
            .attr('role', 'alert')
            .text('Passwords must contain at least 8 characters, including uppercase, lowercase letters, numbers and special characters.')
            .addClass('active');
        }
    } else {
        $parent.removeClass(errorClass);
        $errorElem.removeAttr('role').removeClass('active');
    }

    return status;
}

var validatePhoneNumber = function(phoneField) {
    var minChars = 10;
    var maxChars = 15;
    var errorMessage = "Please enter a valid phone number. Only digits, plus sign, hyphen, and letter 'x' are allowed.";
    var numbers = phoneField.val().match(/(\d)/g) || [];
    var numbersLength = numbers.length;
    // var allowPlus = phoneField.val().match(/^\+(?:[0-9]??)$/g) || [];
    // var allowNotZero = phoneField.val().match(/^[1-9][0-9]*$/g) || [];
    var allowedChars = phoneField.val().match(/(\d|\+|\-|\x)/g) || [];
    var phoneFieldVal = phoneField.val;
    phoneField.val(allowedChars.join(''));
    var data = phoneField.val().trim();
    const $parent = phoneField.parent('div');
    if (data == "") {
        phoneField.parent('div').removeClass(errorClass);
        phoneField.parent('div').find(errorMessageSelector).remove();
        phoneField.parent('div').addClass(errorClass);
        phoneField.parent('div').append("<p role='alert' class='field__message field__message--error-plus-dynamic'>Please enter a valid phone number. Only digits, plus sign, hyphen, and letter 'x' are allowed.</p>");
        return false;
    }
    else if (numbersLength !== 0 && numbersLength < minChars || numbersLength > maxChars) {
        if (!$parent.hasClass(errorClass)) {
            $parent.addClass(errorClass);
            $parent.append("<p role='alert' class='field__message field__message--error-plus-dynamic'>" + errorMessage + "</p>");
        }
        return false;
    } else {
        $parent.removeClass(errorClass);
        $parent.find(errorMessageSelector).remove();
        return true;
    }
}


var $fname = $('form#create_customer [name="customer[first_name]"]');
var $lname = $('form#create_customer [name="customer[last_name]"]');
var $email = $('form#create_customer [name="customer[email]"]');
var $password = $('form#create_customer [name="customer[password]"]');
var $phoneNum = $('form#create_customer [name="customer[note][phone]"]');
var $termInput = $('form#create_customer .acceptsMarketing input');
// Check for enter keypress on form and click button instead.

// $('form#create_customer').on('keypress', function(e) {

//     if (event.keyCode === 13) {

//         e.preventDefault();

//         $(this).find('[type="submit"]').trigger('click');

//     }

// });

// Handle form submit by validating button click.

$('form#create_customer [type="submit"]').on('click', function(e) {
    e.preventDefault();
    var work = 0, isEmailValid = false, isPasswordValid = false;
    if (validateAlphabets_($fname)) {
        $fname.focus();
        work++;
    } else {
        $fname.focus();
        return;
    }
    if (validateAlphabets($lname)) {
        work++;
    }else {
        $lname.focus();
        return;
    }
    if (validateEmail($email)) {
        isEmailValid = true;
        work++;
    } else {
        isEmailValid = false;
        $email.focus();
        return;
    } 

    if (validatePassword($password, true)) {
        isPasswordValid = true;
        work++;
    } else {
        isPasswordValid = false;
        $password.focus();
        return;
    }

    if (validatePhoneNumber($phoneNum)) {
        work++;
    } else {
        $phoneNum.focus();
        return;
    }
    if($termInput.prop('checked')){
        work++;
        $termInput.parent().removeClass(errorClass);
    } else {
        $termInput.parent().addClass(errorClass);
    }
    
    if (work == 6) {
        $('form#create_customer').trigger('submit');
    } else {
        const input = Array.from($('#create_customer input[required]')).filter(input => {
            let status = input.value.trim() === '' ? true : false;
            if(input.type === 'checkbox'){
                if(!input.checked) status = true;
            } else {
                if(!status){
                    if(input.type === 'email' && !isEmailValid) status = true;
                    if(input.type === 'password' && !isPasswordValid) status = true;
                }
            }

            return status
        })[0];
        if(input) input.focus();
    }
});

$fname.on('input', function() {
    validateAlphabets_($(this));
});
$lname.on('input', function() {
    validateAlphabets($(this));
});
$email.on('input', function() {
    validateEmail($(this));
});
$password.on('input', function() {
    validatePassword($(this), true);
});
$phoneNum.on('input', function() {
    validatePhoneNumber($(this));
});
