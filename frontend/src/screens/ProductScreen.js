import React from 'react';
import { useParams } from 'react-router';

import products from '../products.js';
const ProductScreen = () => {
	let { id } = useParams();

	const product = products.filter((product) => product._id == id);

	return (
		<div>
			<h1>Product Name: {product[0].name}</h1>
		</div>
	);
};

export default ProductScreen;
