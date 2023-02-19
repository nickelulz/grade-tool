import puppeteer, { Page } from 'puppeteer'
import cheerio from 'cheerio'

const base_url = 'https://home-access.cfisd.net/HomeAccess';

export async function login (student_id: string, password: string) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Go to my.cfisd.net
	await page.goto('https://my.cfisd.net');
	await page.setViewport({width: 1080, height: 1024});

	// Log into my.cfisd.net and click on sign in
	await page.type('#username', student_id);
	await page.type('#password', password);
	await page.click('#signin');

	// Click on the home access center application
	const home_access_selector = '[aria-label="Student Home Access Center"]';
	await page.waitForSelector(home_access_selector);
	await page.click(home_access_selector);

	// Return home access center frontpage
	return page;
} 

export async function load_ipr (page: Page) {
	await page.goto(base_url + '/Grades/IPR');

	const html = await page.content();

	console.log(html);

	const $ = cheerio.load(html);

	let ipr: any[] = [];

	// Loops through each row and column 
	// $('.sg-asp-table-data-row').each((i, row) => {
	// 	ipr.push({
	// 		course: row.children("td:nth-child(1)").text().trim(),
	// 		class: row.children("td:nth-child(2) > a").text().trim(),
	// 		period: row.children("td:nth-child(3)").text().trim(),
	// 		teacher: row.children("td:nth-child(4) > a").text().trim(),
	// 		room: row.children("td:nth-child(5)").text().trim(),
	// 	});
	// });

	return ipr;
}

export async function load_classwork (page: Page) {
	await page.goto(base_url + '/Classes/Classwork');

	const html = await page.content();
	const $ = cheerio.load(html);

	let current_grades: any[] = [];

	// Loops through each row and column 
	// $('table > tbody').each((i, row) => {
	// 	const topLeft = row.children('td:nth-child(1)')
	// 		.children('div:nth-child(1)');

	// 	current_grades.push({
	// 		course: topLeft.children('div:nth-child(2) > div:nth-child(1)').text().trim(),
	// 		class: topLeft.children("#courseName").text().trim(),
	// 		period: row.children("td:nth-child(3)").text().trim(),
	// 		teacher: row.children("td:nth-child(4) > a").text().trim(),
	// 		room: row.children("td:nth-child(5)").text().trim(),
	// 	});
	// });

	return current_grades;
}

export async function load_transcript (page: Page) {
	await page.goto(base_url + '/Grades/Transcript');

	const html = await page.content();
	let transcript: any[] = [];

	return transcript;
}