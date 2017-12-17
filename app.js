// Import Block class 
const Block  =require ("./model/block");

// Adds a new block with the current time and sample data
let block = new Block({
	timestamp: new Date().getTime(),
	// This is only for demo purpose
	data:"BlockChain is awesome!",
});
Block.add(block,(b)=>{
	console.log(`Written block: ${JSON.stringify(b)}`);
})
