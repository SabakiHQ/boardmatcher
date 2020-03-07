const fs = require('fs')
const {join} = require('path')
const sgf = require('@sabaki/sgf')

let root = sgf.parseFile(join(__dirname, 'data', 'library.sgf'))[0]
let library = []

for (let node of root.children) {
  let anchors = node.data.MA.map(x => [
    sgf.parseVertex(x),
    node.data.AB.includes(x) ? 1 : -1
  ])
  let vertices = ['AW', 'CR', 'AB']
    .map((x, i) => (node.data[x] || []).map(y => [sgf.parseVertex(y), i - 1]))
    .reduce((acc, x) => [...acc, ...x], [])

  let data = {}

  if (node.data.C != null) {
    for (let [key, ...values] of node.data.C[0]
      .trim()
      .split('\n')
      .map(x =>
        x
          .trim()
          .slice(2)
          .split(':')
      )) {
      data[key.trim()] = values.join(':').trim()
    }
  }

  library.push(
    Object.assign(
      {
        name: node.data.N[0],
        anchors,
        vertices
      },
      data
    )
  )
}

fs.writeFileSync(
  join(__dirname, 'data', 'library.json'),
  JSON.stringify(library)
)
