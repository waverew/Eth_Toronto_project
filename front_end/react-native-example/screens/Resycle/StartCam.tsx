import { VStack, Text, Input } from "native-base";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";



const StartCam = () => {
  const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Aluminum', value: 'aluminum'},
      {label: 'Plastic', value: 'plastic'}
    ]);
    return (
    <VStack space="1">
        <Text>
            Select what you want to gather
        </Text>
        <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
        
    </VStack>
    )
}

export default StartCam;