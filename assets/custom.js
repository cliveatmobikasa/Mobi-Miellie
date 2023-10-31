/* show hide filters on collections page on mobile */
$(".sidebar-wrap-toggle").click(function(){
  $(".sidebar-wrap").toggle ();
  if ($(".sidebar-wrap-toggle").text() == "Show Filters" ) {
    $(".sidebar-wrap-toggle").text("Hide Filters");
    $(".sidebar-wrap-toggle").addClass("active");
    
  } else {
    $(".sidebar-wrap-toggle").text("Show Filters");
    $(".sidebar-wrap-toggle").removeClass("active");
  }
});

$(document).ready(function() {

  $('.remove-icon').each(function() {
    if($(this).parent().find('[data-text]').length === 0)
      $(this).before($('<span data-text style="color: transparent;">').text("Remove"));
  });
  
  if (window.location.href.indexOf("mielle-mystery-box") > -1) {
    $(".yotpo").hide();
  }
  if ($(window).width() < 768) {
    $(".add_to_cart").click(function(){
      setTimeout(() => {
        $(".section-wrapper ").click();
      }, "2000")
    });
  }
  
  /* hide second badge, if there is one  */
  $(".page-gift-guide .price-ui-badges--round").each(function(){
      if ( $(".price-ui-badge--custom", this).length == 2 ) {
        $(this).find(".price-ui-badge--custom").last().hide();
      }
  })
  setTimeout(() => {
    $(".js-recently-viewed-product .price-ui-badges--round").each(function(){
        if ( $(".price-ui-badge--custom", this).length == 2 ) {
          $(this).find(".price-ui-badge--custom").last().hide();
        }
    })
  }, 2000);

  
    
});

/** Disable focus for seal subscription label multi times **/
$(window).on('load', function() {
    (() => {
        if($('body').hasClass('product')) {
            let spanSlsSubscriptionLabel = setInterval(function(){
                if($('.sls-subscription-details-label').length > 0){    
                    clearInterval(spanSlsSubscriptionLabel);
                    $('.sls-subscription-details-label').attr('tabindex', '-1');
                }
            }, 1000);
            let PDPReviewLink = setInterval(function () {
              if($('.yotpo-bottomline.pull-left.star-clickable').is(':visible')){
                  $('.product__details--product-page .yotpo-bottomline.pull-left.star-clickable').attr({'role':'link'});
                  clearInterval(PDPReviewLink);
              }; 
            }, 1000);
            setTimeout(function () {
                clearInterval(spanSlsSubscriptionLabel);
                clearInterval(PDPReviewLink);
            }, 5000);

            $('body').on('click', '.product__details--product-page .star-clickable', function() {
              $('#product-tab-reviews').trigger('click');
            });

            if (window.location.href.indexOf("?review-display") > -1) {
              var main_url = window.location.toString();
              var clean_url = main_url.substring(0, main_url.indexOf("?"));
              window.history.replaceState({}, document.title, clean_url);
              $('#product-tab-reviews').trigger('click');
            }
        }
    })();
});

$('body').on('click','.product-info__caption .star-clickable', function(){
  var pro_url = $(this).closest('.product-info__caption').attr('href');
  window.location.href = pro_url+'?review-display';
});


/* focused in modal when open BIS */
$('body').on('click','.restock-alerts-float-button', function() {
  $('.restock-alerts-email-input').focus();
});

/* B-Zoom Script */
function runDeviceCheck(){
  const htmlSelector = document.querySelector('html');
  Array.from(htmlSelector.classList).map(function(cls){
    if(cls.indexOf('device--') > -1) htmlSelector.classList.remove(cls);
  });

  var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
  var screenType = window.screen.orientation.type === 'landscape-primary';
  if(screenType && browserZoomLevel >= 200 && browserZoomLevel < 300) {
    htmlSelector.classList.add('mode--zoom');
    htmlSelector.classList.remove('mode--zoom-1');
  } else if(screenType && browserZoomLevel >= 300) {
    htmlSelector.classList.add('mode--zoom-1');
    htmlSelector.classList.remove('mode--zoom');
  } else {
    htmlSelector.classList.remove('mode--zoom');
    htmlSelector.classList.remove('mode--zoom-1');
  }
  if(screen.availWidth > 1024) htmlSelector.classList.add('device--ipadandup');
  else htmlSelector.classList.add('device--mobile');
}

runDeviceCheck();
$(window).on('resize', $.debounce( 300, true, function(){
  runDeviceCheck();
} ) );

$('body').on('click','.nosto-main-image', function(evt) {
  evt.preventDefault();
  const nosto_url = $(this).data('url');
  if(nosto_url) window.location.href = nosto_url;
});

$('body').on('click','.complementary-product__image-element', function(evt) {
  evt.preventDefault();
  const complementary_product_url = $(this).parent('.complementary-product__image-link').data('url');
  if(complementary_product_url) window.location.href = complementary_product_url;
});

$('body').on('click','.js-product-slider .image__container img', function(evt) {
  evt.preventDefault();
  const about_product_url = $(this).closest('.image__container').data('url');
  if(about_product_url) window.location.href = about_product_url;
});

/** Header Search Start **/
$('body').on('input','.header-search__input', function(){
  var search__input = $(this).val().trim();
  const BASE_URL = 'https://searchserverapi.com/getwidgets?api_key=2F1Y7q8F2Q&output=jsonp&items=true&maxResults=8&pages=true&pagesMaxResults=5&categories=true&categoryStartIndex=0&categoriesMaxResults=5';
  if(search__input != '') {
    $('#header-search-form').attr('data-loading', true);
    $('header-search').attr('data-result',true);

    $('.predictive-search-status').attr('aria-hidden', 'false');
    $('.predictive-search-status').text('Loading');

    setTimeout(() => {
      $('.predictive-search-status').attr('aria-hidden', 'true');
    }, 1000);


    fetch(`${BASE_URL}&q=${encodeURIComponent(search__input)}`)
    .then((response) => {
      if (!response.ok) {
        var error = new Error(response.status);
        this.close();
        throw error;
      }

      return response.json();
    })
    .then((res) => {
      display_categories(res);
      display_blogs(res);
      display_products(res);
    })
    .catch((error) => {
      throw error;
    });
  } else {
    $('#header-search-form').removeAttr('data-loading');
    $('header-search').attr('data-result',false);
  }
});

function display_categories(res) {
  $('[data-list-collections]').html('');
  if(res.totalItems === 0) {
    $('[data-list-collections]').html('<p>No collection found.</p>');
    return;
  }
  var res_categories = res.categories;
  if(!res_categories || res_categories.length === 0) {
    $('[data-list-collections]').html('<p>No collection found.</p>');
  } else {
    let res_categories_html = '<ul role="list">';
    res_categories.forEach(function(res_category){
      res_categories_html += '<li role="listitem"><a class="outline-inset" href="'+res_category.link+'">' + res_category.title + '</a></li>';
    });
    res_categories_html += '</ul>';
    $('[data-list-collections]').html(res_categories_html);
  }
}

function display_blogs(res) {
  $('[data-list-blogs]').html('');
  if(res.totalItems === 0) {
    $('[data-list-blogs]').html('<p>No blog found.</p>');
    return;
  }
  var res_pages = res.pages;
  if(!res_pages || res_pages.length === 0) {
    $('[data-list-blogs]').html('<p>No blog found.</p>');
  } else {
    let res_pages_html = '<ul role="list">';
    res_pages.forEach(function(res_page){
      res_pages_html += '<li role="listitem"><a class="outline-inset" href="'+res_page.link+'">' + res_page.title + '</a></li>';
    });
    res_pages_html += '</ul>';
    $('[data-list-blogs]').html(res_pages_html);
  }
}

function display_products(res) {
  $('.search-result-data').html('');
  var totalItems = res.totalItems;
  $('.predictive-search-status').attr('aria-hidden', 'false');
  $('.predictive-search-status').text(totalItems +' products found for your search');

  setTimeout(() => {
    $('.predictive-search-status').attr('aria-hidden', 'true');
  }, 1000);
  if(totalItems === 0) {
    $('#header-search-form').removeAttr('data-loading');
    $('.search-result-data').html('<p>No product found.</p>');
    $('.search-result-count-btn').css("visibility", "hidden");
  } else {
    var res_products = res.items;

    var res_product_html = '<div class=" product-list product-list--collection is-flex is-flex-wrap equal-columns--outside-trim" itemtype="http://schema.org/ItemList">';
    res_products.forEach(function(res_product){
      var prod_link = res_product.link;
      var prod_id = res_product.product_id;
      var prod_variant_id = res_product.shopify_variants['0'].variant_id;
      var prod_title = res_product.title;
      var prod_images = res_product.shopify_images;
      var prod_tags = res_product.tags;
      var display_tags = false;
      var prod_list_price = res_product.list_price;
      var prod_price = res_product.price;
      var is_sale_price = false;
      if(prod_list_price != 0 ) {
        var is_sale_price = true;
      }
      res_product_html += '<div class=" one-fourth column thumbnail thumbnail-hover-enabled--false medium-down--one-half quick-shop-style--inline product__details" data-url="'+prod_link+'">';

        res_product_html += '<div class="product-'+prod_id+'"><div class="product-wrap ">';
          res_product_html += '<div class="relative product_image"><div><div class="image__container"><div class="product_gallery js-product-gallery product-'+prod_id+'-gallery" data-product-gallery="" data-product-id="'+prod_id+'" data-gallery-arrows-enabled="false">';
          prod_images.forEach(function(prod_image){
            res_product_html += '<div class="gallery-cell" data-product-id="'+prod_id+'" data-media-type="image" data-thumb="" data-title=""><div class="image__container" style="max-width: 1000px"><img src="'+prod_image+'" alt="'+prod_title+'" /></div></div>';
          });
          res_product_html += '</div></div></div></div>';
        res_product_html += '</div></div>';

        res_product_html += '<div class="price-ui-badges price-ui-badges--round "><div class="price-ui-badge price-ui-badge--loading "></div>';
          if(prod_tags)
          {
            if(prod_tags.indexOf('product-grid_Exclusive') != -1){
              res_product_html += '<div class="price-ui-badge price-ui-badge--custom price-ui-badge--pink"><div class="price-ui-badge__sticker custom-badge"><span class="price-ui-badge__sticker-text price-ui-badge__sticker-text--pre-order">Exclusive</span></div></div>';
            }
            else if(prod_tags.indexOf('product-grid_Best Seller') != -1){
              res_product_html += '<div class="price-ui-badge price-ui-badge--custom price-ui-badge--pink"><div class="price-ui-badge__sticker custom-badge"><span class="price-ui-badge__sticker-text price-ui-badge__sticker-text--pre-order">Best Seller</span></div></div>';
            }
            else if(prod_tags.indexOf('product-grid_New') != -1){
              res_product_html += '<div class="price-ui-badge price-ui-badge--custom price-ui-badge--pink"><div class="price-ui-badge__sticker custom-badge"><span class="price-ui-badge__sticker-text price-ui-badge__sticker-text--pre-order">New</span></div></div>';
            }
            else if(prod_tags.indexOf('product-grid_15% Off') != -1){
              res_product_html += '<div class="price-ui-badge price-ui-badge--custom price-ui-badge--pink"><div class="price-ui-badge__sticker custom-badge"><span class="price-ui-badge__sticker-text price-ui-badge__sticker-text--pre-order">15% Off</span></div></div>';
            }
            else if(prod_tags.indexOf('product-grid_20% Off') != -1){
              res_product_html += '<div class="price-ui-badge price-ui-badge--custom price-ui-badge--pink"><div class="price-ui-badge__sticker custom-badge"><span class="price-ui-badge__sticker-text price-ui-badge__sticker-text--pre-order">20% Off</span></div></div>';
            }
            else if(prod_tags.indexOf('product-grid_30% Off') != -1){
              res_product_html += '<div class="price-ui-badge price-ui-badge--custom price-ui-badge--pink"><div class="price-ui-badge__sticker custom-badge"><span class="price-ui-badge__sticker-text price-ui-badge__sticker-text--pre-order">30% Off</span></div></div>';
            }
            else if(prod_tags.indexOf('product-grid_40% Off') != -1){
              res_product_html += '<div class="price-ui-badge price-ui-badge--custom price-ui-badge--pink"><div class="price-ui-badge__sticker custom-badge"><span class="price-ui-badge__sticker-text price-ui-badge__sticker-text--pre-order">40% Off</span></div></div>';
            }
            else if(prod_tags.indexOf('product-grid_Award Winner') != -1){
              res_product_html += '<div class="price-ui-badge price-ui-badge--custom price-ui-badge--pink"><div class="price-ui-badge__sticker custom-badge"><span class="price-ui-badge__sticker-text price-ui-badge__sticker-text--pre-order">Award Winner</span></div></div>';
            }
          }
        res_product_html += '</div>';

        res_product_html += '<div class="product-info__caption " href="'+prod_link+'"><div class="product-details">';
          res_product_html += '<a class="title" href="'+prod_link+'" aria-label="'+prod_title+'" itemprop="name">'+prod_title+'</a>';
          res_product_html += '<div class="price-ui price-ui--loading" data-price-ui="">';
            if(is_sale_price == true) {
              res_product_html += '<span class="price price--sale" data-price=""><span class="money" data-price="" data-currency-original="$'+parseFloat(prod_price).toFixed(2)+'" aria-label="Sale Price $'+parseFloat(prod_price).toFixed(2)+'" data-currency-usd="$'+parseFloat(prod_price).toFixed(2)+'" data-currency="USD"><span class="visually-hidden">Sale Price </span>$'+parseFloat(prod_price).toFixed(2)+' </span><span class="compare-at-price-value-added" data-compare-at-price=""><span class="money" data-price="" data-currency-original="$'+parseFloat(prod_list_price).toFixed(2)+'" aria-label="Regular Price $'+parseFloat(prod_list_price).toFixed(2)+'" data-currency-usd="$'+parseFloat(prod_list_price).toFixed(2)+'" data-currency="USD"><span class="visually-hidden">Regular Price </span>$'+parseFloat(prod_list_price).toFixed(2)+' </span></span></span>';
            } else {
              res_product_html += '<span class="price" data-price=""><span class="money" data-price="" data-currency-original="$'+parseFloat(prod_price).toFixed(2)+'" aria-label="Regular Price $'+parseFloat(prod_price).toFixed(2)+'" data-currency-usd="$'+parseFloat(prod_price).toFixed(2)+'" data-currency="USD"><span class="visually-hidden">Regular Price </span>$'+parseFloat(prod_price).toFixed(2)+'</span></span>';
            }
          res_product_html += '</div>';
        res_product_html += '</div></div>';

        res_product_html += '<div class="inline-quickshop js-product-section product-'+prod_id+'"><div class="product_form init smart-payment-button--true " data-product-form="" data-shop-currency="USD"  data-enable-state="false" data-product-id="'+prod_id+'"><form method="post" action="/cart/add" accept-charset="UTF-8" class="shopify-product-form" enctype="multipart/form-data" data-productid="'+prod_id+'"><input type="hidden" name="form_type" value="product"><input type="hidden" name="utf8" value="✓"><div class="select default_select"><select name="id" data-productid="'+prod_id+'" data-variants=""><option value="'+prod_variant_id+'">Default</option></select></div><div class="purchase-details"><div class="purchase-details__quantity product-quantity-box"><input aria-label="quantity" type="hidden" size="2" class="quantity" name="quantity" value="1"></div><div class="purchase-details__buttons purchase-details__spb--true"><button type="button" name="add" class="add_to_cart global-button global-button--primary ajax-submit" data-label="Add to Cart" aria-label="Add to cart '+prod_title+'"><span class="text">Add to Cart</span><svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" class="checkmark"><path fill="none" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11"></path></svg></button></div></div></form></div></div>';

      res_product_html += '</div>';
    });
    res_product_html += '</div>';
    $('.search-result-data').html(res_product_html);
    $('.search-result-products [data-product-gallery]').each((_, gallery) => {
      const $productGallery = $(gallery);
      window.productPage.enableGallery($productGallery);
    });

    $('.search-result-count-btn').text('View All '+totalItems+' Products');
    $('.search-result-count-btn').css("visibility", "visible");
    $('#header-search-form').removeAttr('data-loading');
  }
}

$('body').on('click','.search-result-count-btn', function(){
  $('#header-search-form').submit();
});

var headerSearchContainer = $('.header-seach-wrap');
var srchIconBtn = $('.srch-icon-btn');
headerSearchContainer.on('focusout', function(event) {
  if (
    event.relatedTarget && 
    !headerSearchContainer.has(event.relatedTarget).length && 
    (event.relatedTarget.classList[0] != 'srch-icon-btn')
    ) {
      $('body').toggleClass('search-active overflow-hidden');
      // $('.search-ic-header .srch-icon-btn').attr('aria-expanded','false');
      if ($(window).width() < 798) {
        $('#header .srch-icon-btn').attr('aria-expanded','false'); 
        $('#header .srch-icon-btn').focus();
      } else {
        $('.search-ic-header .srch-icon-btn').attr('aria-expanded','false');
        $('.search-ic-header .srch-icon-btn').focus();
      }
      $('.srch-icon-btn').focus();
  }
});

$('body').on('click','.search-ic', function(){
  $('.search-bar').submit();
});
/** Header Search End **/
