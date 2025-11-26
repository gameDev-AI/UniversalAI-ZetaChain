const path = require('path');
const FileManager = require('./file_manager');
const { parseFieldFromContent } = require('./parser_manager');
const { DIRECTORIES, FIELD_NAMES } = require('../config/constants');

/**
 * User management utilities
 */
class UserManager {
    /**
     * Get user registration file path
     * @param {string} githubUser - GitHub username
     * @returns {string} Registration file path
     */
    static getRegistrationFilePath(githubUser) {
        const registrationDir = path.join(__dirname, DIRECTORIES.REGISTRATION);
        return path.join(registrationDir, `${githubUser}.md`);
    }

    /**
     * Check if user is registered
     * @param {string} githubUser - GitHub username
     * @returns {boolean} Whether user is registered
     */
    static isUserRegistered(githubUser) {
        const registrationFile = this.getRegistrationFilePath(githubUser);
        return FileManager.readFileContent(registrationFile) !== '';
    }

}

module.exports = UserManager;