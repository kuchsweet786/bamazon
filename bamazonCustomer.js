

var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: '',
    database: 'Bamazon'
});


function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole number.';
    }
}


function promptUserPurchase() {

    inquirer.prompt(
        {
            type: 'input',
            name: 'item_id',
            message: 'Please enter the Item ID which you would like to buy.',
            validate: validateInput,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many do you need?',
            validate: validateInput,
            filter: Number
        }
    ).then(function(input) {


        var item = input.item_id;
        var quantity = input.quantity;


        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {item_id: item}, function(err, data) {
            if (err) throw err;



            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                displayInventory();

            } else {
                var productData = data[0];


                if (quantity <= productData.stock_quantity) {
                    console.log('Congratulations, the product you requested is in stock!');


                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;



                    connection.query(updateQueryStr, function(err, data) {
                        if (err) throw err;

                        console.log('Your oder has been placed! Your total is $' + productData.price * quantity);



                        connection.end();
                    })
                } else {
                    console.log('Sorry, out of stock.');


                    displayInventory();
                }
            }
        })
    })
}


function displayInventory() {



    queryStr = 'SELECT * FROM products';


    connection.query(queryStr, function(err, data) {
        if (err) throw err;



        var strOut = '';
        for (var i = 0; i < data.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + data[i].item_id + '  //  ';
            strOut += 'Product Name: ' + data[i].product_name + '  //  ';
            strOut += 'Department: ' + data[i].department_name + '  //  ';
            strOut += 'Price: $' + data[i].price + '\n';

            console.log(strOut);
        }

        promptUserPurchase();
    })
}


function runBamazon() {

    displayInventory();
}


runBamazon();
