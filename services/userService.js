const { supabase } = require("../config/environment");

function buildNestedObjectFromCSV(headers, rowData) {
  const result = {};

  headers.forEach((path, index) => {
    const keys = path.split(".");
    let current = result;

    keys.forEach((key, idx) => {
      if (idx === keys.length - 1) {
        current[key] = rowData[index] || "";
      } else {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    });
  });

  return result;
}

function parseCSVFromBinary(binaryData) {
  const data = binaryData.toString("utf8");
  const lines = data.split("\n").filter(line => line.trim() !== "");
  const headers = lines[0]?.split(",").map(header => header.trim()) || [];
  const rows = lines.slice(1).map(line => line.split(",").map(cell => cell.trim()));
  return { headers, rows };
}

async function insertIntoSupabase(inputJson) {
  for (const item of inputJson) {
    const mandatoryFields = {
      name: `${item.name?.firstName || ""} ${item.name?.lastName || ""}`.trim(),
      age: isNaN(parseInt(item.age, 10)) ? null : parseInt(item.age, 10),
      address: item.address,
    };

    const additionalInfo = { ...item };
    delete additionalInfo.name;
    delete additionalInfo.age;
    delete additionalInfo.address;

    const { error } = await supabase.from("users").insert([{
      name: mandatoryFields.name,
      age: mandatoryFields.age,
      address: mandatoryFields.address || null,
      additional_info: Object.keys(additionalInfo).length ? additionalInfo : null,
    }]);

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function getUserAgeDistribution() {

  const { data: users, error } = await supabase.from("users").select("age");

  if (error) {
    throw new Error("Failed to fetch users");
  }

  const ageGroups = {
    under20: 0,
    "20to40": 0,
    "40to60": 0,
    over60: 0,
  };

  users.forEach(user => {
    if (user.age < 20) {
      ageGroups.under20++;
    } else if (user.age >= 20 && user.age <= 40) {
      ageGroups["20to40"]++;
    } else if (user.age >= 40 && user.age <= 60) {
      ageGroups["40to60"]++;
    } else if (user.age > 60) {
      ageGroups.over60++;
    }
  });

  const totalUsers = users.length;

  return {
    under20: ((ageGroups.under20 / totalUsers) * 100).toFixed(2),
    "20to40": ((ageGroups["20to40"] / totalUsers) * 100).toFixed(2),
    "40to60": ((ageGroups["40to60"] / totalUsers) * 100).toFixed(2),
    over60: ((ageGroups.over60 / totalUsers) * 100).toFixed(2),
  };
}

module.exports = {
  buildNestedObjectFromCSV,
  parseCSVFromBinary,
  insertIntoSupabase,
  getUserAgeDistribution,
};
