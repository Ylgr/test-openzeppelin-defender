const { AutotaskClient } = require('defender-autotask-client');
const {readFileSync, appendFileSync} = require('fs');

async function main() {
    require('dotenv').config();
    const { TEAM_API_KEY: apiKey, TEAM_API_SECRET: apiSecret } = process.env;
    const client = new AutotaskClient({ apiKey, apiSecret });
    const {autotaskId } = await client.create({
        name: "Relay MetaTX",
        encodedZippedCode: await client.getEncodedZippedCodeFromFolder('./build/relay'),
        relayerId: '9183fb09-b2fc-4477-b8f3-c95971ba40b6',
        trigger: {
            type: 'webhook'
        },
        paused: false
    });
    console.log("Autotask created with ID ", autotaskId);
    appendFileSync('.env', `\nAUTOTASK_ID="${autotaskId}"`, function (err: Error) {
        if (err) throw err;
    });
}

if (require.main === module) {
    main().then(() => process.exit(0))
        .catch(error => { console.error(error); process.exit(1); });
}
