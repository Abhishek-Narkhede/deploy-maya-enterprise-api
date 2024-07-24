const pick = require("../../../utils/pick");
const Cart = require("../../cart/model");
const { getConfigForCheckout } = require("../../globalconfig/service/globalconfig.service");
const StepperProgress = require("../model");
const mongoose = require("mongoose");

const addStepperProgress = async (userId, body) => {
    try {
        let userObjectId = mongoose.Types.ObjectId(userId);
        let stepperProgress = await StepperProgress.findOne({ userId });
        if (stepperProgress) {
            return { data: "Stepper already created", status: false, code: 400, message: "Stepper already created" };
        }
        const carts = await Cart.aggregate([
            { $match: { userId: userObjectId } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $addFields: {
                    total_price: { $multiply: ['$productDetails.discountedPrice', '$quantity'] }
                }
            },
        ]);
        let totalCartAmount = 0;
        let cartAmount = 0;
        const globalConfigData = await getConfigForCheckout();
        if (globalConfigData) {
            console.log("globalConfigData", globalConfigData);
            const { deliveryCharges, packagingCharges } = globalConfigData?.config[0];

            totalCartAmount = carts.reduce((sum, cart) => sum + cart.total_price, 0);
            cartAmount = totalCartAmount;
            console.log("charges", deliveryCharges, packagingCharges);
            totalCartAmount += deliveryCharges || 0;
            totalCartAmount += packagingCharges || 0;
        }
        console.log("totalCartAmount", totalCartAmount);
        const stepperCreationBody = {
            ...body,
            userId,
            cartData: carts,
            totalCartAmount: totalCartAmount,
            cartAmount: cartAmount,
        }

        // Check if a document with the given userId exists

        // If document does not exist, create a new one
        const addResult = await StepperProgress.create(stepperCreationBody);
        return { data: addResult, status: true, code: 201, message: "Stepper created" };

    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const updateStepperProgress = async (userId, body) => {
    try {
        let userObjectId = mongoose.Types.ObjectId(userId);
        let existingStepperProgress = await StepperProgress.findOne({ userId });
        const carts = await Cart.aggregate([
            { $match: { userId: userObjectId } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $addFields: {
                    total_price: { $multiply: ['$productDetails.discountedPrice', '$quantity'] }
                }
            }
        ]);

        let totalCartAmount = 0;
        let cartAmount = 0;
        const globalConfigData = await getConfigForCheckout();
        if (globalConfigData) {
            console.log("globalConfigData", globalConfigData);
            const { deliveryCharges, packagingCharges } = globalConfigData?.config[0];

            totalCartAmount = carts.reduce((sum, cart) => sum + cart.total_price, 0);
            cartAmount = totalCartAmount;
            console.log("charges", deliveryCharges, packagingCharges);
            totalCartAmount += deliveryCharges || 0;
            totalCartAmount += packagingCharges || 0;
        }
        console.log("totalCartAmount", totalCartAmount);
        const stepperUpdateBody = {
            ...body,
            userId,
            cartData: carts,
            totalCartAmount: totalCartAmount,
            cartAmount: cartAmount,
        }
        const updatedResponse = await StepperProgress.findByIdAndUpdate(existingStepperProgress._id, stepperUpdateBody, { new: true });
        return { data: updatedResponse, status: true, code: 200, message: "Stepper updated" };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const userSteppeprProgress = async (userId) => {
    try {
        let userObjectId = mongoose.Types.ObjectId(userId);
        let existingStepperProgress = await StepperProgress.findOne({ userId: userObjectId });
        if (!existingStepperProgress) {
            return { data: "Stepper Progress Does not exist", status: false, code: 400 };
        } else {
            const carts = await Cart.aggregate([
                { $match: { userId: userObjectId } },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                { $unwind: '$productDetails' },
                {
                    $addFields: {
                        total_price: { $multiply: ['$productDetails.discountedPrice', '$quantity'] }
                    }
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);
            existingStepperProgress.cartData = carts;
            let totalCartAmount = 0;
            let cartAmount = 0;
            const globalConfigData = await getConfigForCheckout();
            if (globalConfigData) {
                const { deliveryCharges, packagingCharges } = globalConfigData?.config[0];
                totalCartAmount = carts.reduce((sum, cart) => sum + cart.total_price, 0);
                cartAmount = totalCartAmount;
                totalCartAmount += deliveryCharges || 0;
                totalCartAmount += packagingCharges || 0;
            }
            existingStepperProgress.totalCartAmount = totalCartAmount;
            existingStepperProgress.cartAmount = cartAmount;
            await existingStepperProgress.save();

            return { data: existingStepperProgress, status: true, code: 200 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const deleteSteppeprProgressByUserId = async (userId) => {
    try {
        let userObjectId = mongoose.Types.ObjectId(userId);
        let existingStepperProgress = await StepperProgress.findOne({ userId: userObjectId });
        if (!existingStepperProgress) {
            return { data: "Stepper Progress Does not exist", status: false, code: 400 };
        } else {
            try {
                let deleteQuery = {
                    userId: userObjectId,
                };

                const deletedResult = await StepperProgress.deleteMany(deleteQuery);
                if (deletedResult) {
                    return { data: deletedResult, status: true, code: 200 };
                } else {
                    return { data: "Failed To Delete Stepper Progress", status: false, code: 400 };
                }
            } catch (error) {
                return { data: error, status: false, code: 400 };
            }
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = {
    addStepperProgress, updateStepperProgress, userSteppeprProgress, deleteSteppeprProgressByUserId
}


