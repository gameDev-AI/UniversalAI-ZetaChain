/**
 * Submission table update script
 * 
 * Used to update submission table in CONTRIBUTING.md
 */

const SubmissionProcessor = require('./processors/submission_processor');

// Debug output
console.log('Starting submission table update...');

try {
    // Update submission table
    SubmissionProcessor.updateSubmissionTable();

    // Set script_success to true when processing completes successfully
    if (process.env.GITHUB_OUTPUT) {
        const fs = require('fs');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=true\n`);
    }

    console.log('✅ 提交表格更新完成');
} catch (error) {
    // Set script_success to false when processing fails
    if (process.env.GITHUB_OUTPUT) {
        const fs = require('fs');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=false\n`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `error_message<<EOF\n❌ **处理失败**\n\n提交表格更新失败：${error.message}\nEOF\n`);
    }

    console.error('ERROR_MESSAGE:', `❌ **处理失败**\n\n提交表格更新失败：${error.message}`);
    console.error('提交表格更新失败：', error.message);
    process.exit(1);
}