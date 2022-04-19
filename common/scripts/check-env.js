const condtion = process.argv.slice(2)[0];
if(!condtion || !condtion.includes('=')) {
  console.error('Please provide a condition to check!');
}
const envVar = condtion.split('=')[0];
const value = condtion.split('=')[1];

if (process.env[envVar] !== value) {
  process.exit(1)
}