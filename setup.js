const fs = require('fs');
const path = require('path');

console.log('Setting up Project Camp...\n');

if (!fs.existsSync('.env')) {
    console.log('Creating .env file from .env.example...');
    fs.copyFileSync('.env.example', '.env');
    console.log('✓ .env file created');
    console.log('\n⚠️  Please update the .env file with your actual credentials:\n');
    console.log('   - MONGO_URI: Your MongoDB connection string');
    console.log('   - MAILTRAP_SMTP_USER: Your Mailtrap username (optional)');
    console.log('   - MAILTRAP_SMTP_PASS: Your Mailtrap password (optional)\n');
} else {
    console.log('✓ .env file already exists');
}

const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
    console.log('Creating images directory...');
    fs.mkdirSync(imagesDir, { recursive: true });
    fs.writeFileSync(path.join(imagesDir, '.gitkeep'), '');
    console.log('✓ Images directory created');
}

console.log('\n✓ Setup complete!');
console.log('\nNext steps:');
console.log('1. Update .env file with your credentials');
console.log('2. Make sure MongoDB is running');
console.log('3. Run: npm run dev');
console.log('4. Open http://localhost:8000 in your browser\n');
