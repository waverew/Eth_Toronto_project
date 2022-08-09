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
        uint index;
        UserSubmissions[] submissions;
    }

    
    struct CompanyOrder{
        Comodity comodity;
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
        //
        users[msg.sender].index+=1;
        users[msg.sender].submissions.push(_userOrder);
    }



}