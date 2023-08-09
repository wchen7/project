import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    const keyword = message.toLowerCase();
    if (keyword.includes('payment')) {
      actions.handlePayment();
    } else if (keyword.includes('refund')) {
      actions.handleRefund();
    } else if (keyword.includes('cancel')) {
      actions.handleCancel();
    } else if (keyword.includes('purchase issues')) {
      actions.handleBuying();
    } else if (keyword.includes('transfer')) {
      actions.handleTransfer();
    } else if (keyword.includes('delivery')) {
      actions.handleDelivery();
    } else if (keyword.includes('limit')) {
      actions.handleLimit();
    } else if (keyword.includes('getting started')) {
      actions.handleStart();
    } else {
      actions.handleOther();
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;