import * as core from '@actions/core'
import {Cargo, Cross, input} from '@actions-rs/core'

async function run(): Promise<void> {
  try {
    const useCross = input.getInputBool('use-cross')

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

    let cargoOutput = ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {}
    options.listeners = {
      stdout: (data: string) => {
        cargoOutput += data.toString()
      }
    }

    const workingDirectory = core.getInput('working-directory', {
      required: false
    })
    if (workingDirectory !== '') {
      options.cwd = workingDirectory
    }

    if ((await program.call(args, options)) !== 0) {
      core.setFailed('Cargo terminated with non-zero exit code')
      return
    }

    const summary = cargoOutput
      .split('\n')
      .reverse()
      .find(line => line.includes('Total'))!
      .replace(/\s/g, '')
    const matches = summary.match(/^\|Total\|.*\|(.*)%\|.*\|(.*)%\|$/)!

    core.setOutput('documented', matches[1])
    core.setOutput('examples', matches[2])
    core.setOutput('output', cargoOutput)
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

run()
