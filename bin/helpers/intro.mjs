import clear from "clear";
import figlet from "figlet";

export const intro = {
  play: () => {
    return new Promise((resolve, reject) => {
      clear();
      figlet("PLANTER", function (err, data) {
        if (err) {
          // console.log("Something went wrong...");
          // console.dir(err);
          reject("Something went wrong...");
        }
        console.log(data);
        resolve();
      });
    });
  },
};
