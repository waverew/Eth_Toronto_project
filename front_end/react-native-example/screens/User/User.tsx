import { Button, CheckIcon, Text, VStack } from "native-base";
import { Select } from 'native-base';
import { useState } from "react";
const User = () => {
    let [service, setService] = useState("");

  return (
    <VStack>
      <Text>Select Item</Text>

      <Select selectedValue={service} minWidth="200" accessibilityLabel="Choose Comodity" placeholder="Choose Comodity" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => setService(itemValue)}>
          <Select.Item label="Glass Bottles" value="GB" />
          <Select.Item label="Aluminium Cans" value="AC" />
          <Select.Item label="Electonics" value="E" />
          <Select.Item label="Cardboard" value="CB" />
        </Select>

        <Button>Add Submission</Button>
    </VStack>
  );
};
export default User;
