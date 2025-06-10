const dayjs = require('dayjs');

function generateReport(transactions) {
  const report = {
    total: 0,
    categories: {}
  };

  for (const tx of transactions) {
    const amount = Math.abs(tx.amount);
    const category = tx.category;

    if (!report.categories[category]) {
      report.categories[category] = 0;
    }

    report.categories[category] += amount;
    report.total += amount;
  }

  return report;
}

function printReport(report) {
  console.log('\n💸 Total Spend Report\n---------------------');
  for (const [category, total] of Object.entries(report.categories)) {
    console.log(`${category}: $${total.toFixed(2)}`);
  }
  console.log('---------------------');
  console.log(`Gross Total: $${report.total.toFixed(2)}\n`);
}

function generateMonthlyCategoryBreakdown(transactions) {
  const breakdown = {};

  transactions.forEach(tx => {
    const date = dayjs(tx.date);
    if (!date.isValid()) return;

    const month = date.format('YYYY-MM');
    const category = tx.category;
    const amount = Math.abs(tx.amount);

    if (!breakdown[month]) {
      breakdown[month] = {};
    }
    if (!breakdown[month][category]) {
      breakdown[month][category] = 0;
    }

    breakdown[month][category] += amount;
  });

  return breakdown;
}

function printMonthlyBreakdown(breakdown) {
  console.log('\n📅 Monthly Spend by Category\n----------------------------');
  const months = Object.keys(breakdown).sort();

  for (const month of months) {
    console.log(`${month}`);
    const categories = Object.entries(breakdown[month])
      .sort((a, b) => b[1] - a[1]);
    for (const [category, total] of categories) {
      console.log(`  ${category}: $${total.toFixed(2)}`);
    }
    console.log('');
  }
}

module.exports = {
  generateReport,
  printReport,
  generateMonthlyCategoryBreakdown,
  printMonthlyBreakdown
};
