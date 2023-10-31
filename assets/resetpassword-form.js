var password;
var errorClass = 'field--error-plus-dynamic';
var errorMessageSelector = '.field__message--error-plus-dynamic';

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

var $password = $('.reset_customer_password form [name="customer[password]"]');
var $password_confirmation = $('.reset_customer_password form [name="customer[password_confirmation]"]');
// Check for enter keypress on form and click button instead.


// Handle form submit by validating button click.

$('.reset_customer_password form [type="submit"]').on('click', function(e) {
    e.preventDefault();
    var work = 0, isPasswordValid = false;
    

    if (validatePassword($password, true)) {
        isPasswordValid = true;
        work++;
    } else {
        isPasswordValid = false;
        $password.focus();
        return;
    }
    if (validatePassword($password_confirmation, true)) {
        isPasswordValid = true;
        work++;
    } else {
        isPasswordValid = false;
        $password_confirmation.focus();
        return;
    }
    
    if (work == 2) {
        $('.reset_customer_password form').trigger('submit');
    } else {
        return false;
    }
});


$password.on('input', function() {
    validatePassword($(this), true);
});

$password_confirmation.on('input', function() {
    $password_confirmation.parent('div').find(".error").remove();
    if($password.val().trim() != $password_confirmation.val().trim()) {
        $password_confirmation.parent('div').remove(".error");
        $password_confirmation.parent('div').append("<p role='alert' class='field__message field__message--error-plus-dynamic error'>Confirm Password not match with Password</p>");
        return false;
    } else {
        $password_confirmation.parent('div').find(".error").remove();
        return true;
    }
});