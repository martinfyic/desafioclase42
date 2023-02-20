import * as orderService from '../services/orderService.js';

export const getAllOrders = async (req, res) => {
	const { limit, since } = req.params;
	const allOrders = await orderService.getAllOrders(limit, since);
	res.send(allOrders);
};

export const createNewOrder = async (req, res) => {
	const { idCart } = req.body;
	const { user } = req;

	const order = await orderService.createNewOrder(idCart, user);
	res.status(201).render('order', { title: '⚡ Orden de compra', order });
};
