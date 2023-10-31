// add address enhanced validation starts here
$(document).ready(function() {
    var $regexnames=/^(?![ -]+$)([a-zA-Z - ' -]{3,})+$/;
    var $regexnamess=/^(?![ -]+$)([a-zA-Z - ' -]{3,})+$/;
    var $regexzip=/^[0-9]+$/;
    var $regexphone=/^(\d|\+|\-|\x){10,15}$/;
  
    $('#address_form_new .global-button').on('click', function(e) {
      let addFirstName = document.getElementById('address_first_name_new');
      if ($(addFirstName).val() <= 0) {
          $('.first_name_required').removeClass('hidden');
          e.preventDefault();
          addFirstName.focus();
      } else if (!$(addFirstName).val().match($regexnames)) {
          $('.add_first_name').removeClass('hidden');
          $('.add_first_name').show();
          e.preventDefault();
          addFirstName.focus();
      } else {
          $('.add_first_name').addClass('hidden');
          $('.first_name_required').addClass('hidden');
      }
  });
    // 2
    $('#address_form_new .global-button').on('click', function(e) {
      let addLastName = document.getElementById('address_last_name_new');
      if ($(addLastName).val() <= 0) {
          $('.last_name_required').removeClass('hidden');
          e.preventDefault();
          addLastName.focus();
      } else if (!$(addLastName).val().match($regexnamess)) {
          $('.add_last_name').removeClass('hidden');
          $('.add_last_name').show();
          e.preventDefault();
          addLastName.focus();
      } else {
          $('.add_last_name').addClass('hidden');
          $('.last_name_required').addClass('hidden');
      }
  });
    // 3
    $('#address_form_new .global-button').on('click', function(e) {
      let addZipName = document.getElementById('address_zip_new');
      if ($(addZipName).val() <= 0) {
          $('.zip_code_required').removeClass('hidden');
          e.preventDefault();
          addZipName.focus();
      } else if (!$(addZipName).val().match($regexzip)) {
          $('.add_zip').removeClass('hidden');
          $('.add_zip').show();
          e.preventDefault();
          addZipName.focus();
      } else {
          $('.add_zip').addClass('hidden');
          $('.zip_code_required').addClass('hidden');
      }
  });
    // 4
    $('#address_form_new .global-button').on('click', function(e) {
      let addPhoneName = document.getElementById('address_phone_new');
      if ($(addPhoneName).val() <= 0) {
          $('.phone_code_required').removeClass('hidden');
          e.preventDefault();
          addPhoneName.focus();
      } else if (!$(addPhoneName).val().match($regexphone)) {
          $('.add_phone').removeClass('hidden');
          $('.add_phone').show();
          e.preventDefault();
          addPhoneName.focus();
      } else {
          $('.add_phone').addClass('hidden');
          $('.phone_code_required').addClass('hidden');
      }
  });
    // 5
    $('#address_form_new .global-button').on('click', function(e) {
      let addAddressName = document.getElementById('address_address1_new');
      if ($(addAddressName).val() <= 0) {
          $('.address_first_required').removeClass('hidden');
          e.preventDefault();
          addAddressName.focus();
      } else {
          $('.address_first_required').addClass('hidden');
      }
  });
    // 6
    $('#address_form_new .global-button').on('click', function(e) {
      let addCityName = document.getElementById('address_city_new');
      if ($(addCityName).val() <= 0) {
          $('.add_city_required').removeClass('hidden');
          e.preventDefault();
          addCityName.focus();
      } else {
          $('.add_city_required').addClass('hidden');
      }
  });
    // add address keypress validation starts here
    let fieldValidaters =  (className,fielname,emptyValidater,regexname)=>{
      $(className).on('keypress keydown keyup',function()
      {
  
        if($(this).val() <= 0){
        $(emptyValidater).removeClass('hidden');
        $(fielname).addClass('hidden');
        }
         else if (!$(this).val().match(regexname)) 
          {
            $(emptyValidater).addClass('hidden');
               $(fielname).removeClass('hidden');
             $(fielname).show();
         }
    
        else
          {
             $(fielname).addClass('hidden');
             $(emptyValidater).addClass('hidden');
         }
      });
    }
    fieldValidaters('#address_first_name_new','.add_first_name','.first_name_required',$regexnames);
    fieldValidaters('#address_zip_new','.add_zip','.zip_code_required',$regexzip);
    fieldValidaters('#address_phone_new','.add_phone','.phone_code_required', $regexphone);
    fieldValidaters('#address_last_name_new','.add_last_name','.last_name_required',$regexnamess);
    // validation for address and city
    let addAddressCityValidater =  (className,emptyValidater)=>{
      $(className).on('keypress keydown keyup',function()
      {
  
        if($(this).val() <= 0){
        $(emptyValidater).removeClass('hidden');
        $(fielname).addClass('hidden');
        }
        else
          {
             $(emptyValidater).addClass('hidden');
         }
      });
    }
    addAddressCityValidater('#address_address1_new','.address_first_required');
    addAddressCityValidater('#address_city_new','.add_city_required');
    // validation for address and city ends here
    // add address keyporess validation ends here
    // 
    $('#address_phone_new').on('keydown',function(e) { 
      if(e.target.value.length < 1) {
        if(e.which===48) {
          e.preventDefault() 
        }
      }
    
    
      if(e.target.value.includes('+')) {
        if(e.which === 61 || e.which === 187 ) {
          e.preventDefault(); 
          return false;
        }
      }
      
      if(e.target.value.includes('x')) {
        if(e.which === 88) {
          e.preventDefault(); 
          return false;
        }
      } 
    
      const elm=e.target.value.split('')
      const checkDash=elm.filter(e=>e=='-')
      
    
      if(checkDash.length === 2) {
        if(e.which === 173 || e.which === 189 ) { 
          e.preventDefault();
          return false;
        }
      }
    });
    // 
  });
  // add address enhanced validation ends here
  
  
  
  
  // edit address enhanced validation starts here
  $(document).ready(function() {
    var $editfirstname=/^(?![ -]+$)([a-zA-Z - ' -]{3,})+$/;
    var $editlastname=/^(?![ -]+$)([a-zA-Z - ' -]{3,})+$/;
    var $editZipcode=/^[0-9]+$/;
    var $editPhone=/^(\d|\+|\-|\x){10,15}$/;

    $('form .edit-address-update-btn').on('click', function(e) {
      let fName = $(this).parents('form').find('.edit_address_first_name');
      if (fName.val() <= 0){
        $(this).parents('form').find('.edit_first_empty').removeClass('hidden');
        e.preventDefault();
        fName.focus();
      }
      else if (!fName.val().match($editfirstname)) {
              $(this).parents('form').find('.edit_first_name').removeClass('hidden');
              $(this).parents('form').find('.edit_first_name').show();
              $(this).parents('form').find('.edit_first_empty').addClass('hidden');
              e.preventDefault();
              fName.focus();
            }
            else {
              $(this).parents('form').find('.edit_first_name').addClass('hidden');
              $(this).parents('form').find('.edit_first_empty').addClass('hidden');
            }   
    });
    $('form .edit-address-update-btn').on('click', function(e) {
      let lName = $(this).parents('form').find('.edit_address_last_name');
      if (lName.val() <= 0){
        $(this).parents('form').find('.edit_last_empty').removeClass('hidden');
        e.preventDefault();
        lName.focus();
      }
      else if (!lName.val().match($editlastname)) {
              $(this).parents('form').find('.edit_last_name').removeClass('hidden');
              $(this).parents('form').find('.edit_last_name').show();
              $(this).parents('form').find('.edit_last_empty').addClass('hidden');
              e.preventDefault();
              lName.focus();
            }
            else {
              
              $(this).parents('form').find('.edit_last_name').addClass('hidden');
              $(this).parents('form').find('.edit_last_empty').addClass('hidden');
              
            }   
    });
    $('form .edit-address-update-btn').on('click', function(e) {
      let editZip = $(this).parents('form').find('.edit_address_zip');
      if (editZip.val() <= 0){
        $(this).parents('form').find('.edit_zip_empty').removeClass('hidden');
        e.preventDefault();
        editZip.focus();
      }
      else if (!editZip.val().match($editZipcode)) {
              $(this).parents('form').find('.edit_zip').removeClass('hidden');
              $(this).parents('form').find('.edit_zip').show();
              $(this).parents('form').find('.edit_zip_empty').addClass('hidden');
              e.preventDefault();
              editZip.focus();
            }
            else {
             
              $(this).parents('form').find('.edit_zip').addClass('hidden');
              $(this).parents('form').find('.edit_zip_empty').addClass('hidden');
            }   
    });
    $('form .edit-address-update-btn').on('click', function(e) {
      let editPhone = $(this).parents('form').find('.edit_address_phone');
      if (editPhone.val() <= 0){
        $(this).parents('form').find('.edit_phone_empty').removeClass('hidden');
        e.preventDefault();
        editPhone.focus();
      }
      else if (!editPhone.val().match($editPhone)) {
              $(this).parents('form').find('.edit_phone').removeClass('hidden');
              $(this).parents('form').find('.edit_phone').show();
              $(this).parents('form').find('.edit_phone_empty').addClass('hidden');
              e.preventDefault();
              editPhone.focus();
            }
            else {
              
              $(this).parents('form').find('.edit_phone').addClass('hidden');
              $(this).parents('form').find('.edit_phone_empty').addClass('hidden');
              
            }  
    });

    $('form .edit-address-update-btn').on('click', function(e) {
      let editAddress = $(this).parents('form').find('.edit_address_first_address');
      if (editAddress.val() <= 0){
        $(this).parents('form').find('.edit_address_empty').removeClass('hidden');
        e.preventDefault();
        editAddress.focus();
      }
            else {
              
              $(this).parents('form').find('.edit_address_empty').addClass('hidden');
              
            }  
    });

    $('form .edit-address-update-btn').on('click', function(e) {
      let editCity = $(this).parents('form').find('.edit_city');
      if (editCity.val() <= 0){
        $(this).parents('form').find('.edit_city_empty ').removeClass('hidden');
        e.preventDefault();
        editCity.focus();
      }
            else {
              
              $(this).parents('form').find('.edit_city_empty').addClass('hidden');
              
            }  
    });

      // keypress event starts here
      let fieldValidater =  (className,fielname,emptyValidater,regexname)=>{
        $(className).on('keypress keydown keyup',function()
        {

          if($(this).val() <= 0){
          $(emptyValidater).removeClass('hidden');
          $(fielname).addClass('hidden');
          }
           else if (!$(this).val().match(regexname)) 
            {
              $(emptyValidater).addClass('hidden');
                 $(fielname).removeClass('hidden');
               $(fielname).show();
           }
      
          else
            {
               $(fielname).addClass('hidden');
               $(emptyValidater).addClass('hidden');
           }
        });
      }
      fieldValidater('.edit_address_first_name','.edit_first_name','.edit_first_empty',$editfirstname);
      fieldValidater('.edit_address_zip','.edit_zip','.edit_zip_empty',$editZipcode);
      fieldValidater('.edit_address_phone','.edit_phone','.edit_phone_empty', $editPhone);
      fieldValidater('.edit_address_last_name','.edit_last_name','.edit_last_empty',$editlastname);
      // validation for address and city
      let editAddressCityValidater =  (className,emptyValidater)=>{
        $(className).on('keypress keydown keyup',function()
        {

          if($(this).val() <= 0){
          $(emptyValidater).removeClass('hidden');
          $(fielname).addClass('hidden');
          }
          else
            {
               $(emptyValidater).addClass('hidden');
           }
        });
      }
      editAddressCityValidater('.edit_address_first_address','.edit_address_empty');
      editAddressCityValidater('.edit_city','.edit_city_empty');
        // validation for address and city ends here
        // keypress event ends here
// 
$('.edit_address_phone').on('keydown',function(e) { 
  if(e.target.value.length < 1) {
    if(e.which===48) {
      e.preventDefault() 
    }
  }


  if(e.target.value.includes('+')) {
    if(e.which === 61 || e.which === 187 ) {
      e.preventDefault(); 
      return false;
    }
  }
  
  if(e.target.value.includes('x')) {
    if(e.which === 88) {
      e.preventDefault(); 
      return false;
    }
  } 

  const elm=e.target.value.split('')
  const checkDash=elm.filter(e=>e=='-')
  

  if(checkDash.length === 2) {
    if(e.which === 173 || e.which === 189 ) { 
      e.preventDefault();
      return false;
    }
  }
});
// 
          
      });
  // edit address enhanced validation ends here