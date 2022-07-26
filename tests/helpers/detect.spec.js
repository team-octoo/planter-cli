import { test } from "@japa/runner";
import { detect } from "../../bin/helpers/detect.mjs";
import { files } from "../../bin/helpers/files.mjs";
import sinon from "sinon";
import fs from "fs";

test.group("Config detect", (group) => {
  const sandbox = sinon.createSandbox();
  group.each.teardown(() => {
    sandbox.restore();
  });

  test("Non-forced", async ({ expect }) => {
    const detected = await detect.config();
    expect(detected).toBeTruthy();
  });

  test("Forced", async ({ expect }) => {
    const consoleSpy = sandbox.spy(console, "log");
    sandbox.stub(files, "directoryExists").resolves(true);

    const detected = await detect.config(true);
    expect(detected).toBeTruthy();
    expect(consoleSpy.calledOnce).toBeTruthy();
  });

  test("Non-forced with config file", async ({ expect }) => {
    sandbox.stub(files, "directoryExists").resolves(true);

    await expect(detect.config()).rejects.toEqual("Planter config file detected... use --force option.");
  });

  // USE THIS AS A BLUEPRINT TO FAKE FS CALLS IN TESTS
  test("Fake test to stub fs module", async ({ expect }) => {
    var writeFileStub = sandbox.stub(fs, "writeFile").callsFake(function (path, data, cb) {
      return cb(null);
    });

    expect(writeFileStub.calledOnce).toBeFalsy();
  });
});
