const CurrencyModel = require('../model');

const addCurrency = async (currencyBody) => {
    try {
        const currency = await CurrencyModel.create(currencyBody);
        return { code: 201, status: true, currency };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const updateCurrencyById = async (currencyId, updateFields) => {
    try {
        const currency = await CurrencyModel.findByIdAndUpdate(currencyId, updateFields, { new: true });
        if (!currency) {
            return { status: false, code: 404, currency: null };
        }
        return { status: true, code: 200, currency };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};

const deleteCurrencyById = async (currencyId) => {
    try {
        const currency = await CurrencyModel.findByIdAndUpdate(currencyId, { isActive: false }, { new: true });
        if (!currency) {
            return { status: false, code: 404, currency: null };
        }
        return { status: true, code: 200, currency };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};

const getAllCurrencies = async () => {
    try {
        const currencies = await CurrencyModel.find({ isActive: true });
        if (!currencies) {
            return { status: false, code: 404, currencies: null };
        }
        return { status: true, code: 200, data: currencies };
    } catch (error) {
        return { status: false, code: 500, currencies: null, error: error.message };
    }
};

const getCurrenciesById = async (id) => {
    try {
        const currency = await CurrencyModel.findById(id); // Find the currency by ID
        if (!currency || !currency.isActive) {
            return { status: false, code: 404, data: null };
        }
        return { status: true, code: 200, data: currency };
    } catch (error) {
        return { status: false, code: 500, data: null, error: error.message };
    }
};

module.exports = {
    addCurrency,
    updateCurrencyById,
    deleteCurrencyById,
    getAllCurrencies,
    getCurrenciesById
};
