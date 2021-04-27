(function (global) {
    //set up namespace for this utility
    var ajaxUtils = {}

    // Returns an HTTP request object
    function getRequestObject(){
        if (window.XMLHttpRequest){
            return (new XMLHttpRequest());
        }
        else if(window.ActiveXObject){
            //for very old IE browsers
            return (new ActiveXObject("Microsoft.XMLHTTP"));
        }
        else{
            global.alert("ajax is not supported");
            return (null);
        }
    }

    //make an Ajax GET request to 'requestUrl'
    ajaxUtils.sendGetRequest = function (requestUrl,responseHandler,isJsonResponse) {
        var request = getRequestObject();
        request.onreadystatechange = function () { //when the server is responsed call this function to handle it

            handleResponse(request,responseHandler,isJsonResponse);
        };

        request.open("GET",requestUrl,true);

        request.send(null);//for POST request body
    }
    //Only calls user provided 'responseHandler' function if response is ready and not an error
    function handleResponse(request,responseHandler,isJsonResponse){

        if ((request.readyState===4)&&(request.status===200)){

            //Default to isJsonResponse = true
            if(isJsonResponse === undefined){

                isJsonResponse = true;
            }
            if(isJsonResponse){

                responseHandler(JSON.parse(request.responseText))
            }else{

                responseHandler(request.responseText)
            }
        }
    }
    global.$ajaxUtils = ajaxUtils;


})(window);