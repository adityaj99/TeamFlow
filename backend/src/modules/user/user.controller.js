const register = async (req, res) => {
  res.json({ message: "Register route working!" });
};

const login = async (req, res) => {
  res.json({ message: "Login route working!" });
};

export { register, login };
