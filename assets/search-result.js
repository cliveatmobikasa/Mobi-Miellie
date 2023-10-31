"use strict";

window.addEventListener('DOMContentLoaded', function(event){
    SearchResult();
});

var base_url = 'https://www.searchanise.com/getresults?api_key=2F1Y7q8F2Q&output=jsonp&items=true&facets=true&facetsShowUnavailableOptions=false&pages=true&categories=true';
var startIndex = 0;
var move_to_top = false;
var escPressed = false;
var query = '';
let loadingResult = document.getElementById('loaderContainer');
let searchResultHideContainer = document.getElementsByClassName('search-result-main');

function SearchResult() {
    const container = document.querySelector('.search-result-main');
    if(!container) return;
    var url_obj = new URL(window.location.href);
    var sort_by = document.querySelector('[data-sortby] select').value;
    query = url_obj.searchParams.get('q') || '';
    var final_url  = base_url + '&q=' + query;
    var initial_max_result = 20;

    var initialURL = final_url + '&sortBy=' + sort_by + '&startIndex='+startIndex+'&maxResults=' + initial_max_result;

    var filter_items = document.querySelector('.search-result-main').querySelectorAll('[data-filter-items] [data-filter-item]');
    if(window.innerWidth < 799) {
      var filter_items = document.querySelector('.search-result-main').querySelectorAll('[data-filter-mobile-items] li');
    }

    

    if(filter_items && filter_items.length){
      let hasActiveInput = false;
      filter_items.forEach(function(filter_item){
        const checked_inputs = Array.from(filter_item.querySelectorAll('input[type="checkbox"]')).filter(function(input){
            return input.checked;
        });
        if(checked_inputs && checked_inputs.length){
          hasActiveInput = true;
            const filterName = filter_item.dataset.filterName;
            const input_len = checked_inputs.length;
            let values = '';
            checked_inputs.forEach(function(input, index){
                values += input.value;
                if((index + 1) < input_len) values += '|';
            });
            initialURL += '&' + filterName + '=' + values;
        }
      });
      // 
      if(hasActiveInput){
        $('.clear_all_button').addClass('show');
        $('.clear_all_button').removeClass('hide');
        $('body').addClass('clearBtn');
      }
      else{
        $('.clear_all_button').addClass('hide');
        $('.clear_all_button').removeClass('show');
        $('body').removeClass('clearBtn');
      }
      // 
    } 

    $('.search-result-status').attr('aria-hidden', 'false');
    $('.search-result-status').text('Loading');

    setTimeout(() => {
      $('.search-result-status').attr('aria-hidden', 'true');
    }, 1000);
    fetchSearchResults(initialURL);
}



// $('body').on('change','.plp-filter-items li .btn-outlined .filter-title-content .plp-filter-values li input',function(){
  $('.plp-filter-items li .btn-outlined .filter-title-content .plp-filter-values li input').each(function () {
    if ($(this).is(':checked')) {
      $(this).addClass('mob_newClass');
    } else {
      $(this).removeClass('mob_newClass');
    }
  });
  // 



function fetchSearchResults(fetch_url) {
    if(!fetch_url) return;

    fetch(fetch_url).then(function(res){
        return res.json();
    }).then(function(data){
      $('.skeleton-main-container').attr('style',' ');
      $('#search-result-hide').attr('style',' '); 
        // console.log(data);
        $('[data-result-count]').text(data.totalItems);
        $('[data-result-query-key]').text(query);
        $('.search-result-status').attr('aria-hidden', 'false');
        $('.search-result-status').text(data.totalItems + ' products found');

        setTimeout(() => {
          $('.search-result-status').attr('aria-hidden', 'true');
        }, 1000);

        display_filter(data.facets);

        if(data.totalItems && data.totalItems > 0) {
            $('.search-result-main').removeClass('no--result hidden');
            $('.no-result').addClass('hidden');
            display_search_product(data.items);
            display_search_pagination(data);
            display_search_categories(data);
            display_search_blogs(data);
            
        } else {
            $('.search-result-main').addClass('no--result hidden');
            $('.no-result').removeClass('hidden');
            // alert('no result found' +query);
            $('[No-result-title]').text(query);
            $('.noResultContainer').attr('style',' ');
            $('.noResultContainer .product-list').slick('refresh');
             
            //  setTimeout(() => {
            //   //  $('.product-list').slick('refresh'); 
            //    $('#noResultFoundContainer').attr('id',' ');
            //   }, 2000);
            
        }
    }).catch(function(err){
        console.log(err)
    });
}

function display_search_product(products) {
    $('[data-result-container]').html('');
    
    var res_product_html = '<div class=" product-list product-list--collection is-flex is-flex-wrap equal-columns--outside-trim" itemtype="http://schema.org/ItemList">';
    products.forEach(function(res_product){
      var prod_link = res_product.link;
      var prod_id = res_product.product_id;
      var prod_variant_id = res_product.shopify_variants['0'].variant_id;
      var prod_title = res_product.title;
      var prod_images = res_product.shopify_images;
      var prod_tags = res_product.tags;
      var display_tags = false;
      var prod_list_price = res_product.list_price;
      var prod_price = res_product.price;
      var prod_available_qty = res_product.quantity;
      var is_sale_price = false;
      if(prod_list_price != 0 ) {
        var is_sale_price = true;
      }
      if( prod_available_qty != 0 ){
        var available_prod_qty = true;
      }
      res_product_html += '<div class=" one-fourth column thumbnail thumbnail-hover-enabled--false medium-down--one-half quick-shop-style--inline product__details" data-url="'+prod_link+'">';

        res_product_html += '<div class="product-'+prod_id+'"><div class="product-wrap ">';
          res_product_html += '<div class="relative product_image"><div><div class="image__container"><div class="product_gallery js-product-gallery product-'+prod_id+'-gallery" data-product-gallery="" data-product-id="'+prod_id+'" data-gallery-arrows-enabled="false">';
          if(prod_images){
            prod_images.forEach(function(prod_image){
              res_product_html += '<div class="gallery-cell" data-product-id="'+prod_id+'" data-media-type="image" data-thumb="" data-title=""><div class="image__container" style="max-width: 1000px"><img src="'+prod_image+'" alt="'+prod_title+'" /></div></div>';
            });
          }
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
        res_product_html += '<div style="text-align: center"><div data-bv-show="inline_rating" data-bv-product-id="'+prod_id+'" data-bv-redirect-url="'+prod_link+'" data-bv-seo="false"></div></div>';  
        res_product_html += '<a class="title" href="'+prod_link+'" aria-label="'+prod_title+'" itemprop="name">'+prod_title+'</a>';
          res_product_html += '<div class="price-ui price-ui--loading" data-price-ui="">';
            if(is_sale_price == true) {
              res_product_html += '<span class="price price--sale" data-price=""><span class="money" data-price="" data-currency-original="$'+parseFloat(prod_price).toFixed(2)+'" aria-label="Sale Price $'+parseFloat(prod_price).toFixed(2)+'" data-currency-usd="$'+parseFloat(prod_price).toFixed(2)+'" data-currency="USD"><span class="visually-hidden">Sale Price </span>$'+parseFloat(prod_price).toFixed(2)+' </span><span class="compare-at-price-value-added" data-compare-at-price=""><span class="money" data-price="" data-currency-original="$'+parseFloat(prod_list_price).toFixed(2)+'" aria-label="Regular Price $'+parseFloat(prod_list_price).toFixed(2)+'" data-currency-usd="$'+parseFloat(prod_list_price).toFixed(2)+'" data-currency="USD"><span class="visually-hidden">Regular Price </span>$'+parseFloat(prod_list_price).toFixed(2)+' </span></span></span>';
            } else {
              res_product_html += '<span class="price" data-price=""><span class="money" data-price="" data-currency-original="$'+parseFloat(prod_price).toFixed(2)+'" aria-label="Regular Price $'+parseFloat(prod_price).toFixed(2)+'" data-currency-usd="$'+parseFloat(prod_price).toFixed(2)+'" data-currency="USD"><span class="visually-hidden">Regular Price </span>$'+parseFloat(prod_price).toFixed(2)+'</span></span>';
            }
          res_product_html += '</div>';
        res_product_html += '</div></div>';
        if(available_prod_qty == true ){
        res_product_html += '<div class="inline-quickshop js-product-section product-'+prod_id+'"><div class="product_form init smart-payment-button--true " data-product-form="" data-shop-currency="USD"  data-enable-state="false" data-product-id="'+prod_id+'"><form method="post" action="/cart/add" accept-charset="UTF-8" class="shopify-product-form" enctype="multipart/form-data" data-productid="'+prod_id+'"><input type="hidden" name="form_type" value="product"><input type="hidden" name="utf8" value="✓"><div class="select default_select"><select name="id" data-productid="'+prod_id+'" data-variants=""><option value="'+prod_variant_id+'">Default</option></select></div><div class="purchase-details"><div class="purchase-details__quantity product-quantity-box"><input aria-label="quantity" type="hidden" size="2" class="quantity" name="quantity" value="1"></div><div class="purchase-details__buttons purchase-details__spb--true"><button type="button" name="add" class="add_to_cart global-button global-button--primary ajax-submit" data-label="Add to Cart" aria-label="Add to cart '+prod_title+'"><span class="text">Add to Cart</span><svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" class="checkmark"><path fill="none" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11"></path></svg></button></div></div></form></div></div>';
      }
      else{
        res_product_html += '<div class="inline-quickshop js-product-section product-'+prod_id+'"><div class="product_form init smart-payment-button--true " data-product-form="" data-shop-currency="USD"  data-enable-state="false" data-product-id="'+prod_id+'"><form method="post" action="/cart/add" accept-charset="UTF-8" class="shopify-product-form" enctype="multipart/form-data" data-productid="'+prod_id+'"><input type="hidden" name="form_type" value="product"><input type="hidden" name="utf8" value="✓"><div class="select default_select"><select name="id" data-productid="'+prod_id+'" data-variants=""><option value="'+prod_variant_id+'">Default</option></select></div><div class="purchase-details"><div class="purchase-details__quantity product-quantity-box"><input aria-label="quantity" type="hidden" size="2" class="quantity" name="quantity" value="1"></div><div class="purchase-details__buttons purchase-details__spb--true"><a href="'+prod_link+'" class="notify_me global-button global-button--primary" aria-label="Notify Me '+prod_title+'"><span class="text">Notify Me</span></a></div></div></form></div></div>';
}
      res_product_html += '</div>';
    });
    res_product_html += '</div>';
    $('[data-result-container]').html(res_product_html);
    $('[data-result-container] [data-product-gallery]').each((_, gallery) => {
      const $productGallery = $(gallery);
      window.productPage.enableGallery($productGallery);
    });

    if(move_to_top === true) {
        $('html, body').animate({
            scrollTop: $(".search-page-title-wrapper").offset().top - 150
        }, 2000);
    }

    
}

function display_filter(filters) {
    if(!filters || filters.length === 0) {
        $('[data-filter-items]').html('');
    } else {
        let filter_html_main = '';
        let filter_html_mobile = '';
        var loop_count = 1;
        filters.forEach(function(filter){
            filter_html_main += '<div data-filter-item="" data-filter-name="restrictBy['+filter.attribute+']" class="">';
                filter_html_main += '<button type="button" class="search-filter-title" aria-label="'+filter.title+' filter" aria-expanded="true"><span>'+filter.title+' </span><span class="right icon-up-arrow sidebar-block-toggle-icon"></span></button>';
                filter_html_main += '<div class="filter-list open"><ul class="scroll-list">';
                    var buckets = filter.buckets;
                    buckets.forEach(function(bucket){

                        var selected = (bucket.selected == "true") ? 'checked' : '';

                        filter_html_main += '<li class="faceted-filter-group-display__list-item-label" role="listitem" data-value="'+bucket.value+'"><label class="filter-group-display__list-item-label" for="'+filter.attribute+'-'+bucket.value+'-desktop"><input class="faceted-filter-group-display__list-item-input" type="checkbox" '+selected+' name="'+filter.attribute+'" value="'+bucket.value+'" id="'+filter.attribute+'-'+bucket.value+'-desktop"><svg class="faceted-filter-group-display__checkmark" aria-hidden="true" focusable="false" role="presentation" width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path class="faceted-filter-group-display__checkmark-check" fill="none" d="M2.5 7L5.5 10L11.5 4"></path></svg><span class="faceted-filter-group-display__list-item-label-text">'+bucket.value+'<span class="filter_value_count"> ('+bucket.count+')</span></span></label></li>';
                    });
                filter_html_main += '</ul></div>';
            filter_html_main += '</div>';

            if(loop_count == '1') {
              filter_html_mobile += '<li data-filter-name="restrictBy['+filter.attribute+']" role="listitem"><button aria-expanded="true" data-facet="'+filter.attribute+'" type="button" class="btn btn-outlined btn-filter-title active">'+filter.title+' <span class="Mob_filter_btn"></span></button><div class="filter-title-content" tabindex="-1"><ul role="list" data-facet="'+filter.attribute+'" class="plp-filter-values">';
            } else {
              filter_html_mobile += '<li data-filter-name="restrictBy['+filter.attribute+']" role="listitem"><button aria-expanded="false" data-facet="'+filter.attribute+'" type="button" class="btn btn-outlined btn-filter-title">'+filter.title+' <span class="Mob_filter_btn"></span></button><div class="filter-title-content" tabindex="-1"><ul role="list" data-facet="'+filter.attribute+'" class="plp-filter-values">';
            }

              buckets.forEach(function(bucket){

                var selected = (bucket.selected == "true") ? 'checked' : '';

                filter_html_mobile += '<li class="plp-filter-value" role="listitem"><input class="faceted-filter-group-display__list-item-input" type="checkbox" '+selected+' name="'+filter.attribute+'" value="'+bucket.value+'" id="'+filter.attribute+'-'+bucket.value+'-mobile"><label for="'+filter.attribute+'-'+bucket.value+'-mobile">'+bucket.value+'<span> ('+bucket.count+')<span class="visually-hidden">products</span></span></label></li>';
              });
            
            filter_html_mobile += '</ul></div></li>';
            loop_count ++;

        });

        $('[data-filter-items]').html(filter_html_main);
        $('[data-filter-mobile-items]').html(filter_html_mobile);
    }
}

function display_search_pagination(data) {

    var totalItems = data.totalItems;
    var startIndex = data.startIndex;
    var total_page = Math.ceil(totalItems / 20);
    var current_page = Math.round(startIndex / 20);
    if(total_page > 1 ) {
        var pagination_html = '<div class="paginate"><nav role="navigation" aria-label="pagination"><ol class="pagination">';

            if(current_page === 0) {
              pagination_html += '<li class="prev disabled pagination-mobile-hidden" aria-disabled="true" role="link"><span class="icon-left-arrow"></span><span role="text">Prev<span class="visually-hidden">ious page</span></span></li>';
              pagination_html += '<li class="prev disabled prev-mobile pagination-desktop-hidden" aria-disabled="true" role="link"><span class="icon-left-arrow"></span><span role="text" class="visually-hidden">Prev<span class="visually-hidden">ious page</span></span></li>';
            } else {
              pagination_html += '<li class="prev pagination-mobile-hidden"><a href="javascript:void(0)"><span class="icon-left-arrow"></span> Prev<span class="visually-hidden">ious</span> <span class="visually-hidden">page</span></a></li>';
              pagination_html += '<li class="prev prev-mobile pagination-desktop-hidden"><a href="javascript:void(0)"></span><span class="icon-left-arrow"><span class="visually-hidden">previous page</span></a></li>';
            }

            for (i = 0; i < total_page; i++) {
                if(current_page == i) {
                    pagination_html += '<li class="page current active" data-page="'+(i+1)+'" aria-current="page"><span class="visually-hidden">Page </span> '+(i+1)+'</li>';
                } else {
                    pagination_html += '<li class="page"><a data-page="'+(i+1)+'" href="javascript:void(0)"><span class="visually-hidden">Page </span> '+(i+1)+' </a></li>';
                }
            }

            if((current_page + 1) === total_page) {
              pagination_html += '<li class="next disabled pagination-mobile-hidden" aria-disabled="true" role="link"><span role="text">Next <span class="visually-hidden"> page</span> <span class="icon-right-arrow"></span></span></li>';
              pagination_html += '<li class="next disabled next-mobile pagination-desktop-hidden" aria-disabled="true" role="link"><span role="text"><span class="visually-hidden">Next page</span> <span class="icon-right-arrow"></span></span></li>';
            } else {
              pagination_html += '<li class="next pagination-mobile-hidden"><a href="javascript:void(0)">Next <span class="visually-hidden">page</span><span class="icon-right-arrow"></span></a></li>';
              pagination_html += '<li class="next next-mobile pagination-desktop-hidden"><a href="javascript:void(0)"><span class="visually-hidden">Next page</span><span class="icon-right-arrow"></span></a></li>';
            }
            
        pagination_html += '</ol></nav></div>';
        $('[data-result-pagination]').html(pagination_html);
    } else {
        $('[data-result-pagination]').html('');
    }

}



function display_search_categories(data) {
  $('[data-searchpage-collections]').html('');
  if(data.totalItems === 0) {
    $('[data-searchpage-collections]').html('<div class="one-whole column"><p>No collection found.</p></div>');
    return;
  }
  var data_categories = data.categories;
  if(!data_categories || data_categories.length === 0) {
    $('[data-searchpage-collections]').html('<div class="one-whole column"><p>No collection found.</p></div>');
  } else {

    let data_categories_html = '';
    let data_categories_count = 0;
    
    data_categories.forEach(function(data_category){

      data_categories_html += '<div class="one-third medium-down--one-whole column"><div class="search-coll-list"><div class="search-coll-list-img-with-content">';

      data_categories_html += '<a style="display:none" href="'+data_category.link+'" aria-label="View ' + data_category.title + ' collections products"><img src="' + data_category.image_link + '" alt="' + data_category.title + '"></a>';

      data_categories_html += '<div class="search-result-coll-title" aria-label="View ' + data_category.title + ' collections products">'+ data_category.title +'</div>';

      var coll_handle = (data_category.link).replace("/collections/", "");
      var coll_url = 'https://mielleorganics.com/collections/'+coll_handle+'.json';
      fetch(coll_url).then(function(res){
          return res.json();
      }).then(function(col_data){
        var coll_desc = col_data['collection']['description'];
        $('#col-desc-'+data_category.category_id).html(coll_desc);
      }).catch(function(err){
          console.log(err)
      });

      data_categories_html += '<div class="search-result-coll-desc" id="col-desc-'+data_category.category_id+'"></div>';

      data_categories_html += '<div class="search-result-coll-button"><a href="'+data_category.link+'" aria-label="Shop Now' +data_category.title+'collection">Shop Now</a></div>';
      data_categories_html += '</div></div></div>';
      data_categories_count++;
    });
    let data_categories_count_html ='<div class="data_cate_count">'+data_categories_count+' Results found for "'+query+'"</div>'
    $('[data-searchpage-collections]').html(data_categories_count_html+data_categories_html);
  }
}

function display_search_blogs(data) {
  $('[data-searchpage-blogs]').html('');
  if(data.totalItems === 0) {
    $('[data-searchpage-blogs]').html('<div class="one-whole column"><p>No blog found.</p></div>');
    return;
  }
  var data_pages = data.pages;
  if(!data_pages || data_pages.length === 0) {
    $('[data-searchpage-blogs]').html('<div class="one-whole column"><p>No blog found.</p></div>');
  } else {
    let data_pages_html = '';
    let data_pages_count = 0;
    data_pages.forEach(function(data_page){
      if((data_page.link).indexOf('blogs') != -1){
        data_pages_html += '<div class="one-whole column"><div class="blog-single-data">';
          data_pages_html += '<div class="blog-single-image"><a href="'+data_page.link+'" aria-label="' + data_page.title + '">';
          if(data_page.image_link != '') {
            data_pages_html += '<img src="'+data_page.image_link.replace('_compact','_200x')+'" alt="' + data_page.title + '" />';
          } else {
            data_pages_html += '<img class="place-img" src="https://cdn.shopify.com/s/files/1/0763/8199/files/MIELLE_Brandmark_2018-dark.png" alt="' + data_page.title + '" />';
          }
          data_pages_html += '</a></div>';
          data_pages_html += '<div class="blog-single-details"><h2 class="blog-single-title">'+ data_page.title + '</h2><div class="blog-single-content"><p>'+ data_page.description + '</p> <a href="'+data_page.link+'" aria-label="Read more ' + data_page.title + '" class="read-more">Read More</a></div>';

          data_pages_html += '</div>';

        data_pages_html += '</div></div>';
        data_pages_count++;
      }
    });
    let data_pages_count_html = '<div class="one-whole column search-result-tab-count"><p>'+data_pages_count+' Results found for "'+query+'":</p></div>';
    $('[data-searchpage-blogs]').html(data_pages_count_html + data_pages_html);
  }
}


$('body').on('click','.search-filter-title', function() {
    var $this = $(this);
    if($this.attr('aria-expanded') == 'false') {
        $this.attr('aria-expanded', 'true');
    } else {
        $this.attr('aria-expanded', 'false');
    }
    $this.find('.sidebar-block-toggle-icon').toggleClass('icon-up-arrow icon-down-arrow');
    $this.closest('[data-filter-item]').find('.filter-list').toggleClass('open');
});

$('body').on('click', '[data-result-pagination] .page a', function(){
    var page_no = $(this).data('page');
    startIndex = (page_no - 1) * 20;
    move_to_top = true;
    $('.search-result-status').attr('aria-hidden', 'false');
    $('.search-result-status').text('Loading');

    setTimeout(() => {
      $('.search-result-status').attr('aria-hidden', 'true');
    }, 1000);
    SearchResult();
});

$('body').on('click', '[data-result-pagination] .next a', function(){
  var page_no = $('[data-result-pagination] .active').data('page');
  $('[data-result-pagination] .page [data-page="'+(page_no + 1)+'"]').trigger('click');
});

$('body').on('click', '[data-result-pagination] .prev a', function(){
  var page_no = $('[data-result-pagination] .active').data('page');
  $('[data-result-pagination] .page [data-page="'+(page_no - 1)+'"]').trigger('click');
});

$('body').on('keyup', '[data-sortby-search]', function(event){
  if (event.which === 27) { // 27 is the key code for "Esc"
    escPressed = true;
  }
});

$('body').on('change', '[data-sortby-search]', function(event){
  setTimeout(() => {
    //console.log(escPressed);
    if (escPressed) {
      escPressed = false;
      return;
    } else {
      startIndex = 0;
      SearchResult();
    }
  }, 200);
});


  
  // filter code for mobile starts here
  $('body').on('change','.faceted-filter-group-display__list-item-input',function(){
    if ($(this).is(':checked')) {
      $(this).addClass('inputActive');
      $(this).parent().addClass('label_active');
    } else {
      $(this).removeClass('inputActive');
      $(this).parent().removeClass('label_active');
    }
  });
  
  // 
  $(document).ready(function(){
    
      $(document).on('click', ".plp-filter-footer .btn-outlined", function(){
        if($(".plp-filter-value input").hasClass("inputActive")){
        $('.wrapper-overlay').addClass('active');
        $('.closeFilterContainer').attr('style',' ');
        }
      });
      $(document).on('click', ".plp-filter-header-text button", function(){
        if($(".plp-filter-value input").hasClass("inputActive")){
        $('.wrapper-overlay').addClass('active');
        $('.closeFilterContainer').attr('style',' ');
        }
      });
      $(document).on('click', ".closeFilterBody .discard", function(){
        if($(".plp-filter-value input").hasClass("inputActive")){
        $('.wrapper-overlay').removeClass('active');
        $('.closeFilterContainer').css('display',"none");
        $('.inputActive').trigger('click');
      }
      });
      $(document).on('click', ".btn.apply_btn.apply", function(){
        if($(".plp-filter-value input").hasClass("inputActive")){
          $('.wrapper-overlay').removeClass('active');
          $('.closeFilterContainer').css('display',"none");
        }
      });
  });
  // filter code for mobile ends here
  
  
  function numberGenerator(){
      // filter lenght 
      // $('.collection-result-main .plp-filter-items li .btn-filter-title').length
      $('.search-result-main .plp-filter-items li .btn-filter-title').each(function(e){
        let li_element = $(this).parent();
        
        let num_ele = li_element.find(".plp-filter-value input:checked").length;
        if($(num_ele).length == 0) {
        li_element.find('.Mob_filter_btn').html('');
        }
        else{
          li_element.find('.Mob_filter_btn').html(`(${num_ele})`);
        }
      });
  };
  
  var MobileFilterArr = [];
  // $('body').on('click','.apply_btn',function(){
      $('body').on('change','.plp-filter-value .faceted-filter-group-display__list-item-input',function(){
      numberGenerator();
      var selectedValues = $(this).val();
      // alert(selectedValues);
      if ($(this).is(':checked')) {
        MobileFilterArr.push(selectedValues);
        // alert(selectedValues);
      } else {
        MobileFilterArr.splice($.inArray(selectedValues, MobileFilterArr),1);
      }
      console.log(MobileFilterArr);
      $('#mobFBtn').html('');
      for(i=0;i<MobileFilterArr.length;i++){
        console.log('testing', mobFBtn[i]);
        $('#mobFBtn').append('<button class="filter_btn" type="button" aria-label="Clear filter '+MobileFilterArr[i]+'" value="'+MobileFilterArr[i]+'">'+MobileFilterArr[i]+'<span class="filter_btn_cross_icon"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg></span></button>');
      }
    });
    $('body').on('click','#mobFBtn .filter_btn',function(){
      numberGenerator();
      var SelectedFilterBtn =  $(this).attr('value');
      // console.log(abc);
      if(MobileFilterArr.includes(SelectedFilterBtn)){
      $(this).css("display","none");
      }
      $(".plp-filter-value .faceted-filter-group-display__list-item-input:checked").each(function () {
        var RemovefilterBTn =  $(this).attr('value');
        if(RemovefilterBTn == SelectedFilterBtn){
          $(this).trigger('click');
          $('.btn.apply_btn').trigger('click');
        }
      });
      
    });
    // 
    $('body').on('click','.clear_all_button',function(){
      $(".faceted-filter-group-display__list-item-input:checked").each(function () {
        var filterBtnTrigger =  $(this).attr('value');
        if(MobileFilterArr.includes(filterBtnTrigger)){
          $(this).trigger('click');
          }
      });
    });
    //

    $(document).on("click",".sort_filter_mb_filter", function(){
      numberGenerator();
    })
// filter code starts here
var FilterArr = [];
$('body').on('change','.faceted-filter-group-display__list-item-label input',function(){
  var checked = $(this).val();
  if ($(this).is(':checked')) {
    FilterArr.push(checked);
  } else {
    FilterArr.splice($.inArray(checked, FilterArr),1);
  }
  $('#FilterSubBtn').html('');
  for(i=0;i<FilterArr.length;i++){
    // console.log(FilterArr[i]);
    $('#FilterSubBtn').append('<button class="filter_btn" type="button" aria-label="Clear filter '+FilterArr[i]+'" value="'+FilterArr[i]+'">'+FilterArr[i]+'<span class="filter_btn_cross_icon"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg></span></button>');
  }
});

$('body').on('click','#FilterSubBtn .filter_btn',function(){
  var SelectedFilterBtn =  $(this).attr('value');
  // console.log(abc);
  if(FilterArr.includes(SelectedFilterBtn)){
  $(this).css("display","none");
  }
  $(".faceted-filter-group-display__list-item-input:checked").each(function () {
    var RemovefilterBTn =  $(this).attr('value');
    if(RemovefilterBTn == SelectedFilterBtn){
      $(this).trigger('click');
    }
  });
});

// 
$('body').on('click','.clear_all_button',function(){
  $(".faceted-filter-group-display__list-item-input:checked").each(function () {
    var filterBtnTrigger =  $(this).attr('value');
    if(FilterArr.includes(filterBtnTrigger)){
      $(this).trigger('click');
      }
  });
});
//
// filter code ends here

$('body').on('change','[data-filter-items] .faceted-filter-group-display__list-item-input', function(){
  var $this_id = $(this).attr('id');
  startIndex = 0;
  SearchResult();
  setTimeout(() => {
    $('#'+$this_id).focus();
  }, 2000);
});
// 
$('body').on('click','.clear_all_button',function(){
  $(".faceted-filter-group-display__list-item-input").each(function () {
    $(this).prop('checked', false);
 });
 SearchResult();
  $('.clear_all_button').removeClass('show');
  $('.clear_all_button').addClass('hide');
  
});
//

$('body').on('click','#sort-by-mobile_search button', function(){
  $('.custome_sort_by').hide();
  $('#sort-by-mobile_search button').attr('aria-selected', false);
  $('#sort-by-mobile_search button').removeClass('selected');

  $(this).attr('aria-selected', true);
  $(this).addClass('selected');
  var curr_mob_sort_val = $(this).data('value');
  $('#sort-by-search').val(curr_mob_sort_val).trigger('change');
  setTimeout(() => {
    $('.sort_filter_mb_sort button').focus();
  }, 1500);
});

$('body').on('click','.sort_filter_mb_filter', function(){
  $('body').addClass('overflow-hidden');
  $('facet-filters-form').attr('open', true);
  $('.plp-filter-model').show();
});

$('body').on('click','[data-filter-close]', function(){
  $('body').removeClass('overflow-hidden');
  $('facet-filters-form').removeAttr('open');
  $('.plp-filter-model').hide();
  setTimeout(() => {
    $('.sort_filter_mb_filter button').focus();
  }, 1500);
});

$('body').on('click','[data-filter-mobile-items] .btn-filter-title', function(){
  $('[data-filter-mobile-items] .btn-filter-title').attr('aria-expanded', false);
  $('[data-filter-mobile-items] .btn-filter-title').removeClass('active');
  $(this).attr('aria-expanded', true);
  $(this).addClass('active');
});

$('body').on('click', '[data-filter-apply]', function(){
  startIndex = 0;
  SearchResult();
  $('body').removeClass('overflow-hidden');
  $('facet-filters-form').removeAttr('open');
  $('.plp-filter-model').hide();
  setTimeout(() => {
    $('.sort_filter_mb_filter button').focus();
  }, 1500);
});