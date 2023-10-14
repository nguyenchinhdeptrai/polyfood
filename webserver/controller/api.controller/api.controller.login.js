const mongoose = require("mongoose");
const user = require("../../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const api_url =
  "mongodb+srv://chinhnvph23300:MbbrR9S0zud0X3iF@cluster0.f0j8ggm.mongodb.net/folyfoods?retryWrites=true&w=majority";
const jwtSecret = "my-key";
//
exports.register = async (req, res, next) => {
  try {
    await mongoose.connect(api_url);
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ check: "Dữ liệu không hợp lệ" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ check: "Email lỗi" });
    }
    const telRegex = /^0\d{9}$/;
    if (!telRegex.test(phone)) {
      return res.status(400).json({ check: "Số điện thoại sai định dạng" });
    }
    //
    const checkMailUser = await user.findOne({ email: email });
    if (checkMailUser) {
      return res.status(400).json({ check: "Email đã tồn tại" });
    }

    //mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      email: email,
      password: hashedPassword,
      phone: phone,
      name: name,
      role: 1,
    });
    await newUser.save();
    return res.status(200).json({ data: newUser, check: "Đăng ký thành công" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
//
exports.loginUser = async (req, res, next) => {
  try {
    await mongoose.connect(api_url);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ check: "Dữ liệu không hợp lệ" });
    }

    const checkUserLogin = await user.findOne({ email: email });
    if (!checkUserLogin) {
      return res.status(400).json({ check: "Người dùng không tồn tại" });
    }
    const passwordMatch = await bcrypt.compare(
      password,
      checkUserLogin.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ check: "Mật khẩu không đúng" });
    } else {
      const token = jwt.sign({ userId: checkUserLogin._id }, jwtSecret, {
        expiresIn: "1h",
      });
      return res
        .status(200)
        .json({ token: token, check: "Đăng nhập thành công" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
