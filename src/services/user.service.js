const httpStatus = require('http-status');
const tokenService = require('./token.service');
const Token = require('../models/token.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { adminRoles } = require('../config/roles');
const { async } = require('recursive-fs/lib/read');
const { urlencoded } = require('express');
const { default: axios } = require('axios');
const { fetchLocationDetails } = require('../utils/fetchLocation');


const getUsersList = async (page, limit, filter = {}, sort) => {
    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        let filterQuery = { active: true, role: { $nin: ['admin', 'editor'] } }
        let sortQuery = { _id: -1 }

        for (let key in sort) {
            if (sort.hasOwnProperty(key)) {
                let value = sort[key];
                let numericValue = Number(value);
                if (!isNaN(numericValue)) {
                    sort[key] = numericValue;
                }
            }
        }

        if (sort != null) {
            sortQuery = sort
        }

        if (filter?.role) {
            // let searchRegex = new RegExp(`.*${filter?.role}.*`, "i");
            // filterQuery = { ...filterQuery, role: { $regex: searchRegex } };
            if (Array.isArray(filter.role)) {
                filterQuery = { ...filterQuery, role: { $in: filter.role } };
            } else {
                filterQuery = { ...filterQuery, role: filter.role };
            }
        }


        if (filter?.name) {
            var searchRegex = new RegExp(`.*${filter.name}.*`, "i")
            filterQuery = { ...filterQuery, name: { $regex: searchRegex } }
        }

        if (filter?.email) {
            var searchRegex = new RegExp(`.*${filter.email}.*`, "i")
            filterQuery = { ...filterQuery, email: { $regex: searchRegex } }
        }

        const listResult = await User.find(filterQuery).sort(sortQuery).skip(skip).limit(length)
        const totalResults = await User.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalResults / limit);
        if (listResult) {
            return { data: listResult, totalResults, totalPages, page: start, limit: length, status: true, code: 200 };
        }
        else {
            return { data: "User not found", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };

    }
}

const getUserById = async (id) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }
        const user = await User.findOne(filterQuery)
        if (user) {
            return { data: user, status: true, code: 200 };
        }
        else {
            return { data: "User not found", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}


const updateUser = async (userId, body) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(userId), active: true }
        if (await User.isNicknameTaken(body.nickname)) {
            return { msg: "Nickname is already taken", code: 400, status: false }
        }
        else {
            const updatedResult = await User.findOneAndUpdate(filterQuery, body, { new: true })
            if (updatedResult) {
                return { data: updatedResult, status: true, code: 200 };
            }
            else {
                return { data: "User not found", status: false, code: 400 };
            }
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}

const updateProfile = async (id, body) => {

    try {
        if (!id) {
            return { msg: "Id not found", status: false, code: 400 };
        }
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }

        // if (await User.isNicknameTaken(body.nickname, filterQuery)) {
        //     return { msg: "Nickname is already taken", code: 400, status: false }
        // }
        console.log("filterQuery", filterQuery);
        const updatedResult = await User.findOneAndUpdate(filterQuery, body, { new: true })
        if (updatedResult) {
            return { data: updatedResult, status: true, code: 200 };
        }
        else {
            return { msg: "User not found", status: false, code: 400 };
        }
    } catch (error) {
        return { msg: error.message, status: false, code: 500 };
    }
}

const updateUserStatus = async (id, status) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }
        const updateResult = await User.findOneAndUpdate(filterQuery, { status: status }, { new: true });

        if (updateResult) {
            return { data: updateResult, status: true, code: 200 };
        }
        else {
            return { data: "User not found", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}
const deleteUser = async (id) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }
        const updateResult = await User.findOneAndUpdate(filterQuery, { active: false }, { new: true });

        if (updateResult) {
            return { data: updateResult, status: true, code: 200 };
        }
        else {
            return { data: "User not found", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}

const checkWalletExisted = async ({ walletAddr }) => {
    try {
        const user = await User.findOne({ wallet: walletAddr },/* add Projection */) || null
        return { data: { isExisted: user ? true : false, wallet: walletAddr }, status: true, code: 200 }
    } catch (err) {
        return { data: "Something Went Wrong", status: false, code: 500 }
    }
}

/**
 * 
 * @param {String} userId 
 * @returns Promise<Object>
 */
const getUserDetailsById = async (userId) => {
    const user = await User.findById({ _id: userId }) || null
    return user || null
}
const fetchUserIpDetails = async (lat, long) => {
    try {
        const response = await fetchLocationDetails(lat, long)
        return { data: response, status: true, code: 200 }
    } catch (error) {
        console.log(error);
        return { data: "Something Went Wrong", status: false, code: 500 }
    }
}


const getAllUsersWithPagination = async (searchQuery, page = 1, limit = 10) => {
    try {
        let query = {
            active: true
        };

        if (searchQuery) {
            query.$or = [
                { name: { $regex: `^${searchQuery}`, $options: 'i' } },
                { email: { $regex: `^${searchQuery}`, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const users = await User.find(query).sort({ _id: -1 }).skip(skip).limit(limit);

        const totalUsers = await User.countDocuments(query);

        const totalPages = Math.ceil(totalUsers / limit);

        return {
            code: 201,
            status: true,
            users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        };
    } catch (error) {
        return { message: error.message, status: false, code: 500 };
    }
};



module.exports = {
    getUsersList,
    getUserById,
    updateUser,
    updateUserStatus,
    checkWalletExisted,
    updateProfile,
    deleteUser,
    getUserDetailsById,
    fetchUserIpDetails,
    getAllUsersWithPagination
};