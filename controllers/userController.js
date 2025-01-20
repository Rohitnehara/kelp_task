const { getUserAgeDistribution } = require("../services/userService");

const getAgeDistribution = async (req, res) => {
  try {
    const ageDistribution = await getUserAgeDistribution();

    res.json({ ageDistribution });
  } catch (error) {
    res.status(500).json({ error: "Error calculating age distribution" });
  }
};

module.exports = {
  getAgeDistribution,
};
