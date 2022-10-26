'use strict'

window.addEventListener('load', () => {
  setInterval(function() {
    if (window.adsEnabled) {
      window.adsEnabled=false;
    }
  }, 1000);
}, false);
