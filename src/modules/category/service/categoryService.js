const Category = require("../model");
const mongoose = require("mongoose");
const pick = require("../../../utils/pick");

const addCategory = async (body) => {
  try {
    const { name } = body;
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') },active: true });
    if (existingCategory) {
      return { data: "Category name already exists", status: false, code: 400 };
    }
    const addResult = await Category.create(body);
    if (addResult) {
      return { data: addResult, status: true, code: 201 };
    } else {
      return { data: "Category not created", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};


const getCategory = async (page = 1, limit = 10, searchQuery = '') => {
  try {
    const length = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    let filterQuery = { active: true };
    if (searchQuery) {
      filterQuery.name = { $regex: searchQuery, $options: 'i' };
    }

    const categories = await Category.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(length)
      .populate('categoryId');

    const totalResults = await Category.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalResults / length);

    if (categories.length > 0) {
      return { data: { categories, totalResults, totalPages, page: start, limit: length }, status: true, code: 200 };
    } else {
      return { data: "Category not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};


const updateCategory = async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  try {
    let filterQuery = {
      _id: mongoose.Types.ObjectId(id),
      active: true,
    };

    const updatedResult = await Category.findOneAndUpdate(
      filterQuery,
      req.body,
      { new: true }
    );
    if (updatedResult) {
      return { data: updatedResult, status: true, code: 200 };
    } else {
      return { data: "Category not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

const deleteCategory = async (id) => {
  try {
    let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true };

    const updateResult = await Category.findOneAndUpdate(
      filterQuery,
      { active: false },
      { new: true }
    );

    if (updateResult) {
      return { data: updateResult, status: true, code: 200 };
    } else {
      return { data: "Category not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = {
  getCategory,
  updateCategory,
  deleteCategory,
  addCategory,
};
