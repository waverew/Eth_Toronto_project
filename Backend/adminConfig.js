const express = require("express")
const admin = require("firebase-admin");
const cors = require('cors');
const serviceAccount = require("./serviceAccountKey.json");

const bodyParser = require('body-parser');

var app = express();

var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

app.use(cors(corsOptions));



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zerowastehackathon-default-rtdb.firebaseio.com"
});


const db = admin.database();
const ref = db.ref('/server/saving-data/fireblog');

// const itemListRef = ref.child('itemList');
const customerAddressRef = ref.child('customerAddress');

var itemListData;
var customerAddressData;



//middlewares
// app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

//company sets the list of items
//companyName -> ItemName -> details
app.post('/setItemListData', (req,res) => {
  // console.log("1");
  // console.log(req.body.itemName);
  // console.log(req.json);
  itemListData = JSON.parse(JSON.stringify(req.body));

  const companyName = req.body.companyName;
  const itemName = req.body.itemName;
  const areaCode = req.body.areaCode;
  const itemNameRef = ref.child("companyData/" + companyName + "/" + itemName + "/" + areaCode);
  // console.log("2");
  // console.log(itemListData);
  itemNameRef.set({
    // itemName: itemListData.itemName,
    sellingPricePerKg: itemListData.sellingPricePerKg,
    // areaCode: itemListData.areaCode,
    pickupTimeFrom: itemListData.pickupTimeFrom,
    pickupTimeTo: itemListData.pickupTimeTo,
    days: itemListData.days,  //[0,1,2,3,4,5,6] = [S,M,T,W,T,F,S]
    timestampFrom: itemListData.timestampFrom,
    timestampTo: itemListData.timestampTo,
  });
  res.sendStatus(200);
});

//get the list of items that company has put
app.get('/getItemListData', async (req,res) => {
  const companyName = req.body.companyName;
  const itemName = req.body.itemName;
  const areaCode = req.body.areaCode;
  var refPath = "companyData";

  if(companyName != undefined){
    if(itemName != undefined){
      if(areaCode != undefined){
        refPath += "/" + companyName + "/" + itemName + "/" + areaCode;       
      }
      else {
        refPath += "/" + companyName + "/" + itemName;
      }
    }
    else{
      refPath += "/" + companyName;
    }
  }
  ref.child(refPath).once('value')
    .then(function(snapshot) {
      console.log( snapshot.val() )
      res.send(snapshot.val());
  });
  
  // console.log(itemListRes);
  // res.send(itemListRes);
});



app.get('/getAddressData', (req,res) => {
  customerAddressData = JSON.parse(req.body);
  
  
customerAddressRef.set({
  addressId: customerAddressData.addressId,
  address: customerAddressData.address,
  state: customerAddressData.state,
  city: customerAddressData.city,
  country: customerAddressData.country,
  pincode: customerAddressData.pincode,
});

console.log(customerAddressData);
});

app.listen(3000,() => {
  console.log(`App is running on port 3000`);
});
