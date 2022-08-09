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

    function addComodityForSubmission(bytes32 _id, Comodity memory _comodity) public {
        companies[msg.sender].ordersArray.push(_id);
        companies[msg.sender].orders[_id].comodity = _comodity;
        companies[msg.sender].ordersCounter+=1;
    }

    function addUserSubmission(address _company, bytes32 _id, UserSubmissions memory _userOrder) public {
        companies[_company].orders[_id].submissionsCounter+=1;
        uint counter = companies[_company].orders[_id].submissionsCounter;
        _userOrder.index = counter;
        companies[_company].orders[_id].userSubmissionTracking[counter] = _userOrder;
        uint soldAmount = _userOrder.comodityValues.amount*_userOrder.comodityValues.price;
        companies[_company].orders[_id].sold+=soldAmount;
        users[msg.sender].index+=1;
        users[msg.sender].earning+=soldAmount;
        users[msg.sender].submissions.push(_userOrder);
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