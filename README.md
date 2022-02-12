# rustdoc-coverage-action

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
![build-test workflow](https://github.com/bewee/rustdoc-coverage-action/actions/workflows/test.yml/badge.svg)

Use this action to generate documentation coverage reports. Powered by rustdoc's unstable show-coverage option.

![image](https://user-images.githubusercontent.com/44091658/153731739-7eb8fc55-82aa-4cc6-9da2-a9e1011ca0b0.png)

## Example Workflow

```yml
on: [push]

name: Documentation coverage

jobs:
  print_doc_coverage:
    name: Print documentation coverage
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: nightly
      - id: coverage
        uses: bewee/rustdoc-coverage-action@v1
      - run: echo ${{ steps.coverage.outputs.documented }}
```

[This repository](https://github.com/bewee/rustdoc-coverage-action-example) contains exemplary workflows for generating a doc coverage badge and commenting on pull request.

## Inputs

|Input|Description|Default|
|--|--|--|
|use-cross|Use cross instead of cargo|false|
|working-directory|Select a custom working directory||
|store-report|Whether to store the coverage report in rustdoc-coverage-report.json|true|
|calculate-diff|If a rustdoc-coverage-report.json exists: Whether to calculate the coverage diff to it|true|
|percentage-format|Format string used for percentages|0.[00]%|
|diff-percentage-format|diff-percentage-format|+0.[00]%|

## Outputs

|Output|Description|
|--|--|
|documented|The overall percentage of documented code|
|diff-documented|Difference in the overall percentage of documented code if a rustdoc-coverage-report.json exists and calculate-diff is enabled, otherwise zero|
|examples|The overall percentage of code with examples|
|diff-examples|Difference in the overall percentage of code with examples if a rustdoc-coverage-report.json exists and calculate-diff is enabled, otherwise zero|
|table|Tabular rustdoc coverage summary|
|json|JSON rustdoc coverage summary|
