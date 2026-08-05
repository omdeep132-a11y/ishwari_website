// Very small file-based "database". Good enough for a personal / portfolio
// site with light traffic. Everything lives in data/db.json.
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function defaultData() {
  return {
    admin: null, // filled in by seed.js
    bookings: [],
    posts: [],
    theme: defaultTheme(),
    siteImages: defaultSiteImages()
  };
}

function defaultTheme() {
  return {
    bg: '#F6F8F5',
    bgAlt: '#EDF2ED',
    card: '#FFFFFF',
    ink: '#1C2E2A',
    inkSoft: '#52645F',
    primary: '#4F7C6E',
    primaryDark: '#2E5148',
    accent: '#E0966A',
    accentSoft: '#F4DCC9',
    line: '#DCE5DD'
  };
}

function defaultSiteImages() {
  return {
    hero: 'https://picsum.photos/seed/ishwariphysio/500/620',
    about: 'https://picsum.photos/seed/physioclinic/600/700'
  };
}

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    writeDB(defaultData());
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('db.json is corrupted, resetting to defaults.');
    const fresh = defaultData();
    writeDB(fresh);
    return fresh;
  }
}

function writeDB(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB, defaultTheme, defaultSiteImages };
