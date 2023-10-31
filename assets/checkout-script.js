(function($) {
    $(document).on('page:load page:change', function() {
        var $phoneField;
        var $fname;
        var $lname;
        var $city;
        var errorClass = 'field--error-plus-dynamic';
        var errorMessageSelector = '.field__message--error-plus-dynamic';

        var validatePhoneNumber = function(phoneField) {
            var minChars = 10;
            var maxChars = 20;
            var errorMessage = "Please enter valid phone number";
            var numbers = phoneField.val().match(/(\d)/g) || [];
            var numbersLength = numbers.length;
            var allowedChars = phoneField.val().match(/(\d|\+)/g) || [];
            var phoneFieldVal = phoneField.val;
            phoneField.val(allowedChars.join(''));

            if (numbersLength !== 0 && numbersLength < minChars || numbersLength > maxChars) {
                if (!phoneField.hasClass(errorClass)) {
                    phoneField.addClass(errorClass);
                    phoneField.closest('.field__input-wrapper').after("<p class='field__message field__message--error-plus-dynamic'>" + errorMessage + "</p>");
                }
                return false;
            } else {
                phoneField.removeClass(errorClass);
                phoneField.closest('.field__input-wrapper').nextAll(errorMessageSelector).remove();
                return true;
            }
        }
        var validatePincode = function(pin) {
            console.log(pin.val());
            var minChars = 4;
            var maxChars = 7;
            var errorMessage = "Please enter valid Pin Code";
            var numbers = pin.val().match(/(\d)/g) || [];
            var numbersLength = numbers.length;
            var allowedChars = pin.val().match(/(\d|\+)/g) || [];
            pin.val(allowedChars.join(''));

            if (numbersLength !== 0 && numbersLength < minChars || numbersLength > maxChars) {
                if (!pin.hasClass(errorClass)) {
                    pin.addClass(errorClass);
                    pin.closest('.field__input-wrapper').after("<p class='field__message field__message--error-plus-dynamic'>" + errorMessage + "</p>");
                }
                return false;
            } else {
                pin.removeClass(errorClass);
                pin.closest('.field__input-wrapper').nextAll(errorMessageSelector).remove();
                return true;
            }
        }
        var validateAlphabets = function(nameField) {
            var errorMessage = "Please enter valid value";


            var data = nameField.val();
            var letters = '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$';
            if (!nameField.val().match(letters)) {
                if (!nameField.hasClass(errorClass)) {
                    nameField.addClass(errorClass);
                    nameField.closest('.field__input-wrapper').after("<p class='field__message field__message--error-plus-dynamic'>" + errorMessage + "</p>");
                }
                return false;
            } else {
                nameField.removeClass(errorClass);
                nameField.closest('.field__input-wrapper').nextAll(errorMessageSelector).remove();
                return true;
            }
        }
        
        if (Shopify.Checkout.step === 'contact_information') {
            var $phoneField = $('[name="checkout[shipping_address][phone]"]:not([aria-hidden="true"])');
            var $pincode = $('[name="checkout[shipping_address][zip]"]:not([aria-hidden="true"])');
            var $fname = $('[name="checkout[shipping_address][first_name]"]:not([aria-hidden="true"])');
            var $lname = $('[name="checkout[shipping_address][last_name]"]:not([aria-hidden="true"])');
            var $city = $('[name="checkout[shipping_address][city]"]:not([aria-hidden="true"])');
            // Check for enter keypress on form and click button instead.
            $('[data-step] form').on('keypress', function(e) {
                if (event.keyCode === 13) {
                    e.preventDefault();
                    $(this).find('[type="submit"]').trigger('click');
                }
            });
            
            // Handle form submit by validating button click.
            $('[data-step] form [type="submit"]').on('click', function(e) {
                e.preventDefault();
                if (validatePhoneNumber($phoneField) && validateAlphabets($fname) && validateAlphabets($lname) && validateAlphabets($city) && validatePincode($pincode)) {
                    $('[data-step] form').trigger('submit');
                }
            });
            
            $fname.on('input', function() {
                validateAlphabets($(this));
            });
            $lname.on('input', function() {
                validateAlphabets($(this));
            });
            $city.on('input', function() {
                validateAlphabets($(this));
            });
            $pincode.on('input', function() {
                validatePincode($(this));
            });
            $phoneField.on('input', function() {
                validatePhoneNumber($(this));
            });
        }
    });
})(Checkout.$);