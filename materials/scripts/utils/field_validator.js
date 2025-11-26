/**
 * Field validation utilities
 */

const {
    parseFieldFromContent
} = require('./parser_manager');
const {
    REQUIRED_FIELDS
} = require('../config/constants');

class FieldValidator {
    /**
     * Validate required fields
     * @param {string} issueBody - Issue content
     * @param {string} type - Type (REGISTRATION or SUBMISSION)
     * @returns {void} Continue if validation passes, throw error if fails
     */
    static validateRequiredFields(issueBody, type) {
        const requiredFields = REQUIRED_FIELDS[type];
        if (!requiredFields) {
            throw new Error(`Unknown type: ${type}`);
            process.exit(1);
        }

        const missingFields = [];

        for (const fieldName of requiredFields) {
            const value = parseFieldFromContent(issueBody, fieldName);
            if (!value || value.trim() === '') {
                missingFields.push(fieldName);
            }
        }

        if (missingFields.length > 0) {
            const errorMessage = this.generateValidationErrorMessage(type, missingFields);

            // Write both script_success and error_message to environment variable for workflow use
            if (process.env.GITHUB_OUTPUT) {
                const fs = require('fs');
                // Set script_success to false first
                fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=false\n`);
                // Then set error_message
                fs.appendFileSync(process.env.GITHUB_OUTPUT, `error_message<<EOF\n${errorMessage}\nEOF\n`);
            }
            // Also output to console
            console.error('ERROR_MESSAGE:', errorMessage);

            console.error(`Field validation failed: ${missingFields.join(', ')}`);
            process.exit(1);
        }
    }

    /**
     * Generate field validation error message
     * @param {string} type - Type
     * @param {Array} missingFields - Missing fields
     * @returns {string} Error message
     */
    static generateValidationErrorMessage(type, missingFields) {
        let errorMessage = `❌ **字段验证失败**\n\n`;
        errorMessage += `**缺少必填字段：** ${missingFields.join('、')}\n\n`;
        errorMessage += `请填写所有必填字段后重新提交。`;

        return errorMessage;
    }

    /**
     * Check if user is registered
     * @param {string} githubUser - GitHub username
     * @param {Object} UserManager - User manager
     * @param {Object} FileManager - File manager
     * @returns {void} Continue if registered, throw error if not
     */
    static checkUserRegistration(githubUser, UserManager, FileManager) {
        const registrationFile = UserManager.getRegistrationFilePath(githubUser);
        const isRegistered = FileManager.fileExists(registrationFile);

        if (!isRegistered) {
            const errorMessage = `❌ **用户未报名**\n\n` +
                `用户 \`${githubUser}\` 尚未报名参加本次黑客松。`;

            // Write both script_success and error_message to environment variable for workflow use
            if (process.env.GITHUB_OUTPUT) {
                const fs = require('fs');
                // Set script_success to false first
                fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=false\n`);
                // Then set error_message
                fs.appendFileSync(process.env.GITHUB_OUTPUT, `error_message<<EOF\n${errorMessage}\nEOF\n`);
            }
            // Also output to console
            console.error('ERROR_MESSAGE:', errorMessage);

            // throw new Error(`User ${githubUser} not registered`);
            console.error(`用户 ${githubUser} 未报名`);
            process.exit(1);
        }
    }
}

module.exports = FieldValidator;