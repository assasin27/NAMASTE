const fs = require('fs');
const csv = require('csv-parser');
const { Transform } = require('stream');

class MedicalCodeParser extends Transform {
    constructor(options = {}) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        try {
            // Normalize data
            const normalizedData = {
                code: chunk.code?.trim(),
                namaste_code: chunk.namaste_code?.trim(),
                description_en: chunk.description_en?.trim(),
                description_hi: chunk.description_hi?.trim(),
                category: chunk.category?.trim(),
                subcategory: chunk.subcategory?.trim(),
                tags: chunk.tags?.split(',').map(tag => tag.trim()),
                icd11_mapping: chunk.icd11_mapping?.trim(),
                last_updated: chunk.last_updated || new Date().toISOString()
            };

            // Validate required fields
            if (!normalizedData.code || !normalizedData.description_en) {
                console.warn('Skipping invalid record:', chunk);
                callback();
                return;
            }

            this.push(normalizedData);
            callback();
        } catch (error) {
            console.error('Error processing record:', error);
            callback(error);
        }
    }
}

async function importMedicalCodes(filePath) {
    const results = [];
    const errors = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .on('error', (error) => {
                console.error(`Error reading file ${filePath}:`, error);
                reject(error);
            })
            .pipe(csv())
            .pipe(new MedicalCodeParser())
            .on('data', (data) => results.push(data))
            .on('error', (error) => errors.push(error))
            .on('end', () => {
                console.log(`Processed ${results.length} records`);
                if (errors.length > 0) {
                    console.warn(`Encountered ${errors.length} errors during processing`);
                }
                resolve({ results, errors });
            });
    });
}

module.exports = {
    importMedicalCodes,
    MedicalCodeParser
};