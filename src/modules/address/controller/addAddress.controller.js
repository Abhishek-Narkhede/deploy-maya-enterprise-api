const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const Services = require("../services");

const addAddress = catchAsync(async (req, res) => {
	const userId = req?.user?.id;

	let {Name,addressLine1,addressLine2,country, state,city, zip } =
		await pick(req.body, [
			"Name",
			"addressLine1",
			"addressLine2",
			"country",
			"state",
			"city",
			"zip",
		]);

	let addResult = await Services.addAddress({
		userId: userId,
		Name,
		addressLine1,
		addressLine2,
		country,
		state,
		city,
		zip,
	});

	if (addResult?.code === 200) {
		sendResponse(res, httpStatus.OK, addResult?.data, null);
	} else {
		sendResponse(
			res,
			addResult?.code === 500
				? httpStatus?.INTERNAL_SERVER_ERROR
				: addResult?.code === 404
				? httpStatus?.NOT_FOUND
				: httpStatus.BAD_REQUEST,
			null,
			addResult?.data
		);
	}
});

module.exports = addAddress;