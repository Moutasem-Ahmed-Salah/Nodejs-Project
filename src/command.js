import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .command("add", "Add a new note", () => {},)
  .demandCommand(1, "You need at least one command before moving on")
  .parse();

console.info(argv); // Move this line outside the command handler
console.log("your note:"+argv._[1]);
if(argv._[2]){
    console.log("Okaayy,so there is a second one cool:"+argv._[2]);
}

// Your command handler function here
