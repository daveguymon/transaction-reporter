const DEFAULT_CATEGORY = 'Other';

function categorize(description) {
    const lowerCaseDescription = description.toLowerCase();
  
    const creditCardKeywords = ['bk of amer', 'capital one', 'credit card'];
    const fastFoodKeywords = ['burger', 'brewery', 'cafe rio', 'chik-fil-a', 'diner', 'domino\'s', 'doordash', 'mcdonalds', 'pizzeria', 'sushi', 'twisted sugar']
    const gasStationKeywords = ['7-11', 'chevron', 'holiday', 'maverik'];
    const golfKeywords = ['golf', 'riverbend', 'talons'];
    const medicalDentalKeywords = ['advanced sports', 'flow chiropractic', 'orthodontics', 'pharmacy', 'psychological', 'revere'];
    const mortgageAndBillsKeywords = ['bulwark', 'city of saratoga', 'gabb wireless', 'instant ink', 'jpmorgan chase', 'mt saratoga', 'questar', 'rockymtn/pacific', 'travelers', 'yummy'];
    const subscriptionKeywords = ['apple', 'netflix', 'ring basic', 'spotify', 'wix']

    if (lowerCaseDescription.includes('amazon')) return 'Amazon';
    if (lowerCaseDescription.includes('barnes & noble')) return 'Barnes & Noble';
    if (creditCardKeywords.some(keyword => lowerCaseDescription.includes(keyword))) return 'Credit Card Payment';
    if (lowerCaseDescription.includes('costco')) return 'Costco';
    if (fastFoodKeywords.some(keyword => lowerCaseDescription.includes(keyword))) return 'Fast Food';
    if (gasStationKeywords.some(station => lowerCaseDescription.includes(station))) return 'Gas';
    if (golfKeywords.some(keyword => lowerCaseDescription.includes(keyword))) return 'Golf';
    if (medicalDentalKeywords.some(keyword => lowerCaseDescription.includes(keyword))) return 'Medical & Dental';
    if (mortgageAndBillsKeywords.some(keyword => lowerCaseDescription.includes(keyword))) return 'Mortgage & Bills';
    if (lowerCaseDescription.includes('target')) return 'Target';
    if (lowerCaseDescription.includes('walmart') || lowerCaseDescription.includes('wal-mart')) return 'Walmart';

    return DEFAULT_CATEGORY;
}

module.exports = categorize;
