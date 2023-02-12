import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import v1ProdRouter from './routes/v1/productsRoutes.js';
import v1CartRouter from './routes/v1/cartRoutes.js';
import v1UserRouter from './routes/v1/userRoutes.js';
import error404 from './middleware/error404.js';
import dbConnect from './config/MongoConnect.js';
import { strategyLogin } from './middleware/passport.js';
import { isAuth } from './middleware/isAuth.js';

const PORT = process.env.PORT || 8080;

const app = express();

passport.use('login', strategyLogin);

app.use(
	session({
		secret: process.env.PASSPORT_SECRET,
		cookie: {
			httpOnly: false,
			secure: false,
			maxAge: 600000,
		},
		rolling: true,
		resave: true,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use('/', express.static('./src/views'))
	.use('/users/menu', express.static('./src/views/uploads/userAvatar'))
	.set('view engine', 'ejs')
	.set('views', './src/views')
	.use('/users', v1UserRouter)
	.use('/api/v1/productos', isAuth, v1ProdRouter)
	.use('/api/v1/carrito', isAuth, v1CartRouter)
	.use(error404);

const connection = async () => {
	await dbConnect();
	const serverOn = app.listen(PORT, () => {
		console.log(
			`***** 🚀 Servidor funcionando en http://localhost:${PORT} *****`
		);
	});
	serverOn.on('error', err => {
		console.log(`⚠️ Error en el servidor ===> ${err?.message}`);
	});
};

connection();
