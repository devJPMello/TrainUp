import { cn } from '@/libs/utils';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Check } from '../icons/check';

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof View> {
  label?: string;
  labelClasses?: string;
  checkboxClasses?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

function Checkbox({
  label,
  labelClasses,
  checkboxClasses,
  className,
  checked,
  onChange,
  disabled = false,
  ...props
}: CheckboxProps) {
  const [isChecked, setChecked] = useState(checked || false);

  useEffect(() => {
    if (disabled && isChecked) {
      setChecked(false)
      onChange?.(false);
    }
  }, [disabled])

  const toggleCheckbox = () => {
    if (!disabled) {
      const newChecked = !isChecked;
      setChecked(newChecked);
      onChange?.(newChecked);
    }
  };

  return (
    <View
      className={cn('flex flex-row items-center gap-2', className)}
      {...props}
    >
      <TouchableOpacity onPress={toggleCheckbox} disabled={disabled}>
        <View
          className={cn(
            'size-10 rounded-md flex justify-center items-center',
            {
              'bg-secondary dark:bg-secondary-foreground': !isChecked,
              'bg-primary': isChecked,
            },
            checkboxClasses
          )}
        >
          {!disabled && (
            <Check className={cn(
              'text-muted-foreground',
              { 'dark:text-muted opacity-80': !isChecked },
              { 'text-muted opacity-100': isChecked },
            )} size={16} />
          )}
        </View>
      </TouchableOpacity>
      {label && (
        <Text className={cn('text-primary', labelClasses, { 'opacity-50': disabled })}>{label}</Text>
      )}
    </View>
  );
}

export { Checkbox };
