import {test} from "@japa/runner";
import sinon from "sinon";
import {files} from "../../bin/helpers/files.mjs";
import {fonts} from "../../bin/reactnative/fonts.mjs";

test.group("Fonts", group => {
  // create a sinon sandbox
  const sandbox = sinon.createSandbox();
  // restore the sandbox to its original after each test
  group.each.teardown(() => {
    sandbox.restore();
  });

  test("Copy file", async ({expect}) => {
    sandbox.stub(files, "copyFolder").resolves(true);
    const detected = await fonts.install();
    expect(detected).toBeTruthy();
  });
});
