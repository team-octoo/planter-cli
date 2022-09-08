import {test} from "@japa/runner";
import inquirer from "inquirer";
import sinon from "sinon";
import {detect} from "../../bin/helpers/detect.mjs";
import {docs} from "../../bin/helpers/docs.mjs";
import {files} from "../../bin/helpers/files.mjs";
import {install} from "../../bin/helpers/install.mjs";
import {cocoapods} from "../../bin/reactnative/cocoapods.mjs";
import {fonts} from "../../bin/reactnative/fonts.mjs";
import {reactNativeInit} from "../../bin/reactnative/react-native-init.mjs";

test.group("React Native init", group => {
  // create a sinon sandbox
  const sandbox = sinon.createSandbox();
  // restore the sandbox to its original after each test
  group.each.teardown(() => {
    sandbox.restore();
  });

  test("Initialise", async ({expect}) => {
    let fileOverwriteStub = sandbox.stub(files, "overwriteFile").resolves(true);
    let installDetectStub = sandbox.stub(detect, "installer").resolves("npm");
    let packageDetectStub = sandbox.stub(detect, "packageName").resolves("test");
    let installStub = sandbox.stub(install, "full").resolves();
    let docsStub = sandbox.stub(docs, "writeDocs").resolves("Test docs");
    let cocoaStub = sandbox.stub(cocoapods, "install").resolves("Test cocoapods");
    let fontStub = sandbox.stub(fonts, "install").resolves("Test fonts");

    let inquirerPrompt = sandbox.stub(inquirer, "prompt").resolves({structure: "BEP (recommended)", packages: []});

    //Call functions
    await reactNativeInit.initialise();

    expect(inquirerPrompt.called).toBeTruthy();
    expect(fontStub.calledOnce).toBeTruthy();
    expect(cocoaStub.calledOnce).toBeTruthy();
    expect(docsStub.calledOnce).toBeTruthy();
    expect(installStub.calledOnce).toBeTruthy();
    expect(packageDetectStub.calledOnce).toBeTruthy();
    expect(installDetectStub.calledOnce).toBeTruthy();
    expect(fileOverwriteStub.calledOnce).toBeTruthy();
  });
});
