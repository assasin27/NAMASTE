const { importMedicalCodes } = require('./utils/csvImporter');
const path = require('path');
const fs = require('fs').promises;

async function runTests() {
    console.log('Starting CSV Import Tests\n');
    console.log('=========================');

    try {
        // Test 1: Valid CSV Import
        console.log('\nTest 1: Importing valid CSV file');
        const validFilePath = path.join(__dirname, '../data/medical_codes.csv');
        const { results: validResults, errors: validErrors } = await importMedicalCodes(validFilePath);
        
        console.log(`✓ Processed ${validResults.length} valid records`);
        console.log(`✓ Found ${validErrors.length} errors`);
        
        // Display categories summary
        const categories = [...new Set(validResults.map(r => r.category))];
        console.log('\nCategories found:', categories);

        // Test 2: Data Validation
        console.log('\nTest 2: Validating data structure');
        const sampleRecord = validResults[0];
        const requiredFields = ['code', 'namaste_code', 'description_en', 'description_hi'];
        
        const missingFields = requiredFields.filter(field => !sampleRecord[field]);
        if (missingFields.length === 0) {
            console.log('✓ All required fields present');
        } else {
            console.log('✗ Missing required fields:', missingFields);
        }

        // Test 3: Generate Statistics
        console.log('\nTest 3: Generating import statistics');
        const stats = {
            totalRecords: validResults.length,
            categoryCounts: {},
            languageSupport: {
                english: validResults.filter(r => r.description_en).length,
                hindi: validResults.filter(r => r.description_hi).length
            },
            mappedToICD11: validResults.filter(r => r.icd11_mapping).length
        };

        validResults.forEach(record => {
            stats.categoryCounts[record.category] = (stats.categoryCounts[record.category] || 0) + 1;
        });

        console.log('\nImport Statistics:');
        console.log('-----------------');
        console.log(`Total Records: ${stats.totalRecords}`);
        console.log('Records by Category:', stats.categoryCounts);
        console.log('Language Support:', stats.languageSupport);
        console.log(`ICD-11 Mappings: ${stats.mappedToICD11}`);

        // Save statistics to file
        const statsPath = path.join(__dirname, '../data/import_stats.json');
        await fs.writeFile(statsPath, JSON.stringify(stats, null, 2));
        console.log(`\n✓ Statistics saved to ${statsPath}`);

        console.log('\nAll tests completed successfully!');

    } catch (error) {
        console.error('\n✗ Test failed:', error);
        process.exit(1);
    }
}

runTests();