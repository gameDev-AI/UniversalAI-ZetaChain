#!/usr/bin/env node

/**
 * Update links in CONTRIBUTING.md
 */

const fs = require('fs');
const path = require('path');
const { FIELD_NAMES, GITHUB_CONFIG, REQUIRED_FIELDS } = require('./config/constants');

// Get command line arguments
const args = process.argv.slice(2);
const repoUrl = args[0] || GITHUB_CONFIG.REPO_URL;

console.log('🔗 Updating links in CONTRIBUTING.md...');
console.log(`📦 Repository URL: ${repoUrl}`);

// Function to generate links
function generateIssueUrl(title, body) {
    const encodedTitle = encodeURIComponent(title);
    const encodedBody = encodeURIComponent(body);
    return `${repoUrl}/issues/new?title=${encodedTitle}&body=${encodedBody}`;
}

const NOTE = `> 📝 **请在 ">" 后填写内容**`;

// Generate fields with required markers
function generateFieldWithRequired(fieldName, description, fieldType) {
    const requiredFields = REQUIRED_FIELDS[fieldType];
    const isRequired = requiredFields.includes(fieldName);
    const requiredMark = isRequired ? ' | 必填' : '';
    return `**${fieldName}** (${description}${requiredMark})`;
}

// Generate registration link
const registrationLink = generateIssueUrl(`${GITHUB_CONFIG.ISSUE_TITLE_PREFIXES.REGISTRATION} - New`, `## 报名参赛

${NOTE}

${generateFieldWithRequired(FIELD_NAMES.REGISTRATION.NAME, '请输入您的全名', 'REGISTRATION')}
>

${generateFieldWithRequired(FIELD_NAMES.REGISTRATION.DESCRIPTION, '简要的个人介绍，包括技能和经验', 'REGISTRATION')}
>

${generateFieldWithRequired(FIELD_NAMES.REGISTRATION.CONTACT, '格式：联系方式：联系账号，例如：Telegram: @username，微信: username，邮箱: email@example.com', 'REGISTRATION')}
>

${generateFieldWithRequired(FIELD_NAMES.REGISTRATION.WALLET_ADDRESS, '您在以太坊主网的钱包地址或 ENS 域名', 'REGISTRATION')}
>

${generateFieldWithRequired(FIELD_NAMES.REGISTRATION.TEAM_WILLINGNESS, '选择一项：是 | 否 | 可能', 'REGISTRATION')}
>`);

// Generate submission link
const submissionLink = generateIssueUrl(`${GITHUB_CONFIG.ISSUE_TITLE_PREFIXES.SUBMISSION} - New`, `## 参赛项目提交

${NOTE}

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.PROJECT_NAME, '请输入您的项目名称', 'SUBMISSION')}
>

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION, '用一句话简要描述您的项目', 'SUBMISSION')}
>

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.REPOSITORY_URL, '开源仓库地址 - 项目必须开源', 'SUBMISSION')}
>

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.PROJECT_LEADER, '项目负责人姓名', 'SUBMISSION')}
>

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.PROJECT_MEMBERS, '列出所有团队成员，用逗号分隔', 'SUBMISSION')}
>

${generateFieldWithRequired(FIELD_NAMES.SUBMISSION.TEAM_MEMBERS_WALLET, '列出所有团队成员的钱包地址，用逗号分隔，例如：Alice:0x12345...，Bob:0x12345...', 'SUBMISSION')}
>`);

console.log('\n📝 Generated links:');
console.log('Registration link:', registrationLink);
console.log('Submission link:', submissionLink);

// Read CONTRIBUTING.md file
const contributingPath = path.join(__dirname, '../../CONTRIBUTING.md');
let contributingContent = fs.readFileSync(contributingPath, 'utf8');

// Update registration link (replace all content between comment markers)
const registrationPattern = /(<!-- Registration link start -->)[\s\S]*?(<!-- Registration link end -->)/;
const newRegistrationContent = `$1\n[报名 ➡️](${registrationLink})\n$2`;
contributingContent = contributingContent.replace(registrationPattern, newRegistrationContent);

// Update submission link (replace all content between comment markers)
const submissionPattern = /(<!-- Submission link start -->)[\s\S]*?(<!-- Submission link end -->)/;
const newSubmissionContent = `$1\n\n[提交 ➡️](${submissionLink})\n\n$2`;
contributingContent = contributingContent.replace(submissionPattern, newSubmissionContent);

// Write back to file
fs.writeFileSync(contributingPath, contributingContent, 'utf8');

console.log('\n✅ CONTRIBUTING.md links update completed!');
console.log('📄 File path:', contributingPath);