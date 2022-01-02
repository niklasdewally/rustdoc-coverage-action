const core = require('@actions/core');
const { input, Cross, Cargo } = require('@actions-rs/core');

(async () => {
    try {
        const useCross = input.getInputBool('use-cross');

        let program;
        if (useCross) {
            program = await Cross.getOrInstall();
        } else {
            program = await Cargo.get();
        }

        let args = [];
        args.push('+nightly');
        args.push('rustdoc');
        args.push('--');
        args.push('-Z');
        args.push('unstable-options');
        args.push('--show-coverage');

        let cargoOutput = '';
        const options = {};
        options.listeners = {
            stdout: (data) => {
                cargoOutput += data.toString();
            }
        };

        if (await program.call(args, options) != 0) {
            core.setFailed('Cargo terminated with non-zero exit code');
            return;
        }

        console.log('cargoOutput', cargoOutput);
        console.log('summary1', cargoOutput.split('\n'));
        console.log('summary2', cargoOutput.split('\n').reverse());

        const summary = cargoOutput
            .split('\n')
            .reverse()
            .find((line) => line.includes('Total'))
            .replace(/\s/g, '');
        const matches = summary.match(/^\|Total\|.*\|(.*)\%\|.*\|(.*)\%\|$/);

        core.setOutput('documented', matches[1]);
        core.setOutput('examples', matches[2]);
        core.setOutput('output', cargoOutput);
    } catch (error) {
        core.setFailed(error.message);
    }
})();