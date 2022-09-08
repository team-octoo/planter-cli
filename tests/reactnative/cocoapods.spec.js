import { test } from "@japa/runner";
import sinon from "sinon";
import { cocoapods } from "../../bin/reactnative/cocoapods.mjs";
import child_process from "child_process";

test.group("Cocoapods", (group) => {
  // create a sinon sandbox
  const sandbox = sinon.createSandbox();
  // restore the sandbox to its original after each test
  group.each.teardown(() => {
    sandbox.restore();
  });

  test("Copy file", async ({ expect }) => {
    let execSyncStub = sandbox.stub(child_process, "execSync").callsFake(function (cmd, options) {
      return cmd;
    });
    await cocoapods.install();
    expect(execSyncStub.calledOnce).toBeTruthy();
  });
});
