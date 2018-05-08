


let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('easy-table');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'monadarling',
    database: 'bamazon'
});


connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected as id' + connection.threadId);
    startBuying();
});

function print (res) {

    var t = new Table;

    res.forEach(function(product) {
        t.cell('Item Id', product.item_id);
        t.cell('Product Name', product.product_name);
        t.cell('Department', product.department_name);
        t.cell('Price, USD', product.price, Table.number(2));
        t.cell('Stock Quantity', product.stock_quantity);
        t.newRow()
    })
    console.log(t.toString());




    var startBuying = function() {
    connection.query('SELECT * FROM products', function(err, res) {
        printStuff(res);
        var choiceArray = [];
        for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].product_name);
        }

        inquirer.prompt([{
            name: "item",
            type: "input",
            message: 'Which item would you like to purchase?'
        },
            { name:'quantity',
                type: 'input',
                message: "How many would you like to purchase?"

            }]).then(function(answer) {
            console.log(res);
            console.log(answer);
            var itemID = answer.item;
            console.log(itemID);
            var chosenItem = res[itemID-1];
            console.log(chosenItem);
            var newQuantity = chosenItem.stock_quantity - answer.quantity;
            if(newQuantity >= 0){
                connection.query("UPDATE products SET ? WHERE item_id = ?",[{stock_quantity: newQuantity}, itemID],function(err,response) { if (err){
                    throw err
                }
                    console.log(response);
                });
                startBuying();
            } else {
                console.log('there are not enough in stock for you to purchase that many items.');
            }
        })
    })


};




