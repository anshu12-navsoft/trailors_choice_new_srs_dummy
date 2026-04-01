import React from 'react';
import { Dialog, Button, Portal, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const CustomAlert = ({
  visible,
  title,
  message,
  primaryText,
  secondaryText,
  onPrimaryPress,
  onSecondaryPress,
  dismissible = false,
}) => {
  const { t } = useTranslation();
  const resolvedPrimaryText = primaryText ?? t('ok_button');

  const handleDismiss = () => {
    if (dismissible && onSecondaryPress) {
      onSecondaryPress();
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss} dismissable={dismissible}>
        {title ? <Dialog.Title>{title}</Dialog.Title> : null}

        {message ? (
          <Dialog.Content>
            <Text variant="bodyMedium">{message}</Text>
          </Dialog.Content>
        ) : null}

        <Dialog.Actions>
          {secondaryText && (
            <Button onPress={onSecondaryPress}>{secondaryText}</Button>
          )}
          <Button mode="contained" onPress={onPrimaryPress}>
            {resolvedPrimaryText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CustomAlert;
