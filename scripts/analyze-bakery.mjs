import fs from 'node:fs';

const model = JSON.parse(fs.readFileSync('assets/models/bakery_townhouse.bbmodel', 'utf8'));
const elMap = new Map(model.elements.map(e => [e.uuid, e]));

console.log('Total elements in model.elements:', model.elements.length);

model.outliner.forEach((group, idx) => {
  console.log(`\n=== Group ${idx}: ${group.name} (${group.children.length} elements) ===`);
  for (const cUuid of group.children) {
    const el = elMap.get(cUuid);
    if (el) {
      console.log(`  ${el.name.padEnd(35)} from:[${el.from.join(', ')}] to:[${el.to.join(', ')}]`);
    } else {
      console.log(`  Unknown child: ${cUuid}`);
    }
  }
});
