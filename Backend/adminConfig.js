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
app.get('/getUserData', async (req,res) =>{
const walletId = req.body.walletId;
var refPath = "userData";
//get specific user data
if(walletId != undefined){
    refPath += "/" + walletId;

}
ref.child(refPath).once('value')
    .then(function(snapshot) {
      console.log( snapshot.val() )
      res.send(snapshot.val());
  });

});
//company sets the list of items
//companyName -> ItemName -> details
app.post('/setCompanyItemList', (req, res) => {
  // console.log("1");
  // console.log(req.body.itemName);
  // console.log(req.json);
  itemListData = JSON.parse(JSON.stringify(req.body));

  const companyName = itemListData.companyName;
  const itemName = itemListData.itemName;
  const areaCode = itemListData.areaCode;
  const orderId = itemListData.orderId;
  const campaignDays = itemListData.campaignDays;
  const companyAddress = itemListData.companyAddress;
  const _timestampFrom = new Date(Date.now());
  const _timestampTo = new Date(_timestampFrom);
  _timestampTo.setDate(_timestampTo.getDate() + Number( campaignDays));
  const itemNameRef = ref.child("companyData/" + companyName + "/" + itemName + "/" + areaCode + "/" + orderId);
  itemNameRef.set({
    // itemName: itemListData.itemName,
    sellingPricePerKg: itemListData.sellingPricePerKg,
    // areaCode: itemListData.areaCode,
    pickupTimeFrom: itemListData.pickupTimeFrom,
    pickupTimeTo: itemListData.pickupTimeTo,
    days: itemListData.days,  //[0,1,2,3,4,5,6] = [S,M,T,W,T,F,S]
    timestampFrom: _timestampFrom.toDateString(),
    timestampTo: _timestampTo.toDateString(),
    companyAddress:companyAddress,
    // orderId: itemListData.orderId,
  });

  res.sendStatus(200);
});

//get the list of items that company has put
app.post('/getCompanyItemList', (req, res) => {
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

app.post('/getClamableAmount', async (req, res)=>{
  var userId = req.body.userId;
  const total = await (await ref.child("users/"+userId+'/total').get()).val()
  console.log(total)
  res.send({amount:total})
})

app.post('/userSubmission', async (req, res) => {
  const price = req.body.price;
  const amount = req.body.amount;
  var userId = req.body.userId;
  userId = userId.replaceAll(".","_")
  const orderId = req.body.orderId;
  var companyId = req.body.companyId;
  companyId = companyId.replaceAll(".","_")
  await ref.child("userOrders/"+userId+"/").push({"orderId":orderId,"comapny":companyId, "price":price, "amount":amount})
  console.log("updating")
  const total =   (await ref.child("users/"+userId+'/total').get())
  
  if(total===undefined){
    await ref.child("users/"+userId+'/total').set((Number(amount)*Number(price)))
  }
  else if(total===null){
    await ref.child("users/"+userId+'/total').set(Number(amount)*Number(price))
  }
  else{
    const t = total.val()
    await ref.child("users/"+userId+'/total').set(Number(t)+(Number(amount)*Number(price)))
  }

  const companyTotal = await ref.child("companyOrders/"+companyId+"/due").get()
  if(companyTotal===undefined){
    await ref.child("companyOrders/"+companyId+"/due").set(Number(amount)*Number(price))
  }
  else if(companyTotal===null){
    await ref.child("companyOrders/"+companyId+"/due").set(Number(amount)*Number(price))
  }
  else{
    const t = companyTotal.val()
    await ref.child("companyOrders/"+companyId+"/due").set(Number(t)+Number(amount*price))
  }
  res.sendStatus(200)
  });

  
  
app.post('/payBalance', async(req,res)=>{
  const amount = req.body.amount;
  const companyId = req.body.companyId;
  const total = (await (await ref.child("companyOrders/"+companyId+"/due").get()).val())
  await ref.child("companyOrders/"+companyId+"/due").set(Number(total)-Number(amount))
  res.sendStatus(200)
})

app.post('/claimEarning', async(req,res)=>{
  const amount = req.body.amount;
  const userId = req.body.userId;
  const total = await (await ref.child("users/"+userId+'/total').get()).val()
  await ref.child("users/"+userId+"/total").set(Number(total)-Number(amount))
  const returnVal = Number(total)-Number(amount)
  res.send({amount:returnVal})

})

app.post('/getCompanyItemListPerAreaCode', (req, res) => {
  const itemName = req.body.itemName;
  const areaCode = req.body.areaCode;
  ref.child("companyData").once('value')
    .then(function (snapshot) {

      const result = JSON.parse(JSON.stringify(snapshot.val()));
      
      var order = new Array();
      for(var company in result){
        var obj1 = result[company];
        for(var item in obj1){
          if(item == itemName){
            var obj2 = obj1[itemName];
            for(var area in obj2){
              if(area == areaCode){
                var obj = {};
                obj[company] = result[company];
                
                order.push(obj);
              }             
            }
          }
        }
      }
      console.log(JSON.stringify(order));
      res.send(order);
    });
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
