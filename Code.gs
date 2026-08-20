const SHEET_NAME = 'DBSONGLIST';

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Exodus BOLCC Song List')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function getSongList() {
  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  const header = data.shift();
  return data.map(row => ({
    id: row[0],
    judul: row[1],
    author: row[2],
    genre: row[3],
    key: row[4],
    imageUrl: row[6],
    pinned: row[7] === true,
    urutan: row[8]
  }));
}

function getSongById(id) {
  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  const header = data.shift();
  const row = data.find(r => String(r[0]) === String(id));
  if (!row) return null;
  return {
    id: row[0],
    judul: row[1],
    author: row[2],
    genre: row[3],
    key: row[4],
    lyrics: row[5],
    imageUrl: row[6],
    pinned: row[7] === true,
    urutan: row[8]
  };
}