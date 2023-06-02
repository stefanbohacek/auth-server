import fs from 'fs';
import * as dotenv from 'dotenv';
import app from './app.js';

if (fs.existsSync('.env')){
    dotenv.config();
}

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${listener.address().port}...`);
});
