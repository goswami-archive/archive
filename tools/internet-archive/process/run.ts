import { exec, spawnSync } from 'node:child_process';
import { promisify } from 'node:util';

const execPromise = promisify(exec);

export async function runCommandExec(command: string) {
  const { stdout, stderr } = await execPromise(command);
  if (stdout) {
    console.log('Output:', stdout);
  }
  if (stderr) {
    console.error('Error:', stderr);
  }
}

export function logError(error: unknown) {
  if (error instanceof Error) {
    console.error('Execution Failed:', error.message);
    if ('code' in error && typeof error.code === 'number') {
      console.error(`Exit Code: ${error.code}`);
    }
    if ('stderr' in error && typeof error.stderr === 'string') {
      console.error(`Error Output: ${error.stderr}`);
    }
    if ('stdout' in error && typeof error.stdout === 'string') {
      console.log(`Standard Output (if any): ${error.stdout}`);
    }
  } else if (typeof error === 'string') {
    console.error('Execution Failed with string error:', error);
  } else {
    console.error('Execution Failed with unknown error:', error);
  }
}

function runCommandSpawn(command: string, args: string[]) {
  // const cmd = spawn(command, args, {
  //   stdio: ['inherit', 'pipe', 'pipe'],
  //   detached: false,
  // });

  const result = spawnSync(command, args, {
    stdio: ['inherit', 'pipe', 'pipe'], // Pipe stdout/stderr for capturing output
    encoding: 'utf8', // Ensure output is returned as strings
  });

  // // Capture and display stdout (progress updates, success messages)
  // cmd.stdout.on('data', (data) => {
  //   process.stdout.write(data); // Write directly to console for real-time display
  // });

  // cmd.stderr.on('data', (data) => {
  //   process.stderr.write(data); // Write errors to stderr for real-time display
  // });

  // // Handle process completion
  // cmd.on('close', (code) => {
  //   console.log(`Process exited with code ${code}`);
  // });

  // // Handle process errors (e.g., binary not found, invalid args)
  // cmd.on('error', (error) => {
  //   console.error(`Failed to start process: ${error.message}`);
  // });

  // Display stdout (progress updates, success messages)
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  // Filter and display stderr (errors, warnings, excluding resource_tracker warning)
  if (result.stderr) {
    const stderrStr = result.stderr;
    if (
      !stderrStr.includes(
        'resource_tracker: There appear to be 1 leaked semaphore objects'
      )
    ) {
      process.stderr.write(stderrStr);
    }
  }

  // Check exit status
  if (result.error) {
    console.error(`Failed to start process: ${result.error.message}`);
  } else {
    console.log(`Upload process exited with code ${result.status}`);
  }
}
