export interface CoverageInterface {
  total: number
  with_docs: number
  total_examples: number
  with_examples: number
}

export class CoverageEntry {
  total: number
  with_docs: number
  total_examples: number
  with_examples: number

  constructor(e: CoverageInterface) {
    this.total = e.total
    this.with_docs = e.with_docs
    this.total_examples = e.total_examples
    this.with_examples = e.with_examples
  }

  get percentage_docs(): number {
    return (100 * this.with_docs) / this.total
  }

  get percentage_examples(): number {
    return (100 * this.with_examples) / this.total_examples
  }
}

export class CoverageData {
  data: {[key: string]: CoverageEntry}

  constructor(description: string) {
    const parsedData: {[key: string]: CoverageInterface} =
      JSON.parse(description)
    this.data = {}
    for (const file of Object.keys(parsedData)) {
      this.data[file] = new CoverageEntry(parsedData[file])
    }
  }

  get totalDocs(): number {
    return Object.values(this.data).reduce((sum, data) => sum + data.total, 0)
  }
  get withDocs(): number {
    return Object.values(this.data).reduce(
      (sum, data) => sum + data.with_docs,
      0
    )
  }
  get totalExamples(): number {
    return Object.values(this.data).reduce(
      (sum, data) => sum + data.total_examples,
      0
    )
  }
  get withExamples(): number {
    return Object.values(this.data).reduce(
      (sum, data) => sum + data.with_examples,
      0
    )
  }

  get percentageDocs(): number {
    return (100 * this.withDocs) / this.totalDocs
  }
  get percentageExamples(): number {
    return (100 * this.withExamples) / this.totalExamples
  }

  asTable(): string[][] {
    return [['File', 'Documented', 'Percentage', 'Examples', 'Percentage']]
      .concat(
        Object.keys(this.data).map(file => [
          file,
          this.data[file].with_docs.toString(),
          `${this.data[file].percentage_docs.toFixed(2)}%`,
          this.data[file].with_examples.toString(),
          `${this.data[file].percentage_examples.toFixed(2)}%`
        ])
      )
      .concat([
        [
          '**Total**',
          this.withDocs.toString(),
          `${this.percentageDocs.toFixed(2)}%`,
          this.withExamples.toString(),
          `${this.percentageExamples.toFixed(2)}%`
        ]
      ])
  }
}
