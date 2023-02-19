import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import puppeteer, { Page } from 'puppeteer';
import { 
	login, 
	load_ipr, 
	load_classwork, 
	load_transcript 
} from './hac_interface';
import path from 'path';

const server: Express = express();
const PORT: number = parseInt( process.env.PORT || "5000", 10 );
const staticdir = path.join(__dirname, '/public/pages/');

declare module 'express-session' {
	export interface SessionData {
		logged_in: boolean,
		error: boolean,
		ipr: {},
		classwork: {},
		transcript: {}
	}
}

server.use(express.static(path.join(__dirname, 'public')));

server.use(session({
	secret: 'secret_key',
	resave: true,
	saveUninitialized: true
}));

server.get('/', (req: Request, res: Response) => {
	res.sendFile(staticdir + 'login.html');
});

server.get('/index', (req: Request, res: Response) => {
	if (!('logged_in' in req.session) || !req.session.logged_in)
		res.redirect('/');
	else
		res.sendFile(staticdir + 'index.html');
});

server.post('/home', (req: Request, res: Response) => {
	console.log(req.body);

	const student_id = req.body["student_id"];
	const password = req.body["password"];

	if (student_id && password) {
		let hac_page;

		login(student_id, password)
		.then(data => {
			hac_page = data;
			req.session.logged_in = true;
		})
		.catch(error => {
			req.session.error = true;
			console.log(error);
		});

		if (req.session.logged_in && hac_page != undefined) {
			load_ipr(hac_page)
			.then(data => {
				req.session.ipr = data;
			})
			.catch(error => {
				req.session.error = true;
				console.log(error);
			});

			load_classwork(hac_page)
			.then(data => {
				req.session.classwork = data
			})
			.catch(error => {
				req.session.error = true;
				console.log(error);
			});

			load_transcript(hac_page)
			.then(data => {
				req.session.transcript = data;
			})
			.catch(error => {
				req.session.error = true;
				console.log(error);
			});
		}

		res.redirect('/index');
	}

	else {
		res.send('Please enter Student ID and Password!');
		res.end();
	}
});

// Not Found
server.use('/', (req: Request, res: Response) => {
	res.status(404).sendFile(staticdir + 'not-found.html');		
}); 

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
})
