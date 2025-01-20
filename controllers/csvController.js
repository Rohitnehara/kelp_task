const fs = require("fs");
const path = require("path");

const { parseCSVFromBinary, buildNestedObjectFromCSV } = require("../services/userService");
const { insertIntoSupabase } = require("../services/userService");
const config = require("../config/environment");

const processCSVUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(__dirname,`../${config.CSV_UPLOAD_PATH_URL}`, req.file.filename);


  fs.readFile(filePath, async (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read file" });
    }

    try {
      const { headers, rows } = parseCSVFromBinary(data);
      
    
      const nestedObjects = rows.map((rowData, index) => 
        buildNestedObjectFromCSV(headers, rowData)
      );

  
     
      await insertIntoSupabase(nestedObjects);

   
      fs.unlink(filePath, () => {});

      res.json({ nestedObjects });
    } catch (error) {
      res.status(500).json({ error: "Failed to process CSV" });
    }
  });
};

module.exports = {
  processCSVUpload,
};
