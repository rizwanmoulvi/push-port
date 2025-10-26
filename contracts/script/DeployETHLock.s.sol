// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/ETHLock.sol";

contract DeployETHLock is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        ETHLock ethLock = new ETHLock();
        
        console.log("ETHLock deployed to:", address(ethLock));
        
        vm.stopBroadcast();
    }
}