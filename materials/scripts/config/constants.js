/**
 * Configuration constants
 */

// Directory path configuration
const DIRECTORIES = {
    REGISTRATION: '../../../registration',
    SUBMISSION: '../../../submission',
    SCRIPTS: __dirname
};

// File name configuration
const FILE_NAMES = {
    README: '../../README.md'
};

// Field name configuration
const FIELD_NAMES = {
    // Registration fields
    REGISTRATION: {
        NAME: '姓名',
        DESCRIPTION: '简介',
        CONTACT: '联系方式',
        WALLET_ADDRESS: '钱包地址',
        TEAM_WILLINGNESS: '需要组队',
        AVATAR_URL: '头像链接'
    },
    // Project submission fields
    SUBMISSION: {
        PROJECT_NAME: '项目名称',
        PROJECT_DESCRIPTION: '项目描述',
        PROJECT_LEADER: '项目负责人',
        REPOSITORY_URL: '仓库地址',
        TEAM_MEMBERS_WALLET: '团队成员钱包'
    }
};

// Required fields configuration
const REQUIRED_FIELDS = {
    REGISTRATION: [
        FIELD_NAMES.REGISTRATION.NAME,
        FIELD_NAMES.REGISTRATION.DESCRIPTION,
        FIELD_NAMES.REGISTRATION.CONTACT
    ],
    SUBMISSION: [
        FIELD_NAMES.SUBMISSION.PROJECT_NAME,
        FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION,
        FIELD_NAMES.SUBMISSION.PROJECT_LEADER
    ]
};


// GitHub related configuration
const GITHUB_CONFIG = {
    REPO_URL: 'https://github.com/CasualHackathon/UniversalAI-ZetaChain', // TODO: Replace with actual repository URL
    ISSUE_TITLE_PREFIXES: {
        REGISTRATION: '报名参赛',
        SUBMISSION: '参赛项目提交'
    }
};

// README update markers
const README_MARKERS = {
    REGISTRATION: {
        START: '<!-- Registration start -->',
        END: '<!-- Registration end -->'
    },
    SUBMISSION: {
        START: '<!-- Submission start -->',
        END: '<!-- Submission end -->'
    }
};


module.exports = {
    DIRECTORIES,
    FILE_NAMES,
    FIELD_NAMES,
    REQUIRED_FIELDS,
    GITHUB_CONFIG,
    README_MARKERS
};