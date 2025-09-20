const { importMedicalCodes } = require('./utils/csvImporter');
const path = require('path');

async function testCsvImport() {
    try {
        console.log('Testing CSV import...');
        const filePath = path.join(__dirname, '../data/sample_codes.csv');
        
        const { results, errors } = await importMedicalCodes(filePath);
        
        console.log('\nImport Results:');
        console.log('-----------------');
        console.log(`Total Records: ${results.length}`);
        console.log(`Errors: ${errors.length}`);
        
        if (results.length > 0) {
            console.log('\nSample Record:');
            console.log(JSON.stringify(results[0], null, 2));
        }
        
        if (errors.length > 0) {
            console.log('\nErrors encountered:');
            errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error.message}`);
            });
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testCsvImport();