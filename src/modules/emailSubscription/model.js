const mongoose = require('mongoose');
const emailSubscriptionSchema = mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            default: '',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        isEmailSubscribed: {
            type: Boolean,
            default: true
        },
        subscribedAt: {
            type: Date,
            default: Date.now,
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
const EmailSubscription = mongoose.model('emailsubscription', emailSubscriptionSchema);

module.exports = EmailSubscription;
