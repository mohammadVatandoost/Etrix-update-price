var  request = require('request');
var cheerio = require('cheerio');
const  mongoose = require('mongoose');
const ProductModel = require('./Models/ProductModel');
const config = require('./config');
const port = config.Port;

// mongoose instance connection url connection
// mongoose.Promise = global.Promise;
// mongoose.connect(config.DBAddress, {useNewUrlParser: true})
//     .then(() => {
//         console.log("Connected");
//         getDigikey();
//    }).catch((e) => {
//         console.log("Disconnected");
//         console.log(e);
//     });
// const db = mongoose.connection;


var counter = 0 ;

function getDigikey() {
  // ICKala
 let url = "https://www.digikey.com/product-detail/en/stmicroelectronics/STM32F401VCT6/497-14048-ND/4494301";
 // console.log(url);
 request(url, function(error, response, body) {
  if(error) { console.log("Error: " + error); }
  console.log("response");
  var $ = cheerio.load(body);
  console.log(body);
  $('.breadcrumbs a').each(function( index ) {
  	console.log(index + " : "+$(this).text().trim());
  });
   // $('.ajax_block_product div.right-block').each(function( index ) {
   //   // console.log("ICKala");
   //   // console.log($(this).find('#send_request_form').length);
   //  if($(this).find('#send_request_form').length == 0) {
   //    // console.log( $('span[itemprop="price"]').prop('checked', true).val() );
   //    var tempProductName = $(this).find('.product-name').text().trim();
   //    // console.log("productName : " +tempProductName);
   //    // case insensetive
   //    tempProductName = tempProductName.toLowerCase();
   //    if( (tempProductName.includes(productSearch.toLowerCase())) ) {
   //       tempProductPrice = $(this).find('.product-price').text().trim();
   //      if(tempProductPrice != "") {
   //        var numb = tempProductPrice.match(/\d/g);
   //        numb = numb.join("");
   //        console.log(parseInt(numb)/10);
   //        console.log($(this).find('.quantityavailable_multicart2 a').text().trim());
   //        founded = true;
   //        counterFounded = counterFounded + 1 ;
   //        console.log("counterFounded");
   //        console.log(counterFounded);
   //        // find in database and update it
   //        ProductModel.findByName(data[idNumber].manufacturer_part_number).then((product) => {
   //          if (!product) {
   //             return Promise.reject();
   //          } 
   //          product.update({ unit_price: parseInt(numb)/10, 
   //            quantity_available: parseInt( $(this).find('.quantityavailable_multicart2 a').text().trim() ) 
   //          });
   //          console.log("Saved");console.log(idNumber);
   //        }).catch((e) => {
   //           console.log('reject : ' + data[idNumber].manufacturer_part_number);
   //        });
   //        // data[idNumber].unit_price = parseInt(numb)/10;
   //        // data[idNumber].quantity_available = parseInt($(this).find('.quantityavailable_multicart2 a').text().trim());
   //        // return false;
   //         // productData.push({name: tempProductName,price: parseInt(numb)});
   //      }
   //   }
   //  }
   // });
   // if (!founded) { console.log("404"); counterNotFounded = counterNotFounded + 1 ; } else {}
 });
}

getDigikey();

