function generateReport(transactions) {
  const expenses = {
    total: 0,
    categories: {}
  };

  const income = {
    total: 0,
  };

  for (const tx of (transactions.debit || [])) {
    const amount = Math.abs(tx.amount);
    const category = tx.category;

    if (!expenses.categories[category]) {
      expenses.categories[category] = 0;
    }

    expenses.categories[category] += amount;
    expenses.total += amount;
  }

  const credits = Array.isArray(transactions.credit) ? transactions.credit : [];
  for (const tx of credits) {
    const amount = Math.abs(tx.amount);

    income.total += amount;
  }

  const report = {expenses, income};

  return report;
}

function printReport(report) {
const expenseEntries = Object.entries(report.expenses.categories)
    .sort((a, b) => b[1] - a[1]);
for (const [category, total] of expenseEntries) {
    console.log(`${category.padEnd(20, ' ')}: $${total.toFixed(2)}`);
}
  console.log('---------------------');
  console.log(`Total Income: $${report.income.total.toFixed(2)}\n`);
  console.log(`Total Spend: $${report.expenses.total.toFixed(2)}\n`);
}

module.exports = { generateReport, printReport };
