import puppeteer from 'puppeteer';
import resources from './resources.json' assert { type: 'json' };
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import fs from 'fs';
import path from 'path';
import {config} from 'dotenv';
config();

console.log(process.env);

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const browser = await puppeteer.launch();
const page = await browser.newPage();

if (!fs.existsSync("/tmp")) {
    fs.mkdirSync("/tmp");
}

const types = Object.keys(resources);

for (const type of types) {
    for (const item of resources[type]) {
        const { url, title } = item;
        if (url.includes("youtu")) {
            continue;
        }
        const fileName =
            (title?.toLowerCase()?.replace(/\s+/g, "_") ??
                url.replace(/https?:\/\//, "").replace(/\//g, "_")) + ".webp";
        try {
            await getDownloadURL(ref(storage, `screenshots/${type}/${fileName}`));
            console.log(`Screenshot already exists for ${fileName}`);
            continue;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            await page.goto(url);
            const filePath = path.join("/tmp", fileName);
            await page.screenshot({ path: filePath });
            const fileRef = ref(storage, `screenshots/${type}/${fileName}`);
            await uploadBytes(fileRef, fs.readFileSync(filePath));
            console.log(`Uploaded ${fileName}`);
        }
    }
}

await page.close();
await browser.close();
