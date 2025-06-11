const chalk = require('chalk');
const dayjs = require('dayjs');

function generateMonthlyCashFlow(transactions) {
  const monthly = {};

  for (const tx of transactions.debit.concat(transactions.credit)) {
    const date = dayjs(tx.date);
    if (!date.isValid()) continue;

    const month = date.format('YYYY-MM');
    const amount = parseFloat(tx.amount);
    const isDebit = amount < 0;

    if (!monthly[month]) {
      monthly[month] = { credit: 0, debit: 0 };
    }

    if (isDebit) {
      monthly[month].debit += Math.abs(amount);
    } else {
      monthly[month].credit += amount;
    }
  }

  return monthly;
}

function printMonthlyCashFlow(cashFlow) {
  console.log(chalk.bold('\n📊 Monthly Cash Flow'));
  console.log('---------------------');

  const months = Object.keys(cashFlow).sort();

  for (const month of months) {
    const { credit, debit } = cashFlow[month];
    const net = credit - debit;
    const netColor = net >= 0 ? chalk.green : chalk.red;
    const incomeBar = '▓'.repeat(Math.round(credit / 100));
    const debitBar = '▓'.repeat(Math.round(debit / 100));

    console.log(`${chalk.cyan(month)} | Income: $${credit.toFixed(2)} | Spending: $${debit.toFixed(2)} | Net: ${netColor(`$${net.toFixed(2)}`)}`);
    console.log(`         ${chalk.green(incomeBar)} (Income)`);
    console.log(`         ${chalk.red(debitBar)} (Spending)\n`);
  }

  console.log('---------------------\n');
}

function generateReport(transactions) {
  const report = {
    total: 0,
    categories: {}
  };

  for (const tx of transactions.debit) {
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

  transactions.debit.forEach(tx => {
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
  printMonthlyBreakdown,
  generateMonthlyCashFlow,
  printMonthlyCashFlow
};
