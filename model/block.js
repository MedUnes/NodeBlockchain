// Import MySQL connection (should be already connected and ready to use)
const connection = require("../config/db");

// Import SHA256 (hash.js) module
const hash = require("hash.js");

class Block {
    // A polymorphic constructor depending on the obj.hash existance
    constructor(obj) {
    	if (typeof obj.id !== "undefined") {
    		this.id = obj.id;
    	}
    	if (typeof obj.timestamp !== "undefined") {
    		this.timestamp = obj.timestamp;
    	}
    	if (typeof obj.data !== "undefined") {
    		this.data = obj.data;
    	}
    	if (typeof obj.previousHash !== "undefined") {
    		this.previousHash = obj.previousHash;
    	}
            // If a hash (objected extracted from DB) is provided
            if (typeof obj.hash !== "undefined") {
            	this.hash = obj.hash;
                // New block without a hash? let's fill it in.
            } else {
            	this.hash = this.doHash();
            }
        }
        // Getters
        get id() {
        	return this._id;
        }
        get timestamp() {
        	return this._timestamp;
        }
        get data() {
        	return this._data;
        }
        get hash() {
        	return this._hash;
        }
        // Setters
        // Since the ID is under a DB-generated mechanism (AUTO_INCREMENT), we shall set it!
        set id(val) {
        	this._id = val;
        	return this;
        }
        get previousHash() {
        	return this._previousHash;
        }
        set timestamp(val) {
        	this._timestamp = val;
        	return this;
        }
        set data(val) {
        	this._data = val;
        	return this;
        }
        set hash(val) {
        	this._hash = val;
        	return this;
        }
        set previousHash(val) {
        	this._previousHash = val;
        	return this;
        }
        // Watch out the order!
        toArray() {
        	return [this._id, this._timestamp, this._data, this._hash, this._previousHash];
        }
        toString() {
        	return JSON.stringify(this);
        }
        doHash() {
        // The hash requires all its bricks to be set.
        if (typeof this._id === "undefined" ||
        	typeof this._timestamp === "undefined" ||
        	typeof this._data === "undefined" ||
        	typeof this._previousHash === "undefined")
        	return undefined;

        // See hash.js documentation on generating SHA256 hashes.
        return hash
        .sha256()
        .update(this._id + this._timestamp + this._data + this._previousHash)
        .digest("hex");
    }

    /**
     * Find a block by its DB id.
     * @param   {integer} blockId
     * @param   {Function} callback a callback function with a Block object parameter
     */
     static findById(blockId, callback) {
            // Prepared MySQL statement, see mysql.js documentation for more info
            let strQuery = 'SELECT * FROM block WHERE `id`=?';

            connection.query(strQuery, [blockId], (error, results, fields) => {
            	if (error) console.log(error);
            	callback(new Block(results[0]));
            });
        }
        /**
         * Calculate a given block's hash then persist it to the DB.
         * @param  {Block} block
         * @param  {Function} callback a callback function with a Block object parameter
         */
         static updateHash(block, callback) {
         	let strQuery_1 = 'SELECT * FROM block WHERE `id`=?';
         	let strQuery_2 = 'UPDATE block SET `hash`=?, previousHash=? WHERE `id`=?';
         	connection.query(strQuery_1, [block.id - 1], (error, results, fields) => {
         		if (error) console.log(error);
         		let previousHash = results[0].hash;
         		connection.query(strQuery_2, [block.doHash(), previousHash, block.id], (error, results, fields) => {
         			if (error) console.log(error);
         			Block.findById(block.id, (updatedBlock) => {
         				callback(updatedBlock);
         			});
         		});
         	});
         }
        /**
         * Creates a new block given data and timestamp then persist it to the DB.
         * @param {Block} block with *only* timestamp and data properties
         * @param  {Function} callback a callback function with a Block object parameter
         */
         static add(block, callback) {
        // Prepared MySQL statement, see mysql.js documentation for more info
        let strQuery = 'INSERT INTO block set `timestamp`=?,`data`=?,`hash`=?,`previousHash`=?';
        let blockArray = block.toArray();
        // Remove the id element (first element) as not needed as a prepared SQL parameter
        blockArray.shift();
        connection.query(strQuery, blockArray, (error, results, fields) => {
        	if (error) console.log(error);
            // Extract the created block from DB
            Block.findById(results.insertId, (insertedBlock) => {
                // Create the new block's hash and persist it to DB
                Block.updateHash(insertedBlock, callback);
            });
        });
    }
 }

module.exports = Block;