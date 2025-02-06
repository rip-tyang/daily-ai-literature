const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), '/data');
const backlogPath = path.join(dataPath, '/backlogs');
const allBacklogs = fs.readdirSync(backlogPath);

const getMaxDate = () => {
  const allData = fs.readdirSync(dataPath);
  allData.sort();
  const lastDate = allData[allData.length - 2]; // e.g. 2025-02-05.json
  return new Date(lastDate.slice(0, 10));
};

const maxDate = getMaxDate();

for (const fileName of allBacklogs) {
  if (fileName.endsWith('.json')) {
    const contentFileName = fileName.slice(0, fileName.length - 5) + '.txt';
    const metadata = fs.readFileSync(path.join(backlogPath, fileName));
    const newItem = JSON.parse(metadata);
    const content = fs.readFileSync(path.join(backlogPath, contentFileName));
    newItem.Response = content.toString('utf-8');

    maxDate.setDate(maxDate.getDate() + 1);
    const newItemFileName = maxDate.toISOString().slice(0, 10) + '.json';
    fs.writeFileSync(
      path.join(dataPath, newItemFileName),
      JSON.stringify(newItem, null, 2)
    );
  }
}

for (const fileName of allBacklogs) {
  fs.rmSync(path.join(backlogPath, fileName));
}
