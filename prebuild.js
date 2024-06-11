require('dotenv').config();

console.log('FONT_AWESOME_AUTH_TOKEN:', process.env.FONT_AWESOME_AUTH_TOKEN);

if (!process.env.FONT_AWESOME_AUTH_TOKEN) {
    throw new Error('FontAwesome auth token not set in environment variables');
}

// Your prebuild logic here
console.log('Prebuild script running...');
