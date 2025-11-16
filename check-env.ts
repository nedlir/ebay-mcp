import { config } from 'dotenv';

config();

console.log('Raw environment values:\n');
console.log('EBAY_CLIENT_ID length:', process.env.EBAY_CLIENT_ID?.length);
console.log('EBAY_CLIENT_ID value:', JSON.stringify(process.env.EBAY_CLIENT_ID));
console.log();
console.log('EBAY_CLIENT_SECRET length:', process.env.EBAY_CLIENT_SECRET?.length);
console.log('EBAY_CLIENT_SECRET value:', JSON.stringify(process.env.EBAY_CLIENT_SECRET));
console.log();
console.log('EBAY_USER_REFRESH_TOKEN length:', process.env.EBAY_USER_REFRESH_TOKEN?.length);
console.log('EBAY_USER_REFRESH_TOKEN value:', JSON.stringify(process.env.EBAY_USER_REFRESH_TOKEN));
console.log();

// Check for quotes
if (process.env.EBAY_CLIENT_ID?.startsWith("'")) {
  console.log('⚠️  EBAY_CLIENT_ID starts with single quote!');
}
if (process.env.EBAY_CLIENT_SECRET?.startsWith("'")) {
  console.log('⚠️  EBAY_CLIENT_SECRET starts with single quote!');
}
if (process.env.EBAY_USER_REFRESH_TOKEN?.startsWith("'")) {
  console.log('⚠️  EBAY_USER_REFRESH_TOKEN starts with single quote!');
}
