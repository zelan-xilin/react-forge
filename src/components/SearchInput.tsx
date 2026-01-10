import { Search } from 'lucide-react';
import { useDeferredValue, useEffect, useRef, useState } from 'react';

import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';

interface SearchInputProps extends Omit<React.ComponentProps<'input'>, 'onChange'> {
  onChange?: (value: string) => void;
}
const SearchInput = (props: SearchInputProps) => {
  const { onChange, ...rest } = props;
  const onChangeRef = useRef(onChange);

  const [searchText, setSearchText] = useState('');
  const deferredSearchText = useDeferredValue(searchText);

  useEffect(() => {
    onChangeRef.current?.(deferredSearchText);
  }, [deferredSearchText]);

  return (
    <InputGroup>
      <InputGroupInput onChange={e => setSearchText(e.target.value)} {...rest} />

      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchInput;
