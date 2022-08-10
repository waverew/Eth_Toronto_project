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

var userData;
var itemListData;
var customerAddressData;



//middlewares
// app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

//user sets the list of items 
//userName -
app.post('/setUserData', (req, res) => {
  userData = JSON.parse(JSON.stringify(req.body));
  // const userName = req.body.userName;
  const walletId = req.body.walletId;
  const userDataRef = ref.child("userData/" + walletId);
  userDataRef.set({
    userName: userData.userName,
    itemName: userData.itemName,
    streetName: userData.streetName,
    areaCode: userData.areaCode,
    streetNumber: userData.streetNumber
  });
  res.sendStatus(200);



});
//get the list of items user had set
/*app.get('/getUserData', async (req,res) =>{
const walletId = req.body.walletId;
const userName = req.body.userName;
var refPath;
//get specific user data
if(walletId !== undefined && userName !== undefined){

}
});*/
//company sets the list of items
//companyName -> ItemName -> details
app.post('/setItemListData', (req, res) => {
  // console.log("1");
  // console.log(req.body.itemName);
  // console.log(req.json);
  itemListData = JSON.parse(JSON.stringify(req.body));

  const companyName = itemListData.companyName;
  const itemName = itemListData.itemName;
  const areaCode = itemListData.areaCode;
  const orderId = itemListData.orderId;
  const itemNameRef = ref.child("companyData/" + companyName + "/" + itemName + "/" + areaCode + "/" + orderId);
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
    // orderId: itemListData.orderId,
  });
  res.sendStatus(200);
});

//get the list of items that company has put
app.get('/getItemListData', (req, res) => {
  const companyName = req.body.companyName;
  const itemName = req.body.itemName;
  const areaCode = req.body.areaCode;
  const orderId = req.body.orderId;
  var refPath = "companyData";

  if (companyName != undefined) {
    if (itemName != undefined) {
      if (areaCode != undefined) {
        if (orderId != undefined) {
          refPath += "/" + companyName + "/" + itemName + "/" + areaCode + "/" + orderId;
        }
        else {
          refPath += "/" + companyName + "/" + itemName + "/" + areaCode;
        }
      }
      else {
        refPath += "/" + companyName + "/" + itemName;
      }
    }
    else {
      refPath += "/" + companyName;
    }
  }
  ref.child(refPath).once('value')
    .then(function (snapshot) {
      console.log(snapshot.val())
      res.send(snapshot.val());
    });

  // console.log(itemListRes);
  // res.send(itemListRes);
});

app.post('/setUserOrderData', (req, res) => {
  userOrderData = JSON.parse(JSON.stringify(req.body));

  const userId = userOrderData.userId;
  const orderId = userOrderData.orderId;

  const userOrderDataRef = ref.child("userOrderData/" + userId + "/" + orderId);

  userOrderDataRef.set({
    creationDate: userOrderData.creationDate,
    weight: userOrderData.weight,
    status: userOrderData.status,
    companyName: userOrderData.companyName,
    rewards: userOrderData.rewards,
    itemName: userOrderData.itemName,
  });

  res.sendStatus(200);
});

app.get('/getAddressData', (req, res) => {
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

app.listen(3000, () => {
  console.log(`App is running on port 3000`);
});
