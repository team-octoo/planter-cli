import {test} from "@japa/runner";
import sinon from "sinon";
import path from "path";
import {reactNativeComponents} from "../../src/reactnative/react-native-component";
import fs from "fs";
import {files} from "../../src/helpers/files";
import inquirer from "inquirer";

test.group("React Native component", group => {
  // create a sinon sandbox
  const sandbox = sinon.createSandbox();
  // restore the sandbox to its original after each test
  group.each.teardown(() => {
    sandbox.restore();
  });

  test("create", async ({expect}) => {
    //these stubs are required so nothing is actually written to the system when tests run
    let copyStub = sandbox.stub(files, "copyFile").returns(true);
    let replaceStub = sandbox.stub(files, "replaceInFiles").returns(true);
    let dirCreateStub = sandbox.stub(files, "directoryExistsOrCreate").resolves(true);
    let fileExistsOrCreateStub = sandbox.stub(files, "fileExistsOrCreate").resolves(true);
    sandbox.stub(fs, "readFileSync").returns(
      JSON.stringify({
        hasTs: false,
        components: {
          basics: {
            component: "src/components/basics/@pascalCase/@pascalCase.@ext",
            style: "src/components/basics/@pascalCase/@pascalCase.@ext",
            test: "src/components/basics/@pascalCase/tests/@pascalCase.@ext",
          },
          elements: {
            component: "src/components/elements/@pascalCase/@pascalCase.@ext",
            style: "src/components/elements/@pascalCase/@pascalCase.@ext",
            test: "src/components/elements/@pascalCase/tests/@pascalCase.@ext",
          },
          pages: {
            component: "src/components/pages/@pascalCase/@pascalCase.@ext",
            style: "src/components/pages/@pascalCase/@pascalCase.@ext",
            test: "src/components/pages/@pascalCase/tests/@pascalCase.@ext",
          },
        },
      })
    );

    let inquirerPrompt = sandbox.stub(inquirer, "prompt").resolves({option: "basics"});

    await reactNativeComponents.create("test", undefined);

    expect(inquirerPrompt.calledOnce).toBeTruthy();
    // expect(fileExistsOrCreateStub.calledOnce).toBeTruthy();
    expect(copyStub.calledThrice).toBeTruthy();
    // expect(replaceStub.calledTwice).toBeTruthy();
    // expect(dirCreateStub.calledTwice).toBeTruthy();
  });
});
