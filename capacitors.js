var  request = require('request');
var cheerio = require('cheerio');

var productSearch ;
var voltage ;
var package ;
var productData = [];
var productPrice = 0;
var founded = false;
console.log("start");
process.argv.forEach(function (val, index, array) {
  if(index == 2) { 
    productSearch  = val ;
    if(productSearch.includes("/")) {
      productSearch = productSearch.split("/")[0];
    }
  }
  if(index == 3) { voltage  = val }
  if(index == 4) { package  = val }
});

// // ***********************************
// ICKala
request("https://www.ickala.com/search?controller=search&orderby=position&orderway=desc&search_query="+productSearch, function(error, response, body) {
  if(error) { console.log("Error: " + error); }
  // console.log("Status code: " + response.statusCode);
  var $ = cheerio.load(body);
//*[@id="center_column"]/ul/li/div/div[3]/div[2]/span[2]
  $('.ajax_block_product div.right-block').each(function( index ) {
    console.log("ICKala");
    console.log($(this).find('#send_request_form').length);
   if($(this).find('#send_request_form').length == 0) {
     // console.log( $('span[itemprop="price"]').prop('checked', true).val() );
     var tempProductName = $(this).find('.product-name').text().trim();
     // console.log("productName : " +tempProductName);
     // case insensetive
     tempProductName = tempProductName.toLowerCase();
     if( (tempProductName.includes(productSearch.toLowerCase())) ) {
        tempProductPrice = $(this).find('.product-price').text().trim();
       if(tempProductPrice != "") {
         var numb = tempProductPrice.match(/\d/g);
         numb = numb.join("");
         console.log("ICKala productPrice accebtable : " + numb);
         console.log("ICKala number : "+$(this).find('.quantityavailable_multicart2 a').text().trim());
         founded = true;
         return false;
          productData.push({name: tempProductName,price: parseInt(numb)});
       }
    }
   }
  });
  if (!founded) { console.log("not found") } else {console.log("founded")}
});
