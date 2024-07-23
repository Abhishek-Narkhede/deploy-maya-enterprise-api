const mongoose = require('mongoose');
const prescriptionModel = require('../model');


const addPrescriptionImage = async (prescriptionBody) => {
    try {
        const prescription = await prescriptionModel.create(prescriptionBody);
        return { code: 201, status: true, prescription };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const updateprescriptionImageById = async (prescriptionId, updateFields) => {
    try {
        const prescription = await prescriptionModel.findByIdAndUpdate(prescriptionId, updateFields, { new: true });
        if (!prescription) {
            return { status: false, code: 404, prescription: null };
        }
        return { status: true, code: 200, prescription };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};

const deleteprescriptionImageById = async (prescriptionId) => {
    try {
        const prescription = await prescriptionModel.findByIdAndUpdate(prescriptionId, { isActive: false }, { new: true });
        if (!prescription) {
            return { status: false, code: 404, prescription: null };
        }
        return { status: true, code: 200, prescription };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};


const getAllprescriptionImage = async () => {
    try {
        const prescription = await prescriptionModel.find({ isActive: true });
        if (!prescription) {
            return { status: false, code: 404, prescription: null };
        }
        return { status: true, code: 200, data: prescription };
    } catch (error) {
        return { status: false, code: 500, prescription: null, error: error.message };
    }
};

const getPrescriptionByUserId = async (userId) => {
    try {
        let userObjectId = mongoose.Types.ObjectId(userId);
        const prescriptions = await prescriptionModel.aggregate([
            {
                $match: { userId: userObjectId, isActive: true }
            },
            {
                $lookup: {
                    from: 'addresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: 'addressDetails'
                }
            },
            {
                $unwind: {
                    path: '$addressDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        if (!prescriptions || prescriptions.length === 0) {
            return { status: false, code: 400, data: [] };
        }
        return { status: true, code: 200, data: prescriptions };
    } catch (error) {
        return { status: false, code: 500, data: null, error: error.message };
    }
};



module.exports = {
    addPrescriptionImage,
    updateprescriptionImageById,
    deleteprescriptionImageById,
    getAllprescriptionImage,
    getPrescriptionByUserId
};