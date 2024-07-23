const { User } = require('../../../models');
const { emailSubscribedTemplate } = require('../../../utils/emailServices');
const { objectId } = require('../../../validations/custom.validation');
const EmailSubscription = require('../model');


const addEmailSubscription = async (req, emailSubscriptionBody) => {
    try {
        const loggedUserEmail = req.user.email;
        const { email, isEmailSubscribed } = emailSubscriptionBody;

        if (loggedUserEmail !== email) {
            return { code: 401, status: false, message: "Please subscribe  with the correct email." };
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return { code: 404, status: false, message: "Email not found." };
        }

        const existingSubscription = await EmailSubscription.findOne({ email: email, isEmailSubscribed: isEmailSubscribed });
        if (existingSubscription) {
            return { code: 400, status: false, message: "Email is already subscribed." };
        }

        const emailSubscriptionRes = await EmailSubscription.create(emailSubscriptionBody);
        if (emailSubscriptionRes?.email) {
            emailSubscribedTemplate({ to: emailSubscriptionRes?.email, email: emailSubscriptionRes?.email, userId: emailSubscriptionRes?.userId });
        }

        return { code: 201, status: true, emailSubscriptionRes, message: "Subscribed successfully." };

    } catch (error) {
        return { data: error.message, status: false, code: 500, message: "Error subscribing." };
    }
};


const getAllSubscriptions = async (page, limit, searchQuery) => {
    try {
        let searchCriteria = { isActive: true };
        let pipeline = [
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
            { $limit: parseInt(limit) }
        );

        const emailSubscriptions = await EmailSubscription.aggregate(pipeline);

        if (!emailSubscriptions || emailSubscriptions.length === 0) {
            return { status: false, code: 404, message: "No active email subscriptions found.", data: null };
        }
        return { status: true, code: 200, message: "Active email subscriptions retrieved successfully.", data: emailSubscriptions };
    } catch (error) {
        return { status: false, code: 500, message: "Error retrieving subscriptions.", error: error.message };
    }
};
const getAllUnSubscriber = async (page, limit, name, email) => {
    try {
        let searchCriteria = { isActive: false };
        let pipeline = [
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

        if (name) {
            pipeline.push({
                $match: {
                    'userDetails.name': { $regex: name, $options: 'i' }
                }
            });
        }

        if (email) {
            pipeline.push({
                $match: {
                    'userDetails.email': { $regex: email, $options: 'i' }
                }
            });
        }

        pipeline.push(
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) }
        );

        const emailSubscriptions = await EmailSubscription.aggregate(pipeline);

        if (!emailSubscriptions || emailSubscriptions.length === 0) {
            return { status: false, code: 404, message: "No active email subscriptions found.", data: null };
        }
        return { status: true, code: 200, message: "Active email subscriptions retrieved successfully.", data: emailSubscriptions };
    } catch (error) {
        return { status: false, code: 500, message: "Error retrieving subscriptions.", error: error.message };
    }
};

const getSubscriptionByUserId = async (id) => {
    try {
        const emailSubscription = await EmailSubscription.findOne({ userId: objectId(id) });

        if (!emailSubscription) {
            return { status: false, code: 404, message: "No email subscriptions found for the given user ID." };
        }

        const user = await User.findOne({ _id: emailSubscription.userId });

        if (!user) {
            return { status: false, code: 404, message: "User details not found for the given user ID." };
        }

        const data = {
            ...emailSubscription.toObject(),
            userDetails: user.toObject()
        };

        return { status: true, code: 200, message: "Email subscriptions and user details retrieved successfully.", data: data };
    } catch (error) {
        return { status: false, code: 500, message: "Error retrieving subscriptions and user details.", error: error.message };
    }
};


const updateSubscriptionByUserId = async (id, updateFields) => {
    try {
        const emailSubscriptionRes = await EmailSubscription.findOne({ userId: objectId(id) });

        if (!emailSubscriptionRes) {
            return {
                status: false,
                code: 404,
                message: 'Email subscribe not found for the provided user.',
                data: null,
            };
        }

        const updatedEmailSubscription = await EmailSubscription.findOneAndUpdate(
            { userId:  objectId(id) },
            updateFields,
            { new: true }
        );

        return {
            status: true,
            code: 200,
            message: 'Email subscribe updated successfully.',
            data: updatedEmailSubscription,
        };
    } catch (error) {
        return {
            status: false,
            code: 500,
            message: 'An error occurred while updating the email subscribe.',
            data: error.message,
        };
    }
};









module.exports = {
    addEmailSubscription,
    getAllSubscriptions,
    getAllUnSubscriber,
    getSubscriptionByUserId,
    updateSubscriptionByUserId
   
};