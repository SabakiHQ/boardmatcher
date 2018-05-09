const fs = require('fs')
const sgf = require('@sabaki/sgf')

let tree = sgf.parseFile(`${__dirname}/data/shapes.sgf`)[0]
let shapes = []

for (let subtree of tree.subtrees) {
    let node = subtree.nodes[0]
    let anchors = node.MA.map(x => [...sgf.parseVertex(x), node.AB.includes(x) ? 1 : -1])
    let vertices = ['AW', 'CR', 'AB']
        .map((x, i) => (node[x] || []).map(y => [...sgf.parseVertex(y), i - 1]))
        .reduce((acc, x) => [...acc, ...x], [])

    let data = {}

    if ('C' in node) {
        for (let [key, value] of node.C[0].trim().split(', ').map(x => x.split(': '))) {
            data[key] = value
        }
    }

    shapes.push(Object.assign({
        name: node.N[0],
        anchors,
        vertices
    }, data))
}

fs.writeFileSync(`${__dirname}/data/shapes.json`, JSON.stringify(shapes))
