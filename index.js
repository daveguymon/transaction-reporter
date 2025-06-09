const fs = require('fs');
const csv = require('csv-parser');
const categorize = require('./categorize');
const { generateReport, printReport } = require('./report');

const transactions = {credit: [], debit: []};

fs.createReadStream('transactions.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Normalize and clean
    const description = row['Description'];
    const debit = parseFloat(row['Debit'].replace(/[^0-9.-]+/g, '')) || 0;
    const credit = parseFloat(row['Credit'].replace(/[^0-9.-]+/g, '')) || 0;

    if (debit < 0) {
      const category = categorize(description);
      transactions.debit.push({
        date: row['Date'],
        description,
        category,
        amount: debit
      });
    } else {
      transactions.credit.push({
        date: row['Date'],
        description,
        category: 'Income',
        amount: credit
      });
    }
  })
  .on('end', () => {
    const report = generateReport(transactions);
    printReport(report);
  });
