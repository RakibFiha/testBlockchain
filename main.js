// // pre-requisite
// need to have node js installed in the machine
// need to have crypto js installed as sha 256 algorithm
// to implement pow need sha 256 or some other algoteithm within JS
// to install crypto js try this follwoing script
// npm install --save crypto-js

const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    // this is the block
    // this class defines what is a block
    // each block will have index: index tells us where the block sits on the chain
    // index is optional
    // timestamp tells us when the block is created; this one is essential
    // data tells us the details of the transaction; 
    // data: how much money was trasferred and who was the sender or receiver
    // previousHash: is a string that contains the hash of the block before this one
    // previousHash: this is very important, it ensures the integrity of our blockchain
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
    // hash property allows us to calculate the hash of the block
    // so we need to calculate it
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    // this is how this.hash is calculated.
    // sha256 is not in the JS module so we need to import it using npm
    // install npm by running the following in the terminal
    // npm install --save crypto-js
    // then at the beginning import sha256 as mentioned by typing the following:
    // const SHA256 = require('crypto-js/sha256');

// Implementing proof of work
// right now we can create a  new block very quickly
// implementing POW is must

    calculateHash(){
        // this function here calculate the hash
        // so when we need to calculate the hash we pass in the following information
        // to calculate the hash
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // mine block
    // inside the block we want the hash of the block to start with certain number of 0
    // 0 , difficulty as long as that part of the hash is not equal to all 0
    // new array difficulty+ 1 and join it with 0
    // hash of the block will not change as it is an endless loop
    // thus we need nonce
    // this is a random number starts from 0
    // thus add the nonce everywhere as before
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty +1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        // this is the new class for the blockchain
        // constructor is resposible to initialise the blockchain
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        // this would be the array of block
        // first block is called the genesisblock
        this.pendingTransactions = [1];
        this.miningReward = 100;

    }

    // here is how the genesis block is created
    // so the block have the following information
    // Block(index,'timestamp','data','previousHash' )
    createGenesisBlock(){
        return new Block("01/01/2018", "Genesis block", "0");
    }

    // getLatestBlock method is really simple
    // it returns the latest block in the chain
    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    // this is responsible to add new block to the chain
    // but first it needs to do some work to push it to the array
    // first thing it needs to do, it needs to set the previous hash 
    // property of the new block and it needs to set this to last block of the chain

    mingePendingTransations(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined:');
        this.chain.push(block);
        
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceofAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;

    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // everytime we change any of the property of the block, the hash function
    //     // needs to change as well
    //     newBlock.mineBlock(this.difficulty);
    //     // newBlock.hash = newBlock.calculateHash();
    //     // this will push it to the chain
    //     // in reality we cannot push it so easily
    //     // but this is just a test
    //     this.chain.push(newBlock);
    // }    

    isChainValid(){
        // this one will see if the block is valid
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
        
        // if the current hash of the block matches with the previous hash of the block
        // if the hash of the current block is valid
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
        // if the block points to correct previous block
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}


let rakibitCoin = new Blockchain();

// // console.log('Mining block 1....')
// // rakibitCoin.addBlock(new Block(1, "31/07/2018", {amount: 4}));

// // console.log('Mining block 2....')
// // rakibitCoin.addBlock(new Block(2, "01/08/2018", {amount: 8}));

// // console.log('Is Blockchain valid? ' + rakibitCoin.isChainValid());

// // rakibitCoin.chain[1].data = {amount: 100};
// // rakibitCoin.chain[1].hash = rakibitCoin.chain[1].calculateHash();
// // console.log('Is Blockchain valid? ' + rakibitCoin.isChainValid());

// // null, 4 is used to make it more readable
// // console.log(JSON.stringify(rakibitCoin, null, 4));

rakibitCoin.createTransaction(new Transaction('address1', 'address2', 100));
rakibitCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
rakibitCoin.mingePendingTransations('rakib\'s address');

console.log('\n Balance of Rakib is', rakibitCoin.getBalanceofAddress('rakib\'s address'));

console.log('\n Starting the miner again...');
rakibitCoin.mingePendingTransations('rakib\'s address');

console.log('\n Balance of Rakib is', rakibitCoin.getBalanceofAddress('rakib\'s address'));
