(function (window) {
    var images = Array.prototype.slice.call(document.querySelectorAll('[data-original]'));

    function elementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0
            && rect.left >= 0
            && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }
    function loadImage(el, fn) {
        var img = new Image()
            , src = el.getAttribute('data-original')
            , isBg = el.getAttribute('data-isbg');
        src = src.replace(/^https?:/, '');
        img.onload = function () {
            if (isBg) {
                el.style.backgroundImage = src;
            }
            el.src = src;
            fn ? fn() : null;
        };
        img.src = src;
    }

    function processImages() {
        for (var i = 0; i < images.length; i++) {
            if (elementInViewport(images[i])) {
                loadImage(images[i], function () {
                    images.splice(i, i);
                });
            }
        };
    }

    processImages();
    window.addEventListener('scroll', processImages);

})(this);