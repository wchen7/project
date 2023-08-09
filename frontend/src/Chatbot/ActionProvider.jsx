import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleStart = () => {
    const botMessage = createChatBotMessage('To get started, you can begin by creating an account with our system. This will provide more information and features accessible to registered customers which include allowing you to book events that you look, earn points for every booking and subsequently, any reviews you provide after, and lastly, be introduced to our unique live community chats to connect with others who have similar interests as you!')
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  const handlePayment = () => {
    const botMessage = createChatBotMessage('We require you to have a valid Visa or Mastercard for any purchase within Huddle. The security of your transactions is our top priority.')
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  const handleRefund = () => {
    const botMessage = createChatBotMessage('Huddle has a one week refund policy by default, meaning if you cancel your booking a week before the event you will be issued and emailed a full refund.')
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  const handleCancel = () => {
    const botMessage = createChatBotMessage('In the case of an event being cancelled by the host, you will be notified by an email that the event is cancelled and you will be issued a full refund.')
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  const handleSafety = () => {
    const botMessage = createChatBotMessage('Yes, it is completely safe to purchase tickets from our platform. We do not store any payment details unless requested by the customer. Our database is also password protected and backed up to ensure user data safety.')
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  const handleBuying = () => {
    const botMessage = createChatBotMessage('If you are facing difficulties while buying tickets, you can reach out to our customer support team or the host of the event your booking. They are available to assist you and resolve any issues you might be experiencing.')
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  const handleTransfer = () => {
    const botMessage = createChatBotMessage('Huddle does not enforce any ticket transfer preventions. However, each host may have different policy regarding this issue.')
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  const handleDelivery = () => {
    const botMessage = createChatBotMessage('After successful purchase, tickets are typically sent to your registered email as a digital QR code, which can be scanned at the event for entry. You can also log into your Huddle account and open the event page to view your tickets.')
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  const handleLimit = () => {
    const botMessage = createChatBotMessage('Yes, there is a limit. To ensure fair pricing and prevent scalping, we have implemented a policy limiting each account to purchasing a maximum of 5 tickets per event. This policy allows as many people as possible to enjoy the event.')
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  const handleOther = () => {
    const botMessage = createChatBotMessage("Sorry, I didn't catch that. Do you want to know more about payment, refund, cancel, purchase issues, transfer, delivery or limit")
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleStart,
            handleBuying,
            handleCancel,
            handleDelivery,
            handleLimit,
            handleOther,
            handlePayment,
            handleRefund,
            handleSafety,
            handleTransfer
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;