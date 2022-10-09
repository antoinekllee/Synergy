const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

const schema = new Schema ({
    email: 
    {
        type: String, 
        unique: true, 
        required: true
    }, 
    sn: 
    {
        type: Number, 
        required: true
    },
    tf: 
    {
        type: Number, 
        required: true
    },
    ei: 
    {
        type: Number, 
        required: true
    },
    pj: 
    {
        type: Number, 
        required: true
    }
})

module.exports = model ("personalities", schema); 