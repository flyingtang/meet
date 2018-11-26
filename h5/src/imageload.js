// const images  =  document.images
// console.log(images, "-1--1-1-1-1-")
// for (let i= 0; i < images.length; i++){
//     var obj = images[i];
//     imageLoaded(obj, obj.getAttribute('data-original'))
// }

// function imageLoaded(obj, src) {
//     var img = new Image();
//     img.onload = function() {
//       obj.src = src;
//     };
//     img.src = src;
// }


window.onscroll = function() {
    lazyload();
  };
  
  function lazyload() {
    var lazy = 0;
    var images = document.images;
    for (var i = 0, len = images.length; i < len; i++) {
      var obj = images[i];
      if (obj.getBoundingClientRect().top - lazy < document.documentElement.clientHeight && !obj.isLoad) {
        obj.isLoad = true;
        if (obj.dataset) 
          imageLoaded(obj, obj.dataset.original);
        else 
          imageLoaded(obj, obj.getAttribute('data-original'));
      }
    }
  }
  function imageLoaded(obj, src) {
    var img = new Image();
    img.onload = function() {
      obj.src = src;
    };
    img.src = src;
  }