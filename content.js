'use strict'

window.addEventListener('load', () => {
  const embedUrl = document.querySelector("meta[name='twitter:player']")
  if (embedUrl && window.confirm("Do you want to view this slide in embed mode?")) {
    location.href = embedUrl.getAttribute("content");
  }
}, false);
