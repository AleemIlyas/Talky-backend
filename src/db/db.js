const mongoose = require('mongoose')

async function main(url){
    try{
        await mongoose.connect(url)
        console.log('connected to db successfully!')
    }
    catch(err){
        console.log('Something Went wrong could not connect to server!' , err)
        throw err
    }
}

module.exports = main