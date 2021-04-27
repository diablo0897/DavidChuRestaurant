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
    const menuItemsUrl = "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
    const menuItemsTitleHtml = "snippets/menu-items-title.html"
    const menuItemHtml = "snippets/menu-item.html"

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

    //Load the menu items view
    //'categoryShort' is the short_name for a category
    dc.loadMenuItems = function (categoryShort) {
        showLoading("#main-content")
        $ajaxUtils.sendGetRequest(menuItemsUrl+categoryShort,buildAndShowMenuItemHTML);
    };

    function buildAndShowMenuItemHTML(categoryMenuItems) {
        //Load menu item title snippet first
        $ajaxUtils.sendGetRequest(menuItemsTitleHtml,function (menuItemTitleHtml) {
            //Retrieve single item snippet
            $ajaxUtils.sendGetRequest(menuItemHtml,function (menuItemHtml) {
                let menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems,menuItemsTitleHtml,menuItemHtml);
                insertHtml("#main-content",menuItemsViewHtml);
            },false);
        },false);
    }



    //Use category and menu items data and snippets html to build menu items view HTML
    function buildMenuItemsViewHtml(categoryMenuItems,menuItemsTitleHtml,menuItemHtml) {
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,"name",categoryMenuItems.category.name);
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,"special_instructions",categoryMenuItems.category.special_instructions)
        
        let finalHtml = menuItemsTitleHtml;
        finalHtml+="<section class='row'>";
        
        let menuItems = categoryMenuItems.menu_items;
        let catShortName = categoryMenuItems.category.short_name;
        function handleSingleMenuItemView(previous,item,index) {

            let html = menuItemHtml;
            html = insertProperty(html,"short_name",item.short_name);
            html = insertProperty(html,"catShortName",catShortName);
            html = insertItemPrice(html,"price_small",item.price_small);
            html = insertItemPortionName(html,"small_portion_name",item.small_portion_name);
            html = insertItemPrice(html,"price_large",item.price_large);
            html = insertItemPortionName(html,"large_protion_name",item.large_portion_name);
            html = insertProperty(html,"name",item.name);
            html = insertProperty(html,"description",item.description);

            if (index%2 != 0) {
                html += "<div class='clearfix d-lg-block'></div>"
            };


            return previous+html;

        }
        finalHtml= menuItems.reduce(handleSingleMenuItemView,finalHtml);
        console.log("this is final: "+finalHtml);
        return finalHtml;

    }
    // Appends price with '$' if price exists
    function insertItemPrice(html,
                             pricePropName,
                             priceValue) {
        // If not specified, replace with empty string
        if (!priceValue) {
            return insertProperty(html, pricePropName, "");;
        }

        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }
    // Appends portion name in parens if it exists
    function insertItemPortionName(html,
                                   portionPropName,
                                   portionValue) {
        // If not specified, return original string
        if (!portionValue) {
            return insertProperty(html, portionPropName, "");
        }

        portionValue = "(" + portionValue + ")";
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }



    global.$dc = dc;
})(window);