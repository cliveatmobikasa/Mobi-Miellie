"use strict";
window._theme = window._theme || {};

_theme.isNostoRealoading = false;
_theme.reloadMinicartNosto = function(){
  if(!window.Nosto || !Nosto.reloadCart || _theme.isNostoRealoading) return;
  // console.count('reload mini cart nosto');
  $('#nosto-minicart').addClass('reloading');
  _theme.isNostoRealoading = true;
  Nosto.reloadCart();
  setTimeout(() => {
    $('#nosto-minicart').removeClass('reloading');
    _theme.isNostoRealoading = false;
  }, 1000);
}

_theme.focusTrap = function(elem, cb, tabbableAdditionalElems){
  let tabbableElems = ['select', 'input', 'textarea', 'button', 'a'];
  if(tabbableAdditionalElems){
    if(Array.isArray(tabbableAdditionalElems)) tabbableElems = tabbableElems.concat(tabbableAdditionalElems)
    if(typeof tabbableAdditionalElems === 'string') tabbableElems.push(tabbableAdditionalElems);
  }
  let tabbable = elem.find(tabbableElems.join(',')).filter(':visible');
  let firstTabbable = tabbable.first();
  let lastTabbable = tabbable.last();
  // console.log("reun",firstTabbable,"last",tabbable)
  firstTabbable.focus();
  lastTabbable.off('keydown').on('keydown', function(e) {
    if ((e.which === 9 && !e.shiftKey)) {
        e.preventDefault();
        firstTabbable.focus();
    }
  });

  firstTabbable.off('keydown').on('keydown', function(e) {
      if ((e.which === 9 && e.shiftKey)) {
          e.preventDefault();
          lastTabbable.focus();
      }
  });
    
  elem.off('keydown').on('keydown', function(e) {
    if (e.keyCode === 27 ) {
      cb(elem);
    }
  });
}

_theme.focusFirstTabbable = function($container){
  if(!$container || $container.length === 0) return;
  const tabbableElems = ['select', 'input', 'textarea', 'button', 'a'];
  const tabbable = $container.find(tabbableElems.join(',')).filter(':visible');
  tabbable.first().focus();
}

_theme.getOS = function() {
  if(!window.navigator) return '';
  var userAgent = window.navigator.userAgent;
  var userAgentData = window.navigator.userAgentData;
  var platform = userAgentData ? userAgentData.platform ? userAgentData.platform :  window.navigator.platform : window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'mac-os';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'ios';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'windows';
  } else if (/Android/.test(userAgent)) {
    os = 'android';
  } else if (/Linux/.test(platform)) {
    os = 'linux';
  }

  return os;
}

_theme.iPhoneVersion = function(){
  var iHeight = window.screen.height;
  var iWidth = window.screen.width;

  if (iWidth === 414 && iHeight === 896) {
    return "xmax-xr";
  } else if (iWidth === 375 && iHeight === 812) {
    return "x-xs";
  } else if (iWidth === 320 && iHeight === 480) {
    return "4";
  } else if (iWidth === 375 && iHeight === 667) {
    return "6";
  } else if (iWidth === 414 && iHeight === 736) {
    return "6-plus";
  } else if (iWidth === 320 && iHeight === 568) {
    return "5";
  } else if (iHeight <= 480) {
    return "2-3";
  }
  return 'none';
}

_theme.initSliderPlayPause = function($parent, $sliderInstance, isSlickSlider, label){
  if($parent.length === 0 || $parent.find('.homepage-slider-play-pause').length === 0) return;
  if(!label) {
    label="Slider Autoplay play/pause";
  }
  
  $parent.find('.homepage-slider-play-pause').removeClass('hidden');
  const $playPausebutton = $parent.find('.homepage-slider-play-pause button');
  $playPausebutton.attr('aria-label',label+' pause');  
  $playPausebutton.off('click').on('click', function(evt){
    $(this).toggleClass('active');
    let msg = 'Autoplay started. press to pause';
    let evtName = isSlickSlider ? 'slickPlay' : 'playPlayer';
    $(this).attr('aria-label',label+' pause');
    if($(this).hasClass('active')){
      msg = 'Autoplay paused. press to play';
      evtName = isSlickSlider ? 'slickPause' : 'pausePlayer';
      $(this).attr('aria-label',label+' play');  
    }

    if(isSlickSlider) $sliderInstance.slick(evtName); 
    else $sliderInstance.flickity(evtName);
    // $(this).next('[data-aria-live]').text(msg); 
  });
}

document.body.classList.add('os-' + _theme.getOS(), 'version-' + _theme.iPhoneVersion());

document.addEventListener("DOMContentLoaded", (event) => {
  _theme.reloadMinicartNosto();
});