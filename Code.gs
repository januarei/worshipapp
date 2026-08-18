const SHEET_NAME = 'DBSONGLIST';

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Exodus BOLCC Song List')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Dipakai Index.html untuk include CSS/JS
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

// Ambil semua lagu untuk daftar beserta warnanya
function getSongList() {
  const sheet = getSheet_();
  const range = sheet.getDataRange();
  const data = range.getValues();
  const colors = range.getFontColors(); // Mengambil data warna teks
  
  data.shift(); // Hapus header
  colors.shift(); // Hapus warna header biar sejajar
  
  return data.map((row, index) => ({
    id: row[0],
    judul: row[1],
    author: row[2],
    genre: row[3],
    key: row[4],
    imageUrl: row[6],
    pinned: row[7] === true,
    urutan: row[8], // Tambahan fitur baca kolom I
    color: colors[index][5] || '#222222' // Ambil warna dari kolom F (Lyrics)
  }));
}

// Ambil 1 lagu lengkap dengan lirik+chord beserta warnanya berdasarkan ID
function getSongById(id) {
  const sheet = getSheet_();
  const range = sheet.getDataRange();
  const data = range.getValues();
  const colors = range.getFontColors();
  
  data.shift();
  colors.shift();
  
  const index = data.findIndex(r => String(r[0]) === String(id));
  if (index === -1) return null;
  
  const row = data[index];
  return {
    id: row[0],
    judul: row[1],
    author: row[2],
    genre: row[3],
    key: row[4],
    lyrics: row[5],
    imageUrl: row[6],
    pinned: row[7] === true,
    urutan: row[8], // Tambahan fitur baca kolom I
    color: colors[index][5] || '#222222' // Ambil warna dari kolom F (Lyrics)
  };
}

// Pencarian judul (server-side, dipanggil dari client)
function searchSongs(keyword) {
  const list = getSongList();
  if (!keyword) return list;
  const kw = keyword.toLowerCase();
  return list.filter(s => s.judul.toLowerCase().includes(kw));
}