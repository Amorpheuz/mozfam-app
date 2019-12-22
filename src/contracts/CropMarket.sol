pragma solidity ^0.5.0;

contract CropMarket {

    struct Crop{
        address owner;
        uint256 quantity;
        uint256 price;
        uint cropId;
    }
    
    uint256 public cropCount = 1;
    mapping(uint256 => Crop) public crops;
    
    struct Transaction{
        uint256 cropId;
        address user;
        uint256 quantity;
    }
    
    uint256 public transactionId = 0;
    mapping(uint256 => Transaction) public trasanctions;
    
    struct User{
        uint256 quantity;
        address onwer;
    }
    
    uint public userCount = 1;
    mapping(address => User) public users;
    mapping(uint => User) public userAccts;
    mapping(address => bool) public checkUsers;
    
    event NewCropFromFarmer(
        uint256 indexed cropId
    );
    
    
    event NewCrop(
        uint256 indexed cropId,
        uint256 indexed quantity,
        uint256 indexed remainingQuantity
    );
    
    event NewTransaction(
        uint256 indexed cropId,
        uint256 indexed quantity,
        address indexed owner
    );
    
    function releaseStockFarmer(uint256 quantity, uint256 price) public {
        Crop memory crop = Crop(msg.sender,quantity, price,cropCount);
        crops[cropCount] = crop;
        emit NewCropFromFarmer(cropCount++);
    }
    
    function releaseStock(uint256 quantity,uint256 price) public{
        require(checkUsers[msg.sender] == true,"Not sufficient Stocks to trade");
        User storage userFromList = users[msg.sender];
        require(quantity<=userFromList.quantity,"Not sufficient quantity");
        userFromList.quantity = userFromList.quantity - quantity;
        Crop memory crop = Crop(msg.sender,quantity,price,cropCount);
        crops[cropCount] = crop;
        cropCount++;
        emit NewCrop(cropCount,quantity,userFromList.quantity);
    }
    
    function purchaseStock(uint256 cropid, uint256 quantity) public payable{
        Crop storage crop = crops[cropid];
        require(
            quantity <= crop.quantity,
            "Not enough quantity"
        );
        
        // require(
        //     msg.value == crop.price * quantity,
        //     "Not enough balance"
        // );
        
        require(msg.sender != crop.owner,"Seller cannot be buyer");
        
        _sendFunds(crop.owner, msg.value);
        refilStock(cropid, quantity);
    }
    
    function refilStock(uint256 cropid, uint256 quantity) internal {
        trasanctions[transactionId] = Transaction(cropid,msg.sender,quantity);

        if(!checkUsers[msg.sender]){
            User memory acc = User(quantity,msg.sender);
            userAccts[userCount] = acc;
            userCount++;
            users[msg.sender] = acc;
            checkUsers[msg.sender] = true;
        }else{
            User storage userFromList = users[msg.sender];
            userFromList.quantity = userFromList.quantity + quantity;
        }
        
        Crop storage crop = crops[cropid];
        crop.quantity = crop.quantity - quantity;
        
        if(checkUsers[crop.owner]){
            User storage userFromList = users[crop.owner];
            userFromList.quantity = userFromList.quantity-quantity;
            emit NewTransaction(cropid, userFromList.quantity,msg.sender);
        }
        
    }
    
    function _sendFunds(address rec, uint256 value) internal{
        address(uint160(rec)).transfer(value);
    }
    
}
