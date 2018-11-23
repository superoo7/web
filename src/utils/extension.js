export const isChrome = function() {
  return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

export const detectExtension = function(extensionId, callback) {
  const xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'chrome-extension://' + extensionId + '/manifest.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState === 4) {
      if (xobj.status === 200) {
        callback(true);
      } else {
        callback(false);
      }
    }
  };
  xobj.send(null);
}