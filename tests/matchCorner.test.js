const t = require('tap')
const boardmatcher = require('..')
const data = require('./data')

t.test('should match corner', t => {
    let vertices = []
    let height = data.finished.length
    let width = data.finished[0].length

    for (let x = 0; x <= 5; x++) {
        for (let y = 0; y <= 5; y++) {
            if (data.finished[y][x] !== 0) {
                vertices.push([[x, y], data.finished[y][x]])
            }
        }
    }

    let matches = [...boardmatcher.matchCorner(data.finished, {vertices})]

    t.deepEqual(matches[0], {
        symmetryIndex: 0,
        invert: false,
        anchors: [],
        vertices: vertices.map(([v, _]) => v)
    })

    matches = [...boardmatcher.matchCorner(
        data.finished,
        {vertices: vertices.map(([v, s]) => [v, -s])}
    )]

    t.deepEqual(matches[0], {
        symmetryIndex: 0,
        invert: true,
        anchors: [],
        vertices: vertices.map(([v, _]) => v)
    })

    matches = [...boardmatcher.matchCorner(
        data.finished,
        {vertices: vertices.map(([[x, y], s]) => [[width - x - 1, height - y - 1], s])}
    )]

    t.deepEqual(matches[0], {
        symmetryIndex: 3,
        invert: false,
        anchors: [],
        vertices: vertices.map(([v, _]) => v)
    })

    t.end()
})

t.test('should not match patterns in the center of the board', t => {
    let vertices = []

    for (let x = 5; x <= 10; x++) {
        for (let y = 5; y <= 10; y++) {
            if (data.finished[y][x] !== 0) {
                vertices.push([[x - 5, y - 5], data.finished[y][x]])
            }
        }
    }

    let matches = [...boardmatcher.matchCorner(data.finished, {vertices})]

    t.equal(matches.length, 0)
    t.end()
})
