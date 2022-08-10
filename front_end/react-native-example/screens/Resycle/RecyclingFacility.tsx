import { VStack, Text, Input, Button } from "native-base";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

const RecyclingFacility = () =>{
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([
      {label: 'Aluminum', value: 'aluminum'},
      {label: 'Plastic', value: 'plastic'},
      {label: 'Paper', value:'paper'},
      {label: 'Batteries', value:'batteries'},
      {label: 'Electronics', value:'electronics'},
      {label: 'Steel', value:'steel'},
      {label: 'Iron', value:'iron'}
    ]);
    return (
        <VStack space="4">
        <Text> Recycling Facility</Text>
        <Text>
            Select what you want to gather
        </Text>
        <Input>

        </Input>
        <DropDownPicker
        multiple={true}
        min={0}
        max={7}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
      <Button>
        Submit
      </Button>
        </VStack>
        
    )
}




export default RecyclingFacility;