const validator = require("validator");

const validateSignupData = (data) => {
  const { firstName, lastName, emailId, password } = data;
  if (!firstName) {
    throw new Error("Please enter first name");
  } else if (!lastName) {
    throw new Error("Please enter last name");
  } else if (!emailId) {
    throw new Error("Please enter email Id");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email Id");
  } else if (!password) {
    throw new Error("Please enter password");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateLoginData = (data) => {
  const { emailId, password } = data;

  if (!emailId) {
    throw new Error("Please enter email Id");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email Id");
  } else if (!password) {
    throw new Error("Please enter password");
  }
};

const validateProfileEditData = (data) => {
  let allowedFileds = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "profileUrl",
    "gender",
    "about",
    "skills",
    "password"
  ];
  let isEditApplicable = Object.keys(data).every((ele) =>
    allowedFileds.includes(ele),
  );
  if (!isEditApplicable) {
    throw new Error("Cannot edit password field");
  }
};

const validatePasswordData = (data) => {
  let password = data.password;
  let allowedFields = ["password"];
  let isValidData = Object.keys(data).every((key) =>
    allowedFields.includes(key),
  );
  if (!password) {
    throw new Error("Please enter password");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  } else if (!isValidData) {
    throw new Error("Please send required data only");
  }
};

const validateConnectionRequestData = (data) => {
  let allowedStatuses = ["interested", "ignored"];
  if (!data?.status) {
    throw new Error("Status is required");
  } else if (!data?.toUserId) {
    throw new Error("toUserId is required");
  } else if (!allowedStatuses.includes(data.status)) {
    throw new Error("Allowed status is either interested or ignored");
  }
};

module.exports = {
  validateSignupData,
  validateLoginData,
  validateProfileEditData,
  validatePasswordData,
  validateConnectionRequestData,
};
