const { User } = require('../../../models');
const { objectId } = require('../../../validations/custom.validation');
const PaymentHistory = require('../model');


const addPaymentHistory = async (paymentHistoryBody) => {
    try {
        const { session_id, userId, amount, paymentMethod, status } = paymentHistoryBody;

        // Check if a payment history for the given orderId already exists
        const existingPaymentHistory = await PaymentHistory.findOne({ session_id:session_id });

        if (existingPaymentHistory) {
            return { status: false, message: "Payment history for this order already exists." };
        } else {
            const paymentHistory = await PaymentHistory.create(paymentHistoryBody);
            return { status: true, paymentHistory, message: "Payment history added successfully." };
        }
    } catch (error) {
        return { status: false, message: `Error adding payment history: ${error.message}` };
    }
};


const getAllPaymentHistory = async (page = 1, limit = 10, searchQuery = '') => {
    try {
        const searchCriteria = { isActive: true };
        const pipeline = [
            { $match: searchCriteria },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
        ];

        if (searchQuery) {
            pipeline.push({
                $match: {
                    $or: [
                        { 'userDetails.name': { $regex: searchQuery, $options: 'i' } },
                        { 'userDetails.email': { $regex: searchQuery, $options: 'i' } }
                    ]
                }
            });
        }

        pipeline.push(
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit, 10) }
        );

        const paymentHistory = await PaymentHistory.aggregate(pipeline);
        const totalResults = await PaymentHistory.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalResults / limit);

        if (!paymentHistory || paymentHistory.length === 0) {
            return { status: false, code: 404, message: "No active email subscriptions found.", data: null };
        }
        return {
            status: true,
            code: 200,
            message: "Active email subscriptions retrieved successfully.",
            data: {
                data: paymentHistory,
                totalResults,
                totalPages,
                page,
                limit
            }
        };
    } catch (error) {
        return { status: false, code: 500, message: "Error retrieving subscriptions.", error: error.message };
    }
};



// const getSubscriptionByUserId = async (id) => {
//     try {
//         const emailSubscription = await PaymentHistory.findOne({ userId: objectId(id) });

//         if (!emailSubscription) {
//             return { status: false, code: 404, message: "No email subscriptions found for the given user ID." };
//         }

//         const user = await User.findOne({ _id: emailSubscription.userId });

//         if (!user) {
//             return { status: false, code: 404, message: "User details not found for the given user ID." };
//         }

//         const data = {
//             ...emailSubscription.toObject(),
//             userDetails: user.toObject()
//         };

//         return { status: true, code: 200, message: "Email subscriptions and user details retrieved successfully.", data: data };
//     } catch (error) {
//         return { status: false, code: 500, message: "Error retrieving subscriptions and user details.", error: error.message };
//     }
// };


// const updateSubscriptionByUserId = async (id, updateFields) => {
//     try {
//         const emailSubscriptionRes = await PaymentHistory.findOne({ userId: id });

//         if (!emailSubscriptionRes) {
//             return {
//                 status: false,
//                 code: 404,
//                 message: 'Email subscription not found for the provided user.',
//                 data: null,
//             };
//         }

//         if (emailSubscriptionRes.email !== updateFields.email) {
//             return {
//                 status: false,
//                 code: 400,
//                 message: 'Provided email does not match the email associated with the user.',
//                 data: null,
//             };
//         }

//         const updatedEmailSubscription = await PaymentHistory.findOneAndUpdate(
//             { userId: id },
//             updateFields,
//             { new: true }
//         );

//         return {
//             status: true,
//             code: 200,
//             message: 'Email subscription updated successfully.',
//             data: updatedEmailSubscription,
//         };
//     } catch (error) {
//         return {
//             status: false,
//             code: 500,
//             message: 'An error occurred while updating the email subscription.',
//             data: error.message,
//         };
//     }
// };









module.exports = {
    addPaymentHistory,
    getAllPaymentHistory,
    // getSubscriptionByUserId,
    // updateSubscriptionByUserId
   
};