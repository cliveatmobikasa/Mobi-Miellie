"use strict";
window._theme = window._theme || {};

_theme.initSlickSlider = function(selector, settings, initCallBack, afterChangeCallBack, beforeChangeCallback){
  if(!selector || !settings) return;
  let $productGrid = selector;
  if(typeof selector === 'string'){
    $productGrid = $(selector);
  }
  if(typeof selector === "object" && !$productGrid.hasOwnProperty('length')){
    $productGrid = $(selector);
  }

  if($productGrid.length === 0) return;

  if($productGrid.hasClass('slick-initialized')){
    $productGrid.slick('unslick');
  }

  $productGrid.on('beforeChange', function(event, slick, currentSlide, nextSlide){
    slickCB(slick);
    setTimeout(function(){
      slickCB(slick);
    }, 1000);
    if(beforeChangeCallback && typeof beforeChangeCallback === 'function') beforeChangeCallback(slick);
  });

  $productGrid.on('afterChange', function(event, slick, currentSlide, nextSlide){
    slickCB(slick);
    setTimeout(function(){
      slickCB(slick);
    }, 1000);

    if(afterChangeCallBack && typeof afterChangeCallBack === 'function') afterChangeCallBack(slick);
  });

  $productGrid.on('init', function(event, slick, currentSlide, nextSlide){
    slickCB(slick);
    setTimeout(function(){
      slickCB(slick);
    }, 1000);

    var slickReviewInterval = setInterval(function () {
      if($('.yotpo-bottomline.pull-left.star-clickable').is(':visible')){
        slick.$slider.find('.slick-slide:not(.slick-active)').find('.yotpo-bottomline.pull-left.star-clickable').removeAttr("tabindex aria-hidden");
        slick.$slider.find('.slick-slide:not(.slick-active)').find('.yotpo-bottomline .sr-only').removeAttr("tabindex");
        slick.$slider.find('.slick-slide:not(.slick-active)').find('.yotpo-bottomline.yotpo-small').removeAttr("tabindex aria-hidden");
        clearInterval(slickReviewInterval);
      }; 
      if($('.yotpo-bottomline').length) {   
        slick.$slider.find('.yotpo.bottomLine').find('.sr-only').each(function() { 
          let review=$(this).text()+' out of 5';
          if(!$(this).closest('.product-details').find('[data-show-star]').length) {
            $(this).closest('.product-details').prepend('<p class="visually-hidden" data-show-star>'+ review +'</p>');     
          }
        });
      }
    }, 1000);
    setTimeout(function() {
      clearInterval(slickReviewInterval);
    },10000)

    if(initCallBack && typeof initCallBack === 'function') initCallBack(slick);
  });

  $productGrid.slick(settings);

  function slickCB(slick){
    const tabbableElems = ['select', 'input', 'textarea', 'button', 'a', 'iframe'];
    slick.$slider.find('.slick-slide').removeAttr('tabindex aria-hidden');
    slick.$slider.find('.slick-slide:not(.slick-active)').attr({
      "tabindex": -1,
      "aria-hidden": true
    });
    
    tabbableElems.forEach(function(item){
      slick.$slider.find('.slick-slide:not(.slick-active)').find(item).attr({
        "tabindex": -1,
        "aria-hidden": true
      });
      
      slick.$slider.find('.slick-slide.slick-active').find(item).each(function(index, item){
        if(!$(this).hasClass('text-m')) $(this).removeAttr('tabindex aria-hidden');
      });
    });
    
    slick.$slider.find( ".yotpo-bottomline .yotpo-stars" ).each(function( index ) {
      if($(this).attr("role") != "img") {
        $(this).attr("role","img");
        $(this).parent('.yotpo-bottomline').find('.text-m').attr('tabindex','-1');
        $(this).attr("aria-label",$(this).parent('.yotpo-bottomline').find('.yotpo-stars .sr-only').text()+' based on '+$(this).parent('.yotpo-bottomline').find('.text-m').text());
        $(this).parent('.yotpo-bottomline').removeAttr('tabindex');
      }
    });

    slick.$slider.find('.slick-slide:not(.slick-current)').find('.yotpo-bottomline').attr('tabindex', -1);
    slick.$slider.find('.slick-slide').find('.yotpo-icon.yotpo-icon-star').attr({'tabindex':'-1','aria-hidden':'true'}); 
    slick.$slider.find('button.slick-arrow').attr('tabindex', 0);
    slick.$slider.find('button.slick-arrow[aria-disabled="true"]').attr('tabindex', -1);
    slick.$slider.find('.slick-slide').find('.yotpo-bottomline').attr({'tabindex':'-1'});
    slick.$slider.find('.slick-slide').find('.yotpo-bottomline .text-m').attr({'tabindex':'-1'});
    slick.$slider.find('.slick-slide.slick-active').find('.yotpo-bottomline').attr({'tabindex':'0'});
    $('.yotpo-bottomline .text-m').attr('tabindex','-1');
    $('.slick-slide .flickity-slider .gallery-cell').find('img').removeAttr("tabindex");
  }
}


_theme.isMobile = window.innerWidth < 768 ? true : false;


class TabsAutomatic {
  constructor(groupNode) {
    this.tablistNode = groupNode;

    this.tabs = [];

    this.firstTab = null;
    this.lastTab = null;

    this.tabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]'));
    this.tabpanels = [];

    for (var i = 0; i < this.tabs.length; i += 1) {
      var tab = this.tabs[i];
      var tabpanel = document.getElementById(tab.getAttribute('aria-controls'));

      tab.tabIndex = -1; 
      tab.setAttribute('aria-selected', 'false');
      this.tabpanels.push(tabpanel);

      tab.addEventListener('keydown', this.onKeydown.bind(this));
      tab.addEventListener('click', this.onClick.bind(this));

      if (!this.firstTab) {
        this.firstTab = tab;
      }
      this.lastTab = tab;
    }

    this.setSelectedTab(this.firstTab, false);
  }

  setSelectedTab(currentTab, setFocus) {
    if (typeof setFocus !== 'boolean') {
      setFocus = true;
    }
    for (var i = 0; i < this.tabs.length; i += 1) {
      var tab = this.tabs[i];
      if (currentTab === tab) {
        tab.setAttribute('aria-selected', 'true');
        tab.removeAttribute('tabindex');
        this.tabpanels[i].classList.remove('is-hidden');
        var currentTabId = tab.getAttribute('aria-controls');
        if($('#'+currentTabId+' .tab-slider').length > 0) {
          $('#'+currentTabId+' .tab-slider > .one-whole > .product-list').slick('refresh');
        }
        if (setFocus) {
          tab.focus();
        }
      } else {
        tab.setAttribute('aria-selected', 'false');
        tab.tabIndex = -1;
        this.tabpanels[i].classList.add('is-hidden');
      }
    }
  }

  setSelectedToPreviousTab(currentTab) {
    var index;

    if (currentTab === this.firstTab) {
      this.setSelectedTab(this.lastTab);
    } else {
      index = this.tabs.indexOf(currentTab);
      this.setSelectedTab(this.tabs[index - 1]);
    }
  }

  setSelectedToNextTab(currentTab) {
    var index;

    if (currentTab === this.lastTab) {
      this.setSelectedTab(this.firstTab);
    } else {
      index = this.tabs.indexOf(currentTab);
      this.setSelectedTab(this.tabs[index + 1]);
    }
  }

  /* EVENT HANDLERS */

  onKeydown(event) {
    var tgt = event.currentTarget,
      flag = false;

    switch (event.key) {
      case 'ArrowLeft':
        this.setSelectedToPreviousTab(tgt);
        flag = true;
        break;

      case 'ArrowRight':
        this.setSelectedToNextTab(tgt);
        flag = true;
        break;

      case 'Home':
        this.setSelectedTab(this.firstTab);
        flag = true;
        break;

      case 'End':
        this.setSelectedTab(this.lastTab);
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onClick(event) {
    this.setSelectedTab(event.currentTarget);
  }
}

_theme.ProductPage = function(){
  var PDPTabLists = document.querySelectorAll('[role=tablist].automatic');
  for (var i = 0; i < PDPTabLists.length; i++) {
    new TabsAutomatic(PDPTabLists[i]);
  }
}

_theme.Account = function(){
  $('[data-view-pswd]').click(function(e){
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault(); 
    console.log("show evebt:",e)
    const $pswdInput = $(this).parent().find('input');
    const type = $pswdInput.attr('type');
    if(type === 'password') {
      $pswdInput.attr('type', 'text');
      $(this).attr('aria-label','Hide Password');
      $(this).addClass('password-visible');
    } else {
      $pswdInput.attr('type', 'password');
      $(this).attr('aria-label','Show Password');
      $(this).removeClass('password-visible');
    }
  });
}

_theme.sealSubscriptionlogin = function(){
  if(location.pathname.indexOf('/a/subscriptions/login') === -1) return;
  const heading = document.querySelector('[data-seal-form] > h2');
  const emailInput = document.querySelector('[data-seal-form] input[name="customer_email"]');
  const sendLinkBtn = document.querySelector('[data-seal-form] .seal-button');
  const errorNode = document.querySelector('[data-seal-form] [data-seal-customer-portal-error]');
  const successNode = document.querySelector('[data-seal-form] [data-seal-customer-portal-success]');
  if(heading) heading.setAttribute('aria-level','1');
  if(emailInput){
    emailInput.type = 'email';
    emailInput.id = 'customer_email';
  }
  if(sendLinkBtn){
    sendLinkBtn.setAttribute('tabindex', 0);
    sendLinkBtn.setAttribute('role', 'button');
    sendLinkBtn.setAttribute('aria-label', 'send link to my email addres');
  }
  if(errorNode) errorNode.setAttribute('role', 'alert');
  if(successNode) successNode.setAttribute('role', 'alert');
}

jQuery(document).ready(function($){
  const ww = $(window).width();
  if(ww < 801){
    _theme.initSlickSlider($('.featured-promotions-hair-type-module .featured-promotions'),{
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      infinite: false,
      responsive: [
        {
          breakpoint: 791,
          settings: {
            slidesToShow: 2.5
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2.5
          }
        }
      ]
  }) 
    _theme.initSlickSlider($('.shop-by-collection-wr .list-collections'),{
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      infinite: false,
      responsive: [
        {
          breakpoint: 791,
          settings: {
            slidesToShow: 2.5,
            arrows: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2.5,
            arrows: true
          }
        }
      ]
    })
    _theme.initSlickSlider($('.shop-by-type-wr .featured-promotions'),{
      slidesToShow: 2,
      slidesToScroll: 1,
      arrows: true,
      infinite: false,
        responsive: [
          {
            breakpoint: 798,
            settings: {
              slidesToShow: 2.5
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2.5
            }
          }
        ]
  })
  }

  _theme.initSlickSlider($('.tab-slider > .one-whole > .product-list'),{
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: window.innerWidth < 991 ? false : false,
    rows:0,
    responsive: [
        {
          breakpoint: 798,
          settings: {
            slidesToShow: 2.5,
            arrows: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2.5,
            arrows: true,
          }
        }
      ]
  });

  const complementaryProductInterval = setInterval(function(){
    if($('.complementary-products__slider').length > 0) {
      clearInterval(complementaryProductInterval);
      _theme.initSlickSlider($('.complementary-products__slider'),{
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: window.innerWidth < 991 ? false : true,
        rows:0,
        responsive: [
            {
              breakpoint: 798,
              settings: {
                slidesToShow: 2.5,
                arrows: true,
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2.5,
                arrows: true,
              }
            }
          ]
      },function() {

        function updateMoney(priceEl) {
          if(!priceEl) return
          if(priceEl.closest('.complementary-product__price-wrapper').children.length>1)  {
            let price=priceEl.innerText
            let srText = priceEl.classList.contains('complementary-product__price-compare') ? 'Regular Price' : 'Sale Price';
            if(priceEl.classList.contains('complementary-product__price-compare')) srText = 'Regular Price';
            if(priceEl.closest('.complementary-product__price-compare')) srText = 'Regular Price';   
            priceEl.innerHTML = '<span class="visually-hidden">'+srText+' </span>'+ price ; 
          }
        } 
        const priceEls=document.querySelectorAll('.complementary-products span.money > span.money');
        if(priceEls.length) {
          for(let i=0; i< priceEls.length; i++) {
              updateMoney(priceEls[i]);    
          }
        }
      })
    }
  }, 1000);

  setTimeout(function(){
    if(complementaryProductInterval) clearInterval(complementaryProductInterval);
  }, 7000);



  const complementaryProductIntervalPdp = setInterval(function(){
    if($('.complementary-products__slider_pdp').length > 0) {
      if($('.complementary-products__slider_pdp .complementary-single-product').length > 3 ){
        clearInterval(complementaryProductIntervalPdp);
        _theme.initSlickSlider($('.complementary-products__slider_pdp'),{
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: window.innerWidth < 991 ? false : true,
          rows:0,
          responsive: [
              {
                breakpoint: 798,
                settings: {
                  slidesToShow: 2.5,
                  arrows: true,
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2.5,
                  arrows: true,
                }
              }
            ]
        },function() {
  
          function updateMoney(priceEl) {
            if(!priceEl) return
            if(priceEl.closest('.complementary-product__price-wrapper').children.length>1)  {
              let price=priceEl.innerText
              let srText = priceEl.classList.contains('complementary-product__price-compare') ? 'Regular Price' : 'Sale Price';
              if(priceEl.classList.contains('complementary-product__price-compare')) srText = 'Regular Price';
              if(priceEl.closest('.complementary-product__price-compare')) srText = 'Regular Price';   
              priceEl.innerHTML = '<span class="visually-hidden">'+srText+' </span>'+ price ; 
            }
          } 
          const priceEls=document.querySelectorAll('.complementary-products span.money > span.money');
          if(priceEls.length) {
            for(let i=0; i< priceEls.length; i++) {
                updateMoney(priceEls[i]);    
            }
          }
        })
      }
     
    }
  }, 1000);

  setTimeout(function(){
    if(complementaryProductIntervalPdp) clearInterval(complementaryProductIntervalPdp);
  }, 7000);



  _theme.initSlickSlider($('.js-product-slider .product-list'),{
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: window.innerWidth < 991 ? false : false,
    rows:0,
    responsive: [
        {
          breakpoint: 798,
          settings: {
            slidesToShow: 2.5,
            arrows: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2.5,
            arrows: true,
          }
        }
      ]
  });

  _theme.initSlickSlider($('.custom-testimonial-slider'),{
    centerMode: true,
    autoplay: true,
    centerPadding: '0px',
    slidesToShow: 2.99,
    arrows: true,
    dots: true,
    prevArrow:'<button type="button" class="slick-prev"><svg class="slick-button-icon" viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" class="arrow"></path></svg></button>',
    nextArrow:'<button type="button" class="slick-next"><svg class="slick-button-icon" viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg></button>',
    responsive: [
        {
          breakpoint: 798,
          settings: {
            slidesToShow: 1,
            centerPadding: '120px',
          }
        },
        {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              centerPadding: '80px',
              pauseOnHover:false,
              autoplaySpeed: 1500
            }
          },
          {
            breakpoint: 350,
            settings: {
              slidesToShow: 1,
              centerPadding: '30px',
              pauseOnHover:false,
              autoplaySpeed: 1500
            }
          },
      ]
  }, function(slick){
      const $parent = slick.$slider.parent();
      const $sliderInstance = $('.custom-testimonial-slider');
      _theme.initSliderPlayPause($parent, $sliderInstance, true,'Customer feedback slider');

      setTimeout(function() {
        let text=$('.custom-testimonial-slider').find('.slick-dots').find('li.slick-active').find('button').attr('aria-label');
        $('.custom-testimonial-slider').append('<span class="slide-count-slick">'+text+'</span>');
      },100)
      
    },function() {
      let text=$('.custom-testimonial-slider').find('.slick-dots').find('li.slick-active').find('button').attr('aria-label');
      $('.slide-count-slick').text(text);
    });


  _theme.initSlickSlider($('.blogs-wrapper'),{
    slidesToShow: 3,
    arrows: false,
    dots: false,
    responsive: [
        {
          breakpoint: 798,
          settings: {
            slidesToShow: 2,
            arrows: true,
            dots: true,
          }
        },
        {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              arrows: true,
              dots: true,
            }
        }
    ]
  }, function(slick){ 
    slick.$slider.find('.slick-dots li button').removeAttr('role');
    slick.$slider.find('.slick-dots button').each(function(i,elm){
      $(elm).attr('aria-label','blog '+ Number(i+1));
      if($(elm).parent().hasClass('slick-active')) { 
        $(elm).attr('aria-label','blog '+ Number(i+1)+' current item');  
      }
    });
    setTimeout(function(){
      slick.$slider.find('.slick-dots').removeAttr('role').find('li button').removeAttr('role');
      slick.$slider.find('.slick-dots button').removeAttr('tabindex')
      slick.$slider.find('.slick-dots button').each(function(i,elm){
        $(elm).attr('aria-label','blog '+ Number(i+1));
        if($(elm).parent().hasClass('slick-active')) { 
          $(elm).attr('aria-label','blog '+ Number(i+1)+' current item');  
        }
      });
      slick.$slider.find('.slick-dots button').removeAttr('tabindex');
    }, 500);
  }, function(slick){
    slick.$slider.find('.slick-dots').removeAttr('role').find('li button').removeAttr('role');
    slick.$slider.find('.slick-dots button').each(function(i,elm){
      $(elm).attr('aria-label','blog '+ Number(i+1));
      if($(elm).parent().hasClass('slick-active')) { 
        $(elm).attr('aria-label','blog '+ Number(i+1)+' current item');  
      }
    });
    slick.$slider.find('.slick-dots button').removeAttr('tabindex');
    setTimeout(function(){
      slick.$slider.find('.slick-dots').removeAttr('role').find('li button').removeAttr('role');
      slick.$slider.find('.slick-dots button').each(function(i,elm){
        $(elm).attr('aria-label','blog '+ Number(i+1));
        if($(elm).parent().hasClass('slick-active')) { 
          $(elm).attr('aria-label','blog '+ Number(i+1)+' current item');  
        }
      });
      slick.$slider.find('.slick-dots button').removeAttr('tabindex');
    }, 500);
  })

  if($('body').hasClass('index')) {
    var $collectionInputTabs = document.querySelectorAll('.tab-title-wrapper.automatic');
    for (var i = 0; i < $collectionInputTabs.length; i++) {
      new TabsAutomatic($collectionInputTabs[i]);
    }
    /*const $collectionInputTabs = $('body.index .tab-title-wrapper input[type="radio"]');
    $collectionInputTabs.on('change', function(evt) {
        const target = $(this).val();
        if(!target) return;
        $(".tab-title").removeClass("active");
        $(".tab-slider-sec").hide();
        $("#lable-"+target).addClass("active");
        $(".tab-products__panel-"+target).fadeIn();
        $(".tab-products__panel-"+target+' .tab-slider > .one-whole > .product-list').slick('refresh');
    });*/
  }

  var $globalTabs = document.querySelectorAll('.tabs-global-title-wrapper.automatic');
    for (var i = 0; i < $globalTabs.length; i++) {
      new TabsAutomatic($globalTabs[i]); 
    }

    var $SearchPageTab = document.querySelectorAll('.search-page-title-wrapper.automatic');
      for (var i = 0; i < $SearchPageTab.length; i++) {
        new TabsAutomatic($SearchPageTab[i]); 
      }
    
    if(window.innerWidth < 798) {
      var $headerSearchTab = document.querySelectorAll('.search-tab-title-wrapper.automatic');
      for (var i = 0; i < $headerSearchTab.length; i++) {
        new TabsAutomatic($headerSearchTab[i]); 
      }
    }

  // if($('.tabs-global').length > 0) {
  //   const $collectionInputTabs = $('.tabs-global-title-wrapper input[type="radio"]');
  //   $collectionInputTabs.on('change', function(evt) {
  //       const target = $(this).val();
  //       if(!target) return;
  //       $(".tabs-global-title").removeClass("active");
  //       $(".tabs-global__panel").hide();
  //       $("#lable-"+target).addClass("active");
  //       $(".tabs-global__panel-"+target).fadeIn();
  //   });
  // }

  $(document).on('keyup', '.tab-title', function(e) {
    if(e.which === 13) {
      $(this).trigger('click')
    }
  })

  $(document).on('click', '.product-list .column.thumbnail .product-wrap .product_gallery .gallery-cell', function(evt){
    evt.preventDefault();
    const url = $(this).closest('.column.thumbnail').data('url');
    if(url) window.location.href = url;
  });

  $(document).on("click", ".srch-icon-btn", function(){
      this.isMobile = window.innerWidth < 1080 ? true : false;
      if(this.isMobile){
        var final_top_pos = $('header.mobile_nav-fixed--true').height();
        if(window.innerWidth < 799) {
          $('.header-search-left').addClass('is-hidden');
        } else {
          $('.header-search-left').removeClass('is-hidden');
        }
      } else {
        if($('.main-nav__wrapper').hasClass('sticky_nav--stick')) {
          var final_top_pos = $('.main-nav__wrapper').height();
        } else {
          var final_top_pos = $("#site-header").height();
        }
        $('.header-search-left').removeClass('is-hidden');
      }
      $('.header-seach-wrap').css('top',final_top_pos+'px');
      $('body').toggleClass('search-active overflow-hidden');

      // console.log($(this).attr('aria-expanded'));
      if($(this).attr('aria-expanded') == 'false') {
        $(this).attr('aria-expanded','true');
        $('.header-search__input').focus();
      } else {
        $(this).attr('aria-expanded','false');
      }
  });

  $(document).on('keyup', '.search-container' ,function(e) {
    if(e.which === 27 ) {
      $(".search-ic-header .search-container").stop().slideUp();
      $('.search-ic-header .srch-icon-btn').attr('aria-expanded','false')
      $('.srch-icon-btn').focus(); 
    }
  }) 

  $(document).on('click', '.product-list .column.thumbnail .product-wrap .product_gallery .gallery-cell', function(evt){
    evt.preventDefault();
    const url = $(this).closest('.column.thumbnail').data('url');
    if(url) window.location.href = url;
  });
  // $(document).on('focusout', '.search-container input' ,function(e) {
  //   setTimeout(function() {
  //     $(".search-ic-header .search-container").stop().slideUp();
  //     $('.search-ic-header .srch-icon-btn').attr('aria-expanded','false')
  //   },400)
  // })  
});

window.addEventListener('DOMContentLoaded', () => {
  if($('body.product').length) _theme.ProductPage();
  _theme.Account();
  _theme.sealSubscriptionlogin();
});



// $('body').on('click','.minicart-close',function(){
//   $(".tos_warning.cart_content.animated.fadeIn.mini-cart").css("display", "none");
//   $("body").removeClass('mini-cart-open');
//   $(".wrapper-overlay").removeClass('active');
// })

// $('body').on('click','.mini_cart',function(){
//   $(".tos_warning.cart_content.animated.fadeIn.mini-cart").css("display", "block");
//   $("body").addClass('mini-cart-open');
//   $(".wrapper-overlay").addClass('active');
// })

// $(".minicart-close").click(function(){
//   $(".tos_warning.cart_content.animated.fadeIn.mini-cart").css("display", "none");
// });


$('body').on('click','.note-label-icon',function(){
  $(this).toggleClass('icon_active');
  $('textarea').toggle();
})


$('body').on('click','.seal-subscription-page',function(){
  $(".seal-floating-label label").css("top", "8%");
});

//
$("#tabpanel-product-description .rte h4").attr("aria-level","2");
$('#phone_inp').on('keydown',function(e) { 
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
if (window.matchMedia('(max-width: 767px)').matches) {
  $(document).ready(function(){     
    $(document).on('click','.mobile-footer-menu-btn',function(){
        
        var currentContent = $(this).siblings('.toggle_content');
        if($(this).hasClass('active')) {
          $(this).removeClass('active');
          $('.toggle_content').slideUp();
          $(this).attr('aria-expanded', 'false');
        } else {
          $('.mobile-footer-menu-btn').removeClass('active').attr('aria-expanded', 'false');
          $(this).addClass('active');
          $('.toggle_content').not(currentContent).slideUp();
          $(this).next().slideToggle( 'slow', function() {});
          $(this).attr('aria-expanded', 'true');
        }
    });
  });
}
var GiftCardSelector = setInterval(function () {
  if($('.single-option-selector').length > 0){
  $(".single-option-selector").attr("aria-label","Amount");
  clearInterval(GiftCardSelector);
  };
  }, 1000);
  setTimeout(function() {
  clearInterval(GiftCardSelector);
  },10000);

$(document).ready(function(){
  var SortByText = setInterval(function () {
  $('#select2-sort-by-container').prepend('<span class="visually-hidden">Sort BY</span>')
  clearInterval(SortByText);
}, 1000);
  setTimeout(function() {
  clearInterval(SortByText);
  },10000);
})

$(document).ready(function() {
    $("a.testi-item-img").removeAttr("tabindex");       
});
if (window.matchMedia('(max-width: 767px)').matches) {
  $(document).ready(function () {
$('.account-sidebar .address .account-order').click(function() {
  $('.account-sidebar .address p.active').removeClass('active');
  $(this).toggleClass('active');
  $('body').find('.account-left').hide();
  $('body').find('.my-order').show();
  $('body').find('.account-title').hide();
});
$('.action_add').click(function() {
  $('.wrapper-overlay').addClass('active');
});
});
}

if (window.matchMedia('(min-width: 767px)').matches) {
$(document).ready(function () {
$('.action_add').click(function() {
  $('.wrapper-overlay').addClass('active');
});
$('.edit-address-action').click(function() {
  $('.wrapper-overlay').addClass('active');
});
});
}


$(document).ready(function () {
  $('.add-address-close-btn').click(function() {
    $('.wrapper-overlay').removeClass('active');
    $('.add_address').hide();
  });

  $('.my-order .address-back-btn a').click(function() {
    $('.my-order').hide();
    $('body').find('.account-left').show();
    $('body').find('.account-title').show();
  });

  $('.add-address-btn-cancle-btn a').click(function() {
    $('.wrapper-overlay').removeClass('active');
  });
  $('.address-back-btn a').click(function() {
    $('.wrapper-overlay').removeClass('active');
  });

  $('.action_link .global-button').on('click',function() {
    _theme.focusTrap($('#add_address'),function(){
      $('#address_first_name_new').focus();
    });   
  })
  $('.address_actions .global-button').on('click',function() {
    _theme.focusTrap($('.customer_address.edit_address'),function(){
      $('.address_form').focus();
    });   
  })

  setTimeout(function() {
  $('.seal-button').attr('role', 'button');
  $('.seal-button').attr('tabindex', '0');
}, 2000);

setTimeout(function() {
  if($('#customer_email').length && $('#customer_email').val().length <= 0){
    $(".seal-subscription-page .seal-floating-label label[data-seal-t='customrportalloginform_email_label']").css("top", "25%" );
  }
}, 1000);

});

$(document).keydown(function(event) { 
  if (event.keyCode == 27) { 
    $('.custome_esc_close').hide();
    $('.wrapper-overlay').removeClass('active');
  }
});

$(document).ready(function () {
  setTimeout(function() {
    $('.sticky_nav').attr("role","complementary");
    $('.sticky_nav').attr("aria-label","Sticky header");
    $('.sticky_nav .nav-desktop').attr("aria-label","Sticky navbar");
}, 1000);
// pdp click on star trigger to its description code starts here
$('body').on('click', '.product-main .bv_stars_component_container', function() {
  $('#product-tab-reviews').trigger('click');
});
// pdp click on star trigger to its description code ends here

var mobFilterHeight = $('.sort_filter_mobile').height();
$('.footer_credits').css('padding-bottom', mobFilterHeight+'px');

// blog third party url remove code starts here
$('.article_content .rte a[href="http://luvtobnatural.com/"]').css({'color' : 'black','pointer-events' : 'none'});
$('.article_content .rte a[href="https://tiffofalltrades.com/"] span').css({'color' : 'black','pointer-events' : 'none'});
$('.article_content .rte a[href="http://naturally-glam.com/"]').css({'color' : 'black','pointer-events' : 'none'});
// pdp tab changes starts here
$(".product-accordion-item button").click(function () {
  $(this).toggleClass("active").next(".rte").slideToggle().parent().siblings().find(".rte").slideUp().prev().removeClass("active");
});
// pdp tab changes ends here
  $('.onetrust-privacy').click(function (e) {
  e.preventDefault();
});

var pdpImageHeight = $('.product .product_gallery .lightbox .image__container').height();
var pdpImageHeight = $('.complementary-products').height();
$('.product .product_gallery .lightbox .image__container').css('min-height', pdpImageHeight+'px');
$('.complementary-products').css('min-height', pdpImageHeight+'px');
});