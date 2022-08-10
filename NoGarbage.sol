// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract NoGarbage{
    struct Comodity{
        uint amount;
        string typeOfComodity;
        uint price;
    }

    struct UserSubmissions{
        uint index;
        address user;
        Comodity comodityValues;
    }

    struct Users{
        address user;
        string zipCode;
        uint earning;
        uint index;
        UserSubmissions[] submissions;
    }

    
    struct CompanyOrder{
        Comodity comodity;
        uint sold;
        uint submissionsCounter;
        mapping(uint=>UserSubmissions) userSubmissionTracking;
    }

    struct Company{
        address company;
        string zipCode;
        uint ordersCounter;
        bytes32[] ordersArray;
        mapping(bytes32=>CompanyOrder) orders;
    }


    mapping(address=>Users) users;
    mapping(address=>Company) companies;

    function register(bool _isCompany, string memory _zipCode) public {
        if(_isCompany){
            companies[msg.sender].company = msg.sender; 
            companies[msg.sender].zipCode = _zipCode;
        }
        else{
            users[msg.sender].user = msg.sender; 
            users[msg.sender].zipCode = _zipCode; 
        }
    }

    function addComodityForSubmission(bytes32 _id, uint _price, uint _amount, string memory _typeOfComodity) public {
        companies[msg.sender].ordersArray.push(_id);
        companies[msg.sender].orders[_id].comodity.price = _price;
        companies[msg.sender].orders[_id].comodity.amount =_amount;
        companies[msg.sender].orders[_id].comodity.typeOfComodity =_typeOfComodity;
        companies[msg.sender].ordersCounter+=1;
    }

    function addUserSubmission(address _company, bytes32 _id,uint _price, uint _amount, string memory _typeOfCommodity) public {
        companies[_company].orders[_id].submissionsCounter+=1;
        uint counter = companies[_company].orders[_id].submissionsCounter;
        companies[_company].orders[_id].userSubmissionTracking[counter].index = counter;
        companies[_company].orders[_id].userSubmissionTracking[counter].user = msg.sender;
        companies[_company].orders[_id].userSubmissionTracking[counter].comodityValues.amount = _amount;
        companies[_company].orders[_id].userSubmissionTracking[counter].comodityValues.typeOfComodity = _typeOfCommodity;
        companies[_company].orders[_id].userSubmissionTracking[counter].comodityValues.price = _price;
        uint soldAmount = _amount*_price;
        companies[_company].orders[_id].sold+=soldAmount;
        users[msg.sender].index+=1;
        users[msg.sender].earning+=soldAmount;
    }

    function payBill(bytes32 orderId) public payable {
        require(msg.value>=companies[msg.sender].orders[orderId].sold);
    }

    function claimEarnings(uint amount) public payable{
        require(address(this).balance>=amount,"Funds Not Avialable");
        require(amount<=users[msg.sender].earning,"Amount claimed is more than earnings");
        payable(msg.sender).transfer(amount);
    }
}