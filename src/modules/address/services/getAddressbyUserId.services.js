const ADDRESS_MODEL = require("../Address.modal");
const mongoose = require("mongoose");

async function getAddressById(id) {
	try {
		const filterQuery = {
			userId: mongoose.Types.ObjectId(id),
			active: true,
		};

		const address = await ADDRESS_MODEL.find(filterQuery);
        console.log("address",filterQuery);

		if (address) {
			return { data: address, status: true, code: 200 };
		} else {
			return { data: "Address not found", status: false, code: 404 };
		}
	} catch (error) {
		return { data: error.message, status: false, code: 400 };
	}
}

module.exports = getAddressById;