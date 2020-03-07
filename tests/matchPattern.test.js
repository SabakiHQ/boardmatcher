const t = require('tap')
const boardmatcher = require('..')
const data = require('./data')

t.test('should match pattern', t => {
  let pattern = {
    anchors: [
      [[0, 2], 1],
      [[2, 2], 1]
    ],
    vertices: [
      [[1, 1], 1],
      [[2, 1], 0],
      [[1, 2], 0]
    ]
  }

  let matches = [
    ...boardmatcher.matchPattern(data.unfinished, [14, 2], pattern)
  ]
  t.deepEqual(matches.map(x => x.symmetryIndex).sort(), [3, 7])
  t.deepEqual(matches[0].anchors, [
    [16, 2],
    [14, 2]
  ])
  t.deepEqual(matches[0].vertices, [
    [15, 3],
    [14, 3],
    [15, 2]
  ])

  matches = [...boardmatcher.matchPattern(data.unfinished, [0, 5], pattern)]
  t.deepEqual(matches.map(x => x.symmetryIndex).sort(), [0, 1, 5, 7])

  t.end()
})

t.test('should respect size property of pattern', t => {
  let pattern = {
    anchors: [
      [[0, 2], 1],
      [[2, 2], 1]
    ],
    vertices: [
      [[1, 1], 1],
      [[2, 1], 0],
      [[1, 2], 0]
    ],
    size: 13
  }

  let matches = [
    ...boardmatcher.matchPattern(data.unfinished, [14, 2], pattern)
  ]

  t.equal(matches.length, 0)
  t.end()
})

t.test('should respect corner type of pattern', t => {
  let pattern = {
    anchors: [
      [[0, 2], 1],
      [[2, 2], 1]
    ],
    vertices: [
      [[1, 1], 1],
      [[2, 1], 0],
      [[1, 2], 0]
    ],
    type: 'corner'
  }

  let matches = [
    ...boardmatcher.matchPattern(data.unfinished, [14, 2], pattern)
  ]
  t.equal(matches.length, 0)

  pattern = {
    anchors: [
      [[2, 2], 1],
      [[4, 2], 1]
    ],
    vertices: [
      [[3, 3], 1],
      [[3, 2], 0],
      [[4, 3], 0]
    ],
    type: 'corner'
  }

  matches = [...boardmatcher.matchPattern(data.unfinished, [14, 2], pattern)]
  t.deepEqual(matches.map(x => x.symmetryIndex).sort(), [1, 6])

  t.end()
})
