require('dotenv').config();
const path = require("path");

const { createClient } = require("@supabase/supabase-js");

const CSV_UPLOAD_PATH_URL= process.env.CSV_UPLOAD_PATH || './uploads';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const config = {
  PORT: process.env.PORT || 3000,
  CSV_UPLOAD_PATH: path.join(__dirname, CSV_UPLOAD_PATH_URL),
  CSV_UPLOAD_PATH_URL,
  
  supabase
};

module.exports = config;