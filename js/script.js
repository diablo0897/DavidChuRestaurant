$(function(){ //same as document.addEventListener("DOMContentLoaded"...)//
    //Same as document.querySelector("#navbarToggle").addEventListener
    $("#navbarToggle").blur(function (event) {
        var screenWidth = window.innerWidth;
        if (screenWidth < 768){
            $("#navbarSupportedContent").collapse('hide');
        }
    });
});

(function(global){
    var dc = {};

    var homeHtml = "snippets/home-snippet.html";

    //Inserting innterHTML for 'select'
    var insertHtml = function (selector,html) {
        var targetElm = document.querySelector(selector);
        targetElm.innerHTML = html;
    };
    //Show loading icon inside element identified by 'selector'
    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src = 'images/ajax-loader.gif'></div>"
        insertHtml(selector,html)
    };

    //on page load(before images or CSS)
    document.addEventListener("DOMContentLoaded",function (event) {
        //on first load, show loading screen
        showLoading("#main-content");
    })
})(window);