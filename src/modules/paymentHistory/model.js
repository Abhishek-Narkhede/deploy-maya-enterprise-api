const mongoose = require('mongoose');
const paymentHistorySchema = mongoose.Schema(
    {
        
        // orderId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        // },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        amount: {
            type: Number,
            trim: true,
            default: '',
        },
        currency: {
            type: String,
            trim: true,
            default: 'inr',
            enum: [ 'inr','usd'], 
        },
        paymentId: {
            type: String,
            trim: true,
        },
        session_id: {
            type: String,
            trim: true,
        },
        receipt_email: {
            type: String,
            trim: true,
        },
        payment_method_types: {
            type: String,
            trim: true,
            default: 'card',
            enum: [ 'card',], 
        },
        status: {
            type: String,
            trim: true,
            default: 'pending',
            enum: ['pending', 'succeeded'], // Add your accepted statuses here
        },

        isActive: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
    }
);
const PaymentHistory = mongoose.model('paymenthistory', paymentHistorySchema);

module.exports = PaymentHistory;
