// @flow

import test from 'ava';
import createSqlTag from '../../../../src/factories/createSqlTag';
import {
  SqlToken,
} from '../../../../src/tokens';

const sql = createSqlTag();

test('creates an unnest expression using primitive values', (t) => {
  const query = sql`SELECT * FROM ${sql.unnest([[1, 2, 3], [4, 5, 6]], ['int4', 'int4', 'int4'])}`;

  t.deepEqual(query, {
    sql: 'SELECT * FROM unnest($1::"int4"[], $2::"int4"[], $3::"int4"[])',
    type: SqlToken,
    values: [
      [
        1,
        4,
      ],
      [
        2,
        5,
      ],
      [
        3,
        6,
      ],
    ],
  });
});

test('creates an unnest expression using arrays', (t) => {
  const query = sql`SELECT * FROM ${sql.unnest([[1, 2, 3], [4, 5, 6]], ['int4', 'int4', 'int4'])}`;

  t.deepEqual(query, {
    sql: 'SELECT * FROM unnest($1::"int4"[], $2::"int4"[], $3::"int4"[])',
    type: SqlToken,
    values: [
      [
        1,
        4,
      ],
      [
        2,
        5,
      ],
      [
        3,
        6,
      ],
    ],
  });
});

test('creates incremental alias names if no alias names are provided', (t) => {
  const query = sql`SELECT * FROM ${sql.unnest([[1, 2, 3], [4, 5, 6]], ['int4', 'int4', 'int4'])}`;

  t.deepEqual(query, {
    sql: 'SELECT * FROM unnest($1::"int4"[], $2::"int4"[], $3::"int4"[])',
    type: SqlToken,
    values: [
      [
        1,
        4,
      ],
      [
        2,
        5,
      ],
      [
        3,
        6,
      ],
    ],
  });
});

test('recognizes an array an array', (t) => {
  const query = sql`SELECT * FROM ${sql.unnest([[[[1], [2], [3]]]], ['int4[]'])}`;

  t.deepEqual(query, {
    sql: 'SELECT * FROM unnest($1::"int4"[][])',
    type: SqlToken,
    values: [
      [
        [
          [1],
          [2],
          [3],
        ],
      ],
    ],
  });
});

test('throws an array if tuple member length varies in a list of tuples', (t) => {
  t.throws(() => {
    sql`SELECT * FROM ${sql.unnest([[1, 2, 3], [4, 5]], ['int4', 'int4', 'int4'])}`;
  }, 'Each tuple in a list of tuples must have an equal number of members.');
});

test('throws an array if tuple member length does not match column types length', (t) => {
  t.throws(() => {
    sql`SELECT * FROM ${sql.unnest([[1, 2, 3], [4, 5, 6]], ['int4', 'int4'])}`;
  }, 'Column types length must match tuple member length.');
});

test('the resulting object is immutable', (t) => {
  const token = sql.unnest([[1, 2, 3], [4, 5, 6]], ['int4', 'int4', 'int4']);

  t.throws(() => {
    // $FlowFixMe
    token.foo = 'bar';
  });
});
