const httpStatus = require('http-status');
const catchAsync = require('../../utils/catch-error');
const UserService = require('./service');


const getAll = catchAsync(async (req, res) => {
    const user = await UserService.getAll()


    return res.status(200).json({
        success: true,
        data: user
    })
})

module.exports = {
    getAll
}