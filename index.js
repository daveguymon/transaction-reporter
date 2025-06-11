const fs = require('fs');
const csv = require('csv-parser');
const categorize = require('./categorize');
const {
  generateReport,
  printReport,
  generateMonthlyCategoryBreakdown,
  printMonthlyBreakdown,
  generateMonthlyCashFlow,
  printMonthlyCashFlow
} = require('./report');

const transactions = {credit: [], debit: []};
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
        transactions.debit.push({
          date,
          description,
          category,
          amount: debit
        });
      } else {
        const credit = parseFloat(row['Credit'].replace(/[^0-9.-]+/g, '')) || 0;
        transactions.credit.push({
          date,
          description,
          category: 'Credit',
          amount: credit
        });
      }
    })
    .on('end', () => {
      const report = generateReport(transactions);
      printReport(report);

      const monthly = generateMonthlyCategoryBreakdown(transactions);
      printMonthlyBreakdown(monthly);

      const cashFlow = generateMonthlyCashFlow(transactions);
      printMonthlyCashFlow(cashFlow);

      // Cleanup temp file
      fs.unlinkSync(tempFilePath);
    });
});
