import arg from 'arg';
import colors from 'colors/safe';
import { invalidOption, exportHelpText } from '@cli/constants';
import { resolve, join } from 'path';
import exportApp from 'next/dist/export';
import { cliCommand } from '@cli/index';

function parseArgs(argv: string[] | undefined) {
  try {
    return arg(
      {
        // Types
        '--help': Boolean,
        '--silent': Boolean,
        '--outdir': String,
        '--threads': Number,
        // Aliases
        '-h': '--help',
        '-s': '--silent',
        '-o': '--outdir',
      },
      { argv }
    );
  } catch (e) {
    if (e.code === 'ARG_UNKNOWN_OPTION') {
      console.log(colors.red(invalidOption));
    } else {
      console.log(colors.red('エラーが発生しました'));
    }
    console.log(exportHelpText);
    return null;
  }
}

export const exec: cliCommand = (argv) => {
  const args = parseArgs(argv);
  if (!args) return;

  if (args['--help']) {
    console.log(exportHelpText);
    return;
  }

  const currentDirectory = resolve(args._[0] || '.');
  const options = {
    silent: args['--silent'] || false,
    threads: args['--threads'],
    outdir: args['--outdir']
      ? resolve(args['--outdir'])
      : join(currentDirectory, 'out'),
  };

  exportApp(currentDirectory, options)
    .then(() => {
      console.log(colors.green('エクスポートに成功しました'));
    })
    .catch((e) => {
      console.log(colors.red('エラーが発生しました') + e);
    });
};
