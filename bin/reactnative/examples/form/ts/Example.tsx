import {yupResolver} from "@hookform/resolvers/yup";
import React, {FC} from "react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {Button, TextInput, View, ViewProps} from "react-native";
import {styles} from "./Example.style";
import * as yup from "yup";

interface ExampleProps {
  onSubmit?: SubmitHandler<{}>;
}

const Example: FC<ViewProps & ExampleProps> = ({
  onSubmit = (data: Object) => console.log(JSON.stringify(data)),
  ...props
}) => {
  const schema = yup.object({field1: yup.string().required()}).required();
  const resolver = yupResolver(schema);
  const {control, handleSubmit} = useForm({
    resolver: resolver,
  });
  return (
    <View>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}, formState: {}}) => {
          return (
            <TextInput
              style={{
                backgroundColor: "#FFF",
                borderColor: "#3D3D3D",
                borderWidth: 1,
                margin: 8,
                borderRadius: 4,
                height: 48,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          );
        }}
        name={"field1"}
      />
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default Example;
