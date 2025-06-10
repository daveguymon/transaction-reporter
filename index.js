const fs = require('fs');
const csv = require('csv-parser');
const categorize = require('./categorize');
const {
  generateReport,
  printReport,
  generateMonthlyCategoryBreakdown,
  printMonthlyBreakdown
} = require('./report');

const transactions = [];
const tempFilePath = 'transactions_trimmed.csv';

function cleanCsvFile(originalFile, callback) {
  const lines = fs.readFileSync(originalFile, 'utf8').split('\n');
  
  // Remove the first two lines (account summary)
  const cleanedLines = lines.slice(2).join('\n');

  fs.writeFileSync(tempFilePath, cleanedLines);
  callback();
}

cleanCsvFile('transactions.csv', () => {
  fs.createReadStream(tempFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const debit = parseFloat(row['Debit'].replace(/[^0-9.-]+/g, '')) || 0;
      const description = row['Description'];
      const date = row['Date'];

      if (debit < 0) {
        const category = categorize(description);
        transactions.push({
          date,
          description,
          category,
          amount: debit // negative indicates expense
        });
      }
    })
    .on('end', () => {
      const report = generateReport(transactions);
      printReport(report);

      const monthly = generateMonthlyCategoryBreakdown(transactions);
      printMonthlyBreakdown(monthly);

      // Cleanup temp file
      fs.unlinkSync(tempFilePath);
    });
});
