const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// read the original orders.json
let orders;

fs.readFile("./orders.json", "utf-8", (err, jsonString) => {
  if (err) {
    console.log("error reading the original file orders.json");
  } else {
    try {
      orders = JSON.parse(jsonString);
      return;
    } catch (err) {
      console.log("error parsing the json string");
    }
  }
});

const maxOrderId = () => {
  return orders.reduce((maxId, order) => Math.max(maxId, order.id), 0) + 1;
};

const findOrdersByCC = (ccNum, month) => {
  return orders.filter((order) => {
    const orderMon = new Date(order.orderDate).getMonth();
    if (order.payment.ccNum === ccNum && orderMon === month) {
      return true;
    } else {
      return false;
    }
  });
};

// Routes (CRUD operations)
// retrieve all orders
app.get("/api/magic", (req, res) => {
  res.status(200).send(orders);
});

// retrieve an order by id
app.get("/api/magic/:uid", (req, res) => {
  // get id from path param
  const orderId = parseInt(req.params.uid);
  const order = orders.find((order) => order.id == orderId);
  if (!order) {
    return res.status(404).send("Resource not found");
  }
  res.status(200).send(order);
});

// create a new order
app.post("/api/magic", (req, res) => {
  // validate the request data first
  const req_data = req.body;

  // order quantity can't exceed 3
  if (req_data.quantity > 3) {
    // return bad request
    const resJson = JSON.stringify({
      errorCode: 400,
      message: "can't order more than 3",
    });
    return res.status(400).send(resJson);
  }

  // check if same customer order more than 3 in the same month
  // we identify custmer by payment.ccNum
  const myOrders = findOrdersByCC(
    req_data.payment.ccNum,
    new Date().getMonth()
  );
  if (myOrders.length > 0) {
    // total can't more than 3
    const sum = myOrders.reduce((sum, order) => sum + order.quantity, 0);
    if (sum + req_data.quantity > 3) {
      // return bad request
      const resJson = JSON.stringify({
        errorCode: 400,
        message: "same customer can't order more than 3 in the same month",
      });
      return res.status(400).send(resJson);
    }
  }

  // save the request body along with new assigned id, orderDate, fulfilled
  const newOrder = {
    ...req_data,
    id: maxOrderId(),
    orderDate: new Date().toLocaleDateString(),
    fulfilled: false,
  };

  // add the new order to orders array
  orders.push(newOrder);
  res.status(201).send({ id: newOrder.id });
});

app.patch("/api/magic", (req, res) => {
  // get id from request body
  const orderId = req.body.id;

  const order = orders.find((order) => order.id == orderId);
  if (!order) {
    return res.status(404).send("Resource not found");
  }
  order.fulfilled = req.body.fulfilled;
  res.status(200).send("resurce updated successfully");
});

app.delete("/api/magic/:uid", (req, res) => {
  const orderId = parseInt(req.params.uid);
  const idx = orders.findIndex((order) => order.id == orderId);
  if (idx < 0) {
    return res.status(404).send("Resource not found");
  }
  // remove the order
  orders.splice(idx, 1);
  res.status(200).send("resurce deleted successfully");
});

// start listening to the server
app.listen(5000, () => {
  console.log("magic potion server is listening on port 5000:");
});
