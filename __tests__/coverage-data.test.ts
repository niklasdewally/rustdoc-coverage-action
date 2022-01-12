import {expect, test} from '@jest/globals'
import {CoverageData} from '../src/coverage-data'

test('build markdown table', async () => {
  const json =
    '{"src/foo.rs":{"total":2,"with_docs":2,"total_examples":2,"with_examples":0},"src/lib.rs":{"total":3,"with_docs":2,"total_examples":3,"with_examples":1}}'
  const coverageData = new CoverageData(json)
  const expectedTable = [
    ['File', 'Documented', 'Percentage', 'Examples', 'Percentage'],
    ['src/foo.rs', '2', '100.00%', '0', '0.00%'],
    ['src/lib.rs', '2', '66.67%', '1', '33.33%'],
    ['**Total**', '4', '80.00%', '1', '20.00%']
  ]
  expect(coverageData.asTable()).toEqual(expectedTable)
})
