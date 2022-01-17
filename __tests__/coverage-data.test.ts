import {expect, test} from '@jest/globals'
import {CoverageData} from '../src/coverage-data'

const cargoOutput =
  '{"src/foo.rs":{"total":2,"with_docs":2,"total_examples":2,"with_examples":0},"src/lib.rs":{"total":3,"with_docs":2,"total_examples":3,"with_examples":1}}'

test('calculate total docs', async () => {
  const coverageData = new CoverageData(cargoOutput)
  const expectedTotalDocs = 5
  expect(coverageData.totalDocs).toEqual(expectedTotalDocs)
})

test('calculate total examples', async () => {
  const coverageData = new CoverageData(cargoOutput)
  const expectedTotalExamples = 5
  expect(coverageData.totalExamples).toEqual(expectedTotalExamples)
})

test('calculate with docs', async () => {
  const coverageData = new CoverageData(cargoOutput)
  const expectedWithDocs = 4
  expect(coverageData.withDocs).toEqual(expectedWithDocs)
})

test('calculate with examples', async () => {
  const coverageData = new CoverageData(cargoOutput)
  const expectedWithExamples = 1
  expect(coverageData.withExamples).toEqual(expectedWithExamples)
})

test('calculate percentage docs', async () => {
  const coverageData = new CoverageData(cargoOutput)
  const expectedPercentageDocs = 80
  expect(coverageData.percentageDocs).toEqual(expectedPercentageDocs)
})

test('calculate percentage examples', async () => {
  const coverageData = new CoverageData(cargoOutput)
  const expectedPercentageExamples = 20
  expect(coverageData.percentageExamples).toEqual(expectedPercentageExamples)
})

test('build markdown table', async () => {
  const coverageData = new CoverageData(cargoOutput)
  const expectedTable = [
    ['File', 'Documented', 'Percentage', 'Examples', 'Percentage'],
    ['src/foo.rs', '2', '100.00%', '0', '0.00%'],
    ['src/lib.rs', '2', '66.67%', '1', '33.33%'],
    ['**Total**', '4', '80.00%', '1', '20.00%']
  ]
  expect(coverageData.asTable()).toEqual(expectedTable)
})
