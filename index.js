require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./model/UserModel.js");
const { createSecretToken } = require("./util/SecretToken");
const bcrypt = require("bcryptjs");

const {
  PositionsModel,
} = require("./model/PositionsModels");

const {
  HoldingsModel,
} = require("./model/HoldingModels.js");

const PORT = process.env.PORT || 3002;
const uri =
  process.env.MONGO_URL || 3002;

const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(bodyParser.json());

// app.get(
//   "/addHoldings",
//   async (req, res) => {
//     let tempHoldings = [
//       {
//         name: "BHARTIARTL",
//         qty: 2,
//         avg: 538.05,
//         price: 541.15,
//         net: "+0.58%",
//         day: "+2.99%",
//       },
//       {
//         name: "HDFCBANK",
//         qty: 2,
//         avg: 1383.4,
//         price: 1522.35,
//         net: "+10.04%",
//         day: "+0.11%",
//       },
//       {
//         name: "HINDUNILVR",
//         qty: 1,
//         avg: 2335.85,
//         price: 2417.4,
//         net: "+3.49%",
//         day: "+0.21%",
//       },
//       {
//         name: "INFY",
//         qty: 1,
//         avg: 1350.5,
//         price: 1555.45,
//         net: "+15.18%",
//         day: "-1.60%",
//         isLoss: true,
//       },
//       {
//         name: "ITC",
//         qty: 5,
//         avg: 202.0,
//         price: 207.9,
//         net: "+2.92%",
//         day: "+0.80%",
//       },
//       {
//         name: "KPITTECH",
//         qty: 5,
//         avg: 250.3,
//         price: 266.45,
//         net: "+6.45%",
//         day: "+3.54%",
//       },
//       {
//         name: "M&M",
//         qty: 2,
//         avg: 809.9,
//         price: 779.8,
//         net: "-3.72%",
//         day: "-0.01%",
//         isLoss: true,
//       },
//       {
//         name: "RELIANCE",
//         qty: 1,
//         avg: 2193.7,
//         price: 2112.4,
//         net: "-3.71%",
//         day: "+1.44%",
//       },
//       {
//         name: "SBIN",
//         qty: 4,
//         avg: 324.35,
//         price: 430.2,
//         net: "+32.63%",
//         day: "-0.34%",
//         isLoss: true,
//       },
//       {
//         name: "SGBMAY29",
//         qty: 2,
//         avg: 4727.0,
//         price: 4719.0,
//         net: "-0.17%",
//         day: "+0.15%",
//       },
//       {
//         name: "TATAPOWER",
//         qty: 5,
//         avg: 104.2,
//         price: 124.15,
//         net: "+19.15%",
//         day: "-0.24%",
//         isLoss: true,
//       },
//       {
//         name: "TCS",
//         qty: 1,
//         avg: 3041.7,
//         price: 3194.8,
//         net: "+5.03%",
//         day: "-0.25%",
//         isLoss: true,
//       },
//       {
//         name: "WIPRO",
//         qty: 4,
//         avg: 489.3,
//         price: 577.75,
//         net: "+18.08%",
//         day: "+0.32%",
//       },
//     ];

//     tempHoldings.forEach((item) => {
//       let newHolding = new HoldingsModel(
//         {
//           name: item.name,
//           qty: item.qty,
//           avg: item.avg,
//           price: item.price,
//           net: item.net,
//           day: item.day,
//         }
//       );
//       newHolding.save();
//     });
//     res.send("Holdings added successfully");
//   }
// );

// app.get(
//       "/addPositions",
//       async (req, res) => {
//         let tempPositions = [
//             {
//                 product: "CNC",
//                 name: "EVEREADY",
//                 qty: 2,
//                 avg: 316.27,
//                 price: 312.35,
//                 net: "+0.58%",
//                 day: "-1.24%",
//                 isLoss: true,
//               },
//               {
//                 product: "CNC",
//                 name: "JUBLFOOD",
//                 qty: 1,
//                 avg: 3124.75,
//                 price: 3082.65,
//                 net: "+10.04%",
//                 day: "-1.35%",
//                 isLoss: true,
//               },
//         ]

//         tempPositions.forEach((item) => {
//                   let newPositions = new PositionsModel(
//                     {
//                         product: item.product,
//                         name: item.name,
//                         qty: item.qty,
//                         avg: item.avg,
//                         price: item.price,
//                         net: item.net,
//                         day: item.day,
//                         isLoss: item.isLoss,
//                     }
//                   );
//                   newPositions.save();
//                 });
//                 res.send("Positions added successfully");

// });

app.post(
  "/signup",
  async (req, res, next) => {
    try {
      const {
        email,
        password,
        username,
        createdAt,
      } = req.body;
      const existingUser =
        await User.findOne({ email });
      if (existingUser) {
        return res.json({
          message:
            "User already exists",
        });
      }
      const user = await User.create({
        email,
        password,
        username,
        createdAt,
      });
      const token = createSecretToken(
        user._id
      );
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      res.status(201).json({
        message:
          "User signed in successfully",
        success: true,
        username: user.username,
        user,
      });
      next();
    } catch (error) {
      console.error(error);
    }
  }
);
app.post(
  "/login",
  async (req, res, next) => {
    try {
      const { email, password } =
        req.body;
      if (!email || !password) {
        return res.json({
          message:
            "All fields are required",
        });
      }
      const user = await User.findOne({
        email,
      });
      if (!user) {
        return res.json({
          message:
            "Incorrect password or email",
        });
      }
      const auth = await bcrypt.compare(
        password,
        user.password
      );
      if (!user) {
        return res.json({
          message:
            "Incorrect password or email",
        });
      }
      const token = createSecretToken(
        user._id
      );
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      res
        .status(201)
        .json({
          message:
            "User logged in successfully",
          success: true,
        });
      next();
    } catch (error) {
      console.error(error);
    }
  }
);

app.get(
  "/allHoldings",
  async (req, res) => {
    try {
      // Fetch all holdings from the database
      let allHoldings =
        await HoldingsModel.find({});

      // Respond with JSON data
      res.status(200).json(allHoldings);
    } catch (error) {
      console.error(
        "Error fetching holdings:",
        error
      );

      // Send a 500 Internal Server Error response
      res.status(500).json({
        message:
          "Error fetching holdings",
        error,
      });
    }
  }
);

app.get(
  "/allPositions",
  async (req, res) => {
    try {
      // Fetch all holdings from the database
      let allPositions =
        await PositionsModel.find({});

      // Respond with JSON data
      res
        .status(200)
        .json(allPositions);
    } catch (error) {
      console.error(
        "Error fetching positions:",
        error
      );

      // Send a 500 Internal Server Error response
      res.status(500).json({
        message:
          "Error fetching positions",
        error,
      });
    }
  }
);

app.listen(PORT, () => {
  console.log("app started");
  mongoose.connect(uri);
  console.log("DB conneced");
});
