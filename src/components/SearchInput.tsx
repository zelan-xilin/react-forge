import { Search } from 'lucide-react';

import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';

const SearchInput = (props: React.ComponentProps<'input'>) => {
  return (
    <InputGroup>
      <InputGroupInput {...props} />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchInput;
