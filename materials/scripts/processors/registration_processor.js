const path = require('path');
const FileManager = require('../utils/file_manager');
const { parseFieldFromContent } = require('../utils/parser_manager');
const UserManager = require('../utils/user_manager');
const ReadmeManager = require('../utils/readme_manager');
const FieldValidator = require('../utils/field_validator');
const { DIRECTORIES, FIELD_NAMES, GITHUB_CONFIG } = require('../config/constants');

/**
 * Registration processor
 */
class RegistrationProcessor {
    /**
     * Process registration request
     * @param {string} issueBody - Issue content
     * @param {string} githubUser - GitHub username
     * @param {string} avatarUrl - User avatar URL
     */
    static processRegistration(issueBody, githubUser, avatarUrl) {
        console.log('Starting registration processing...');

        // Validate required fields
        FieldValidator.validateRequiredFields(issueBody, 'REGISTRATION');

        // Save original issue content with avatar URL
        this.createRegistrationFile(githubUser, issueBody, avatarUrl);

        // Update README table
        this.updateRegistrationTable();

        console.log('Registration processing completed');
    }


    /**
     * Create registration file
     * @param {string} githubUser - GitHub username
     * @param {string} originalIssueBody - Original issue content
     * @param {string} avatarUrl - User avatar URL
     */
    static createRegistrationFile(githubUser, originalIssueBody, avatarUrl) {
        const filePath = UserManager.getRegistrationFilePath(githubUser);
        // Append avatar URL to the file content
        const contentWithAvatar = avatarUrl ?
            `${originalIssueBody}\n\n**${FIELD_NAMES.REGISTRATION.AVATAR_URL}**\n> ${avatarUrl}` :
            originalIssueBody;
        FileManager.saveFile(filePath, contentWithAvatar, 'Registration information written');
    }

    /**
     * Update registration table
     */
    static updateRegistrationTable() {
        const registrationDir = path.join(__dirname, DIRECTORIES.REGISTRATION);
        const files = FileManager.getDirectoryFiles(registrationDir, '.md');

        const rows = files.map(file => {
            const filePath = path.join(registrationDir, file);
            const content = FileManager.readFileContent(filePath);

            // Try to parse fields, skip if parsing fails
            try {
                const name = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.NAME);
                const description = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.DESCRIPTION);
                const contact = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.CONTACT);
                const walletAddress = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.WALLET_ADDRESS);
                const teamWillingness = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.TEAM_WILLINGNESS);
                const avatarUrl = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.AVATAR_URL);

                // Skip this file if parsing fails or key fields are empty
                if (!name || !contact || !walletAddress) {
                    console.log(`Skipping file ${file}: parsing failed or missing key fields`);
                    return null;
                }

                return {
                    name,
                    description,
                    contact,
                    walletAddress,
                    teamWillingness,
                    avatarUrl,
                    fileName: file
                };
            } catch (error) {
                console.log(`Skipping file ${file}: parsing failed - ${error.message}`);
                return null;
            }
        }).filter(Boolean); // Filter out null values

        // Sort by name alphabetically
        rows.sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });

        // Generate table content directly
        let table = '| 头像 | 姓名 | 简介 | 联系方式 | 组队意愿 | 操作 |\n| ---- | ---- | ----------- | ------- | ---------------- | ------- |\n';

        rows.forEach((row) => {
            const issueTitle = `${GITHUB_CONFIG.ISSUE_TITLE_PREFIXES.REGISTRATION} - ${row.name}`;

            // Read MD file content directly as body for edit link
            const githubUser = row.fileName.replace('.md', '');
            const filePath = UserManager.getRegistrationFilePath(githubUser);
            const issueBody = FileManager.readFileContent(filePath);

            const issueUrl = ReadmeManager.generateIssueUrl(issueTitle, issueBody);

            // Format avatar separately
            const avatar = row.avatarUrl ?
                `<img src="${row.avatarUrl}" width="30" height="30" style="border-radius: 50%; vertical-align: middle;" />` :
                '';

            table += `| ${avatar} | ${row.name} | ${row.description} | ${row.contact} | ${row.teamWillingness} | [编辑](${issueUrl}) |\n`;
        });

        ReadmeManager.updateReadmeSection('REGISTRATION', table);
    }

}

module.exports = RegistrationProcessor;