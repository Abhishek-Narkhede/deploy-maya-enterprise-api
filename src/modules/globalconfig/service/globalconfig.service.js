const ConfigModel = require('../model');

const addConfig = async (configBody) => {
    try {
        const config = await ConfigModel.create(configBody);
        return { code: 201, status: true, config };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const addOrUpdateConfig = async (configBody) => {
    try {
        const config = await ConfigModel.findOneAndUpdate(
            {}, // match all documents
            configBody,
            { new: true, upsert: true } // create if doesn't exist
        );
        return { code: 201, status: true, config };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const updateConfigById = async (configId, updateFields) => {
    try {
        const config = await ConfigModel.findByIdAndUpdate(configId, updateFields, { new: true });
        if (!config) {
            return { status: false, code: 404, config: null };
        }
        return { status: true, code: 200, config };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};

const deleteConfigById = async (configId) => {
    try {
        const config = await ConfigModel.findByIdAndUpdate(configId, { isActive: false }, { new: true });
        if (!config) {
            return { status: false, code: 404, config: null };
        }
        return { status: true, code: 200, config };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};

const getConfig = async () => {
    try {
        // const config = await ConfigModel.find({ isActive: true });
        const configs = await ConfigModel.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $lookup: {
                    from: 'currencies', // The name of the currency collection
                    localField: 'currencyId', // The field in the config collection
                    foreignField: '_id', // The field in the currency collection
                    as: 'currencyData' // The name of the array field to be added to each output document
                }
            },
            {
                $unwind: { path: '$currencyData', preserveNullAndEmptyArrays: true }
            }
        ]);
        if (!configs) {
            return { status: false, code: 404, configs: null };
        }
        return { status: true, code: 200, data: configs };
    } catch (error) {
        return { status: false, code: 500, configs: null, error: error.message };
    }
};

const getConfigForCheckout = async () => {
    try {
        const config = await ConfigModel.find({});
        if (!config) {
            return { config: [] };
        }
        return { config };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
}

module.exports = {
    addConfig,
    addOrUpdateConfig,
    updateConfigById,
    deleteConfigById,
    getConfig,
    getConfigForCheckout
};
