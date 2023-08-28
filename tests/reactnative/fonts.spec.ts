import {test} from "@japa/runner";
import sinon from "sinon";
import {files} from "../../src/helpers/files";
import {fonts} from "../../src/reactnative/fonts";

test.group("Fonts", group => {
  // create a sinon sandbox
  const sandbox = sinon.createSandbox();
  // restore the sandbox to its original after each test
  group.each.teardown(() => {
    sandbox.restore();
  });

  test("Copy file", async ({expect}) => {
    sandbox.stub(files, "copyFile").resolves(true);
    const detected = await fonts.install();
    expect(detected).toBeTruthy();
  });
});
