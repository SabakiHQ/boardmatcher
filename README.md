# @sabaki/boardmatcher [![Build Status](https://travis-ci.org/SabakiHQ/boardmatcher.svg?branch=master)](https://travis-ci.org/SabakiHQ/boardmatcher)

Finds patterns & shapes in Go board arrangements and names moves.

## Installation

Use npm to install:

~~~
$ npm install @sabaki/boardmatcher
~~~

To use this module, require it as follows:

~~~js
const boardmatcher = require('@sabaki/boardmatcher')
~~~

## API

### Board Data

The board arrangement is represented by an array of arrays. Each of those subarrays represent one row, all containing the same number of integers. `-1` denotes a white stone, `1` a black stone, and `0` represents an empty vertex.

#### Example

~~~js
[[ 0,  0,  1,  0, -1, -1,  1,  0, 0],
 [ 1,  0,  1, -1, -1,  1,  1,  1, 0],
 [ 0,  0,  1, -1,  0,  1, -1, -1, 0],
 [ 1,  1,  1, -1, -1, -1,  1, -1, 0],
 [ 1, -1,  1,  1, -1,  1,  1,  1, 0],
 [-1, -1, -1, -1, -1,  1,  0,  0, 0],
 [ 0, -1, -1,  0, -1,  1,  1,  1, 1],
 [ 0,  0,  0,  0,  0, -1, -1, -1, 1],
 [ 0,  0,  0,  0,  0,  0,  0, -1, 0]]
~~~

### Vertex

Board positions are represented by an array of the form `[x, y]` where `x` and `y` are non-negative integers, zero-based coordinates of the vertex. `[0, 0]` denotes the top left position of the board.

### Signed Vertex

Signed vertices are arrays of the form `[[x, y], sign]` where `[x, y]` is a [vertex](#vertex), and `sign` is either `-1`, `0`, or `1` for denoting a white stone, an empty vertex, or a black stone respectively.

### Pattern

A pattern object is an object of the following form:

~~~js
{
    name?: <String> | null,
    url?: <String> | null,
    size?: <Integer> | null,
    type?: 'corner' | null,
    anchors?: <SignedVertex[]> | null,
    vertices: <SignedVertex[]>
}
~~~

- `name` and `url` are irrelevant for the [`matchCorner`](#boardmatchermatchcornerdata-pattern) and [`matchShape`](#boardmatchermatchshapedata-anchor-pattern).
- If `size` is set, this pattern only matches on square boards with the given size.
- If `type` is set to `'corner'`, this pattern takes the relative position to the corner into account. Otherwise, the pattern will be invariant to translations.

### Match

A match object is an object of the following form:

~~~js
{
    symmetryIndex: <Integer>,
    invert: <Boolean>,
    anchors: <Vertex[]>,
    vertices: <Vertex[]>
}
~~~

- `symmetryIndex` is an integer between `0` and `7` denoting how the pattern vertices has to be transformed so they match the relative positions of the match.
- `invert` indicates whether the pattern colors have to be inverted so that they match the matched colors or not.
- `anchors` holds the anchors of the match that corresponds to the pattern anchors.
- `vertices` holds the vertices of the match that corresponds to the pattern vertices.

---

### `boardmatcher.nameMove(data, sign, vertex[, options])`

- `data` [`<BoardData>`](#board-data)
- `sign` - `-1`, or `1`, denoting the white player or the black player respectively
- `vertex` - The move the player given by `sign` is about to make
- `options` *(optional)*
    - `library` [`<Pattern[]>`](#pattern) *(optional)* - The pattern library to use. Defaults to a pre-curated pattern library.

Returns `null` if `boardmatcher` cannot name the given move, otherwise a string with the move name.

### `*boardmatcher.matchCorner(data, pattern)`

- `data` [`<BoardData>`](#board-data)
- `pattern` [`<Pattern>`](#pattern)

A generator function that yields all [matches](#match) of the given `pattern` on `data`. `pattern` will be regarded as corner type regardless of its type.

### `*boardmatcher.matchShape(data, anchor, pattern)`

- `data` [`<BoardData>`](#board-data)
- `anchor` [`<Vertex>`](#vertex)
- `pattern` [`<Pattern>`](#pattern)

A generator function that yields all [matches](#match) of the given `pattern`, for which the given `anchor` vertex corresponds to one of its anchors, on `data`.
