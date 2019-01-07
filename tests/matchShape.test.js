const t = require('tap')
const boardmatcher = require('..')
const data = require('./data')

t.test('should match shape', t => {
    let shape = {
        anchors: [[[0, 2], 1], [[2, 2], 1]],
        vertices: [[[1, 1], 1], [[2, 1], 0], [[1, 2], 0]]
    }

    let matches = [...boardmatcher.matchShape(data.unfinished, [14, 2], shape)]
    t.deepEqual(matches.map(x => x.symmetryIndex).sort(), [3, 7])

    matches = [...boardmatcher.matchShape(data.unfinished, [0, 5], shape)]
    t.deepEqual(matches.map(x => x.symmetryIndex).sort(), [0, 1, 5, 7])

    t.end()
})

t.test('should respect size property of shape', t => {
    let shape = {
        anchors: [[[0, 2], 1], [[2, 2], 1]],
        vertices: [[[1, 1], 1], [[2, 1], 0], [[1, 2], 0]],
        size: 13
    }

    let matches = [...boardmatcher.matchShape(data.unfinished, [14, 2], shape)]

    t.equal(matches.length, 0)
    t.end()
})

t.test('should respect corner type of shape', t => {
    let shape = {
        anchors: [[[0, 2], 1], [[2, 2], 1]],
        vertices: [[[1, 1], 1], [[2, 1], 0], [[1, 2], 0]],
        type: 'corner'
    }

    let matches = [...boardmatcher.matchShape(data.unfinished, [14, 2], shape)]
    t.equal(matches.length, 0)

    shape = {
        anchors: [[[2, 2], 1], [[4, 2], 1]],
        vertices: [[[3, 3], 1], [[3, 2], 0], [[4, 3], 0]],
        type: 'corner'
    }

    matches = [...boardmatcher.matchShape(data.unfinished, [14, 2], shape)]
    t.deepEqual(matches.map(x => x.symmetryIndex).sort(), [1, 6])

    t.end()
})
