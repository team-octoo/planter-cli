import React from "react";
import {render} from "@testing-library/react-native";
import Example from "../Example";

describe("Rendering", () => {
  test("Example default", () => {
    render(<Example />);
  });
});
