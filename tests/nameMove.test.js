const t = require('tap')
const boardmatcher = require('..')
const data = require('./data')

t.test('should name passes', t => {
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [-1, -1]), 'Pass')
    t.equal(boardmatcher.nameMove(data.unfinished, -1, [-1, -1]), 'Pass')
    t.equal(boardmatcher.nameMove(data.unfinished, 0, [0, 0]), 'Pass')
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [19, 19]), 'Pass')

    t.end()
})

t.test('should name suicides', t => {
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [0, 0]), 'Suicide')
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [1, 5]), 'Suicide')
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [0, 4]), 'Suicide')

    t.end()
})

t.test('should name takes', t => {
    t.equal(boardmatcher.nameMove(data.unfinished, -1, [0, 0]), 'Take')
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [14, 15]), 'Take')
    t.equal(boardmatcher.nameMove(data.unfinished, -1, [2, 7]), 'Take')

    t.end()
})

t.test('should be able to distinguish between suicides and takes', t => {
    let custom = JSON.parse(JSON.stringify(data.unfinished))

    custom[6][12] = 1
    custom[8][12] = 1
    custom[7][13] = 1

    t.equal(boardmatcher.nameMove(custom, -1, [12, 7]), 'Take')
    t.end()
})

t.test('should name ataris', t => {
    t.equal(boardmatcher.nameMove(data.unfinished, -1, [17, 15]), 'Atari')
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [18, 15]), 'Atari')
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [15, 2]), 'Atari')
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [3, 3]), 'Atari')

    t.end()
})

t.test('should name fills', t => {
    t.equal(boardmatcher.nameMove(data.unfinished, -1, [0, 4]), 'Fill')
    t.equal(boardmatcher.nameMove(data.unfinished, -1, [1, 5]), 'Fill')

    t.end()
})

t.test('should name connections', t => {
    t.equal(boardmatcher.nameMove(data.unfinished, -1, [1, 2]), 'Connect')
    t.equal(boardmatcher.nameMove(data.unfinished, -1, [1, 12]), 'Connect')
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [12, 15]), 'Connect')

    t.end()
})

t.test('should name some shapes', t => {
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [7, 1]), 'Stretch')
    t.equal(boardmatcher.nameMove(data.unfinished, 1, [10, 16]), 'Cut')

    t.end()
})

t.test('should name hoshis correctly', t => {
    t.equal(boardmatcher.nameMove(data.empty, -1, [9, 9]), 'Tengen')
    t.equal(boardmatcher.nameMove(data.empty, -1, [9, 3]), 'Hoshi')
    t.equal(boardmatcher.nameMove(data.empty, 1, [9, 15]), 'Hoshi')
    t.equal(boardmatcher.nameMove(data.empty, 1, [3, 3]), '4-4 point')
    t.equal(boardmatcher.nameMove(data.empty, 1, [15, 15]), '4-4 point')

    t.end()
})

t.test('should name off-hoshis correctly', t => {
    t.equal(boardmatcher.nameMove(data.empty, -1, [3, 2]), '3-4 point')
    t.equal(boardmatcher.nameMove(data.empty, -1, [2, 15]), '3-4 point')
    t.equal(boardmatcher.nameMove(data.empty, 1, [5, 4]), '5-6 point')
    t.equal(boardmatcher.nameMove(data.empty, 1, [4, 5]), '5-6 point')

    t.end()
})
