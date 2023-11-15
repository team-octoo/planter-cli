import React from "react";
import {render} from "@testing-library/react-native";
import Example from "../Example";

describe("Rendering", () => {
  test("Render Example", () => {
    render(<Example />);
  });
});
