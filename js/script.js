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
    var allCatagoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html"

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

    //Return subsititue of {{propName}} with propValue in given 'string'
    var insertProperty =function (string,propName,propValue) {
        var propToReplace = "{{"+propName+"}}"
        string = string.replace(new RegExp(propToReplace,"g"),propValue);
        return string;
    }

    //on page load(before images or CSS)
    document.addEventListener("DOMContentLoaded",function (event) {
        //on first load, show loading screen
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(homeHtml,function (responseText) {
            document.querySelector("#main-content").innerHTML = responseText
        },false);
    });

    //Load the menu categories view
    dc.loadMenuCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCatagoriesUrl,buildAndShowCategoriesHTML);
        console.log(allCatagoriesUrl);
    };

    //Builds HTML for the categories page based on the data from server
    function buildAndShowCategoriesHTML(categories) {
        console.log("here")
        //Load title snippet of categories page
        $ajaxUtils.sendGetRequest(categoriesTitleHtml,function (categoriesTitleHtml) {
            //Retrieve single category snippet
            console.log(categoriesTitleHtml)
            $ajaxUtils.sendGetRequest(categoryHtml,function (categoryHtml) {
                console.log(categoryHtml)
                var categoriesViewHtml = buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml);
                insertHtml("#main-content",categoriesViewHtml)
            },false);
        },false);
    }
    function buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml){
        console.log("start building")
        var finalHtml = categoriesTitleHtml;
        finalHtml+= "<section class='row'>";
        console.log(finalHtml)

        for(var i = 0; i < categories.length;i++){
            var html = categoryHtml;
            var name = ""+ categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html,"name",name);
            html = insertProperty(html,"short_name",short_name);
            finalHtml+=html;
            console.log(finalHtml)

        }
        console.log(finalHtml)
        return finalHtml
    }



    global.$dc = dc;
})(window);