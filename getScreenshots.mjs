import puppeteer from 'puppeteer';
import resources from './resources.json' assert { type: 'json' };
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
    apiKey: 'AIzaSyAR3IF1-4EfpPuvjV8zO0-yvVBQqkIbyzA',
    authDomain: 'free-resources-96253.firebaseapp.com',
    projectId: 'free-resources-96253',
    storageBucket: 'free-resources-96253.appspot.com',
    messagingSenderId: '998746020785',
    appId: '1:998746020785:web:d92dedccd4c92a7c68fb90',
    measurementId: 'G-8B8B4KSVH1',
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
