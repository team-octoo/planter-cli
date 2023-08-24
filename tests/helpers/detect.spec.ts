import {test} from "@japa/runner";
import {detect} from "../../bin/helpers/detect";
import {files} from "../../bin/helpers/files";
import sinon from "sinon";
import fs from "fs";
import path from "path";

test.group("Config detect", group => {
  // create a sinon sandbox
  const sandbox = sinon.createSandbox();
  // restore the sandbox to its original after each test
  group.each.teardown(() => {
    sandbox.restore();
  });

  test("Non-forced", async ({expect}) => {
    const detected = await detect.config();
    expect(detected).toBeTruthy();
  });

  test("Forced", async ({expect}) => {
    const consoleSpy = sandbox.spy(console, "log");
    sandbox.stub(files, "directoryExists").resolves(true);

    const detected = await detect.config(true);
    expect(detected).toBeTruthy();
    expect(consoleSpy.calledOnce).toBeTruthy();
  });

  test("Non-forced with config file", async ({expect}) => {
    sandbox.stub(files, "directoryExists").resolves(true);

    await expect(detect.config()).rejects.toEqual("Planter config file detected... use --force option.");
  });

  // USE THIS AS A BLUEPRINT TO FAKE FS CALLS IN TESTS
  test("Fake test to stub fs module", async ({expect}) => {
    var writeFileStub = sandbox.stub(fs, "writeFileSync").callsFake(function (path, data, cb) {
      return path;
    });
    fs.writeFileSync(path.join(process.cwd(), "README.md"), "Autocreated by planter. You may delete this file.");

    expect(writeFileStub.calledOnce).toBeTruthy();
  });
});
