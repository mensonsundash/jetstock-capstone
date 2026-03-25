const { Sequelize } = require('../config/db.config');
const Models  = require('../models');

/**
 * Function to get all orders list
 */
const getAllOrders = async (req, res) => {
    try{
        // fetching order table and joining related table with alias as: customer, orderItem & 
        // nested table include inside orderItem as product
        const orders = await Models.Order.findAll({
            include: [
                { model: Models.Customer, as: 'customer'},
                { model: Models.OrderItem, as: 'items', include:[
                    {model: Models.Product, as: 'product'}
                ]}
            ],
            order: [["created_at", "DESC"]]
        });// using sequelize model findAll function to fetch from order table

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Order fetched successfully', data: orders })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch order', error: error.message })
    }
}

/**
 * Function to get a order by its id
 */
const getOrderById = async (req, res) => {
    try{

        const orderId = req.params.id; // getting id from params provided on request

        const order = await Models.Order.findByPk(orderId, {
            include: [
                { model: Models.Customer, as: 'customer'},
                { model: Models.OrderItem, as: 'items', include:[
                    {model: Models.Product, as: 'product'}
                ]}
            ]
        }); // using sequelize find by primary key

        //checking if order not exist and stop : Code 404: Not Found
        if(!order) return res.status(404).json({ message: "Order not found"})

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Order fetched successfully', data: order })
    } catch(error) {
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to fetch order', error: error.message })
    }
}

/**
 * Function to create a order 
 * Transaction session used to succeed together or fail together
 */
const createOrder = async (req, res) => {
    //opening database transaction session
    const transaction = await Sequelize.transaction();
    try{
        // destructure data from requested body value
        const { user_id, customer_id, order_date, status, items } = req.body;

        if(!user_id || !customer_id || !items  || !Array.isArray(items) || items.length === 0){
                //Code 400: Bad Request -> missing/invalid body
                return res.status(400).json({ message: 'All order fields are required'})
            
        }

        let total_amount = 0;// intialize total_amount = 0

        // iterating over iterable values of items listed in order
        for(const item of items) {
            //Validating all item before creating order

            const product = await Models.Product.findByPk(item.product_id, { transaction });
            
            // check if each product exists
            if(!product) {
                await transaction.rollback();

                return res.status(404).json({message: `Product not found: ${item.product_id}`});
            }

            //get stock record for each product from inventory
            const inventory = await Models.Inventory.findOne({
                where: { product_id: item.product_id },
                transaction
            });

            // check stock availability to prevent selling more item than stocked items
            if(!inventory || inventory.quantity_on_hand < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({message: `Insufficient stock for the product ${ item.product_id }`})
            }

            // calculating total price against quantities of all items
            total_amount += Number(product.price) * Number(item.quantity);

        }

        // Parent: order record creation
        const order = await Models.Order.create({
                user_id,
                customer_id,
                order_date: order_date || new Date(),
                status: status || "pending",
                total_amount
            }, 
            { transaction }
        );

        if(order){
            // iterating over iterable values of items listed in order
            for(const item of items) {
                const product = await Models.Product.findByPk(item.product_id, { transaction });
                const sub_total = Number(product.price) * Number(item.quantity);

                // orderItems record creation
                const orderItem = await Models.OrderItem.create(
                    {
                        order_id: order.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        unit_price: product.price,
                        sub_total
                    },
                    { transaction }
                );

                const inventory = await Models.Inventory.findOne({
                    where: { product_id: item.product_id },
                    transaction
                });

                inventory.quantity_on_hand -= Number(item.quantity);
                await inventory.save({ transaction }); // updating inventory data

                // stockmovement record creation
                await Models.StockMovement.create({
                        product_id: item.product_id,
                        user_id,
                        order_item_id: orderItem.id,
                        movement_type: "OUT",
                        source_type: "ONLINE",
                        quantity: item.quantity,
                        note: "Stock deducted from online order",
                        movement_date: new Date(),
                    },
                    { transaction }
                );
            }

            // at end commiting all affect and finalizing that 
            // order, orderItems, inventory update, and stock movement all succeed together
            await transaction.commit();

            //Success Response Code 201: Created -> POST create
            return res.status(201).json({ message: 'Order created successfully', data: order })
        }
    
    } catch(error) {
        //partial transaction state resolved
        await transaction.rollback();
        //Error Response code 500: Internal server error -> unhandled exception
        res.status(500).json({ message: 'Failed to create order', error: error.message })
    }
}
/**
 * Function to update order by its id
 */
const updateOrderStatus = async (req, res) => {
    try{
        const { id } = req.params; // getting id from params provided on request
        const { status } = req.body;

        const order = await Models.Order.findByPk(id); // using sequelize find by primary key

        // checking if order not exist and stop : Code 404: Not Found
        if(!order) return res.status(404).json({ message: "Order not found"});

        
        //update order row with order id and replicate body data 
        const updatedOrder = await Models.Order.update(
            { status },
            {where:{id: order.id} }
        );

        //Success Response code 200: OK -> Success
        res.status(200).json({ message: 'Order status updated successfully', data: updatedOrder })
    } catch(error) {
        //Error Response: with status code and json error message
        res.status(500).json({ message: 'Failed to update order status', error: error.message })
    }
}

/**
 * Function to get delete order by its id
 */
const deleteOrder = async (req, res) => {
    try{
        const { id } = req.params;
        
        const order = await Models.Order.findByPk(id); // using sequelize find by primary key

        // checking if order not exist and stop : Code 404: Not Found
        if(!order) return res.status(404).json({ message: "Order not found"})

        await Models.Order.destroy({where: {id: order.id}});
        res.status(200).json({message: 'Order deleted successfully', data: order});

    } catch(error) {
        //Error Response: with status code and json error message
        res.status(500).json({ message: 'Failed to delete order', error: error.message })
    }
}

// make available to import
module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder
}