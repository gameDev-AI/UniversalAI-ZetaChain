const path = require('path');
const FileManager = require('./file_manager');
const { README_MARKERS, GITHUB_CONFIG } = require('../config/constants');

/**
 * README management utilities
 */
class ReadmeManager {
    /**
     * Update content in specified section of CONTRIBUTING.md
     * @param {string} sectionType - Section type ('REGISTRATION' or 'SUBMISSION')
     * @param {string} tableContent - Table content
     */
    static updateReadmeSection(sectionType, tableContent) {
        const contributingPath = path.join(__dirname, '../../../CONTRIBUTING.md');
        const markers = README_MARKERS[sectionType];

        if (!markers) {
            throw new Error(`Unknown section type: ${sectionType}`);
        }

        let contributingContent = FileManager.readFileContent(contributingPath);

        const updatedContent = contributingContent.replace(
            new RegExp(`(${this.escapeRegex(markers.START)})[\\s\\S]*?(${this.escapeRegex(markers.END)})`, 'g'),
            `$1\n${tableContent}\n$2`
        );

        FileManager.writeFileContent(contributingPath, updatedContent);
        console.log(`CONTRIBUTING.md ${sectionType} section updated`);
    }

    /**
     * Escape regex special characters
     * @param {string} string - String to escape
     * @returns {string} Escaped string
     */
    static escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    }

    /**
     * Generate GitHub Issue URL
     * @param {string} title - Issue title
     * @param {string} body - Issue content
     * @returns {string} Issue URL
     */
    static generateIssueUrl(title, body) {
        const encodedTitle = encodeURIComponent(title);
        const encodedBody = encodeURIComponent(body);
        return `${GITHUB_CONFIG.REPO_URL}/issues/new?title=${encodedTitle}&body=${encodedBody}`;
    }

}

module.exports = ReadmeManager;