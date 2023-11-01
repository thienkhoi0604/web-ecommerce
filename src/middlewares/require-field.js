const requiredFields = (fields) => {
  return (req, _res, next) => {
    const missingFields = [];
    const keys = Object.keys(req.body); // Included fields

    // Checks if every required field is in the body
    for (const field of fields)
      if (!keys.includes(field)) missingFields.push(field);

    // If there are missing fields then run next error middleware
    if (missingFields.length) return next(new RequiredBodyError(missingFields));

    // If no missing fields then run router code
    return next();
  };
};

module.exports = { requiredFields };

//Example usage
// Post request at /find with a requiredFileds middleware
// router.post("/find", requiredFields(["filename", "title"]), async (req, res, next) => {
// 	// Used fields
// 	const {filename, title} = req.body;

//   fs.readFile(`data/${filename}.json`, 'utf8', (err, data) => {
// 		// If error when reading the file return an error
//     if(err)
//       return next(new Error(`Error reading file ${filename}.`));

//     try {
// 			// Parse file
//       const json = JSON.parse(data);

//       const books = json.books.filter(
//         val => val.title.toLowerCase().includes(title.toLowerCase()));

// 			// Send response
//       return res.status(200).json({
//         books
//       })
//     } catch {
// 			// If could not parse file then return an error
//       next(new Error());
//     }
//   });
// })
