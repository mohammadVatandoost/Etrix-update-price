var  request = require('request');
var cheerio = require('cheerio');
const  mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'productsName.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'website', title: 'Website'}
    ]
});
 
// const records = [
//     {name: 'Bob',  lang: 'French, English'},
//     {name: 'Mary', lang: 'English'}
// ];




const ProductModel = require('./Models/ProductModel');
const ICKalaModel = require('./Models/ICKalaModel');
const JavanModel = require('./Models/JavanModel');
const NameConversionModel = require('./Models/NameConversionModel');
const config = require('./config');

const port = config.Port;
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DBAddress, {useNewUrlParser: true})
    .then(() => {
        console.log("Connected");
        EtrixNotHave();
   }).catch((e) => {
        console.log("Disconnected");
        console.log(e);
    });
const db = mongoose.connection;

var productCategory ;
var productId ;
var voltage ;
var package ;
var otherValue;
var productData = [];
var productPrice = 0;
var founded = false;
var counterFounded = 0;
var counterNotFounded = 0;
var ickalaCounter = 0 ;
var javanCounter = 0;
var etrixNotFounded = 0 ;

function updateICKalaPrices() {
  var urlsOfProducts = [
  "https://www.ickala.com/100-relay-contactor-parts?id_category=100&n=284",
  "https://www.ickala.com/104-lcd-segment?id_category=104&n=37",
  "https://www.ickala.com/180-ac-dc-powerpowersupply-parts?id_category=180&n=96",
  "https://www.ickala.com/143-dc-to-dc-converters?id_category=143&n=544",
  "https://www.ickala.com/333-led-components?id_category=333&n=39",
  "https://www.ickala.com/109-sensor-parts?id_category=109&n=198",
  "https://www.ickala.com/332-diode-parts?id_category=332&n=908",
  "https://www.ickala.com/513-thyristor-diac?id_category=513&n=86",
  "https://www.ickala.com/58-semiconductor-parts?id_category=58&n=1762",
  "https://www.ickala.com/95-%D8%A7%D9%BE%D8%AA%D9%88%DA%A9%D9%88%D9%BE%D9%84%D8%B1-%D9%88-%D9%81%D9%88%D8%AA%D9%88-%D8%AA%D8%B1%D8%A7%D9%86%D8%B2%DB%8C%D8%B3%D8%AA%D9%88%D8%B1?id_category=95&n=226",
  "https://www.ickala.com/86-microwave-parts?id_category=86&n=299",
  "https://www.ickala.com/678-%D9%BE%D8%AA%D8%A7%D9%86%D8%B3%DB%8C%D9%88%D9%85%D8%AA%D8%B1-%D8%AF%DB%8C%D8%AC%DB%8C%D8%AA%D8%A7%D9%84",
  "https://www.ickala.com/594-ic-comarators?id_category=594&n=43",
  "https://www.ickala.com/439-%D8%A2%DB%8C-%D8%B3%DB%8C-%D8%B4%D8%A7%D8%B1%DA%98-%D8%A8%D8%A7%D8%B7%D8%B1%DB%8C",
  "https://www.ickala.com/275-digital-isolator",
  "https://www.ickala.com/264-mosfet-driver?id_category=264&n=34",
  "https://www.ickala.com/281-ACTIVE-PASSIVE-FILTER",
  "https://www.ickala.com/258-power-switch?id_category=258&n=30",
  "https://www.ickala.com/249-transducer-converter?id_category=249&n=30",
  "https://www.ickala.com/257-mobile-ic",
  "https://www.ickala.com/141-ic-controller-driver?id_category=141&n=114",
  "https://www.ickala.com/140-audio-poweramp-components?id_category=140&n=38",
  "https://www.ickala.com/134-digital-memory?id_category=134&n=253",
  "https://www.ickala.com/81-fpga?id_category=81&n=531",
  "https://www.ickala.com/80-shift-register-parts?id_category=80&n=55",
  "https://www.ickala.com/77-pll-parts?id_category=77&n=27",
  "https://www.ickala.com/57-voltage-current-regulators?id_category=57&n=642",
  "https://www.ickala.com/56-rf-mixer-parts",
  "https://www.ickala.com/276-%D8%B4%D9%85%D8%A7%D8%B1%D9%86%D8%AF%D9%87-counter",
  "https://www.ickala.com/55-ic-timer-parts?id_category=55&n=282",
  "https://www.ickala.com/54-interfaces-ic-parts?id_category=54&n=277",
  "https://www.ickala.com/53-logic-ics-gates-inverters?id_category=53&n=1022",
  "https://www.ickala.com/52-Other-ics-parts?id_category=52&n=462",
  "https://www.ickala.com/51-display-drivers-parts?id_category=51&n=93",
  "https://www.ickala.com/269-pci-device",
  "https://www.ickala.com/50-interfaces-parts?id_category=50&n=331",
  "https://www.ickala.com/47-Multipliers-parts",
  "https://www.ickala.com/46-dac-parts?id_category=46&n=110",
  "https://www.ickala.com/45-adc-parts?id_category=45&n=179",
  "https://www.ickala.com/282-reference-voltage?id_category=282&n=63",
  "https://www.ickala.com/44-opamp?id_category=44&n=708",
    "https://www.ickala.com/191-multilayer-ceramic-smd-capacitor?id_category=191&n=390",
    "https://www.ickala.com/190-tantalium-smd-capacitor?id_category=190&n=186",
    "https://www.ickala.com/187-Aluminium-Electrolytic-Capacitor-SMD?id_category=187&n=59",
    "https://www.ickala.com/186-aluminum-electrolytic-capacitor?id_category=186&n=67",
    "https://www.ickala.com/349-%D9%85%D9%82%D8%A7%D9%88%D9%85%D8%AA-%D8%A2%D8%AC%D8%B1%DB%8C-5-%D9%88%D8%A7%D8%AA?id_category=349&n=106",
    "https://www.ickala.com/347-resistor-dip?id_category=347&n=1115",
    "https://www.ickala.com/280-resistor-smd?id_category=280&n=1462",
    "https://www.ickala.com/280-resistor-smd?id_category=280&n=1467",
     "https://www.ickala.com/449-%D8%A2%D8%B1%D8%A7%DB%8C%D9%87-%D9%85%D9%82%D8%A7%D9%88%D9%85%D8%AA-smd",
     "https://www.ickala.com/347-resistor-dip?id_category=347&n=1121",
     "https://www.ickala.com/450-%D8%A2%D8%B1%D8%A7%DB%8C%D9%87-%D9%85%D9%82%D8%A7%D9%88%D9%85%D8%AA-dip",
     "https://www.ickala.com/353-%D9%85%D9%82%D8%A7%D9%88%D9%85%D8%AA-%D8%B3%D8%B1%D8%A7%D9%85%DB%8C%DA%A9%DB%8C-%D8%AA%D9%88%D8%A7%D9%86-%D8%A8%D8%A7%D9%84%D8%A7",
     "https://www.ickala.com/144-potentiometer?id_category=144&n=67",
     "https://www.ickala.com/97-capacitor-parts?id_category=97&n=1460",
     "https://www.ickala.com/98-inductor-parts",
     "https://www.ickala.com/155-varistor-parts",
     "https://www.ickala.com/94-emi-ferrit?id_category=94&n=33",
     "https://www.ickala.com/79-crystal-parts?id_category=79&n=537",
     "https://www.ickala.com/518-transformers?id_category=518&n=128",
     "https://www.ickala.com/451-fuse-pack-all?id_category=451&n=104",
     "https://www.ickala.com/481-switch-key?id_category=481&n=69",
     "https://www.ickala.com/591-%D8%A8%D8%A7%D8%B2%D8%B1"
  ];

  var errorCounter = 0 ;
  var productUpdated = 0 ;
  var productNotUpdated = 0 ;
  var interval = 6 * 1000; // 5 seconds;
  for (var i = 0; i < urlsOfProducts.length; i++) {
   let url =  urlsOfProducts[i];
   // console.log("urlsOfProducts[i]") ;console.log(url) ;
   // delay 5 Seconds 
   setTimeout( function() {
     console.log("url") ;console.log(url) ;
    request(url, function(error, response, body) {
     if(error) { console.log("Error: " + error); errorCounter = errorCounter + 1 ;}
     console.log("fetched");
     var $ = cheerio.load(body);
     $('.ajax_block_product div.right-block').each(function( index ) {
       if($(this).find('#send_request_form').length == 0) {
          var productName = $(this).find('.product-name').text().trim();
          var tempProductName = productName;
          tempProductName = tempProductName.toLowerCase();
          // if( (tempProductName.includes(productSearch.toLowerCase())) ) {
              tempProductPrice = $(this).find('.product-price').text().trim();
            if(tempProductPrice != "") {
              founded = true;
              var Price = tempProductPrice.match(/\d/g);
              Price = Price.join("");
              Price = parseInt(parseInt(Price)/10) ;  
              var number =  $(this).find('.quantityavailable_multicart2 a').text().trim() ;
              console.log("Price :"+Price+" number : "+number);
              let tempICKalaModel = new ICKalaModel({
                manufacturer_part_number: productName,
                quantity_available: number,
                unit_price: Price
              });   
              tempICKalaModel.save().then(() => {
                  productUpdated = productUpdated + 1 ;
                  console.log("productUpdated "+productUpdated);
              }).catch((e) => {
                 console.log('Error');
                console.log(e);
              });       
             } else {
              var tempICKalaModel = new ICKalaModel({
                 manufacturer_part_number: productName,
                 quantity_available: number,
                 unit_price: Price
               });   
               tempICKalaModel.save().then(() => {
                  productNotUpdated = productNotUpdated + 1 ;
                  console.log("productNotUpdated "+productNotUpdated);
               }).catch((e) => {
                  console.log('Error');
                 console.log(e);
              });
             }
          // }
       }
     });
  });
 }, 
    interval * i, i);
 }
}


function updateJavanICPrices() {
  var errorCounter = 0 ;
  var productUpdated = 0 ;
  var productNotUpdated = 0 ;
  var interval = 6 * 1000; // 6 seconds;
  for (var i = 709; i < 921; i++) { //230 
   let url =  "http://javanelec.com/Shops/SearchProduct?productCategory=1&SpecialFilter=&sortColumn=Id&sortOrder=asc&pageNumber="+i+"&pageSize=24&filters=&searchFilter=&instock=False";
   // delay 6 Seconds 
   setTimeout( function() {
     console.log("url") ;console.log(url) ;
    request(url, function(error, response, body) {
     if(error) { console.log("Error: " + error); errorCounter = errorCounter + 1 ;console.log("errorCounter :"+errorCounter);}
     console.log("fetched");
     var $ = cheerio.load(body);
     $('.product-item-detail').each(function( index ) {
      var temp = $(this).find('.col-xs-12');
       var checkExistance = $(this).text();
       // console.log();
      console.log("************************************");
       if(checkExistance.includes("موجود")) {
          console.log("is exist");
          var productName = $(this).find('.hidden-md-down span.text-ellipsis').text().trim();
          console.log("productName");
          console.log(productName);
              var tempProductPrice = $(this).find('s').text().trim();
              tempProductPrice = tempProductPrice.replace("ریال","");//console.log(tempProductPrice);
              founded = true;
              var Price = parseInt(parseInt(tempProductPrice)/10) ;  
              console.log("Price");console.log(Price);
              var productId = $(this).find('a[title="اضافه به سبد"]').attr("onclick").replace("addToCart(","");
              productId = productId.replace(")","");
              console.log(productId);
              // must be logined
              // var urlNum = "http://javanelec.com/ShoppingCarts/Create?productId="+productId;
              

              // var number =  $(this).find('.quantityavailable_multicart2 a').text().trim() ;
              // console.log("Price :"+Price+" number : "+number);
              let tempJavanModel = new JavanModel({
                manufacturer_part_number: productName,
                quantity_available: 1,
                productId: productId,
                unit_price: Price,
                haveIt: false
              });   
              tempJavanModel.save().then(() => {
                  productUpdated = productUpdated + 1 ;
                  console.log("productUpdated "+productUpdated);
              }).catch((e) => {
                 console.log('Error');
                console.log(e);
              });       
            
         
       } else {productNotUpdated = productNotUpdated + 1 ;console.log("not exist: " + productNotUpdated);}
     });
  });
 }, 
    interval * (i-230), i);
 }
}

function updateEtrixPrices() {
  console.log("updateEtrixPrices");
  var ICKalaProducts, JavanProducts, EtrixProducts, NameConversion ;
  var counterUpdated = 0;
   //Where User is you mongoose user model
    ProductModel.find({} , (err, products) => {
        if(err) {} //do something...
        console.log("Etrix length");
        console.log(products.length);
        EtrixProducts = products ;
        ICKalaModel.find({} , (err, productsIcKala) => {
          console.log("ICKalaModel length");
          console.log(productsIcKala.length);
          ICKalaProducts = productsIcKala ;
          JavanModel.find({} , (err, productsJavan) => {
            JavanProducts = productsJavan ;
            console.log("JavanModel length");
            console.log(productsJavan.length);

            EtrixProducts.map(product => {
              var checkJavanNeed = true;
              // search in ickala products
              ICKalaProducts.map(ICKalaproduct => {
                if(product.manufacturer_part_number === ICKalaproduct.manufacturer_part_number) {
                   checkFounded = false;
                   console.log("Etrix product find in IcKala");
                   if( (product.quantity_available !== ICKalaproduct.quantity_available) || 
                    (product.unit_price !== ICKalaproduct.unit_price) ) {
                      console.log("price or number was changed");
                      ProductModel.findOneAndUpdate({'manufacturer_part_number': product.manufacturer_part_number}, 
                              {'unit_price': ICKalaproduct.unit_price, 'quantity_available': ICKalaproduct.quantity_available},  function(err, doc){
                        if (err) {console.log('reject : ' + err); }
                        counterUpdated = counterUpdated + 1 ;
                        console.log("ICKala counterUpdated :"+counterUpdated);
                        // console.log(product);
                      });
                   } else {
                      console.log("price and number does not change");
                   }
                }
              });
              // if does not find in ickala products, search in javan
              if(checkJavanNeed) {
                  JavanProducts.map(JavanProduct => {
                   if(product.manufacturer_part_number === JavanProduct.manufacturer_part_number) {
                       console.log("Etrix product find in JavanProducts");
                     if( (product.quantity_available !== JavanProduct.quantity_available) || 
                           (product.unit_price !== JavanProduct.unit_price) ) {
                         console.log("price or number was changed");
                         ProductModel.findOneAndUpdate({'manufacturer_part_number': product.manufacturer_part_number}, 
                              {'unit_price': JavanProduct.unit_price, 'quantity_available': JavanProduct.quantity_available},  function(err, doc){
                        if (err) {console.log('reject : ' + err); }
                        counterUpdated = counterUpdated + 1 ;
                        console.log("Javan counterUpdated :"+counterUpdated);
                        // console.log(product);
                      });
                     } else {
                      console.log("price and number does not change");
                     }
                   }
                 });
              }

            });

            NameConversionModel.find({} , (err, nameConversions) => {
                 nameConversions.map(nameConversion => {
                     ICKalaProducts.map(icKalaProduct => {
                          if(nameConversion.name === icKalaProduct.manufacturer_part_number) {
                            console.log("nameConversion");
                            ProductModel.findOne({'manufacturer_part_number': nameConversion.value}, function(err,obj) { 
                              if(obj !== null) {
                                console.log(obj);
                                if( (obj.quantity_available !== icKalaProduct.quantity_available) || 
                                     (obj.unit_price !== icKalaProduct.unit_price) ) {
                                  ProductModel.findOneAndUpdate({'manufacturer_part_number': nameConversion.value}, 
                                    {'unit_price': icKalaProduct.unit_price, 'quantity_available': icKalaProduct.quantity_available}, 
                                     function(err, doc) {
                                      if (err) {console.log('reject : ' + err); }
                                      counterUpdated = counterUpdated + 1 ;
                                      console.log("ICKala NameConversionModel counterUpdated :"+counterUpdated);
                                       // console.log(product);
                                  });
                                }
                              } else {console.log("nameConversion is not finded in Etrix");}
                            });
                          }
                     });
                 });
            });

          });
        });
      });
    //     products.map(product => {
    //         //Do somethign with the user
    //        ICKalaModel.findByName(product.manufacturer_part_number).then((prodctIckala) => {
    //         if(prodctIckala != null) {
    //           ickalaCounter = ickalaCounter + 1 ;
    //           console.log('ICKala founded: '+ickalaCounter);
    //           console.log(prodctIckala);
    //           product.update({quantity_available: prodctIckala.quantity_available, unit_price: prodctIckala.unit_price});
    //         } else {
    //           JavanModel.findByName(product.manufacturer_part_number).then((productJavan) => {
    //             if(productJavan != null) {
    //               javanCounter = javanCounter + 1 ;
    //               console.log('JavaElec founded: '+javanCounter);
    //               product.update({quantity_available: productJavan.quantity_available, unit_price: productJavan.unit_price});
    //             } else {
    //               etrixNotFounded = etrixNotFounded + 1;
    //               console.log('Etrix founded: '+etrixNotFounded);
    //             }
    //           }).catch((e) => {
    //              console.log('Javan not founded: '+e);
    //           });
    //         }
    //        }).catch((e) => {
    //          console.log('ICKala not founded: '+e);
    //        });
    //     });
    // });
}

function checkEtrixDataBase() {
  console.log("checkEtrixDataBase");
  ProductModel.find({} , (err, products) => {
        if(err){} //do something... STM32F407ZGT6
        console.log("Etrix length:"+products.length);
        var  counterIsexist = 0;
        

        // 1351 in ICKala
       ICKalaModel.find({} , (err, ICKalaProducts) => {
          console.log("ICKalaProducts length:"+ICKalaProducts.length);
          products.map(product => {
            ICKalaProducts.map(ICKalaProduct => {
              if(product.manufacturer_part_number === ICKalaProduct.manufacturer_part_number) {
                counterIsexist = counterIsexist + 1 ;
                console.log("counterIsexist:"+counterIsexist);
                return null ;
              }
            });
          });
        });
       // 615 in Javan
       JavanModel.find({} , (err, JavanProducts) => {
          console.log("JavanProducts length:"+JavanProducts.length);
          products.map(product => {
            JavanProducts.map(JavanProduct => {
              if(product.manufacturer_part_number === JavanProduct.manufacturer_part_number) {
                counterIsexist = counterIsexist + 1 ;
                console.log("counterIsexist:"+counterIsexist);
                return null ;
              }
            });
          });
        });
        
        // var testNum = 5801 ;
        // console.log(products[testNum].manufacturer_part_number);
        // ICKalaModel.findByName(products[testNum].manufacturer_part_number).then((prodctIckala) => {
        //   if(prodctIckala != null) {
        //     console.log("prodctIckala");
        //     console.log(prodctIckala);
        //   } else {
        //     console.log("ICkala do not find product");
        //   }
          
        // }).catch((e) => {
        //      console.log('ICKala not founded: '+e);
        // });
        // var counter = 0;
        // products.map(product => {
        //   ICKalaModel.findByName(product.manufacturer_part_number).then((prodctIckala) => {
        //   if(prodctIckala != null) {
        //     counter = counter + 1;
        //     console.log("prodctIckala counter:" + counter);
        //     console.log(prodctIckala);
        //   } else {
        //     console.log("ICkala do not find product");
        //   }
        // }).catch((e) => {
        //      console.log('ICKala not founded: '+e);
        // });
        //   // if(product.manufacturer_part_number === "STM32F407ZGT6") {
        //   //   console.log("founded :"+ counter);
        //   //   console.log(product);
        //   // }
        //   // counter = counter + 1;
        // });
        // console.log("founded counter:"+counter);
  });
   // //Where User is you mongoose user model
   //  ProductModel.find({ unit_price: { $ne: "0" } } , (err, products) => {
   //      if(err) //do something...
   //       console.log("founded");
   //       console.log("length:"+products.length);
   //  });
}

function importCommonDataToDB() {
  var commons = require('E:/Work/EE/Code/UpdatePrice/JsonFile/commons.json');
  console.log("commons");
  console.log(commons[2].data.length);
  var data = commons[2].data;
  var counterDataSaved = 0 ;
  //write to data base
  for(var i=0; i< data.length; i++ ) {
   let newProductModel = new ProductModel(data[i]);
   newProductModel.save().then(() => {
         counterDataSaved = counterDataSaved + 1 ;
    }).catch((e) => {
        console.log("********************");
        console.log(e);
    });
  }
}

function importNameConversionData() {
  var commons = require('E:/Work/EE/Code/UpdatePrice/JsonFile/re_caps.json');
  console.log("importNameConversionData");
  console.log(commons[2].data.length);
  var data = commons[2].data;
  var counterDataSaved = 0 ;
  //write to data base
  for(var i=0; i< data.length; i++ ) {
   let newProductModel = new NameConversionModel(data[i]);
   newProductModel.save().then(() => {
         counterDataSaved = counterDataSaved + 1 ;
         console.log("counterDataSaved :"+counterDataSaved);
    }).catch((e) => {
        console.log("********************");
        console.log(e);
    });
  }
}

function EtrixNotHave() {
  console.log("EtrixNotHave");
  // just check ICKala
  var ICKalaProducts, JavanProducts, EtrixProducts, NameConversion ;
  var counterUpdated = 0;
  var counterNotHave = 0;
  const productsNotFound = [];
   //Where User is you mongoose user model
    ProductModel.find({} , (err, products) => {
        if(err) {} //do something...
        console.log("Etrix length");
        console.log(products.length);
        EtrixProducts = products ;
        ICKalaModel.find({} , (err, productsIcKala) => {
          console.log("ICKalaModel length");
          console.log(productsIcKala.length);
          ICKalaProducts = productsIcKala ;
          JavanModel.find({} , (err, productsJavan) => {
            JavanProducts = productsJavan ;
            console.log("JavanModel length");
            console.log(productsJavan.length);
              // search in ickala products
            ICKalaProducts.map(ICKalaproduct => {
               var notFound = true;
               EtrixProducts.map(product => {
                if(product.manufacturer_part_number === ICKalaproduct.manufacturer_part_number) {
                   notFound = false;
                }
               });
               if(notFound) {
                 console.log(ICKalaproduct.manufacturer_part_number);
                 counterNotHave = counterNotHave + 1;
                 productsNotFound.push({name: ICKalaproduct.manufacturer_part_number,  website: 'ICKala'});
                 console.log(counterNotHave);
               }
              // if does not find in ickala products, search in javan
              // if(checkJavanNeed) {
              //     JavanProducts.map(JavanProduct => {
              //      if(product.manufacturer_part_number === JavanProduct.manufacturer_part_number) {
              //          console.log("Etrix product find in JavanProducts");
              //        if( (product.quantity_available !== JavanProduct.quantity_available) || 
              //              (product.unit_price !== JavanProduct.unit_price) ) {
              //            console.log("price or number was changed");
              //            ProductModel.findOneAndUpdate({'manufacturer_part_number': product.manufacturer_part_number}, 
              //                 {'unit_price': JavanProduct.unit_price, 'quantity_available': JavanProduct.quantity_available},  function(err, doc){
              //           if (err) {console.log('reject : ' + err); }
              //           counterUpdated = counterUpdated + 1 ;
              //           console.log("Javan counterUpdated :"+counterUpdated);
              //           // console.log(product);
              //         });
              //        } else {
              //         console.log("price and number does not change");
              //        }
              //      }
              //    });
              // }

            });
            csvWriter.writeRecords(productsNotFound)       // returns a promise
              .then(() => {
                   console.log('CSV stored');
               });
          });
        });
      });
}

// updateEtrixPrices();

// function getICKalaProducts(url) {
//  request(url, function(error, response, body) {
//   if(error) { console.log("Error: " + error); }
//   // console.log("fetched");
//   counterReceived = counterReceived + 1 ;
//   var $ = cheerio.load(body);
//   $('.ajax_block_product div.right-block').each(function( index ) {
//     if($(this).find('#send_request_form').length == 0) {
//       var tempProductName = $(this).find('.product-name').text().trim();
//       tempProductName = tempProductName.toLowerCase();
//       if( (tempProductName.includes(productSearch.toLowerCase())) ) {
//          tempProductPrice = $(this).find('.product-price').text().trim();
//         if(tempProductPrice != "") {
//           var numb = tempProductPrice.match(/\d/g);
//           numb = numb.join("");
//           console.log(parseInt(numb)/10);
//           console.log($(this).find('.quantityavailable_multicart2 a').text().trim());
//           founded = true;
//           counterFounded = counterFounded + 1 ;
//           console.log("counterFounded");
//           console.log(counterFounded);
//           // find in database and update it
//           ProductModel.findByName(data[idNumber].manufacturer_part_number).then((product) => {
//             if (!product) {
//                return Promise.reject();
//             } 
//             product.update({ unit_price: parseInt(numb)/10, 
//               quantity_available: parseInt( $(this).find('.quantityavailable_multicart2 a').text().trim() ) 
//             });
//             console.log("Saved");console.log(idNumber);
//           }).catch((e) => {
//              console.log('reject : ' + data[idNumber].manufacturer_part_number);
//           });
//           // data[idNumber].unit_price = parseInt(numb)/10;
//           // data[idNumber].quantity_available = parseInt($(this).find('.quantityavailable_multicart2 a').text().trim());
//           // return false;
//            // productData.push({name: tempProductName,price: parseInt(numb)});
//         }
//      }
//     }
//    });
//    if (!founded) { console.log("404"); counterNotFounded = counterNotFounded + 1 ; } else {}
//  });
// }


// var counterReceived = 0;
//     // console.log(data[0]);
// var interval = 1 * 1000; // 1 seconds;
// for(var i=0; i< data.length; i++ ) {
//   setTimeout( function(i) { 
//     // console.log(data[i]);
  //   getIckala(data[i].manufacturer_part_number , i) 
  // }, 
  //   interval * i, i);
//   while( (i-counterReceived) > 10);
// }



// function getIckala(productSearch, idNumber) {
//   // ICKala
//  let url = "https://www.ickala.com/search?controller=search&orderby=position&orderway=desc&search_query="+productSearch;
//  // console.log(url);
//  request(url, function(error, response, body) {
//   if(error) { console.log("Error: " + error); }
//   // console.log("Status code: " + response.statusCode);
//   // console.log("fetched");
//   counterReceived = counterReceived + 1 ;
//   var $ = cheerio.load(body);
//    $('.ajax_block_product div.right-block').each(function( index ) {
//      // console.log("ICKala");
//      // console.log($(this).find('#send_request_form').length);
//     if($(this).find('#send_request_form').length == 0) {
//       // console.log( $('span[itemprop="price"]').prop('checked', true).val() );
//       var tempProductName = $(this).find('.product-name').text().trim();
//       // console.log("productName : " +tempProductName);
//       // case insensetive
//       tempProductName = tempProductName.toLowerCase();
//       if( (tempProductName.includes(productSearch.toLowerCase())) ) {
//          tempProductPrice = $(this).find('.product-price').text().trim();
//         if(tempProductPrice != "") {
//           var numb = tempProductPrice.match(/\d/g);
//           numb = numb.join("");
//           console.log(parseInt(numb)/10);
//           console.log($(this).find('.quantityavailable_multicart2 a').text().trim());
//           founded = true;
//           counterFounded = counterFounded + 1 ;
//           console.log("counterFounded");
//           console.log(counterFounded);
//           // find in database and update it
//           ProductModel.findByName(data[idNumber].manufacturer_part_number).then((product) => {
//             if (!product) {
//                return Promise.reject();
//             } 
//             product.update({ unit_price: parseInt(numb)/10, 
//               quantity_available: parseInt( $(this).find('.quantityavailable_multicart2 a').text().trim() ) 
//             });
//             console.log("Saved");console.log(idNumber);
//           }).catch((e) => {
//              console.log('reject : ' + data[idNumber].manufacturer_part_number);
//           });
//           // data[idNumber].unit_price = parseInt(numb)/10;
//           // data[idNumber].quantity_available = parseInt($(this).find('.quantityavailable_multicart2 a').text().trim());
//           // return false;
//            // productData.push({name: tempProductName,price: parseInt(numb)});
//         }
//      }
//     }
//    });
//    if (!founded) { console.log("404"); counterNotFounded = counterNotFounded + 1 ; } else {}
//  });
// }

