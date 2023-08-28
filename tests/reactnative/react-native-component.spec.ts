import {test} from "@japa/runner";
import sinon from "sinon";
import path from "path";
import {
  getRNSourcePath,
  getRNDestPath,
  getRNFolders,
  createRNComponent,
  createRNTests,
  createRNLayout,
  reactNativeComponents,
} from "../../src/reactnative/react-native-component";
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

  test("getRNDestPath", async ({expect}) => {
    const RNDestPath = getRNDestPath();
    expect(RNDestPath).toContain(process.cwd());
  });

  test("getRNSourcePath", async ({expect}) => {
    // sandbox.stub(files, "copyFolder").resolves(true);
    const RNSourcePath = getRNSourcePath();
    expect(RNSourcePath).toContain(path.join("reactnative", "examples", "component"));
  });

  test("getRNFolders", async ({expect}) => {
    sandbox.stub(fs, "readFileSync").returns(
      JSON.stringify({
        components: {
          basics: "folder",
          elements: "folder",
          pages: "folder",
        },
      })
    );
    const folders = getRNFolders();
    expect(folders).toEqual(["basics", "elements", "pages"]);
  });

  test("createRNComponent with ts", async ({expect}) => {
    sandbox.stub(fs, "readFileSync").returns(
      JSON.stringify({
        hasTs: true,
      })
    );

    let copyStub = sandbox.stub(files, "copyFile").returns(true);
    let replaceStub = sandbox.stub(files, "replaceInFiles").returns(true);

    createRNComponent(process.cwd() + "components/test", "test");

    expect(copyStub.calledOnce).toBeTruthy();
    expect(replaceStub.calledOnce).toBeTruthy();
  });

  test("createRNComponent no ts", async ({expect}) => {
    sandbox.stub(fs, "readFileSync").returns(
      JSON.stringify({
        hasTs: false,
      })
    );

    let copyStub = sandbox.stub(files, "copyFile").returns(true);
    let replaceStub = sandbox.stub(files, "replaceInFiles").returns(true);

    createRNComponent(process.cwd() + "components/test", "test");

    expect(copyStub.calledOnce).toBeTruthy();
    expect(replaceStub.calledOnce).toBeTruthy();
  });

  test("createRNTests", async ({expect}) => {
    let copyStub = sandbox.stub(files, "copyFile").returns(true);
    let replaceStub = sandbox.stub(files, "replaceInFiles").returns(true);

    createRNTests(process.cwd() + "components/test", "test");

    expect(copyStub.calledOnce).toBeTruthy();
    expect(replaceStub.calledOnce).toBeTruthy();
  });

  test("createRNLayout", async ({expect}) => {
    let copyStub = sandbox.stub(files, "copyFile").returns(true);

    createRNLayout(process.cwd() + "components/test", "test");

    expect(copyStub.calledOnce).toBeTruthy();
  });

  test("create", async ({expect}) => {
    let copyStub = sandbox.stub(files, "copyFile").returns(true);
    let replaceStub = sandbox.stub(files, "replaceInFiles").returns(true);
    let dirCreateStub = sandbox.stub(files, "directoryExistsOrCreate").resolves(true);
    sandbox.stub(fs, "readFileSync").returns(
      JSON.stringify({
        hasTs: false,
        components: {
          basics: "folder",
          elements: "folder",
          pages: "folder",
        },
      })
    );

    let inquirerPrompt = sandbox.stub(inquirer, "prompt").resolves({option: "basics"});

    await reactNativeComponents.create("test");

    expect(inquirerPrompt.calledOnce).toBeTruthy();
    expect(copyStub.calledThrice).toBeTruthy();
    expect(replaceStub.calledTwice).toBeTruthy();
    expect(dirCreateStub.calledTwice).toBeTruthy();
  });
});
