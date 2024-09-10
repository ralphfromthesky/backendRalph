export const createUserValidationSchema = {
	username: {
		isLength: {
			options: {
				min: 5,
				max: 32,
			},
			errorMessage:
				"Username must be at least 5 characters with a max of 32 characters",
		},
		notEmpty: {
			errorMessage: "Username cannot be empty",
		},
		isString: {
			errorMessage: "Username must be a string!",
		},
	},
	//this one is optional if you have any or added inputs...
	// displayName: {
	// 	notEmpty: true,
	// },
	password: {
		notEmpty: true,
	},
};



// const { checkSchema, validationResult } = require('express-validator');

// // Define validation schema using checkSchema
// const userValidationSchema = checkSchema({
//   name: {
//     isLength: {
//       options: { min: 2 },
//       errorMessage: 'Name must be at least 2 characters long',
//     },
//   },
//   email: {
//     isEmail: {
//       errorMessage: 'Please enter a valid email address',
//     },
//   },
//   password: {
//     isLength: {
//       options: { min: 6 },
//       errorMessage: 'Password must be at least 6 characters long',
//     },
//   },
// });

// // Use the schema in your route
// app.post('/register', userValidationSchema, (req, res) => {
//   // Check if validation failed
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   // Proceed with registration logic if validation passed
//   res.send('User registered successfully');
// });
