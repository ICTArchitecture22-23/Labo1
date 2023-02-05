const AWS = require('aws-sdk');
const readline = require('readline-sync');

// make sure to add an .env file with your credentials if you have not assumed a role
// AWS_ACCESS_KEY_ID=your_access_key
// AWS_SECRET_ACCESS_KEY=your_secret_key
// AWS_SESSION_TOKEN=your_session_token

require('dotenv').config();

const s3 = new AWS.S3();

const menu = [
    'Maak een bucket', 
    'Lijst alle buckets op',
    'Lijst bestanden in bucket op', 
    'Verwijder een bucket', 
];

async function execMenu() {
    const menuChoice = readline.keyInSelect(menu, 'Maak een keuze: ', {cancel: 'Stop'});

    switch (menuChoice) {
        case 0:
            await createBucket();
            break;
        case 1:
            await listAllBuckets();
            break;
        case 2:
            await listFilesInBucket();
            break;
        case 3:
            await deleteBucket();
            break;
        default:
            console.log('Stop');
            process.exit(0);
    }
}

execMenu();

async function createBucket() {
    console.log('Maak een bucket');
    const bucketName = readline.question('Geef een naam voor de bucket: ');
    // create bucket using aws-sdk
    try { 
        const data = await s3.createBucket({Bucket: bucketName}).promise();
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

async function listAllBuckets() {
    console.log('Lijst alle buckets op');
    
    try {
        const data = await s3.listBuckets().promise();
        console.log('Er zijn ' + data.Buckets.length + ' buckets');
        console.log(data.Buckets.map(x => x.Name));
    } catch (err) {
        console.log(err);
    }
}

async function listFilesInBucket() {
    console.log('Lijst bestanden in bucket op');
    
    try {
        const buckets = (await s3.listBuckets().promise()).Buckets.map(x => x.Name);
        const bucketIndex = readline.keyInSelect(buckets, 'Kies een bucket: ', {cancel: 'Stop'});

        const data = await s3.listObjects({Bucket: buckets[bucketIndex]}).promise();
        
        console.log('Er zijn ' + data.Contents.length + ' bestanden in de bucket: ' + buckets[bucketIndex]);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

async function deleteBucket() {
    console.log('Verwijder een bucket');
    const buckets = (await s3.listBuckets().promise()).Buckets.map(x => x.Name);
    const bucketIndex = readline.keyInSelect(buckets, 'Kies een bucket: ');

    try {
        const data = await s3.deleteBucket({Bucket: buckets[bucketIndex]}).promise()
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}