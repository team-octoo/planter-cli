import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

export const intro = {
  play: (withClear = true) => {
    return new Promise<void>((resolve, reject) => {
      if (withClear) clear();
      console.log(
        chalk.red(`       *
      /.\\
     /o..\\
     /..o\\
    /.o..o\\
    /...o.\\
   /..o....\\
   ^^^[_]^^^`)
      );
      figlet("PLANTER", function (err, data) {
        if (err) reject("Something went wrong...");
        console.log(data);
        resolve();
      });
    });
  },
};
