import * as core from '@actions/core'
import {Cargo, Cross, input} from '@actions-rs/core'
import {CoverageData} from './coverage-data'
import {markdownTable} from 'markdown-table'

async function run(): Promise<void> {
  try {
    const useCross = input.getInputBool('use-cross')
    const workingDirectory = core.getInput('working-directory', {
      required: false
    })

    const cargoOutput = await executeRustdoc(useCross, workingDirectory)
    const coverageData = new CoverageData(cargoOutput)

    core.setOutput('documented', coverageData.percentageDocs.toFixed(2))
    core.setOutput('examples', coverageData.percentageExamples.toFixed(2))
    core.setOutput('json', cargoOutput)
    core.setOutput('table', markdownTable(coverageData.asTable()))
  } catch (error: unknown) {
    if (typeof error === 'string') {
      core.setFailed(error.toUpperCase())
    } else if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('Unknown error')
    }
  }
}

async function executeRustdoc(
  useCross: boolean,
  workingDirectory: string
): Promise<string> {
  let program
  if (useCross) {
    program = await Cross.getOrInstall()
  } else {
    program = await Cargo.get()
  }

  const args = []
  args.push('+nightly')
  args.push('rustdoc')
  args.push('--')
  args.push('-Z')
  args.push('unstable-options')
  args.push('--show-coverage')
  args.push('--output-format')
  args.push('json')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {}

  let cargoOutput = ''
  options.listeners = {
    stdout: (data: string) => {
      cargoOutput += data.toString()
    }
  }

  if (workingDirectory !== '') {
    options.cwd = workingDirectory
  }

  if ((await program.call(args, options)) !== 0) {
    throw new Error('Cargo terminated with non-zero exit code')
  }

  return cargoOutput
}

run()
